import type { AuthenticatedUser } from '../api/auth-service';

export type SessionSource = 'anonymous' | 'authenticated';

export interface AppSession {
  isAuthenticated: boolean;
  compoundId: string;
  residentId: string;
  unitId: string;
  complaintId?: string;
  source: SessionSource;
  isLoading: boolean;
  error: string | null;
  user?: AuthenticatedUser;
  loginWithToken: (accessToken: string, user?: AuthenticatedUser) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export type AppSessionIdentity = Omit<AppSession, 'loginWithToken' | 'logout' | 'refresh'>;
