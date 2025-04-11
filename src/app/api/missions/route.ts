import { GetUserInfos } from "@/api/get-user-infos";
import { HttpResponse } from "@/api/http-response";
import { RolesSubjects } from "@/lib/casl";
import { MissionStatusEnum } from "@/lib/definitions";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { MissionListDto } from "../dtos/missions/mission-list.dto";
import { MissionPayloadDto } from "../dtos/missions/mission-payload.dto";
import { MissionDto } from "../dtos/missions/mission.dto";

export async function GET(req: NextRequest) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (roles.cannot("read", RolesSubjects.MISSION)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para ler as missões.",
    });
  }

  const status = (req.nextUrl.searchParams.get("status") ||
    "all") as MissionStatusEnum;

  const isEnable =
    status === MissionStatusEnum.ACTIVE
      ? true
      : status === MissionStatusEnum.INACTIVE
      ? false
      : undefined;

  const missions = await prisma.mission.findMany({
    where: {
      isEnable,
      tenant: {
        id: user.tenantId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      achievements: {
        skip: 0,
        take: 1,
        where: {
          creatorId: user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  if (!missions) {
    return HttpResponse.NotFound({
      message: "Tenant não encontrado.",
    });
  }

  const output: MissionListDto = {
    missions: missions.map((mission) => ({
      id: mission.id,
      name: mission.name,
      description: mission.description,
      points: mission.points,
      isEnable: mission.isEnable,
      status: mission?.achievements?.at(0)?.status,
      createdAt: mission.createdAt,
      updatedAt: mission.updatedAt,
    })),
  };

  return HttpResponse.Success(output);
}

export async function POST(req: NextRequest) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.MISSION)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para gerenciar as missões.",
    });
  }

  const payload = new MissionPayloadDto(await req.json());

  if (payload.hasErrors) {
    return HttpResponse.BadRequest({
      message: payload.errors,
    });
  }

  const missions = await prisma.mission.findMany({
    where: {
      name: payload.name,
      tenant: {
        id: user.tenantId,
      },
    },
  });

  if (missions.length > 0) {
    return HttpResponse.BadRequest({
      message: "Já existe um missão com esse nome.",
    });
  }

  const missionDb = await prisma.mission.create({
    data: {
      name: payload.name,
      description: payload.description,
      points: payload.points,
      isEnable: payload.isEnable,
      tenant: {
        connect: {
          id: user.tenantId,
        },
      },
    },
  });

  const output: MissionDto = {
    id: missionDb.id,
    name: missionDb.name,
    description: missionDb.description,
    points: missionDb.points,
    isEnable: missionDb.isEnable,
    createdAt: missionDb.createdAt,
    updatedAt: missionDb.updatedAt,
  };

  return HttpResponse.Created(output);
}
