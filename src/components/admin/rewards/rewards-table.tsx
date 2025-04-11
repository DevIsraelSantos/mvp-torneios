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
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { deletePremio } from "@/actions/reward-actions";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { RewardDto } from "../../../app/api/dtos/reward.dto";

type Premio = RewardDto;

interface PremiosTableProps {
  premios: Premio[];
}

export function PremiosTable({ premios }: PremiosTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [premioToDelete, setPremioToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!premioToDelete) return;

    try {
      await deletePremio(premioToDelete);
      toast.success("Prêmio excluído com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir prêmio");
      console.error(error);
    } finally {
      setIsDeleteDialogOpen(false);
      setPremioToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setPremioToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Pontos</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {premios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum prêmio encontrado.
                </TableCell>
              </TableRow>
            ) : (
              premios.map((premio) => (
                <TableRow key={premio.id}>
                  <TableCell className="font-medium">{premio.name}</TableCell>
                  <TableCell>{premio.points}</TableCell>
                  <TableCell>
                    <Badge variant={premio.isEnable ? "default" : "secondary"}>
                      {premio.isEnable ? "Disponível" : "Indisponível"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(premio.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/premios/${premio.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(premio.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              prêmio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
