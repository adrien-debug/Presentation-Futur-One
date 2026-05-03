"use client";

import type { Session } from "@auth/core/types";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  /** Hydratation serveur : évite le premier fetch client `/api/auth/session` (source fréquente de ClientFetchError). */
  session: Session | null;
};

export function AppSessionProvider({ children, session }: Props) {
  return (
    <SessionProvider
      session={session}
      basePath="/api/auth"
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
