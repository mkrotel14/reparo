import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { jobsRepository } from '@/features/jobs/data/jobs-repository';
import { useClaimJob, useJobs } from '@/features/jobs/hooks/use-jobs';

jest.mock('@/features/jobs/data/jobs-repository', () => ({
  jobsRepository: { claim: jest.fn(), list: jest.fn() },
}));

const mockedRepository = jest.mocked(jobsRepository);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { gcTime: 0, retry: false } } });
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('jobs hooks', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loads jobs through the repository', async () => {
    mockedRepository.list.mockResolvedValueOnce([{ id: '1', title: 'Fix door', location: 'Centro', budget: 80, status: 'open', clientId: 'client-1' }]);
    const { result } = await renderHook(() => useJobs(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(mockedRepository.list).toHaveBeenCalledTimes(1);
  });

  it('claims a job for the active pro', async () => {
    const { result } = await renderHook(() => useClaimJob(), { wrapper: createWrapper() });

    await act(() => result.current.mutateAsync({ jobId: 'job-1', proId: 'pro-1' }));
    expect(mockedRepository.claim).toHaveBeenCalledWith('job-1', 'pro-1');
  });
});
