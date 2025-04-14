import { fetchTournaments } from "@/actions/tournament-actions";
import Page from "@/components/page";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { use } from "react";

export default function DashboardPage() {
  const tournaments = use(fetchTournaments());

  return (
    <Page>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!tournaments.length && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
            <h2 className="text-xl font-semibold">Nenhum torneio encontrado</h2>
            <p className="text-gray-500">Crie um novo torneio para começar.</p>
          </div>
        )}
        {tournaments.map((tournament) => (
          <Link href={`/tournaments/${tournament.id}`} key={tournament.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{tournament.name}</CardTitle>
                  <Badge variant={tournament.status ? "default" : "secondary"}>
                    {tournament.status ? "ABERTO" : "FECHADO"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {`Criado em ${tournament.createdAt.toLocaleDateString(
                    "pt-BR"
                  )}`}
                  <br />
                  {`Atualizado em ${tournament.updatedAt.toLocaleDateString(
                    "pt-BR"
                  )}`}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Page>
  );
}
