import * as Crypto from 'expo-crypto';

import { getSessionDatabase, migrateSessionDatabase } from '@/features/session/data/session-database';
import { DEMO_CLIENT_DUMMY_JSON_USER_ID, type Role, type Session } from '@/features/session/types';

type IdentityRow = {
  created_at: string;
  role: Role;
  identity_id: string;
  dummy_json_user_id: number | null;
};

type SessionRow = Omit<IdentityRow, 'role'> & { role: Role };

function toSession(row: SessionRow): Session {
  return {
    createdAt: row.created_at,
    identityId: row.identity_id,
    role: row.role,
    ...(row.dummy_json_user_id === null ? {} : { dummyJsonUserId: row.dummy_json_user_id }),
  };
}

async function getOrCreateIdentity(role: Role): Promise<Session> {
  const database = await getSessionDatabase();
  const createdAt = new Date().toISOString();
  await database.runAsync(
    `INSERT OR IGNORE INTO local_identities (role, identity_id, dummy_json_user_id, created_at)
     VALUES (?, ?, ?, ?)`,
    role,
    Crypto.randomUUID(),
    role === 'client' ? DEMO_CLIENT_DUMMY_JSON_USER_ID : null,
    createdAt,
  );

  const identity = await database.getFirstAsync<IdentityRow>(
    'SELECT role, identity_id, dummy_json_user_id, created_at FROM local_identities WHERE role = ?',
    role,
  );
  if (!identity) throw new Error('Could not create a local identity');

  return toSession(identity);
}

export const sessionRepository = {
  async restore(): Promise<Session | null> {
    await migrateSessionDatabase();
    const database = await getSessionDatabase();
    const session = await database.getFirstAsync<SessionRow>(
      'SELECT role, identity_id, dummy_json_user_id, created_at FROM active_session WHERE singleton = 1',
    );

    return session ? toSession(session) : null;
  },

  async selectRole(role: Role): Promise<Session> {
    await migrateSessionDatabase();
    const database = await getSessionDatabase();
    const session = await getOrCreateIdentity(role);

    await database.runAsync(
      `INSERT INTO active_session (singleton, role, identity_id, dummy_json_user_id, created_at)
       VALUES (1, ?, ?, ?, ?)
       ON CONFLICT(singleton) DO UPDATE SET
         role = excluded.role,
         identity_id = excluded.identity_id,
         dummy_json_user_id = excluded.dummy_json_user_id,
         created_at = excluded.created_at`,
      session.role,
      session.identityId,
      session.dummyJsonUserId ?? null,
      new Date().toISOString(),
    );

    return session;
  },

  async clear(): Promise<void> {
    await migrateSessionDatabase();
    const database = await getSessionDatabase();
    await database.runAsync('DELETE FROM active_session WHERE singleton = 1');
  },
};
