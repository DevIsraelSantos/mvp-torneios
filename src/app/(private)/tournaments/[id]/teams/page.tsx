"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { TournamentTabs } from "@/components/tournament-tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function TeamsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Time A",
      players: ["João Silva", "Maria Oliveira", "Pedro Santos"],
    },
    {
      id: 2,
      name: "Time B",
      players: ["Ana Costa", "Carlos Ferreira", "Lúcia Pereira"],
    },
  ])

  const [newTeam, setNewTeam] = useState({ name: "", players: [""] })
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddPlayer = () => {
    setNewTeam({
      ...newTeam,
      players: [...newTeam.players, ""],
    })
  }

  const handleRemovePlayer = (index: number) => {
    setNewTeam({
      ...newTeam,
      players: newTeam.players.filter((_, i) => i !== index),
    })
  }

  const handlePlayerChange = (index: number, value: string) => {
    const updatedPlayers = [...newTeam.players]
    updatedPlayers[index] = value
    setNewTeam({
      ...newTeam,
      players: updatedPlayers,
    })
  }

  const handleSubmit = () => {
    // Filter out empty player names
    const filteredPlayers = newTeam.players.filter((name) => name.trim() !== "")

    if (newTeam.name.trim() === "" || filteredPlayers.length === 0) {
      return // Don't add empty teams
    }

    setTeams([
      ...teams,
      {
        id: teams.length + 1,
        name: newTeam.name,
        players: filteredPlayers,
      },
    ])

    // Reset form
    setNewTeam({ name: "", players: [""] })
    setDialogOpen(false)
  }

  const handleGenerateSchedule = () => {
    if (teams.length < 2) {
      alert("É necessário ter pelo menos 2 times para gerar a tabela de jogos.")
      return
    }

    router.push(`/tournaments/${params.id}/rounds`)
  }

  return (
    <div className="container mx-auto py-6">
      <DashboardHeader />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Torneio de Verão 2023</h1>
        <p className="text-muted-foreground">Gerenciamento de times</p>
      </div>

      <TournamentTabs id={params.id} activeTab="teams" />

      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold">Times</h2>
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
                <DialogDescription>Preencha os dados do time e seus jogadores</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="team-name">Nome do time</Label>
                  <Input
                    id="team-name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="Ex: Time A"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Jogadores</Label>
                  {newTeam.players.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={player}
                        onChange={(e) => handlePlayerChange(index, e.target.value)}
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
                  <Button type="button" variant="outline" size="sm" onClick={handleAddPlayer} className="mt-2">
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

          <Button onClick={handleGenerateSchedule} disabled={teams.length < 2}>
            Gerar Tabela de Jogos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>{team.name}</span>
                <Badge>{team.players.length} jogadores</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Jogadores</span>
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
  )
}
