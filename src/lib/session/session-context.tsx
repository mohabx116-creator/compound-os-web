import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { AuthenticatedUser } from '../api/auth-service';
import {
  ACCESS_TOKEN_CHANGE_EVENT,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../auth/auth-token-storage';
import {
  createAnonymousSession,
  createSessionFromAuthUser,
  hydrateSessionFromToken,
} from './session-adapter';
import type { AppSession, AppSessionIdentity } from './session.types';

export const SessionContext = createContext<AppSession | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [sessionIdentity, setSessionIdentity] = useState<AppSessionIdentity>(() => (
    createAnonymousSession({ isLoading: Boolean(getAccessToken()) })
  ));

  const refresh = useCallback(async () => {
    const hasToken = Boolean(getAccessToken());

    if (!hasToken) {
      setSessionIdentity(createAnonymousSession());
      return;
    }

    setSessionIdentity((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      setSessionIdentity(await hydrateSessionFromToken());
    } catch {
      clearAccessToken();
      setSessionIdentity(createAnonymousSession({
        error: 'تعذر تأكيد جلسة الدخول. يرجى تسجيل الدخول مرة أخرى.',
      }));
    }
  }, []);

  const loginWithToken = useCallback(async (
    accessToken: string,
    user?: AuthenticatedUser,
  ) => {
    setAccessToken(accessToken);

    if (user) {
      setSessionIdentity(createSessionFromAuthUser(user));
      return;
    }

    await refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearAccessToken();
    setSessionIdentity(createAnonymousSession());
  }, []);

  useEffect(() => {
    void refresh();

    function syncAuthState() {
      void refresh();
    }

    window.addEventListener('storage', syncAuthState);
    window.addEventListener(ACCESS_TOKEN_CHANGE_EVENT, syncAuthState);
    window.addEventListener('focus', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener(ACCESS_TOKEN_CHANGE_EVENT, syncAuthState);
      window.removeEventListener('focus', syncAuthState);
    };
  }, [refresh]);

  const session = useMemo<AppSession>(() => ({
    ...sessionIdentity,
    loginWithToken,
    logout,
    refresh,
  }), [loginWithToken, logout, refresh, sessionIdentity]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
