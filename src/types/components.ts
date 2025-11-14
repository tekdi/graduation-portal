import type { IconName } from '@constants/ICONS';
import { ReactNode } from 'react';
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

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchText: string) => void;
  debounceMs?: number;
  defaultValue?: string;
}

export interface TabData {
  key: string;
  label: string;
  isDisabled?: boolean;
}

export interface TabButtonProps {
  tab: TabData;
  isActive: boolean;
  onPress: (tabKey: string) => void;
}

export interface ColumnDef<T> {
  key: string;
  label: string;
  flex?: number;
  width?: number;
  render?: (item: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
  onActionClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  showActions?: boolean;
  getRowKey: (item: T) => string;
}
