import { notFound } from "next/navigation";

import { getMission } from "@/actions/mission-actions";
import { MissionForm } from "../mission-form";

export default async function EditMissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Se for "new", estamos criando uma nova missão
  if (id === "new") {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Nova Missão</h1>
        <MissionForm />
      </div>
    );
  }

  // Caso contrário, estamos editando uma missão existente
  const mission = await getMission(id);

  if (!mission) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Missão</h1>
      <MissionForm mission={mission} />
    </div>
  );
}
