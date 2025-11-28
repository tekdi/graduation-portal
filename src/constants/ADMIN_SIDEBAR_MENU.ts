import { SettingsIcon, EditIcon, ArrowUpIcon, AddIcon } from '@ui';

interface SidebarItem {
  key: string;
  label: string;
  icon: any;
  route?: string;
  children?: SidebarItem[];
}

export const MAIN_MENU_ITEMS: SidebarItem[] = [
  {
    key: 'user-management',
    label: 'admin.menu.userManagement',
    icon: SettingsIcon,
    route: 'user-management',
  },
  {
    key: 'template-management',
    label: 'admin.menu.templateManagement',
    icon: EditIcon,
    route: 'TemplateManagement',
  },
  {
    key: 'audit-log',
    label: 'admin.menu.auditLog',
    icon: EditIcon,
    route: 'AuditLog',
  },
];

export const QUICK_ACTION_MENU_ITEMS: SidebarItem[] = [
  {
    key: 'upload-users',
    label: 'admin.menu.uploadUsers',
    icon: ArrowUpIcon,
    route: 'UploadUsers',
  },
  {
    key: 'new-lc',
    label: 'admin.menu.createUser',
    icon: AddIcon,
    route: 'NewLC',
  },
];
