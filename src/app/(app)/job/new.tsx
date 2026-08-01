import { Redirect } from 'expo-router';

import { CreateJobScreen } from '@/features/jobs/screens/create-job/create-job-screen';
import { useSession } from '@/features/session/session-context';

export default function NewJobRoute() {
  const { session } = useSession();
  if (session?.role !== 'client') return <Redirect href="/(app)/(tabs)/my-jobs" />;

  return <CreateJobScreen />;
}
