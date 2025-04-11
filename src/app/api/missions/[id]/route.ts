import { GetUserInfos } from "@/api/get-user-infos";
import { HttpResponse } from "@/api/http-response";
import { RolesSubjects } from "@/lib/casl";
import { prisma } from "@/prisma";
import { MissionDetailDto } from "../../dtos/missions/mission-detail.dto";
import { MissionPartialDto } from "../../dtos/missions/mission-partial.dto";
import { MessageDto } from "../../dtos/message.dto";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("read", RolesSubjects.MISSION)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para ver esta missão.",
    });
  }

  const { id } = await params;
  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  const missionDb = await prisma.mission.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
    // TODO - incluir qtde de usuários, resgates etc
  });

  if (!missionDb) {
    return HttpResponse.NotFound({
      message: "Usuário não encontrado.",
    });
  }

  const output: MissionDetailDto = {
    id: missionDb.id,
    name: missionDb.name,
    description: missionDb.description,
    points: missionDb.points,
    isEnable: missionDb.isEnable,
    createdAt: missionDb.createdAt,
    updatedAt: missionDb.updatedAt,
  };

  return HttpResponse.Success(output);
  // });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.MISSION)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para editar a missão.",
    });
  }

  const payload = new MissionPartialDto(await req.json());

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

  const missionCurrent = await prisma.mission.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
    // TODO - Não pode desativar se tiver resgates
  });

  if (!missionCurrent) {
    return HttpResponse.NotFound({
      message: "Missão não encontrada.",
    });
  }

  const missions = await prisma.mission.findMany({
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

  if (missions.some((mission) => mission.name === payload.name)) {
    return HttpResponse.BadRequest({
      message: "Já existe uma missão com este nome.",
    });
  }

  const missionDb = await prisma.mission.update({
    where: {
      id: id,
    },
    data: {
      name: payload.name,
      points: payload.points,
      description: payload.description,
      isEnable: payload.isEnable,
    },
  });

  const output: MissionDetailDto = {
    id: missionDb.id,
    name: missionDb.name,
    description: missionDb.description,
    points: missionDb.points,
    isEnable: missionDb.isEnable,
    createdAt: missionDb.createdAt,
    updatedAt: missionDb.updatedAt,
  };

  return HttpResponse.Success(output);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.MISSION)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para editar a missão.",
    });
  }

  const { id } = await params;
  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  const missionDb = await prisma.mission.delete({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
    select: {
      name: true,
    },
  });

  const output: MessageDto = {
    message: `✅ Missão "${missionDb.name}" inativada com sucesso.`,
  };

  return HttpResponse.Success(output);
}
