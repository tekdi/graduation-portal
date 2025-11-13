import type { IconName } from '@constants/ICONS';
export interface FeatureCardData {
  id?: string;
  color: string;
  icon: IconName;
  title: string;
  description: string;
  navigationUrl?: string;
  isDisabled?: boolean;
  pressableActionText?: string;
}

export interface FeatureCardProps {
  card: FeatureCardData;
}
