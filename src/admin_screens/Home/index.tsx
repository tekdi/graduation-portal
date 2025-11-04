import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  ScrollView,
  VStack,
  HStack,
  Box,
  Text,
  Pressable,
  Icon,
  Badge,
  PaperclipIcon,
  AddIcon,
  CheckCircleIcon,
  InfoIcon,
  RepeatIcon,
  Card,
} from '@ui';

import {
  dashboardStyles,
  dashboardCardStyles,
  quickActionCardStyles,
  recentActivityItemStyles,
} from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import AdminLayout from '@layout/admin/Layout';

const DashboardCard = ({ title, value, change, subText }: any) => (
  <Box {...dashboardCardStyles.container}>
    <VStack {...dashboardCardStyles.contentVStack}>
      <Text {...dashboardCardStyles.titleText}>{title || ''}</Text>
      <Text {...dashboardCardStyles.valueText}>{value || ''}</Text>

      {change ? (
        <HStack {...dashboardCardStyles.changeHStack}>
          <Icon as={RepeatIcon} color="$success600" size="sm" />
          <Text {...dashboardCardStyles.changeText}>{change || ''}</Text>
        </HStack>
      ) : null}

      {subText ? (
        <Text {...dashboardCardStyles.subText}>{subText || ''}</Text>
      ) : null}
    </VStack>
  </Box>
);

const QuickActionCard = ({ title, subtitle, icon, bg }: any) => (
  <Pressable {...quickActionCardStyles.pressable}>
    <HStack {...quickActionCardStyles.container}>
      <Box bg={bg} {...quickActionCardStyles.iconBox}>
        <Icon as={icon} color="$primary600" size="md" />
      </Box>
      <VStack {...quickActionCardStyles.contentVStack}>
        <Text {...quickActionCardStyles.titleText}>{title || ''}</Text>
        <Text {...quickActionCardStyles.subtitleText}>{subtitle || ''}</Text>
      </VStack>
    </HStack>
  </Pressable>
);

const RecentActivityItem = ({ title, subtitle, status }: any) => {
  const statusMap: Record<
    string,
    { icon: typeof CheckCircleIcon; color: string }
  > = {
    success: { icon: CheckCircleIcon, color: '$success600' },
    info: { icon: InfoIcon, color: '$info600' },
    warning: { icon: InfoIcon, color: '$warning600' },
  };
  const { icon, color } =
    statusMap[status as keyof typeof statusMap] || statusMap.info;

  return (
    <HStack {...recentActivityItemStyles.container}>
      <HStack {...recentActivityItemStyles.leftHStack}>
        <Icon as={icon} color={color} size="md" />
        <VStack {...recentActivityItemStyles.contentVStack}>
          <Text {...recentActivityItemStyles.itemTitle}>{title || ''}</Text>
          <Text {...recentActivityItemStyles.itemSubtitle}>
            {subtitle || ''}
          </Text>
        </VStack>
      </HStack>
      <Badge {...recentActivityItemStyles.badge} action={status}>
        <Text>{status?.charAt(0).toUpperCase() + status?.slice(1) || ''}</Text>
      </Badge>
    </HStack>
  );
};

const DashboardScreen = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width < 768);
    });
    return () => subscription.remove();
  }, []);

  return (
    <AdminLayout>
      <ScrollView {...dashboardStyles.scrollView}>
        <VStack {...dashboardStyles.mainVStack}>
          <Text {...dashboardStyles.titleText}>{t('admin.dashboard')}</Text>
          <Text {...dashboardStyles.welcomeText}>
            {t('admin.dashboardDescription')}
          </Text>

          {/* ==== Top Stats ==== */}
          <HStack {...dashboardStyles.statsHStack}>
            <DashboardCard
              title="Import Success Rate"
              value="92%"
              change="+2.1% from last month"
              subText="Data import success rate this month"
            />
            <DashboardCard
              title="Participants Enrolled"
              value="8,500"
              change="+340 from last month"
              subText="Total active participants"
            />
            <DashboardCard
              title="Template Versions Active"
              value="v3.1"
              change="Updated from last month"
              subText="Current IDP template version"
            />
            <DashboardCard
              title="LC Accounts Active"
              value="150"
              change="+12 from last month"
              subText="Active Learning Coach accounts"
            />
          </HStack>

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
              <VStack space="xs">
                <QuickActionCard
                  title="Upload Users"
                  subtitle="Bulk import participants and coaches"
                  icon={PaperclipIcon}
                  bg="$primary100"
                />
                <QuickActionCard
                  title="Create LC Account"
                  subtitle="Add new Learning Coach"
                  icon={AddIcon}
                  bg="$success100"
                />
                <QuickActionCard
                  title="Create IDP Template"
                  subtitle="Design new development plan"
                  icon={AddIcon}
                  bg="$secondary100"
                />
              </VStack>
            </Card>

            {/* Recent Activity */}
            <Card {...dashboardStyles.sectionBox}>
              <Text {...dashboardStyles.sectionTitle}>
                {t('admin.recentActivity')}
              </Text>
              <VStack space="xs">
                <RecentActivityItem
                  title="Bulk user import completed"
                  subtitle="by System • 5 minutes ago"
                  status="success"
                />
                <RecentActivityItem
                  title="Template v3.1 activated"
                  subtitle="by Admin User • 1 hour ago"
                  status="info"
                />
                <RecentActivityItem
                  title="Password reset failed for participant"
                  subtitle="by LC-Thabo.Mthembu • 2 hours ago"
                  status="warning"
                />
                <RecentActivityItem
                  title="New Learning Coach account created"
                  subtitle="by Admin User • 3 hours ago"
                  status="success"
                />
                <RecentActivityItem
                  title="IDP progress sync completed"
                  subtitle="by System • 4 hours ago"
                  status="info"
                />
              </VStack>
            </Card>
          </HStack>
        </VStack>
      </ScrollView>
    </AdminLayout>
  );
};

export default DashboardScreen;
