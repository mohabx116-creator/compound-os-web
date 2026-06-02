import type {
  RentalFurnishingStatus,
  RentalListingStatus,
  RentalListingType,
  RentalReservationStatus,
} from '../../lib/api/types';

export const listingTypeLabels: Record<RentalListingType, string> = {
  APARTMENT: 'شقة',
  VILLA: 'فيلا',
  STUDIO: 'استوديو',
  DUPLEX: 'دوبلكس',
  OFFICE: 'مكتب',
  SHOP: 'محل',
};

export const furnishingLabels: Record<RentalFurnishingStatus, string> = {
  UNFURNISHED: 'غير مفروشة',
  SEMI_FURNISHED: 'نصف مفروشة',
  FURNISHED: 'مفروشة',
};

export const listingStatusLabels: Record<RentalListingStatus, string> = {
  DRAFT: 'مسودة',
  PENDING_PAYMENT: 'بانتظار الدفع',
  PENDING_REVIEW: 'بانتظار المراجعة',
  ACTIVE: 'متاحة',
  PAYMENT_LOCKED: 'دفع قيد المعالجة',
  RESERVED: 'محجوزة',
  RENTED: 'تم التأجير',
  EXPIRED: 'منتهية',
  SUSPENDED: 'موقوفة',
  REJECTED: 'مرفوضة',
  REMOVED: 'محذوفة',
};

export const reservationStatusLabels: Record<RentalReservationStatus, string> = {
  PENDING_PAYMENT: 'بانتظار الدفع',
  PAYMENT_LOCKED: 'الدفع قيد التجهيز',
  PAID_PENDING_CONFIRMATION: 'مدفوعة وتنتظر التأكيد',
  RESERVED: 'محجوزة مؤقتا',
  CONFIRMED: 'مؤكدة',
  CANCELLED: 'ملغاة',
  EXPIRED: 'منتهية',
  REFUNDED: 'تم رد المبلغ',
  REJECTED: 'مرفوضة',
};

export function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return 0;
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatRentalMoney(value: number | string | null | undefined) {
  const amount = toNumber(value);
  return `${new Intl.NumberFormat('ar-EG').format(amount)} ج.م`;
}

export function formatRentalDate(value: string | null | undefined) {
  if (!value) return 'غير محدد';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'غير محدد';

  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function shortId(value: string) {
  return value.slice(0, 8);
}
