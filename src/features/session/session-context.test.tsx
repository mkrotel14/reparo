import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';

import { sessionRepository } from '@/features/session/data/session-repository';
import { SessionProvider, useSession } from '@/features/session/session-context';

jest.mock('@/features/session/data/session-repository', () => ({
  sessionRepository: {
    clear: jest.fn(),
    restore: jest.fn(),
    selectRole: jest.fn(),
  },
}));

const repository = jest.mocked(sessionRepository);

function SessionProbe() {
  const { session, selectRole, signOut, status } = useSession();
  return (
    <View>
      <Text>{status}</Text>
      <Text>{session?.role ?? 'none'}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Choose Pro" onPress={() => selectRole('pro')} />
      <Pressable accessibilityRole="button" accessibilityLabel="Log out" onPress={() => signOut()} />
    </View>
  );
}

describe('SessionProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('restores a persisted session', async () => {
    repository.restore.mockResolvedValue({ createdAt: '2026-08-01T00:00:00.000Z', identityId: 'client-id', role: 'client', dummyJsonUserId: 1 });

    await render(<SessionProvider><SessionProbe /></SessionProvider>);

    await waitFor(() => expect(screen.getByText('authenticated')).toBeOnTheScreen());
    expect(screen.getByText('client')).toBeOnTheScreen();
  });

  it('updates and clears the active session through the provider actions', async () => {
    repository.restore.mockResolvedValue(null);
    repository.selectRole.mockResolvedValue({ createdAt: '2026-08-01T00:00:00.000Z', identityId: 'pro-id', role: 'pro' });
    repository.clear.mockResolvedValue();

    await render(<SessionProvider><SessionProbe /></SessionProvider>);
    await waitFor(() => expect(screen.getByText('unauthenticated')).toBeOnTheScreen());

    await fireEvent.press(screen.getByRole('button', { name: 'Choose Pro' }));
    await waitFor(() => expect(screen.getByText('pro')).toBeOnTheScreen());

    await fireEvent.press(screen.getByRole('button', { name: 'Log out' }));
    expect(repository.clear).toHaveBeenCalledTimes(1);
    expect(screen.getByText('none')).toBeOnTheScreen();
  });
});
