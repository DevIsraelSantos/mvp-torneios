"use client";

import { TournamentTabs } from "@/components/tournament-tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Team } from "@/entities/team.entity";
import { useTournament } from "@/hooks/use-tournament";
import { Pen, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TeamsPage() {
  const { tournament, team: teamActions } = useTournament();
  const [newTeam, setNewTeam] = useState({ name: "", players: [""] });
  const [editTeamId, setEditTeamId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddPlayer = () => {
    setNewTeam({
      ...newTeam,
      players: [...newTeam.players, ""],
    });
  };

  const handleRemovePlayer = (index: number) => {
    setNewTeam({
      ...newTeam,
      players: newTeam.players.filter((_, i) => i !== index),
    });
  };

  const handlePlayerChange = (index: number, value: string) => {
    const updatedPlayers = [...newTeam.players];
    updatedPlayers[index] = value;
    setNewTeam({
      ...newTeam,
      players: updatedPlayers,
    });
  };

  const handleSubmit = () => {
    // Filter out empty player names
    const filteredPlayers = newTeam.players.filter(
      (name) => name.trim() !== ""
    );

    if (newTeam.name.trim() === "" || filteredPlayers.length === 0) {
      return;
    }

    // Check if team name already exists
    const teamExists = tournament.teams.some(
      (team) => team.name === newTeam.name
    );
    if (teamExists) {
      toast(`🔴 Já existe um time chamdo ${newTeam.name}`);
      return;
    }

    teamActions.add({
      name: newTeam.name,
      players: filteredPlayers,
    });

    setNewTeam({ name: "", players: [""] });
    setDialogOpen(false);
  };

  const handleEditSubmit = () => {
    // Filter out empty player names
    const filteredPlayers = newTeam.players.filter(
      (name) => name.trim() !== ""
    );

    if (newTeam.name.trim() === "" || filteredPlayers.length === 0) {
      return;
    }

    // Check if team name already exists
    const teamExists = tournament.teams.some(
      (team) =>
        team.name.toLocaleLowerCase().trim() ===
          newTeam.name.toLocaleLowerCase().trim() && team.id !== editTeamId
    );

    if (teamExists) {
      toast(`🔴 Já existe um time chamdo ${newTeam.name}`);
      return;
    }

    teamActions.update(editTeamId!, {
      name: newTeam.name,
      players: filteredPlayers,
    });

    setNewTeam({ name: "", players: [""] });
    setDialogOpen(false);
    setEditTeamId(null);
  };

  const teamsFiltered: Team[] = tournament.teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.players.some((player) =>
        player.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <TournamentTabs id={tournament.id!} activeTab="teams" />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex gap-4 justify-center items-center w-fit">
          Times
          <Badge variant="outline" className="text-base">
            {tournament.teams?.length}
          </Badge>
          <div className="items-center gap-2 hidden md:flex">
            <Input
              type="text"
              placeholder="Pesquisar times ou jogadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60"
            />
            {searchTerm ? (
              <Trash2
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            ) : (
              <Search />
            )}
          </div>
        </h2>

        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Time
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Time</DialogTitle>
                <DialogDescription>
                  Preencha os dados do time e seus jogadores
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="team-name">Nome do time</Label>
                  <Input
                    id="team-name"
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                    placeholder="Ex: Time A"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Jogadores</Label>
                  {newTeam.players.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={player}
                        onChange={(e) =>
                          handlePlayerChange(index, e.target.value)
                        }
                        placeholder={`Jogador ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemovePlayer(index)}
                        disabled={newTeam.players.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPlayer}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Jogador
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>Adicionar Time</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <Input
          type="text"
          placeholder="Pesquisar times ou jogadores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm ? (
          <Trash2
            className="cursor-pointer"
            onClick={() => setSearchTerm("")}
          />
        ) : (
          <Search />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamsFiltered.map((team) => (
          <Card key={team.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-semibold">{team.name}</span>
                <div className="flex justify-between gap-2 items-center">
                  <Dialog
                    open={editTeamId === team.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditTeamId(null);
                        setNewTeam({ name: "", players: [""] });
                      }

                      if (open) {
                        setNewTeam({ name: team.name, players: team.players });
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        size="icon"
                        onClick={() => setEditTeamId(team.id!)}
                      >
                        <Pen />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Editar time{" "}
                          <span className="font-bold text-destructive">
                            {team.name}
                          </span>
                        </DialogTitle>
                        <DialogDescription>
                          Edite os dados do time e seus jogadores
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="team-name">Nome do time: </Label>
                          <Input
                            id="team-name"
                            value={newTeam.name}
                            onChange={(e) =>
                              setNewTeam({ ...newTeam, name: e.target.value })
                            }
                            placeholder="Ex: Time A"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Jogadores</Label>
                          {newTeam.players.map((player, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={player}
                                onChange={(e) =>
                                  handlePlayerChange(index, e.target.value)
                                }
                                placeholder={`Jogador ${index + 1}`}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemovePlayer(index)}
                                disabled={newTeam.players.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddPlayer}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Jogador
                          </Button>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditTeamId(null);
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleEditSubmit}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant={"destructive"} size="icon">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Tem certeza que deseja apagar o time{" "}
                          <span className="font-bold text-destructive">
                            {team.name}
                          </span>
                          ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Todos os dados
                          associados a este time serão perdidos.
                          <br />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          variant={"destructive"}
                          onClick={() => {
                            teamActions.remove(team.id!);
                          }}
                        >
                          APAGAR
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-2 mb-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Jogadores </span>
                  <Badge variant={"outline"}>{team.players.length}</Badge>
                </div>
                <Badge className="justify-self-end">
                  {team.players.length} jogadores
                </Badge>
              </div>
              <Separator className="mb-2" />
              <ul className="space-y-1">
                {team.players.map((player, index) => (
                  <li key={index} className="text-sm">
                    {player}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
