import { auth } from "@/auth";
import { SignOut } from "@/components/sidebar/sign-out";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 justify-center items-center">
        <h1>Micro Saas de engajamento</h1>
        <pre>{JSON.stringify(session?.user, null, 2)}</pre>
        <SignOut />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://dev-israelsantos.notion.site/Engajador-Pr-mios-SaaS-1aa17f0d5d2380159ab5edee57cc1a09"
          target="_blank"
          rel="noopener noreferrer"
        >
          💡Documentação
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://dev-israelsantos.notion.site/1ab17f0d5d238057bac4f2b90e96674b?pvs=105"
          target="_blank"
          rel="noopener noreferrer"
        >
          🚀 Formulário de participação
        </a>
      </footer>
    </div>
  );
}
