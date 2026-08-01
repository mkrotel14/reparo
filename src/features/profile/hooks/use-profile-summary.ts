import { useJobs } from '@/features/jobs/hooks/use-jobs';
import { useSession } from '@/features/session/session-context';
import { getProfileIdentity, getProfileSummary } from '@/features/profile/data/profile-summary';

export function useProfileSummary() {
  const { session } = useSession();
  const jobs = useJobs();

  if (!session) return null;

  return {
    identity: getProfileIdentity(session),
    isLoading: jobs.isLoading,
    summary: getProfileSummary(session, jobs.data ?? []),
  };
}
