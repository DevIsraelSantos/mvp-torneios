"use client";

import { resgatarPremio } from "@/actions/reward-actions";
import { RewardDto } from "@/app/api/dtos/reward.dto";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Premio = RewardDto;

interface PremioCardProps {
  premio: Premio;
  userPoints: number;
}

export function PremioCard({ premio, userPoints }: PremioCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const canRedeem = userPoints >= premio.points;

  const handleResgate = async () => {
    try {
      setIsLoading(true);
      await resgatarPremio(premio.id, "user-id"); // O ID do usuário será obtido no servidor
      toast.success("Prêmio resgatado com sucesso! Aguardando aprovação.");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao resgatar prêmio");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/*
        // premio.imagem && (
        //   <div className="relative w-full h-48">
        //     <Image
        //       src={premio.imagem || "/placeholder.svg"}
        //       alt={premio.titulo}
        //       fill
        //       className="object-cover"
        //     />
        //   </div>
        // )
        //
      */}
      <CardHeader>
        <CardTitle>{premio.name}</CardTitle>
        <CardDescription>{premio.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{premio.points} pontos</div>
          {!canRedeem && (
            <div className="text-sm text-muted-foreground">
              Você precisa de mais {premio.points - userPoints} pontos
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleResgate}
          disabled={!canRedeem || isLoading}
          className="w-full"
        >
          {isLoading ? "Processando..." : "Resgatar Prêmio"}
        </Button>
      </CardFooter>
    </Card>
  );
}
