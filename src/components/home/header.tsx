import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Container from "./container";
import Icon from "@/public/assets/icon.png";
import { ThemeToggle } from "@/components/theme-toggle";
import SignIn from "./button-login";

export default function Header() {
  const menuOptions: Array<{
    label: string;
    href: string;
    className?: string;
  }> = [
    {
      label: "Início",
      href: "#home",
    },
    {
      label: "Como funciona",
      href: "#howItWorks",
    },
    {
      label: "Funcionalidades",
      href: "#features",
    },
    {
      label: "Sobre",
      href: "#footer",
    },
  ];

  return (
    <header className="w-full sticky top-0 z-50 flex shadow-md h-fit md:h-0">
      <Container className="h-20 bg-background rounded-b-2xl">
        <Link href="#home" className="flex items-center space-x-4 select-none">
          <Image src={Icon} alt="Logo" width={40} height={40} />
          <span className="font-bold text-xl">{"Engaja Prêmios"}</span>
        </Link>
        <nav className="hidden md:flex space-x-4 lg:space-x-6">
          {menuOptions.map((option, i) => (
            <Link
              key={i}
              href={option.href}
              className={cn(
                "text-sm font-medium hover:text-primary transition-colors select-none",
                option.className
              )}
            >
              {option.label}
            </Link>
          ))}
        </nav>
        <div className="inline-flex justify-end gap-4 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu size={24} />
                <span className="sr-only">{'t("spanMenu")'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={"top"}>
              <SheetHeader>
                <SheetTitle>{"Engaja Prêmios"}</SheetTitle>
              </SheetHeader>
              <SheetDescription className="mt-4 flex flex-col gap-4">
                {menuOptions.map((option, i) => (
                  <SheetClose key={i} asChild>
                    <Link
                      key={i}
                      href={option.href}
                      className="text-center text-xl w-full select-none"
                    >
                      {option.label}
                    </Link>
                  </SheetClose>
                ))}
              </SheetDescription>
            </SheetContent>
          </Sheet>
          <SignIn />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
