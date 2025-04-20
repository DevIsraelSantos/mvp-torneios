"use server";

import { auth } from "@/auth";
import { Team } from "@/entities/team.entity";
import { prisma } from "@/prisma";
import { TournamentCategories } from "@prisma/client";

type Schedule = {
  teamLeft?: string;
  teamRight?: string;
  round: number;
  matchNumber: number;
};

function generateRoundRobinSchedules({
  teams,
}: {
  teams: Team[];
}): Array<Schedule> {
  const schedule: Array<Schedule> = [];
  const matchesPerRound = Math.floor(teams.length / 2);
  const totalRounds = teams.length - 1;
  const lastTeam = teams.pop();
  const arrayTeams = [...teams, ...teams];
  let matchNumber = 1;

  for (let round = 0; round < totalRounds; round++) {
    const leftTeams = arrayTeams.slice(round, round + matchesPerRound);
    const rightTeams = arrayTeams.slice(
      round + matchesPerRound,
      round + matchesPerRound + matchesPerRound - 1
    );

    schedule.push({
      teamLeft: leftTeams.shift()?.id,
      teamRight: lastTeam?.id,
      round,
      matchNumber: matchNumber++,
    });

    for (let i = 1; i < matchesPerRound; i++) {
      schedule.push({
        teamLeft: leftTeams.shift()?.id,
        teamRight: rightTeams.pop()?.id,
        round,
        matchNumber: matchNumber++,
      });
    }
  }

  return schedule;
}

function generateSchedule({
  teams,
  category,
}: {
  teams: Team[];
  category?: TournamentCategories;
}): Array<Schedule> {
  switch (category) {
    case TournamentCategories.ROUND_ROBIN:
      return generateRoundRobinSchedules({ teams });
    default:
      throw new Error("Categoria de torneio não suportada");
  }
}

export async function createMatchTable({
  tournamentId,
}: {
  tournamentId: string;
}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const tournament = await prisma.tournaments.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        teams: true,
      },
    });

    const matchGames = generateSchedule({
      category: tournament?.category,
      teams: tournament?.teams || [],
    });

    const matches = await prisma.matches.createMany({
      data: matchGames.map((match) => ({
        round: match.round,
        teamLeftId: match.teamLeft,
        teamRightId: match.teamRight,
        tournamentId: tournamentId,
        matchNumber: match.matchNumber,
      })),
    });

    return {
      success: true,
      message: `🟢 Tabela de jogos criada: ${matches.count} jogos`,
    };
  } catch {
    return {
      success: false,
      message: "🔴 Erro ao criar tabelas de jogos.",
    };
  }
}
