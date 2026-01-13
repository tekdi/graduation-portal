import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { VStack, HStack, Button, Text, Card, Avatar, AvatarFallbackText, Box, Divider } from '@ui';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@contexts/LanguageContext';
import {
 lcFilterOptions,
 participantLCFilterOptions,
 SearchFilter,
 // selectedLCList,
} from '@constants/USER_MANAGEMENT_FILTERS';
import { supervisorFilterOptions } from '@constants/USER_MANAGEMENT_FILTERS';
import SelectionCard from '@components/SelectionCard';
import { AssignUsersStyles } from './Styles';


const AssignUsersScreen = () => {
 const { t } = useLanguage();
 const AssignLCFilterOptions = [SearchFilter, ...lcFilterOptions];
 type AssignTab = 'LC_TO_SUPERVISOR' | 'PARTICIPANT_TO_LC';


 const [activeTab, setActiveTab] = useState<AssignTab>('LC_TO_SUPERVISOR');
 const [selectedLc, setSelectedLc] = useState<any>(null);
 // State to store filter values for each SelectionCard
 const [supervisorFilterValues, setSupervisorFilterValues] = useState<
   Record<string, any>
 >({});
 const [lcFilterValues, setLcFilterValues] = useState<Record<string, any>>({});
 // State to track assigned LCs
 const [assignedLCs, setAssignedLCs] = useState<any[]>([]);


 // Handler for supervisor SelectionCard filter changes
 const handleSupervisorFilterChange = (values: Record<string, any>) => {
   // Reset assigned LCs when supervisor changes
   if (values.selectSupervisor !== supervisorFilterValues.selectSupervisor) {
     setAssignedLCs([]);
   }
   setSupervisorFilterValues(values);
   console.log('Supervisor filter values changed:', values);
   // Add your logic here to handle supervisor filter changes
   // Example: fetchFilteredSupervisors(values);
 };


 // Handler for LC SelectionCard filter changes
 const handleLcFilterChange = (values: Record<string, any>) => {
   setLcFilterValues(values);
   console.log('LC filter values changed:', values);
   // Add your logic here to handle LC filter changes
   // Example: fetchFilteredLCs(values);
 };

 // Handler for when LCs are assigned to supervisor
 const handleAssignLCs = (selectedLCs: any[]) => {
   // Generate additional data for assigned LCs (email, LC ID, site)
   const lcsWithFullData = selectedLCs.map((lc, index) => {
     // Generate email from name (simple conversion)
     const nameParts = lc.labelKey.toLowerCase().split(' ');
     const email = nameParts.length > 1
       ? `${nameParts[0]}.${nameParts[1]}@gbl.co.za`
       : `${nameParts[0]}@gbl.co.za`;
     
     // Generate LC ID (increment from existing)
     const lcId = `LC-${String(assignedLCs.length + 2 + index).padStart(3, '0')}`;
     
     // Extract site from location or use default
     const site = lc.location?.includes('eThekwini') ? 'Site B' : 
                  lc.location?.includes('Johannesburg') ? 'Site A' : 'Site C';
     
     return {
       ...lc,
       email,
       lcId,
       site,
     };
   });
   
   // Add to assigned LCs list
   setAssignedLCs((prev) => [...prev, ...lcsWithFullData]);
   console.log('LCs assigned:', lcsWithFullData);
 };


 // Use filter values to perform actions when filters change
 useEffect(() => {
   if (Object.keys(supervisorFilterValues).length > 0) {
     console.log('Current supervisor filter values:', supervisorFilterValues);
     // Add your filtering/fetching logic here for supervisors
   }
 }, [supervisorFilterValues]);


 useEffect(() => {
   if (Object.keys(lcFilterValues).length > 0) {
     console.log('Current LC filter values:', lcFilterValues);
     // Add your filtering/fetching logic here for LCs
   }
 }, [lcFilterValues]);
 return (
   <VStack space="md" width="100%">
     <TitleHeader
       title="admin.menu.assignUsers"
       description="admin.assignUsersDescription"
       bottom={
         <HStack space="md" alignItems="center">
           <Button
             {...(activeTab === 'LC_TO_SUPERVISOR'
               ? titleHeaderStyles.solidButton
               : titleHeaderStyles.outlineButton)}
             onPress={() => setActiveTab('LC_TO_SUPERVISOR')}
           >
             <Text
               {...(activeTab === 'LC_TO_SUPERVISOR'
                 ? titleHeaderStyles.solidButtonText
                 : titleHeaderStyles.outlineButtonText)}
             >
               {t('admin.actions.lctosupervisior')}
             </Text>
           </Button>


           <Button
             {...(activeTab === 'PARTICIPANT_TO_LC'
               ? titleHeaderStyles.solidButton
               : titleHeaderStyles.outlineButton)}
             onPress={() => setActiveTab('PARTICIPANT_TO_LC')}
           >
             <Text
               {...(activeTab === 'PARTICIPANT_TO_LC'
                 ? titleHeaderStyles.solidButtonText
                 : titleHeaderStyles.outlineButtonText)}
             >
               {t('admin.actions.participanttolc')}
             </Text>
           </Button>
         </HStack>
       }
     />


     {activeTab === 'LC_TO_SUPERVISOR' && (
       <>
         <SelectionCard
           title="admin.assignUsers.step1SelectSupervisor"
           description="admin.assignUsers.filterByProvince"
           filterOptions={supervisorFilterOptions}
           onChange={handleSupervisorFilterChange}
           selectedValues={supervisorFilterValues}
           showSelectedCard={!!supervisorFilterValues.selectSupervisor}
           showLcList={false}
         />


        {supervisorFilterValues.selectSupervisor && (
          <>
            <SelectionCard
              title="admin.assignUsers.step2AssignLinkageChampions"
              description="admin.assignUsers.filterByGeography"
              filterOptions={AssignLCFilterOptions}
              onChange={handleLcFilterChange}
              selectedValues={lcFilterValues}
              showLcList={true}
              onAssign={handleAssignLCs}
            />

            {/* Hardcoded List of LCs Mapped to Supervisor - TODO: Replace with API data */}
            <Card size="md" variant="outline">
              <VStack space="md" width="100%">
                <VStack space="xs">
                  <Text fontSize="$xl" fontWeight="$semibold" color="$textLight900">
                    {t('admin.assignUsers.listOfLcsMappedToSupervisor')}
                  </Text>
                  <Text fontSize="$sm" color="$textLight600">
                    {t('admin.assignUsers.currentLcAssignmentsFor').replace(
                      '{{supervisor}}',
                      supervisorFilterValues.selectSupervisor || 'Supervisor'
                    )}
                  </Text>
                </VStack>

                {/* Table Header */}
                <HStack
                  space="md"
                  alignItems="center"
                  paddingVertical="$3"
                  borderBottomWidth={1}
                  borderBottomColor="$borderLight200"
                >
                  <Box flex={2}>
                    <Text fontSize="$sm" fontWeight="$semibold" color="$textLight900">
                      {t('admin.assignUsers.linkageChampion')}
                    </Text>
                  </Box>
                  <Box flex={2}>
                    <Text fontSize="$sm" fontWeight="$semibold" color="$textLight900">
                      {t('admin.assignUsers.email')}
                    </Text>
                  </Box>
                  <Box flex={2}>
                    <Text fontSize="$sm" fontWeight="$semibold" color="$textLight900">
                      {t('admin.assignUsers.location')}
                    </Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="$sm" fontWeight="$semibold" color="$textLight900">
                      {t('admin.assignUsers.site')}
                    </Text>
                  </Box>
                </HStack>

                {/* Table Rows - Hardcoded + Dynamically Assigned */}
                <VStack space="xs">
                  {/* Hardcoded Row: Nomsa Dlamini */}
                  <HStack
                    space="md"
                    alignItems="center"
                    paddingVertical="$3"
                    borderBottomWidth={1}
                    borderBottomColor="$borderLight200"
                  >
                    <Box flex={2}>
                      <HStack space="sm" alignItems="center">
                        <Avatar>
                          <AvatarFallbackText>ND</AvatarFallbackText>
                        </Avatar>
                        <VStack space="xs">
                          <Text fontSize="$md" fontWeight="$normal" color="$textLight900">
                            Nomsa Dlamini
                          </Text>
                          <Text fontSize="$sm" color="$textLight600">
                            LC-002
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                    <Box flex={2}>
                      <Text fontSize="$md" color="$textLight700">
                        nomsa.dlamini@gbl.co.za
                      </Text>
                    </Box>
                    <Box flex={2}>
                      <HStack space="xs" alignItems="center">
                        <Text fontSize="$md" color="$textLight700">
                          📍
                        </Text>
                        <Text fontSize="$md" color="$textLight700">
                          eThekwini, KwaZulu-Natal
                        </Text>
                      </HStack>
                    </Box>
                    <Box flex={1}>
                      <Text fontSize="$md" color="$textLight700">
                        Site B
                      </Text>
                    </Box>
                  </HStack>

                  {/* Dynamically Assigned LCs */}
                  {assignedLCs.map((lc, index) => {
                    // Get initials from name
                    const nameParts = lc.labelKey.split(' ');
                    const initials = nameParts.length > 1
                      ? `${nameParts[0][0]}${nameParts[1][0]}`
                      : nameParts[0].substring(0, 2).toUpperCase();

                    return (
                      <HStack
                        key={`${lc.value}-${index}`}
                        space="md"
                        alignItems="center"
                        paddingVertical="$3"
                        borderBottomWidth={index === assignedLCs.length - 1 ? 0 : 1}
                        borderBottomColor="$borderLight200"
                      >
                        <Box flex={2}>
                          <HStack space="sm" alignItems="center">
                            <Avatar>
                              <AvatarFallbackText>{initials}</AvatarFallbackText>
                            </Avatar>
                            <VStack space="xs">
                              <Text fontSize="$md" fontWeight="$normal" color="$textLight900">
                                {lc.labelKey}
                              </Text>
                              <Text fontSize="$sm" color="$textLight600">
                                {lc.lcId}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                        <Box flex={2}>
                          <Text fontSize="$md" color="$textLight700">
                            {lc.email}
                          </Text>
                        </Box>
                        <Box flex={2}>
                          <HStack space="xs" alignItems="center">
                            <Text fontSize="$md" color="$textLight700">
                              📍
                            </Text>
                            <Text fontSize="$md" color="$textLight700">
                              {lc.location}
                            </Text>
                          </HStack>
                        </Box>
                        <Box flex={1}>
                          <Text fontSize="$md" color="$textLight700">
                            {lc.site}
                          </Text>
                        </Box>
                      </HStack>
                    );
                  })}
                </VStack>
              </VStack>
            </Card>
          </>
        )}
      </>
    )}


     {activeTab === 'PARTICIPANT_TO_LC' && (
       <>
         <SelectionCard
           title="admin.assignUsers.step1SelectSupervisor"
           description="admin.assignUsers.chooseSupervisor"
           filterOptions={participantLCFilterOptions}
           onChange={handleSupervisorFilterChange}
           selectedValues={supervisorFilterValues}
           showSelectedCard={!!supervisorFilterValues.selectSupervisor}
           showLcList={false}
         />


         {supervisorFilterValues.selectSupervisor && (
           <SelectionCard
             title="admin.assignUsers.step2SelectLC"
             description="admin.assignUsers.chooseLcFrom"
             showLcList={false}
             showLcListforSupervisorTeam={true}
             onLcSelect={lc => setSelectedLc(lc)}
           />
         )}


         {selectedLc && (
           <SelectionCard
             title="admin.assignUsers.step2AssignLinkageChampions"
             description="admin.assignUsers.filterByGeography"
             filterOptions={AssignLCFilterOptions}
             onChange={handleLcFilterChange}
             selectedValues={lcFilterValues}
             showLcList={true}
           />
         )}
       </>
     )}
   </VStack>
 );
};


export default AssignUsersScreen;