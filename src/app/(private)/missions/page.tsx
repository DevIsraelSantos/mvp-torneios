import { getMissions } from "@/actions/mission-actions";
import { MissionStatusEnum } from "@/lib/definitions";
import { MissionGrid } from "./mission-grid";
import { auth } from "@/auth";

export default async function MissionsPage() {
  const session = await auth();
  const missions = await getMissions(MissionStatusEnum.ACTIVE);

  return (
    <div className="container mx-auto p-4">
      <MissionGrid missions={missions} session={session} />
    </div>
  );
}
