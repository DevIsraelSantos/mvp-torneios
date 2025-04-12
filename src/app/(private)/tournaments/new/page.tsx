"use client";

import type React from "react";

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
import { Switch } from "@/components/ui/switch";
import { InfoIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewTournamentPage() {
  const router = useRouter();
  const [hasTieBreak, setHasTieBreak] = useState(false);
  const [hasFinal, setHasFinal] = useState(false);
  const [hasMultipleCourts, setHasMultipleCourts] = useState(false);
  const [courts, setCourts] = useState([{ id: 1, name: "Quadra 1" }]);
  const [courtName, setCourtName] = useState("");
  const [courtError, setCourtError] = useState("");

  const handleAddCourt = () => {
    if (!courtName.trim()) {
      setCourtError("Nome da quadra não pode estar vazio");
      return;
    }

    const courtExists = courts.some(
      (court) => court.name.toLowerCase() === courtName.toLowerCase()
    );

    if (courtExists) {
      setCourtError("Já existe uma quadra com este nome");
      return;
    }

    setCourts([...courts, { id: courts.length + 1, name: courtName }]);
    setCourtName("");
    setCourtError("");
  };

  const handleRemoveCourt = (id: number) => {
    setCourts(courts.filter((court) => court.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    // For now, we'll just redirect to the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Criar Novo Torneio</h1>
        <p className="text-muted-foreground">
          Preencha os dados para criar um novo torneio
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome do torneio</Label>
                <Input
                  id="name"
                  placeholder="Ex: Torneio de Verão 2023"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="sets">Quantidade de sets por jogo</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  max="5"
                  defaultValue="3"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tiebreak">Tie-break</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilitar set de desempate
                  </p>
                </div>
                <Switch
                  id="tiebreak"
                  checked={hasTieBreak}
                  onCheckedChange={setHasTieBreak}
                />
              </div>

              {hasTieBreak && (
                <div className="grid gap-3 pl-6 border-l-2 border-muted">
                  <Label htmlFor="tiebreak-points">
                    Pontos para vencer o tie-break
                  </Label>
                  <Input
                    id="tiebreak-points"
                    type="number"
                    min="1"
                    defaultValue="15"
                    required
                  />
                </div>
              )}

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Pontuação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="victory-points">Vitória</Label>
                    <Input
                      id="victory-points"
                      type="number"
                      min="0"
                      defaultValue="3"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="defeat-points">Derrota</Label>
                    <Input
                      id="defeat-points"
                      type="number"
                      min="0"
                      defaultValue="1"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="wo-points">WO</Label>
                    <Input
                      id="wo-points"
                      type="number"
                      min="0"
                      defaultValue="0"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="oo-points">OO</Label>
                    <Input
                      id="oo-points"
                      type="number"
                      min="0"
                      defaultValue="0"
                      required
                    />
                  </div>
                </div>

                <Alert className="mt-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>O que é WO e OO?</AlertTitle>
                  <AlertDescription>
                    <p>
                      <strong>WO (Walkover)</strong>: Quando um time não
                      comparece ao jogo.
                    </p>
                    <p>
                      <strong>OO (Ocorrência Organizacional)</strong>: Quando um
                      jogo não ocorre por motivos organizacionais.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="final">Final</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilitar jogo final
                  </p>
                </div>
                <Switch
                  id="final"
                  checked={hasFinal}
                  onCheckedChange={setHasFinal}
                />
              </div>

              {hasFinal && (
                <div className="grid gap-3 pl-6 border-l-2 border-muted">
                  <Label htmlFor="final-format">Formato da final</Label>
                  <Select defaultValue="single">
                    <SelectTrigger id="final-format">
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Jogo único</SelectItem>
                      <SelectItem value="best-of-3">Melhor de 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multiple-courts">Múltiplas quadras</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilitar uso de múltiplas quadras
                  </p>
                </div>
                <Switch
                  id="multiple-courts"
                  checked={hasMultipleCourts}
                  onCheckedChange={setHasMultipleCourts}
                />
              </div>

              {hasMultipleCourts && (
                <div className="grid gap-4 pl-6 border-l-2 border-muted">
                  <div className="grid gap-3">
                    <Label htmlFor="courts-count">Número de quadras</Label>
                    <Input
                      id="courts-count"
                      type="number"
                      min="1"
                      value={courts.length}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lista de quadras</Label>
                    <div className="space-y-2">
                      {courts.map((court) => (
                        <div key={court.id} className="flex items-center gap-2">
                          <Input
                            value={court.name}
                            readOnly
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveCourt(court.id)}
                            disabled={courts.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-court">Adicionar quadra</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="new-court"
                        placeholder="Nome da quadra"
                        value={courtName}
                        onChange={(e) => setCourtName(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddCourt}
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {courtError && (
                      <p className="text-sm text-destructive">{courtError}</p>
                    )}
                  </div>
                </div>
              )}

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
    </div>
  );
}
