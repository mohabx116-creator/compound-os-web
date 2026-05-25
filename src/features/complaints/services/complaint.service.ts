import { complaintApiService } from '../../../lib/api/complaint-service';
import type { Complaint as ApiComplaint, ComplaintPriority, ComplaintStatus } from '../../../lib/api/types';
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

  async createComplaint(data: CreateComplaintInput): Promise<Complaint> {
    const createdComplaint = await complaintApiService.createComplaint(data);
    return mapComplaintFromApi(createdComplaint);
  },
};
