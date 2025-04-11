"use client";

import { evaluateSubmission } from "@/actions/mission-actions";
import { AchievementDto } from "@/app/api/dtos/achievements/achievement.dto";
import { HeaderName } from "@/components/header-name";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AchievementStatus } from "@prisma/client";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  errors: {},
  message: "",
};

export function AchievementsList({
  achievements,
  error,
}: {
  achievements: AchievementDto[];
  error?: string;
}) {
  const [filters, setFilters] = useState<{
    search: string;
    status?: AchievementStatus;
  }>({
    search: "",
  });
  const [selectedSubmission, setSelectedSubmission] =
    useState<AchievementDto | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, isPending] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (state: any, payload: FormData) => {
      if (payload.get("reset") == "true") {
        return null;
      }

      const response = await evaluateSubmission(state, payload);
      return response;
    },
    initialState
  );

  const getStatusBadge = (status: AchievementStatus) => {
    const commonClassName = "py-1";
    switch (status) {
      case AchievementStatus.PENDING:
        return (
          <Badge variant="outline" className={commonClassName}>
            Pendente
          </Badge>
        );
      case AchievementStatus.APPROVED:
        return (
          <Badge variant="success" className={commonClassName}>
            Aprovado
          </Badge>
        );
      case AchievementStatus.REJECTED:
        return (
          <Badge variant="destructive" className={commonClassName}>
            Rejeitado
          </Badge>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const achievementsDataset = achievements.filter((achievement) => {
    if (filters.status && achievement.status !== filters.status) return false;
    if (
      filters.search &&
      (!achievement.creator.name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
        !achievement.mission.name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        !achievement.evidence
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        !achievement.reviewer?.name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        !achievement.feedback
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
        <HeaderName>Gerenciar Conquistas</HeaderName>
        <div className="flex items-end gap-4">
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                setFilters({ ...filters, status: undefined });
              } else {
                setFilters({ ...filters, status: value as AchievementStatus });
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">{"Todos"}</SelectItem>
                <SelectItem value="PENDING">{"Pendente"}</SelectItem>
                <SelectItem value="APPROVED">{"Aprovado"}</SelectItem>
                <SelectItem value="REJECTED">{"Rejeitado"}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            placeholder="Pesquisar"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            value={filters.search}
            className="w-64"
          />
        </div>
      </div>

      <div className="bg-background rounded-lg shadow p-6">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Missão</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievementsDataset.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhuma solicitação de conquista encontrada
                  </TableCell>
                </TableRow>
              ) : (
                achievementsDataset.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium">
                      {achievement.mission.name}
                    </TableCell>
                    <TableCell>{achievement.creator.name}</TableCell>
                    <TableCell>
                      {new Date(achievement.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(achievement.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubmission(achievement)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Visualizar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Evidência da Missão</DialogTitle>
                              <DialogDescription>
                                Conquista de{" "}
                                {new Date(
                                  achievement.createdAt
                                ).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 p-4 bg-muted rounded-md">
                              <p className="whitespace-pre-wrap">
                                {selectedSubmission?.evidence}
                              </p>
                            </div>

                            {selectedSubmission?.status ===
                              AchievementStatus.PENDING && (
                              <form action={formAction}>
                                <input
                                  type="hidden"
                                  name="submissionId"
                                  value={selectedSubmission?.id}
                                />

                                <div className="mt-4">
                                  <Textarea
                                    name="feedback"
                                    placeholder="Feedback opcional para o colaborador"
                                    rows={3}
                                  />
                                </div>

                                <DialogFooter className="mt-4 gap-2">
                                  <Button
                                    type="submit"
                                    name="status"
                                    value="rejected"
                                    variant="destructive"
                                    disabled={isEvaluating}
                                    onClick={() => setIsEvaluating(true)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rejeitar
                                  </Button>
                                  <Button
                                    type="submit"
                                    name="status"
                                    value="approved"
                                    variant="success"
                                    disabled={isEvaluating}
                                    onClick={() => setIsEvaluating(true)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Aprovar
                                  </Button>
                                </DialogFooter>
                              </form>
                            )}

                            {selectedSubmission?.status !==
                              AchievementStatus.PENDING && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2">
                                  Feedback:{" "}
                                  <span className="text-muted-foreground">
                                    {selectedSubmission?.reviewer?.name}
                                  </span>
                                </h4>
                                <p>
                                  {selectedSubmission?.feedback
                                    ? `${selectedSubmission?.feedback}`
                                    : "Nenhum feedback fornecido."}
                                </p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
