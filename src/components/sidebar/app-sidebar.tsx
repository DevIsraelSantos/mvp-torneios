"use client";

import { Award } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";
import Link from "next/link";
import { PointsIcon } from "../icons/points.icon";
import { Badge } from "../ui/badge";
import { RolesActions, RolesSubjects } from "@/lib/casl";
import { Can } from "@/context/casl/can";

// This is sample data.

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: Session | null;
}) {
  const currentUserPoints = 153; // TODO - Implementar o get de pontos
  // NTH - Implementar separação de milhar para os pontos

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-to-pink text-sidebar-primary-foreground">
                  <Award className="size-4" />
                </div>
                <div className="inline-flex gap-1 justify-between items-center w-full">
                  <span className="font-semibold">Engaja Prêmios</span>
                  <Can I={RolesActions.CREATE} a={RolesSubjects.ACHIEVEMENT}>
                    <Badge variant={"outline"}>
                      {`${currentUserPoints} `}
                      <PointsIcon />
                    </Badge>
                  </Can>
                  <Can I={RolesActions.MANAGE} a={RolesSubjects.USER}>
                    <Badge variant={"outline"}>{`ADMIN`}</Badge>
                  </Can>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <Can I="manage" a="Dashboard">
          <div>Criar</div>
        </Can>
        <Can I="read" a="Dashboard">
          <div>Ler</div>
        </Can> */}
        <NavMain session={session} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name ?? " ",
            email: session?.user?.email ?? " ",
            avatar: session?.user?.image ?? " ",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
