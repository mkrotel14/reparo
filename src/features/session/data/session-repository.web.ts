import { DEMO_CLIENT_DUMMY_JSON_USER_ID, type Role, type Session } from '@/features/session/types';

const sessionKey = 'reparo.active-session';
const identityKey = (role: Role) => `reparo.identity.${role}`;

function createIdentity(role: Role): Session {
  return {
    createdAt: new Date().toISOString(),
    identityId: globalThis.crypto.randomUUID(),
    role,
    ...(role === 'client' ? { dummyJsonUserId: DEMO_CLIENT_DUMMY_JSON_USER_ID } : {}),
  };
}

function read(key: string): Session | null {
  const value = globalThis.localStorage.getItem(key);
  return value ? (JSON.parse(value) as Session) : null;
}

export const sessionRepository = {
  async restore() {
    return read(sessionKey);
  },

  async selectRole(role: Role) {
    const identity = read(identityKey(role)) ?? createIdentity(role);
    globalThis.localStorage.setItem(identityKey(role), JSON.stringify(identity));
    const session = { ...identity, createdAt: new Date().toISOString() };
    globalThis.localStorage.setItem(sessionKey, JSON.stringify(session));
    return session;
  },

  async clear() {
    globalThis.localStorage.removeItem(sessionKey);
  },
};
