"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
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

// export async function createOrUpdateMissionAction(
//   prevState: unknown,
//   formData: FormData
// ) {
//   const validatedFields = MissionSchema.safeParse({
//     id: formData.get("id"),
//     name: formData.get("name"),
//     description: formData.get("description"),
//     points: formData.get("points"),
//     status: formData.get("status"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Campos inválidos. Falha ao salvar a missão.",
//     };
//   }

//   const { id, name, description, points, status } = validatedFields.data;

//   try {

// await bff.patch<MissionDto>(`/missions/${id}`, {
//   name,
//   description,
//   points,
//   isEnable: status === "active",
// });

//     revalidatePath("/admin/missions");
//     return { success: true, message: "Missão salva com sucesso!" };
//   } catch (error: unknown) {
//     if (error instanceof AxiosError) {
//       CatchHandler(error);
//       if (error.response?.data.message) {
//         return {
//           message: error.response?.data.message,
//         };
//       }
//     }
//     return {
//       message: "Erro ao salvar a missão. Por favor, tente novamente.",
//     };
//   }
// }
