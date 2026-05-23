import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { MaintenanceRequest } from '../../../mocks/services.mock';

export const maintenanceService = {
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    await delay(300);
    return useAppStore.getState().maintenance;
  },

  async createMaintenanceRequest(data: Omit<MaintenanceRequest, 'id' | 'status'>): Promise<MaintenanceRequest> {
    await delay(500);
    return useAppStore.getState().addMaintenance(data);
  },
};
