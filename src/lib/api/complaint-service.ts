import { getApiData, postApiData } from './api-client';
import type { Complaint, ComplaintPriority, ComplaintQuery, ComplaintStatus } from './types';

export interface CreateComplaintInput {
  compoundId: string;
  residentId: string;
  unitId?: string;
  title: string;
  description: string;
  priority?: ComplaintPriority;
  status?: ComplaintStatus;
}

export async function getComplaints(query?: ComplaintQuery): Promise<Complaint[]> {
  const response = await getApiData<Complaint[]>('/complaints', query);
  return response.data;
}

export async function getComplaintById(id: string): Promise<Complaint> {
  const response = await getApiData<Complaint>(`/complaints/${id}`);
  return response.data;
}

export async function createComplaint(input: CreateComplaintInput): Promise<Complaint> {
  const response = await postApiData<Complaint>('/complaints', input);
  return response.data;
}

export const complaintApiService = {
  getComplaints,
  getComplaintById,
  createComplaint,
};
