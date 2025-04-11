import { GetUserInfos } from "@/api/get-user-infos";
import { HttpResponse } from "@/api/http-response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { roles, user } = await GetUserInfos();

  // Get the id from the URL path
  const { id } = await params;
  if (!id || Array.isArray(id)) {
    return HttpResponse.BadRequest({
      message: "Id não informado.",
    });
  }

  // Get "term" from the URL after the "?" character
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const term = req.nextUrl.searchParams.get("term");

  if (!user) {
    return HttpResponse.Unauthorized({});
  }

  // Use the roles.can() method to check permissions
  if (!roles.can("claim", "mission")) {
    return HttpResponse.Forbidden({
      message: "Ops... Você não tem permissão para ler a(s) missão(ões).",
    });
  }

  return HttpResponse.Success({
    message: "Authorized",
    user: user.role,
  });
}
