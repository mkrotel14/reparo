export type Role = 'client' | 'pro';

export type Session = {
  identityId: string;
  role: Role;
  dummyJsonUserId?: number;
};

export const DEMO_CLIENT_DUMMY_JSON_USER_ID = 1;
