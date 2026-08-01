import { Stack } from "expo-router/stack";
import { useRouter } from "expo-router";

import { useSession } from "@/features/session/session-context";

export default function MyJobsLayout() {
  const router = useRouter();
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Title large>My Jobs</Stack.Title>
        {session?.role !== "pro" ? (
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
              accessibilityLabel="Add repair job"
              icon="plus"
              onPress={() => router.push("/job/new")}
            />
          </Stack.Toolbar>
        ) : null}
      </Stack.Screen>
    </Stack>
  );
}
