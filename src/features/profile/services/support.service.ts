import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { SupportTicket } from '../../../mocks/services.mock';

export const supportService = {
  async getSupportTickets(): Promise<SupportTicket[]> {
    await delay(300);
    return useAppStore.getState().tickets;
  },

  async createSupportTicket(title: string, category: string, description: string): Promise<SupportTicket> {
    await delay(500);
    return useAppStore.getState().addSupportTicket(title, category, description);
  },
};
