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
    icon: 'FileText',
    status: {
      type: 'in-progress',
      label: 'participantDetail.assessmentSurveys.status.percentComplete',
      percentage: 0,
    },
    actionButton: {
      label: 'participantDetail.assessmentSurveys.midlineSurvey.actionButton',
      icon: 'FileText',
      variant: 'primary',
    },
    // Midline Survey shows for all statuses except 'dropout'
    visibilityRules: {
      hideForStatuses: ['dropout'],
    },
  },
  {
    id: 'graduation-readiness-survey',
    title: 'participantDetail.assessmentSurveys.graduationReadiness.title',
    description: 'participantDetail.assessmentSurveys.graduationReadiness.description',
    additionalInfo: 'participantDetail.assessmentSurveys.graduationReadiness.additionalInfo',
    icon: 'FileText',
    status: {
      type: 'completed',
      label: 'participantDetail.assessmentSurveys.status.completed',
    },
    actionButton: {
      label: 'participantDetail.assessmentSurveys.graduationReadiness.actionButton',
      icon: 'FileText',
      variant: 'primary',
    },
    // Graduation Readiness Survey shows only for completed participants
    visibilityRules: {
      showForStatuses: ['completed'],
    },
  },
  {
    id: 'endline-survey',
    title: 'participantDetail.assessmentSurveys.endlineSurvey.title',
    description: 'participantDetail.assessmentSurveys.endlineSurvey.description',
    additionalInfo: 'participantDetail.assessmentSurveys.endlineSurvey.additionalInfo',
    icon: 'FileText',
    status: {
      type: 'in-progress',
      label: 'participantDetail.assessmentSurveys.status.percentComplete',
      percentage: 0,
    },
    actionButton: {
      label: 'participantDetail.assessmentSurveys.endlineSurvey.actionButton',
      icon: 'FileText',
      variant: 'primary',
    },
    // Endline Survey shows only for completed participants
    visibilityRules: {
      showForStatuses: ['completed'],
    },
  },
];

