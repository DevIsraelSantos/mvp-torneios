import { TournamentTabs } from "@/components/tournament-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { use } from "react";

export default function RankingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // Mock data for rankings
  const rankings = [
    {
      team: "Time A",
      games: 4,
      wins: 3,
      losses: 1,
      setsWon: 10,
      setsLost: 4,
      setsPlayed: 14,
      setsAverage: "71.4%",
      pointsScored: 350,
      pointsConceded: 300,
      pointsAverage: "53.8%",
    },
    {
      team: "Time B",
      games: 4,
      wins: 3,
      losses: 1,
      setsWon: 9,
      setsLost: 5,
      setsPlayed: 14,
      setsAverage: "64.3%",
      pointsScored: 340,
      pointsConceded: 310,
      pointsAverage: "52.3%",
    },
    {
      team: "Time C",
      games: 4,
      wins: 2,
      losses: 2,
      setsWon: 7,
      setsLost: 7,
      setsPlayed: 14,
      setsAverage: "50.0%",
      pointsScored: 320,
      pointsConceded: 325,
      pointsAverage: "49.6%",
    },
    {
      team: "Time D",
      games: 4,
      wins: 0,
      losses: 4,
      setsWon: 2,
      setsLost: 12,
      setsPlayed: 14,
      setsAverage: "14.3%",
      pointsScored: 280,
      pointsConceded: 355,
      pointsAverage: "44.1%",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <TournamentTabs id={id} activeTab="ranking" />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Classificação Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Posição</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>J</TableHead>
                  <TableHead>V</TableHead>
                  <TableHead>D</TableHead>
                  <TableHead>SV</TableHead>
                  <TableHead>SP</TableHead>
                  <TableHead>SJ</TableHead>
                  <TableHead>S%</TableHead>
                  <TableHead>PF</TableHead>
                  <TableHead>PS</TableHead>
                  <TableHead>P%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((team, index) => (
                  <TableRow key={team.team}>
                    <TableCell className="font-medium">{index + 1}º</TableCell>
                    <TableCell className="font-medium">{team.team}</TableCell>
                    <TableCell>{team.games}</TableCell>
                    <TableCell>{team.wins}</TableCell>
                    <TableCell>{team.losses}</TableCell>
                    <TableCell>{team.setsWon}</TableCell>
                    <TableCell>{team.setsLost}</TableCell>
                    <TableCell>{team.setsPlayed}</TableCell>
                    <TableCell>{team.setsAverage}</TableCell>
                    <TableCell>{team.pointsScored}</TableCell>
                    <TableCell>{team.pointsConceded}</TableCell>
                    <TableCell>{team.pointsAverage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>Legenda:</p>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <li>J: Jogos</li>
              <li>V: Vitórias</li>
              <li>D: Derrotas</li>
              <li>SV: Sets Vencidos</li>
              <li>SP: Sets Perdidos</li>
              <li>SJ: Sets Jogados</li>
              <li>S%: Média de Sets</li>
              <li>PF: Pontos Feitos</li>
              <li>PS: Pontos Sofridos</li>
              <li>P%: Média de Pontos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
