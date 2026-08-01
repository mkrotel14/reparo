import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { sessionRepository } from '@/features/session/data/session-repository';
import type { Role, Session } from '@/features/session/types';

type SessionStatus = 'loading' | 'unauthenticated' | 'authenticated';

type SessionContextValue = {
  session: Session | null;
  selectRole: (role: Role) => Promise<void>;
  signOut: () => Promise<void>;
  status: SessionStatus;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');

  useEffect(() => {
    let isMounted = true;
    sessionRepository.restore().then((restoredSession) => {
      if (!isMounted) return;
      setSession(restoredSession);
      setStatus(restoredSession ? 'authenticated' : 'unauthenticated');
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectRole = useCallback(async (role: Role) => {
    const nextSession = await sessionRepository.selectRole(role);
    setSession(nextSession);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    await sessionRepository.clear();
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(() => ({ session, selectRole, signOut, status }), [selectRole, session, signOut, status]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}
