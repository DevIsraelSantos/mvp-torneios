"use client";

import {
  ArrowDown,
  ArrowUp,
  Loader2,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { deleteMissionAction } from "@/actions/mission-actions";
import { MissionDto } from "@/app/api/dtos/missions/mission.dto";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { TIME_TO_ENABLE_DELETE_BUTTON } from "@/lib/definitions";
import { ProcessingAlert } from "@/lib/processing-alert";
import { MissionModal } from "./mission-modal";

export function MissionList({ missions }: { missions: MissionDto[] }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderBy, setOrderBy] = useState<
    | "createdAt_desc"
    | "createdAt_asc"
    | "name_asc"
    | "name_desc"
    | "points_asc"
    | "points_desc"
    | "status_asc"
    | "status_desc"
  >("createdAt_desc");
  const [selectedMission, setSelectedMission] = useState<MissionDto | null>(
    null
  );
  const [filters, setFilters] = useState<{
    search: string;
    onlyActive: boolean;
    onlyInactive: boolean;
  }>({
    search: "",
    onlyActive: false,
    onlyInactive: false,
  });

  const deleteMission = async (mission: MissionDto) => {
    if (!mission) return;
    ProcessingAlert();

    const message = await deleteMissionAction(mission.id);
    toast(message);
    setDeleteDialogOpen(false);
  };

  const missionsDataset = missions
    .filter(
      (mission) =>
        (mission.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          mission.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          mission.points.toString().includes(filters.search) ||
          mission.points.toLocaleString("pt-BR").includes(filters.search)) &&
        (filters.onlyActive ? mission.isEnable : true) &&
        (filters.onlyInactive ? !mission.isEnable : true)
    )
    .sort((a, b) => {
      switch (orderBy) {
        case "createdAt_desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "createdAt_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "points_asc":
          return a.points - b.points;
        case "points_desc":
          return b.points - a.points;
        case "status_asc":
          return a.isEnable === b.isEnable ? 0 : a.isEnable ? -1 : 1;
        case "status_desc":
          return a.isEnable === b.isEnable ? 0 : a.isEnable ? 1 : -1;
        default:
          return 0;
      }
    });

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Gerenciar Missões</h2>
        <div className="flex items-end gap-4">
          <Select
            onValueChange={(value) => {
              const onlyActive = value === "active";
              const onlyInactive = value === "inactive";
              setFilters({ ...filters, onlyActive, onlyInactive });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            placeholder="Pesquisar"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            value={filters.search}
            className="w-64"
          />
          <MissionModal />
        </div>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="cursor-not-allowed">
                <TableHead
                  className="w-50 hover:bg-primary/10 cursor-pointer "
                  onClick={() =>
                    setOrderBy(
                      orderBy === "name_asc" ? "name_desc" : "name_asc"
                    )
                  }
                >
                  <span className="flex items-center gap-1">
                    Título
                    {orderBy === "name_asc" && <ArrowDown size={16} />}
                    {orderBy === "name_desc" && <ArrowUp size={16} />}
                  </span>
                </TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead
                  className="w-24 text-end pr-8 hover:bg-primary/10 cursor-pointer"
                  onClick={() =>
                    setOrderBy(
                      orderBy === "points_asc" ? "points_desc" : "points_asc"
                    )
                  }
                >
                  <span className="flex items-center gap-1">
                    Pontos
                    {orderBy === "points_asc" && <ArrowDown size={16} />}
                    {orderBy === "points_desc" && <ArrowUp size={16} />}
                  </span>
                </TableHead>
                <TableHead
                  className="w-16 text-center hover:bg-primary/10 cursor-pointer"
                  onClick={() =>
                    setOrderBy(
                      orderBy === "status_asc" ? "status_desc" : "status_asc"
                    )
                  }
                >
                  <span className="flex items-center gap-1">
                    Status
                    {orderBy === "status_asc" && <ArrowDown size={16} />}
                    {orderBy === "status_desc" && <ArrowUp size={16} />}
                  </span>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missionsDataset.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhuma missão encontrada
                  </TableCell>
                </TableRow>
              ) : (
                missionsDataset.map((mission) => (
                  <TableRow key={mission.id}>
                    <TableCell className="font-medium">
                      {mission.name}
                    </TableCell>
                    <TableCell className="max-w-60 text-ellipsis truncate">
                      {mission.description}
                    </TableCell>
                    <TableCell className="text-end pr-8">
                      {mission.points.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={mission.isEnable ? "default" : "secondary"}
                      >
                        {mission.isEnable ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMission(mission);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMission(mission);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <DialogDelete
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            onClick={() => selectedMission && deleteMission(selectedMission)}
            selectedMission={selectedMission}
          />
          <MissionModal
            mission={selectedMission}
            mode="edit"
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
          />
        </div>
      </div>
    </>
  );
}

function DialogDelete({
  deleteDialogOpen,
  setDeleteDialogOpen,
  onClick,
  selectedMission,
}: {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onClick: () => void;
  selectedMission: MissionDto | null;
}) {
  const [time, setTime] = useState(TIME_TO_ENABLE_DELETE_BUTTON);
  const [isEnable, setIsEnable] = useState(false);

  useEffect(() => {
    if (deleteDialogOpen) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            setIsEnable(true);
            return TIME_TO_ENABLE_DELETE_BUTTON;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [deleteDialogOpen]);

  function onOpenChange(open: boolean) {
    setDeleteDialogOpen(open);
    setTime(TIME_TO_ENABLE_DELETE_BUTTON);
    setIsEnable(false);
  }

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Deletar missão "${selectedMission?.name}"`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {
              "Tem certeza que deseja deletar esta missão? Missões deletadas não podem ser recuperadas."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{`Cancelar`}</AlertDialogCancel>
          <AlertDialogAction
            // TODO - Verificar porque o Alerta não pega o danger
            className="flex items-center gap-2 bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            onClick={onClick}
            disabled={!isEnable}
          >
            {!isEnable && <Loader2 className="animate-spin text-6xl" />}
            <span>{isEnable ? "TENHO CERTEZA" : `Excluir em ${time}`}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
