"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { MissionAchievement } from "@/lib/definitions";
import { useState } from "react";

export function RedemptionHistory({
  redemptions,
}: {
  redemptions: MissionAchievement[];
}) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<MissionAchievement | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      case "approved":
        return <Badge variant="success">Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Missão</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {redemptions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                Você ainda não submeteu nenhuma missão
              </TableCell>
            </TableRow>
          ) : (
            redemptions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  {/* Em produção, busque o título da missão pelo ID */}
                  Missão #{submission.missionId}
                </TableCell>
                <TableCell>
                  {new Date(submission.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Detalhes da Submissão</DialogTitle>
                        <DialogDescription>
                          Submissão de{" "}
                          {new Date(
                            selectedSubmission?.createdAt || new Date()
                          ).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Status:</h4>
                        <div>
                          {getStatusBadge(
                            selectedSubmission?.status || "pending"
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Sua Evidência:</h4>
                        <div className="p-4 bg-gray-50 rounded-md">
                          <p className="whitespace-pre-wrap">
                            {selectedSubmission?.evidence}
                          </p>
                        </div>
                      </div>

                      {selectedSubmission?.feedback && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">
                            Feedback do Administrador:
                          </h4>
                          <p className="text-gray-600">
                            {selectedSubmission.feedback}
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
