"use client";
import Page from "@/components/page";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function PageLogout() {
  useEffect(() => {
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/home" });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Page>
      <div className="bg-background h-screen flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-6xl mb-4" />
        <h1 className="animate-bounce text-2xl">Saindo...</h1>
      </div>
    </Page>
  );
}
