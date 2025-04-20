"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

function generateMatches(tournamentId: string): Array<{
  teamLeft: string;
  teamRight: string;
  space: string;
  round: number;
  roundPosition: number;
}> {
  console.log("Gerando tabela de jogos para o torneio:", tournamentId);
  const teamA = "67fd80baa9261689cf415c69";
  const teamB = "67fd80bea9261689cf415c6a";
  const teamC = "67fd80c2a9261689cf415c6b";
  const teamD = "68043f4037ee6cffafa0f080";
  const space = "67fd8076a9261689cf415c68";
  return [
    {
      teamLeft: teamA,
      teamRight: teamB,
      space,
      round: 1,
      roundPosition: 1,
    },
    {
      teamLeft: teamC,
      teamRight: teamD,
      space,
      round: 1,
      roundPosition: 2,
    },
    {
      teamLeft: teamA,
      teamRight: teamC,
      space,
      round: 2,
      roundPosition: 1,
    },
    {
      teamLeft: teamB,
      teamRight: teamD,
      space,
      round: 2,
      roundPosition: 2,
    },
    {
      teamLeft: teamA,
      teamRight: teamD,
      space,
      round: 3,
      roundPosition: 1,
    },
    {
      teamLeft: teamB,
      teamRight: teamC,
      space,
      round: 3,
      roundPosition: 2,
    },
  ];
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

    const matchGames = generateMatches(tournamentId);

    const matches = await prisma.matches.createMany({
      data: matchGames.map((match) => ({
        round: match.round,
        roundPosition: match.roundPosition,
        spacesId: match.space,
        teamLeftId: match.teamLeft,
        teamRightId: match.teamRight,
        tournamentId: tournamentId,
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
