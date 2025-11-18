import { theme } from '@config/theme';
import { FeatureCardData } from '@app-types/components';

export const WELCOME_CARDS: FeatureCardData[] = [
  {
    id: 'my-participants',
    color: theme.tokens.colors.primary500,
    icon: 'user',
    title: 'welcome.myParticipants',
    description: 'welcome.myParticipantsDescription',
    navigationUrl: 'participants',
    isDisabled: false,
    pressableActionText: 'welcome.getStarted',
  },
  {
    id: 'learning-progress',
    color: theme.tokens.colors.info100,
    icon: 'chart',
    title: 'welcome.myLearningProgress',
    description: 'welcome.myLearningProgressDescription',
    navigationUrl: 'learning-progress',
    isDisabled: false,
    pressableActionText: 'welcome.getStarted',
  },
  {
    id: 'connect-experts',
    color: theme.tokens.colors.accent200,
    icon: 'chat',
    title: 'welcome.connectWithExperts',
    description: 'welcome.connectWithExpertsDescription',
    navigationUrl: 'connect-experts',
    isDisabled: true,
    pressableActionText: 'welcome.getStarted',
  },
];
