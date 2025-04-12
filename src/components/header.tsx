"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header({ session }: { session: Session | null }) {
  const path = usePathname();
  const isDashboard = path === "/dashboard";

  function NewTournamentButton() {
    return (
      <Link href="/tournaments/new">
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Criar Novo Torneio
        </Button>
      </Link>
    );
  }

  function GoBackButton() {
    return (
      <Link href="/dashboard">
        <Button size="sm" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </Link>
    );
  }

  return (
    <header className="flex justify-between items-center border-b pb-2">
      <Link href="/dashboard">
        <h1 className="text-2xl font-bold">
          {isDashboard ? "Meus torneios" : "Torneio"}
        </h1>
      </Link>

      <div className="flex items -center gap-4 justify-end">
        {isDashboard && <NewTournamentButton />}
        {!isDashboard && <GoBackButton />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt="@user" />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: "/home",
                })
              }
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
