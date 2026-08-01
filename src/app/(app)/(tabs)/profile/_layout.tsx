import { Stack } from "expo-router/stack";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index">
        <Stack.Title large>Profile</Stack.Title>
      </Stack.Screen>
    </Stack>
  );
}
