"use client";

import { Roles } from "@/lib/casl";
import { UserRole } from "@prisma/client";
import { AbilityContext } from "./can";

export function CaslProvider({
  role,
  ...props
}: {
  role: UserRole | undefined;
  children: React.ReactNode;
}) {
  return (
    <AbilityContext.Provider value={Roles(role)}>
      {props.children}
    </AbilityContext.Provider>
  );
}
