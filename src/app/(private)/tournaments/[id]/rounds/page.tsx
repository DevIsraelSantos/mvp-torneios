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
import { AlertCircle, CheckCircle, Clock, Play, X } from "lucide-react";
import { use, useState } from "react";

export default function RoundsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [currentRound, setCurrentRound] = useState("1");
  const [finishGameDialogOpen, setFinishGameDialogOpen] = useState(false);
  const [woDialogOpen, setWoDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const { id } = use(params);
  // Mock data for rounds
  const rounds = {
    "1": [
      {
        id: 1,
        teamA: "Time A",
        teamB: "Time B",
        court: "Quadra 1",
        status: "waiting",
      },
      {
        id: 2,
        teamA: "Time C",
        teamB: "Time D",
        court: "Quadra 2",
        status: "in_progress",
      },
    ],
    "2": [
      {
        id: 3,
        teamA: "Time A",
        teamB: "Time C",
        court: "Quadra 1",
        status: "finished",
        score: [
          [25, 20],
          [25, 18],
          [15, 25],
          [25, 22],
        ],
      },
      {
        id: 4,
        teamA: "Time B",
        teamB: "Time D",
        court: "Quadra 2",
        status: "wo",
        winner: "Time B",
        reason: "Time D não compareceu",
      },
    ],
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

  const handleStartGame = (game: any) => {
    // Logic to start a game
    console.log("Starting game", game);
  };

  const handleFinishGame = (game: any) => {
    setSelectedGame(game);
    setFinishGameDialogOpen(true);
  };

  const handleWoOo = (game: any) => {
    setSelectedGame(game);
    setWoDialogOpen(true);
  };

  const handleSubmitScore = () => {
    // Logic to submit score
    console.log("Submitting score for game", selectedGame);
    setFinishGameDialogOpen(false);
  };

  const handleSubmitWoOo = () => {
    // Logic to submit WO/OO
    console.log("Submitting WO/OO for game", selectedGame);
    setWoDialogOpen(false);
  };

  const handleStartNextRound = () => {
    // Logic to start next round
    console.log("Starting next round");
  };

  return (
    <div className="container mx-auto py-6">
      <TournamentTabs id={id} activeTab="rounds" />

      <div className="flex justify-between items-center my-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Rodadas</h2>
          <Select value={currentRound} onValueChange={setCurrentRound}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a rodada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Rodada 1</SelectItem>
              <SelectItem value="2">Rodada 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleStartNextRound}>Iniciar Próxima Rodada</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rounds[currentRound as keyof typeof rounds]?.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Jogo #{game.id}</span>
                {getStatusBadge(game.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-4">
                <div className="text-center flex-1">
                  <div className="font-semibold text-lg">{game.teamA}</div>
                </div>
                <div className="text-center text-2xl font-bold px-4">VS</div>
                <div className="text-center flex-1">
                  <div className="font-semibold text-lg">{game.teamB}</div>
                </div>
              </div>

              {game.status === "finished" && (
                <div className="mt-2 space-y-1">
                  {game.score.map((set: number[], index: number) => (
                    <div
                      key={index}
                      className="flex justify-center gap-2 text-sm"
                    >
                      <span>Set {index + 1}:</span>
                      <span className="font-medium">
                        {set[0]} - {set[1]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {game.status === "wo" && (
                <div className="mt-2 text-center text-sm">
                  <span className="font-medium">Vencedor: {game.winner}</span>
                  <p className="text-muted-foreground">{game.reason}</p>
                </div>
              )}

              <div className="mt-4 text-sm text-muted-foreground text-center">
                {game.court}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-2 pt-0">
              {game.status === "waiting" && (
                <>
                  <Button size="sm" onClick={() => handleStartGame(game)}>
                    Iniciar Jogo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleWoOo(game)}
                  >
                    Não Jogado
                  </Button>
                </>
              )}

              {game.status === "in_progress" && (
                <Button size="sm" onClick={() => handleFinishGame(game)}>
                  Finalizar Jogo
                </Button>
              )}

              {(game.status === "finished" ||
                game.status === "wo" ||
                game.status === "oo") && (
                <Button size="sm" variant="outline">
                  Reabrir Jogo
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Finish Game Dialog */}
      <Dialog
        open={finishGameDialogOpen}
        onOpenChange={setFinishGameDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Jogo</DialogTitle>
            <DialogDescription>
              Registre o placar final do jogo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <div className="font-semibold">{selectedGame?.teamA}</div>
              </div>
              <div className="text-center px-4">VS</div>
              <div className="text-center flex-1">
                <div className="font-semibold">{selectedGame?.teamB}</div>
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
                <div className="font-semibold">{selectedGame?.teamA}</div>
              </div>
              <div className="text-center px-4">VS</div>
              <div className="text-center flex-1">
                <div className="font-semibold">{selectedGame?.teamB}</div>
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
                  <SelectItem value={selectedGame?.teamA}>
                    {selectedGame?.teamA}
                  </SelectItem>
                  <SelectItem value={selectedGame?.teamB}>
                    {selectedGame?.teamB}
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
