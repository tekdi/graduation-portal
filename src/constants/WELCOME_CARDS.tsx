import React from 'react';
import Icon from '@ui/Icon';
import { theme } from '@config/theme';
import { FeatureCardProps } from '@app-types/components';

export const WELCOME_CARDS: FeatureCardProps[] = [
  {
    id: 'my-participants',
    color: theme.tokens.colors.primary500,
    icon: <Icon name="user" size={32} />,
    title: 'welcome.MyParticipants',
    description: 'welcome.MyParticipantsDescription',
    navigationUrl: 'participants',
    isDisabled: false,
    pressableActionText: 'welcome.GetStarted',
  },
  {
    id: 'learning-progress',
    color: theme.tokens.colors.info100,
    icon: <Icon name="chart" size={32} />,
    title: 'welcome.MyLearningProgress',
    description: 'welcome.MyLearningProgressDescription',
    navigationUrl: 'LearningProgress',
    isDisabled: false,
    pressableActionText: 'welcome.GetStarted',
  },
  {
    id: 'connect-experts',
    color: theme.tokens.colors.accent200,
    icon: <Icon name="chat" size={32} />,
    title: 'welcome.ConnectWithExperts',
    description: 'welcome.ConnectWithExpertsDescription',
    navigationUrl: 'ConnectExperts',
    isDisabled: true,
    pressableActionText: 'welcome.GetStarted',
  },
];
