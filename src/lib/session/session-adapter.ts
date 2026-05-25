import { authApiService } from '../api/auth-service';
import type { AuthenticatedUser } from '../api/auth-service';
import { getAccessToken } from '../auth/auth-token-storage';
import type { AppSessionIdentity } from './session.types';

export function createAnonymousSession(
  overrides: Partial<AppSessionIdentity> = {},
): AppSessionIdentity {
  return {
    isAuthenticated: false,
    compoundId: '',
    residentId: '',
    unitId: '',
    source: 'anonymous',
    isLoading: false,
    error: null,
    ...overrides,
  };
}

export function createSessionFromAuthUser(user: AuthenticatedUser): AppSessionIdentity {
  return {
    isAuthenticated: true,
    compoundId: user.compoundId,
    residentId: user.id,
    unitId: user.unitId ?? '',
    source: 'authenticated',
    isLoading: false,
    error: null,
    user,
  };
}

export async function hydrateSessionFromToken(): Promise<AppSessionIdentity> {
  if (!getAccessToken()) {
    return createAnonymousSession();
  }

  const user = await authApiService.getMe();
  return createSessionFromAuthUser(user);
}
