import { GetUserInfos } from "@/api/get-user-infos";
import { HttpResponse } from "@/api/http-response";
import { RolesSubjects } from "@/lib/casl";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { UserDetailDto } from "../../dtos/users/user-detail.dto";
import { UserPartialDto } from "../../dtos/users/user-partial.dto";
import { MessageDto } from "../../dtos/message.dto";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("read", RolesSubjects.USER)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para ver este usuário.",
    });
  }

  const { id } = await params;
  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  const userDb = await prisma.userTenant.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
    include: {
      user: true,
    },
  });

  if (!userDb) {
    return HttpResponse.NotFound({
      message: "Usuário não encontrado.",
    });
  }

  const output: UserDetailDto = {
    id: userDb.id,
    name: userDb.name,
    email: userDb.email,
    role: userDb.role,
    points: userDb.points,
    isActive: userDb.isActive,
    image: userDb.user?.image ?? undefined,
    createdAt: userDb.createdAt,
    updatedAt: userDb.updatedAt,
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

  if (!roles.can("manage", RolesSubjects.USER)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para gerenciar os usuários.",
    });
  }

  const payload = new UserPartialDto(await req.json());

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

  const currentUser = await prisma.userTenant.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
    include: {
      user: true,
    },
  });

  if (!currentUser) {
    return HttpResponse.NotFound({
      message: "Usuário não encontrado.",
    });
  }

  const userDb = await prisma.userTenant.update({
    where: {
      id: id,
    },
    data: {
      name: payload.name,
      points: payload.points,
    },
    include: {
      user: true,
    },
  });

  const output: UserDetailDto = {
    id: userDb.id,
    name: userDb.name,
    email: userDb.email,
    role: userDb.role,
    points: userDb.points,
    isActive: userDb.isActive,
    image: userDb.user?.image ?? undefined,
    createdAt: userDb.createdAt,
    updatedAt: userDb.updatedAt,
  };

  return HttpResponse.Success(output);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.USER)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para gerenciar os usuários.",
    });
  }

  const { id } = await params;

  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  const currentUser = await prisma.userTenant.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
  });

  if (!currentUser) {
    return HttpResponse.NotFound({
      message: "Usuário não encontrado.",
    });
  }

  if (currentUser.userId === user.userId) {
    return HttpResponse.BadRequest({
      message: "Você não pode inativar a si mesmo.",
    });
  }

  if (!currentUser.isActive) {
    return HttpResponse.Success({
      message: `Colaborador "${currentUser.name}" já está inativo.`,
    });
  }

  const userDb = await prisma.userTenant.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
    },
    select: {
      name: true,
    },
  });

  const output: MessageDto = {
    message: `⛔ ${userDb.name} inativado.`,
  };

  return HttpResponse.Success(output);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.USER)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para gerenciar os usuários.",
    });
  }

  const { id } = await params;

  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  const currentUser = await prisma.userTenant.findUnique({
    where: {
      id: id,
      tenantId: user.tenantId,
    },
  });

  if (!currentUser) {
    return HttpResponse.NotFound({
      message: "Usuário não encontrado.",
    });
  }

  if (currentUser.isActive) {
    return HttpResponse.Success({
      message: `Usuário "${currentUser.name}" já está inativo.`,
    });
  }

  const userDb = await prisma.userTenant.update({
    where: {
      id: id,
    },
    data: {
      isActive: true,
    },
    select: {
      name: true,
    },
  });

  const output: MessageDto = {
    message: `✅ ${userDb.name} ativado.`,
  };

  return HttpResponse.Success(output);
}
