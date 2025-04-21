"use client";

import { finishMatchWOAction, startMatchAction } from "@/actions/match-actions";
import { TournamentTabs } from "@/components/tournament-tabs";
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
import { Match } from "@/entities/match.entity";
import { useTournament } from "@/hooks/use-tournament";
import { GameStatus, MatchStatus } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Check,
  CheckCircle,
  Clock,
  Play,
  Search,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Round {
  round: number;
  matches: Match[];
}

export default function RoundsPage() {
  const { tournament, match, getSpaces, resetTournament } = useTournament();
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [finishGameDialogOpen, setFinishGameDialogOpen] = useState(false);
  const [woDialogOpen, setWoDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [, startTransition] = useTransition();
  const [currentMatchIdOpen, setCurrentMatchIdOpen] = useState<string | null>(
    null
  );
  const [currentSpaceSelected, setCurrentSpaceSelected] = useState<
    string | null
  >(null);
  const [woOption, setWoOption] = useState<string | null>(null);

  const StatusBadge = ({ status }: { status?: MatchStatus }) => {
    switch (status) {
      case MatchStatus.PENDING:
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock />
            Aguardando
          </Badge>
        );
      case MatchStatus.IN_PROGRESS:
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Play />
            Em andamento
          </Badge>
        );
      case MatchStatus.FINISHED:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle />
            Finalizado
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleStartGame = (match: Match) => {
    setCurrentSpaceSelected(null);
    startTransition(async () => {
      const toastLoading = toast.loading("Iniciando jogo...");
      const result = await startMatchAction({
        matchId: match.id,
        spaceId: currentSpaceSelected!,
      });
      toast.dismiss(toastLoading);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      resetTournament(tournament.id!);
      toast.success(result.message);
    });
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
    setFinishGameDialogOpen(false);
  };

  const handleSubmitWo = ({
    matchId,
    winner,
  }: {
    matchId: string;
    winner: string;
  }) => {
    startTransition(async () => {
      const toastLoading = toast.loading("Finalizando jogo com WO...");
      const result = await finishMatchWOAction({
        matchId,
        winnerId: winner === "double" ? null : winner,
      });
      toast.dismiss(toastLoading);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      await resetTournament(tournament.id!);
    });
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

  const matches: Array<Match> = (
    currentRound !== null
      ? roundsData[currentRound].matches
      : roundsData.flatMap((round) => round.matches)
  ).filter((match) => {
    if (searchTerm === "") return true;
    const numberTerm = parseInt(searchTerm, 10);
    const searchTermLower = searchTerm.toLocaleLowerCase();
    if (match.matchNumber === numberTerm) {
      return true;
    }

    const left = match.teamLeft?.name?.toLocaleLowerCase();
    const right = match.teamRight?.name?.toLocaleLowerCase();

    return left?.includes(searchTermLower) || right?.includes(searchTermLower);
  });

  const currentRoundNumber =
    roundsData
      .filter((node) =>
        node.matches.some((match) => match.status !== "FINISHED")
      )
      .at(0)?.round ??
    roundsData.at(-1)?.round ??
    0;

  function HeaderScore({ match }: { match: Match }) {
    if (match.status !== MatchStatus.FINISHED) return null;
    return (
      <Card className="py-0 gap-0">
        <CardContent className="flex items-center gap-2 p-2">
          {match.gameStatus === GameStatus.DOUBLE_WO ? (
            <>
              <span className="">DUPLO WO</span>
            </>
          ) : (
            <>
              <Trophy size={16} className="text-yellow-300" />
              {match.winner?.name}{" "}
              {match.gameStatus === GameStatus.WO && "(WO)"}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <TournamentTabs id={tournament.id!} activeTab="rounds" />
      {tournament.matches?.length === 0 && (
        <>
          {tournament.teams?.length <= 1 && (
            <div className="text-center">
              <h1 className="text-xl font-semibold mb-2">
                Crie os time primeiro
              </h1>
              <p className="text-muted-foreground">
                Você precisa de pelo menos dois times para gerar a tabela de
                rodadas.
              </p>
            </div>
          )}
          {tournament.teams?.length > 1 && (
            <Button className="w-full" onClick={() => match.generate()}>
              Gerar tabela de rodadas
            </Button>
          )}
        </>
      )}
      {tournament.matches?.length !== 0 && (
        <div className="flex justify-between items-center my-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Rodadas</h2>
            <Select
              value={currentRound !== null ? `${currentRound}` : "-1"}
              onValueChange={(value) => {
                if (value === "-1") {
                  setCurrentRound(null);
                  return;
                }
                setCurrentRound(Number(value));
              }}
            >
              <SelectTrigger className="w-32 md:w-50">
                <SelectValue placeholder="Selecione a rodada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`-1`}>{"Todas"}</SelectItem>
                {roundsData.map((roundNode) => (
                  <SelectItem
                    key={roundNode.round}
                    value={`${roundNode.round}`}
                  >
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
          <div className="items-center gap-2 flex">
            <Input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56"
            />
            {searchTerm ? (
              <Trash2
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            ) : (
              <Search />
            )}
          </div>{" "}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <div className="flex items-center justify-start gap-6 flex-1">
                  <span>Jogo #{match.matchNumber}</span>
                  {match.status === MatchStatus.IN_PROGRESS && (
                    <Badge className="flex items-center gap-1">
                      {match.space?.name}
                    </Badge>
                  )}
                </div>
                <HeaderScore match={match} />

                <div className="flex-1 flex justify-end">
                  <StatusBadge status={match.status} />
                </div>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Iniciar Jogo</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Jogo #{match.matchNumber}</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center mb-4">
                          <Card className="flex-1">
                            <CardContent className="p-2">
                              <div className="text-center font-semibold">
                                {match.teamLeft?.name}
                              </div>
                            </CardContent>
                          </Card>
                          <div className="text-center px-4">VS</div>
                          <Card className="flex-1">
                            <CardContent className="p-2">
                              <div className="text-center font-semibold">
                                {match.teamRight?.name}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex flex-col gap-4">
                          <Label htmlFor="reason">
                            Selecione o local do jogo
                          </Label>
                          <RadioGroup defaultValue={currentSpaceSelected ?? ""}>
                            {getSpaces().map((space) => (
                              <div
                                key={space.id}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  onClick={(radio) => {
                                    setCurrentSpaceSelected(
                                      radio.currentTarget.value
                                    );
                                  }}
                                  value={space.id!}
                                  id={space.id}
                                  disabled={!!space.match}
                                />
                                <Label htmlFor={space.id}>
                                  {space.name}
                                  {space.match && (
                                    <Badge variant={"destructive"}>
                                      JOGO #{space.match.matchNumber}
                                    </Badge>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          size="sm"
                          onClick={() => handleStartGame(match)}
                          disabled={!currentSpaceSelected}
                        >
                          Iniciar Jogo
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    onOpenChange={(open) => {
                      if (!open) {
                        setWoOption(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWoOo(match)}
                      >
                        Não Jogado
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>WO</DialogTitle>
                        <DialogDescription>
                          Selecione o time vencedor
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center mb-4">
                          <Card className="flex-1">
                            <CardContent className="p-2">
                              <div className="text-center font-semibold">
                                {match.teamLeft?.name}
                              </div>
                            </CardContent>
                          </Card>
                          <div className="text-center px-4">VS</div>
                          <Card className="flex-1">
                            <CardContent className="p-2">
                              <div className="text-center font-semibold">
                                {match.teamRight?.name}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="winner">Time vencedor</Label>
                          <Select
                            defaultValue="null"
                            onValueChange={(value) => {
                              setWoOption(value);
                            }}
                          >
                            <SelectTrigger id="winner">
                              <SelectValue placeholder="Selecione o time vencedor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"null"} disabled>
                                {"Selecionar"}
                              </SelectItem>
                              <SelectItem value={match.teamLeft!.id!}>
                                {match.teamLeft?.name}
                              </SelectItem>
                              <SelectItem value={match.teamRight!.id!}>
                                {match.teamRight?.name}
                              </SelectItem>
                              <SelectItem value={"double"}>
                                {"DUPLO WO"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="destructive"
                          disabled={
                            !(
                              woOption === "double" ||
                              woOption === match.teamLeft?.id ||
                              woOption === match.teamRight?.id
                            )
                          }
                          onClick={() => {
                            handleSubmitWo({
                              matchId: match.id!,
                              winner: woOption!,
                            });
                          }}
                        >
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {match.status === MatchStatus.IN_PROGRESS && (
                <Button
                  size="sm"
                  variant={"destructive"}
                  onClick={() => handleFinishGame(match)}
                >
                  Finalizar Jogo
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
    </div>
  );
}
