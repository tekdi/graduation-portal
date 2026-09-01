import { DEFAULT_PROVINCE_OPTIONS, DEFAULT_SITE_OPTIONS } from './SUPPORT_PROVIDER_CARDS';

export const PATHWAY_TAGS = [
  { label: 'All Pathways', value: 'all-pathways' }
];

export const DEFAULT_PILLAR_OPTIONS = [
  { label: 'All Pillars', value: 'all-pillars' }
];

export const DEFAULT_TYPE_OPTIONS = [
  { label: 'All Types', value: 'all-types' }
];

export const DEFAULT_STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all-statuses' },
  { label: 'Upcoming', value: 'Upcoming' },
  { label: 'In Progress', value: 'In progress' },
  { label: 'Draft', value: 'Draft' }
];

export const DEFAULT_FORMAT_OPTIONS = [
  { label: 'All Formats', value: 'all-formats' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Hybrid', value: 'hybrid' }
];

export const REQUESTOR_FILTERS = [
  {
    attr: 'pathway',
    type: 'select' as const,
    placeholder: 'All Pathways',
    data: PATHWAY_TAGS,
  },
  {
    attr: 'pillar',
    type: 'select' as const,
    placeholder: 'All Pillars',
    data: DEFAULT_PILLAR_OPTIONS,
  },
  {
    attr: 'type',
    type: 'select' as const,
    placeholder: 'All Types',
    data: DEFAULT_TYPE_OPTIONS,
  },
  {
    attr: 'status',
    type: 'select' as const,
    placeholder: 'All Statuses',
    data: DEFAULT_STATUS_OPTIONS,
  },
  {
    attr: 'format',
    type: 'select' as const,
    placeholder: 'All Formats',
    data: DEFAULT_FORMAT_OPTIONS,
  },
  {
    attr: 'province',
    type: 'select' as const,
    placeholder: 'All Provinces',
    data: DEFAULT_PROVINCE_OPTIONS,
  },
  {
    attr: 'site',
    type: 'select' as const,
    placeholder: 'All Sites',
    data: DEFAULT_SITE_OPTIONS,
  }
];
