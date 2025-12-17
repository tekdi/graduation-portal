import { AssessmentSurveyCardData } from '@app-types/participant';
import { CARD_STATUS } from './app.constant';
import { theme } from '@config/theme';

/**
 * Log Visit Cards Constant
 * Defines all available log visit cards with their configurations
 * Uses AssessmentSurveyCardData interface to reuse ObservationCard component
 */
export const LOG_VISIT_CARDS: AssessmentSurveyCardData[] = [
  {
    id: 'individual-enterprise-visit',
    title: 'logVisit.individualEnterpriseVisit.title',
    description: 'logVisit.individualEnterpriseVisit.description',
    icon: 'FileText',
    iconColor: theme.tokens.colors.primary500,
    navigationUrl: 'individual-enterprise-visit',
  },
  {
    id: 'group-visit-form',
    title: 'logVisit.groupVisitForm.title',
    description: 'logVisit.groupVisitForm.description',
    icon: 'Users',
    iconColor: theme.tokens.colors.blue500,
    navigationUrl: 'group-visit-form',
  },
  {
    id: 'midline-survey-form',
    title: 'logVisit.midlineSurvey.title',
    description: 'logVisit.midlineSurvey.description',
    icon: 'BarChart',
    iconColor: theme.tokens.colors.warning500,
    navigationUrl: 'midline-survey',
  },
];

