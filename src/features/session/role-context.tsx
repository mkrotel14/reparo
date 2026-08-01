import type { PropsWithChildren } from "react";

import { useSession } from "@/features/session/session-context";
import type { Role } from "@/features/session/types";

export type { Role } from "@/features/session/types";

export function RoleProvider({ children }: PropsWithChildren) {
  return children;
}

export function useRole() {
  const { session, selectRole } = useSession();
  if (!session) throw new Error("useRole requires an authenticated session");

  return { role: session.role, setRole: (role: Role) => void selectRole(role) };
}
