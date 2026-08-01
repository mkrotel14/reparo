import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppButton, AppScreen } from '@/design-system/components';
import { useCreateJob } from '@/features/jobs/hooks/use-jobs';

export function CreateJobScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const createJob = useCreateJob();
  const canSubmit = Boolean(title.trim()) && !createJob.isPending;

  return <AppScreen><View style={styles.content}><Text style={styles.label}>What needs repair?</Text><TextInput accessibilityLabel="What needs repair" onChangeText={setTitle} placeholder="e.g. Leaking kitchen tap" style={styles.input} value={title} /><Text style={styles.label}>Description</Text><TextInput accessibilityLabel="Description" multiline onChangeText={setDescription} placeholder="Add useful details for the Pro" style={[styles.input, styles.description]} value={description} /><AppButton accessibilityLabel="Add repair job" disabled={!canSubmit} onPress={() => createJob.mutate({ description: description.trim(), title: title.trim() }, { onSuccess: () => router.back() })}>Add repair job</AppButton>{createJob.isError ? <Text style={styles.error}>Could not add this repair job. Please try again.</Text> : null}</View></AppScreen>;
}

const styles = StyleSheet.create((theme) => ({ content: { gap: theme.spacing.md, padding: theme.spacing.xl }, label: { color: theme.colors.text, fontSize: theme.typography.body, fontWeight: '700' }, input: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.md, borderWidth: 1, color: theme.colors.text, fontSize: theme.typography.body, padding: theme.spacing.md }, description: { minHeight: 104, textAlignVertical: 'top' }, error: { color: theme.colors.danger, fontSize: theme.typography.body } }));
