import { getUsersList } from '../../../services/usersService';
import { getMappedParticipantsForLC, getParticipants, getMappedLCsForSupervisor } from '../../../services/assignUsersService';

export type LCItem = {
  id: string;
  name: string;
  site: string;
  province: string;
  participants: any[];
  participantIds: string[];
  count: number;
};

const CACHE_TTL_MS = 30_000;
const CONCURRENCY = 3;
let cache: { key: string; at: number; promise: Promise<LCItem[]> } | null = null;

/** Run `fn` over `items` with at most `limit` requests in flight (avoids 429 bursts). */
const mapWithLimit = async <T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> => {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
};

const fetchLinkageChampions = async (programId: string, supervisorId?: string): Promise<LCItem[]> => {
  let lcRows: any[];
  if (supervisorId) {
    // Supervisor / tenant admin: only the LCs mapped to them (same call Assign Users makes)
    const mapped = await getMappedLCsForSupervisor({
      userId: supervisorId,
      programId,
      type: 'org_admin',
      page: 1,
      limit: 500,
    });
    lcRows = (mapped.result?.data || []).map((r: any) => ({
      ...r,
      id: r.userId || r.userDetails?.id,
      name: r.name || r.userDetails?.name,
    }));
  } else {
    // Same call User Management makes for All Roles -> Linkage Champion
    const lcResponse = await getUsersList({
      tenant_code: 'brac',
      type: 'org_admin',
      role: 'org_admin',
      page: 1,
      limit: 100,
    });
    lcRows = lcResponse.result?.data || [];
  }

  // Program-level assigned count per LC (same source as User Management: overview.assigned)
  const assignedByLc = new Map<string, number>();
  try {
    const programRes = await getParticipants(programId, {
      excludeMapped: false,
      limit: Math.max(lcRows.length, 100),
      userIds: lcRows.map((lc) => lc.id).filter(Boolean),
      searchType: 'org_admin',
    });
    (programRes.result?.data || []).forEach((row: any) => {
      const key = String(row.userId ?? row.userDetails?.id ?? row.id ?? '');
      if (key) assignedByLc.set(key, Number(row.overview?.assigned ?? 0));
    });
  } catch (e) {
    console.warn('Could not load program-level LC assigned counts', e);
  }

  const list = await mapWithLimit(lcRows, CONCURRENCY, async (lc: any): Promise<LCItem> => {
    const id = String(lc.id || '');
    let res: any = {};
    try {
      res = await getMappedParticipantsForLC({
        userId: id,
        programId,
        type: 'user',
        page: 1,
        limit: 500,
        search: '',
      });
    } catch (e) {
      console.warn(`Could not load participants mapped to LC ${id}`, e);
    }
    const rows: any[] = res.result?.data || [];
    const participantIds = rows
      .map((r: any) => String(r.userId || r.userDetails?.id || ''))
      .filter(Boolean);
    return {
      id,
      name: lc.name || lc.full_name || lc.email || '',
      site:
        lc.site?.label ||
        lc.userDetails?.site?.label ||
        lc.userDetails?.district?.label ||
        lc.userDetails?.local_municipality?.label ||
        '',
      province: lc.province?.label || lc.userDetails?.province?.label || '',
      participants: rows,
      participantIds,
      count:
        participantIds.length > 0
          ? res.total ?? res.result?.total ?? res.result?.count ?? participantIds.length
          : assignedByLc.get(id) ?? 0,
    };
  });
  return list.filter((lc) => lc.id);
};

/** Shared, de-duplicated LC loader: both Reassign steps reuse one set of requests. */
export const loadLinkageChampions = (programId: string, supervisorId?: string): Promise<LCItem[]> => {
  const now = Date.now();
  const key = `${programId}|${supervisorId || ''}`;
  if (cache && cache.key === key && now - cache.at < CACHE_TTL_MS) return cache.promise;
  const promise = fetchLinkageChampions(programId, supervisorId);
  cache = { key, at: now, promise };
  promise.catch(() => {
    if (cache?.promise === promise) cache = null;
  });
  return promise;
};
