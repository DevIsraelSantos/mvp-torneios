import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RewardDto } from "@/app/api/dtos/rewards/reward.dto";
import { ResgatarButton } from "@/components/rewards/redeen-button";
import { Button } from "@/components/ui/button";

export default async function PremioPage() {
  const premio: RewardDto = {
    id: "1",
    name: "Prêmio",
    description: "Descrição do prêmio",
    points: 50,
    isEnable: true,
    isUniqueReedem: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!premio) {
    notFound();
  }

  const user = {
    id: "123",
    pontos: 50,
  };

  const canRedeem = (user?.pontos || 0) >= premio.points;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/premios">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para prêmios
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          {false ? (
            <Image
              src={"/placeholder.svg"}
              alt={"premio.titulo"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Imagem não disponível</p>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{premio.name}</h1>
          <p className="text-muted-foreground mb-6">{premio.description}</p>

          <div className="mt-auto">
            <div className="mb-4">
              <div className="text-3xl font-bold">{premio.points} pontos</div>
              <div className="text-sm text-muted-foreground">
                Você possui {user?.pontos || 0} pontos
              </div>
            </div>

            {!premio.isEnable ? (
              <Button disabled className="w-full">
                Prêmio indisponível
              </Button>
            ) : (
              <ResgatarButton
                premioId={premio.id}
                canRedeem={canRedeem}
                pontosNecessarios={premio.points - (user?.pontos || 0)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
