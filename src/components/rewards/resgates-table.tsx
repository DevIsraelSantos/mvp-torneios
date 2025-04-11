"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { aprovarResgate, rejeitarResgate } from "@/actions/reward-actions";
import { useState } from "react";
import { toast } from "sonner";

interface Resgate {
  id: string;
  premioId: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  premio: {
    id: string;
    titulo: string;
    pontos: number;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface ResgatesTableProps {
  resgates: Resgate[];
}

export function ResgatesTable({ resgates }: ResgatesTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAprovar = async (id: string) => {
    try {
      setLoadingId(id);
      await aprovarResgate(id);
      toast.success("Resgate aprovado com sucesso");
    } catch (error) {
      toast.error("Erro ao aprovar resgate");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejeitar = async (id: string) => {
    try {
      setLoadingId(id);
      await rejeitarResgate(id);
      toast.success("Resgate rejeitado com sucesso");
    } catch (error) {
      toast.error("Erro ao rejeitar resgate");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <Badge variant="outline">Pendente</Badge>;
      case "APROVADO":
        return <Badge variant="success">Aprovado</Badge>;
      case "REJEITADO":
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Colaborador</TableHead>
            <TableHead>Prêmio</TableHead>
            <TableHead>Pontos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resgates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum resgate encontrado.
              </TableCell>
            </TableRow>
          ) : (
            resgates.map((resgate) => (
              <TableRow key={resgate.id}>
                <TableCell>{resgate.user.name || resgate.user.email}</TableCell>
                <TableCell>{resgate.premio.titulo}</TableCell>
                <TableCell>{resgate.premio.pontos}</TableCell>
                <TableCell>{getStatusBadge(resgate.status)}</TableCell>
                <TableCell>{formatDate(resgate.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {resgate.status === "PENDENTE" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAprovar(resgate.id)}
                        disabled={loadingId === resgate.id}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRejeitar(resgate.id)}
                        disabled={loadingId === resgate.id}
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
