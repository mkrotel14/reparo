import * as Crypto from 'expo-crypto';

import { getSessionDatabase, migrateSessionDatabase } from '@/features/session/data/session-database';
import { DEMO_CLIENT_DUMMY_JSON_USER_ID, type Role, type Session } from '@/features/session/types';

type IdentityRow = {
  role: Role;
  identity_id: string;
  dummy_json_user_id: number | null;
};

type SessionRow = Omit<IdentityRow, 'role'> & { role: Role };

function toSession(row: SessionRow): Session {
  return {
    identityId: row.identity_id,
    role: row.role,
    ...(row.dummy_json_user_id === null ? {} : { dummyJsonUserId: row.dummy_json_user_id }),
  };
}

async function getOrCreateIdentity(role: Role): Promise<Session> {
  const database = await getSessionDatabase();
  const existing = await database.getFirstAsync<IdentityRow>(
    'SELECT role, identity_id, dummy_json_user_id FROM local_identities WHERE role = ?',
    role,
  );

  if (existing) return toSession(existing);

  const session: Session = {
    identityId: Crypto.randomUUID(),
    role,
    ...(role === 'client' ? { dummyJsonUserId: DEMO_CLIENT_DUMMY_JSON_USER_ID } : {}),
  };

  await database.runAsync(
    'INSERT INTO local_identities (role, identity_id, dummy_json_user_id) VALUES (?, ?, ?)',
    session.role,
    session.identityId,
    session.dummyJsonUserId ?? null,
  );

  return session;
}

export const sessionRepository = {
  async restore(): Promise<Session | null> {
    await migrateSessionDatabase();
    const database = await getSessionDatabase();
    const session = await database.getFirstAsync<SessionRow>(
      'SELECT role, identity_id, dummy_json_user_id FROM active_session WHERE singleton = 1',
    );

    return session ? toSession(session) : null;
  },

  async selectRole(role: Role): Promise<Session> {
    await migrateSessionDatabase();
    const database = await getSessionDatabase();
    const session = await getOrCreateIdentity(role);

    await database.runAsync(
      `INSERT INTO active_session (singleton, role, identity_id, dummy_json_user_id)
       VALUES (1, ?, ?, ?)
       ON CONFLICT(singleton) DO UPDATE SET
         role = excluded.role,
         identity_id = excluded.identity_id,
         dummy_json_user_id = excluded.dummy_json_user_id`,
      session.role,
      session.identityId,
      session.dummyJsonUserId ?? null,
    );

    return session;
  },

  async clear(): Promise<void> {
    await migrateSessionDatabase();
    const database = await getSessionDatabase();
    await database.runAsync('DELETE FROM active_session WHERE singleton = 1');
  },
};
