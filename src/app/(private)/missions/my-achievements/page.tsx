import { getUserSubmissions } from "@/actions/mission-actions";
import { SubmissionHistory } from "./submission-history";

export default async function MySubmissionsPage() {
  const userId = "123"; // Em produção, obtenha o ID do usuário autenticado
  const submissions = await getUserSubmissions(userId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Minhas Submissões</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <SubmissionHistory submissions={submissions} />
      </div>
    </div>
  );
}
