"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { TournamentSchema } from "./schema/tournament.schema";
import { Tournament } from "@/entities/tournament.entity";

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
      lossScore: Number(formData.get("lossScore")),
      numberOfSets: Number(formData.get("numberOfSets")),
      winPoints: Number(formData.get("winPoints")),
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

    const { name, lossScore, numberOfSets, winPoints, spaces } =
      validatedFields.data;
    console.log({ formData });
    console.log({ spaces });
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
    console.log({ spaces });
    const tournament = await prisma.tournaments.create({
      data: {
        name,
        lossScore,
        numberOfSets,
        winPoints,
        userId,
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
  } catch (error) {
    console.log("Error creating tournament", error);
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
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  return {
    ...tournament,
    spaces: tournament.spaces.map((space) => ({
      id: space.id,
      name: space.name,
    })),
  };
}
