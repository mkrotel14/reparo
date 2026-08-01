import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { jobsRepository } from '@/features/jobs/data/jobs-repository';
import { seedJobsFromDummyJson } from '@/features/jobs/data/dummyjson-seed';
import { useSession } from '@/features/session/session-context';

const jobsKey = ['jobs'] as const;

export function useJobs() {
  const { session } = useSession();
  return useQuery({
    queryKey: jobsKey,
    queryFn: async () => {
      if (session) await seedJobsFromDummyJson({ clientId: session.role === 'client' ? session.identityId : 'dummyjson-client' });
      return jobsRepository.list();
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  return useMutation({
    mutationFn: ({ description, title }: { description: string; title: string }) => {
      if (!session || session.role !== 'client') throw new Error('Only Clients can create jobs');
      return jobsRepository.create({ clientId: session.identityId, description, title });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKey }),
  });
}

export function useClaimJob() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  return useMutation({
    mutationFn: (jobId: string) => {
      if (!session || session.role !== 'pro') throw new Error('Only Pros can claim jobs');
      return jobsRepository.claim(jobId, session.identityId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKey }),
  });
}

export function useCompleteJob() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  return useMutation({
    mutationFn: (jobId: string) => {
      if (!session || session.role !== 'pro') throw new Error('Only Pros can complete jobs');
      return jobsRepository.complete(jobId, session.identityId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKey }),
  });
}
