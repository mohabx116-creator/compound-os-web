import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { Resident, Unit } from '../../../types/common.types';
import { mockFAQ } from '../../../mocks/services.mock';
import type { FAQItem } from '../../../mocks/services.mock';

export const profileService = {
  async getResidentProfile(): Promise<Resident> {
    await delay(200);
    return useAppStore.getState().resident;
  },

  async getUnitDetails(): Promise<Unit> {
    await delay(200);
    return useAppStore.getState().unit;
  },

  async getFAQ(): Promise<FAQItem[]> {
    await delay(200);
    return mockFAQ;
  },
};
