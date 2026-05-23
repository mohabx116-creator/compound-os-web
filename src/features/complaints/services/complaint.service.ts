import { delay } from '../../../lib/utils/delay';
import { useAppStore } from '../../../stores/app.store';
import type { Complaint } from '../../../types/common.types';

export const complaintService = {
  async getComplaints(): Promise<Complaint[]> {
    await delay(300);
    return useAppStore.getState().complaints;
  },

  async getComplaintById(id: string): Promise<Complaint | undefined> {
    await delay(300);
    return useAppStore.getState().complaints.find((c) => c.id === id);
  },

  async createComplaint(data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'residentId' | 'timeline'>): Promise<Complaint> {
    await delay(500);
    return useAppStore.getState().addComplaint(data);
  },
};
