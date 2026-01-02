import { ProjectData } from '../project-player/types/project.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './STORAGE_KEYS';

declare const process:
  | {
      env: {
        [key: string]: string | undefined;
      };
    }
  | undefined;

export const DUMMY_PROJECT_DATA: ProjectData = {
  _id: 'Onboarding the Participant',
  solutionId: 'sol-community-health-001',
  title: 'Onboarding the Participant',
  description: 'Complete all required steps before enrolling the participant',
  status: 'in-progress',
  progress: 58,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-12-02T10:30:00Z',
  tasks: [
    {
      _id: 'task-onboard-001',
      name: 'Capture Consent',
      description: 'Upload signed consent forms',
      type: 'file',
      status: 'to-do',
      isRequired: true,
      metadata: {
        minFiles: 1,
        category: 'onboarding',
      },
    },

    {
      _id: 'task-onboard-002',
      name: 'Complete Household Profile',
      description: 'Fill in comprehensive household profiling form',
      type: 'observation',
      status: 'to-do',
      isRequired: true,
      observationFormId: 'form-household-profile-v1',
      metadata: {
        category: 'onboarding',
        formType: 'household-profile',
      },
    },

    {
      _id: 'task-onboard-003',
      name: 'Upload SLA Form',
      description: 'Upload signed Service Level Agreement form',
      type: 'file',
      status: 'to-do',
      isRequired: true,
      metadata: {
        minFiles: 1,
        category: 'onboarding',
      },
    },
  ],
};

export const COMPLEX_PROJECT_DATA: ProjectData = {
  _id: 'Employment Pathway',
  solutionId: 'sol-community-health-001',
  title: 'Employment Pathway',
  description:
    'Comprehensive intervention plan for participants seeking formal employment with full support across all pillars',
  status: 'in-progress',
  progress: 58,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-12-02T10:30:00Z',
  tasks: [
    {
      _id: 'task-001',
      name: 'Social Empowerment',
      description: '',
      type: 'project',
      status: 'to-do',
      isRequired: true,
      metadata: {
        minFiles: 1,
        category: 'onboarding',
      },
      children: [
        {
          _id: 'subtask-001',
          name: 'Organize & Schedule training on social empowerment sessions: Session 1 - Emotional Self Awareness',
          description:
            'Coordinate with service provider to schedule and organize Emotional Self Awareness training session for participant.',
          type: 'file',
          status: 'to-do',
          isRequired: true,
        },
        {
          _id: 'subtask-002',
          name: 'Organize & Schedule training on social empowerment sessions: Session 2 - Self Management',
          description:
            'Coordinate with service provider to schedule and organize Self Management training session for participant.',
          type: 'file',
          status: 'to-do',
          isRequired: true,
        },
      ],
    },
    {
      _id: 'task-002',
      name: 'Livelihoods',
      description: '',
      type: 'project',
      status: 'to-do',
      isRequired: true,
      metadata: {
        minFiles: 1,
        category: 'onboarding',
      },
      children: [
        {
          _id: 'subtask-003',
          name: 'Organize & Schedule training on social empowerment sessions: Session 1 - Emotional Self Awareness',
          description:
            'Coordinate with service provider to schedule and organize Emotional Self Awareness training session for participant.',
          type: 'file',
          status: 'to-do',
          isRequired: true,
        },
        {
          _id: 'subtask-004',
          name: 'Organize & Schedule training on social empowerment sessions: Session 2 - Self Management',
          description:
            'Coordinate with service provider to schedule and organize Self Management training session for participant.',
          type: 'file',
          status: 'to-do',
          isRequired: true,
        },
      ],
    },
    // {
    //   _id: 'task-onboard-001',
    //   name: 'Capture Consent',
    //   description: 'Upload signed consent forms',
    //   type: 'file',
    //   status: 'to-do',
    //   isRequired: true,
    //   metadata: {
    //     minFiles: 1,
    //     category: 'onboarding',
    //   },
    // },
  ],
};

// Default base URL fallback - used only if env variable is not set
const DEFAULT_BASE_URL = 'https://brac-dev.tekdinext.com';

// Get baseUrl from environment variable, fallback to default if not set
const baseUrl =
  typeof process !== 'undefined' && process?.env?.API_BASE_URL
    ? process.env.API_BASE_URL
    : DEFAULT_BASE_URL;

// Helper function to get access token from AsyncStorage
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return null;
  }
};

export const PROJECT_PLAYER_CONFIGS = {
  maxFileSize: 50,
  baseUrl: baseUrl,
  // accessToken is a function that fetches token from AsyncStorage
  accessToken: getAccessToken,
  language: 'en',
  profileInfo: {
    id: 123,
    name: 'John Doe',
  },
  redirectionLinks: {
    unauthorizedRedirectUrl: '/login',
  },
  data: {
    solutionId: 'solution_001',
    projectId: 'GBL_P01_ONBOARDING',
  },
};

export const MODE = {
  // Edit mode with full permissions
  editMode: {
    mode: 'edit' as const,
  },
  // Preview mode (template view)
  previewMode: {
    mode: 'preview' as const,
  },

  // Read-only mode
  readOnlyMode: {
    mode: 'read-only' as const,
  },
};
