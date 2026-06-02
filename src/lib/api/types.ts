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
  code?: string | null;
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

export const rentalListingStatuses = [
  'DRAFT',
  'PENDING_PAYMENT',
  'PENDING_REVIEW',
  'ACTIVE',
  'PAYMENT_LOCKED',
  'RESERVED',
  'RENTED',
  'EXPIRED',
  'SUSPENDED',
  'REJECTED',
  'REMOVED',
] as const;
export type RentalListingStatus = (typeof rentalListingStatuses)[number];

export const rentalListingTypes = ['APARTMENT', 'VILLA', 'STUDIO', 'DUPLEX', 'OFFICE', 'SHOP'] as const;
export type RentalListingType = (typeof rentalListingTypes)[number];

export const rentalFurnishingStatuses = ['UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED'] as const;
export type RentalFurnishingStatus = (typeof rentalFurnishingStatuses)[number];

export const rentalReservationStatuses = [
  'PENDING_PAYMENT',
  'PAYMENT_LOCKED',
  'PAID_PENDING_CONFIRMATION',
  'RESERVED',
  'CONFIRMED',
  'CANCELLED',
  'EXPIRED',
  'REFUNDED',
  'REJECTED',
] as const;
export type RentalReservationStatus = (typeof rentalReservationStatuses)[number];

export const rentalPaymentStatuses = [
  'INITIATED',
  'PENDING',
  'PAID',
  'FAILED',
  'EXPIRED',
  'CANCELLED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
  'DISPUTED',
] as const;
export type RentalPaymentStatus = (typeof rentalPaymentStatuses)[number];

export interface RentalListingImage {
  id: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  isCover: boolean;
}

export interface RentalCompoundPublicSummary {
  id: string;
  name: string;
  code?: string | null;
  address?: string | null;
  logoUrl?: string | null;
}

export interface RentalUnitPublicSummary {
  id: string;
  unitNumber: string;
  unitType: string;
  floor?: number | null;
  areaSqm?: number | string | null;
}

export interface RentalListing {
  id: string;
  compoundId: string;
  unitId?: string | null;
  title: string;
  slug: string;
  description: string;
  listingType: RentalListingType;
  furnishingStatus: RentalFurnishingStatus;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number | string;
  floor?: number | null;
  monthlyRent: number | string;
  depositAmount?: number | string | null;
  contactUnlockFee: number | string;
  reservationFee: number | string;
  status: RentalListingStatus;
  addressText?: string | null;
  locationText?: string | null;
  isFeatured: boolean;
  publishedAt?: string | null;
  expiresAt?: string | null;
  reservedUntil?: string | null;
  createdAt: string;
  images: RentalListingImage[];
  compound?: RentalCompoundPublicSummary | null;
  unit?: RentalUnitPublicSummary | null;
}

export interface RentalListingQuery extends ListQuery {
  compoundId?: string;
  listingType?: RentalListingType;
  furnishingStatus?: RentalFurnishingStatus;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  featured?: boolean;
}

export interface StartContactUnlockInput {
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
}

export type StartReservationInput = StartContactUnlockInput;

export interface RentalPaymentSummary {
  id: string;
  amount: number | string;
  currency: string;
  status: RentalPaymentStatus;
  paymentUrl?: string | null;
}

export interface RentalContactUnlockSummary {
  id: string;
  listingId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string | null;
  amount: number | string;
  currency: string;
  status: RentalPaymentStatus;
  unlockedAt?: string | null;
}

export interface StartContactUnlockResponse {
  alreadyUnlocked: boolean;
  contactUnlock?: RentalContactUnlockSummary | null;
  payment?: RentalPaymentSummary | null;
  paymentUrl?: string | null;
}

export interface RentalOwnerPublicSummary {
  fullName: string;
  phone: string;
  email?: string | null;
}

export interface ContactAccessResponse {
  unlocked: boolean;
  ownerContact?: RentalOwnerPublicSummary | null;
}

export interface RentalReservation {
  id: string;
  listingId: string;
  tenantName: string;
  tenantPhone: string;
  status: RentalReservationStatus;
  amount: number | string;
  currency: string;
  reservedUntil?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  expiredAt?: string | null;
  createdAt: string;
  listing?: Pick<RentalListing, 'id' | 'title' | 'slug' | 'status'> | null;
}

export interface StartReservationResponse {
  reservation: RentalReservation;
  payment?: RentalPaymentSummary | null;
  paymentUrl?: string | null;
}
