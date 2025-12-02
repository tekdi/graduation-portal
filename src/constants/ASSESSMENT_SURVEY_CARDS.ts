import { AssessmentSurveyCardData } from '@app-types/participant';

/**
 * Assessment Survey Cards Mock Data
 * Defines all available assessment survey cards with their configurations
 */
export const ASSESSMENT_SURVEY_CARDS: AssessmentSurveyCardData[] = [
  {
    id: 'household-profile',
    title: 'participantDetail.assessmentSurveys.householdProfile.title',
    description: 'participantDetail.assessmentSurveys.householdProfile.description',
    icon: 'Users',
    status: {
      type: 'not-started',
      label: 'participantDetail.assessmentSurveys.status.notStarted',
    },
    actionButton: {
      label: 'participantDetail.assessmentSurveys.householdProfile.actionButton',
      icon: 'FileText',
      variant: 'secondary',
    },
    // Household Profile is visible for all statuses
  },
  {
    id: 'midline-survey',
    title: 'participantDetail.assessmentSurveys.midlineSurvey.title',
    description: 'participantDetail.assessmentSurveys.midlineSurvey.description',
    additionalInfo: 'participantDetail.assessmentSurveys.midlineSurvey.additionalInfo',
    icon: 'ClipboardCheck',
    status: {
      type: 'in-progress',
      label: 'participantDetail.assessmentSurveys.status.percentComplete',
      percentage: 0,
    },
    actionButton: {
      label: 'participantDetail.assessmentSurveys.midlineSurvey.actionButton',
      icon: 'ClipboardCheck',
      variant: 'primary',
    },
    // Midline Survey only shows when status is 'completed'
    visibilityRules: {
      showForStatuses: ['completed'],
    },
  },
  {
    id: 'graduation-readiness-survey',
    title: 'participantDetail.assessmentSurveys.graduationReadiness.title',
    description: 'participantDetail.assessmentSurveys.graduationReadiness.description',
    additionalInfo: 'participantDetail.assessmentSurveys.graduationReadiness.additionalInfo',
    icon: 'Award',
    status: {
      type: 'graduated',
      label: 'participantDetail.assessmentSurveys.status.graduated',
    },
    actionButton: {
      label: 'participantDetail.assessmentSurveys.graduationReadiness.actionButton',
      icon: 'FileText',
      variant: 'secondary',
    },
    // Graduation Readiness Survey only shows when status is 'completed'
    visibilityRules: {
      showForStatuses: ['completed'],
    },
  },
  {
    id: 'endline-survey',
    title: 'participantDetail.assessmentSurveys.endlineSurvey.title',
    description: 'participantDetail.assessmentSurveys.endlineSurvey.description',
    additionalInfo: 'participantDetail.assessmentSurveys.endlineSurvey.additionalInfo',
    icon: 'ClipboardCheck',
    status: {
      type: 'in-progress',
      label: 'participantDetail.assessmentSurveys.status.percentComplete',
      percentage: 0,
    },
    actionButton: {
      label: 'participantDetail.assessmentSurveys.endlineSurvey.actionButton',
      icon: 'ClipboardCheck',
      variant: 'primary',
    },
    // Endline Survey shows for all statuses except 'dropout'
    visibilityRules: {
      hideForStatuses: ['dropout'],
    },
  },
];

