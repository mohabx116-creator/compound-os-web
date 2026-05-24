import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { Resident, Unit } from '../../../types/common.types';
import { mockFAQ } from '../../../mocks/services.mock';
import type { FAQItem } from '../../../mocks/services.mock';
import { DEMO_IDS } from '../../../lib/api/demo-ids';
import { residentApiService } from '../../../lib/api/resident-service';
import { unitApiService } from '../../../lib/api/unit-service';
import type { Resident as ApiResident, Unit as ApiUnit } from '../../../lib/api/types';

function mapResidentFromApi(resident: ApiResident): Resident {
  return {
    id: resident.id,
    fullName: resident.fullName,
    phone: resident.phone,
    email: resident.email ?? undefined,
    unitId: resident.unitId ?? undefined,
    compoundId: resident.compoundId,
    role: resident.role,
    status: resident.status,
  };
}

function mapUnitFromApi(unit: ApiUnit): Unit {
  return {
    id: unit.id,
    unitNumber: unit.unitNumber,
    unitType: unit.unitType,
    floor: unit.floor ?? undefined,
    areaSqm: unit.areaSqm === null || unit.areaSqm === undefined ? undefined : Number(unit.areaSqm),
    status: unit.status,
    compoundId: unit.compoundId,
    compoundName: unit.compound?.name ?? useAppStore.getState().unit.compoundName,
  };
}

export const profileService = {
  async getBackendResidentProfile(): Promise<Resident> {
    return mapResidentFromApi(await residentApiService.getResidentById(DEMO_IDS.residentId));
  },

  async getBackendUnitDetails(): Promise<Unit> {
    return mapUnitFromApi(await unitApiService.getUnitById(DEMO_IDS.unitId));
  },

  async getResidentProfileWithMockFallback(): Promise<Resident> {
    try {
      return await profileService.getBackendResidentProfile();
    } catch (error) {
      // Temporary Phase 2 bridge: keep non-primary surfaces usable until real auth/session identity exists.
      console.warn('Falling back to mock resident profile after API read failed.', error);
      await delay(200);
      return useAppStore.getState().resident;
    }
  },

  async getUnitDetailsWithMockFallback(): Promise<Unit> {
    try {
      return await profileService.getBackendUnitDetails();
    } catch (error) {
      // Temporary Phase 2 bridge: keep non-primary surfaces usable until real auth/session identity exists.
      console.warn('Falling back to mock unit details after API read failed.', error);
      await delay(200);
      return useAppStore.getState().unit;
    }
  },

  async getFAQ(): Promise<FAQItem[]> {
    await delay(200);
    return mockFAQ;
  },
};
