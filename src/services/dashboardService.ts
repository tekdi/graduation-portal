/**
 * Dashboard Service
 * ──────────────────────────────────────────────────────────────────────────────
 * Fetches live data from the snapshot-service and maps each API response into
 * a CardViewData overlay.  The overlay is merged with the static cardViewDataMap
 * template in useDashboardCardData, so labels, colours and chart styles are
 * preserved while only numeric values / data arrays are replaced.
 */

import snapshotApi from './snapshotApi';
import { SNAPSHOT_ENDPOINTS } from './apiEndpoints';
import type { CardViewData } from '@constants/ADMIN_DASHBOARD_CARDS';
import type {
  DashboardGraphReportSectionBlock,
} from '@app-types/dashboardGraphs';
import i18n from '../config/i18n';

// ─── Filter shape accepted by all endpoints ───────────────────────────────────
export interface DashboardFilters {
  fromDate?: string;
  toDate?: string;
  province?: string;
  district?: string;
  gender?: string;
  lcId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a 0-1 rate as a percentage string e.g. 0.96 → "96%" */
const fmtPct = (rate: number) => `${Math.round(rate * 100)}%`;

/** Format number with locale separator e.g. 2718 → "2,718" */
const fmtNum = (n: number) => n.toLocaleString();

/**
 * Convert a YYYY-MM period string to a 3-letter month abbreviation.
 * "2026-02" → "Feb"  |  "2026-02-midline" → "Feb-M"
 */
const shortMonth = (period: string): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = period.split('-');
  const monthIdx = parseInt(parts[1], 10) - 1;
  const label = monthNames[monthIdx] ?? period;
  return parts[2] ? `${label}-${parts[2].slice(0, 1).toUpperCase()}` : label;
};

/** Colours used for the by-reason breakdown rows (cycles if > 7 reasons). */
const REASON_COLORS = [
  '#EF4444', '#F59E0B', '#8B5CF6',
  '#22C55E', '#3B82F6', '#EC4899', '#94A3B8',
];

/** Colours used for the graduation criteria breakdown rows. */
const CRITERIA_COLORS = [
  '#3B82F6', '#16A34A', '#F59E0B', '#8B5CF6',
  '#EF4444', '#EC4899', '#22C55E',
];

// ─── API Response types ───────────────────────────────────────────────────────

interface ParticipantEnrollmentResponse {
  kpis: {
    assigned:         { count: number };
    contacted:        { count: number; rate: number };
    consentAndProfiled: { count: number; rate: number };  // ONBOARD_1 completed
    hhProfile:        { count: number; rate: number };  // ONBOARD_2 completed
    SLAwithPlans:              { count: number; rate: number };  // ONBOARD_3 completed
    interventionPlan: { count: number; rate: number };  // programUsers.status=IN_PROGRESS
  };
  trends: {
    assignment:           Array<{ count: number; month: string }>;
    contactRate:          Array<{ month: string; contacted: number; rate: number }>;
    consentRate:          Array<{ month: string; count: number; rate: number }>;
    hhProfileRate:        Array<{ month: string; count: number; rate: number }>;
    slaRate:              Array<{ month: string; count: number; rate: number }>;
    interventionPlanRate: Array<{ month: string; count: number; rate: number }>;
    SLAwithPlansRate:    Array<{ month: string; count: number; rate: number }>;
    consentAndProfiledRate: Array<{ month: string; count: number; rate: number }>;
  };
}

interface DropOutsResponse {
  kpis: { total: number; dropoutRate: number };
  byReason: Array<{ reason: string; count: number; percentage: string }>;
  trends: {
    monthly:    Array<{ month: string; [reason: string]: any }>;
    cumulative: Array<{ month: string; count: number }>;
  };
  dataNote?: string;
}

interface CriteriaEntry {
  met: number;
  pending: number;
  total: number;
  rate: number;
}

interface OutcomeCardResponse {
  cardId: string;
  pillar: string;
  individual: boolean;
  dataAvailability: 'full' | 'criteria_only' | 'no_data';
  overall: { total: number; eligible: number; rate: number };
  criteria: Record<string, CriteriaEntry>;
  totalParticipants: number;
  trend: Array<Record<string, any>>;
  dataNote?: string;
}

// ─── Deep-clone a CardViewData so we never mutate the static constants ────────
const cloneCardView = (cv: CardViewData): CardViewData =>
  JSON.parse(JSON.stringify(cv)) as CardViewData;

// ─── Participant Enrollment ───────────────────────────────────────────────────

export async function getParticipantEnrollmentData(
  filters?: DashboardFilters,
): Promise<ParticipantEnrollmentResponse> {
  const res = await snapshotApi.get<ParticipantEnrollmentResponse>(
    SNAPSHOT_ENDPOINTS.PARTICIPANT_ENROLLMENT,
    { params: filters ?? {} },
  );
  return res.data;
}

export function mapParticipantEnrollment(
  apiData: ParticipantEnrollmentResponse,
  staticView: CardViewData,
): CardViewData {
  const cv = cloneCardView(staticView);
  const { kpis, trends } = apiData;
  const assigned = kpis.assigned.count;

  // ── Metric cards ────────────────────────────────────────────────────────────
  // metricCards order: [assigned, contacted, consented, hhProfile, sla, interventionPlan]
  const mc = cv.metricCards;
  if (mc[0]) {
    mc[0].value = fmtNum(assigned);
  }
  if (mc[1]) {
    mc[1].value = fmtPct(kpis.contacted.rate);
    mc[1].count = fmtNum(kpis.contacted.count);
  }
  if (mc[2]) {
    mc[2].value = fmtPct(kpis.consentAndProfiled.rate);
    mc[2].count = fmtNum(kpis.consentAndProfiled.count);
  }
  if (mc[3]) {
    mc[3].value = fmtPct(kpis.SLAwithPlans.rate);
    mc[3].count = fmtNum(kpis.SLAwithPlans.count);
  }

  // ── Key Insights ─────────────────────────────────────────────────────────────
  cv.insightsItems = [
    i18n.t('admin.participantEnrollment.insights.assigned', { assigned: fmtNum(assigned), assignedPlural: assigned !== 1 ? 's' : '' }),
    i18n.t('admin.participantEnrollment.insights.contacted', { contactedRate: fmtPct(kpis.contacted.rate), contactedCount: fmtNum(kpis.contacted.count), contactedPlural: kpis.contacted.count !== 1 ? 's' : '' }),
    i18n.t('admin.participantEnrollment.insights.consent', { consentedRate: fmtPct(kpis.consentAndProfiled.rate), consentedCount: fmtNum(kpis.consentAndProfiled.count) }),
    i18n.t('admin.participantEnrollment.insights.sla', { slaRate: fmtPct(kpis.SLAwithPlans.rate), slaCount: fmtNum(kpis.SLAwithPlans.count), assigned: fmtNum(assigned) }),
  ];

  // ── Graph blocks ─────────────────────────────────────────────────────────────
  if (!cv.graphsBlocks) return cv;

  cv.graphsBlocks.forEach(block => {
    if (block.kind !== 'reportSection') return;
    const sec = block as DashboardGraphReportSectionBlock;

    switch (sec.id) {
      case 'pe-1-1': {
        // Assignment and Contact trends — participants per month
        const notContacted = assigned - kpis.contacted.count;
        if (sec.statCards?.[0]) {
          sec.statCards[0].value    = fmtNum(assigned);
          sec.statCards[0].subtitle = 'Prospective participants assigned';
        }
        if (sec.statCards?.[1]) {
          sec.statCards[1].value    = fmtNum(kpis.contacted.count);
          sec.statCards[1].subtitle = `Out of ${fmtNum(assigned)} assigned`;
        }
         if (sec.statCards?.[2]) {
          sec.statCards[2].value    = fmtNum(notContacted);
          sec.statCards[2].subtitle = notContacted === 0 ? 'All contacted' : 'Pending outreach';
        }
         if (sec.statCards?.[3]) {
          sec.statCards[3].value = fmtPct(kpis.contacted.rate);
        }
        // Change to multiLine chart with both series
        if (sec.chart) {
          sec.chart = {
            kind: 'multiLine',
            title: 'Targetting Trend Over Time',
            multiLine: {
              series: [
                {
                  id: 'assigned',
                  label: 'Assigned',
                  color: '#3B82F6', // blue
                  data: trends.assignment.map(r => ({
                    x: shortMonth(r.month),
                    y: r.count,
                  })),
                },
                {
                  id: 'contacted',
                  label: 'Contacted',
                  color: '#10B981', // green
                  data: trends.contactRate.map(r => ({
                    x: shortMonth(r.month),
                    y: r.contacted,
                  })),
                },
              ],
            },
          };
        }
        break;
      }
      case 'pe-1-2': {
        // Contact rate — participants with ≥1 Log Visit
        const notContacted = assigned - kpis.contacted.count;
        if (sec.statCards?.[0]) {
          sec.statCards[0].value    = fmtNum(kpis.contacted.count);
          sec.statCards[0].subtitle = `Out of ${fmtNum(assigned)} assigned`;
        }
        if (sec.statCards?.[1]) {
          sec.statCards[1].value = fmtPct(kpis.contacted.rate);
        }
        if (sec.statCards?.[2]) {
          sec.statCards[2].value    = fmtNum(notContacted);
          sec.statCards[2].subtitle = notContacted === 0 ? 'All contacted' : 'Pending outreach';
        }
        if (sec.chart?.line) {
          sec.chart.line.data = trends.contactRate.map(r => ({
            month: shortMonth(r.month),
            value: Math.round(r.rate * 100),
          }));
        }
        break;
      }
      case 'pe-1-3': {
        const noPlan = assigned - kpis.interventionPlan.count;
        // Consent rate — ONBOARD_1 task completed
        if (sec.statCards?.[0]) {
          sec.statCards[0].value    = fmtNum(assigned);
        }
        if (sec.statCards?.[1]) {
          sec.statCards[1].value    = fmtNum(kpis.consentAndProfiled.count);
          sec.statCards[1].subtitle = `Out of ${fmtNum(assigned)} assigned (${fmtPct(kpis.consentAndProfiled.rate)})`;
        }
        if (sec.statCards?.[2]) {
          sec.statCards[2].value    = fmtNum(kpis.SLAwithPlans.count);
          sec.statCards[2].subtitle = `Out of ${fmtNum(assigned)} assigned (${fmtPct(kpis.SLAwithPlans.rate)})`;
        }
         if (sec.statCards?.[3]) {
          sec.statCards[3].value    = fmtNum(noPlan);
          sec.statCards[3].subtitle = noPlan === 0 ? 'All have plans' : 'Awaiting plan creation';
        }
       if (sec.chart) {
          sec.chart = {
            kind: 'multiLine',
            title: 'Profiling and Onboarding Trend Over Time',
            multiLine: {
              series: [
                {
                  id: 'consentAndProfiled',
                  label: 'Consent + Profiled',
                  color: '#3B82F6', // blue
                  data: trends.consentAndProfiledRate.map(r => ({
                    x: shortMonth(r.month),
                    y: r.count,
                  })),
                },
                {
                  id: 'slaWithPlans',
                  label: 'SLA + Intervention Plans',
                  color: '#10B981', // green
                  data: trends.SLAwithPlansRate.map(r => ({
                    x: shortMonth(r.month),
                    y: r.count,
                  })),
                },
              ],
            },
          };
        }
        break;
      }
      case 'pe-1-4': {
        // SLA rate — ONBOARD_3 task completed
        const slaNotSigned = assigned - kpis.sla.count;
        if (sec.statCards?.[0]) {
          sec.statCards[0].value    = fmtNum(kpis.sla.count);
          sec.statCards[0].subtitle = 'SLAs signed';
        }
        if (sec.statCards?.[1]) {
          sec.statCards[1].value = fmtPct(kpis.sla.rate);
        }
        if (sec.statCards?.[2]) {
          sec.statCards[2].value    = fmtNum(slaNotSigned);
          sec.statCards[2].subtitle = slaNotSigned === 0 ? 'All completed' : 'Pending SLA';
        }
        if (sec.chart?.line) {
          sec.chart.line.data = trends.slaRate.map(r => ({
            month: shortMonth(r.month),
            value: Math.round(r.rate * 100),
          }));
        }
        break;
      }
      case 'pe-1-5': {
        // HH Profile rate — ONBOARD_2 task completed
        const notProfiled = assigned - kpis.hhProfile.count;
        if (sec.statCards?.[0]) {
          sec.statCards[0].value    = fmtNum(kpis.hhProfile.count);
          sec.statCards[0].subtitle = `Out of ${fmtNum(assigned)} assigned`;
        }
        if (sec.statCards?.[1]) {
          sec.statCards[1].value = fmtPct(kpis.hhProfile.rate);
        }
        if (sec.statCards?.[2]) {
          sec.statCards[2].value    = fmtNum(notProfiled);
          sec.statCards[2].subtitle = notProfiled === 0 ? 'All profiled' : 'Pending HH profile';
        }
        if (sec.chart?.line) {
          sec.chart.line.data = trends.hhProfileRate.map(r => ({
            month: shortMonth(r.month),
            value: Math.round(r.rate * 100),
          }));
        }
        break;
      }
      case 'pe-1-6': {
        // Intervention Plan rate — programUsers.status = IN_PROGRESS
        const noPlan = assigned - kpis.interventionPlan.count;
        if (sec.statCards?.[0]) {
          sec.statCards[0].value    = fmtNum(kpis.interventionPlan.count);
          sec.statCards[0].subtitle = 'With active intervention plans';
        }
        if (sec.statCards?.[1]) {
          sec.statCards[1].value = fmtPct(kpis.interventionPlan.rate);
        }
        if (sec.statCards?.[2]) {
          sec.statCards[2].value    = fmtNum(noPlan);
          sec.statCards[2].subtitle = noPlan === 0 ? 'All have plans' : 'Awaiting plan creation';
        }
        if (sec.chart?.line) {
          sec.chart.line.data = trends.interventionPlanRate.map(r => ({
            month: shortMonth(r.month),
            value: Math.round(r.rate * 100),
          }));
        }
        break;
      }
    }
  });

  return cv;
}

// ─── Drop Outs ────────────────────────────────────────────────────────────────

export async function getDropOutsData(
  filters?: DashboardFilters,
): Promise<DropOutsResponse> {
  const res = await snapshotApi.get<DropOutsResponse>(
    SNAPSHOT_ENDPOINTS.DROP_OUTS,
    { params: filters ?? {} },
  );
  return res.data;
}

export function mapDropOuts(
  apiData: DropOutsResponse,
  staticView: CardViewData,
): CardViewData {
  const cv = cloneCardView(staticView);
  const { kpis, byReason } = apiData;

  // ── Metric cards ────────────────────────────────────────────────────────────
  if (cv.metricCards[0]) {
    cv.metricCards[0].value = fmtNum(kpis.total);
    cv.metricCards[0].count = `${kpis.dropoutRate}% dropout rate`;
  }

  // ── Breakdown section — replace with live by-reason data ────────────────────
  if (cv.breakdownSections && cv.breakdownSections[0]) {
    cv.breakdownSections[0].items = byReason.map((item, i) => ({
      id:         `reason-${i}`,
      label:      item.reason,                      // raw string; t() returns it as-is
      color:      REASON_COLORS[i % REASON_COLORS.length],
      count:      item.count,
      percentage: item.percentage,
    }));
  }

  // ── Graph blocks — update if monthly trend data is available ─────────────────
  if (cv.graphsBlocks && apiData.trends.monthly.length > 0) {
    // Build a per-reason series from the monthly data
    const months     = apiData.trends.monthly.map(r => shortMonth(r.month));
    const reasonKeys = Object.keys(apiData.trends.monthly[0] || {}).filter(k => k !== 'month');

    cv.graphsBlocks.forEach(block => {
      if (block.kind !== 'reportSection') return;
      const sec = block as DashboardGraphReportSectionBlock;
      if (sec.id !== 'do-dropout-overview') return;

      const charts = sec.charts ?? [];
      const multiLineChart = charts.find(c => c.kind === 'multiLine');
      if (multiLineChart?.multiLine) {
        multiLineChart.multiLine.series = reasonKeys.map((reason, i) => ({
          id:    reason,
          label: reason,
          color: REASON_COLORS[i % REASON_COLORS.length],
          data:  apiData.trends.monthly.map((row, mi) => ({
            x: months[mi],
            y: typeof row[reason] === 'number' ? row[reason] : 0,
          })),
        }));
      }
    });
  }

  return cv;
}

// ─── Output Pillar Cards ──────────────────────────────────────────────────────

// ── Response types ─────────────────────────────────────────────────────────

interface SocialProtectionResponse {
  pillarId: string;
  period: string;
  data: {
    specialAttentionRequired: number;
    specialAttentionReferred: number;
    specialAttentionReferredPct: number;
    immediateAttentionRequired: number;
    immediateAttentionReferred: number;
    immediateAttentionReferredPct: number;
    receivedSupport: number;
    receivedSupportPct: number;
    byType: Record<string, number>;
  } | null;
  meta: { siteCount: number; totalParticipants: number };
  dataNote?: string;
}

interface SocialEmpowermentResponse {
  pillarId: string;
  period: string;
  data: {
    eligible: number;
    trained: number;
    trainedPct: number;
    sessions: Array<{ session: number; organized: number; received: number; pct?: number }>;
  } | null;
  meta: { siteCount: number; totalParticipants: number };
}

interface BigPushResponse {
  pillarId: string;
  period: string;
  data: {
    businessTraining:      { eligible: number; trained: number; trainedPct: number };
    businessIdeaGenerated: { eligible: number; count: number; pct: number };
    businessRegistration:  { eligible: number; registered: number; pct: number };
    fundingSubmitted:      { eligible: number; count: number; pct: number };
    fundingApproved:       { eligible: number; count: number; pct: number };
    marketLinkage:         { eligible: number; count: number; pct: number };
    assetTransfers?:       Record<string, any>;
  } | null;
  meta: { siteCount: number; totalParticipants: number };
}

interface LivelihoodsEmploymentResponse {
  pillarId: string;
  period: string;
  data: {
    workReadiness:       { eligible: number; trained: number; pct: number };
    learnerships:        { eligible: number; linked: number; pct: number };
    permanentEmployment: { eligible: number; linked: number; pct: number };
  } | null;
  meta: { siteCount: number; totalParticipants: number };
}

interface FinancialInclusionResponse {
  pillarId: string;
  period: string;
  data: {
    financialLiteracy: {
      eligible: number;
      trained: number;
      trainedPct: number;
      sessions: Array<{ session: number; name: string; received: number; pct: number }>;
    };
  } | null;
  meta: { siteCount: number; totalParticipants: number };
}

interface CoachingResponse {
  pillarId: string;
  period: string;
  data: {
    totalSessions: number;
    avgSessionsPerParticipant: number;
    participantsWithSessions: number;
  } | null;
  meta: { siteCount: number; totalParticipants: number };
}

// ── Generic fetcher ─────────────────────────────────────────────────────────

async function getOutputPillarData<T>(
  pillarId: string,
  filters?: DashboardFilters,
): Promise<T> {
  const params: Record<string, string> = {};
  if (filters?.province) params.province = filters.province;
  if (filters?.lcId)     params.site      = filters.lcId;   // lcId doubles as site filter
  const res = await snapshotApi.get<T>(
    SNAPSHOT_ENDPOINTS.OUTPUT_PILLAR_CARD(pillarId),
    { params },
  );
  return res.data;
}

// ── Mappers ─────────────────────────────────────────────────────────────────

export function mapSocialProtection(
  apiResp: SocialProtectionResponse,
  staticView: CardViewData,
): CardViewData | null {
  const d  = apiResp.data;
  if (!d) return null; // No snapshot data — show "No Data" state
  const cv = cloneCardView(staticView);

  const total = apiResp.meta.totalParticipants || 1;

  // ── Metric cards ─────────────────────────────────────────────────────────
  // mc[0]: special attention
  if (cv.metricCards[0]) {
    cv.metricCards[0].value = fmtNum(d.specialAttentionRequired);
    cv.metricCards[0].count = `${fmtPct(d.specialAttentionRequired / total)} of participants | ${d.specialAttentionRequired > 0 ? fmtPct(d.specialAttentionReferred / d.specialAttentionRequired) : '0%'} referred`;
  }
  // mc[1]: immediate attention
  if (cv.metricCards[1]) {
    cv.metricCards[1].value = fmtNum(d.immediateAttentionRequired);
    cv.metricCards[1].count = `${fmtPct(d.immediateAttentionRequired / total)} of participants | ${d.immediateAttentionRequired > 0 ? fmtPct(d.immediateAttentionReferred / d.immediateAttentionRequired) : '0%'} referred`;
  }
  // mc[2]: support completion
  if (cv.metricCards[2]) {
    const totalReferred = d.specialAttentionReferred + d.immediateAttentionReferred;
    cv.metricCards[2].value = fmtPct(d.receivedSupportPct);
    cv.metricCards[2].count = `${fmtNum(d.receivedSupport)} receiving out of ${fmtNum(totalReferred)} referred`;
  }

  // ── Insights ─────────────────────────────────────────────────────────────
  cv.insightsItems = [
    `${fmtNum(d.specialAttentionRequired)} participants (${fmtPct(d.specialAttentionRequired / total)}) identified for special attention services.`,
    `${fmtNum(d.immediateAttentionRequired)} participants (${fmtPct(d.immediateAttentionRequired / total)}) require immediate support referrals.`,
    `${fmtNum(d.specialAttentionReferred + d.immediateAttentionReferred)} total referrals made across special and immediate categories.`,
    `${fmtPct(d.receivedSupportPct)} support completion rate — ${fmtNum(d.receivedSupport)} participants have received full support.`,
  ];

  // ── Graph stat cards (section spr-2-1) ────────────────────────────────────
  if (cv.graphsBlocks) {
    cv.graphsBlocks.forEach(block => {
      if (block.kind !== 'reportSection') return;
      const sec = block as any;
      switch (sec.id) {
        case 'spr-2-1': {
          // Special attention
          if (sec.statCards?.[0]) { sec.statCards[0].value = fmtNum(d.specialAttentionRequired); sec.statCards[0].subtitle = `${fmtPct(d.specialAttentionRequired / total)} of total participants`; }
          if (sec.statCards?.[1]) { sec.statCards[1].value = fmtNum(d.specialAttentionReferred); }
          break;
        }
        case 'spr-2-2': {
          // Immediate attention
          if (sec.statCards?.[0]) { sec.statCards[0].value = fmtNum(d.immediateAttentionRequired); sec.statCards[0].subtitle = `${fmtPct(d.immediateAttentionRequired / total)} of total participants`; }
          if (sec.statCards?.[1]) { sec.statCards[1].value = fmtNum(d.immediateAttentionReferred); }
          break;
        }
        case 'spr-2-3': {
          // Received support
          if (sec.statCards?.[0]) { sec.statCards[0].value = fmtNum(d.receivedSupport); }
          if (sec.statCards?.[1]) { sec.statCards[1].value = fmtPct(d.receivedSupportPct); }
          break;
        }
      }
    });
  }

  return cv;
}

export function mapSocialEmpowerment(
  apiResp: SocialEmpowermentResponse,
  staticView: CardViewData,
): CardViewData | null {
  const d  = apiResp.data;
  if (!d) return null; // No snapshot data — show "No Data" state
  const cv = cloneCardView(staticView);

  const eligible = d.eligible || 1;

  // Map sessions to metric cards (session 1→mc[0], 2→mc[1], 3→mc[2], 4→mc[3], 5→mc[4])
  const sessMap = Object.fromEntries(d.sessions.map(s => [s.session, s]));
  cv.metricCards.forEach((mc, i) => {
    const sess = sessMap[i + 1];
    if (sess && mc) {
      mc.value = fmtNum(sess.received);
      mc.count = `${fmtPct(sess.received / eligible)} sessions completed`;
    }
  });

  // ── Insights ─────────────────────────────────────────────────────────────
  cv.insightsItems = [
    `${fmtNum(d.trained)} of ${fmtNum(d.eligible)} participants (${fmtPct(d.trainedPct)}) completed all social empowerment training.`,
    ...d.sessions.slice(0, 3).map(s =>
      `Session ${s.session}: ${fmtNum(s.received)} participants received training (${fmtPct(s.received / eligible)}).`,
    ),
  ];

  // ── Graph stat cards ──────────────────────────────────────────────────────
  if (cv.graphsBlocks) {
    cv.graphsBlocks.forEach((block, bi) => {
      if (block.kind !== 'reportSection') return;
      const sec = block as any;
      const sess = d.sessions[bi]; // sections follow session order
      if (!sess) return;
      if (sec.statCards?.[0]) { sec.statCards[0].value = fmtNum(d.eligible); }
      if (sec.statCards?.[1]) { sec.statCards[1].value = fmtNum(sess.received); }
      if (sec.statCards?.[2]) { sec.statCards[2].value = fmtPct(sess.received / eligible); }
    });
  }

  return cv;
}

export function mapBigPush(
  apiResp: BigPushResponse,
  staticView: CardViewData,
): CardViewData | null {
  const d  = apiResp.data;
  if (!d) return null; // No snapshot data — show "No Data" state
  const cv = cloneCardView(staticView);

  // ── Metric cards ─────────────────────────────────────────────────────────
  // mc[0]: funding submitted
  if (cv.metricCards[0]) {
    cv.metricCards[0].value = fmtNum(d.fundingSubmitted.count);
    cv.metricCards[0].count = `${fmtPct(d.fundingSubmitted.pct)} of ${fmtNum(d.fundingSubmitted.eligible)} eligible`;
  }
  // mc[1]: funding approved
  if (cv.metricCards[1]) {
    cv.metricCards[1].value = fmtNum(d.fundingApproved.count);
    const submittedCount = d.fundingSubmitted.count || 1;
    cv.metricCards[1].count = `${fmtPct(d.fundingApproved.count / submittedCount)} of ${fmtNum(d.fundingSubmitted.count)} submitted`;
  }
  // mc[2]: asset transfers
  if (cv.metricCards[2]) {
    const approved = d.fundingApproved.count || 0;
    const assetCount = d.assetTransfers?.transferredCount ?? 0;
    if (approved > 0 && assetCount > 0) {
      cv.metricCards[2].value = fmtNum(assetCount);
      cv.metricCards[2].count = `${fmtPct(assetCount / approved)} of ${fmtNum(approved)} approved`;
    } else {
      // Asset transfer data not yet available from API — show nothing rather than dummy values
      cv.metricCards[2].value = '—';
      cv.metricCards[2].count = 'Data not yet available';
    }
  }
  // mc[3]: avg asset value — not collected by API; clear the dummy template value
  if (cv.metricCards[3]) {
    cv.metricCards[3].value = '—';
    cv.metricCards[3].count = 'Data not yet available';
  }

  // ── Insights ─────────────────────────────────────────────────────────────
  cv.insightsItems = [
    `${fmtNum(d.fundingSubmitted.count)} funding applications submitted (${fmtPct(d.fundingSubmitted.pct)} of ${fmtNum(d.fundingSubmitted.eligible)} eligible participants).`,
    `${fmtNum(d.fundingApproved.count)} applications approved (${d.fundingSubmitted.count > 0 ? fmtPct(d.fundingApproved.count / d.fundingSubmitted.count) : '0%'} approval rate).`,
    `${fmtNum(d.businessRegistration.registered)} businesses registered (${fmtPct(d.businessRegistration.pct)} of eligible participants).`,
    `${fmtNum(d.marketLinkage.count)} participants linked to markets (${fmtPct(d.marketLinkage.pct)} market linkage rate).`,
  ];

  // ── Graph stat cards ──────────────────────────────────────────────────────
  if (cv.graphsBlocks) {
    cv.graphsBlocks.forEach(block => {
      if (block.kind !== 'reportSection') return;
      const sec = block as any;
      switch (sec.id) {
        case 'bp-3-1-1': {
          // Funding submitted
          if (sec.statCards?.[0]) sec.statCards[0].value = fmtNum(d.fundingSubmitted.eligible);
          if (sec.statCards?.[1]) sec.statCards[1].value = fmtNum(d.fundingSubmitted.count);
          if (sec.statCards?.[2]) sec.statCards[2].value = fmtPct(d.fundingSubmitted.pct);
          break;
        }
        case 'bp-3-1-2': {
          // Funding approved
          if (sec.statCards?.[0]) sec.statCards[0].value = fmtNum(d.fundingSubmitted.count);
          if (sec.statCards?.[1]) sec.statCards[1].value = fmtNum(d.fundingApproved.count);
          if (sec.statCards?.[2]) { const r = d.fundingSubmitted.count > 0 ? d.fundingApproved.count / d.fundingSubmitted.count : 0; sec.statCards[2].value = fmtPct(r); }
          break;
        }
      }
    });
  }

  return cv;
}

export function mapLivelihoodPromotion(
  bizResp: BigPushResponse,
  empResp: LivelihoodsEmploymentResponse,
  staticView: CardViewData,
): CardViewData | null {
  const biz = bizResp.data;
  const emp = empResp.data;
  if (!biz && !emp) return null; // No snapshot data — show "No Data" state
  const cv  = cloneCardView(staticView);
  if (!cv.sections) return null;

  const bizEligible = biz?.businessTraining.eligible ?? 0;
  const empEligible = emp?.workReadiness.eligible     ?? 0;
  const total       = bizEligible + empEligible || 1;

  // ── Section 0: Pathway selection ─────────────────────────────────────────
  const pathSec = cv.sections[0];
  if (pathSec?.metricCards) {
    if (pathSec.metricCards[0]) {
      pathSec.metricCards[0].value = fmtNum(bizEligible);
      pathSec.metricCards[0].count = fmtPct(bizEligible / total);
    }
    if (pathSec.metricCards[1]) {
      pathSec.metricCards[1].value = fmtNum(empEligible);
      pathSec.metricCards[1].count = fmtPct(empEligible / total);
    }
  }

  // ── Section 1: Entrepreneurship key metrics ───────────────────────────────
  const entSec = cv.sections[1];
  if (entSec?.metricCards && biz) {
    const b = biz;
    // mc[0]: livelihood training → businessTraining
    if (entSec.metricCards[0]) { entSec.metricCards[0].value = fmtPct(b.businessTraining.trainedPct); entSec.metricCards[0].count = fmtNum(b.businessTraining.trained); }
    // mc[1]: business training (same source)
    if (entSec.metricCards[1]) { entSec.metricCards[1].value = fmtPct(b.businessTraining.trainedPct); entSec.metricCards[1].count = fmtNum(b.businessTraining.trained); }
    // mc[2]: registration support
    if (entSec.metricCards[2]) { entSec.metricCards[2].value = fmtPct(b.businessRegistration.pct); entSec.metricCards[2].count = fmtNum(b.businessRegistration.registered); }
    // mc[3]: registration rate (same)
    if (entSec.metricCards[3]) { entSec.metricCards[3].value = fmtPct(b.businessRegistration.pct); entSec.metricCards[3].count = fmtNum(b.businessRegistration.registered); }
    // mc[4]: market linkage
    if (entSec.metricCards[4]) { entSec.metricCards[4].value = fmtPct(b.marketLinkage.pct); entSec.metricCards[4].count = fmtNum(b.marketLinkage.count); }
  }

  // ── Section 2: Employment key metrics ────────────────────────────────────
  const empSec = cv.sections[2];
  if (empSec?.metricCards && emp) {
    const e = emp;
    // mc[0]: vocational training → workReadiness
    if (empSec.metricCards[0]) { empSec.metricCards[0].value = fmtPct(e.workReadiness.pct); empSec.metricCards[0].count = fmtNum(e.workReadiness.trained); }
    // mc[1]: work readiness
    if (empSec.metricCards[1]) { empSec.metricCards[1].value = fmtPct(e.workReadiness.pct); empSec.metricCards[1].count = fmtNum(e.workReadiness.trained); }
    // mc[2]: learnership
    if (empSec.metricCards[2]) { empSec.metricCards[2].value = fmtPct(e.learnerships.pct); empSec.metricCards[2].count = fmtNum(e.learnerships.linked); }
    // mc[3]: permanent employment
    if (empSec.metricCards[3]) { empSec.metricCards[3].value = fmtPct(e.permanentEmployment.pct); empSec.metricCards[3].count = fmtNum(e.permanentEmployment.linked); }
    // mc[4]: mentorship — not yet collected by API; clear the dummy template value
    if (empSec.metricCards[4]) { empSec.metricCards[4].value = '—'; empSec.metricCards[4].count = 'Data not yet available'; }
  }

  return cv;
}

export function mapFinancialInclusion(
  apiResp: FinancialInclusionResponse,
  staticView: CardViewData,
): CardViewData | null {
  const d  = apiResp.data;
  if (!d) return null; // No snapshot data — show "No Data" state
  const cv = cloneCardView(staticView);

  const fl = d.financialLiteracy;

  // ── Metric cards ─────────────────────────────────────────────────────────
  // mc[0]: financial literacy attendance
  if (cv.metricCards[0]) {
    cv.metricCards[0].value = fmtPct(fl.trainedPct);
    cv.metricCards[0].count = `${fmtNum(fl.trained)} of ${fmtNum(fl.eligible)} participants`;
  }
  // mc[1]: formal savings — not yet collected by API; clear the dummy template value
  if (cv.metricCards[1]) {
    cv.metricCards[1].value = '—';
    cv.metricCards[1].count = 'Data not yet available';
  }

  // ── Insights ─────────────────────────────────────────────────────────────
  const sessLines = fl.sessions.map(s =>
    `Session ${s.session} (${s.name}): ${fmtNum(s.received)} participants attended (${fmtPct(s.pct)}).`,
  );
  cv.insightsItems = [
    `${fmtPct(fl.trainedPct)} financial literacy training completion — ${fmtNum(fl.trained)} of ${fmtNum(fl.eligible)} participants completed all sessions.`,
    ...sessLines,
  ];

  // ── Graph stat cards ──────────────────────────────────────────────────────
  if (cv.graphsBlocks) {
    cv.graphsBlocks.forEach(block => {
      if (block.kind !== 'reportSection') return;
      const sec = block as any;
      if (sec.id === 'fi-6-1') {
        if (sec.statCards?.[0]) sec.statCards[0].value = fmtNum(fl.eligible);
        if (sec.statCards?.[1]) sec.statCards[1].value = fmtNum(fl.trained);
        if (sec.statCards?.[2]) sec.statCards[2].value = fmtPct(fl.trainedPct);
      }
    });
  }

  return cv;
}

export function mapCoaching(
  apiResp: CoachingResponse,
  staticView: CardViewData,
): CardViewData | null {
  const d  = apiResp.data;
  if (!d) return null; // No snapshot data — show "No Data" state
  const cv = cloneCardView(staticView);

  const total = apiResp.meta.totalParticipants || d.participantsWithSessions || 1;

  // ── Metric cards ─────────────────────────────────────────────────────────
  // mc[0]: participants receiving coaching
  if (cv.metricCards[0]) {
    cv.metricCards[0].value = fmtNum(d.participantsWithSessions);
    cv.metricCards[0].count = `${fmtPct(d.participantsWithSessions / total)} coverage`;
  }
  // mc[1]: total sessions delivered
  if (cv.metricCards[1]) {
    cv.metricCards[1].value = fmtNum(d.totalSessions);
    cv.metricCards[1].count = 'Across all participants';
  }
  // mc[2]: avg sessions per participant
  if (cv.metricCards[2]) {
    cv.metricCards[2].value = String(d.avgSessionsPerParticipant);
  }

  // ── Insights ─────────────────────────────────────────────────────────────
  cv.insightsItems = [
    `${fmtNum(d.participantsWithSessions)} participants (${fmtPct(d.participantsWithSessions / total)}) received coaching support.`,
    `${fmtNum(d.totalSessions)} total coaching sessions delivered across the programme.`,
    `Average of ${d.avgSessionsPerParticipant} coaching sessions per participant across the graduation cycle.`,
  ];

  return cv;
}

// ─── Outcome Cards ────────────────────────────────────────────────────────────

export async function getOutcomeCardData(
  cardId: string,
  filters?: DashboardFilters,
): Promise<OutcomeCardResponse> {
  const res = await snapshotApi.get<OutcomeCardResponse>(
    SNAPSHOT_ENDPOINTS.OUTCOME_CARD(cardId),
    { params: filters ?? {} },
  );
  return res.data;
}

/**
 * Human-readable label for an outcome indicator ID.
 * e.g. "outcome_1_1" → "Pillar 1 – Criterion 1"
 * Falls back gracefully for unknown IDs.
 */
const INDICATOR_LABELS: Record<string, string> = {
  outcome_1_1: 'Active Income Generating Activity',
  outcome_1_2: 'Business Profitability',
  outcome_1_3: 'Employment Status',
  outcome_1_4: 'Income Stability',
  outcome_1_5: 'Income Level',
  outcome_1_6: 'Asset Ownership',
  outcome_1_7: 'Asset Value Growth',
  outcome_2_1: 'Savings Account Ownership',
  outcome_2_2: 'Regular Savings Behavior',
  outcome_2_3: 'Savings Amount',
  outcome_2_4: 'Emergency Fund',
  outcome_2_5: 'Financial Record Keeping',
  outcome_2_6: 'Debt Awareness',
  outcome_2_7: 'Manageable Debt Level',
  outcome_2_8: 'Access to Credit',
  outcome_2_9: 'Credit Repayment',
  outcome_2_10: 'Financial Planning',
  outcome_3_1: 'Social Support Network',
  outcome_3_2: 'Community Participation',
  outcome_4_1: 'Gender Equity Awareness',
  outcome_4_2: 'Decision-Making Autonomy',
};

export function mapOutcomeCard(
  apiData: OutcomeCardResponse,
  staticView: CardViewData,
): CardViewData | null {
  const { overall, criteria, trend, dataAvailability } = apiData;

  // No snapshots computed yet — show "No Data" state rather than all-zero values
  if (dataAvailability === 'no_data') return null;

  const cv = cloneCardView(staticView);

  // ── Update the first metric card to show live eligibility rate ───────────────
  if (cv.metricCards[0]) {
    cv.metricCards[0].value = fmtPct(overall.rate);
    cv.metricCards[0].count = `${fmtNum(overall.eligible)} of ${fmtNum(overall.total)} participants`;
  }
  // Clear any additional metric cards the template may have — they have no live data source
  for (let i = 1; i < cv.metricCards.length; i++) {
    cv.metricCards[i].value = '—';
    cv.metricCards[i].count = 'Data not yet available';
  }

  // ── Replace static insight bullets with live data-driven summary ─────────────
  const topCriteria = Object.entries(criteria)
    .sort(([, a], [, b]) => b.rate - a.rate)
    .slice(0, 3);
  cv.insightsItems = [
    `${fmtPct(overall.rate)} of ${fmtNum(overall.total)} participants meet the graduation threshold for this indicator group.`,
    ...topCriteria.map(([id, crit]) =>
      `${INDICATOR_LABELS[id] ?? id}: ${fmtNum(crit.met)} of ${fmtNum(crit.total)} met (${fmtPct(crit.rate)}).`,
    ),
    ...(dataAvailability === 'criteria_only'
      ? ['Note: Overall rate calculated from criteria data; profiling survey responses pending.']
      : []),
  ];

  // ── Add / replace the criteria breakdown section ──────────────────────────────
  const criteriaItems = Object.entries(criteria).map(([indicatorId, crit], i) => ({
    id:         indicatorId,
    label:      INDICATOR_LABELS[indicatorId] ?? indicatorId,
    color:      CRITERIA_COLORS[i % CRITERIA_COLORS.length],
    count:      crit.met,
    percentage: fmtPct(crit.rate),
  }));

  if (!cv.breakdownSections) {
    cv.breakdownSections = [];
  }

  // Replace or add the "Graduation Criteria" breakdown section
  const criteriaSection = {
    title: 'admin.outcomeIndicators.criteriaBreakdown',   // i18n key or fallback text
    items: criteriaItems,
  };

  const existingIdx = cv.breakdownSections.findIndex(
    s => s.title === 'admin.outcomeIndicators.criteriaBreakdown',
  );
  if (existingIdx >= 0) {
    cv.breakdownSections[existingIdx] = criteriaSection;
  } else {
    cv.breakdownSections.unshift(criteriaSection);       // Show criteria first
  }

  // ── Update graph trend blocks if trend data is available ─────────────────────
  if (cv.graphsBlocks && trend.length > 0 && dataAvailability !== 'no_data') {
    const primaryIndicators = Object.keys(criteria);

    cv.graphsBlocks.forEach(block => {
      if (block.kind !== 'reportSection') return;
      const sec = block as DashboardGraphReportSectionBlock;

      // Try to update the first multiLine or line chart in this section
      const charts = sec.charts ?? (sec.chart ? [sec.chart] : []);
      charts.forEach(chart => {
        if (chart.kind === 'multiLine' && chart.multiLine) {
          chart.multiLine.series = primaryIndicators.map((indId, i) => ({
            id:    indId,
            label: INDICATOR_LABELS[indId] ?? indId,
            color: CRITERIA_COLORS[i % CRITERIA_COLORS.length],
            data:  trend.map(row => ({
              x: shortMonth(String(row.period ?? row.month ?? '')),
              y: row[indId]?.rate != null ? Math.round(row[indId].rate * 100) : 0,
            })),
          }));
        }

        if (chart.kind === 'line' && chart.line) {
          // Use the first primary indicator for a single line chart
          const firstId = primaryIndicators[0];
          if (firstId) {
            chart.line.data = trend.map(row => ({
              month: shortMonth(String(row.period ?? row.month ?? '')),
              value: row[firstId]?.rate != null ? Math.round(row[firstId].rate * 100) : 0,
            }));
          }
        }
      });
    });
  }

  return cv;
}

// ─── Unified fetch + map ──────────────────────────────────────────────────────

/** Output pillar card IDs served by the output/pillar/:pillarId endpoint */
const OUTPUT_PILLAR_IDS = new Set([
  'social-protection-referrals',
  'social-empowerment',
  'big-push',
  'livelihood-promotion',
  'financial-inclusion',
  'coaching',
]);

/** Outcome card IDs handled by the outcome router */
const OUTCOME_CARD_IDS = new Set([
  'income-household-participant',
  'asset-accumulation-household-participant',
  'savings',
  'record-keeping',
  'debt-credit',
  'social-empowerment-dignity',
  'individual-income-household',
  'individual-asset-accumulation',
  'individual-savings',
  'individual-record-keeping',
  'individual-debt-credit',
  'individual-social-empowerment',
]);

/**
 * Fetch live data for a given cardId and merge it with the provided static
 * CardViewData template.  Returns the merged CardViewData.
 *
 * Falls back to the static template if the API call fails.
 */
export async function fetchAndMergeCardData(
  cardId: string,
  staticView: CardViewData,
  filters?: DashboardFilters,
): Promise<CardViewData | null> {
  try {
    if (cardId === 'participant-enrollment') {
      const apiData = await getParticipantEnrollmentData(filters);
      return mapParticipantEnrollment(apiData, staticView);
    }

    if (cardId === 'drop-outs') {
      const apiData = await getDropOutsData(filters);
      return mapDropOuts(apiData, staticView);
    }

    if (cardId === 'social-protection-referrals') {
      const apiData = await getOutputPillarData<SocialProtectionResponse>(cardId, filters);
      return mapSocialProtection(apiData, staticView);
    }

    if (cardId === 'social-empowerment') {
      const apiData = await getOutputPillarData<SocialEmpowermentResponse>(cardId, filters);
      return mapSocialEmpowerment(apiData, staticView);
    }

    if (cardId === 'big-push') {
      const apiData = await getOutputPillarData<BigPushResponse>(cardId, filters);
      return mapBigPush(apiData, staticView);
    }

    if (cardId === 'livelihood-promotion') {
      // This card shows both entrepreneurship and employment pathways
      const [bizData, empData] = await Promise.all([
        getOutputPillarData<BigPushResponse>('big-push', filters),
        getOutputPillarData<LivelihoodsEmploymentResponse>('livelihood-promotion', filters),
      ]);
      return mapLivelihoodPromotion(bizData, empData, staticView);
    }

    if (cardId === 'financial-inclusion') {
      const apiData = await getOutputPillarData<FinancialInclusionResponse>(cardId, filters);
      return mapFinancialInclusion(apiData, staticView);
    }

    if (cardId === 'coaching') {
      const apiData = await getOutputPillarData<CoachingResponse>(cardId, filters);
      return mapCoaching(apiData, staticView);
    }

    if (OUTCOME_CARD_IDS.has(cardId)) {
      const apiData = await getOutcomeCardData(cardId, filters);
      return mapOutcomeCard(apiData, staticView);
    }
  } catch (err) {
    // Log the error and return null — the UI will render a "No Data" state
    console.warn(`[dashboardService] Failed to load live data for "${cardId}":`, err);
    return null;
  }

  // cardId not recognised by any handler
  return null;
}
