import { GetUserInfos } from "@/api/get-user-infos";
import { HttpResponse } from "@/api/http-response";
import { RolesSubjects } from "@/lib/casl";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { RewardListDto } from "../dtos/rewards/reward-list.dto";
import { RewardPayloadDto } from "../dtos/rewards/reward-payload.dto";
import { RewardDto } from "../dtos/rewards/reward.dto";

export async function GET() {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("read", RolesSubjects.REWARD)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para ver os prêmios.",
    });
  }

  const rewards = await prisma.reward.findMany({
    where: {
      tenant: {
        id: user.tenantId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!rewards) {
    return HttpResponse.NotFound({
      message: "Tenant não encontrado.",
    });
  }

  const output: RewardListDto = {
    rewards: rewards.map((mission) => ({
      id: mission.id,
      name: mission.name,
      description: mission.description,
      points: mission.points,
      isEnable: mission.isEnable,
      isUniqueReedem: mission.isUniqueReedem,
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

  if (!roles.can("manage", RolesSubjects.REWARD)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para gerenciar os prêmios.",
    });
  }

  const payload = new RewardPayloadDto(await req.json());

  if (payload.hasErrors) {
    return HttpResponse.BadRequest({
      message: payload.errors,
    });
  }

  const rewards = await prisma.reward.findMany({
    where: {
      name: payload.name,
      tenant: {
        id: user.tenantId,
      },
    },
  });

  if (rewards.length > 0) {
    return HttpResponse.BadRequest({
      message: "Já existe um prêmio com esse nome.",
    });
  }

  const rewardDb = await prisma.reward.create({
    data: {
      name: payload.name,
      description: payload.description,
      points: payload.points,
      isEnable: payload.isEnable,
      isUniqueReedem: payload.isUniqueReedem,
      tenant: {
        connect: {
          id: user.tenantId,
        },
      },
    },
  });

  const output: RewardDto = {
    id: rewardDb.id,
    name: rewardDb.name,
    description: rewardDb.description,
    points: rewardDb.points,
    isEnable: rewardDb.isEnable,
    isUniqueReedem: rewardDb.isUniqueReedem,
    createdAt: rewardDb.createdAt,
    updatedAt: rewardDb.updatedAt,
  };

  return HttpResponse.Created(output);
}
