import { render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import TabLayout from '@/app/(app)/(tabs)/_layout';
import { useSession } from '@/features/session/session-context';

jest.mock('expo-router/tabs', () => {
  const { Text: MockText, View: MockView } = require('react-native');
  const Tabs = ({ children }: { children?: ReactNode }) => <MockView>{children}</MockView>;
  Tabs.Screen = ({ name, options }: { name: string; options: { href?: string | null } }) => (
    <MockText>{`${name}:${options.href === null ? 'hidden' : 'visible'}`}</MockText>
  );
  return { Tabs };
});

jest.mock('@/features/session/session-context', () => ({ useSession: jest.fn() }));

const mockedUseSession = jest.mocked(useSession);

describe('role tab layout', () => {
  it('hides the Jobs tab for Clients', async () => {
    mockedUseSession.mockReturnValue({ session: { createdAt: '2026-08-01T00:00:00.000Z', identityId: 'client-id', role: 'client' }, selectRole: jest.fn(), signOut: jest.fn(), status: 'authenticated' });

    await render(<TabLayout />);

    expect(screen.getByText('index:hidden')).toBeOnTheScreen();
    expect(screen.getByText('my-jobs:visible')).toBeOnTheScreen();
  });

  it('shows Jobs, My jobs, and Profile for Pros', async () => {
    mockedUseSession.mockReturnValue({ session: { createdAt: '2026-08-01T00:00:00.000Z', identityId: 'pro-id', role: 'pro' }, selectRole: jest.fn(), signOut: jest.fn(), status: 'authenticated' });

    await render(<TabLayout />);

    expect(screen.getByText('index:visible')).toBeOnTheScreen();
    expect(screen.getByText('my-jobs:visible')).toBeOnTheScreen();
    expect(screen.getByText('profile:visible')).toBeOnTheScreen();
  });
});
