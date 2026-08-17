import { TabData } from '@app-types/components';

export type FilterConfig = {
  name?: string;
  nameKey?: string;
  attr: string;
  type?: string;
  data?: any[];
  placeholder?: string;
  placeholderKey?: string;
  [key: string]: any;
};

// Dashboard specific tabs configuration
export const DASHBOARD_TABS: TabData[] = [
  {
    key: 'overview',
    label: 'requestorDashboard.tabs.overview',
    isDisabled: false,
  },
  {
    key: 'outcomes',
    label: 'requestorDashboard.tabs.outcomes',
    isDisabled: false,
  },
  {
    key: 'graduationCriteria',
    label: 'requestorDashboard.tabs.graduationCriteria',
    isDisabled: false,
  },
];

// Dashboard specific filters configuration (exactly 3 filters: Time, Status, Gender)
export const DASHBOARD_FILTERS: FilterConfig[] = [
  {
    attr: 'time',
    type: 'select',
    placeholderKey: 'requestorDashboard.filters.allTime',
    data: [
      { labelKey: 'requestorDashboard.filters.allTime', value: 'All Time' },
      { labelKey: 'requestorDashboard.filters.timeOptions.last7Days', value: 'Last 7 Days' },
      { labelKey: 'requestorDashboard.filters.timeOptions.last30Days', value: 'Last 30 Days' },
      { labelKey: 'requestorDashboard.filters.timeOptions.last90Days', value: 'Last 90 Days' },
      { labelKey: 'requestorDashboard.filters.timeOptions.thisYear', value: 'This Year' }
    ]
  },
  {
    attr: 'status',
    type: 'select',
    placeholderKey: 'requestorDashboard.filters.allStatuses',
    data: [
      { labelKey: 'requestorDashboard.filters.allStatuses', value: 'All Statuses' },
      { labelKey: 'requestorDashboard.filters.statusOptions.active', value: 'Active' },
      { labelKey: 'requestorDashboard.filters.statusOptions.completed', value: 'Completed' },
      { labelKey: 'requestorDashboard.filters.statusOptions.draft', value: 'Draft' }
    ]
  },
  {
    attr: 'gender',
    type: 'select',
    placeholderKey: 'requestorDashboard.filters.allGender',
    data: [
      { labelKey: 'requestorDashboard.filters.allGender', value: 'All Gender' },
      { labelKey: 'requestorDashboard.filters.genderOptions.male', value: 'Male' },
      { labelKey: 'requestorDashboard.filters.genderOptions.female', value: 'Female' },
      { labelKey: 'requestorDashboard.filters.genderOptions.other', value: 'Other' }
    ]
  }
];

export interface PerformanceMetricConfig {
  key: string;
  labelKey: string;
  subLabelKey: string;
  subLabelWeeklyKey?: string;
  icon: string;
  weeklyValue: string | number;
  monthlyValue: string | number;
  colorToken: string;
  bgToken: string;
  borderToken: string;
}

export const PERFORMANCE_REPORT_METRICS: PerformanceMetricConfig[] = [
  {
    key: 'participantsOnboarded',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.participantsOnboarded.label',
    subLabelWeeklyKey: 'requestorDashboard.overview.performanceActivityReport.metrics.participantsOnboarded.subLabelWeekly',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.participantsOnboarded.subLabelMonthly',
    icon: 'User',
    weeklyValue: 1,
    monthlyValue: 4,
    colorToken: '$success600',
    bgToken: '$success50',
    borderToken: '$success200'
  },
  {
    key: 'idpsDeveloped',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.idpsDeveloped.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.idpsDeveloped.subLabel',
    icon: 'FileText',
    weeklyValue: 0,
    monthlyValue: 2,
    colorToken: '$info600',
    bgToken: '$info50',
    borderToken: '$info200'
  },
  {
    key: 'individualCheckIns',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.individualCheckIns.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.individualCheckIns.subLabel',
    icon: 'ClipboardList',
    weeklyValue: 3,
    monthlyValue: 12,
    colorToken: '$purple600',
    bgToken: '$purple50',
    borderToken: '$purple200'
  },
  {
    key: 'groupCheckIns',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.groupCheckIns.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.groupCheckIns.subLabel',
    icon: 'Users',
    weeklyValue: 1,
    monthlyValue: 4,
    colorToken: '$pink600',
    bgToken: '$pink50',
    borderToken: '$pink200'
  },
  {
    key: 'midlineSurveys',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.midlineSurveys.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.midlineSurveys.subLabel',
    icon: 'Calendar',
    weeklyValue: 1,
    monthlyValue: 4,
    colorToken: '$warning600',
    bgToken: '$warning50',
    borderToken: '$warning200'
  },
  {
    key: 'endlineSurveys',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.endlineSurveys.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.endlineSurveys.subLabel',
    icon: 'CheckCircle',
    weeklyValue: 0,
    monthlyValue: 1,
    colorToken: '$teal600',
    bgToken: '$teal50',
    borderToken: '$teal200'
  },
  {
    key: 'bigPushFacilitated',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.bigPushFacilitated.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.bigPushFacilitated.subLabel',
    icon: 'Zap',
    weeklyValue: 1,
    monthlyValue: 3,
    colorToken: '$indigo600',
    bgToken: '$indigo50',
    borderToken: '$indigo200'
  },
  {
    key: 'bigPushValue',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.bigPushValue.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.bigPushValue.subLabel',
    icon: 'DollarSign',
    weeklyValue: 'R4,500',
    monthlyValue: 'R13,500',
    colorToken: '$success600',
    bgToken: '$success50',
    borderToken: '$success200'
  },
  {
    key: 'interventionsScheduled',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.interventionsScheduled.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.interventionsScheduled.subLabel',
    icon: 'Calendar',
    weeklyValue: 27,
    monthlyValue: 108,
    colorToken: '$purple600',
    bgToken: '$purple50',
    borderToken: '$purple200'
  },
  {
    key: 'interventionsCompleted',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.interventionsCompleted.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.interventionsCompleted.subLabel',
    icon: 'ClipboardCheck',
    weeklyValue: 19,
    monthlyValue: 76,
    colorToken: '$teal600',
    bgToken: '$teal50',
    borderToken: '$teal200'
  },
  {
    key: 'slowClimbers',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.slowClimbers.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.slowClimbers.subLabel',
    icon: 'TrendingDown',
    weeklyValue: 7,
    monthlyValue: 7,
    colorToken: '$red600',
    bgToken: '$red50',
    borderToken: '$red200'
  },
  {
    key: 'fastClimbers',
    labelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.fastClimbers.label',
    subLabelKey: 'requestorDashboard.overview.performanceActivityReport.metrics.fastClimbers.subLabel',
    icon: 'TrendingUp',
    weeklyValue: 8,
    monthlyValue: 8,
    colorToken: '$success600',
    bgToken: '$success50',
    borderToken: '$success200'
  }
];

export interface ParticipantStatusMetricConfig {
  key: string;
  labelKey: string;
  icon?: string;
}

export const PARTICIPANT_STATUS_METRICS: ParticipantStatusMetricConfig[] = [
  {
    key: 'monthlyIncome',
    labelKey: 'requestorDashboard.outcomes.participantStatus.monthlyIncome.label',
    icon: 'DollarSign',
  },
  {
    key: 'currentSavings',
    labelKey: 'requestorDashboard.outcomes.participantStatus.currentSavings.label',
    icon: 'PiggyBank',
  },
  {
    key: 'igaStatus',
    labelKey: 'requestorDashboard.outcomes.participantStatus.igaStatus.label',
    icon: 'Store',
  },
  {
    key: 'selfEfficacyScore',
    labelKey: 'requestorDashboard.outcomes.participantStatus.selfEfficacyScore.label',
    icon: 'Target',
  },
  {
    key: 'savingsFrequency',
    labelKey: 'requestorDashboard.outcomes.participantStatus.savingsFrequency.label',
  },
  {
    key: 'savingsLocation',
    labelKey: 'requestorDashboard.outcomes.participantStatus.savingsLocation.label',
  },
  {
    key: 'recordKeeping',
    labelKey: 'requestorDashboard.outcomes.participantStatus.recordKeeping.label',
  },
  {
    key: 'debtStatus',
    labelKey: 'requestorDashboard.outcomes.participantStatus.debtStatus.label',
  },
];

export interface ParticipantOutcomes {
  monthlyIncome: { value: string; change: string };
  currentSavings: { value: string; change: string };
  igaStatus: { value: string; details: string };
  selfEfficacyScore: { value: string; percent: number };
  savingsFrequency: { value: string };
  savingsLocation: { value: string };
  recordKeeping: { value: string };
  debtStatus: { value: string };
  
  incomeTrend: Array<{ month: string; value: number }>;
  savingsTrend: Array<{ month: string; value: number }>;
  incomeSources: Array<{ source: string; amount: string; percent: number }>;
  selfEfficacyTrend: Array<{ month: string; value: number }>;
  profitabilityTrend: Array<{ month: string; value: number }>;
  agency: { title: string; subTitle: string };
}

export function getParticipantOutcomes(participantId: string): ParticipantOutcomes {
  const idNum = parseInt(participantId.replace(/\D/g, '')) || 1000;
  
  if (participantId === '1001') {
    return {
      monthlyIncome: { value: 'R3,088', change: '144.5%' },
      currentSavings: { value: 'R4,408', change: '221.3%' },
      igaStatus: { value: 'Active', details: 'Small business - retail' },
      selfEfficacyScore: { value: '85/100', percent: 85 },
      savingsFrequency: { value: 'Weekly' },
      savingsLocation: { value: 'Bank account' },
      recordKeeping: { value: 'Written records' },
      debtStatus: { value: 'R2,673' },
      
      incomeTrend: [
        { month: 'Jul', value: 1200 },
        { month: 'Aug', value: 1400 },
        { month: 'Sep', value: 1600 },
        { month: 'Oct', value: 1800 },
        { month: 'Nov', value: 2100 },
        { month: 'Dec', value: 3088 }
      ],
      savingsTrend: [
        { month: 'Jul', value: 1400 },
        { month: 'Aug', value: 1700 },
        { month: 'Sep', value: 2100 },
        { month: 'Oct', value: 2600 },
        { month: 'Nov', value: 3200 },
        { month: 'Dec', value: 4408 }
      ],
      incomeSources: [
        { source: 'Business', amount: 'R1,544', percent: 50 },
        { source: 'Employment', amount: 'R308', percent: 10 },
        { source: 'Grants', amount: 'R772', percent: 25 },
        { source: 'Remittances', amount: 'R308', percent: 10 },
        { source: 'Other', amount: 'R154', percent: 5 }
      ],
      selfEfficacyTrend: [
        { month: 'Baseline', value: 58 },
        { month: 'Midline', value: 72 },
        { month: 'Current', value: 82 }
      ],
      profitabilityTrend: [
        { month: 'Jul', value: 300 },
        { month: 'Aug', value: 400 },
        { month: 'Sep', value: 550 },
        { month: 'Oct', value: 650 },
        { month: 'Nov', value: 750 },
        { month: 'Dec', value: 850 }
      ],
      agency: {
        title: 'Feels in control of their life',
        subTitle: 'Positive agency indicator'
      }
    };
  }
  
  // Deterministic values for other participants
  const baseInc = 1000 + (idNum % 8) * 200;
  const currInc = Math.round(baseInc * (1.3 + (idNum % 4) * 0.2));
  const incChg = (((currInc - baseInc) / baseInc) * 100).toFixed(1);
  
  const baseSav = 800 + (idNum % 6) * 150;
  const currSav = Math.round(baseSav * (1.5 + (idNum % 5) * 0.3));
  const savChg = (((currSav - baseSav) / baseSav) * 100).toFixed(1);
  
  const selfEffBase = 45 + (idNum % 5) * 4;
  const selfEffMid = selfEffBase + 10 + (idNum % 3) * 3;
  const selfEffCurr = selfEffMid + 8 + (idNum % 4) * 2;
  
  const dbt = Math.round(1000 + (idNum % 9) * 250);
  
  const busAmt = Math.round(currInc * 0.45);
  const empAmt = Math.round(currInc * 0.15);
  const grAmt = Math.round(currInc * 0.2);
  const remAmt = Math.round(currInc * 0.12);
  const othAmt = currInc - (busAmt + empAmt + grAmt + remAmt);

  const julProf = Math.round(currInc * 0.12);
  const augProf = Math.round(currInc * 0.15);
  const sepProf = Math.round(currInc * 0.18);
  const octProf = Math.round(currInc * 0.22);
  const novProf = Math.round(currInc * 0.25);
  const decProf = Math.round(currInc * 0.3);

  return {
    monthlyIncome: { value: `R${currInc.toLocaleString()}`, change: `${incChg}%` },
    currentSavings: { value: `R${currSav.toLocaleString()}`, change: `${savChg}%` },
    igaStatus: { value: 'Active', details: 'Small business - retail' },
    selfEfficacyScore: { value: `${selfEffCurr}/100`, percent: selfEffCurr },
    savingsFrequency: { value: idNum % 2 === 0 ? 'Weekly' : 'Monthly' },
    savingsLocation: { value: idNum % 3 === 0 ? 'Bank account' : idNum % 3 === 1 ? 'Mobile money' : 'Cash at home' },
    recordKeeping: { value: idNum % 2 === 0 ? 'Written records' : 'Digital records' },
    debtStatus: { value: `R${dbt.toLocaleString()}` },
    
    incomeTrend: [
      { month: 'Jul', value: Math.round(currInc * 0.5) },
      { month: 'Aug', value: Math.round(currInc * 0.55) },
      { month: 'Sep', value: Math.round(currInc * 0.65) },
      { month: 'Oct', value: Math.round(currInc * 0.75) },
      { month: 'Nov', value: Math.round(currInc * 0.85) },
      { month: 'Dec', value: currInc }
    ],
    savingsTrend: [
      { month: 'Jul', value: Math.round(currSav * 0.4) },
      { month: 'Aug', value: Math.round(currSav * 0.48) },
      { month: 'Sep', value: Math.round(currSav * 0.58) },
      { month: 'Oct', value: Math.round(currSav * 0.7) },
      { month: 'Nov', value: Math.round(currSav * 0.85) },
      { month: 'Dec', value: currSav }
    ],
    incomeSources: [
      { source: 'Business', amount: `R${busAmt.toLocaleString()}`, percent: Math.round((busAmt / currInc) * 100) },
      { source: 'Employment', amount: `R${empAmt.toLocaleString()}`, percent: Math.round((empAmt / currInc) * 100) },
      { source: 'Grants', amount: `R${grAmt.toLocaleString()}`, percent: Math.round((grAmt / currInc) * 100) },
      { source: 'Remittances', amount: `R${remAmt.toLocaleString()}`, percent: Math.round((remAmt / currInc) * 100) },
      { source: 'Other', amount: `R${othAmt.toLocaleString()}`, percent: Math.round((othAmt / currInc) * 100) }
    ],
    selfEfficacyTrend: [
      { month: 'Baseline', value: selfEffBase },
      { month: 'Midline', value: selfEffMid },
      { month: 'Current', value: selfEffCurr }
    ],
    profitabilityTrend: [
      { month: 'Jul', value: julProf },
      { month: 'Aug', value: augProf },
      { month: 'Sep', value: sepProf },
      { month: 'Oct', value: octProf },
      { month: 'Nov', value: novProf },
      { month: 'Dec', value: decProf }
    ],
    agency: {
      title: idNum % 2 === 0 ? 'Feels in control of their life' : 'Moderately in control',
      subTitle: 'Positive agency indicator'
    }
  };
}

export interface GraduationMetricConfig {
  key: string;
  labelKey: string;
  valueKey: string;
  subLabelKey: string;
  colorToken: string;
}

export const GRADUATION_METRICS: GraduationMetricConfig[] = [
  {
    key: 'coachWorkload',
    labelKey: 'requestorDashboard.graduationCriteria.metrics.coachWorkload.label',
    valueKey: 'requestorDashboard.graduationCriteria.metrics.coachWorkload.value',
    subLabelKey: 'requestorDashboard.graduationCriteria.metrics.coachWorkload.description',
    colorToken: '$secondary400',
  },
  {
    key: 'readyToGraduate',
    labelKey: 'requestorDashboard.graduationCriteria.metrics.readyToGraduate.label',
    valueKey: 'requestorDashboard.graduationCriteria.metrics.readyToGraduate.value',
    subLabelKey: 'requestorDashboard.graduationCriteria.metrics.readyToGraduate.description',
    colorToken: '$red800',
  },
  {
    key: 'nearReady',
    labelKey: 'requestorDashboard.graduationCriteria.metrics.nearReady.label',
    valueKey: 'requestorDashboard.graduationCriteria.metrics.nearReady.value',
    subLabelKey: 'requestorDashboard.graduationCriteria.metrics.nearReady.description',
    colorToken: '$warning500',
  },
  {
    key: 'notReady',
    labelKey: 'requestorDashboard.graduationCriteria.metrics.notReady.label',
    valueKey: 'requestorDashboard.graduationCriteria.metrics.notReady.value',
    subLabelKey: 'requestorDashboard.graduationCriteria.metrics.notReady.description',
    colorToken: '$red600',
  },
];

export const GRADUATION_FILTERS: FilterConfig[] = [
  {
    attr: 'gender',
    type: 'select',
    placeholderKey: 'requestorDashboard.graduationCriteria.filters.allGenders',
    data: [
      { labelKey: 'requestorDashboard.graduationCriteria.filters.allGenders', value: 'all-genders' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.genderOptions.male', value: 'male' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.genderOptions.female', value: 'female' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.genderOptions.other', value: 'other' },
    ],
  },
  {
    attr: 'pathway',
    type: 'select',
    placeholderKey: 'requestorDashboard.graduationCriteria.filters.allPathways',
    data: [
      { labelKey: 'requestorDashboard.graduationCriteria.filters.allPathways', value: 'all-pathways' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.pathwayOptions.agriculture', value: 'agriculture' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.pathwayOptions.business', value: 'business' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.pathwayOptions.vocational', value: 'vocational' },
    ],
  },
  {
    attr: 'pillar',
    type: 'select',
    placeholderKey: 'requestorDashboard.graduationCriteria.filters.allPillars',
    data: [
      { labelKey: 'requestorDashboard.graduationCriteria.filters.allPillars', value: 'all-pillars' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.pillarOptions.financial', value: 'financial' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.pillarOptions.social', value: 'social' },
      { labelKey: 'requestorDashboard.graduationCriteria.filters.pillarOptions.economic', value: 'economic' },
    ],
  },
];

export interface GraduationSegment {
  labelKey: string;
  value: number;
  percent: number;
  color: string;
}

export interface GraduationRateData {
  totalActive: number;
  graduated: number;
  rate: number;
  totalParticipants?: number;
  notGraduated?: number;
  segments: GraduationSegment[];
}

export const GRADUATION_RATE_DATA: GraduationRateData = {
  totalActive: 30,
  graduated: 11,
  rate: 37,
  totalParticipants: 36,
  notGraduated: 25,
  segments: [
    { labelKey: 'requestorDashboard.graduationCriteria.rate.notOnboarded', value: 4, percent: 11, color: '#9CA3AF' },
    { labelKey: 'requestorDashboard.graduationCriteria.rate.onboarded', value: 2, percent: 6, color: '#60A5FA' },
    { labelKey: 'requestorDashboard.graduationCriteria.rate.inProgress', value: 15, percent: 42, color: '#F59E0B' },
    { labelKey: 'requestorDashboard.graduationCriteria.rate.graduated', value: 11, percent: 31, color: '#22C55E' },
    { labelKey: 'requestorDashboard.graduationCriteria.rate.droppedOff', value: 2, percent: 6, color: '#EF4444' },
  ],
};

export interface GraduationRateItemConfig {
  key: string;
  labelKey: string;
  color: string;
  icon?: string;
  hasDot?: boolean;
  isTotal?: boolean;
  isNotGraduated?: boolean;
}

export const GRADUATION_RATE_ITEMS: GraduationRateItemConfig[] = [
  {
    key: 'totalParticipants',
    labelKey: 'requestorDashboard.graduationCriteria.rate.totalParticipants',
    color: '#4B5563',
    icon: 'Users',
    isTotal: true,
  },
  {
    key: 'notOnboarded',
    labelKey: 'requestorDashboard.graduationCriteria.rate.notOnboarded',
    color: '#9CA3AF',
    icon: 'UserX',
  },
  {
    key: 'onboarded',
    labelKey: 'requestorDashboard.graduationCriteria.rate.onboarded',
    color: '#60A5FA',
    icon: 'UserCheck',
  },
  {
    key: 'inProgress',
    labelKey: 'requestorDashboard.graduationCriteria.rate.inProgress',
    color: '#F59E0B',
    icon: 'Clock',
  },
  {
    key: 'graduated',
    labelKey: 'requestorDashboard.graduationCriteria.rate.graduated',
    color: '#22C55E',
    icon: 'Award',
  },
  {
    key: 'droppedOff',
    labelKey: 'requestorDashboard.graduationCriteria.rate.droppedOff',
    color: '#EF4444',
    icon: 'XCircle',
  },
  {
    key: 'notGraduated',
    labelKey: 'requestorDashboard.graduationCriteria.rate.notGraduated',
    color: '#374151',
    icon: 'Info',
    isNotGraduated: true,
  },
];

export interface IndicatorStatus {
  value: number;
  percent: number;
}

export interface GraduationIndicator {
  key: string;
  titleKey: string;
  categoryKey: string;
  icon: string;
  note?: string;
  achieved: IndicatorStatus;
  onTrack: IndicatorStatus;
  atRisk: IndicatorStatus;
}

export const GRADUATION_INDICATORS: GraduationIndicator[] = [
  {
    key: 'activeIGA',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.activeIGA',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.livelihoods',
    icon: 'Briefcase',
    achieved: { value: 11, percent: 31 },
    onTrack: { value: 11, percent: 31 },
    atRisk: { value: 7, percent: 19 },
  },
  {
    key: 'businessProfitability',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.businessProfitability',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.livelihoods',
    icon: 'TrendingUp',
    note: 'entrepreneurship only',
    achieved: { value: 8, percent: 22 },
    onTrack: { value: 9, percent: 25 },
    atRisk: { value: 6, percent: 17 },
  },
  {
    key: 'participantIncome',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.participantIncome',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.livelihoods',
    icon: 'DollarSign',
    achieved: { value: 16, percent: 44 },
    onTrack: { value: 15, percent: 42 },
    atRisk: { value: 10, percent: 28 },
  },
  {
    key: 'assetAccumulation',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.assetAccumulation',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.livelihoods',
    icon: 'Award',
    achieved: { value: 16, percent: 44 },
    onTrack: { value: 15, percent: 42 },
    atRisk: { value: 9, percent: 25 },
  },
  {
    key: 'savingsAmount',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.savingsAmount',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.financialInclusion',
    icon: 'DollarSign',
    achieved: { value: 10, percent: 28 },
    onTrack: { value: 11, percent: 31 },
    atRisk: { value: 7, percent: 19 },
  },
  {
    key: 'savingsFrequency',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.savingsFrequency',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.financialInclusion',
    icon: 'Clock',
    achieved: { value: 17, percent: 47 },
    onTrack: { value: 16, percent: 44 },
    atRisk: { value: 10, percent: 28 },
  },
  {
    key: 'financialRecordKeeping',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.financialRecordKeeping',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.financialInclusion',
    icon: 'Clock',
    achieved: { value: 10, percent: 28 },
    onTrack: { value: 11, percent: 31 },
    atRisk: { value: 7, percent: 19 },
  },
  {
    key: 'responsibleCreditUsage',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.responsibleCreditUsage',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.financialInclusion',
    icon: 'XCircle',
    achieved: { value: 16, percent: 44 },
    onTrack: { value: 15, percent: 42 },
    atRisk: { value: 9, percent: 25 },
  },
  {
    key: 'selfEsteemConfidence',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.selfEsteemConfidence',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.socialEmpowerment',
    icon: 'Users',
    achieved: { value: 8, percent: 22 },
    onTrack: { value: 10, percent: 28 },
    atRisk: { value: 6, percent: 17 },
  },
  {
    key: 'agencyControl',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.agencyControl',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.socialEmpowerment',
    icon: 'Users',
    achieved: { value: 15, percent: 42 },
    onTrack: { value: 14, percent: 39 },
    atRisk: { value: 9, percent: 25 },
  },
  {
    key: 'attitudesViolenceGBV',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.attitudesViolenceGBV',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.genderEquality',
    icon: 'Heart',
    achieved: { value: 10, percent: 28 },
    onTrack: { value: 11, percent: 31 },
    atRisk: { value: 7, percent: 19 },
  },
  {
    key: 'decisionMakingGenderEquality',
    titleKey: 'requestorDashboard.graduationCriteria.indicators.decisionMakingGenderEquality',
    categoryKey: 'requestorDashboard.graduationCriteria.indicators.genderEquality',
    icon: 'Users',
    achieved: { value: 9, percent: 25 },
    onTrack: { value: 10, percent: 28 },
    atRisk: { value: 6, percent: 17 },
  },
];

export interface SubCriterionConfig {
  key: string;
  labelKey: string;
  descKey: string;
  note?: string;
}

export interface CategoryConfig {
  key: string;
  labelKey: string;
  icon: string;
  subCriteria: SubCriterionConfig[];
}

export const GRADUATION_CRITERIA_CATEGORIES: CategoryConfig[] = [
  {
    key: 'livelihoods',
    labelKey: 'requestorDashboard.graduationCriteria.indicators.livelihoods',
    icon: 'Briefcase',
    subCriteria: [
      {
        key: 'activeIGA',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.activeIGA',
        descKey: 'requestorDashboard.graduationCriteria.checklist.activeIGA.desc',
      },
      {
        key: 'businessProfitability',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.businessProfitability',
        descKey: 'requestorDashboard.graduationCriteria.checklist.businessProfitability.desc',
        note: 'entrepreneurship only',
      },
      {
        key: 'participantIncome',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.participantIncome',
        descKey: 'requestorDashboard.graduationCriteria.checklist.participantIncome.desc',
      },
      {
        key: 'assetAccumulation',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.assetAccumulation',
        descKey: 'requestorDashboard.graduationCriteria.checklist.assetAccumulation.desc',
      },
    ],
  },
  {
    key: 'financialInclusion',
    labelKey: 'requestorDashboard.graduationCriteria.indicators.financialInclusion',
    icon: 'DollarSign',
    subCriteria: [
      {
        key: 'savingsAmount',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.savingsAmount',
        descKey: 'requestorDashboard.graduationCriteria.checklist.savingsAmount.desc',
      },
      {
        key: 'savingsFrequency',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.savingsFrequency',
        descKey: 'requestorDashboard.graduationCriteria.checklist.savingsFrequency.desc',
      },
      {
        key: 'financialRecordKeeping',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.financialRecordKeeping',
        descKey: 'requestorDashboard.graduationCriteria.checklist.financialRecordKeeping.desc',
      },
      {
        key: 'responsibleCreditUsage',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.responsibleCreditUsage',
        descKey: 'requestorDashboard.graduationCriteria.checklist.responsibleCreditUsage.desc',
      },
    ],
  },
  {
    key: 'socialEmpowerment',
    labelKey: 'requestorDashboard.graduationCriteria.indicators.socialEmpowerment',
    icon: 'Users',
    subCriteria: [
      {
        key: 'selfEsteemConfidence',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.selfEsteemConfidence',
        descKey: 'requestorDashboard.graduationCriteria.checklist.selfEsteemConfidence.desc',
      },
      {
        key: 'agencyControl',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.agencyControl',
        descKey: 'requestorDashboard.graduationCriteria.checklist.agencyControl.desc',
      },
    ],
  },
  {
    key: 'genderEquality',
    labelKey: 'requestorDashboard.graduationCriteria.indicators.genderEquality',
    icon: 'Heart',
    subCriteria: [
      {
        key: 'attitudesViolenceGBV',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.attitudesViolenceGBV',
        descKey: 'requestorDashboard.graduationCriteria.checklist.attitudesViolenceGBV.desc',
      },
      {
        key: 'decisionMakingGenderEquality',
        labelKey: 'requestorDashboard.graduationCriteria.indicators.decisionMakingGenderEquality',
        descKey: 'requestorDashboard.graduationCriteria.checklist.decisionMakingGenderEquality.desc',
      },
    ],
  },
];

export interface ParticipantGraduationCriteria {
  [key: string]: 'Achieved' | 'On Track' | 'At Risk';
}

export function getParticipantGraduationCriteria(participantId: string): ParticipantGraduationCriteria {
  // If Sizwe Mkhize (ID: 1005), return exact statuses to match the reference images
  if (participantId === '1005') {
    return {
      activeIGA: 'Achieved',
      businessProfitability: 'On Track',
      participantIncome: 'At Risk',
      assetAccumulation: 'On Track',
      savingsAmount: 'On Track',
      savingsFrequency: 'Achieved',
      financialRecordKeeping: 'Achieved',
      responsibleCreditUsage: 'Achieved',
      selfEsteemConfidence: 'On Track',
      agencyControl: 'Achieved',
      attitudesViolenceGBV: 'On Track',
      decisionMakingGenderEquality: 'At Risk',
    };
  }

  // Generate deterministically for other participants
  const result: ParticipantGraduationCriteria = {};
  const keys = [
    'activeIGA',
    'businessProfitability',
    'participantIncome',
    'assetAccumulation',
    'savingsAmount',
    'savingsFrequency',
    'financialRecordKeeping',
    'responsibleCreditUsage',
    'selfEsteemConfidence',
    'agencyControl',
    'attitudesViolenceGBV',
    'decisionMakingGenderEquality',
  ];

  keys.forEach((key, index) => {
    const idNum = parseInt(participantId.replace(/\D/g, '')) || 0;
    const val = (idNum + index) % 3;
    if (val === 0) {
      result[key] = 'Achieved';
    } else if (val === 1) {
      result[key] = 'On Track';
    } else {
      result[key] = 'At Risk';
    }
  });

  return result;
}

