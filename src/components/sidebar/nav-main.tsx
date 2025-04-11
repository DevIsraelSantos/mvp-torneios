"use client";

import { Roles, RolesActions, RolesSubjects } from "@/lib/casl";
import { Gift, Map, Settings2, type LucideIcon } from "lucide-react";
import { Session } from "next-auth";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type SubItemType = {
  title: string;
  url: string;
  action: RolesActions;
  subject: RolesSubjects;
};

type ItemType = {
  title: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: Array<SubItemType>;
};

const defaultItems: Array<ItemType> = [
  {
    title: "Missões",
    icon: Map,
    isActive: true,
    items: [
      {
        title: "Mural",
        url: "/missions",
        action: RolesActions.READ,
        subject: RolesSubjects.MISSION,
      },
      {
        title: "Conquistas",
        url: "/missions/my-achievements",

        action: RolesActions.CREATE,
        subject: RolesSubjects.ACHIEVEMENT,
      },
      {
        title: "Gerenciar missões",
        url: "/admin/missions",
        action: RolesActions.MANAGE,
        subject: RolesSubjects.MISSION,
      },
      {
        title: "Gerenciar Conquistas",
        url: "/admin/achievements",
        action: RolesActions.MANAGE,
        subject: RolesSubjects.ACHIEVEMENT,
      },
    ],
  },
  {
    title: "Prêmios",
    icon: Gift,
    items: [
      {
        title: "Loja",
        url: "/rewards",
        action: RolesActions.READ,
        subject: RolesSubjects.REWARD,
      },
      {
        title: "Resgates",
        url: "/rewards/my-redemptions",
        action: RolesActions.CREATE,
        subject: RolesSubjects.REDEMPTION,
      },
      {
        title: "Gerenciar Prêmios",
        url: "/admin/rewards",
        action: RolesActions.MANAGE,
        subject: RolesSubjects.REWARD,
      },
      {
        title: "Gerenciar Resgates",
        url: "/admin/redemptions",
        action: RolesActions.MANAGE,
        subject: RolesSubjects.REDEMPTION,
      },
    ],
  },
  {
    title: "Configurações",
    icon: Settings2,
    items: [
      {
        title: "Usuários",
        url: "/admin/users",
        action: RolesActions.MANAGE,
        subject: RolesSubjects.USER,
      },
    ],
  },
];

export function NavMain({ session }: { session: Session | null }) {
  const currentUserRole =
    session?.user?.role === "ADMIN" ? "Administrador" : "Colaborador";

  const roles = Roles(session?.user?.role);

  const items = defaultItems
    .map((item) => {
      const items = item.items?.filter((subItem) =>
        roles.can(subItem.action, subItem.subject)
      );
      return { ...item, items };
    })
    .filter((item) => item.items?.length);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{currentUserRole}</SidebarGroupLabel>
      <SidebarMenu className={"gap-4"}>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <a href={subItem.url}>
                      <span>{subItem.title}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
