import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";

import AuthenticatedLayout from "@/app/(app)/_layout";
import AuthLayout from "@/app/(auth)/_layout";
import { RootNavigator } from "@/app/_layout";
import { useSession } from "@/features/session/session-context";

jest.mock("expo-router", () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text: MockText } = require("react-native");
    return <MockText>Redirect: {href}</MockText>;
  },
  Stack: ({ children }: { children?: ReactNode }) => {
    const { View: MockView } = require("react-native");
    return <MockView>{children}</MockView>;
  },
}));

jest.mock("expo-router/stack", () => {
  const { Text: MockText, View: MockView } = require("react-native");
  const Stack = ({ children }: { children?: ReactNode }) => (
    <MockView>{children}</MockView>
  );
  Stack.Screen = ({ name }: { name: string }) => (
    <MockText>Stack screen: {name}</MockText>
  );
  return { Stack };
});

jest.mock(
  "@/features/session/components/loading/session-loading-screen",
  () => ({
    SessionLoadingScreen: () => {
      const { Text: MockText } = require("react-native");
      return <MockText>Restoring session</MockText>;
    },
  }),
);

jest.mock("@/features/session/session-context", () => ({
  useSession: jest.fn(),
}));

const mockedUseSession = jest.mocked(useSession);
const noSession = {
  session: null,
  selectRole: jest.fn(),
  signOut: jest.fn(),
  status: "unauthenticated" as const,
};
const clientSession = {
  session: {
    createdAt: "2026-08-01T00:00:00.000Z",
    identityId: "client-id",
    role: "client" as const,
  },
  selectRole: jest.fn(),
  signOut: jest.fn(),
  status: "authenticated" as const,
};

describe("session route guards", () => {
  it("keeps navigation behind the loading state until restoration completes", async () => {
    mockedUseSession.mockReturnValue({ ...noSession, status: "loading" });

    await render(<RootNavigator />);

    expect(screen.getByText("Restoring session")).toBeOnTheScreen();
    expect(screen.queryByText("Stack screen: (app)")).not.toBeOnTheScreen();
  });

  it("redirects an unauthenticated app route to login", async () => {
    mockedUseSession.mockReturnValue(noSession);

    await render(<AuthenticatedLayout />);

    expect(screen.getByText("Redirect: /(auth)")).toBeOnTheScreen();
  });

  it("redirects an authenticated login route to the app workspace", async () => {
    mockedUseSession.mockReturnValue(clientSession);

    await render(<AuthLayout />);

    expect(
      screen.getByText("Redirect: /(app)/(tabs)/my-jobs"),
    ).toBeOnTheScreen();
  });
});
