"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface SignOutHandlerProps {
  redirectToHome: boolean;
}

export const SignOutHandler = ({ redirectToHome }: SignOutHandlerProps) => {
  const router = useRouter();

  useEffect(() => {
    if (redirectToHome) {
      signOut();
      router.push("/home");
    }
  }, [redirectToHome, router]);

  return null;
};
