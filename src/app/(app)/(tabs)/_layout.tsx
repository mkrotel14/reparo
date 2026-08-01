import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useSession } from "@/features/session/session-context";

export default function TabLayout() {
  const { session } = useSession();
  const isPro = session?.role === "pro";

  return (
    <NativeTabs>
      <NativeTabs.Trigger hidden={!isPro} name="jobs">
        <NativeTabs.Trigger.Icon md="format_list_bulleted" sf="list.bullet" />
        <NativeTabs.Trigger.Label>Jobs</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="my-jobs">
        <NativeTabs.Trigger.Icon md="build" sf="wrench.and.screwdriver" />
        <NativeTabs.Trigger.Label>My Jobs</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon md="account_circle" sf="person.circle" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
