import { GetUserInfos } from "@/api/get-user-infos";
import { HttpResponse } from "@/api/http-response";
import { RolesSubjects } from "@/lib/casl";
import { prisma } from "@/prisma";
import { NextRequest } from "next/server";
import { UserListDto } from "../dtos/users/user-list.dto";
import { UserPayloadDto } from "../dtos/users/user-payload.dto";
import { UserDto } from "../dtos/users/user.dto";

export async function GET() {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.USER)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para gerenciar os usuários.",
    });
  }

  const tenantDb = await prisma.tenant.findUnique({
    where: {
      id: user.tenantId,
    },
    include: {
      userTenant: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!tenantDb) {
    return HttpResponse.NotFound({
      message: "Tenant não encontrado.",
    });
  }

  const output: UserListDto = {
    users: tenantDb.userTenant.map((userDb) => {
      return {
        id: userDb.id,
        name: userDb.name,
        email: userDb.email,
        role: userDb.role,
        isActive: userDb.isActive,
        points: userDb.points,
        image: userDb.user?.image ?? undefined,
        createdAt: userDb.createdAt,
        updatedAt: userDb.updatedAt,
      };
    }),
  };

  return HttpResponse.Success(output);
}

export async function POST(req: NextRequest) {
  const { roles, user } = await GetUserInfos();

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  if (!roles.can("manage", RolesSubjects.USER)) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para gerenciar os usuários.",
    });
  }

  const payload = new UserPayloadDto(await req.json());

  if (payload.hasErrors) {
    return HttpResponse.BadRequest({
      message: payload.errors,
    });
  }

  const users = await prisma.userTenant.findMany({
    where: {
      email: payload.email,
    },
  });

  if (users.length > 0) {
    return HttpResponse.BadRequest({
      message: "Já existe um usuário com este e-mail.",
    });
  }

  const userDb = await prisma.userTenant.create({
    data: {
      name: payload.name,
      email: payload.email,
      role: payload?.role,
      points: payload?.points,
      tenant: {
        connect: {
          id: user.tenantId,
        },
      },
    },
  });

  // TODO - NTH: Send email to user

  const output: UserDto = {
    id: userDb.id,
    name: userDb.name,
    email: userDb.email,
    role: userDb.role,
    isActive: userDb.isActive,
    points: userDb.points,
    createdAt: userDb.createdAt,
    updatedAt: userDb.updatedAt,
  };

  return HttpResponse.Created(output);
}
