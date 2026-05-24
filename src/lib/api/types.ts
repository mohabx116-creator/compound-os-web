export interface PaginatedMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginatedMeta;
}

export type PaginatedApiResponse<T> = ApiResponse<T[]> & {
  data: T[];
  meta: PaginatedMeta;
};

export const unitTypes = ['APARTMENT', 'VILLA', 'SHOP', 'OFFICE'] as const;
export type UnitType = (typeof unitTypes)[number];

export const unitStatuses = ['OCCUPIED', 'VACANT', 'MAINTENANCE'] as const;
export type UnitStatus = (typeof unitStatuses)[number];

export const residentRoles = [
  'ADMIN',
  'MANAGER',
  'ACCOUNTANT',
  'SECURITY',
  'MAINTENANCE',
  'RESIDENT',
] as const;
export type ResidentRole = (typeof residentRoles)[number];

export const residentStatuses = ['ACTIVE', 'INACTIVE', 'PENDING'] as const;
export type ResidentStatus = (typeof residentStatuses)[number];

export const complaintPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type ComplaintPriority = (typeof complaintPriorities)[number];

export const complaintStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED'] as const;
export type ComplaintStatus = (typeof complaintStatuses)[number];

export interface Compound {
  id: string;
  name: string;
  address?: string | null;
  logoUrl?: string | null;
  adminEmail: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    units: number;
    residents: number;
    complaints: number;
  };
}

export interface Unit {
  id: string;
  compoundId: string;
  unitNumber: string;
  unitType: UnitType;
  floor?: number | null;
  areaSqm?: number | string | null;
  status: UnitStatus;
  createdAt: string;
  updatedAt: string;
  compound?: Pick<Compound, 'id' | 'name'>;
  _count?: {
    residents: number;
    complaints: number;
  };
}

export interface Resident {
  id: string;
  compoundId: string;
  unitId?: string | null;
  fullName: string;
  phone: string;
  email?: string | null;
  role: ResidentRole;
  status: ResidentStatus;
  createdAt: string;
  updatedAt: string;
  compound?: Pick<Compound, 'id' | 'name'>;
  unit?: Pick<Unit, 'id' | 'unitNumber' | 'unitType' | 'status'> | null;
  _count?: {
    complaints: number;
  };
}

export interface Complaint {
  id: string;
  compoundId: string;
  residentId: string;
  unitId?: string | null;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  compound?: Pick<Compound, 'id' | 'name'>;
  resident?: Pick<Resident, 'id' | 'fullName' | 'phone'>;
  unit?: Pick<Unit, 'id' | 'unitNumber' | 'unitType' | 'status'> | null;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export type CompoundQuery = ListQuery;

export interface UnitQuery extends ListQuery {
  compoundId?: string;
  status?: UnitStatus;
  unitType?: UnitType;
}

export interface ResidentQuery extends ListQuery {
  compoundId?: string;
  unitId?: string;
  role?: ResidentRole;
  status?: ResidentStatus;
}

export interface ComplaintQuery extends ListQuery {
  compoundId?: string;
  residentId?: string;
  unitId?: string;
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
}
