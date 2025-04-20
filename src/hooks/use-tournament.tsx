"use client";

import { createMatchTable } from "@/actions/match-actions";
import {
  createOrUpdateTeamAction,
  deleteTeamAction,
  getTournamentByIdAction,
} from "@/actions/tournament-actions";
import { Team } from "@/entities/team.entity";
import { Tournament } from "@/entities/tournament.entity";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

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
  match: {
    generate: () => void;
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

  const resetTournament = async (id: string) => {
    const t = await getTournamentByIdAction(id);
    setTournament(t);
  };

  const addTeam = async (team: { name: string; players: string[] }) => {
    const loading = toast.loading(`Criando`);
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
    toast.dismiss(loading);
    toast(`🟢 Time ${newTeam.name} criado com sucesso`);
  };

  const updateTeam = async (
    id: string,
    team: { name: string; players: string[] }
  ) => {
    const loading = toast.loading(`Salvando`);

    const editTeam: Team = {
      id,
      name: team.name,
      players: team.players,
    };

    await createOrUpdateTeamAction({
      ...editTeam,
      tournamentId: tournament.id!,
    });

    const currentTeams = tournament.teams.filter((t) => t.id !== id) || [];

    setTournament((prev) => ({
      ...prev,
      teams: [editTeam, ...currentTeams],
    }));
    toast.dismiss(loading);
    toast(`🟢 Time ${editTeam.name} salvo com sucesso`);
  };

  const removeTeam = async (id: string) => {
    const loading = toast.loading(`Deletando`);

    const actionResult = await deleteTeamAction(id);
    if (!actionResult.success) {
      toast.error(`${actionResult.message}`);
      return;
    }

    const currentTeams = tournament.teams || [];

    setTournament((prev) => ({
      ...prev,
      teams: [...currentTeams.filter((team) => team.id !== id)],
    }));

    toast.dismiss(loading);
    toast.warning(`🟡 Time apagado`);
  };

  const generateMatchTable = async () => {
    const loading = toast.loading(`Gerando tabela de jogos`);
    const actionResult = await createMatchTable({
      tournamentId: tournament.id!,
    });
    toast.dismiss(loading);
    if (!actionResult.success) {
      toast.error(`${actionResult.message}`);
      return;
    }
    toast.success(`${actionResult.message}`);
    resetTournament(tournament.id!);
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
        match: {
          generate: generateMatchTable,
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
