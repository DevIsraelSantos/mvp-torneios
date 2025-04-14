"use client";
import { Tournament } from "@/entities/tournament.entity";
import { createContext, ReactNode, useContext, useState } from "react";

type TournamentContextType = {
  tournament: Tournament;
  setTournament: (tournament: Tournament) => void;
  updateTournament: (updates: Partial<Tournament>) => void;
  resetTournament: (id: string) => void;
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

  return (
    <TournamentContext.Provider
      value={{ tournament, setTournament, updateTournament, resetTournament }}
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
