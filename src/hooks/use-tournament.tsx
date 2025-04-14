"use client";
import { createOrUpdateTeamAction } from "@/actions/tournament-actions";
import { Team } from "@/entities/team.entity";
import { Tournament } from "@/entities/tournament.entity";
import { createContext, ReactNode, useContext, useState } from "react";

type TournamentContextType = {
  tournament: Tournament;
  setTournament: (tournament: Tournament) => void;
  updateTournament: (updates: Partial<Tournament>) => void;
  resetTournament: (id: string) => void;
  team: {
    add: (team: { name: string; players: string[] }) => void;
    update: (id: string, team: { name: string; players: string[] }) => void;
    remove: (id: string) => void;
  };
};

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined
);

export const TournamentProvider = ({
  children,
  initialTournament,
}: {
  children: ReactNode;
  initialTournament: Tournament;
}) => {
  const [tournament, setTournament] = useState<Tournament>(initialTournament);

  const updateTournament = (updates: Partial<Tournament>) => {
    setTournament((prev) => ({ ...prev, ...updates }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetTournament = (id: string) => {
    // TODO Reset the tournament with ID
    setTournament(initialTournament);
  };

  const addTeam = async (team: { name: string; players: string[] }) => {
    let newTeam: Team = {
      name: team.name,
      players: team.players,
    };
    const { message: id } = await createOrUpdateTeamAction({
      ...newTeam,
      tournamentId: tournament.id!,
    });

    newTeam = { ...newTeam, id };

    const currentTeams = tournament.teams || [];

    setTournament((prev) => ({
      ...prev,
      teams: [newTeam, ...currentTeams],
    }));
  };

  const updateTeam = (
    id: string,
    team: { name: string; players: string[] }
  ) => {
    console.log("updateTeam", id, team);
  };

  const removeTeam = (id: string) => {
    console.log("removeTeam", id);
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        setTournament,
        updateTournament,
        resetTournament,
        team: {
          add: addTeam,
          update: updateTeam,
          remove: removeTeam,
        },
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error(
      "useTournament deve ser usado dentro de um TournamentProvider"
    );
  }
  return context;
};
