import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { MyJobsScreen } from '@/features/jobs/screens/my-jobs-screen';

jest.mock('@shopify/flash-list', () => ({ FlashList: require('react-native').FlatList }));
jest.mock('@/features/session/role-context', () => ({ useRole: () => ({ role: 'client', setRole: jest.fn() }) }));

function Wrapper({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { gcTime: 0, staleTime: Infinity } } });
  queryClient.setQueryData(['jobs'], []);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('<MyJobsScreen />', () => {
  it('places repair-job creation in the Client workspace', async () => {
    await render(<MyJobsScreen />, { wrapper: Wrapper });

    expect(screen.getByText('My repair requests')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Post a repair job' })).toBeOnTheScreen();
  });
});
