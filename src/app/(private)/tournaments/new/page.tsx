"use client";

import { createTournamentAction } from "@/actions/tournament-actions";
import Page from "@/components/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export default function NewTournamentPage() {
  const router = useRouter();
  const [spaces, setSpaces] = useState([{ id: 1, name: "Quadra 1" }]);
  const [spaceName, setSpaceName] = useState("");
  const [spaceError, setSpaceError] = useState("");

  console.log({ spaceName });

  const [, formAction, isPending] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (state: any, payload: FormData) => {
      spaces.forEach((space) => {
        payload.append("spaces", space.name);
      });

      const response = await createTournamentAction(state, payload);

      if (!response.success) {
        toast(response.message);
        return response;
      }
      const id = response?.message;
      router.push(`/tournaments/${id}`);
      toast("🟢 Torneio criado com sucesso!");
    },
    null
  );

  const handleAddSpace = () => {
    if (!spaceName.trim()) {
      setSpaceError("Nome da quadra não pode estar vazio");
      return;
    }

    const spaceExists = spaces.some(
      (space) => space.name.toLowerCase() === spaceName.toLowerCase()
    );

    if (spaceExists) {
      setSpaceError("Já existe uma quadra com este nome");
      return;
    }

    setSpaces([...spaces, { id: spaces.length + 1, name: spaceName }]);
    setSpaceName("");
    setSpaceError("");
  };

  const handleRemoveSpace = (id: number) => {
    setSpaces(spaces.filter((space) => space.id !== id));
  };

  return (
    <Page>
      <form action={formAction}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome do torneio</Label>
                <Input
                  id="name"
                  name="name"
                  minLength={2}
                  placeholder="Ex: Torneio de Verão sub 15"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="numberOfSets">
                  Quantidade de sets por jogo
                </Label>
                <Select
                  name="numberOfSets"
                  defaultValue="1"
                  onValueChange={(value) => {
                    const hiddenInput = document.getElementById(
                      "numberOfSets-hidden"
                    ) as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = value;
                  }}
                >
                  <SelectTrigger id="sets-format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Jogo único</SelectItem>
                    <SelectItem value="3">Melhor de 3</SelectItem>
                    <SelectItem value="5">Melhor de 5</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  id="numberOfSets-hidden"
                  name="numberOfSets"
                  defaultValue="1"
                />
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Pontuação</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="winPoints">Vitória</Label>
                    <Input
                      id="winPoints"
                      name="winPoints"
                      type="number"
                      min="0"
                      defaultValue="1"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lossPoints">Derrota</Label>
                    <Input
                      id="lossPoints"
                      name="lossPoints"
                      type="number"
                      min="0"
                      defaultValue="0"
                      required
                    />
                  </div>
                </div>

                <Alert className="mt-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>WO e Duplo WO?</AlertTitle>
                  <AlertDescription>
                    <p>
                      <strong>WO (Walkover)</strong>: Quando um time não
                      comparece ao jogo. O time que não comparece perde o jogo.
                    </p>
                    <p>
                      <strong>Duplo WO</strong>: Quando ambos os times não
                      comparecem ao jogo. Ambos os times perdem o jogo.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multiple-spaces">
                    {`Quadras: ${spaces.length}`}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {`Se o torneio ocorrer em mais de uma quadra, adione elas aqui.`}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <div className="space-y-2">
                    {spaces.map((space) => (
                      <div
                        key={space.id}
                        className="flex items-center gap-2 border-b pb-2"
                      >
                        <Label className="flex-1" htmlFor={`space-${space.id}`}>
                          {space.name}
                        </Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveSpace(space.id)}
                          disabled={spaces.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-space">Adicionar quadra</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="new-space"
                      placeholder="Nome da quadra"
                      value={spaceName}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSpace();
                        }
                      }}
                      onChange={(e) => setSpaceName(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddSpace} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {spaceError && (
                    <p className="text-sm text-destructive">{spaceError}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={isPending}
                >
                  Cancelar
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <>
                        <Button
                          type="submit"
                          disabled={isPending || spaceName !== ""}
                        >
                          Criar Torneio
                        </Button>
                      </>
                    </TooltipTrigger>
                    {spaceName !== "" && (
                      <TooltipContent>
                        <p>Quadra não foi salva</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Page>
  );
}
