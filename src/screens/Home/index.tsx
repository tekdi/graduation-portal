import React, { useState } from 'react';
import { VStack, Box, Text } from '@ui';
import Container from '@ui/Container';
import PageHeader from '@components/PageHeader';
import { useLanguage } from '@contexts/LanguageContext';

import { dashboardStyles } from './Styles';
import DashboardHeader from './components/DashboardHeader';
import OverviewDashboard from './components/OverviewDashboard';
import OutcomesDashboard from './components/OutcomesDashboard';
import GraduationCriteriaDashboard from './components/GraduationCriteriaDashboard';

/**
 * DashboardScreen - Layout is automatically applied by navigation based on user role
 */
const DashboardScreen = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'outcomes' | 'graduationCriteria'>('overview');
  const [selectedTime, setSelectedTime] = useState('All Time');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedGender, setSelectedGender] = useState('All Gender');
  const [outcomesSelectedParticipant, setOutcomesSelectedParticipant] = useState<string>('');
  const [graduationCriteriaSelectedParticipant, setGraduationCriteriaSelectedParticipant] = useState<string>('');

  return (
    <VStack {...dashboardStyles.container}>
      {/* Page Header - Full width, contents centered by internal Container */}
      <PageHeader
        title={t('requestorDashboard.pageHeader.title')}
        _title={dashboardStyles.pageHeaderTitle}
        subtitle={t('requestorDashboard.pageHeader.description')}
        _subtitle={dashboardStyles.pageHeaderSubtitle}
        _css={dashboardStyles.pageHeaderContainer}
      />

      <VStack {...dashboardStyles.contentWrapper}>
        <Container>
          <VStack {...dashboardStyles.mainVStack}>
            {/* Dashboard Header containing Filters and Tabs */}
            <DashboardHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
            />

            {/* Overview Tab Content */}
            {activeTab === 'overview' && <OverviewDashboard />}

            {/* Outcomes Tab Content */}
            {activeTab === 'outcomes' && (
              <OutcomesDashboard
                selectedParticipant={outcomesSelectedParticipant}
                onParticipantChange={setOutcomesSelectedParticipant}
              />
            )}

            {/* Graduation Criteria Tab Content */}
            {activeTab === 'graduationCriteria' && (
              <GraduationCriteriaDashboard
                selectedParticipant={graduationCriteriaSelectedParticipant}
                onParticipantChange={setGraduationCriteriaSelectedParticipant}
              />
            )}
          </VStack>
        </Container>
      </VStack>
    </VStack>
  );
};

export default DashboardScreen;
