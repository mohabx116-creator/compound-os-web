import { createContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { DEMO_IDS } from '../api/demo-ids';
import { MOCK_AUTH_CHANGE_EVENT, isMockAuthenticated } from '../auth/mock-auth';
import type { AppSession } from './session.types';

export const SessionContext = createContext<AppSession | null>(null);

function readMockAuthState() {
  return typeof window !== 'undefined' ? isMockAuthenticated() : false;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(readMockAuthState);

  useEffect(() => {
    function syncAuthState() {
      setIsAuthenticated(readMockAuthState());
    }

    window.addEventListener('storage', syncAuthState);
    window.addEventListener(MOCK_AUTH_CHANGE_EVENT, syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener(MOCK_AUTH_CHANGE_EVENT, syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, []);

  const session = useMemo<AppSession>(() => ({
    isAuthenticated,
    compoundId: DEMO_IDS.compoundId,
    residentId: DEMO_IDS.residentId,
    unitId: DEMO_IDS.unitId,
    complaintId: DEMO_IDS.complaintId,
  }), [isAuthenticated]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
