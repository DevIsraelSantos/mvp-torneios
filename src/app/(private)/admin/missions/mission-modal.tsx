"use client";

import { PlusCircle } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { createOrUpdateMissionAction } from "@/actions/mission-actions";
import { MissionDto } from "@/app/api/dtos/missions/mission.dto";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  errors: {},
  message: "",
};

interface MissionModalProps {
  open?: boolean;
  onClose?: () => void;
  mission?: MissionDto | null;
  mode?: "create" | "edit";
}

export function MissionModal({
  open,
  onClose,
  mission,
  mode = "create",
}: MissionModalProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [state, formAction] = useActionState(
    createOrUpdateMissionAction,
    initialState
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(mission?.name || "");
  const [description, setDescription] = useState(mission?.description || "");
  const [points, setPoints] = useState(mission?.points || 10);
  const [status, setStatus] = useState(
    mission ? (mission?.isEnable ? "active" : "inactive") : "active"
  );

  function onOpenChange(value: boolean) {
    setIsOpen(value);
    if (!value && onClose) {
      onClose();
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (mission?.id) formData.append("id", mission.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("points", points.toString());
    formData.append("status", status);

    startTransition(async () => {
      await formAction(formData);
      setIsSubmitting(false);
    });
  };

  useEffect(() => {
    if (mission) {
      setName(mission.name);
      setDescription(mission.description);
      setPoints(mission.points);
      setStatus(mission.isEnable ? "active" : "inactive");
    }
  }, [mission]);

  useEffect(() => {
    if (state?.success) {
      toast(state.message);
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={open ?? isOpen} onOpenChange={onOpenChange}>
      {mode === "create" && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Missão
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Nova Missão" : "Editar Missão"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha os detalhes para criar uma nova missão."
              : "Edite os detalhes da missão selecionada."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mission && <input type="hidden" name="id" value={mission.id} />}

          <div className="space-y-2">
            <Label htmlFor="name">Título</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o título da missão"
              required
              aria-describedby="name-error"
            />
            {state?.errors?.name && (
              <p id="name-error" className="text-sm text-destructive">
                {state?.errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição detalhada da missão"
              rows={4}
              required
              aria-describedby="description-error"
            />
            {state?.errors?.description && (
              <p id="description-error" className="text-sm text-destructive">
                {state.errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Pontos</Label>
            <Input
              id="points"
              name="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              min={1}
              required
              aria-describedby="points-error"
            />
            {state?.errors?.points && (
              <p id="points-error" className="text-sm text-destructive">
                {state.errors.points}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors?.status && (
              <p className="text-sm text-destructive">{state.errors.status}</p>
            )}
          </div>

          {state?.message && !state?.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
