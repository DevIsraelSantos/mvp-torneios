"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 rounded-full p-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Algo deu errado
        </h1>
        <p className="text-muted-foreground mb-8">
          Desculpe, ocorreu um erro ao processar sua solicitação. Nossa equipe
          foi notificada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
