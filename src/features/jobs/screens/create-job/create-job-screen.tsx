import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { AppButton, AppScreen } from "@/design-system/components";
import { useCreateJob } from "@/features/jobs/hooks/use-jobs";
import { styles } from "./create-job-screen.styles";

export function CreateJobScreen() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const createJob = useCreateJob();
  const canSubmit = Boolean(title.trim()) && !createJob.isPending;

  return (
    <AppScreen>
      <View style={styles.content}>
        <Text style={styles.label}>What needs repair?</Text>
        <TextInput
          accessibilityLabel="What needs repair"
          onChangeText={setTitle}
          placeholder="e.g. Leaking kitchen tap"
          style={styles.input}
          value={title}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          accessibilityLabel="Description"
          multiline
          onChangeText={setDescription}
          placeholder="Add useful details for the Pro"
          style={[styles.input, styles.description]}
          value={description}
        />
        <AppButton
          accessibilityLabel="Add repair job"
          disabled={!canSubmit}
          onPress={() =>
            createJob.mutate(
              { description: description.trim(), title: title.trim() },
              { onSuccess: () => router.back() },
            )
          }
        >
          Add repair job
        </AppButton>
        {createJob.isError ? (
          <Text style={styles.error}>
            Could not add this repair job. Please try again.
          </Text>
        ) : null}
      </View>
    </AppScreen>
  );
}
