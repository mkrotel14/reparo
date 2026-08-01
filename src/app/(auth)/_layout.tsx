import { Redirect, Stack } from "expo-router";

import { useSession } from "@/features/session/session-context";

export default function AuthLayout() {
  const { status } = useSession();
  if (status === "authenticated")
    return <Redirect href="/(app)/(tabs)/my-jobs" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
