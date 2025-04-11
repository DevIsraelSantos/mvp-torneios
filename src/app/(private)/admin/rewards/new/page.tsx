import { PremioForm } from "@/components/admin/rewards/rewards-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NovoPremioPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/rewards">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Novo Prêmio</h1>
        <div className="rounded-lg border p-6">
          <PremioForm />
        </div>
      </div>
    </div>
  );
}
