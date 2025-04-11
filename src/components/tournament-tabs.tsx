"use client"

import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TournamentTabsProps {
  id: string
  activeTab: string
}

export function TournamentTabs({ id, activeTab }: TournamentTabsProps) {
  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="details" asChild>
          <Link href={`/tournaments/${id}`}>Detalhes</Link>
        </TabsTrigger>
        <TabsTrigger value="teams" asChild>
          <Link href={`/tournaments/${id}/teams`}>Times</Link>
        </TabsTrigger>
        <TabsTrigger value="rounds" asChild>
          <Link href={`/tournaments/${id}/rounds`}>Rodadas</Link>
        </TabsTrigger>
        <TabsTrigger value="ranking" asChild>
          <Link href={`/tournaments/${id}/ranking`}>Classificação</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
