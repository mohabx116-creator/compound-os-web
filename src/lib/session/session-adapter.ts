import { DEMO_IDS } from '../api/demo-ids';
import { isMockAuthenticated } from '../auth/mock-auth';
import type { AppSession } from './session.types';

function readMockAuthState() {
  return typeof window !== 'undefined' ? isMockAuthenticated() : false;
}

export function getCurrentSessionIdentity(): AppSession {
  // Temporary demo identity boundary; real auth can replace this adapter later.
  return {
    isAuthenticated: readMockAuthState(),
    compoundId: DEMO_IDS.compoundId,
    residentId: DEMO_IDS.residentId,
    unitId: DEMO_IDS.unitId,
    complaintId: DEMO_IDS.complaintId,
    source: 'demo',
    isLoading: false,
    error: null,
  };
}
