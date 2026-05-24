import { getApiData } from './api-client';
import type { Unit, UnitQuery } from './types';

export async function getUnits(query?: UnitQuery): Promise<Unit[]> {
  const response = await getApiData<Unit[]>('/units', query);
  return response.data;
}

export async function getUnitById(id: string): Promise<Unit> {
  const response = await getApiData<Unit>(`/units/${id}`);
  return response.data;
}

export const unitApiService = {
  getUnits,
  getUnitById,
};
