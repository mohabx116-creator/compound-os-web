import { getApiData, postApiData } from './api-client';
import type { ResidentRole, ResidentStatus } from './types';

export interface ResidentLoginInput {
  compoundCode: string;
  phone: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: ResidentRole;
  status: ResidentStatus;
  compoundId: string;
  unitId: string | null;
  compound: {
    id: string;
    name: string;
    code: string | null;
  };
  unit: {
    id: string;
    unitNumber: string;
  } | null;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  accessToken: string;
  expiresIn: string;
}

export const authApiService = {
  async residentLogin(input: ResidentLoginInput): Promise<LoginResponse> {
    const response = await postApiData<LoginResponse>('/auth/resident/login', input);
    return response.data;
  },

  async getMe(): Promise<AuthenticatedUser> {
    const response = await getApiData<AuthenticatedUser>('/auth/me');
    return response.data;
  },
};
