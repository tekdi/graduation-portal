import React, { useState } from 'react';
import { Box, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import { DataTableProps, ColumnDef } from '@app-types/components';
// import ActionsMenu from '@components/ActionsMenu';
import { CustomMenu } from '@components/ui/Menu';
import { LucideIcon } from '@components/ui';
import { Modal } from '@ui';

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
}: TableRowProps<T>) => {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [showDropoutModal, setShowDropoutModal] = useState(false);
  const [dropoutReason, setDropoutReason] = useState('');

  // Get item name and ID for the modal
  const itemName = (item as any)?.name || (item as any)?.id || 'participant';
  const itemId = (item as any)?.id;

  const handleMenuSelect = (key: string) => {
    if (key === 'view-details') {
      // @ts-ignore - Navigation type inference
      navigation.navigate('participant-detail', { participantId: itemId });
    } else if (key === 'log-visit') {
      // @ts-ignore - Navigation type inference
      navigation.navigate('log-visit', { participantId: itemId });
    } else if (key === 'dropout') {
      // Show confirmation modal
      setTimeout(() => {
        setShowDropoutModal(true);
      }, 100);
    }
  };

  const handleDropoutConfirm = (reason?: string) => {
    setShowDropoutModal(false);
    setDropoutReason(reason ?? ''); // Reset reason
    onActionClick?.(item);
  };

  const customTrigger = (triggerProps: any) => (
    <Pressable
      {...triggerProps}
      padding="$2"
      borderRadius="$sm"
      $web-cursor="pointer"
      sx={{
        ':hover': {
          bg: '$backgroundLight100',
        },
      }}
    >
      <LucideIcon
        name="MoreVertical"
        size={20}
        color={theme.tokens.colors.mutedForeground}
      />
    </Pressable>
  );

  return (
    <>
      <Box position="relative">
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
                    {String((item as any)[column.key] ?? '')}
                  </Text>
                )}
              </Box>
            ))}
            {showActions && (
              <Box width={60} alignItems="center">
                {/* <ActionsMenu<T> item={item} onDropout={onActionClick} /> */}
                <CustomMenu
                  items={[
                    {
                      key: 'view-details',
                      label: 'actions.viewDetails',
                      textValue: 'View Details',
                      iconElement: (
                        <Box marginRight="$2">
                          <LucideIcon
                            name="Eye"
                            size={20}
                            color={theme.tokens.colors.mutedForeground}
                          />
                        </Box>
                      ),
                    },
                    {
                      key: 'log-visit',
                      label: 'actions.logVisit',
                      textValue: 'Log Visit',
                      iconElement: (
                        <Box marginRight="$2">
                          <LucideIcon
                            name="ClipboardCheck"
                            size={20}
                            color={theme.tokens.colors.mutedForeground}
                          />
                        </Box>
                      ),
                    },
                    {
                      key: 'dropout',
                      label: 'actions.dropout',
                      textValue: 'Dropout',
                      iconElement: (
                        <Box marginRight="$2">
                          <LucideIcon
                            name="UserX"
                            size={20}
                            color={theme.tokens.colors.error.light}
                          />
                        </Box>
                      ),
                      color: theme.tokens.colors.error.light,
                    },
                  ]}
                  placement="bottom right"
                  offset={5}
                  trigger={customTrigger}
                  onSelect={handleMenuSelect}
                />
              </Box>
            )}
          </HStack>
        </Pressable>
      </Box>

      {/* Dropout Confirmation Modal */}
      <Modal
        isOpen={showDropoutModal}
        onClose={() => {
          setShowDropoutModal(false);
          setDropoutReason(''); // Reset on close
        }}
        onConfirm={handleDropoutConfirm}
        title={t('actions.confirmDropout') || 'Confirm Dropout'}
        message={
          t('actions.dropoutMessage', { name: itemName }) ||
          `Mark ${itemName} as dropout from the program`
        }
        confirmText={t('actions.confirmDropout') || 'Confirm Dropout'}
        cancelText={t('common.cancel') || 'Cancel'}
        confirmButtonColor={theme.tokens.colors.error.light}
        headerIcon={
          <LucideIcon
            name="UserX"
            size={24}
            color={theme.tokens.colors.error.light}
          />
        }
        showInput
        inputLabel={t('actions.dropoutReasonLabel') || 'Reason for Dropout'}
        inputPlaceholder={
          t('actions.dropoutReasonPlaceholder') || 'Enter reason for dropout...'
        }
        inputHint={
          t('actions.dropoutHint') ||
          'This will change the participant\'s status to "Not Enrolled" and log the action in their history.'
        }
        inputValue={dropoutReason}
        onInputChange={setDropoutReason}
        inputRequired={false}
        maxWidth={500}
      />
    </>
  );
};

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
        {message ? t(message) : t('common.noDataFound')}
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
      overflow="visible"
    >
      <TableHeader columns={columns} showActions={showActions} />
      <Box maxHeight={600} overflow="scroll">
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
