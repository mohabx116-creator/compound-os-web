import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { AppNotification } from '../../../types/common.types';

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    await delay(200);
    return useAppStore.getState().notifications;
  },

  async markAsRead(id: string): Promise<void> {
    useAppStore.getState().markNotificationAsRead(id);
  },

  async markAllAsRead(): Promise<void> {
    useAppStore.getState().markAllNotificationsAsRead();
  },
};
