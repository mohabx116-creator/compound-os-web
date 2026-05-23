import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { ChatRoom } from '../../../mocks/services.mock';

export const chatService = {
  async getChatRooms(): Promise<ChatRoom[]> {
    await delay(300);
    return useAppStore.getState().chatRooms;
  },

  async getChatRoomById(id: string): Promise<ChatRoom | undefined> {
    await delay(200);
    return useAppStore.getState().chatRooms.find((r) => r.id === id);
  },

  async sendChatMessage(roomId: string, text: string): Promise<void> {
    await delay(100);
    useAppStore.getState().addChatMessage(roomId, text);
  },
};
