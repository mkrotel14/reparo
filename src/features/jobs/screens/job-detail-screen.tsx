import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppScreen } from '@/design-system/components';
import { useJobs } from '@/features/jobs/hooks/use-jobs';
import { useSession } from '@/features/session/session-context';

export function JobDetailScreen({ jobId }: { jobId: string }) {
  const jobs = useJobs();
  const { session } = useSession();
  const job = jobs.data?.find((item) => item.id === jobId);
  const canView = job && session && (session.role === 'client' ? job.clientId === session.identityId : job.proId === session.identityId);

  if (!canView) return <AppScreen><Text style={styles.message}>{jobs.isLoading ? 'Loading repair job…' : 'Repair job not found.'}</Text></AppScreen>;

  return <AppScreen><View style={styles.content}><Text style={styles.title}>{job.title}</Text><Text style={styles.status}>{job.status}</Text>{job.description ? <Text style={styles.description}>{job.description}</Text> : null}<Text style={styles.meta}>Assigned Pro: {job.proId ?? 'Not assigned yet'}</Text></View></AppScreen>;
}

const styles = StyleSheet.create((theme) => ({ content: { gap: theme.spacing.md, padding: theme.spacing.xl }, title: { color: theme.colors.text, fontSize: theme.typography.title, fontWeight: '800' }, status: { color: theme.colors.primary, fontSize: theme.typography.body, fontWeight: '700', textTransform: 'capitalize' }, description: { color: theme.colors.text, fontSize: theme.typography.body }, meta: { color: theme.colors.textMuted, fontSize: theme.typography.body }, message: { color: theme.colors.textMuted, padding: theme.spacing.xl } }));
