"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar, CrownIcon as Court, MapPin, Trophy, Users } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function TournamentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [confirmEndDialogOpen, setConfirmEndDialogOpen] = useState(false)

  // Mock tournament data
  const tournament = {
    id: params.id,
    name: "Torneio de Verão 2023",
    status: "active",
    teams: 4,
    courts: 2,
    sets: 3,
    tieBreak: true,
    tieBreakPoints: 15,
    scoring: {
      victory: 3,
      defeat: 1,
      wo: 0,
      oo: 0,
    },
    hasFinal: true,
    finalFormat: "single",
    courtsList: ["Quadra 1", "Quadra 2"],
  }

  const handleEndTournament = () => {
    // Logic to end tournament
    console.log("Ending tournament", tournament.id)
    setConfirmEndDialogOpen(false)
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto py-6">
      <DashboardHeader />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tournament.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={tournament.status === "active" ? "default" : "secondary"}>
              {tournament.status === "active" ? "Ativo" : "Encerrado"}
            </Badge>
          </div>
        </div>

        {tournament.status === "active" && (
          <Dialog open={confirmEndDialogOpen} onOpenChange={setConfirmEndDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Encerrar Torneio</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Encerrar Torneio</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja encerrar este torneio? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>Após encerrado, todas as telas ficarão em modo somente leitura.</AlertDescription>
              </Alert>

              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmEndDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleEndTournament}>
                  Encerrar Torneio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <TournamentTabs id={params.id} activeTab="details" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium">Quantidade de sets:</dt>
                <dd>{tournament.sets}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Tie-break:</dt>
                <dd>{tournament.tieBreak ? `Sim (${tournament.tieBreakPoints} pontos)` : "Não"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Final:</dt>
                <dd>
                  {tournament.hasFinal ? (tournament.finalFormat === "single" ? "Jogo único" : "Melhor de 3") : "Não"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pontuação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium">Vitória:</dt>
                <dd>{tournament.scoring.victory} pontos</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Derrota:</dt>
                <dd>{tournament.scoring.defeat} pontos</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">WO:</dt>
                <dd>{tournament.scoring.wo} pontos</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">OO:</dt>
                <dd>{tournament.scoring.oo} pontos</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total de times:</span>
              <Badge variant="outline">{tournament.teams}</Badge>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/tournaments/${params.id}/teams`)}
              >
                Ver Times
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Quadras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total de quadras:</span>
              <Badge variant="outline">{tournament.courts}</Badge>
            </div>
            <ul className="space-y-2">
              {tournament.courtsList.map((court, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Court className="h-4 w-4 text-muted-foreground" />
                  <span>{court}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
