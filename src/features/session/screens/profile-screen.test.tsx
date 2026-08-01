import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProfileScreen } from '@/features/session/screens/profile-screen';
import { useSession } from '@/features/session/session-context';

jest.mock('@/features/session/session-context', () => ({ useSession: jest.fn() }));

const mockedUseSession = jest.mocked(useSession);

describe('<ProfileScreen />', () => {
  it('shows the active identity and exposes switch and logout actions', async () => {
    const selectRole = jest.fn().mockResolvedValue(undefined);
    const signOut = jest.fn().mockResolvedValue(undefined);
    mockedUseSession.mockReturnValue({
      session: { createdAt: '2026-08-01T00:00:00.000Z', identityId: 'client-uuid', role: 'client', dummyJsonUserId: 1 },
      selectRole,
      signOut,
      status: 'authenticated',
    });

    await render(<ProfileScreen />);

    expect(screen.getByText('client-uuid')).toBeOnTheScreen();
    expect(screen.getByText('Demo API user #1')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Switch to Pro' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Log out' }));

    expect(selectRole).toHaveBeenCalledWith('pro');
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
