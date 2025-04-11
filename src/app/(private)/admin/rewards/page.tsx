import { PremiosTable } from "@/components/admin/rewards/rewards-table";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import Link from "next/link";

export default async function PremiosPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const premios: any = [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Prêmios</h1>
        <Link href="/admin/rewards/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Prêmio
          </Button>
        </Link>
      </div>
      <PremiosTable premios={premios} />
    </div>
  );
}
