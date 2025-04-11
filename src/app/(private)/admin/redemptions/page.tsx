import { ResgatesTable } from "@/components/rewards/resgates-table";

export default async function ResgatesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Resgates</h1>
      </div>
      <ResgatesTable resgates={[]} />
    </div>
  );
}
