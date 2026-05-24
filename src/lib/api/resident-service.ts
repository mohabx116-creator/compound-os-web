import { getApiData } from './api-client';
import type { Resident, ResidentQuery } from './types';

export async function getResidents(query?: ResidentQuery): Promise<Resident[]> {
  const response = await getApiData<Resident[]>('/residents', query);
  return response.data;
}

export async function getResidentById(id: string): Promise<Resident> {
  const response = await getApiData<Resident>(`/residents/${id}`);
  return response.data;
}

export const residentApiService = {
  getResidents,
  getResidentById,
};
