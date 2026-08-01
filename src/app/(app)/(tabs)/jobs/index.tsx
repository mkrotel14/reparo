import { Redirect } from 'expo-router';

import { JobsScreen } from '@/features/jobs/screens/jobs/jobs-screen';
import { useSession } from '@/features/session/session-context';

export default function JobsRoute() {
  const { session } = useSession();
  if (session?.role !== 'pro') return <Redirect href="/(app)/(tabs)/my-jobs" />;

  return <JobsScreen />;
}
