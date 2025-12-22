import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Pressable,
  Container,
  ScrollView,
  Select,
} from '@ui';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '@components/SearchBar';
import DataTable from '@components/DataTable';
import { getParticipantsColumns } from './ParticipantsTableConfig';
import { theme } from '@config/theme';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { Participant, StatusCount, StatusType } from '@app-types/screens';
import { useLanguage } from '@contexts/LanguageContext';
import { getStatusItems } from '@constants/FILTERS';
import { getParticipantsList } from '../../services/participantService';
import { STATUS } from '@constants/app.constant';
import { usePlatform } from '@utils/platform';
import { applyFilters } from '@utils/helper';
import { styles } from './Styles';
import DropoutModal from './DropoutModal';

/**
 * ParticipantsList Screen
 * Handles all screen-specific logic: navigation, dropout modal, and action routing.
 * DataTable component is generic. Action handlers are passed via column config (onActionClick in ColumnDef).
 */
const ParticipantsList: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { isMobile } = usePlatform();

  // State management
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeStatus, setActiveStatus] = useState<StatusType | ''>(
    STATUS.NOT_ENROLLED,
  );
  const [_searchKey, setSearchKey] = useState('');
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive'>('active');
  const [isLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Dropout modal state
  const [showDropoutModal, setShowDropoutModal] = useState(false);
  const [dropoutReason, setDropoutReason] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Calculate status counts dynamically from participants data
  const statusCounts = useMemo<StatusCount>(() => {
    const counts: StatusCount = {
      'Not Onboarded': 0,
      'Onboarded': 0,
      'In Progress': 0,
      'Completed': 0,
      'Dropped out': 0,
      'Graduated': 0,
    };

    participants.forEach(participant => {
      if (participant.status) {
        const status = participant.status as StatusType;
        if (status in counts) {
          counts[status] = (counts[status] || 0) + 1;
        }
      }
    });

    return counts;
  }, [participants]);

  // Get status items with current counts
  const allStatusItems = getStatusItems(statusCounts);
  
  // Filter status items based on active/inactive filter
  const statusItems = useMemo(() => {
    // Active
    if (activeFilter === 'active') {
      return allStatusItems.filter(item => 
        item.key === STATUS.NOT_ENROLLED ||
        item.key === STATUS.ENROLLED || 
        item.key === STATUS.IN_PROGRESS ||
        item.key === STATUS.COMPLETED 
      );
    } else {
      // inactive
      return allStatusItems.filter(item => 
        item.key === STATUS.DROPOUT ||
        item.key === STATUS.GRADUATED
      );
    }
  }, [allStatusItems, activeFilter]);

  // Calculate counts for Active and Inactive filters
  const activeInactiveCounts = useMemo(() => {
    const activeCount = allStatusItems
      .filter(item => 
        item.key === STATUS.NOT_ENROLLED ||
        item.key === STATUS.ENROLLED || 
        item.key === STATUS.IN_PROGRESS ||
        item.key === STATUS.COMPLETED
      )
      .reduce((sum, item) => sum + item.count, 0);
    
    const inactiveCount = allStatusItems
      .filter(item => 
        item.key === STATUS.DROPOUT ||
        item.key === STATUS.GRADUATED
      )
      .reduce((sum, item) => sum + item.count, 0);
    
    return { active: activeCount, inactive: inactiveCount };
  }, [allStatusItems]);

  // Format status items for Select dropdown (mobile)
  const selectOptions = useMemo(() => {
    return statusItems.map(item => ({
      label: `${t(item.label)} (${item.count})`,
      value: item.key,
    }));
  }, [statusItems, t]);

  useEffect(() => {
    // Set mock participants data
    const participants = getParticipantsList();
    setParticipants(participants);
    setTotalCount(participants.length);
  }, []);

  // When Active/Inactive filter changes, set default status
  useEffect(() => {
    if (activeFilter === 'inactive') {
      setActiveStatus(STATUS.GRADUATED);
    } else if (activeFilter === 'active') {
      // Set default to NOT_ENROLLED when Active is selected
      setActiveStatus(STATUS.NOT_ENROLLED);
    }
  }, [activeFilter]);

  const filteredParticipants = useMemo(() => {
    // Build filters object for applyFilters
    const filters: Record<string, any> = {};
    
    // Apply status filter if active
    if (activeStatus) {
      filters.status = activeStatus;
    }
    
    // Apply filters using helper function
    return applyFilters(participants, filters);
  }, [participants, activeStatus]);

  // Handlers
  const handleSearch = useCallback((text: string) => {
    setSearchKey(text);
  }, []);

  const handleStatusChange = useCallback((status: StatusType | '') => {
    setActiveStatus(status);
  }, []);

  const handleRowClick = useCallback(
    (participant: Participant) => {
      // @ts-ignore
      navigation.navigate('participant-detail', {
        id: participant.id,
      });
    },
    [navigation],
  );

  // Handle all table actions: navigation and modals are screen-specific, not in DataTable
  const handleActionClick = useCallback((participant: Participant, actionKey?: string) => {
    const participantId = participant.id;
    
    switch (actionKey) {
      case 'view-details':
        // @ts-ignore - Navigation type inference
        navigation.navigate('participant-detail', { id: participantId });
        break;
      case 'log-visit':
        // @ts-ignore - Navigation type inference
        navigation.push('log-visit', { participantId });
        break;
      case 'view-log':
        // @ts-ignore - Navigation type inference
        navigation.navigate('participant-detail', { id: participantId });
        break;
      case 'dropout':
        setSelectedParticipant(participant);
        setShowDropoutModal(true);
        break;
      default:
        console.log('Action:', actionKey, 'for participant:', participantId);
    }
  }, [navigation]);

  const handleDropoutConfirm = useCallback((reason?: string) => {
    if (!selectedParticipant) return;
    
    console.log('Dropout participant:', selectedParticipant.id, 'Reason:', reason);
    // TODO: Implement dropout logic - API call to mark participant as dropout with reason
    
    // Close modal and reset state
    setShowDropoutModal(false);
    setDropoutReason('');
    setSelectedParticipant(null);
  }, [selectedParticipant]);

  const handleCloseDropoutModal = useCallback(() => {
    setShowDropoutModal(false);
    setDropoutReason('');
    setSelectedParticipant(null);
  }, []);

  return (
    <Box {...styles.mainContainer}>
      <ScrollView {...styles.scrollView}>
        <VStack {...styles.headerVStack}>
          <Container>
            <Heading {...TYPOGRAPHY.h4} color={theme.tokens.colors.foreground} {...styles.heading}>
              {t('participants.myParticipants')}
            </Heading>
          </Container>
          </VStack>
      
        <Container>
          <VStack {...styles.contentVStack}>
            {/* Page Title */}
           

            {/* Search Bar and Active/Inactive Filter */}
            <HStack {...styles.searchFilterHStack}>
              <Box {...styles.searchBarContainer}>
                <SearchBar
                  placeholder={t('participants.searchByNameOrId')}
                  onSearch={handleSearch}
                  debounceMs={500}
                />
              </Box>
              <Box {...styles.selectContainer}>
                <Select
                  options={[
                    { label: `${t('participants.active')} (${activeInactiveCounts.active})`, value: 'active' },
                    { label: `${t('participants.inactive')} (${activeInactiveCounts.inactive})`, value: 'inactive' },
                  ]}
                  value={activeFilter}
                  onChange={(value) => setActiveFilter(value as 'active' | 'inactive')}
                  {...styles.select}
                />
              </Box>
            </HStack>

            {/* Status Filter Bar - Desktop: Filter buttons, Mobile: Dropdown */}
            {isMobile ? (
              <Box {...styles.mobileStatusSelectContainer}>
                <Select
                  options={selectOptions}
                  value={activeStatus}
                  onChange={(value) => handleStatusChange(value as StatusType | '')}
                  placeholder={t('participants.selectStatus') || 'Select Status'}
                  {...styles.select}
                />
              </Box>
            ) : (
              <Box {...styles.desktopFilterContainer}>
                <HStack {...styles.desktopFilterHStack}>
                  {statusItems.map(item => {
                    const isActive = activeStatus === item.key;

                    return (
                      <Pressable
                        key={item.key}
                        onPress={() => handleStatusChange(item.key)}
                        {...styles.statusItemPressable}
                        {...(isActive ? styles.statusItemPressableActive : styles.statusItemPressableInactive)}
                      >
                        <HStack {...styles.statusItemHStack}>
                          <Text
                            {...styles.statusLabelText}
                            {...(isActive ? styles.statusLabelTextActive : styles.statusLabelTextInactive)}
                          >
                            {t(item.label)}
                          </Text>
                          <Box
                            {...styles.countBadgeBox}
                            {...(isActive ? styles.countBadgeBoxActive : styles.countBadgeBoxInactive)}
                          >
                            <Text
                              {...styles.countText}
                              {...(isActive ? styles.countTextActive : styles.countTextInactive)}
                            >
                              {item.count}
                            </Text>
                          </Box>
                        </HStack>
                      </Pressable>
                    );
                  })}
                </HStack>
              </Box>
            )}

            {/* Participants Table */}
            <DataTable
              data={filteredParticipants}
              columns={getParticipantsColumns(activeStatus, handleActionClick)}
              getRowKey={participant => participant.id}
              onRowClick={handleRowClick}
              isLoading={isLoading}
              emptyMessage={t('participants.noParticipantsFound')}
              loadingMessage={t('participants.loadingParticipants')}
              pagination={{
                enabled: true,
                pageSize: 6,
                maxPageNumbers: 5,
              }}
            />
          </VStack>
        </Container>
      </ScrollView>
      
      {/* Dropout Confirmation Modal */}
      <DropoutModal
        isOpen={showDropoutModal}
        itemName={selectedParticipant?.name || selectedParticipant?.id || 'participant'}
        dropoutReason={dropoutReason}
        onClose={handleCloseDropoutModal}
        onConfirm={handleDropoutConfirm}
        onReasonChange={setDropoutReason}
      />
    </Box>
  );
};

export default ParticipantsList;
