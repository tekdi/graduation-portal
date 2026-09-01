import type { FormSection } from '@components/SchemaFormRenderer/type';

export const ACCEPT_AND_SCHEDULE_FORM_SCHEMA: FormSection[] = [
  // ─── Session Details & Specification ───────────────────────────────────────
  {
    type: 'section',
    id: 'sessionDetailsSpecification',
    icon: 'GraduationCap',
    title: {
      key: 'supportProvider.supportRequests.titles.sessionDetailsSpecification',
      fallback: 'Session Details & Specification',
    },
    rows: [
      {
        fields: [
          {
            name: 'province',
            type: 'select',
            required: true,
            label: {
              key: 'supportProvider.supportRequests.labels.province',
              fallback: 'Province',
            },
            placeholder: {
              key: 'supportProvider.supportRequests.placeholders.province',
              fallback: 'Select province',
            },
            optionsSource: 'provinces',
            validation: [
              {
                rule: 'required',
                message: {
                  key: 'supportProvider.supportRequests.errors.provinceRequired',
                  fallback: 'Province is required',
                },
              },
            ],
          },
          {
            name: 'category',
            type: 'select',
            required: true,
            label: {
              key: 'supportProvider.supportRequests.labels.sessionPillarCategory',
              fallback: 'Session Pillar / Category',
            },
            placeholder: {
              key: 'supportProvider.supportRequests.placeholders.category',
              fallback: 'Select category',
            },
            optionsSource: 'pillars',
            validation: [
              {
                rule: 'required',
                message: {
                  key: 'supportProvider.supportRequests.errors.categoryRequired',
                  fallback: 'Category is required',
                },
              },
            ],
          },
        ],
      },
      {
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
            label: {
              key: 'supportProvider.supportRequests.labels.sessionTitle',
              fallback: 'Session Title',
            },
            placeholder: {
              key: 'supportProvider.supportRequests.placeholders.sessionTitle',
              fallback: 'Enter session title',
            },
            validation: [
              {
                rule: 'required',
                message: {
                  key: 'supportProvider.supportRequests.errors.sessionTitleRequired',
                  fallback: 'Session title is required',
                },
              },
            ],
          },
        ],
      },
      {
        fields: [
          {
            name: 'description',
            type: 'textarea',
            required: false,
            label: {
              key: 'supportProvider.supportRequests.labels.sessionDescriptionJustification',
              fallback: 'Session Description & Justification',
            },
            placeholder: {
              key: 'supportProvider.supportRequests.placeholders.sessionDescription',
              fallback: 'Describe the session and why it is needed...',
            },
          },
        ],
      },
      {
        fields: [
          {
            name: 'targetAudience',
            type: 'textarea',
            required: false,
            label: {
              key: 'supportProvider.supportRequests.labels.targetAudienceProfile',
              fallback: 'Target Audience & Participant Profile',
            },
            placeholder: {
              key: 'supportProvider.supportRequests.placeholders.targetAudience',
              fallback: 'Describe the participants attending this session...',
            },
          },
        ],
      },
    ],
  },

  // ─── Schedule, Format & Capacity ────────────────────────────────────────────
  {
    type: 'section',
    id: 'scheduleFormatCapacity',
    icon: 'Calendar',
    title: {
      key: 'supportProvider.supportRequests.titles.scheduleFormatCapacity',
      fallback: 'Schedule, Format & Capacity',
    },
    rows: [
      {
        fields: [
          {
            name: 'date',
            type: 'date',
            required: true,
            icon: 'Calendar',
            label: {
              key: 'supportProvider.supportRequests.labels.date',
              fallback: 'Date',
            },
            validation: [
              {
                rule: 'required',
                message: {
                  key: 'supportProvider.supportRequests.errors.dateRequired',
                  fallback: 'Date is required',
                },
              },
            ],
          },
          {
            name: 'time',
            type: 'time',
            required: true,
            icon: 'Clock',
            label: {
              key: 'supportProvider.supportRequests.labels.startTime',
              fallback: 'Start Time',
            },
            validation: [
              {
                rule: 'required',
                message: {
                  key: 'supportProvider.supportRequests.errors.timeRequired',
                  fallback: 'Start time is required',
                },
              },
            ],
          },
          {
            name: 'duration',
            type: 'select',
            required: true,
            label: {
              key: 'supportProvider.supportRequests.labels.duration',
              fallback: 'Duration',
            },
            optionsSource: 'durationOptions',
            defaultValue: '3_hours',
          },
        ],
      },
      {
        fields: [
          {
            name: 'delivery_mode',
            type: 'select',
            required: true,
            label: {
              key: 'supportProvider.supportRequests.labels.deliveryFormat',
              fallback: 'Delivery Format',
            },
            optionsSource: 'formatOptions',
            defaultValue: 'offline',
          },
          {
            name: 'capacity',
            type: 'text',
            required: true,
            label: {
              key: 'supportProvider.supportRequests.labels.maxCapacityParticipants',
              fallback: 'Max Capacity (Participants)',
            },
            placeholder: { fallback: 'e.g. 15' },
            inputProps: { keyboardType: 'numeric' },
            validation: [
              {
                rule: 'required',
                message: {
                  key: 'supportProvider.supportRequests.errors.maxCapacityRequired',
                  fallback: 'Max capacity is required',
                },
              },
            ],
          },
        ],
      },
      {
        fields: [
          {
            name: 'location',
            type: 'text',
            required: false,
            label: {
              key: 'supportProvider.supportRequests.labels.venueLocation',
              fallback: 'Venue Location',
            },
            placeholder: {
              key: 'supportProvider.supportRequests.placeholders.location',
              fallback: 'Venue name and address...',
            },
            visibleIf: [
              { name: 'delivery_mode', value: 'online', operator: '!=' },
            ],
          },
        ],
      },
      {
        fields: [
          {
            name: 'meetingLink',
            type: 'text',
            required: false,
            label: {
              key: 'supportProvider.supportRequests.labels.virtualMeetingLink',
              fallback: 'Virtual Meeting Link',
            },
            placeholder: {
              key: 'supportProvider.supportRequests.placeholders.meetingLink',
              fallback: 'https://...',
            },
            visibleIf: [
              { name: 'delivery_mode', value: 'offline', operator: '!=' },
            ],
          },
        ],
      },
    ],
  },
];
