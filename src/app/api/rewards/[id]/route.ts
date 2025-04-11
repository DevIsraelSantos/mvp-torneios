import { GetUserInfos } from "@/api/get-user-infos";
import { HttpResponse } from "@/api/http-response";
import { RolesSubjects } from "@/lib/casl";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { MissionDetailDto } from "../../dtos/missions/mission-detail.dto";
import { RewardDetailDto } from "../../dtos/rewards/reward-detail.dto";
import { RewardPartialDto } from "../../dtos/rewards/reward-partial.dto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("read", RolesSubjects.REWARD)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para ver este prêmio.",
    });
  }

  const { id } = await params;

  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  const rewardDb = await prisma.reward.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
    // TODO - incluir qtde de usuários, resgates etc
  });

  if (!rewardDb) {
    return HttpResponse.NotFound({
      message: "Prêmio não encontrado.",
    });
  }

  const output: RewardDetailDto = {
    id: rewardDb.id,
    name: rewardDb.name,
    description: rewardDb.description,
    points: rewardDb.points,
    isEnable: rewardDb.isEnable,
    isUniqueReedem: rewardDb.isUniqueReedem,
    createdAt: rewardDb.createdAt,
    updatedAt: rewardDb.updatedAt,
  };

  return HttpResponse.Success(output);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.REWARD)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para editar a missão.",
    });
  }

  const payload = new RewardPartialDto(await req.json());

  const { id } = await params;
  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  if (payload.hasErrors) {
    return HttpResponse.BadRequest({
      message: payload.errors,
    });
  }

  const rewardCurrent = await prisma.reward.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
    // TODO - Não pode desativar se tiver resgates
  });

  if (!rewardCurrent) {
    return HttpResponse.NotFound({
      message: "Prêmio não encontrada.",
    });
  }

  const rewards = await prisma.reward.findMany({
    where: {
      tenantId: user.tenantId,
      NOT: {
        id: id,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (rewards.some((reward) => reward.name === payload.name)) {
    return HttpResponse.BadRequest({
      message: "Já existe uma prêmio com este nome.",
    });
  }

  const rewardDb = await prisma.reward.update({
    where: {
      id: id,
    },
    data: {
      isEnable: payload.isEnable,
      name: payload.name,
      description: payload.description,
      points: payload.points,
      isUniqueReedem: payload.isUniqueReedem,
    },
  });

  const output: MissionDetailDto = {
    id: rewardDb.id,
    name: rewardDb.name,
    description: rewardDb.description,
    points: rewardDb.points,
    isEnable: rewardDb.isEnable,
    createdAt: rewardDb.createdAt,
    updatedAt: rewardDb.updatedAt,
  };

  return HttpResponse.Success(output);
}
