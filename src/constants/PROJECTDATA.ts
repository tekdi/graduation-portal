import { ProjectData } from '../project-player/types/project.types';

/**
 * Dummy Project Data for Project Player
 * Demonstrates all task types, nested projects, and various states
 */
export const DUMMY_PROJECT_DATA: ProjectData = {
  _id: 'proj-health-assessment-2024',
  solutionId: 'sol-community-health-001',
  name: 'Community Health Assessment Project - Phase 1',
  description:
    'A comprehensive community health assessment program designed to identify key health challenges, implement targeted interventions, and measure impact across District-A communities.',
  status: 'in-progress',
  progress: 58,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-12-02T10:30:00Z',
  metaData: {
    district: 'District-A',
    region: 'Northern Region',
    assignedLC: 'John Doe',
    assignedLCId: 'lc-123',
    priority: 'high',
    startDate: '2024-01-15',
    expectedEndDate: '2024-12-31',
    budget: 50000,
    beneficiaries: 5000,
    category: 'Community Health',
    tags: ['health', 'community', 'assessment', 'intervention'],
  },
  tasks: [
    // ============================================
    // Task 1: Simple Task - COMPLETED
    // ============================================
    {
      _id: 'task-001',
      name: 'Review Project Guidelines and Methodology',
      description:
        'Thoroughly review all project guidelines, methodologies, and best practices documentation. Understand the assessment framework and reporting requirements.',
      type: 'simple',
      status: 'completed',
      isRequired: true,
      metadata: {
        completedAt: '2024-01-20T14:00:00Z',
        completedBy: 'John Doe',
        timeSpent: 120, // minutes
      },
    },

    // ============================================
    // Task 2: File Upload Task - IN PROGRESS
    // ============================================
    {
      _id: 'task-002',
      name: 'Upload Community Demographic Survey Results',
      description:
        'Upload completed survey forms, data collection sheets, and demographic analysis reports collected from community households.',
      type: 'file',
      status: 'in-progress',
      isRequired: true,
      attachments: [
        {
          _id: 'att-001',
          name: 'demographic_survey_results_Q4_2024.pdf',
          type: 'application/pdf',
          size: 3145728, // 3MB
          url: 'https://storage.example.com/files/demographic_survey_q4.pdf',
          uploadStatus: 'uploaded',
          createdAt: '2024-11-25T09:00:00Z',
        },
        {
          _id: 'att-002',
          name: 'household_data_collection.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 1572864, // 1.5MB
          url: 'https://storage.example.com/files/household_data.xlsx',
          uploadStatus: 'uploaded',
          createdAt: '2024-11-25T09:30:00Z',
        },
        {
          _id: 'att-003',
          name: 'community_photos.zip',
          type: 'application/zip',
          size: 8388608, // 8MB
          url: 'https://storage.example.com/files/community_photos.zip',
          uploadStatus: 'uploading',
          createdAt: '2024-12-02T10:00:00Z',
        },
      ],
      metadata: {
        uploadProgress: 65,
        totalFilesExpected: 5,
        filesUploaded: 2,
      },
    },

    // ============================================
    // Task 3: Observation Task - PENDING
    // ============================================
    {
      _id: 'task-003',
      name: 'Community Health Infrastructure Observation',
      description:
        'Complete detailed observation form assessing available health facilities, medical equipment, staff availability, and infrastructure quality.',
      type: 'observation',
      status: 'pending',
      isRequired: true,
      observationFormId: 'form-health-infrastructure-v2',
      metadata: {
        formCompleted: false,
        estimatedTime: 45, // minutes
        dueDate: '2024-12-15',
      },
    },

    // ============================================
    // Task 4: Simple Task - COMPLETED
    // ============================================
    {
      _id: 'task-004',
      name: 'Conduct Stakeholder Meeting',
      description:
        'Organize and conduct initial stakeholder meeting with community leaders, health workers, and local authorities.',
      type: 'simple',
      status: 'completed',
      isRequired: true,
      metadata: {
        completedAt: '2024-10-15T16:00:00Z',
        attendees: 25,
        location: 'Community Center Hall',
      },
    },

    // ============================================
    // Task 5: NESTED PROJECT - Level 1
    // ============================================
    {
      _id: 'task-005',
      name: 'Health Intervention Planning Sub-Project',
      description:
        'Comprehensive sub-project focused on planning, implementing, and monitoring health interventions based on assessment findings.',
      type: 'project',
      status: 'in-progress',
      isRequired: true,
      children: [
        // Level 1 - Task 1: Simple
        {
          _id: 'task-005-001',
          name: 'Identify Top 5 Priority Health Issues',
          description:
            'Analyze survey data and observations to identify the five most critical health issues affecting the community.',
          type: 'simple',
          status: 'completed',
          isRequired: true,
          metadata: {
            issues: [
              'Maternal health services',
              'Child malnutrition',
              'Waterborne diseases',
              'Mental health support',
              'Chronic disease management',
            ],
          },
        },

        // Level 1 - Task 2: File Upload
        {
          _id: 'task-005-002',
          name: 'Upload Intervention Strategy Document',
          description:
            'Upload the comprehensive intervention strategy document outlining approaches for each identified health issue.',
          type: 'file',
          status: 'in-progress',
          isRequired: true,
          attachments: [
            {
              _id: 'att-004',
              name: 'intervention_strategy_draft_v3.docx',
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              size: 1048576, // 1MB
              uploadStatus: 'uploaded',
              createdAt: '2024-11-28T11:00:00Z',
            },
          ],
        },

        // Level 1 - Task 3: Observation
        {
          _id: 'task-005-003',
          name: 'Stakeholder Engagement Observation',
          description:
            'Document stakeholder engagement levels, community participation, and feedback during intervention planning phase.',
          type: 'observation',
          status: 'pending',
          isRequired: false,
          observationFormId: 'form-stakeholder-engagement-v1',
        },

        // ============================================
        // Level 1 - Task 4: NESTED PROJECT - Level 2
        // ============================================
        {
          _id: 'task-005-004',
          name: 'Resource Allocation & Budget Planning',
          description:
            'Detailed planning for resource allocation, budget distribution, and procurement strategies for intervention implementation.',
          type: 'project',
          status: 'in-progress',
          isRequired: true,
          children: [
            // Level 2 - Task 1: Simple
            {
              _id: 'task-005-004-001',
              name: 'Create Resource Requirements List',
              description:
                'Comprehensive list of all required resources including medical supplies, equipment, human resources, and infrastructure needs.',
              type: 'simple',
              status: 'completed',
              isRequired: true,
            },

            // Level 2 - Task 2: File Upload
            {
              _id: 'task-005-004-002',
              name: 'Upload Budget Allocation Spreadsheet',
              description:
                'Detailed budget breakdown showing allocation across different intervention categories and timeline.',
              type: 'file',
              status: 'in-progress',
              isRequired: true,
              attachments: [
                {
                  _id: 'att-005',
                  name: 'budget_allocation_2024.xlsx',
                  type: 'application/vnd.ms-excel',
                  size: 524288, // 512KB
                  uploadStatus: 'uploaded',
                  createdAt: '2024-11-30T14:00:00Z',
                },
              ],
            },

            // Level 2 - Task 3: Simple
            {
              _id: 'task-005-004-003',
              name: 'Vendor Selection and Procurement',
              description:
                'Identify and finalize vendors for medical supplies and equipment procurement.',
              type: 'simple',
              status: 'pending',
              isRequired: true,
            },

            // ============================================
            // Level 2 - Task 4: NESTED PROJECT - Level 3
            // ============================================
            {
              _id: 'task-005-004-004',
              name: 'Human Resource Planning',
              description:
                'Planning for staff recruitment, training, and deployment for intervention programs.',
              type: 'project',
              status: 'pending',
              isRequired: true,
              children: [
                // Level 3 - Task 1
                {
                  _id: 'task-005-004-004-001',
                  name: 'Define Staff Roles and Requirements',
                  description:
                    'Document required staff positions, qualifications, and responsibilities.',
                  type: 'simple',
                  status: 'pending',
                  isRequired: true,
                },

                // Level 3 - Task 2
                {
                  _id: 'task-005-004-004-002',
                  name: 'Upload Training Materials',
                  description:
                    'Upload staff training manuals, guidelines, and educational resources.',
                  type: 'file',
                  status: 'pending',
                  isRequired: true,
                },

                // Level 3 - Task 3
                {
                  _id: 'task-005-004-004-003',
                  name: 'Staff Performance Observation',
                  description:
                    'Conduct observations of staff performance during training sessions.',
                  type: 'observation',
                  status: 'pending',
                  isRequired: false,
                  observationFormId: 'form-staff-performance-v1',
                },
              ],
            },
          ],
        },

        // Level 1 - Task 5: Simple
        {
          _id: 'task-005-005',
          name: 'Finalize Intervention Timeline',
          description:
            'Create and approve the detailed implementation timeline for all planned interventions.',
          type: 'simple',
          status: 'pending',
          isRequired: true,
        },
      ],
    },

    // ============================================
    // Task 6: Profile Update Task
    // ============================================
    {
      _id: 'task-006',
      name: 'Update Community Health Profile',
      description:
        'Update the community health profile database with latest demographic data, health indicators, and facility information.',
      type: 'profile-update',
      status: 'pending',
      isRequired: false,
      metadata: {
        profileType: 'community-health',
        lastUpdated: '2024-06-15',
      },
    },

    // ============================================
    // Task 7: Observation Task - PENDING
    // ============================================
    {
      _id: 'task-007',
      name: 'Baseline Health Metrics Observation',
      description:
        'Record baseline health metrics including disease prevalence, vaccination rates, nutrition indicators, and healthcare access metrics.',
      type: 'observation',
      status: 'pending',
      isRequired: true,
      observationFormId: 'form-baseline-health-metrics-v3',
      metadata: {
        metricsCount: 15,
        estimatedTime: 60,
      },
    },

    // ============================================
    // Task 8: File Upload Task - COMPLETED
    // ============================================
    {
      _id: 'task-008',
      name: 'Submit Preliminary Assessment Report',
      description:
        'Upload the comprehensive preliminary assessment report including findings, analysis, and initial recommendations.',
      type: 'file',
      status: 'completed',
      isRequired: true,
      attachments: [
        {
          _id: 'att-006',
          name: 'preliminary_assessment_report_final.pdf',
          type: 'application/pdf',
          size: 5242880, // 5MB
          url: 'https://storage.example.com/reports/preliminary_assessment.pdf',
          uploadStatus: 'uploaded',
          createdAt: '2024-10-10T16:45:00Z',
        },
        {
          _id: 'att-007',
          name: 'executive_summary.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 786432, // 768KB
          url: 'https://storage.example.com/reports/executive_summary.docx',
          uploadStatus: 'uploaded',
          createdAt: '2024-10-10T17:00:00Z',
        },
      ],
    },

    // ============================================
    // Task 9: ANOTHER NESTED PROJECT - Level 1
    // ============================================
    {
      _id: 'task-009',
      name: 'Community Engagement & Education Program',
      description:
        'Multi-faceted community engagement program including health education, awareness campaigns, and community mobilization activities.',
      type: 'project',
      status: 'in-progress',
      isRequired: true,
      children: [
        // Level 1 - Task 1
        {
          _id: 'task-009-001',
          name: 'Design Health Education Materials',
          description:
            'Create culturally appropriate health education materials in local languages.',
          type: 'simple',
          status: 'completed',
          isRequired: true,
        },

        // Level 1 - Task 2
        {
          _id: 'task-009-002',
          name: 'Upload Campaign Posters and Brochures',
          description:
            'Upload final versions of all campaign materials including posters, brochures, and infographics.',
          type: 'file',
          status: 'in-progress',
          isRequired: true,
          attachments: [
            {
              _id: 'att-008',
              name: 'health_education_poster_set.pdf',
              type: 'application/pdf',
              size: 4194304, // 4MB
              uploadStatus: 'uploaded',
              createdAt: '2024-11-15T10:00:00Z',
            },
          ],
        },

        // Level 1 - Task 3
        {
          _id: 'task-009-003',
          name: 'Conduct Community Awareness Sessions',
          description:
            'Organize and facilitate health awareness sessions in various community locations.',
          type: 'observation',
          status: 'in-progress',
          isRequired: true,
          observationFormId: 'form-awareness-session-v2',
          metadata: {
            sessionsPlanned: 10,
            sessionsCompleted: 6,
          },
        },

        // Level 1 - Task 4
        {
          _id: 'task-009-004',
          name: 'Monitor Campaign Reach and Impact',
          description:
            'Track campaign reach, participant engagement, and preliminary impact indicators.',
          type: 'simple',
          status: 'pending',
          isRequired: false,
        },
      ],
    },

    // ============================================
    // Task 10: Simple Task - PENDING
    // ============================================
    {
      _id: 'task-010',
      name: 'Prepare Mid-Term Progress Presentation',
      description:
        'Create presentation summarizing project progress, key findings, challenges faced, and next steps for stakeholder review meeting.',
      type: 'simple',
      status: 'pending',
      isRequired: true,
      metadata: {
        dueDate: '2024-12-20',
        presentationLength: 30, // minutes
      },
    },

    // ============================================
    // Task 11: Observation Task - PENDING
    // ============================================
    {
      _id: 'task-011',
      name: 'Impact Assessment Observation',
      description:
        'Comprehensive observation of early impact indicators including behavior change, knowledge improvement, and service utilization.',
      type: 'observation',
      status: 'pending',
      isRequired: true,
      observationFormId: 'form-impact-assessment-comprehensive',
      metadata: {
        categories: [
          'Behavior Change',
          'Knowledge Assessment',
          'Service Utilization',
          'Community Satisfaction',
        ],
      },
    },

    // ============================================
    // Task 12: File Upload Task - SUBMITTED
    // ============================================
    {
      _id: 'task-012',
      name: 'Submit Monthly Progress Report - November',
      description:
        'Monthly progress report documenting activities completed, milestones achieved, and metrics tracked during November 2024.',
      type: 'file',
      status: 'submitted',
      isRequired: true,
      attachments: [
        {
          _id: 'att-009',
          name: 'monthly_progress_report_nov_2024.pdf',
          type: 'application/pdf',
          size: 2097152, // 2MB
          url: 'https://storage.example.com/reports/monthly_nov_2024.pdf',
          uploadStatus: 'uploaded',
          createdAt: '2024-11-30T23:50:00Z',
        },
        {
          _id: 'att-010',
          name: 'activity_photos_november.zip',
          type: 'application/zip',
          size: 6291456, // 6MB
          url: 'https://storage.example.com/photos/nov_activities.zip',
          uploadStatus: 'uploaded',
          createdAt: '2024-11-30T23:55:00Z',
        },
      ],
      metadata: {
        submittedAt: '2024-12-01T00:00:00Z',
        reviewStatus: 'pending',
      },
    },
  ],
};

/**
 * Preview Mode Dummy Data (Template without projectId)
 */
export const DUMMY_TEMPLATE_DATA: ProjectData = {
  _id: 'template-health-assessment',
  solutionId: 'sol-community-health-001',
  name: 'Community Health Assessment Template',
  description:
    'Standard template for conducting community health assessments and planning interventions.',
  status: 'draft',
  progress: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  tasks: [
    {
      _id: 'template-task-001',
      name: 'Review Project Guidelines',
      description:
        'Review and understand all project guidelines and methodologies.',
      type: 'simple',
      status: 'pending',
      isRequired: true,
    },
    {
      _id: 'template-task-002',
      name: 'Upload Survey Data',
      description: 'Upload completed survey forms and data collection sheets.',
      type: 'file',
      status: 'pending',
      isRequired: true,
    },
    {
      _id: 'template-task-003',
      name: 'Complete Baseline Assessment',
      description: 'Complete baseline health assessment observation form.',
      type: 'observation',
      status: 'pending',
      isRequired: true,
      observationFormId: 'form-baseline-assessment',
    },
  ],
};

/**
 * Config presets for different scenarios
 */
export const PROJECT_PLAYER_CONFIGS = {
  // Edit mode with full permissions
  editMode: {
    mode: 'edit' as const,
    solutionId: 'sol-community-health-001',
    projectId: 'proj-health-assessment-2024',
    permissions: {
      canEdit: true,
      canAddTask: true,
      canDelete: true,
    },
    maxFileSize: 50,
    baseUrl: 'https://api.example.com',
    accessToken: 'sample-token-abc123',
    language: 'en',
    profileInfo: {
      id: 123,
      name: 'John Doe',
      email: 'john.doe@brac.org',
      role: 'LC',
      district: 'District-A',
    },
    redirectionLinks: {
      unauthorizedRedirectUrl: '/unauthorized',
    },
  },

  // Preview mode (template view)
  previewMode: {
    mode: 'preview' as const,
    solutionId: 'sol-community-health-001',
    permissions: {
      canEdit: false,
      canAddTask: false,
      canDelete: false,
    },
    maxFileSize: 10,
    baseUrl: 'https://api.example.com',
    language: 'en',
  },

  // Read-only mode
  readOnlyMode: {
    mode: 'read-only' as const,
    solutionId: 'sol-community-health-001',
    projectId: 'proj-health-assessment-2024',
    permissions: {
      canEdit: false,
      canAddTask: false,
      canDelete: false,
    },
    baseUrl: 'https://api.example.com',
    language: 'en',
  },
};
