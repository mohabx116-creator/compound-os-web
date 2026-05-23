import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { Announcement } from '../../../types/common.types';

export const announcementService = {
  async getAnnouncements(): Promise<Announcement[]> {
    await delay(300);
    return useAppStore.getState().announcements;
  },

  async getAnnouncementById(id: string): Promise<Announcement | undefined> {
    await delay(300);
    return useAppStore.getState().announcements.find((a) => a.id === id);
  },
};
