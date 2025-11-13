import React from 'react';
import Icon from '@ui/Icon';
import { theme } from '@config/theme';
import { FeatureCardData } from '@app-types/components';

export const WELCOME_CARDS: FeatureCardData[] = [
  {
    id: 'my-participants',
    color: theme.tokens.colors.primary500,
    icon: <Icon name="user" size={32} />,
    title: 'welcome.myParticipants',
    description: 'welcome.myParticipantsDescription',
    navigationUrl: 'participants',
    isDisabled: false,
    pressableActionText: 'welcome.getStarted',
  },
  {
    id: 'learning-progress',
    color: theme.tokens.colors.info100,
    icon: <Icon name="chart" size={32} />,
    title: 'welcome.myLearningProgress',
    description: 'welcome.myLearningProgressDescription',
    navigationUrl: 'learning-progress',
    isDisabled: false,
    pressableActionText: 'welcome.getStarted',
  },
  {
    id: 'connect-experts',
    color: theme.tokens.colors.accent200,
    icon: <Icon name="chat" size={32} />,
    title: 'welcome.connectWithExperts',
    description: 'welcome.connectWithExpertsDescription',
    navigationUrl: 'connect-experts',
    isDisabled: true,
    pressableActionText: 'welcome.getStarted',
  },
];
