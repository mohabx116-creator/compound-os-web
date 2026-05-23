import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import { mockFacilities } from '../../../mocks/services.mock';
import type { Facility, FacilityBooking } from '../../../mocks/services.mock';

export const facilityService = {
  async getFacilities(): Promise<Facility[]> {
    await delay(300);
    return mockFacilities;
  },

  async getFacilityById(id: string): Promise<Facility | undefined> {
    await delay(200);
    return mockFacilities.find((f) => f.id === id);
  },

  async getBookings(): Promise<FacilityBooking[]> {
    await delay(300);
    return useAppStore.getState().bookings;
  },

  async createBooking(data: Omit<FacilityBooking, 'id' | 'totalPrice' | 'status' | 'qrCode'>): Promise<FacilityBooking> {
    await delay(500);
    return useAppStore.getState().addBooking(data);
  },
};
