import { getApiData } from './api-client';
import type { Complaint, ComplaintQuery } from './types';

export async function getComplaints(query?: ComplaintQuery): Promise<Complaint[]> {
  const response = await getApiData<Complaint[]>('/complaints', query);
  return response.data;
}

export async function getComplaintById(id: string): Promise<Complaint> {
  const response = await getApiData<Complaint>(`/complaints/${id}`);
  return response.data;
}

export const complaintApiService = {
  getComplaints,
  getComplaintById,
};
