"use client";

import type React from "react";

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
import { InfoIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTournamentPage() {
  const router = useRouter();
  const [spaces, setSpaces] = useState([{ id: 1, name: "Quadra 1" }]);
  const [spaceName, setSpaceName] = useState("");
  const [spaceError, setSpaceError] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    // For now, we'll just redirect to the dashboard
    router.push("/dashboard");
  };

  return (
    <Page>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome do torneio</Label>
                <Input
                  id="name"
                  placeholder="Ex: Torneio de Verão sub 15"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="sets">Quantidade de sets por jogo</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="sets-format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Jogo único</SelectItem>
                    <SelectItem value="3">Melhor de 3</SelectItem>
                    <SelectItem value="5">Melhor de 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Pontuação</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="victory-points">Vitória</Label>
                    <Input
                      id="victory-points"
                      type="number"
                      min="0"
                      defaultValue="1"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="defeat-points">Derrota</Label>
                    <Input
                      id="defeat-points"
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
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Torneio</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Page>
  );
}
