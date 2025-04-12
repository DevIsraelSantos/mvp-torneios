import { TournamentHeader } from "@/components/tournament-header";
import React from "react";

export default async function PrivateLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  const tournament = {
    id: id,
    name: "Torneio de Verão 2023",
    status: "active",
    teams: 4,
    courts: 2,
    sets: 3,
    tieBreak: true,
    tieBreakPoints: 15,
    scoring: {
      victory: 3,
      defeat: 1,
      wo: 0,
      oo: 0,
    },
    hasFinal: true,
    finalFormat: "single",
    courtsList: ["Quadra 1", "Quadra 2"],
  };

  return (
    <div>
      <TournamentHeader
        id={tournament.id}
        name={tournament.name}
        status={tournament.status === "active"}
      />
      {children}
    </div>
  );
}
