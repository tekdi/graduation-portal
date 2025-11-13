export interface FeatureCardData {
  id?: string;
  color: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  navigationUrl?: string;
  isDisabled?: boolean;
  pressableActionText?: string;
}

export interface FeatureCardProps {
  card: FeatureCardData;
}
