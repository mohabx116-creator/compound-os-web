const DEFAULT_RENTAL_APP_BASE_URL = 'https://sebahi-rental-web.vercel.app';

export const RENTAL_APP_BASE_URL = (
  import.meta.env.VITE_RENTAL_APP_BASE_URL?.trim() || DEFAULT_RENTAL_APP_BASE_URL
).replace(/\/+$/, '');

export function buildRentalAppUrl(pathname: string, search = '', hash = '') {
  return `${RENTAL_APP_BASE_URL}${pathname}${search}${hash}`;
}
