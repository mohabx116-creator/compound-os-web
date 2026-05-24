import { useContext } from 'react';
import { SessionContext } from './session-context';

export function useSession() {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return session;
}
