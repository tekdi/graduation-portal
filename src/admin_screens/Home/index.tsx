import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  ScrollView,
  VStack,
  HStack,
  Text,
  PaperclipIcon,
  AddIcon,
  Card,
} from '@ui';

import { dashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import AdminLayout from '@layout/admin/Layout';
import QuickActionCard from './QuickActionCard';
import RecentActivityItem from './RecentActivityItem';
import DashboardCard from './DashboardCard';
const DashboardScreen = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width < 768);
    });
    return () => subscription.remove();
  }, []);

  const topStats = [
    {
      title: 'Import Success Rate',
      value: '92%',
      change: '+2.1% from last month',
      subText: 'Data import success rate this month',
    },
    {
      title: 'Participants Enrolled',
      value: '8,500',
      change: '+340 from last month',
      subText: 'Total active participants',
    },
    {
      title: 'Template Versions Active',
      value: 'v3.1',
      change: 'Updated from last month',
      subText: 'Current IDP template version',
    },
    {
      title: 'LC Accounts Active',
      value: '150',
      change: '+12 from last month',
      subText: 'Active Learning Coach accounts',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Users',
      subtitle: 'Bulk import participants and coaches',
      icon: PaperclipIcon,
      bg: '$primary100',
    },
    {
      title: 'Create LC Account',
      subtitle: 'Add new Learning Coach',
      icon: AddIcon,
      bg: '$success100',
    },
    {
      title: 'Create IDP Template',
      subtitle: 'Design new development plan',
      icon: AddIcon,
      bg: '$secondary100',
    },
  ];

  const recentActivity = [
    {
      title: 'Bulk user import completed',
      subtitle: 'by System • 5 minutes ago',
      status: 'success',
    },
    {
      title: 'New Learning Coach account created',
      subtitle: 'by Admin User • 3 hours ago',
      status: 'success',
    },
    {
      title: 'IDP progress sync completed',
      subtitle: 'by System • 4 hours ago',
      status: 'info',
    },
    {
      title: 'Password reset failed for participant',
      subtitle: 'by LC-Thabo.Mthembu • 2 hours ago',
      status: 'warning',
    },
  ];

  const renderTopStats = () => {
    return topStats.map(stat => <DashboardCard key={stat.title} {...stat} />);
  };

  const renderQuickActions = () => {
    return quickActions.map(action => (
      <QuickActionCard key={action.title} {...action} />
    ));
  };

  const renderRecentActivity = () => {
    return recentActivity.map(activity => (
      <RecentActivityItem key={activity.title} {...activity} />
    ));
  };

  return (
    <AdminLayout>
      <ScrollView {...dashboardStyles.scrollView}>
        <VStack {...dashboardStyles.mainVStack}>
          <Text {...dashboardStyles.titleText}>{t('admin.dashboard')}</Text>
          <Text {...dashboardStyles.welcomeText}>
            {t('admin.dashboardDescription')}
          </Text>

          {/* ==== Top Stats ==== */}
          <HStack {...dashboardStyles.statsHStack}>{renderTopStats()}</HStack>

          {/* ==== Quick Actions + Recent Activity ==== */}
          <HStack
            {...dashboardStyles.sectionsContainer}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            {/* Quick Actions */}
            <Card {...dashboardStyles.sectionBox}>
              <Text {...dashboardStyles.sectionTitle}>
                {t('admin.quickActions')}
              </Text>
              <VStack space="xs">{renderQuickActions()}</VStack>
            </Card>

            {/* Recent Activity */}
            <Card {...dashboardStyles.sectionBox}>
              <Text {...dashboardStyles.sectionTitle}>
                {t('admin.recentActivity')}
              </Text>
              <VStack space="xs">{renderRecentActivity()}</VStack>
            </Card>
          </HStack>
        </VStack>
      </ScrollView>
    </AdminLayout>
  );
};

export default DashboardScreen;
