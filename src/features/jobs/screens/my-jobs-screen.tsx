import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppScreen } from '@/design-system/components';
import { JobCard } from '@/features/jobs/components/job-card';
import { useCompleteJob, useJobs } from '@/features/jobs/hooks/use-jobs';
import { useRole } from '@/features/session/role-context';

export function MyJobsScreen() {
  const { role } = useRole();
  const jobs = useJobs();
  const completeJob = useCompleteJob();
  const myJobs = (jobs.data ?? []).filter((job) => (role === 'pro' ? job.proId === 'pro-1' : job.clientId === 'client-1'));
  const isPro = role === 'pro';

  return (
    <AppScreen>
      <FlashList
        contentContainerStyle={styles.content}
        data={myJobs}
        keyExtractor={(job) => job.id}
        ListEmptyComponent={<Text style={styles.empty}>{jobs.isLoading ? 'Loading your jobs…' : 'No jobs here yet.'}</Text>}
        ListHeaderComponent={<View style={styles.header}><Text style={styles.title}>{isPro ? 'My repair work' : 'My repair requests'}</Text><Text style={styles.description}>{isPro ? 'Jobs you have taken are ready to manage here.' : 'Track every repair request you have posted.'}</Text></View>}
        renderItem={({ item }) => <JobCard actionLabel={isPro && item.status === 'claimed' ? 'Mark complete' : undefined} job={item} onAction={isPro && item.status === 'claimed' ? () => completeJob.mutate(item.id) : undefined} />}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { gap: theme.spacing.md, padding: theme.spacing.xl },
  header: { gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: theme.typography.title, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 22 },
  empty: { color: theme.colors.textMuted, fontSize: theme.typography.body, paddingTop: theme.spacing.xl, textAlign: 'center' },
}));
