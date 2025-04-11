"use client";
import {
  Award,
  CheckCircle,
  FlagTriangleLeft,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { submitMissionEvidence } from "@/actions/mission-actions";
import { MissionDto } from "@/app/api/dtos/missions/mission.dto";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { MissionViewStatusEnum } from "@/lib/definitions";
import { AchievementStatus } from "@prisma/client";
import { Roles, RolesActions, RolesSubjects } from "@/lib/casl";
import { Session } from "next-auth";

const initialState = {
  errors: { missionId: [], evidence: [] },
  message: "",
  success: undefined,
};

export function MissionGrid({
  missions,
  session,
}: {
  missions: MissionDto[];
  session: Session | null;
}) {
  const [selectedMission, setSelectedMission] = useState<MissionDto | null>(
    null
  );
  const [rangePoints, setRangePoints] = useState([0, 100000]);
  const [state, formAction, isPending] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (state: any, payload: FormData) => {
      if (payload.get("reset") == "true") {
        return null;
      }

      const response = await submitMissionEvidence(state, payload);
      return response;
    },
    initialState
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    viewStatus: MissionViewStatusEnum;
    minPoints: string;
    maxPoints: string;
  }>({
    search: "",
    viewStatus: MissionViewStatusEnum.ALL,
    minPoints: "",
    maxPoints: "",
  });
  const [evidence, setEvidence] = useState("");

  const roles = Roles(session?.user?.role);

  useEffect(() => {
    if (!isDialogOpen) {
      setEvidence("");
      setSelectedMission(null);
      const formData = new FormData();
      formData.append("reset", "true");
      formAction(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  const missionDataset = missions
    .filter((mission) => {
      if (filters.viewStatus === MissionViewStatusEnum.ALL) {
        return true;
      }

      if (filters.viewStatus === MissionViewStatusEnum.ACHIEVED) {
        return mission.status === AchievementStatus.APPROVED;
      }

      if (filters.viewStatus === MissionViewStatusEnum.DENIED) {
        return mission.status === AchievementStatus.REJECTED;
      }

      if (filters.viewStatus === MissionViewStatusEnum.PENDING) {
        return mission.status === AchievementStatus.PENDING;
      }

      if (
        !mission.status &&
        filters.viewStatus == MissionViewStatusEnum.AVAILABLE
      ) {
        return true;
      }
      return false;
    })
    .filter((mission) => {
      return (
        mission.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        mission.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    })
    .filter((mission) => {
      return (
        (!filters.minPoints || mission.points >= parseInt(filters.minPoints)) &&
        (!filters.maxPoints || mission.points <= parseInt(filters.maxPoints))
      );
    });

  const majorPoints = Math.max(...missions.map((mission) => mission.points));

  if (majorPoints < rangePoints[1]) {
    setRangePoints([0, majorPoints]);
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">
          Missões
          <span className="ml-4 text-sm text-secondary">
            {missionDataset.length} de {missions.length}
          </span>
        </h2>
        <div className="flex items-center gap-4 justify-end">
          {(filters.search !== "" ||
            filters.viewStatus !== MissionViewStatusEnum.ALL ||
            filters.minPoints !== "" ||
            filters.maxPoints !== "") && (
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() =>
                setFilters({
                  search: "",
                  viewStatus: MissionViewStatusEnum.ALL,
                  minPoints: "",
                  maxPoints: "",
                })
              }
            >
              Limpar
            </Button>
          )}
          <div className="flex items-center gap-2 justify-end">
            <span>Pontos: </span>
            <Input
              placeholder="Minimo"
              type="number"
              min="0"
              step="1"
              max={majorPoints}
              onChange={(e) =>
                setFilters({ ...filters, minPoints: e.target.value })
              }
              value={filters.minPoints}
              className="w-24"
            />
            <span>até</span>
            <Input
              placeholder="Máximo"
              type="number"
              min="0"
              step="1"
              max={majorPoints}
              onChange={(e) =>
                setFilters({ ...filters, maxPoints: e.target.value })
              }
              value={filters.maxPoints}
              className="w-24"
            />
          </div>
          <Select
            value={filters.viewStatus}
            onValueChange={(value: MissionViewStatusEnum) => {
              setFilters({
                ...filters,
                viewStatus: value,
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Novas</SelectItem>
                <SelectItem value="achieved">Conquistadas</SelectItem>
                <SelectItem value="denied">Negadas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
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
      <div>
        {missionDataset.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma missão disponível no momento
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionDataset.map((mission) => (
              <Card key={mission.id} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {mission.status === AchievementStatus.REJECTED && (
                      <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    {mission.status === AchievementStatus.APPROVED && (
                      <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
                    )}
                    {mission.status === AchievementStatus.PENDING && (
                      <FlagTriangleLeft className="h-5 w-5 mr-2 text-yellow-500" />
                    )}
                    {!mission.status && (
                      <Award className="h-5 w-5 mr-2 text-primary" />
                    )}
                    {mission.name}
                  </CardTitle>
                  <CardDescription>
                    {mission.points.toLocaleString("pt-BR")} pontos
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">{mission.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={
                      mission.status === AchievementStatus.APPROVED ||
                      mission.status === AchievementStatus.PENDING
                    }
                    onClick={() => {
                      setSelectedMission(mission);
                      setIsDialogOpen(true);
                    }}
                  >
                    {mission.status === AchievementStatus.APPROVED
                      ? "Conquistada"
                      : mission.status === AchievementStatus.PENDING
                      ? "Pendente"
                      : "Conquistar"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Dialog
        open={isDialogOpen && selectedMission !== null}
        onOpenChange={(open) => {
          if (isPending) return;
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{`Conquistar: ${selectedMission?.name}`}</DialogTitle>
            <DialogDescription>
              {`${selectedMission?.description}`}
            </DialogDescription>
          </DialogHeader>

          {state?.success ? (
            <div className="py-6 flex flex-col items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-center text-lg font-medium">{state.message}</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedMission(null);
                }}
              >
                Fechar
              </Button>
            </div>
          ) : (
            <form action={formAction}>
              <input
                type="hidden"
                name="missionId"
                value={selectedMission?.id}
              />

              <div className="mt-4">
                <Textarea
                  name="evidence"
                  placeholder="Descreva como você completou a missão ou forneça links para evidências (URLs, etc.)"
                  rows={5}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  required
                  aria-describedby="evidence-error"
                  disabled={isPending}
                />
                {state?.errors?.evidence && (
                  <p id="evidence-error" className="text-sm text-red-500 mt-1">
                    {state.errors.evidence}
                  </p>
                )}
              </div>

              {state?.message && !state.success && (
                <p className="text-sm text-red-500 mt-4">{state.message}</p>
              )}

              <DialogFooter className="mt-4">
                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    !evidence ||
                    roles.cannot(RolesActions.CREATE, RolesSubjects.ACHIEVEMENT)
                  }
                >
                  {isPending ? "Enviando..." : "Enviar Evidência"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
