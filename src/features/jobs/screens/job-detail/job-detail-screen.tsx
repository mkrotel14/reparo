import { Text, View } from "react-native";

import { AppScreen, AppTag } from "@/design-system/components";
import { useJobs } from "@/features/jobs/hooks/use-jobs";
import { useSession } from "@/features/session/session-context";
import { styles } from "./job-detail-screen.styles";

export function JobDetailScreen({ jobId }: { jobId: string }) {
  const jobs = useJobs();
  const { session } = useSession();
  const job = jobs.data?.find((item) => item.id === jobId);
  const canView =
    job &&
    session &&
    (session.role === "client"
      ? job.clientId === session.identityId
      : job.proId === session.identityId);

  if (!canView)
    return (
      <AppScreen>
        <Text style={styles.message}>
          {jobs.isLoading ? "Loading repair job…" : "Repair job not found."}
        </Text>
      </AppScreen>
    );

  const assignment =
    session.role === "pro"
      ? "You claimed this repair job."
      : job.proId
        ? "A Pro has claimed this repair job."
        : "Waiting for a Pro to claim this repair job.";

  return (
    <AppScreen>
      <View style={styles.content}>
        <Text style={styles.title}>{job.title}</Text>
        <AppTag
          tone={
            job.status === "completed"
              ? "success"
              : job.status === "claimed"
                ? "warning"
                : "neutral"
          }
        >
          {job.status}
        </AppTag>
        {job.description ? (
          <Text style={styles.description}>{job.description}</Text>
        ) : null}
        <Text style={styles.meta}>
          {job.location} · R${job.budget}
        </Text>
        <Text style={styles.meta}>{assignment}</Text>
      </View>
    </AppScreen>
  );
}
