import { getApiData } from './api-client';
import type { Compound, CompoundQuery } from './types';

export async function getCompounds(query?: CompoundQuery): Promise<Compound[]> {
  const response = await getApiData<Compound[]>('/compounds', query);
  return response.data;
}

export async function getCompoundById(id: string): Promise<Compound> {
  const response = await getApiData<Compound>(`/compounds/${id}`);
  return response.data;
}

export const compoundApiService = {
  getCompounds,
  getCompoundById,
};
