import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, Text, Pressable, Box } from '@ui';
import { TYPOGRAPHY } from '@constants/TYPOGRAPHY';
import { theme } from '@config/theme';
import { useLanguage } from '@contexts/LanguageContext';
import { LucideIcon, Menu } from '@ui';
import { Participant } from '@app-types/screens';
import { styles as dataTableStyles } from '@components/DataTable/Styles';
import { getParticipantsMenuItems } from '@constants/PARTICIPANTS_LIST';
import DropoutModal from './DropoutModal';

interface ActionColumnProps {
  participant: Participant;
}

/**
 * Custom trigger for actions menu
 */
const getCustomTrigger = (triggerProps: any) => (
  <Pressable {...triggerProps} {...dataTableStyles.customTrigger}>
    <LucideIcon
      name="MoreVertical"
      size={20}
      color={theme.tokens.colors.textForeground}
    />
  </Pressable>
);

/**
 * ActionColumn Component
 * Manages all action column functionality: View Details button, Actions menu, and Dropout modal
 */
export const ActionColumn: React.FC<ActionColumnProps> = ({ participant }) => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  // Dropout modal state - selectedParticipant controls modal visibility (null = closed, not null = open)
  const [dropoutReason, setDropoutReason] = useState('');
  const [showDropoutModal, setShowDropoutModal] = useState(false);

  const handleViewDetails = () => {
    // @ts-ignore - Navigation type inference
    navigation.navigate('participant-detail', { id: participant.id });
  };

  const handleMenuSelect = (key: string) => {
    const participantId = participant.id;
    
    switch (key) {
      case 'view-log':
        // @ts-ignore - Navigation type inference
        navigation.navigate('participant-detail', { id: participantId });
        break;
      case 'log-visit':
        // @ts-ignore - Navigation type inference
        navigation.push('log-visit', { participantId });
        break;
      case 'dropout':
        setShowDropoutModal(true);
        break;
      default:
        console.log('Action:', key, 'for participant:', participantId);
    }
  };

  const handleDropoutConfirm = useCallback((reason?: string) => {
    console.log('Dropout participant:', participant.id, 'Reason:', reason);
    // TODO: Implement dropout logic - API call to mark participant as dropout with reason
    
    // Close modal and reset state
    setDropoutReason('');
    setShowDropoutModal(false);
  }, [participant.id]);

  const handleCloseDropoutModal = useCallback(() => {
    setDropoutReason('');
    setShowDropoutModal(false);
  }, []);

  return (
    <Box>
      <HStack {...dataTableStyles.cardActionsSection}>
        <Pressable
          onPress={handleViewDetails}
          {...dataTableStyles.viewDetailsButton}
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
        <Menu
          items={getParticipantsMenuItems(t)}
          placement="bottom right"
          offset={5}
          trigger={getCustomTrigger}
          onSelect={handleMenuSelect}
        />
      </HStack>

      {/* Dropout Confirmation Modal */}
      <DropoutModal
        isOpen={showDropoutModal}
        itemName={participant.name || participant.id || 'participant'}
        dropoutReason={dropoutReason}
        onClose={handleCloseDropoutModal}
        onConfirm={handleDropoutConfirm}
        onReasonChange={setDropoutReason}
      />
    </Box>
  );
};

