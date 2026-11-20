// Static configuration for Step 2 of Participant Reassign. Text lives in i18n (labelKey).
export const REASSIGNMENT_REASONS = [
  { value: 'workload_rebalancing', labelKey: 'admin.assignUsers.participantReassign.step2.reasons.workloadRebalancing' },
  { value: 'lc_leave_resignation', labelKey: 'admin.assignUsers.participantReassign.step2.reasons.lcLeaveResignation' },
  { value: 'participant_relocation', labelKey: 'admin.assignUsers.participantReassign.step2.reasons.participantRelocation' },
  { value: 'coaching_fit', labelKey: 'admin.assignUsers.participantReassign.step2.reasons.coachingFit' },
  { value: 'performance_realignment', labelKey: 'admin.assignUsers.participantReassign.step2.reasons.performanceRealignment' },
  { value: 'program_restructuring', labelKey: 'admin.assignUsers.participantReassign.step2.reasons.programRestructuring' },
  { value: 'other', labelKey: 'admin.assignUsers.participantReassign.step2.reasons.other' },
] as const;

export const DEFAULT_REASON = REASSIGNMENT_REASONS[0].value;
