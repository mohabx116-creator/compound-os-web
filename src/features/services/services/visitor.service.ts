import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { VisitorPass } from '../../../mocks/services.mock';

export const visitorService = {
  async getVisitors(): Promise<VisitorPass[]> {
    await delay(300);
    return useAppStore.getState().visitors;
  },

  async createVisitor(data: Omit<VisitorPass, 'id' | 'qrCode' | 'status'>): Promise<VisitorPass> {
    await delay(500);
    return useAppStore.getState().addVisitor(data);
  },
};
