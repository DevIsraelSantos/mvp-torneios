"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function TournamentHeader({
  name,
  id,
  status,
}: {
  name?: string;
  id?: string;
  status?: boolean;
}) {
  const router = useRouter();
  const [confirmEndDialogOpen, setConfirmEndDialogOpen] = useState(false);

  const handleEndTournament = () => {
    // Logic to end tournament
    console.log("Ending tournament", id);
    setConfirmEndDialogOpen(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={status ? "default" : "secondary"}>
            {status ? "Ativo" : "Encerrado"}
          </Badge>
        </div>
      </div>

      {status && (
        <Dialog
          open={confirmEndDialogOpen}
          onOpenChange={setConfirmEndDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="destructive">Encerrar Torneio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Encerrar Torneio</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja encerrar este torneio? Esta ação não pode
                ser desfeita.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Após encerrado, todas as telas ficarão em modo somente leitura.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmEndDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleEndTournament}>
                Encerrar Torneio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
