import React, { useState } from 'react';
import {
 Text,
 Card,
 Heading,
 Avatar,
 AvatarFallbackText,
 View,
 Checkbox,
 CheckboxIndicator,
 CheckboxIcon,
 CheckIcon,
 CheckboxLabel,
 VStack,
 HStack,
 Divider,
 Button,
 Pressable,
 Box,
} from '@ui';
import FilterButton from '@components/Filter';
import { AssignUsersStyles } from './Styles';
import type { TextProps, ViewProps } from 'react-native';
import { useLanguage } from '@contexts/LanguageContext';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { LucideIcon } from '@ui';
import { theme } from '@config/theme';
import { getInitials } from '@utils/helper';


interface UserAvatarCardProps {
 title: string;
 description: string;
 filterOptions?: any;
 onChange?: (values: Record<string, any>) => void;
 selectedValues?: Record<string, any>;
 showSelectedCard?: boolean;
 showLcList?: boolean;
 showLcListforSupervisorTeam?: boolean;
 onLcSelect?: (lc: any) => void;
 onAssign?: (selectedLCs: any[]) => void;
 lcList?: any[]; // Optional filtered LC list (if not provided, uses default selectedLCList)
 isParticipantList?: boolean; // Flag to indicate if this is a participant list (different button text)
}


const UserAvatarCard = ({
  title,
  description,
  filterOptions,
  onChange,
  selectedValues = {},
  showSelectedCard = false,
  showLcList = true,
  showLcListforSupervisorTeam = false,
  onLcSelect,
  onAssign,
  lcList,
  isParticipantList = false,
}: UserAvatarCardProps) => {
  const { t } = useLanguage();

  const [selectedLc, setSelectedLc] = useState<any>(null);
  const [selectedLCs, setSelectedLCs] = useState<Set<string>>(new Set());
  
  // Use provided lcList or fall back to empty array
  const displayLCList = lcList || [];
 // Handler to receive filter changes from FilterButton and pass to parent
 const handleFilterChange = (values: Record<string, any>) => {
   // Call parent's onChange handler if provided
   onChange?.(values);
 };


  return (
    <Card {...(AssignUsersStyles.coverCardStyles as ViewProps)}>
      <Heading {...(AssignUsersStyles.headingStyles as any)}>{t(title)}</Heading>
      <Text {...(AssignUsersStyles.descriptionTextStyles as TextProps)}>
        {description.includes('{{supervisor}}') && selectedValues?.selectSupervisor
          ? t(description).replace('{{supervisor}}', selectedValues.selectSupervisor)
          : description.includes('{{lc}}') && selectedValues?.selectedLc?.labelKey
          ? t(description).replace('{{lc}}', selectedValues.selectedLc.labelKey)
          : t(description)}
      </Text>


      {!showLcListforSupervisorTeam && (
        <FilterButton
          data={filterOptions}
          showClearButton={false}
          onFilterChange={handleFilterChange}
        />
      )}
     {/* Display selected values if showSelectedCard is true and values exist */}
     {showSelectedCard && selectedValues && (() => {
       
       const supervisorData = selectedValues.selectedSupervisorData;

        // Get supervisor name from API response (name field) or fallback to filter value
        const supervisorName =
        supervisorData?.name ||
        selectedValues.selectSupervisor ||
        selectedValues.selectedValue ||
        '';

        // Get initials from supervisor name using common utility function
        const supervisorInitials = getInitials(supervisorName);
        
        // Get province and site from supervisor API response
        const supervisorProvince = supervisorData?.province?.label || '';
        const supervisorSite = supervisorData?.local_municipality?.label || 
                              supervisorData?.site?.label ||
                              '';
        
        // Build location text: show both Province and Site if available
        const locationParts = [];
        if (supervisorSite) {
          locationParts.push(supervisorSite);
        }
        if (supervisorProvince) {
          locationParts.push(supervisorProvince);
        }
       
        const supervisorLocation = locationParts.join(' , ');
       
       return (
         <Card {...(AssignUsersStyles.cardStyles as ViewProps)}>
           <HStack space="md" alignItems="center">
              <Box {...(AssignUsersStyles.avatarBoxStyles as ViewProps)}>
                 <Text {...(AssignUsersStyles.avatarTextStyles as TextProps)}>{supervisorInitials}</Text>
              </Box>
             <View flex={1}>
               <Text {...(AssignUsersStyles.supervisorName as TextProps)}>
                 {supervisorName}
               </Text>
               {supervisorLocation && (
                 <Text {...(AssignUsersStyles.provinceName as TextProps)}>
                   {supervisorLocation}
                 </Text>
               )}
             </View>
           </HStack>
         </Card>
       );
     })()}
     {showLcList && (
       <VStack marginTop={'$3'}>
         <Text {...(AssignUsersStyles.provinceName as TextProps)} color="$textForeground">
           {isParticipantList 
             ? t('admin.assignUsers.selectParticipants', { count: selectedLCs.size })
             : t('admin.assignUsers.selectedLinkageChampions')}
         </Text>
        <Card variant="outline" padding="$0" marginTop="$1">
          {displayLCList?.map((lc: any) => {
             const isChecked = selectedLCs.has(lc.value);
             return (
               <React.Fragment key={lc.value}>
                 <Checkbox
                   isDisabled={false}
                   isInvalid={false}
                   size="sm"
                   padding="$3"
                   value={lc.value}
                   isChecked={isChecked}
                   onChange={(checked: boolean) => {
                     setSelectedLCs((prev) => {
                       const newSet = new Set(prev);
                       if (checked) {
                         newSet.add(lc.value);
                       } else {
                         newSet.delete(lc.value);
                       }
                       return newSet;
                     });
                   }}
                 >
                 <CheckboxIndicator borderWidth={1} borderColor="$textForeground">
                   <CheckboxIcon as={CheckIcon} color="$modalBackground" />
                 </CheckboxIndicator>


                 <CheckboxLabel>
                   <View {...(AssignUsersStyles.viewstyles as ViewProps)}>
                     <Avatar {...(AssignUsersStyles.avatarBgStyles as any)} width="$8" height="$8">
                       <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as any)} fontSize="$sm">{lc.labelKey}</AvatarFallbackText>
                     </Avatar>


                     <View>
                       <Text
                         {...(AssignUsersStyles.supervisorName as TextProps)} fontSize="$sm"
                       >
                         {lc.labelKey}
                       </Text>
                       <HStack gap="$1">
                         <LucideIcon
                           name="MapPin"
                           size={12}
                           color={theme.tokens.colors.textMutedForeground}
                         />
                         <Text
                           {...(AssignUsersStyles.provinceName as TextProps)} fontSize="$xs"
                         >
                           {lc.location}
                         </Text>
                       </HStack>
                     </View>
                     {/* <Button
                       {...titleHeaderStyles.outlineButton}
                       marginLeft="auto"
                     >
                       <HStack>
                         <Text {...titleHeaderStyles.outlineButtonText}>
                           {t(`admin.assignUsers.status.${lc.status}`) || lc.status}
                         </Text>
                       </HStack>
                     </Button> */}
                   </View>
                 </CheckboxLabel>
               </Checkbox>
               <Divider />
             </React.Fragment>
           );
           })}
         </Card>


        <Button
          {...titleHeaderStyles.solidButton}
          mt={'$3'}
          onPress={async () => {
            // Handle assign LCs to supervisor
            const selectedLCValues = Array.from(selectedLCs);
            const selectedLCObjects = displayLCList.filter((lc: any) =>
              selectedLCValues.includes(lc.value)
            );
            // Call parent's onAssign callback if provided (await if it's async)
            if (onAssign) {
              try {
                await onAssign(selectedLCObjects);
                // Clear selection only after successful assignment
                setSelectedLCs(new Set());
              } catch (error) {
                console.error('Error in onAssign callback:', error);
                // Don't clear selection on error
              }
            }
          }}
          isDisabled={selectedLCs.size === 0}
        >
          <HStack space="sm" alignItems="center">
            <LucideIcon 
              name="CircleCheck" 
              size={20} 
              color={theme.tokens.colors.white || '#FFFFFF'} 
            />
            <Text {...titleHeaderStyles.solidButtonText}>
              {isParticipantList
                ? t('admin.assignUsers.assignParticipantsToLc').replace('{{count}}', String(selectedLCs.size))
                : t('admin.assignUsers.assignLCsToSupervisor').replace('{{count}}', String(selectedLCs.size))}
            </Text>
          </HStack>
        </Button>
       </VStack>
     )}


     {showLcListforSupervisorTeam &&
       displayLCList?.map((lc: any) => {
         const isSelected = selectedLc?.value === lc.value;


         return (
           <Pressable
             key={lc.value}
             onPress={() => {
               setSelectedLc(lc); // local highlight
               onLcSelect?.(lc); // notify parent
             }}
           >
             <Card
               {...(isSelected
                 ? (AssignUsersStyles.cardStyles as ViewProps)
                 : (AssignUsersStyles.selectedCardStyles as ViewProps))}
             >
               <Avatar {...(AssignUsersStyles.avatarBgStyles as any)}>
                 <AvatarFallbackText {...(AssignUsersStyles.avatarFallbackTextStyles as any)}>{lc.labelKey || ''}</AvatarFallbackText>
               </Avatar>


               <View>
                 <Text {...(AssignUsersStyles.supervisorName as TextProps)}>
                   {lc.labelKey}
                 </Text>
                 <Text {...(AssignUsersStyles.provinceName as TextProps)}>
                   {lc.location}
                 </Text>
               </View>
             </Card>
           </Pressable>
         );
       })}
   </Card>
 );
};


export default UserAvatarCard;