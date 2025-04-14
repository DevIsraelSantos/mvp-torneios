import { auth } from "@/auth";
import { prisma } from "@/prisma";

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
