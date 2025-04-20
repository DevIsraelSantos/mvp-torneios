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
import { Match } from "@/entities/match.entity";
import { useTournament } from "@/hooks/use-tournament";
import { MatchStatus } from "@prisma/client";
import { AlertCircle, CheckCircle, Clock, Play } from "lucide-react";
import { useState } from "react";

interface Round {
  round: number;
  matches: Match[];
}

export default function RoundsPage() {
  const { tournament, match } = useTournament();
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [finishGameDialogOpen, setFinishGameDialogOpen] = useState(false);
  const [woDialogOpen, setWoDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedGame, setSelectedGame] = useState<any>(null);

  const getStatusBadge = (status?: MatchStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Aguardando
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-amber-500"
          >
            <Play className="h-3 w-3" /> Em andamento
          </Badge>
        );
      case "FINISHED":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-500"
          >
            <CheckCircle className="h-3 w-3" /> Finalizado
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStartGame = (game: any) => {
    // Logic to start a game
    console.log("Starting game", game);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinishGame = (game: any) => {
    setSelectedGame(game);
    setFinishGameDialogOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const roundsData: Array<Round> =
    tournament.matches
      ?.reduce((acc: Array<Round>, match) => {
        const round = match.round!;
        const existingRound = acc.find((r) => r.round === round);
        if (existingRound) {
          existingRound.matches.push(match);
        } else {
          acc.push({ round, matches: [match] });
        }
        return acc;
      }, [])
      .sort((a, b) => a.round - b.round)
      .map((round) => {
        return {
          round: round.round,
          matches: round.matches.sort((a, b) => {
            if (a.matchNumber && b.matchNumber) {
              return a.matchNumber - b.matchNumber;
            }
            return 0;
          }),
        };
      }) || [];

  function HeaderRounds() {
    if (roundsData.length === 0)
      return (
        <Button className="w-full" onClick={() => match.generate()}>
          Gerar tabela de rodadas
        </Button>
      );

    const currentRoundNumber =
      roundsData
        .filter((node) =>
          node.matches.some((match) => match.status !== "FINISHED")
        )
        .at(0)?.round ??
      roundsData.at(-1)?.round ??
      0;

    // if (currentRound === null) setCurrentRound(currentRoundNumber); // TODO

    return (
      <div className="flex justify-between items-center my-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Rodadas</h2>
          <Select
            value={`${currentRound}`}
            onValueChange={(value) => setCurrentRound(Number(value))}
          >
            <SelectTrigger className="w-32 md:w-50">
              <SelectValue placeholder="Selecione a rodada" />
            </SelectTrigger>
            <SelectContent>
              {roundsData.map((roundNode) => (
                <SelectItem key={roundNode.round} value={`${roundNode.round}`}>
                  <span className="hidden md:inline-flex md:mr-2">
                    {"Rodada"}
                  </span>
                  {roundNode.round + 1}
                  {roundNode.round === currentRoundNumber && (
                    <span className="text-primary font-semibold">
                      {" (Atual)"}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleStartNextRound}>Iniciar Próxima Rodada</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <TournamentTabs id={tournament.id!} activeTab="rounds" />
      <HeaderRounds />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roundsData[currentRound ?? 0]?.matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Jogo #{match.matchNumber}</span>
                {getStatusBadge(match.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-4">
                <div className="text-center flex-1">
                  <div className="font-semibold text-lg">
                    {match.teamLeft?.name}
                  </div>
                </div>
                <div className="text-center text-2xl font-bold px-4">VS</div>
                <div className="text-center flex-1">
                  <div className="font-semibold text-lg">
                    {match.teamRight?.name}
                  </div>
                </div>
              </div>

              {match.status === MatchStatus.FINISHED && (
                <div className="mt-2 space-y-1">
                  {match?.score?.map((set: number[], index: number) => (
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

              {/* {match.status === "wo" && (
                <div className="mt-2 text-center text-sm">
                  <span className="font-medium">Vencedor: {match.winner}</span>
                  <p className="text-muted-foreground">{match.reason}</p>
                </div>
              )} */}

              <div className="mt-4 text-sm text-muted-foreground text-center">
                {match.space?.name}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-2 pt-0">
              {match.status === MatchStatus.PENDING && (
                <>
                  <Button size="sm" onClick={() => handleStartGame(match)}>
                    Iniciar Jogo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleWoOo(match)}
                  >
                    Não Jogado
                  </Button>
                </>
              )}

              {match.status === MatchStatus.IN_PROGRESS && (
                <Button size="sm" onClick={() => handleFinishGame(match)}>
                  Finalizar Jogo
                </Button>
              )}

              {match.status === MatchStatus.FINISHED && (
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
