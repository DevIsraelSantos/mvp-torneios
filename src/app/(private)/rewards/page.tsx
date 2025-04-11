import { RewardDto } from "@/app/api/dtos/rewards/reward.dto";
import { PremioCard } from "@/components/rewards/rewards-card";

export default async function PremiosPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const premios: any = [];

  const user = {
    id: "123",
    pontos: 50,
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prêmios Disponíveis</h1>
        <p className="text-muted-foreground">
          Você possui{" "}
          <span className="font-bold">{user?.pontos || 0} pontos</span> para
          resgatar
        </p>
      </div>

      {premios.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">
            Nenhum prêmio disponível no momento
          </h2>
          <p className="text-muted-foreground">
            Volte mais tarde para verificar novos prêmios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premios.map((premio: RewardDto) => (
            <PremioCard
              key={premio.id}
              premio={premio}
              userPoints={user?.pontos || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
