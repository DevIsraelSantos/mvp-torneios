import { RolesActions, RolesSubjects } from "@/lib/casl";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { AchievementListDto } from "../dtos/achievements/achievement-list.dto";
import { AchievementPayloadDto } from "../dtos/achievements/achievement-payload.dto";
import { AchievementDto } from "../dtos/achievements/achievement.dto";
import { GetUserInfos } from "../get-user-infos";
import { HttpResponse } from "../http-response";

export async function POST(req: NextRequest) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (roles.cannot(RolesActions.CREATE, RolesSubjects.ACHIEVEMENT)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para conquistar a missão.",
    });
  }

  const payload = new AchievementPayloadDto(await req.json());

  if (payload.hasErrors) {
    return HttpResponse.BadRequest({
      message: payload.errors,
    });
  }

  const mission = await prisma.mission.findFirst({
    where: {
      id: payload.missionId,
      tenantId: user.tenantId,
      isEnable: true,
      achievements: {
        none: {
          OR: [{ status: "PENDING" }, { status: "APPROVED" }],
        },
      },
    },
    include: {
      achievements: true,
    },
  });

  if (!mission) {
    return HttpResponse.BadRequest({
      message: "Ocorreu um erro, essa missão não está disponível.",
    });
  }

  const achievement = await prisma.achievement.create({
    data: {
      mission: {
        connect: {
          id: mission.id,
        },
      },
      creator: {
        connect: {
          id: user.id,
        },
      },
      evidence: payload.evidence,
      tenant: {
        connect: {
          id: user.tenantId,
        },
      },
    },
    include: {
      mission: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const output: AchievementDto = {
    id: achievement.id,
    mission: {
      id: mission.id,
      name: mission.name,
      description: mission.description,
      points: mission.points,
      isEnable: mission.isEnable,
      createdAt: mission.createdAt,
      updatedAt: mission.updatedAt,
    },
    creator: {
      id: achievement.creator.id,
      name: achievement.creator.name,
    },
    reviewer: achievement.reviewer
      ? {
          id: achievement.reviewer.id,
          name: achievement.reviewer.name,
        }
      : undefined,
    evidence: achievement.evidence,
    status: achievement.status,
    feedback: achievement.feedback ?? undefined,
    createdAt: achievement.createdAt,
    updatedAt: achievement.updatedAt,
  };

  return HttpResponse.Created(output);
}

export async function GET() {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (roles.cannot(RolesActions.READ, RolesSubjects.ACHIEVEMENT)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para as conquistas.",
    });
  }

  const achievements = await prisma.achievement.findMany({
    where: {
      tenant: {
        id: user.tenantId,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      mission: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!achievements) {
    return HttpResponse.NotFound({
      message: "Tenant não encontrado.",
    });
  }

  const output: AchievementListDto = {
    achievements: achievements.map((achievement) => ({
      id: achievement.id,
      mission: {
        id: achievement.mission.id,
        name: achievement.mission.name,
        createdAt: achievement.mission.createdAt,
        updatedAt: achievement.mission.updatedAt,
        description: achievement.mission.description,
        points: achievement.mission.points,
        isEnable: achievement.mission.isEnable,
      },
      creator: {
        id: achievement.creator.id,
        name: achievement.creator.name,
      },
      reviewer: {
        id: achievement.reviewer?.id ?? "",
        name: achievement.reviewer?.name ?? "",
      },
      evidence: achievement.evidence,
      status: achievement.status,
      feedback: achievement.feedback ?? "",
      createdAt: achievement.createdAt,
      updatedAt: achievement.updatedAt,
    })),
  };

  return HttpResponse.Success(output);
}
