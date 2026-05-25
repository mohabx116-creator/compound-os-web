import { delay } from '../../../lib/utils/delay';
import { complaintApiService } from '../../../lib/api/complaint-service';
import type { Complaint as ApiComplaint, ComplaintPriority, ComplaintStatus } from '../../../lib/api/types';
import { useAppStore } from '../../../stores/app.store';
import type { Complaint } from '../../../types/common.types';

interface CreateComplaintInput {
  compoundId: string;
  residentId: string;
  unitId?: string;
  title: string;
  description: string;
  priority?: ComplaintPriority;
  status?: ComplaintStatus;
}

function complaintCategory(complaint: ApiComplaint) {
  return complaint.unit?.unitNumber ?? complaint.compound?.name ?? 'Complaint';
}

function mapComplaintFromApi(complaint: ApiComplaint): Complaint {
  return {
    id: complaint.id,
    title: complaint.title,
    description: complaint.description,
    priority: complaint.priority,
    status: complaint.status,
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    residentId: complaint.residentId,
    category: complaintCategory(complaint),
    timeline: [
      {
        status: 'OPEN',
        note: complaint.description,
        date: complaint.createdAt,
      },
      ...(complaint.status !== 'OPEN'
        ? [
            {
              status: complaint.status,
              note: complaint.status === 'CLOSED' ? 'Complaint closed.' : 'Complaint status updated.',
              date: complaint.updatedAt,
            },
          ]
        : []),
    ],
  };
}

export const complaintService = {
  async getBackendComplaints(residentId: string): Promise<Complaint[]> {
    const complaints = await complaintApiService.getComplaints({
      residentId,
    });
    return complaints.map(mapComplaintFromApi);
  },

  async getBackendComplaintById(id: string): Promise<Complaint> {
    return mapComplaintFromApi(await complaintApiService.getComplaintById(id));
  },

  async getComplaintsWithMockFallback(residentId: string): Promise<Complaint[]> {
    try {
      return await complaintService.getBackendComplaints(residentId);
    } catch (error) {
      // Temporary Phase 2 bridge: keep non-primary surfaces usable with mock data
      // until real auth/session context and backend error UX are finalized.
      console.warn('Falling back to mock complaints after API read failed.', error);
      await delay(300);
      return useAppStore.getState().complaints;
    }
  },

  async getComplaintByIdWithMockFallback(id: string): Promise<Complaint | undefined> {
    try {
      return await complaintService.getBackendComplaintById(id);
    } catch (error) {
      // Temporary Phase 2 bridge: non-primary detail surfaces retain mock fallback during read-only integration.
      console.warn('Falling back to mock complaint detail after API read failed.', error);
      await delay(300);
      return useAppStore.getState().complaints.find((c) => c.id === id);
    }
  },

  async createComplaint(data: CreateComplaintInput): Promise<Complaint> {
    const createdComplaint = await complaintApiService.createComplaint(data);
    return mapComplaintFromApi(createdComplaint);
  },
};
