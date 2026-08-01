import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { jobsRepository } from '@/features/jobs/data/jobs-repository';

const jobsKey = ['jobs'] as const;

export function useJobs() {
  return useQuery({ queryKey: jobsKey, queryFn: jobsRepository.list });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsRepository.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKey }),
  });
}

export function useClaimJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, proId }: { jobId: string; proId: string }) => jobsRepository.claim(jobId, proId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKey }),
  });
}

export function useCompleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: jobsRepository.complete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobsKey }),
  });
}
