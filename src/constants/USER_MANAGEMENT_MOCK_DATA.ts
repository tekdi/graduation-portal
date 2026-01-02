/**
 * User Management Mock Data
 * Mock data for the User Management table
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Supervisor' | 'Linkage Champion' | 'Participant';
  status: 'Active' | 'Deactivated';
  province: string;
  district: string;
  lastLogin: string;
  details: {
    type: 'assigned' | 'progress';
    value: number; // For assigned: count, for progress: percentage
  } | null;
}

export const USER_MANAGEMENT_MOCK_DATA: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@skillssa.co.za',
    role: 'Admin',
    status: 'Active',
    province: 'Gauteng',
    district: 'Johannesburg',
    lastLogin: '2 hours ago',
    details: null,
  },
  {
    id: '2',
    name: 'Dr. Lerato Mokoena',
    email: 'lerato.mokoena@skillssa.co.za',
    role: 'Supervisor',
    status: 'Active',
    province: 'Gauteng',
    district: 'Johannesburg',
    lastLogin: '1 hour ago',
    details: {
      type: 'assigned',
      value: 8,
    },
  },
  {
    id: '3',
    name: 'Zanele Ndaba',
    email: 'zanele.ndaba@skillssa.co.za',
    role: 'Supervisor',
    status: 'Active',
    province: 'KwaZulu-Natal',
    district: 'eThekwini',
    lastLogin: '3 hours ago',
    details: {
      type: 'assigned',
      value: 12,
    },
  },
  {
    id: '4',
    name: 'Thabo Mthembu',
    email: 'thabo.mthembu@skillssa.co.za',
    role: 'Linkage Champion',
    status: 'Active',
    province: 'Gauteng',
    district: 'Ekurhuleni',
    lastLogin: '2 hours ago',
    details: {
      type: 'assigned',
      value: 45,
    },
  },
  {
    id: '5',
    name: 'Nomsa Dlamini',
    email: 'nomsa.dlamini@skillssa.co.za',
    role: 'Linkage Champion',
    status: 'Active',
    province: 'KwaZulu-Natal',
    district: 'uMgungundlovu',
    lastLogin: '1 day ago',
    details: {
      type: 'assigned',
      value: 32,
    },
  },
  {
    id: '6',
    name: 'Sipho Khumalo',
    email: 'sipho.khumalo@skillssa.co.za',
    role: 'Linkage Champion',
    status: 'Deactivated',
    province: 'Limpopo',
    district: 'Capricorn',
    lastLogin: '1 week ago',
    details: {
      type: 'assigned',
      value: 0,
    },
  },
  {
    id: '7',
    name: 'Mandla Zwane',
    email: 'mandla.zwane@skillssa.co.za',
    role: 'Participant',
    status: 'Active',
    province: 'Gauteng',
    district: 'Tshwane',
    lastLogin: '5 hours ago',
    details: {
      type: 'progress',
      value: 75,
    },
  },
  {
    id: '8',
    name: 'Amahle Zungu',
    email: 'amahle.zungu@skillssa.co.za',
    role: 'Participant',
    status: 'Active',
    province: 'KwaZulu-Natal',
    district: 'eThekwini',
    lastLogin: '1 day ago',
    details: {
      type: 'progress',
      value: 42,
    },
  },
  {
    id: '9',
    name: 'Johannes van der Merwe',
    email: 'johannes.vandermerwe@skillssa.co.za',
    role: 'Participant',
    status: 'Active',
    province: 'Western Cape',
    district: 'Cape Town',
    lastLogin: '3 hours ago',
    details: {
      type: 'progress',
      value: 88,
    },
  },
  {
    id: '10',
    name: 'Precious Nkosi',
    email: 'precious.nkosi@skillssa.co.za',
    role: 'Participant',
    status: 'Active',
    province: 'Mpumalanga',
    district: 'Nkangala',
    lastLogin: '6 hours ago',
    details: {
      type: 'progress',
      value: 62,
    },
  },
];

