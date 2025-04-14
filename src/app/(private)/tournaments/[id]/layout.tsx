import { getTournamentByIdAction } from "@/actions/tournament-actions";
import { TournamentHeader } from "@/components/tournament-header";
import React from "react";
import { TournamentProvider } from "../../../../hooks/use-tournament";

export default async function PrivateLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  const tournament = await getTournamentByIdAction(id);

  return (
    <div>
      <TournamentProvider initialTournament={tournament}>
        <TournamentHeader />
        {children}
      </TournamentProvider>
    </div>
  );
}
