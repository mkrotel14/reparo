import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { JobsScreen } from '@/features/jobs/screens/jobs-screen';
jest.mock('@shopify/flash-list', () => ({
  FlashList: require('react-native').FlatList,
}));

jest.mock('@/features/session/role-context', () => ({
  useRole: () => ({ role: 'pro', setRole: jest.fn() }),
}));

function Wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { gcTime: 0, staleTime: Infinity } } });
  queryClient.setQueryData(['jobs'], [{ id: 'job-1', title: 'Leaking kitchen tap', location: 'Vila Madalena', budget: 180, status: 'open', clientId: 'client-1' }]);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('<JobsScreen />', () => {
  it('shows open jobs in the Pro workspace', async () => {
    await render(<JobsScreen />, { wrapper: Wrapper });

    expect(screen.getByText('Find your next repair')).toBeOnTheScreen();
    expect(screen.getByText('Leaking kitchen tap')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Take job Leaking kitchen tap' })).toBeOnTheScreen();
  });
});
