/home/ttpl-rt-77/BRAC/graduation-portal/src/screens/AssignUsers/index.tsx

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
} from '@constants/USER\_MANAGEMENT\_FILTERS';  
import { supervisorFilterOptions } from '@constants/USER\_MANAGEMENT\_FILTERS';  
import SelectionCard from '@components/SelectionCard';

const AssignUsersScreen \= () \=\> {  
 const { t } \= useLanguage();  
 const AssignLCFilterOptions \= \[SearchFilter, ...lcFilterOptions\];  
 type AssignTab \= 'LC\_TO\_SUPERVISOR' | 'PARTICIPANT\_TO\_LC';

 const \[activeTab, setActiveTab\] \= useState\<AssignTab\>('LC\_TO\_SUPERVISOR');  
 const \[selectedLc, setSelectedLc\] \= useState\<any\>(null);  
 // State to store filter values for each SelectionCard  
 const \[supervisorFilterValues, setSupervisorFilterValues\] \= useState\<  
   Record\<string, any\>  
 \>({});  
 const \[lcFilterValues, setLcFilterValues\] \= useState\<Record\<string, any\>\>({});

 // Handler for supervisor SelectionCard filter changes  
 const handleSupervisorFilterChange \= (values: Record\<string, any\>) \=\> {  
   setSupervisorFilterValues(values);  
   console.log('Supervisor filter values changed:', values);  
   // Add your logic here to handle supervisor filter changes  
   // Example: fetchFilteredSupervisors(values);  
 };

 // Handler for LC SelectionCard filter changes  
 const handleLcFilterChange \= (values: Record\<string, any\>) \=\> {  
   setLcFilterValues(values);  
   console.log('LC filter values changed:', values);  
   // Add your logic here to handle LC filter changes  
   // Example: fetchFilteredLCs(values);  
 };

 // Use filter values to perform actions when filters change  
 useEffect(() \=\> {  
   if (Object.keys(supervisorFilterValues).length \> 0) {  
     console.log('Current supervisor filter values:', supervisorFilterValues);  
     // Add your filtering/fetching logic here for supervisors  
   }  
 }, \[supervisorFilterValues\]);

 useEffect(() \=\> {  
   if (Object.keys(lcFilterValues).length \> 0) {  
     console.log('Current LC filter values:', lcFilterValues);  
     // Add your filtering/fetching logic here for LCs  
   }  
 }, \[lcFilterValues\]);  
 return (  
   \<VStack space\="md" width\="100%"\>  
     \<TitleHeader  
       title\="admin.menu.assignUsers"  
       description\="admin.assignUsersDescription"  
       bottom\={  
         \<HStack space\="md" alignItems\="center"\>  
           \<Button  
             {...(activeTab \=== 'LC\_TO\_SUPERVISOR'  
               ? titleHeaderStyles.solidButton  
               : titleHeaderStyles.outlineButton)}  
             onPress\={() \=\> setActiveTab('LC\_TO\_SUPERVISOR')}  
           \>  
             \<Text  
               {...(activeTab \=== 'LC\_TO\_SUPERVISOR'  
                 ? titleHeaderStyles.solidButtonText  
                 : titleHeaderStyles.outlineButtonText)}  
             \>  
               {t('admin.actions.lctosupervisior')}  
             \</Text\>  
           \</Button\>

           \<Button  
             {...(activeTab \=== 'PARTICIPANT\_TO\_LC'  
               ? titleHeaderStyles.solidButton  
               : titleHeaderStyles.outlineButton)}  
             onPress\={() \=\> setActiveTab('PARTICIPANT\_TO\_LC')}  
           \>  
             \<Text  
               {...(activeTab \=== 'PARTICIPANT\_TO\_LC'  
                 ? titleHeaderStyles.solidButtonText  
                 : titleHeaderStyles.outlineButtonText)}  
             \>  
               {t('admin.actions.participanttolc')}  
             \</Text\>  
           \</Button\>  
         \</HStack\>  
       }  
     /\>

     {activeTab \=== 'LC\_TO\_SUPERVISOR' && (  
       \<\>  
         \<SelectionCard  
           title\="admin.assignUsers.step1SelectSupervisor"  
           description\="admin.assignUsers.filterByProvince"  
           filterOptions\={supervisorFilterOptions}  
           onChange\={handleSupervisorFilterChange}  
           selectedValues\={supervisorFilterValues}  
           showSelectedCard\={\!\!supervisorFilterValues.selectSupervisor}  
           showLcList\={false}  
         /\>

         {supervisorFilterValues.selectSupervisor && (  
           \<SelectionCard  
             title\="admin.assignUsers.step2AssignLinkageChampions"  
             description\="admin.assignUsers.filterByGeography"  
             filterOptions\={AssignLCFilterOptions}  
             onChange\={handleLcFilterChange}  
             selectedValues\={lcFilterValues}  
             showLcList\={true}  
           /\>  
         )}  
       \</\>  
     )}

     {activeTab \=== 'PARTICIPANT\_TO\_LC' && (  
       \<\>  
         \<SelectionCard  
           title\="admin.assignUsers.step1SelectSupervisor"  
           description\="admin.assignUsers.chooseSupervisor"  
           filterOptions\={participantLCFilterOptions}  
           onChange\={handleSupervisorFilterChange}  
           selectedValues\={supervisorFilterValues}  
           showSelectedCard\={\!\!supervisorFilterValues.selectSupervisor}  
           showLcList\={false}  
         /\>

         {supervisorFilterValues.selectSupervisor && (  
           \<SelectionCard  
             title\="admin.assignUsers.step2SelectLC"  
             description\="admin.assignUsers.chooseLcFrom"  
             showLcList\={false}  
             showLcListforSupervisorTeam\={true}  
             onLcSelect\={lc \=\> setSelectedLc(lc)}  
           /\>  
         )}

         {selectedLc && (  
           \<SelectionCard  
             title\="admin.assignUsers.step2AssignLinkageChampions"  
             description\="admin.assignUsers.filterByGeography"  
             filterOptions\={AssignLCFilterOptions}  
             onChange\={handleLcFilterChange}  
             selectedValues\={lcFilterValues}  
             showLcList\={true}  
           /\>  
         )}  
       \</\>  
     )}  
   \</VStack\>  
 );  
};

export default AssignUsersScreen;

/home/ttpl-rt-77/BRAC/graduation-portal/src/screens/AssignUsers/[styles.ts](http://styles.ts)  
export const AssignUsersStyles \= {  
 cardStyles: {  
   size: 'md',  
   variant: 'outline',  
   backgroundColor: '$error100',  
   borderColor: '$primary500',  
   mt: '$6',  
   flexDirection: 'row',  
   alignItems: 'center',  
   gap: '$3',  
 },  
 supervisorName: {  
   fontSize: '$lg',  
   fontWeight: '$normal',  
   mb: '$3',  
   color: '$textLight900',  
 },  
 provinceName: {  
   fontSize: '$md',  
   fontWeight: '$normal',  
   mb: '$3',  
   color: '$textLight900',  
 },  
};

/home/ttpl-rt-77/BRAC/graduation-portal/src/components/SelectionCard/index.tsx

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
} from '@ui';  
import FilterButton from '@components/Filter';  
import { AssignUsersStyles } from './Styles';  
import type { TextProps, ViewProps } from 'react-native';  
import { useLanguage } from '@contexts/LanguageContext';  
import { selectedLCList } from '@constants/USER\_MANAGEMENT\_FILTERS';  
import { titleHeaderStyles } from '@components/TitleHeader/Styles';

interface SelectionCardProps {  
 title: string;  
 description: string;  
 filterOptions?: any;  
 onChange?: (values: Record\<string, any\>) \=\> void;  
 selectedValues?: Record\<string, any\>;  
 showSelectedCard?: boolean;  
 showLcList?: boolean;  
 showLcListforSupervisorTeam?: boolean;  
 onLcSelect?: (lc: any) \=\> void;  
}

const SelectionCard \= ({  
 title,  
 description,  
 filterOptions,  
 onChange,  
 selectedValues \= {},  
 showSelectedCard \= false,  
 showLcList \= true,  
 showLcListforSupervisorTeam \= false,  
 onLcSelect,  
}: SelectionCardProps) \=\> {  
 const { t } \= useLanguage();

 const \[selectedLc, setSelectedLc\] \= useState\<any\>(null);  
 // Handler to receive filter changes from FilterButton and pass to parent  
 const handleFilterChange \= (values: Record\<string, any\>) \=\> {  
   // Call parent's onChange handler if provided  
   onChange?.(values);  
 };

 return (  
   \<Card size\="md" variant\="outline"\>  
     \<Heading size\="md"\>{t(title)}\</Heading\>  
     \<Text size\="sm"\>{t(description)}\</Text\>

     {\!showLcListforSupervisorTeam && (  
       \<FilterButton  
         data\={filterOptions}  
         showClearFilterButton\={false}  
         onChange\={handleFilterChange}  
       /\>  
     )}  
     {/\* Display selected values if showSelectedCard is true and values exist \*/}  
     {showSelectedCard && selectedValues && (  
       \<Card {...(AssignUsersStyles.cardStyles as ViewProps)}\>  
         \<Avatar\>  
           \<AvatarFallbackText\>  
             {selectedValues.selectSupervisor ||  
               selectedValues.selectedValue ||  
               selectedValues.labelKey ||  
               ''}  
           \</AvatarFallbackText\>  
         \</Avatar\>  
         \<View\>  
           \<Text {...(AssignUsersStyles.supervisorName as TextProps)}\>  
             {selectedValues.selectSupervisor ||  
               selectedValues.selectedValue ||  
               ''}  
           \</Text\>  
           \<Text {...(AssignUsersStyles.provinceName as TextProps)}\>  
             {selectedValues.filterByProvince || selectedValues.province || ''}  
           \</Text\>  
         \</View\>  
       \</Card\>  
     )}  
     {showLcList && (  
       \<VStack marginTop\={'$3'}\>  
         \<Text {...(AssignUsersStyles.provinceName as TextProps)}\>  
           {'Selected Linkage Champions'}  
         \</Text\>  
         \<Card variant\="outline"\>  
           {selectedLCList?.map((lc: any) \=\> (  
             \<\>  
               \<Checkbox  
                 key\={lc.value}  
                 isDisabled\={false}  
                 isInvalid\={false}  
                 size\="md"  
                 value\={lc.value}  
               \>  
                 \<CheckboxIndicator\>  
                   \<CheckboxIcon as\={CheckIcon} color\="$modalBackground" /\>  
                 \</CheckboxIndicator\>

                 \<CheckboxLabel\>  
                   \<View {...(AssignUsersStyles.viewstyles as ViewProps)}\>  
                     \<Avatar\>  
                       \<AvatarFallbackText\>{lc.labelKey}\</AvatarFallbackText\>  
                     \</Avatar\>

                     \<View\>  
                       \<Text  
                         {...(AssignUsersStyles.supervisorName as TextProps)}  
                       \>  
                         {lc.labelKey}  
                       \</Text\>  
                       \<Text  
                         {...(AssignUsersStyles.provinceName as TextProps)}  
                       \>  
                         {lc.location}  
                       \</Text\>  
                     \</View\>  
                     \<Button  
                       {...titleHeaderStyles.outlineButton}  
                       marginLeft\="auto"  
                     \>  
                       \<HStack\>  
                         \<Text {...titleHeaderStyles.outlineButtonText}\>  
                           {lc.status}  
                         \</Text\>  
                       \</HStack\>  
                     \</Button\>  
                   \</View\>  
                 \</CheckboxLabel\>  
               \</Checkbox\>  
               \<Divider /\>  
             \</\>  
           ))}  
         \</Card\>

         \<Button  
           {...titleHeaderStyles.solidButton}  
           mt\={'$3'}  
           onPress\={() \=\> {  
             // Handle create user  
           }}  
         \>  
           \<HStack space\="sm" alignItems\="center"\>  
             \<Text {...titleHeaderStyles.solidButtonText}\>  
               {'Assign LCs to Supervisor'}  
             \</Text\>  
           \</HStack\>  
         \</Button\>  
       \</VStack\>  
     )}

     {showLcListforSupervisorTeam &&  
       selectedLCList?.map((lc: any) \=\> {  
         const isSelected \= selectedLc?.value \=== lc.value;

         return (  
           \<Pressable  
             key\={lc.value}  
             onPress\={() \=\> {  
               setSelectedLc(lc); // local highlight  
               onLcSelect?.(lc); // notify parent  
             }}  
           \>  
             \<Card  
               {...(isSelected  
                 ? (AssignUsersStyles.cardStyles as ViewProps)  
                 : (AssignUsersStyles.selectedCardStyles as ViewProps))}  
             \>  
               \<Avatar\>  
                 \<AvatarFallbackText\>{lc.labelKey || ''}\</AvatarFallbackText\>  
               \</Avatar\>

               \<View\>  
                 \<Text {...(AssignUsersStyles.supervisorName as TextProps)}\>  
                   {lc.labelKey}  
                 \</Text\>  
                 \<Text {...(AssignUsersStyles.provinceName as TextProps)}\>  
                   {lc.location}  
                 \</Text\>  
               \</View\>  
             \</Card\>  
           \</Pressable\>  
         );  
       })}  
   \</Card\>  
 );  
};

export default SelectionCard;

/home/ttpl-rt-77/BRAC/graduation-portal/src/components/SelectionCard/[Styles.ts](http://Styles.ts)

export const AssignUsersStyles \= {  
 cardStyles: {  
   size: 'md',  
   variant: 'outline',  
   backgroundColor: '$error100',  
   borderColor: '$primary500',  
   mt: '$6',  
   flexDirection: 'row',  
   alignItems: 'center',  
   gap: '$3',  
 },  
 supervisorName: {  
   fontSize: '$lg',  
   fontWeight: '$normal',  
   mb: '$3',  
   color: '$textLight900',  
 },  
 provinceName: {  
   fontSize: '$md',  
   fontWeight: '$normal',  
   mb: '$3',  
   color: '$textLight900',  
 },  
 viewstyles: {  
   flexDirection: 'row',  
   alignItems: 'center',  
   gap: '$3',  
   ml: '$3',  
   width: '100%',  
 },  
 selectedCardStyles: {  
   size: 'md',  
   variant: 'outline',  
   mt: '$6',  
   flexDirection: 'row',  
   alignItems: 'center',  
   gap: '$3',  
 },  
};

/home/ttpl-rt-77/BRAC/graduation-portal/src/constants/USER\_MANAGEMENT\_FILTERS.ts

export const supervisorFilterOptions: ReadonlyArray\<FilterConfig\> \= \[  
 {  
   nameKey: 'admin.filters.filterByProvince',  
   attr: 'filterByProvince',  
   type: 'select',  
   data: \[  
     { labelKey: 'admin.filters.allProvinces', value: 'all-Provinces' },  
     { labelKey: 'Gauteng', value: 'Gauteng' },  
     { labelKey: 'KwaZulu-nutal', value: 'KwaZulu-nutal' },  
   \],  
 },  
 {  
   nameKey: 'admin.filters.selectSupervisor',  
   attr: 'selectSupervisor',  
   type: 'select',  
   data: \[  
     {  
       labelKey: 'Dr. Lerato Mokoena Johannesburg',  
       value: 'Dr. Lerato Mokoena Johannesburg ',  
     },  
     {  
       labelKey: 'Zanele Ndabae Thekwini',  
       value: 'Zanele Ndabae Thekwini',  
     },  
   \],  
 },  
\];

export const lcFilterOptions: ReadonlyArray\<FilterConfig\> \= \[  
 {  
   nameKey: 'admin.filters.filterByProvince',  
   attr: 'filterByProvince',  
   type: 'select',  
   data: \[  
     { labelKey: 'admin.filters.allProvinces', value: 'all-Provinces' },  
     { labelKey: 'Gauteng', value: 'Gauteng' },  
     { labelKey: 'KwaZulu-nutal', value: 'KwaZulu-nutal' },  
   \],  
 },  
 {  
   nameKey: 'admin.filters.allDistrict',  
   attr: 'allDistrict',  
   type: 'select',  
   data: \[  
     { labelKey: 'admin.filters.allDistrict', value: 'all-District' },  
     {  
       labelKey: 'Jonnesburg',  
       value: 'Jonnesburg',  
     },  
     {  
       labelKey: 'Tshwane',  
       value: 'Tshwane',  
     },  
     {  
       labelKey: 'Cape town',  
       value: 'Cape town',  
     },  
   \],  
 },  
\];

export const selectedLCList \= \[  
 {  
   labelKey: 'Busisiwe Ngcobo',  
   value: 'Busisiwe-Ngcobo',  
   location: 'eThekwini, KwaZulu-Natal',  
   status: 'unassigned',  
 },  
 {  
   labelKey: 'Andile Mkhize',  
   value: 'Andile-Mkhize',  
   location: 'Johannesburg, Gauteng',  
   status: 'unassigned',  
 },  
\];

export const participantLCFilterOptions \= \[  
 {  
   nameKey: 'admin.filters.selectSupervisor',  
   attr: 'selectSupervisor',  
   type: 'select',  
   data: \[  
     {  
       labelKey: 'Dr. Lerato Mokoena Johannesburg',  
       value: 'Dr. Lerato Mokoena Johannesburg ',  
     },  
     {  
       labelKey: 'Zanele Ndabae Thekwini',  
       value: 'Zanele Ndabae Thekwini',  
     },  
   \],  
 },  
\];

/home/ttpl-rt-77/BRAC/graduation-portal/src/components/Filter/index.tsx

import React from 'react';  
import { VStack, HStack, Text, Image, Input, InputField, Button } from '@ui';  
import Select from '../ui/Inputs/Select';  
import { filterStyles } from './Styles';  
import filterIcon from '../../assets/images/FilterIcon.png';  
import { useLanguage } from '@contexts/LanguageContext';

interface FilterButtonProps {  
 data: any\[\];  
 showClearFilterButton?: boolean;  
 onChange?: (values: Record\<string, any\>) \=\> void;  
}

export default function FilterButton({  
 data,  
 showClearFilterButton \= false,  
 onChange,  
}: FilterButtonProps) {  
 const { t } \= useLanguage();  
 const \[value, setValue\] \= React.useState\<any\>({});

 // Get default display values for UI (not included in output)  
 const getDefaultDisplayValue \= (item: any) \=\> {  
   if (item.type \!== 'search' && item.data && item.data.length \> 0) {  
     const firstItem \= item.data\[0\];  
     // Extract the actual value string from the first item  
     if (typeof firstItem \=== 'string') {  
       return firstItem;  
     } else if (firstItem?.value \!== undefined) {  
       // Use marker for actual null to match option values  
       // Empty strings are handled directly  
       if (firstItem.value \=== null) {  
         return '\_\_NULL\_VALUE\_\_';  
       } else {  
         return String(firstItem.value);  
       }  
     }  
   }  
   return '';  
 };

 const handleClearFilters \= () \=\> {  
   const clearedValue \= {};  
   setValue(clearedValue);  
   // Notify parent component when filters are cleared  
   onChange?.(clearedValue);  
 };

 return (  
   \<VStack {...filterStyles.container}\>  
     {/\* Title \*/}  
     \<HStack {...filterStyles.titleContainer}\>  
       \<Image  
         source\={filterIcon}  
         style\={{ width: 20, height: 20 }}  
         alt\="Filter icon"  
       /\>  
       \<Text {...filterStyles.titleText}\>{t('common.filters')}\</Text\>  
     \</HStack\>

     {/\* Filters Row \*/}  
     \<HStack {...filterStyles.filterFieldsContainer}\>  
       {data.map((item: any) \=\> (  
         \<VStack  
           key\={item.attr}  
           {...(item.type \=== 'search'  
             ? filterStyles.searchContainer  
             : filterStyles.roleContainer)}  
         \>  
           \<Text {...filterStyles.label}\>  
             {item.nameKey ? t(item.nameKey) : item.name}  
           \</Text\>  
           {item.type \=== 'search' ? (  
             \<Input {...filterStyles.input}\>  
               \<InputField  
                 placeholder\={  
                   item.placeholderKey  
                     ? t(item.placeholderKey)  
                     : item.placeholder ||  
                       (item.nameKey  
                         ? \`${t('common.search')} ${t(  
                             item.nameKey,  
                           ).toLowerCase()}...\`  
                         : \`Search ${item.name?.toLowerCase()}...\`)  
                 }  
                 value\={value?.\[item.attr\] || ''}  
                 onChangeText\={(text: string) \=\> {  
                   let updatedValue: any;  
                   if (\!text || text.trim() \=== '') {  
                     updatedValue \= { ...value };  
                     delete updatedValue\[item.attr\];  
                   } else {  
                     updatedValue \= { ...value, \[item.attr\]: text };  
                   }  
                   setValue(updatedValue);  
                   // Notify parent component of changes  
                   onChange?.(updatedValue);  
                 }}  
               /\>  
             \</Input\>  
           ) : (  
             \<Select  
               value\={value?.\[item.attr\] || getDefaultDisplayValue(item)}  
               onChange\={v \=\> {  
                 let updatedValue: any;  
                 // ❗ If actual null (marked), empty string, or undefined → remove from state  
                 // Note: String "null" is kept in state, only actual null/empty removes the key  
                 if (v \== null || v \=== '\_\_NULL\_VALUE\_\_' || v \=== '') {  
                   updatedValue \= { ...value };  
                   delete updatedValue\[item.attr\];  
                 } else {  
                   // Otherwise store the selected value (including string "null")  
                   updatedValue \= { ...value, \[item.attr\]: v };  
                 }  
                 setValue(updatedValue);  
                 // Notify parent component of changes  
                 onChange?.(updatedValue);  
               }}  
               options\={  
                 item?.data?.map((option: any) \=\> {  
                   // If it's a string, return as-is (backward compatibility)  
                   if (typeof option \=== 'string') {  
                     return option;  
                   }  
                   // If it's an object with labelKey, translate it  
                   if (option.labelKey) {  
                     return {  
                       ...option,  
                       label: t(option.labelKey),  
                     };  
                   }  
                   // If it has label, return as-is  
                   return option;  
                 }) || \[\]  
               }  
               {...filterStyles.input}  
             /\>  
           )}  
         \</VStack\>  
       ))}

       {/\* Clear Filters Button \*/}  
       {showClearFilterButton && (  
         \<VStack {...filterStyles.clearButtonContainer}\>  
           \<Button onPress\={handleClearFilters} {...filterStyles.button}\>  
             \<Text {...filterStyles.buttonText}\>  
               {t('common.clearFilters')}  
             \</Text\>  
           \</Button\>  
         \</VStack\>  
       )}  
     \</HStack\>  
   \</VStack\>  
 );  
}

/home/ttpl-rt-77/BRAC/graduation-portal/src/components/TitleHeader/index.tsx

import React from 'react';  
import { HStack, VStack, Text } from '@ui';  
import { titleHeaderStyles } from './Styles';  
import { useLanguage } from '@contexts/LanguageContext';

export interface TitleHeaderProps {  
 title: string; // Translation key for the header title  
 description: string; // Translation key for the header description  
 right?: React.ReactNode;  
 bottom?: React.ReactNode;  
}

const TitleHeader: React.FC\<TitleHeaderProps\> \= ({  
 title,  
 description,  
 right,  
 bottom,  
}) \=\> {  
 const { t } \= useLanguage();

 return (  
   \<HStack  
     justifyContent\="space-between"  
     alignItems\="flex-start"  
     width\="100%"  
     flexWrap\="wrap"  
   \>  
     \<VStack {...titleHeaderStyles.textContainer} flex\={1}\>  
       \<Text {...titleHeaderStyles.titleText}\>{t(title)}\</Text\>  
       \<Text {...titleHeaderStyles.descriptionText}\>{t(description)}\</Text\>  
       {bottom && \<VStack marginTop\={'$3'}\>{bottom}\</VStack\>}  
     \</VStack\>

     {/\*  
       Conditionally render right-side content (action buttons, icons, etc.)  
       \- Only renders if 'right' prop is provided (not null/undefined)  
       \- Wraps in VStack with flex-end alignment to position content on the right  
       \- This allows screens to optionally include action buttons without breaking layout  
     \*/}  
     {right && \<VStack alignItems\="flex-end"\>{right}\</VStack\>}  
   \</HStack\>  
 );  
};

export default TitleHeader;

en.json

"assignUsers": {  
     "step1SelectSupervisor": "Step 1: Select Supervisor",  
     "filterByProvince": "Filter by province and choose a supervisor",  
     "step2AssignLinkageChampions": "Step 2: Assign Linkage Champions",  
     "filterByGeography": "Filter by geography and select LCs to assign",  
     "chooseSupervisor": "Choose a supervisor to view their assigned LCs",  
     "step2SelectLC": "Step2: Select Linkage Champion",  
     "chooseLcFrom": "Choose an LC from {{supervisor}}'s team"  
   }

"filterByProvince": "Filter by Province",  
     "selectSupervisor": "Select Supervisor",  
     "allProvinces": "All Provinces",  
     "allDistrict": "ALl District"  
   "assignUsersDescription": "Assign Linkage Champions to Supervisors and Participants to LCs",

app.Navigator

       {  
         name: 'assign-users',  
         path: '/assign-users',  
         component: AssignUsersScreen,  
       },

{right && (  
       \<VStack  
         alignItems\={isMobile ? "stretch" : "flex-end"}  
         width\={isMobile ? "$full" : undefined}  
       \>  
         {right}  
       \</VStack\>  
     )}  
