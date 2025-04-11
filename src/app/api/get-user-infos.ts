import { auth } from "@/auth";
import { Roles } from "@/lib/casl";
import { prisma } from "@/prisma";

export async function GetUserInfos(): Promise<{
  roles: ReturnType<typeof Roles>;
  user: {
    id: string;
    role: string;
    userId: string;
    tenantId: string;
    email: string;
  } | null;
}> {
  const session = await auth();

  const user = await prisma.userTenant.findUnique({
    where: {
      id: session?.user?.userId,
      tenantId: session?.user?.tenantId,
      isActive: true,
    },
  });

  const roles = Roles(session?.user?.role);
  if (!user) {
    return { roles, user: null };
  }

  return {
    roles,
    user: {
      id: user.id,
      role: user.role,
      userId: user.userId!,
      tenantId: user.tenantId,
      email: user.email,
    },
  };
}
