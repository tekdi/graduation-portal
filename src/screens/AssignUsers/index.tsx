import TitleHeader from '@components/TitleHeader';
import { titleHeaderStyles } from '@components/TitleHeader/Styles';
import { VStack, HStack, Button, Text } from '@ui';
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


 // Handler for supervisor SelectionCard filter changes
 const handleSupervisorFilterChange = (values: Record<string, any>) => {
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