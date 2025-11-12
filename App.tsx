/**
 * IDP / Project / Bundle Task Management App
 * Features offline support with sync capabilities
 */

import React from 'react';
import './src/config/i18n'; // Initialize i18n
import { GlobalProvider, useGlobal } from './src/contexts/GlobalContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Box, GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { theme } from './src/config/theme';
import { AuthProvider } from './src/contexts/AuthContext';
import ProjectPlayer from './src/web-component/ProjectPlayer';
import ProjectWebComponentPlayer from '@components/WebComponent/ProjectWebComponentPlayer';
import { isAndroid } from '@utils/platform';

// -------------- Bundle Level --------------
const dataBundle = {
  id: 'bundle_1',
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
          description: 'Take and upload participant’s photo for verification.',
          status: 'pending',
        },
      ],
    },
    {
      id: 'project_2',
      title: 'Livelihoods',
      description: 'Helping participants access employment opportunities.',
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
      description: 'Ensuring participants benefit from government schemes.',
      tasks: [],
    },
  ],
};

const dataSingle = {
  id: 'p1',
  type: 'single',
  title: 'First Time Meeting the Participant',
  description: 'Complete all required steps before enrolling the participant',
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
      description: 'Review and finalize the Service Level Agreement details',
      status: 'pending',
    },
  ],
};

function App() {
  const { colorMode } = useGlobal();

  return (
    <GluestackUIProvider config={theme} colorMode={colorMode}>
      <AuthProvider>
        <Box width="100%" height={isAndroid ? '100%' : '100vh'}>
          <ProjectWebComponentPlayer
            // previewMode={true}
            playerConfig={{
              projectdata: dataBundle,
              previewmode: 'false',
            }}
          />
        </Box>
      </AuthProvider>
    </GluestackUIProvider>
  );
}

const RootApp = () => {
  return (
    <GlobalProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </GlobalProvider>
  );
};

export default RootApp;
