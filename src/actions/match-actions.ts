"use server";

import { auth } from "@/auth";
import { Team } from "@/entities/team.entity";
import { prisma } from "@/prisma";
import { GameStatus, MatchStatus, TournamentCategories } from "@prisma/client";

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
  const _teams = teams.map((team) => team.id!);
  const rounds: string[][][] = [];
  const teamCount = _teams.length;

  const isOdd = teamCount % 2 !== 0;
  if (isOdd) {
    _teams.push("BYE");
  }

  const totalRounds = _teams.length - 1;
  const matchesPerRound = _teams.length / 2;
  const teamList = [..._teams];

  for (let round = 0; round < totalRounds; round++) {
    const matches: string[][] = [];

    for (let i = 0; i < matchesPerRound; i++) {
      const home = teamList[i];
      const away = teamList[teamList.length - 1 - i];

      if (home !== "BYE" && away !== "BYE") {
        matches.push([home, away]);
      }
    }

    rounds.push(matches);

    const fixed = teamList[0];
    const rotated = [
      fixed,
      ...teamList.slice(1).slice(-1),
      ...teamList.slice(1, -1),
    ];
    teamList.splice(0, teamList.length, ...rotated);
  }

  let matchNumber = 1;
  for (let round = 0; round < rounds.length; round++) {
    const matches = rounds[round];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      schedule.push({
        teamLeft: match[0],
        teamRight: match[1],
        round: round,
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

export async function startMatchAction({
  matchId,
  spaceId,
}: {
  matchId?: string;
  spaceId?: string;
}): Promise<{
  success: boolean;
  message: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const space = await prisma.spaces.findUnique({
    where: {
      id: spaceId,
      matches: {
        none: {
          status: MatchStatus.IN_PROGRESS,
        },
      },
    },
  });

  if (!space) {
    return {
      success: false,
      message: "🔴 Erro ao iniciar o jogo. Verifique os jogos em andamento",
    };
  }

  const match = await prisma.matches.update({
    where: {
      id: matchId,
      status: MatchStatus.PENDING,
    },
    data: {
      status: MatchStatus.IN_PROGRESS,
      space: {
        connect: {
          id: spaceId,
        },
      },
    },
    include: {
      space: true,
    },
  });

  if (!match || match.status !== MatchStatus.IN_PROGRESS) {
    return {
      success: false,
      message: "🔴 Erro ao iniciar o jogo. Verifique os jogos em andamento",
    };
  }

  return {
    success: true,
    message: `🟢 Jogo #${match.matchNumber} iniciado em "${match.space?.name}" `,
  };
}

export async function finishMatchWOAction({
  matchId,
  winnerId,
}: {
  matchId?: string;
  winnerId: string | null;
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

    await prisma.matches.update({
      where: {
        id: matchId,
        status: MatchStatus.PENDING,
      },
      data: {
        status: MatchStatus.FINISHED,
        gameStatus: winnerId ? GameStatus.WO : GameStatus.DOUBLE_WO,
        winner: winnerId
          ? {
              connect: {
                id: winnerId,
              },
            }
          : undefined,
      },
    });

    return {
      success: true,
      message: "🟡 Jogo foi finalizado com WO",
    };
  } catch {
    return {
      success: false,
      message: "🔴 Erro ao finalizar o jogo com WO",
    };
  }
}
