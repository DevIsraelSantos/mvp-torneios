"use client";

import { useFormState } from "react-dom";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createOrUpdateMissionAction } from "@/actions/mission-actions";
import { MissionDto } from "@/app/api/dtos/missions/mission.dto";

const initialState = {
  errors: {},
  message: "",
};

export function MissionForm({ mission }: { mission?: MissionDto }) {
  //   const router = useRouter();
  const [state, formAction] = useFormState(
    createOrUpdateMissionAction,
    initialState
  );

  return (
    <form action={formAction}>
      {mission && <input type="hidden" name="id" value={mission.id} />}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Título</Label>
            <Input
              id="name"
              name="name"
              defaultValue={mission?.name || ""}
              placeholder="Digite o título da missão"
              required
              aria-describedby="name-error"
            />
            {state.errors?.name && (
              <p id="name-error" className="text-sm text-red-500">
                {state.errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={mission?.description || ""}
              placeholder="Digite a descrição detalhada da missão"
              rows={4}
              required
              aria-describedby="description-error"
            />
            {state.errors?.description && (
              <p id="description-error" className="text-sm text-red-500">
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
              defaultValue={mission?.points || 10}
              min={1}
              required
              aria-describedby="points-error"
            />
            {state.errors?.points && (
              <p id="points-error" className="text-sm text-red-500">
                {state.errors.points}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              defaultValue={mission?.isEnable ? "active" : "inactive"}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.status && (
              <p className="text-sm text-red-500">{state.errors.status}</p>
            )}
          </div>

          {state.message && (
            <p className="text-sm text-red-500 mt-4">{state.message}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/admin/missions">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit">Salvar</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
