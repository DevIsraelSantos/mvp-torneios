"use client";

import { usePathname } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

// TODO - refactor this with multiples pages
const PageNames = [
  {
    name: "dashboard",
    label: "Dashboard",
    link: "/dashboard",
  },
  {
    name: "admin",
    label: "Dashboard",
    link: "/dashboard",
  },
  {
    name: "submissions",
    label: "Conquistas",
    link: "/admin/submissions",
  },
  {
    name: "missions",
    label: "Missões",
    link: "/missions",
  },
  {
    name: "my-submissions",
    label: "Submissões",
    link: "/missions/my-submissions",
  },
  {
    name: "users",
    label: "Usuários",
    link: "/admin/users",
  },
] as const;

export default function Header() {
  const pathname = usePathname();

  const items = pathname.split("/").slice(1);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((path, index) => {
              const pageItem = PageNames.find((page) => page.name === path);

              if (!pageItem) return null;

              if (index < items.length - 1) {
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={pageItem.link}>
                        {pageItem.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pageItem.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
