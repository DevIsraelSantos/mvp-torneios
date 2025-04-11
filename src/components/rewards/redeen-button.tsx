"use client";

import { Button } from "@/components/ui/button";
import { resgatarPremio } from "@/actions/reward-actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ResgatarButtonProps {
  premioId: string;
  canRedeem: boolean;
  pontosNecessarios: number;
}

export function ResgatarButton({
  premioId,
  canRedeem,
  pontosNecessarios,
}: ResgatarButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResgate = async () => {
    try {
      setIsLoading(true);
      await resgatarPremio(premioId, "user-id"); // O ID do usuário será obtido no servidor
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

  if (!canRedeem) {
    return (
      <Button disabled className="w-full">
        Faltam {pontosNecessarios} pontos
      </Button>
    );
  }

  return (
    <Button onClick={handleResgate} disabled={isLoading} className="w-full">
      {isLoading ? "Processando..." : "Resgatar Prêmio"}
    </Button>
  );
}
