import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Linking } from "react-native";

import { useProfileSummary } from "@/features/profile/hooks/use-profile-summary";
import { useSession } from "@/features/session/session-context";
import { ProfileScreen } from "./profile-screen";

jest.mock("@/features/profile/hooks/use-profile-summary", () => ({
  useProfileSummary: jest.fn(),
}));
jest.mock("@/features/session/session-context", () => ({
  useSession: jest.fn(),
}));

const mockedUseProfileSummary = jest.mocked(useProfileSummary);
const mockedUseSession = jest.mocked(useSession);

describe("<ProfileScreen />", () => {
  afterEach(() => jest.restoreAllMocks());

  it("shows the account home and exposes logout without a role switch", async () => {
    const signOut = jest.fn().mockResolvedValue(undefined);
    mockedUseSession.mockReturnValue({
      session: {
        createdAt: "2026-08-01T00:00:00.000Z",
        identityId: "client-uuid",
        role: "client",
      },
      selectRole: jest.fn(),
      signOut,
      status: "authenticated",
    });
    mockedUseProfileSummary.mockReturnValue({
      identity: {
        displayName: "Reparo Client",
        email: "client@reparo.local",
        localId: "client-uuid",
        roleLabel: "Client",
      },
      isLoading: false,
      summary: {
        primaryMetric: { label: "Requests completed", value: 3 },
        supportingMetrics: [
          { label: "Open requests", value: 1 },
          { label: "In progress", value: 2 },
        ],
      },
    });

    await render(<ProfileScreen />);

    expect(screen.getByText("Reparo Client")).toBeOnTheScreen();
    expect(screen.getByText("client@reparo.local")).toBeOnTheScreen();
    expect(screen.getByText("Requests completed")).toBeOnTheScreen();
    expect(screen.getByText("Language")).toBeOnTheScreen();
    expect(screen.getByText("English")).toBeOnTheScreen();
    expect(screen.getByText("App version")).toBeOnTheScreen();
    expect(
      screen.queryByRole("button", { name: "Language" }),
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByRole("button", { name: "App version" }),
    ).not.toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Log out" }));

    expect(
      screen.queryByRole("button", { name: /Switch role/i }),
    ).not.toBeOnTheScreen();
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it("shows recoverable feedback when device settings cannot open", async () => {
    jest
      .spyOn(Linking, "openSettings")
      .mockRejectedValueOnce(new Error("Unavailable"));
    mockedUseSession.mockReturnValue({
      session: {
        createdAt: "2026-08-01T00:00:00.000Z",
        identityId: "pro-uuid",
        role: "pro",
      },
      selectRole: jest.fn(),
      signOut: jest.fn(),
      status: "authenticated",
    });
    mockedUseProfileSummary.mockReturnValue({
      identity: {
        displayName: "Reparo Pro",
        email: "pro@reparo.local",
        localId: "pro-uuid",
        roleLabel: "Pro",
      },
      isLoading: false,
      summary: {
        primaryMetric: { label: "Jobs completed", value: 0 },
        supportingMetrics: [
          { label: "Jobs claimed", value: 0 },
          { label: "Total assigned", value: 0 },
        ],
      },
    });

    await render(<ProfileScreen />);
    expect(screen.getByText("Reparo Pro")).toBeOnTheScreen();
    expect(screen.getByText("Jobs completed")).toBeOnTheScreen();
    await fireEvent.press(
      screen.getByRole("button", { name: "Device settings" }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Could not open device settings. Please try again.",
      ),
    );
  });

  it("opens device settings when the platform supports the handoff", async () => {
    const openSettings = jest
      .spyOn(Linking, "openSettings")
      .mockResolvedValueOnce();
    mockedUseSession.mockReturnValue({
      session: {
        createdAt: "2026-08-01T00:00:00.000Z",
        identityId: "client-uuid",
        role: "client",
      },
      selectRole: jest.fn(),
      signOut: jest.fn(),
      status: "authenticated",
    });
    mockedUseProfileSummary.mockReturnValue({
      identity: {
        displayName: "Reparo Client",
        email: "client@reparo.local",
        localId: "client-uuid",
        roleLabel: "Client",
      },
      isLoading: false,
      summary: {
        primaryMetric: { label: "Requests completed", value: 1 },
        supportingMetrics: [
          { label: "Open requests", value: 0 },
          { label: "In progress", value: 0 },
        ],
      },
    });

    await render(<ProfileScreen />);
    await fireEvent.press(
      screen.getByRole("button", { name: "Device settings" }),
    );

    await waitFor(() => expect(openSettings).toHaveBeenCalled());
    expect(screen.queryByRole("alert")).not.toBeOnTheScreen();
  });
});
