import { fireEvent, render, screen } from '@testing-library/react-native';

import { LoginScreen } from '@/features/session/screens/login-screen';
import { useSession } from '@/features/session/session-context';

jest.mock('@/features/session/session-context', () => ({ useSession: jest.fn() }));

const mockedUseSession = jest.mocked(useSession);

describe('<LoginScreen />', () => {
  it('offers both RBAC workspaces', async () => {
    const selectRole = jest.fn();
    mockedUseSession.mockReturnValue({ session: null, selectRole, signOut: jest.fn(), status: 'unauthenticated' });

    await render(<LoginScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Continue as Client' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Continue as Pro' }));

    expect(selectRole).toHaveBeenNthCalledWith(1, 'client');
    expect(selectRole).toHaveBeenNthCalledWith(2, 'pro');
  });
});
