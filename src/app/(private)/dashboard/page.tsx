import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data for tournaments
  const tournaments = [
    { id: 1, name: "Torneio de Verão 2023", status: "active" },
    { id: 2, name: "Copa Regional", status: "active" },
    { id: 3, name: "Campeonato Municipal", status: "finished" },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Torneios</h1>
        <Link href="/tournaments/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Novo Torneio
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <Link href={`/tournaments/${tournament.id}`} key={tournament.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{tournament.name}</CardTitle>
                  <Badge
                    variant={
                      tournament.status === "active" ? "default" : "secondary"
                    }
                  >
                    {tournament.status === "active" ? "Ativo" : "Encerrado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Clique para gerenciar este torneio
                </CardDescription>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Criado em 01/01/2023
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
