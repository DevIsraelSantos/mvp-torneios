"use client";
import { createContext } from "react";
import { createContextualCan } from "@casl/react";
export const AbilityContext = createContext({});
export const Can = createContextualCan(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AbilityContext.Consumer as unknown as any
);
