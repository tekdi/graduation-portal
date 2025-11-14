import React from 'react';
import { Box, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import { DataTableProps, ColumnDef } from '@app-types/components';
import ActionsMenu from '../ActionsMenu';

interface TableHeaderProps<T> {
  columns: ColumnDef<T>[];
  showActions?: boolean;
}

const TableHeader = <T,>({ columns, showActions }: TableHeaderProps<T>) => {
  const { t } = useLanguage();

  return (
    <HStack
      bg="$backgroundLight50"
      padding="$4"
      borderBottomColor="$borderLight300"
      space="md"
    >
      {columns.map(column => (
        <Box
          key={column.key}
          flex={column.flex}
          width={column.width}
          alignItems={
            column.align === 'center'
              ? 'center'
              : column.align === 'right'
              ? 'flex-end'
              : 'flex-start'
          }
        >
          <Text {...TYPOGRAPHY.label} color={theme.tokens.colors.foreground}>
            {t(column.label)}
          </Text>
        </Box>
      ))}
      {showActions && (
        <Box width={60}>
          <Text {...TYPOGRAPHY.label} color={theme.tokens.colors.foreground}>
            {t('common.actions')}
          </Text>
        </Box>
      )}
    </HStack>
  );
};

/**
 * Table Row Component
 */
interface TableRowProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
  onActionClick?: (item: T) => void;
  showActions?: boolean;
}

const TableRow = <T,>({
  item,
  columns,
  onRowClick,
  onActionClick,
  showActions,
}: TableRowProps<T>) => (
  <Pressable
    onPress={() => onRowClick?.(item)}
    $web-cursor={onRowClick ? 'pointer' : undefined}
  >
    <HStack
      padding="$4"
      borderBottomWidth={1}
      borderBottomColor="$borderLight200"
      space="md"
      alignItems="center"
      $web-transition="background-color 0.2s"
      overflow="visible"
      sx={{
        ':hover': {
          bg: '$backgroundLight50',
        },
      }}
    >
      {columns.map(column => (
        <Box
          key={column.key}
          flex={column.flex}
          width={column.width}
          alignItems={
            column.align === 'center'
              ? 'center'
              : column.align === 'right'
              ? 'flex-end'
              : 'flex-start'
          }
        >
          {column.render ? (
            column.render(item)
          ) : (
            <Text
              {...TYPOGRAPHY.paragraph}
              color={theme.tokens.colors.mutedForeground}
            >
              {String((item as any)[column.key] || '')}
            </Text>
          )}
        </Box>
      ))}
      {showActions && (
        <Box width={60} alignItems="center" position="relative" zIndex={1}>
          <ActionsMenu<T> item={item} onDropout={onActionClick} />
        </Box>
      )}
    </HStack>
  </Pressable>
);

/**
 * Empty State Component
 */
interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  const { t } = useLanguage();

  return (
    <Box padding="$8" alignItems="center">
      <Text
        {...TYPOGRAPHY.paragraph}
        color={theme.tokens.colors.mutedForeground}
      >
        {message || t('common.noDataFound')}
      </Text>
    </Box>
  );
};

/**
 * Loading State Component
 */
interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  const { t } = useLanguage();

  return (
    <Box padding="$8" alignItems="center">
      <Text
        {...TYPOGRAPHY.paragraph}
        color={theme.tokens.colors.mutedForeground}
      >
        {message || t('common.loading')}
      </Text>
    </Box>
  );
};

const DataTable = <T,>({
  data,
  columns,
  onRowClick,
  onActionClick,
  isLoading = false,
  emptyMessage,
  loadingMessage,
  showActions = false,
  getRowKey,
}: DataTableProps<T>) => {
  return (
    <Box
      bg={theme.tokens.colors.backgroundPrimary.light}
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$borderLight300"
    >
      <TableHeader columns={columns} showActions={showActions} />
      <Box maxHeight={600} overflow="hidden">
        <ScrollView>
          {isLoading ? (
            <LoadingState message={loadingMessage} />
          ) : data.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            data.map(item => (
              <TableRow
                key={getRowKey(item)}
                item={item}
                columns={columns}
                onRowClick={onRowClick}
                onActionClick={onActionClick}
                showActions={showActions}
              />
            ))
          )}
        </ScrollView>
      </Box>
    </Box>
  );
};

export default DataTable;
