"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeIcons() {
  return (
    <>
      <Sun className="h-5 w-5 block dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block " />
    </>
  );
}

const ThemesName = {
  system: "Sistema",
  dark: "Escuro",
  light: "Claro",
};

export function ModeToggle() {
  const { setTheme, theme, themes } = useTheme();

  function handleThemeChange(selectedTheme: string): void {
    setTheme(selectedTheme);

    window.location.reload();
  }

  return (
    <DropdownMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full inline-flex justify-start items-center"
          >
            <ModeIcons />
            <span>{ThemesName[theme as keyof typeof ThemesName]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themes.map((_theme: string) => (
            <DropdownMenuItem
              key={_theme}
              onClick={() => handleThemeChange(_theme)}
            >
              {ThemesName[_theme as keyof typeof ThemesName]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenuItem>
  );
}
