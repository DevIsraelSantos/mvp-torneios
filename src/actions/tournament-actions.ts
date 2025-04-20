"use server";

import { auth } from "@/auth";
import { Tournament } from "@/entities/tournament.entity";
import { prisma } from "@/prisma";
import { TournamentCategories } from "@prisma/client";
import { TournamentSchema } from "./schema/tournament.schema";

export async function fetchTournaments() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const tournaments = await prisma.tournaments.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return tournaments;
}

export async function createTournamentAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
): Promise<{
  success: boolean;
  errors?: Record<string, string[]>;
  message: string;
}> {
  try {
    const validatedFields = TournamentSchema.safeParse({
      name: formData.get("name"),
      lossPoints: Number(formData.get("lossPoints")),
      numberOfSets: Number(formData.get("numberOfSets")),
      winPoints: Number(formData.get("winPoints")),
      category: formData.get("category") as TournamentCategories,
      spaces: formData.getAll("spaces").map((space) => ({
        name: space.toString(),
      })),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Campos inválidos. Falha ao criar torneio.",
      };
    }

    const { name, lossPoints, numberOfSets, winPoints, spaces, category } =
      validatedFields.data;

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verifica nome de torneio
    const tournamentExists = await prisma.tournaments.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (tournamentExists) {
      return {
        success: false,
        message: "🔴 Já existe um torneio com este nome.",
      };
    }

    const tournament = await prisma.tournaments.create({
      data: {
        name,
        lossPoints,
        numberOfSets,
        winPoints,
        userId,
        category,
        spaces: {
          createMany: {
            data: spaces,
          },
        },
      },
    });

    return {
      success: true,
      message: tournament.id,
    };
  } catch {
    return {
      success: false,
      message: "Erro ao criar torneio. Por favor, tente novamente.",
    };
  }
}

export async function getTournamentByIdAction(id: string): Promise<Tournament> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const tournament = await prisma.tournaments.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      spaces: true,
      teams: true,
      matches: {
        include: {
          scores: true,
          teamLeft: true,
          teamRight: true,
          space: true,
          winner: true,
        },
      },
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  return {
    ...tournament,
    matches: tournament.matches.map((match) => ({
      ...match,
      teamLeft: match.teamLeft || undefined,
      teamRight: match.teamRight || undefined,
      winner: match.winner || undefined,
      tournamentId: match.tournamentId ?? undefined,
    })),
    hasStarted: tournament.matches.length > 0,
  };
}

export async function createOrUpdateTeamAction({
  name,
  players,
  id,
  tournamentId,
}: Partial<{
  id?: string;
  tournamentId: string;
  name: string;
  players: string[];
}>): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!id) {
      const team = await prisma.teams.create({
        data: {
          name: name!,
          players,
          tournament: {
            connect: {
              id: tournamentId,
            },
          },
        },
      });

      return {
        success: true,
        message: team.id,
      };
    }

    const team = await prisma.teams.update({
      where: {
        id,
      },
      data: {
        name,
        players,
      },
    });

    return {
      success: true,
      message: team.id,
    };
  } catch {
    return {
      success: false,
      message: "Erro ao criar ou atualizar o time.",
    };
  }
}

export async function deleteTeamAction(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    await prisma.teams.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Time deletado com sucesso.",
    };
  } catch {
    return {
      success: false,
      message: "Erro ao deletar o time.",
    };
  }
}
