import { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { useProjectContext } from '../../../../context/ProjectContext';
import { fetchMenteeSessionIds } from './useTaskSessionStatus';
import { TASK_STATUS, CUSTOM_IDP_TASK } from '../../../../../constants/app.constant';
import type { Task } from '../../../../types/project.types';


// Session category -> candidate pillars (projectTemplateDetails.externalId). A project only has one of
// the two livelihood pillars (Entrepreneurship or Employment IDP), so the first candidate present wins.
// Categories not listed here fall back to their upper-cased name.
const CATEGORY_TO_TEMPLATE_IDS: Record<string, string[]> = {
  social_empowerment: ['SOCIAL_EMPOWERMENT'],
  livelihoods: ['LIVELIHOOD_ENTREPRENEURSHIP', 'LIVELIHOOD_EMPLOYMENT'],
  immediate_attention: ['SOCIAL_PROTECTION'],
  special_attention: ['SOCIAL_PROTECTION'],
  financial_inclusion: ['FINANCIAL_INCLUSION'],
};

// Main (pillar-level) session categories; a session's `categories` may also carry sub-categories.
const SESSION_CATEGORIES = ["social_empowerment", "livelihoods", "immediate_attention", "special_attention", "financial_inclusion", "asset"];

const unwrap = (v: any): string =>
  String(v?.externalId ?? v?.value ?? v?.id ?? v ?? '').trim();

const sessionIdOf = (s: any) => String(s?.id ?? s?.session_id ?? s?.sessionId);

const pillarsOf = (data: any): Task[] => data?.tasks?.length ? data.tasks : [];
const tasksOf = (pillar: Task): Task[] => pillar.children || [];

const idpTasksOf = (s:any) => s?.idp_tasks ?? s?.meta?.idp_tasks ?? [];

const templateIdsFor = (session: any): string[] => {
  const category = ([] as any[])
    .concat(session?.categories ?? [])
    .map((c) => unwrap(c).toLowerCase())
    .find((c) => SESSION_CATEGORIES.includes(c));
  return category ? CATEGORY_TO_TEMPLATE_IDS[category] ?? [category.toUpperCase()] : [];
};

/**
 * Maps the participant's upcoming (scheduled) sessions onto IDP tasks, writing
 * metaInformation.sessionId / sessionDetails {name, status} so that AttendedSessionTaskSync can pick
 * them up later.
 *
 * - idp_tasks entry matches task.externalId: that task is mapped. If it is already completed or
 *   already carries a different session, a custom task is created in the same pillar instead.
 * - idp_tasks is 'custom': a custom task is created in the pillar whose
 *   projectTemplateDetails.externalId equals the session category (upper case).
 * - an idp_tasks entry that matches no task in the project: a custom task is created in the pillar for
 *   the session category (CATEGORY_TO_TEMPLATE_IDS), e.g. SOCIAL_PROTECTION for special/immediate attention.
 * - Custom tasks are only ever added to pillars that are not completed.
 * Runs once, as soon as the project has loaded, and returns true when it has finished (or had nothing
 * to do) so the caller can hold back rendering the task cards until then.
 */
export function useSessionTaskMapper(): boolean {
  const { projectData, updateTasks, addTask, mode, config } = useProjectContext();
  const routeId = (useRoute().params as any)?.id;
  // The mentoring service knows the participant by their user id, not the route (entity) id.
  const participantId = config?.profileInfo?.userId ?? routeId;
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  useEffect(() => {
    if (startedRef.current || config?.isLoading === true || !projectData) return;
    startedRef.current = true;

    const pillars = pillarsOf(projectData);
    if (mode !== 'edit' || !participantId || pillars.length === 0) {
      setReady(true);
      return;
    }

    (async () => {
      try {
        const { upcomingSessions, attended, missed } = await fetchMenteeSessionIds(String(participantId));
        if (upcomingSessions.length === 0) return;
        const attempted = new Set<string>();

        const upcomingIds = new Set(upcomingSessions.map(sessionIdOf));
        const mappedSessionIds = new Set<string>();
        pillars.forEach((p) =>
          tasksOf(p).forEach((t) => {
            const sid = t.metaInformation?.sessionId;
            if (sid !== undefined && sid !== null) 
              mappedSessionIds.add(String(sid));
          }),
        );

        // Tasks given a session earlier in this same pass; a further session for one becomes a custom task.
        const claimedTaskIds = new Set<string>();
        const updates: { taskId: string; updates: Partial<Task> }[] = [];
        const customTasks: { pillar: Task; task: Task }[] = [];

        upcomingSessions.forEach((session) => {
          const sid = sessionIdOf(session);
          if (mappedSessionIds.has(sid)) { return };
          const name = session?.title ?? session?.name;
          const supportOfferingType = session?.support_offering_type ?? session?.meta?.support_offering_type;
          const sessionMeta = {
            sessionId: session?.id ?? sid,
            ...(supportOfferingType ? { support_offering_type: supportOfferingType } : {}),
            sessionDetails: {
              name,
              status: session?.status,
              mentorId: session?.mentor_id,
              mentorName: session?.mentor_name,
            },
          };
          const key = (suffix: string) => `${sid}:${suffix}`;

          const addCustom = (pillar: Task | undefined, suffix: string) => {
            if (!pillar || pillar.status === TASK_STATUS.COMPLETED || attempted.has(key(suffix))) return;
            attempted.add(key(suffix));
            customTasks.push({
              pillar,
              task: {
                _id: uuidv4(),
                name,
                type: 'simple',
                externalId: uuidv4(),
                status: TASK_STATUS.TO_DO,
                isCustomTask: true,
                parentId: pillar._id,
                metaInformation: sessionMeta,
              } as Task,
            });
          };

          // Pillar for the session's category (via CATEGORY_TO_TEMPLATE_IDS); home for custom tasks.
          const categoryPillar = () => {
            const pillarTemplateId = (p: any) => String(p.projectTemplateDetails?.externalId ?? '').toUpperCase();
            return templateIdsFor(session).map((id) => pillars.find((p) => pillarTemplateId(p) === id)).find(Boolean);
          };

          const idpTasks: string[] = [].concat(idpTasksOf(session)).map(unwrap).filter(Boolean);
          if (idpTasks[0] === CUSTOM_IDP_TASK) {
            addCustom(categoryPillar(), 'custom');
            return;
          }
          // idp_tasks not present in the project (e.g. SP_TASK_8 / SE_TASK_12 not in this IDP): one custom
          // task in the session's category pillar instead.
          const projectTaskIds = new Set(pillars.flatMap((p) => tasksOf(p).map((t) => t.externalId)));
          if (idpTasks.some((id) => !projectTaskIds.has(id))) addCustom(categoryPillar(), 'missing');
          if (__DEV__) console.log('[SessionTaskMapper] session', sid, { idp_tasks: idpTasksOf(session), categories: session?.categories });
          idpTasks.forEach((externalId) => {
            pillars.forEach((pillar) =>
              tasksOf(pillar)
                .filter((t) => t.externalId === externalId)
                .forEach((task) => {
                  if (attempted.has(key(task._id))) return;
                  const existing = task.metaInformation?.sessionId;
                  const hasOther = existing !== undefined && existing !== null && String(existing) !== sid;
                  // A task already tied to another session: attended or still scheduled keeps it (the new
                  // session becomes a custom task); a missed session is replaced. A session in no list
                  // is a stale mapping and is replaced too.
                  const taken = claimedTaskIds.has(task._id) || (hasOther && !missed.has(String(existing)) && (
                    attended.has(String(existing)) || upcomingIds.has(String(existing))
                  ) );
                  if (__DEV__) console.log('[SessionTaskMapper] match', externalId, { task: task._id, status: task.status, existing, taken });
                  if (task.status === TASK_STATUS.COMPLETED || taken) {
                    addCustom(pillar, `custom:${task._id}`);
                    return;
                  }
                  attempted.add(key(task._id));
                  claimedTaskIds.add(task._id);
                  updates.push({
                    taskId: task._id,
                    updates: { metaInformation: { ...task.metaInformation, ...sessionMeta } },
                  });
                }),
            );
          });
        });

        if (__DEV__) console.log('[SessionTaskMapper] planned', { updates: updates.length, customTasks: customTasks.length });
        if (updates.length === 0 && customTasks.length === 0) return;
        const entityId = (projectData as any)?.entityInformation?.externalId ?? routeId;
        if (updates.length) await updateTasks(updates, entityId);
        for (const { pillar, task } of customTasks) await addTask(pillar._id, task);
      } catch (e) {
        if (__DEV__) console.log('[SessionTaskMapper] failed', e);
      } finally {
        if (mountedRef.current) setReady(true);
      }
    })();
  }, [mode, participantId, projectData, config?.isLoading, updateTasks, addTask, routeId]);

  return ready;
}
