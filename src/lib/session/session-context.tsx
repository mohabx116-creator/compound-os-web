import { createContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { MOCK_AUTH_CHANGE_EVENT } from '../auth/mock-auth';
import { getCurrentSessionIdentity } from './session-adapter';
import type { AppSession } from './session.types';

export const SessionContext = createContext<AppSession | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [sessionIdentity, setSessionIdentity] = useState(getCurrentSessionIdentity);

  useEffect(() => {
    function syncAuthState() {
      setSessionIdentity(getCurrentSessionIdentity());
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

  const session = useMemo<AppSession>(() => sessionIdentity, [sessionIdentity]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
