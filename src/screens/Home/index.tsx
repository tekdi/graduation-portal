import React from 'react';
import { ScrollView, VStack, Text, Divider } from '@ui';

import { dashboardStyles } from './Styles';
import { useLanguage } from '@contexts/LanguageContext';
import ProjectPlayer from '../../web-component/ProjectPlayer';

/**
 * DashboardScreen - Layout is automatically applied by navigation based on user role
 */
const DashboardScreen = () => {
  const { t } = useLanguage();

  return (
    <ScrollView {...dashboardStyles.scrollView}>
      <VStack {...dashboardStyles.mainVStack}>
        <Text {...dashboardStyles.titleText}>{t('admin.dashboard')}</Text>
        <Text {...dashboardStyles.welcomeText}>
          {t('admin.dashboardDescription')}
        </Text>
      </VStack>
      <ProjectPlayer
        onAction={(type, step) => console.log('Action:', type, step)}
        onNavigate={(nextView, projectId) =>
          console.log('Navigate to', nextView, projectId)
        }
        // previewMode={true}
        data={{
          // -------------- Bundle Level --------------
          type: 'bundle',
          title: 'Employment Pathway - Full Support',
          description:
            'Comprehensive intervention plan for participants seeking formal employment.',
          meta: {
            pillars: 4,
            tasks: 41,
            version: 'v2.1',
          },
          projects: [
            {
              id: 'project_1',
              title: 'Social Empowerment',
              description:
                'Empowering individuals through community networks and awareness.',
              tasks: [
                {
                  id: 'task_1',
                  type: 'simple',
                  title: 'Identify community groups',
                  description: 'Meet and list local community support groups.',
                  status: 'pending',
                },
                {
                  id: 'task_2',
                  type: 'file',
                  title: 'Upload Beneficiary Photo',
                  description:
                    'Take and upload participant’s photo for verification.',
                  status: 'pending',
                },
              ],
            },
            {
              id: 'project_2',
              title: 'Livelihoods',
              description:
                'Helping participants access employment opportunities.',
              tasks: [
                {
                  id: 'task_3',
                  type: 'update',
                  title: 'Verify Job Preferences',
                  description: 'Update participant job preferences in system.',
                  status: 'completed',
                },
              ],
            },
            {
              id: 'project_3',
              title: 'Financial Inclusion',
              description: 'Promoting access to financial tools and training.',
              tasks: [],
            },
            {
              id: 'project_4',
              title: 'Social Protection',
              description:
                'Ensuring participants benefit from government schemes.',
              tasks: [],
            },
          ],
        }}
      />
      <Divider />
      <ProjectPlayer
        previewMode={true}
        data={{
          type: 'single',
          title: 'First Time Meeting the Participant',
          description:
            'Complete all required steps before enrolling the participant',
          meta: { completedSteps: 0, totalSteps: 3 },
          tasks: [
            {
              id: 't1',
              type: 'update',
              title: 'Complete Household Profile',
              description: 'Fill in comprehensive household profiling form',
              status: 'pending',
            },
            {
              id: 't2',
              type: 'file',
              title: 'Upload Consent Form',
              description: 'Upload signed participant consent document',
              status: 'pending',
            },
            {
              id: 't3',
              type: 'profile_update',
              title: 'Review Participant SLA',
              description:
                'Review and finalize the Service Level Agreement details',
              status: 'pending',
            },
          ],
        }}
        onAction={type => console.log('Action:', type)}
        onNavigate={(nextView, projectId) =>
          console.log('Navigate to', nextView, projectId)
        }
      />
    </ScrollView>
  );
};

export default DashboardScreen;
