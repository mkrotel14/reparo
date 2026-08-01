import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { MyJobsScreen } from '@/features/jobs/screens/my-jobs-screen';

jest.mock('@shopify/flash-list', () => ({ FlashList: require('react-native').FlatList }));
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('@/features/session/role-context', () => ({ useRole: () => ({ role: 'client', setRole: jest.fn() }) }));
jest.mock('@/features/session/session-context', () => ({
  useSession: () => ({ session: { identityId: 'client-1', role: 'client' } }),
}));

function Wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { gcTime: 0, staleTime: Infinity } } });
  queryClient.setQueryData(['jobs'], []);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('<MyJobsScreen />', () => {
  it('renders a Client empty state without an inline creation form', async () => {
    await render(<MyJobsScreen />, { wrapper: Wrapper });

    expect(screen.getByText('No jobs here yet.')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Post a repair job' })).not.toBeOnTheScreen();
  });
});
