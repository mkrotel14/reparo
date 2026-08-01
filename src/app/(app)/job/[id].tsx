import { useLocalSearchParams } from 'expo-router';

import { JobDetailScreen } from '@/features/jobs/screens/job-detail-screen';

export default function JobDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <JobDetailScreen jobId={id} />;
}
