import { getAchievements } from "@/actions/mission-actions";
import { AchievementsList } from "./achievements-list";
import { auth } from "@/auth";
import { Roles, RolesActions, RolesSubjects } from "@/lib/casl";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminSubmissionsPage() {
  const session = await auth();
  const { achievements, error } = await getAchievements();

  const roles = Roles(session?.user?.role);

  if (roles.cannot(RolesActions.MANAGE, RolesSubjects.ACHIEVEMENT)) {
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
      <AchievementsList achievements={achievements} error={error} />
    </div>
  );
}
