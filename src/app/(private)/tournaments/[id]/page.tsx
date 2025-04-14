"use client";

import { TournamentTabs } from "@/components/tournament-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTournament } from "@/hooks/use-tournament";
import {
  Calendar,
  CrownIcon as Court,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { tournament } = useTournament();

  return (
    <div className="container mx-auto py-6">
      <TournamentTabs id={tournament.id!} activeTab="details" />

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
                <dd>
                  {(() => {
                    switch (tournament.numberOfSets) {
                      case 1:
                        return "1 set";
                      case 3:
                        return "Melhor de 3 sets";
                      case 5:
                        return "Melhor de 5 sets";
                      default:
                        return tournament.numberOfSets + " sets";
                    }
                  })()}
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
                <dd>{tournament.winPoints} pontos</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Derrota:</dt>
                <dd>{tournament.lossPoints} pontos</dd>
              </div>
            </dl>
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
              <Badge variant="outline">{tournament.spaces?.length}</Badge>
            </div>
            <ul className="space-y-2">
              {tournament.spaces?.map((space, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Court className="h-4 w-4 text-muted-foreground" />
                  <span>{space.name}</span>
                </li>
              ))}
            </ul>
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
              <Badge variant="outline">{tournament.teams?.length}</Badge>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/tournaments/${tournament.id}/teams`)
                }
              >
                Ver Times
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
