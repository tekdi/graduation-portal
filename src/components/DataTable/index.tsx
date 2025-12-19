import React, { useState, useEffect } from 'react';
import { Box, HStack, Text, Pressable, VStack } from '@ui';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { useLanguage } from '@contexts/LanguageContext';
import { DataTableProps, ColumnDef, PaginationConfig } from '@app-types/components';
import { CustomMenu } from '@components/ui/Menu';
import { LucideIcon } from '@components/ui';
import { Modal, Input, InputField } from '@ui';
import { usePlatform } from '@utils/platform';
import PaginationControls from './PaginationControls';
import { styles } from './Styles';

/**
 * Shared menu items configuration for actions menu
 */
const getMenuItems = (t: (key: string) => string) => [
  {
    key: 'view-log',
    label: 'actions.viewLog',
    textValue: 'View Log',
    iconElement: (
      <Box {...styles.menuIconContainer}>
        <LucideIcon
          name="FileText"
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
      <Box {...styles.menuIconContainer}>
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
      <Box {...styles.menuIconContainer}>
        <LucideIcon
          name="UserX"
          size={20}
          color={theme.tokens.colors.error.light}
        />
      </Box>
    ),
    color: theme.tokens.colors.error.light,
  },
];

/**
 * Shared custom trigger for actions menu
 */
const getCustomTrigger = (triggerProps: any) => (
  <Pressable {...triggerProps} {...styles.customTrigger}>
    <LucideIcon
      name="MoreVertical"
      size={20}
      color={theme.tokens.colors.textForeground}
    />
  </Pressable>
);

interface TableHeaderProps<T> {
  columns: ColumnDef<T>[];
  showActions?: boolean;
  minWidth?: number; // Minimum width for horizontal scroll on mobile
  isMobile?: boolean; // Whether this is mobile view
}

const TableHeader = <T,>({ columns, showActions, minWidth, isMobile = false }: TableHeaderProps<T>) => {
  const { t } = useLanguage();

  // Filter columns based on device-specific config
  const visibleColumns = columns.filter(column => {
    if (isMobile) {
      // Mobile: mobileConfig.showColumn > default true
      const mobileConfig = column.mobileConfig || {};
      if (mobileConfig.showColumn !== undefined) {
        return mobileConfig.showColumn;
      }
    } else {
      // Desktop: desktopConfig.showColumn > default true
      const desktopConfig = column.desktopConfig || {};
      if (desktopConfig.showColumn !== undefined) {
        return desktopConfig.showColumn;
      }
    }
    // Default to true if not specified
    return true;
  });

  return (
    <HStack
      {...styles.tableHeader}
      minWidth={minWidth}
    >
      {visibleColumns.map(column => {
        // Determine showLabel: device-specific config > default true
        let showLabel = true;
        if (isMobile) {
          // Mobile: mobileConfig.showLabel > default true
          if (column.mobileConfig?.showLabel !== undefined) {
            showLabel = column.mobileConfig.showLabel;
          }
        } else {
          // Desktop: desktopConfig.showLabel > default true
          if (column.desktopConfig?.showLabel !== undefined) {
            showLabel = column.desktopConfig.showLabel;
          }
        }

        return (
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
            {showLabel && (
              <Text {...TYPOGRAPHY.label} color={theme.tokens.colors.foreground}>
                {t(column.label)}
              </Text>
            )}
          </Box>
        );
      })}
      {showActions && (
        <Box width={180}>
          <Text {...TYPOGRAPHY.label} color={theme.tokens.colors.foreground}>
            {t('common.actions')}
          </Text>
        </Box>
      )}
    </HStack>
  );
};

/**
 * Custom Hook for Row Actions
 * Shared logic for handling menu actions and dropout modal
 */
function useRowActions<T>(item: T, onActionClick?: (item: T) => void) {
  const navigation = useNavigation();
  const [showDropoutModal, setShowDropoutModal] = useState(false);
  const [dropoutReason, setDropoutReason] = useState('');

  const itemName = (item as any)?.name || (item as any)?.id || 'participant';
  const itemId = (item as any)?.id;

  const handleViewDetails = () => {
    // @ts-ignore - Navigation type inference
    navigation.navigate('participant-detail', { id: itemId });
  };

  const handleMenuSelect = (key: string) => {
    if (key === 'log-visit') {
      // @ts-ignore - Navigation type inference
      navigation.push('log-visit', { participantId: itemId });
    } else if (key === 'view-log') {
      // @ts-ignore - Navigation type inference
      navigation.navigate('participant-detail', { id: itemId });
    } else if (key === 'dropout') {
      setShowDropoutModal(true);
    }
  };

  const handleDropoutConfirm = (reason?: string) => {
    setShowDropoutModal(false);
    setDropoutReason(reason ?? ''); // Reset reason
    onActionClick?.(item);
  };

  const handleCloseModal = () => {
    setShowDropoutModal(false);
    setDropoutReason('');
  };

  return {
    itemName,
    showDropoutModal,
    dropoutReason,
    setDropoutReason,
    handleViewDetails,
    handleMenuSelect,
    handleDropoutConfirm,
    handleCloseModal,
  };
}

/**
 * Dropout Confirmation Modal Component
 * Shared modal component for both TableRow and CardView
 */
interface DropoutModalProps {
  isOpen: boolean;
  itemName: string;
  dropoutReason: string;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  onReasonChange: (reason: string) => void;
}

const DropoutModal: React.FC<DropoutModalProps> = ({
  isOpen,
  itemName,
  dropoutReason,
  onClose,
  onConfirm,
  onReasonChange,
}) => {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerTitle={t('actions.confirmDropout') || 'Confirm Dropout'}
      headerIcon={
        <LucideIcon
          name="UserX"
          size={24}
          color={theme.tokens.colors.error.light}
        />
      }
      maxWidth={500}
      cancelButtonText={t('common.cancel') || 'Cancel'}
      confirmButtonText={t('actions.confirmDropout') || 'Confirm Dropout'}
      onCancel={onClose}
      onConfirm={() => onConfirm(dropoutReason)}
      confirmButtonColor={theme.tokens.colors.error.light}
    >
      <VStack space="lg">
        <Text
          {...TYPOGRAPHY.paragraph}
          color={theme.tokens.colors.textSecondary}
          lineHeight="$xl"
        >
          {t('actions.dropoutMessage', { name: itemName }) ||
            `Mark ${itemName} as dropout from the program`}
        </Text>

        <VStack space="sm">
          <Text
            {...TYPOGRAPHY.label}
            color={theme.tokens.colors.textPrimary}
            fontWeight="$medium"
          >
            {t('actions.dropoutReasonLabel') || 'Reason for Dropout'}
          </Text>
          <Input
            {...styles.modalInput}
            borderColor={theme.tokens.colors.inputBorder}
            bg={theme.tokens.colors.modalBackground}
            $focus-borderColor={theme.tokens.colors.inputFocusBorder}
            $focus-borderWidth={2}
          >
            <InputField
              placeholder={
                t('actions.dropoutReasonPlaceholder') || 'Enter reason for dropout...'
              }
              value={dropoutReason}
              onChangeText={onReasonChange}
              {...styles.modalInputField}
              placeholderTextColor={theme.tokens.colors.textMuted}
            />
          </Input>
          <Text
            {...TYPOGRAPHY.bodySmall}
            color={theme.tokens.colors.textSecondary}
            lineHeight="$sm"
          >
            {t('actions.dropoutHint') ||
              'This will change the participant\'s status to "Not Enrolled" and log the action in their history.'}
          </Text>
        </VStack>
      </VStack>
    </Modal>
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
  minWidth?: number; // Minimum width for horizontal scroll on mobile
  isLast?: boolean; // Whether this is the last row
}

const TableRow = <T,>({
  item,
  columns,
  onRowClick,
  onActionClick,
  showActions,
  minWidth,
  isLast = false,
}: TableRowProps<T>) => {
  const { t } = useLanguage();
  const {
    itemName,
    showDropoutModal,
    dropoutReason,
    setDropoutReason,
    handleViewDetails,
    handleMenuSelect,
    handleDropoutConfirm,
    handleCloseModal,
  } = useRowActions(item, onActionClick);

  return (
    <>
      <Box position="relative">
        <Pressable
          onPress={() => onRowClick?.(item)}
          $web-cursor={onRowClick ? 'pointer' : undefined}
        >
          <HStack
            {...styles.tableRow}
            borderBottomWidth={isLast ? styles.tableRowLast.borderBottomWidth : styles.tableRowNotLast.borderBottomWidth}
            minWidth={minWidth}
          >
            {columns
              .filter(column => {
                // Filter columns for desktop: desktopConfig.showColumn > default true
                const desktopConfig = column.desktopConfig || {};
                if (desktopConfig.showColumn !== undefined) {
                  return desktopConfig.showColumn;
                }
                return true; // Default to true if not specified
              })
              .map(column => (
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
              <Box width={180}>
                <HStack space="sm" alignItems="center">
                  {/* View Details Button */}
                  <Pressable
                    onPress={handleViewDetails}
                    {...styles.viewDetailsButton}
                  >
                    <Text
                      {...TYPOGRAPHY.bodySmall}
                      color="$primary500" fontWeight="$medium"
                    >
                      {t('actions.viewDetails')}
                    </Text>
                  </Pressable>
                  
                  {/* Actions Menu */}
                <CustomMenu
                  items={getMenuItems(t)}
                  placement="bottom right"
                  offset={5}
                  trigger={getCustomTrigger}
                  onSelect={handleMenuSelect}
                />
                </HStack>
              </Box>
            )}
          </HStack>
        </Pressable>
      </Box>

      {/* Dropout Confirmation Modal */}
      <DropoutModal
        isOpen={showDropoutModal}
        itemName={itemName}
        dropoutReason={dropoutReason}
        onClose={handleCloseModal}
        onConfirm={handleDropoutConfirm}
        onReasonChange={setDropoutReason}
      />
    </>
  );
};

/**
 * Prepare Final Layout Function
 * Based on mobile_form_layout_development_approach.md
 * Categorizes and sorts columns by leftRank, rightRank, and fullWidthRank
 */
function prepareFinalLayout<T>(columns: ColumnDef<T>[]): Array<Array<ColumnDef<T> | null> | ColumnDef<T>[]> {
  const left: ColumnDef<T>[] = [];
  const right: ColumnDef<T>[] = [];
  const full: ColumnDef<T>[] = [];

  // Filter columns that should be shown on mobile
  const visibleColumns = columns.filter(col => {
    // Mobile: mobileConfig.showColumn > default true
    const mobileConfig = col.mobileConfig || {};
    if (mobileConfig.showColumn !== undefined) {
      return mobileConfig.showColumn;
    }
    return true; // Default to true if not specified
  });

  // Categorize columns based on priority: fullWidthRank > leftRank > rightRank
  visibleColumns.forEach(col => {
    const c = col.mobileConfig || {};

    if (c.fullWidthRank !== undefined) {
      full.push(col);
    } else if (c.leftRank !== undefined) {
      left.push(col);
    } else if (c.rightRank !== undefined) {
      right.push(col);
    }
  });

  // Sort each array by its respective rank
  left.sort((a, b) => (a.mobileConfig?.leftRank || 0) - (b.mobileConfig?.leftRank || 0));
  right.sort((a, b) => (a.mobileConfig?.rightRank || 0) - (b.mobileConfig?.rightRank || 0));
  full.sort((a, b) => (a.mobileConfig?.fullWidthRank || 0) - (b.mobileConfig?.fullWidthRank || 0));

  // Create horizontal rows (left + right pairs)
  const rows: Array<Array<ColumnDef<T> | null>> = [];
  const maxRows = Math.max(left.length, right.length);

  for (let i = 0; i < maxRows; i++) {
    rows.push([left[i] || null, right[i] || null]);
  }

  // Add full-width fields at the end
  if (full.length > 0) {
    rows.push(full);
  }

  return rows;
}

/**
 * Card View Component for Mobile
 * Renders data in card format with left-right pairing and full-width fields
 * View Details and Actions menu always remain at the bottom
 */
interface CardViewProps<T> {
  item: T;
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
  onActionClick?: (item: T) => void;
  showActions?: boolean;
}

const CardView = <T,>({
  item,
  columns,
  onRowClick,
  onActionClick,
  showActions,
}: CardViewProps<T>) => {
  const { t } = useLanguage();
  const {
    itemName,
    showDropoutModal,
    dropoutReason,
    setDropoutReason,
    handleViewDetails,
    handleMenuSelect,
    handleDropoutConfirm,
    handleCloseModal,
  } = useRowActions(item, onActionClick);

  const layout = prepareFinalLayout(columns);

  return (
    <>
      <Box {...styles.cardContainer}>
        <VStack {...styles.cardContent}>
          {/* Render layout rows */}
          {layout.map((row, rowIndex) => {
            // Full width rows
            if (Array.isArray(row) && row.length > 0 && row[0] && (row[0] as ColumnDef<T>).mobileConfig?.fullWidthRank !== undefined) {
              return (
                <VStack key={rowIndex} {...styles.cardFullWidthRow}>
                  {row.map((col, colIndex) => {
                    if (!col) return null;
                    const mobileConfig = col.mobileConfig || {};
                    // Use mobileConfig.showLabel if specified, otherwise default to true
                    const showLabel = mobileConfig.showLabel !== undefined 
                      ? mobileConfig.showLabel 
                      : true;

                    return (
                      <VStack key={col.key || colIndex} {...styles.cardColumn}>
                        {showLabel && (
                          <Text
                            {...TYPOGRAPHY.label}
                            color={theme.tokens.colors.mutedForeground}
                            fontSize="$xs"
                          >
                            {t(col.label)}
                          </Text>
                        )}
                        <Box>
                          {col.render ? col.render(item) : <Text {...TYPOGRAPHY.paragraph}>{(item as any)[col.key]}</Text>}
                        </Box>
                      </VStack>
                    );
                  })}
                </VStack>
              );
            }

            // Left + Right rows
            return (
              <HStack key={rowIndex} {...styles.cardLeftRightRow}>
                {[0, 1].map(pos => {
                  const col = row[pos] as ColumnDef<T> | null;
                  if (!col) return <Box key={pos} flex={1} />;

                  const mobileConfig = col.mobileConfig || {};
                  const showLabel =
                    mobileConfig.showLabel !== undefined ? mobileConfig.showLabel : true;

                  const isRightColumn = pos === 1;

                  return (
                    <VStack
                      key={col.key || pos}
                      space="xs"
                      alignItems={isRightColumn ? 'flex-end' : 'flex-start'}
                      maxWidth="48%"
                    >
                      {showLabel && (
                        <Text
                          {...TYPOGRAPHY.label}
                          color={theme.tokens.colors.mutedForeground}
                          fontSize="$xs"
                          textAlign={isRightColumn ? 'right' : 'left'}
                        >
                          {t(col.label)}
                        </Text>
                      )}

                      <Box>
                        {col.render ? (
                          col.render(item)
                        ) : (
                          <Text
                            {...TYPOGRAPHY.paragraph}
                            textAlign={isRightColumn ? 'right' : 'left'}
                          >
                            {(item as any)[col.key]}
                          </Text>
                        )}
                      </Box>
                    </VStack>
                  );
                })}
              </HStack>

            );
          })}

          {/* Actions Section - Always at bottom */}
          {showActions && (
            <HStack {...styles.cardActionsSection}>
              {/* View Details Button */}
              <Pressable
                onPress={handleViewDetails}
                {...styles.viewDetailsButton}
              >
                <HStack space="sm" alignItems="center" justifyContent="center">
                  <LucideIcon
                    name="Eye"
                    size={18}
                    color={theme.tokens.colors.textForeground}
                  />
                  <Text
                    {...TYPOGRAPHY.bodySmall}
                    color="$textForeground"
                    fontWeight="$medium"
                  >
                    {t('actions.viewDetails')}
                  </Text>
                </HStack>
              </Pressable>

              {/* Actions Menu */}
              <CustomMenu
                items={getMenuItems(t)}
                placement="bottom right"
                offset={5}
                trigger={getCustomTrigger}
                onSelect={handleMenuSelect}
              />
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Dropout Confirmation Modal */}
      <DropoutModal
        isOpen={showDropoutModal}
        itemName={itemName}
        dropoutReason={dropoutReason}
        onClose={handleCloseModal}
        onConfirm={handleDropoutConfirm}
        onReasonChange={setDropoutReason}
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
    <Box {...styles.emptyState}>
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
    <Box {...styles.loadingState}>
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
  pagination,
  onPageChange,
  responsive = true, // Default to true
}: DataTableProps<T>) => {
  const { isMobile } = usePlatform();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => Math.max(1, pagination?.pageSize ?? 10));
  
  // Calculate pagination values with validation
  const isPaginationEnabled = pagination?.enabled ?? false;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = isPaginationEnabled ? Math.max(1, Math.ceil(data.length / safePageSize)) : 1;
  const startIndex = isPaginationEnabled ? (currentPage - 1) * safePageSize : 0;
  const endIndex = isPaginationEnabled ? startIndex + safePageSize : data.length;
  const paginatedData = isPaginationEnabled ? data.slice(startIndex, endIndex) : data;
  
  // Sync pageSize from props and reset to page 1 when data changes
  useEffect(() => {
    if (!isPaginationEnabled) return;
    
    if (pagination?.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(Math.max(1, pagination.pageSize));
      setCurrentPage(1);
    }
  }, [isPaginationEnabled, pagination?.pageSize]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };
  
  // Handle page size change with validation
  const handlePageSizeChange = (newPageSize: number) => {
    if (!Number.isFinite(newPageSize) || newPageSize <= 0) return;
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };
  
  // Calculate minimum width for horizontal scroll on mobile (only when responsive is disabled)
  const minTableWidth = isMobile && !responsive ? 800 : undefined;

  // Determine if we should show card view
  const shouldShowCardView = responsive && isMobile;

  // Table content for desktop or when responsive is disabled
  const tableContent = (
    <VStack {...styles.tableContentContainer} minWidth={minTableWidth}>
      <TableHeader columns={columns} showActions={showActions} minWidth={minTableWidth} isMobile={false} />
      <Box>
        {isLoading ? (
          <LoadingState message={loadingMessage} />
        ) : paginatedData.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          paginatedData.map((item, index) => (
            <TableRow
              key={getRowKey(item)}
              item={item}
              columns={columns}
              onRowClick={onRowClick}
              onActionClick={onActionClick}
              showActions={showActions}
              minWidth={minTableWidth}
              isLast={index === paginatedData.length - 1}
            />
          ))
        )}
      </Box>
    </VStack>
  );

  // Card view content for mobile when responsive is enabled
  const cardContent = (
    <VStack {...styles.cardContentContainer}>
      {isLoading ? (
        <LoadingState message={loadingMessage} />
      ) : paginatedData.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        paginatedData.map((item) => (
          <CardView
            key={getRowKey(item)}
            item={item}
            columns={columns}
            onRowClick={onRowClick}
            onActionClick={onActionClick}
            showActions={showActions}
          />
        ))
      )}
    </VStack>
  );

  return (
    <Box {...styles.mainContainer}>
      <Box
        bg={theme.tokens.colors.backgroundPrimary.light}
        {...styles.tableWrapper}
        {...(!isMobile ? styles.tableWrapperWeb : {})}
        overflow={shouldShowCardView ? 'hidden' : isMobile ? 'hidden' : 'visible'}
      >
        {shouldShowCardView ? (
          // Mobile: Show card view when responsive is enabled
          cardContent
        ) : isMobile ? (
          // Mobile: Wrap table in horizontal ScrollView when responsive is disabled
          <ScrollView horizontal showsHorizontalScrollIndicator>
            {tableContent}
          </ScrollView>
        ) : (
          // Desktop: Show table view
          tableContent
        )}
      </Box>
      {isPaginationEnabled && totalPages > 1 && pagination && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={data.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          config={pagination}
        />
      )}
    </Box>
  );
};

export default DataTable;
