import { getMissions } from "@/actions/mission-actions";
import { MissionList } from "./mission-list";
import { auth } from "@/auth";
import { Roles, RolesActions, RolesSubjects } from "@/lib/casl";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminMissionsPage() {
  const session = await auth();
  const missions = await getMissions();

  const roles = Roles(session?.user?.role);

  if (roles.cannot(RolesActions.MANAGE, RolesSubjects.MISSION)) {
    return (
      <div className="container mx-auto p-4">
        <h1>
          <Link href={"/missions"}>
            <Badge>Mural</Badge>
          </Link>{" "}
          Ops... Parece que você não tem permissão para acessar essa página.
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <MissionList missions={missions} />
    </div>
  );
}
