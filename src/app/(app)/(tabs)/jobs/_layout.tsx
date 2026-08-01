import { Stack } from "expo-router/stack";

export default function JobsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Title large>Jobs</Stack.Title>
      </Stack.Screen>
    </Stack>
  );
}
