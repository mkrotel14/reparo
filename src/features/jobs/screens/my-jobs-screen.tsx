import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { JobCard } from '@/features/jobs/components/job-card';
import { useCompleteJob, useCreateJob, useJobs } from '@/features/jobs/hooks/use-jobs';
import { useRole } from '@/features/session/role-context';
import { useSession } from '@/features/session/session-context';

export function MyJobsScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const { role } = useRole();
  const { session } = useSession();
  const jobs = useJobs();
  const completeJob = useCompleteJob();
  const createJob = useCreateJob();
  const myJobs = (jobs.data ?? []).filter((job) => (role === 'pro' ? job.proId === session?.identityId : job.clientId === session?.identityId));
  const isPro = role === 'pro';

  return (
    <AppScreen>
      <FlashList
        contentContainerStyle={styles.content}
        data={myJobs}
        keyExtractor={(job) => job.id}
        ListEmptyComponent={jobs.isError ? <View style={styles.error}><Text style={styles.empty}>Could not load your jobs.</Text><AppButton accessibilityLabel="Retry jobs" onPress={() => jobs.refetch()}>Retry</AppButton></View> : <Text style={styles.empty}>{jobs.isLoading ? 'Loading your jobs…' : 'No jobs here yet.'}</Text>}
        ListHeaderComponent={<View style={styles.header}><Text style={styles.title}>{isPro ? 'My repair work' : 'My repair requests'}</Text><Text style={styles.description}>{isPro ? 'Jobs you have taken are ready to manage here.' : 'Post a request, then track its repair progress here.'}</Text>{!isPro ? <View style={styles.form}><TextInput accessibilityLabel="Repair job title" onChangeText={setTitle} placeholder="What needs repair?" style={styles.input} value={title} /><TextInput accessibilityLabel="Repair job description" multiline onChangeText={setDescription} placeholder="Add a short description" style={[styles.input, styles.descriptionInput]} value={description} /><AppButton accessibilityLabel="Post a repair job" disabled={createJob.isPending || !title.trim()} onPress={() => { createJob.mutate({ description: description.trim(), title: title.trim() }, { onSuccess: () => { setTitle(''); setDescription(''); } }); }}>Post a repair job</AppButton></View> : null}</View>}
        renderItem={({ item }) => <JobCard actionLabel={isPro && item.status === 'claimed' ? 'Mark complete' : undefined} job={item} onAction={isPro && item.status === 'claimed' ? () => completeJob.mutate(item.id) : undefined} onPress={() => router.push(`/job/${item.id}`)} />}
      />
      {createJob.isError ? <Text style={styles.mutationError}>Could not post the repair job. Please try again.</Text> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: { gap: theme.spacing.md, padding: theme.spacing.xl },
  header: { gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: theme.typography.title, fontWeight: '800' },
  description: { color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 22 },
  empty: { color: theme.colors.textMuted, fontSize: theme.typography.body, paddingTop: theme.spacing.xl, textAlign: 'center' },
  form: { gap: theme.spacing.sm },
  input: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.md, borderWidth: 1, color: theme.colors.text, fontSize: theme.typography.body, padding: theme.spacing.md },
  descriptionInput: { minHeight: 84, textAlignVertical: 'top' },
  error: { gap: theme.spacing.md },
  mutationError: { color: theme.colors.danger, paddingHorizontal: theme.spacing.xl },
}));
