"use client";

import { TournamentTabs } from "@/components/tournament-tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Clock, Play, Trophy, X } from "lucide-react";
import { useState } from "react";

export default function FinalsPage({ params }: { params: { id: string } }) {
  const [finishGameDialogOpen, setFinishGameDialogOpen] = useState(false);
  const [woDialogOpen, setWoDialogOpen] = useState(false);

  // Mock data for final
  const finalGame = {
    id: 10,
    teamA: "Time A",
    teamB: "Time B",
    court: "Quadra Principal",
    status: "waiting", // waiting, in_progress, finished, wo, oo
    score: null,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Aguardando
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-amber-500"
          >
            <Play className="h-3 w-3" /> Em andamento
          </Badge>
        );
      case "finished":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-500"
          >
            <CheckCircle className="h-3 w-3" /> Finalizado
          </Badge>
        );
      case "wo":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <X className="h-3 w-3" /> WO
          </Badge>
        );
      case "oo":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> OO
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleStartGame = () => {
    // Logic to start the final game
    console.log("Starting final game");
  };

  const handleFinishGame = () => {
    setFinishGameDialogOpen(true);
  };

  const handleWoOo = () => {
    setWoDialogOpen(true);
  };

  const handleSubmitScore = () => {
    // Logic to submit score
    console.log("Submitting score for final game");
    setFinishGameDialogOpen(false);
  };

  const handleSubmitWoOo = () => {
    // Logic to submit WO/OO
    console.log("Submitting WO/OO for final game");
    setWoDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <TournamentTabs id={params.id} activeTab="finals" />

      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Final
        </h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Jogo Final</span>
            {getStatusBadge(finalGame.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center py-6">
            <div className="text-center flex-1">
              <div className="font-semibold text-xl">{finalGame.teamA}</div>
            </div>
            <div className="text-center text-3xl font-bold px-6">VS</div>
            <div className="text-center flex-1">
              <div className="font-semibold text-xl">{finalGame.teamB}</div>
            </div>
          </div>

          {finalGame.status === "finished" && finalGame.score && (
            <div className="mt-4 space-y-2">
              {finalGame.score.map((set: number[], index: number) => (
                <div key={index} className="flex justify-center gap-2">
                  <span>Set {index + 1}:</span>
                  <span className="font-medium">
                    {set[0]} - {set[1]}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-sm text-muted-foreground text-center">
            {finalGame.court}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-2 pt-0 pb-6">
          {finalGame.status === "waiting" && (
            <>
              <Button onClick={handleStartGame}>Iniciar Jogo</Button>
              <Button variant="outline" onClick={handleWoOo}>
                Não Jogado
              </Button>
            </>
          )}

          {finalGame.status === "in_progress" && (
            <Button onClick={handleFinishGame}>Finalizar Jogo</Button>
          )}

          {(finalGame.status === "finished" ||
            finalGame.status === "wo" ||
            finalGame.status === "oo") && (
            <Button variant="outline">Reabrir Jogo</Button>
          )}
        </CardFooter>
      </Card>

      {/* Finish Game Dialog */}
      <Dialog
        open={finishGameDialogOpen}
        onOpenChange={setFinishGameDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Jogo Final</DialogTitle>
            <DialogDescription>
              Registre o placar final do jogo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <div className="font-semibold">{finalGame.teamA}</div>
              </div>
              <div className="text-center px-4">VS</div>
              <div className="text-center flex-1">
                <div className="font-semibold">{finalGame.teamB}</div>
              </div>
            </div>

            {[1, 2, 3].map((set) => (
              <div key={set} className="grid grid-cols-3 gap-4 items-center">
                <div className="space-y-2">
                  <Label htmlFor={`set-${set}-team-a`}>Set {set}</Label>
                  <Input
                    id={`set-${set}-team-a`}
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-center items-center pt-6">
                  <span>x</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`set-${set}-team-b`} className="sr-only">
                    Set {set} Time B
                  </Label>
                  <Input
                    id={`set-${set}-team-b`}
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}

            {/* Tie-break set (optional) */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="set-4-team-a">Set 4 (Tie-break)</Label>
                <Input
                  id="set-4-team-a"
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-center items-center pt-6">
                <span>x</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="set-4-team-b" className="sr-only">
                  Set 4 Time B
                </Label>
                <Input
                  id="set-4-team-b"
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinishGameDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmitScore}>Confirmar Resultado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WO/OO Dialog */}
      <Dialog open={woDialogOpen} onOpenChange={setWoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Marcar como WO ou OO</DialogTitle>
            <DialogDescription>
              Selecione o motivo pelo qual o jogo não foi realizado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <div className="font-semibold">{finalGame.teamA}</div>
              </div>
              <div className="text-center px-4">VS</div>
              <div className="text-center flex-1">
                <div className="font-semibold">{finalGame.teamB}</div>
              </div>
            </div>

            <RadioGroup defaultValue="wo">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wo" id="wo" />
                <Label htmlFor="wo">WO (Walkover)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oo" id="oo" />
                <Label htmlFor="oo">OO (Ocorrência Organizacional)</Label>
              </div>
            </RadioGroup>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>O que é WO e OO?</AlertTitle>
              <AlertDescription>
                <p>
                  <strong>WO (Walkover)</strong>: Quando um time não comparece
                  ao jogo.
                </p>
                <p>
                  <strong>OO (Ocorrência Organizacional)</strong>: Quando um
                  jogo não ocorre por motivos organizacionais.
                </p>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                placeholder="Descreva o motivo pelo qual o jogo não foi realizado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winner">Time vencedor (apenas para WO)</Label>
              <Select>
                <SelectTrigger id="winner">
                  <SelectValue placeholder="Selecione o time vencedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={finalGame.teamA}>
                    {finalGame.teamA}
                  </SelectItem>
                  <SelectItem value={finalGame.teamB}>
                    {finalGame.teamB}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitWoOo}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
