"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import bannerImg from "@/public/assets/banner.jpg";
import Container from "./container";

const DEFAULT_TIME = 10;

export default function HeroSection({ id }: { id: string }) {
  const [countdown, setCountdown] = useState(DEFAULT_TIME);
  const [error, setError] = useState<
    "Configuration" | "AccessDenied" | "Verification" | "Default" | null
  >(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paramError = searchParams.get("error") as
      | "Configuration"
      | "AccessDenied"
      | "Verification"
      | "Default"
      | null;
    setError(paramError);
  }, [searchParams]);

  useEffect(() => {
    if (error) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const timeout = setTimeout(() => {
        // router.push(
        //   "https://dev-israelsantos.notion.site/1ab17f0d5d238057bac4f2b90e96674b?pvs=105"
        // );
      }, DEFAULT_TIME * 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [error, router]);

  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-to-green flex"
      id={id}
    >
      <AlertDialog open={!!error}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AlertDialogContent className="bg-background shadow-xl rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-400 text-center text-xl font-bold">
                Ops..
              </AlertDialogTitle>
              <AlertDialogDescription className="text-primary text-center mt-2">
                <Separator className="my-2" />
                Parece que você ainda não está cadastrado na plataforma.
                <br />
                Redirecionando para o formulário de cadastro em{" "}
                <span className="font-bold text-red-500">{countdown}s</span>
                ...
                <br />
                Se isso for um bug, reporte para o suporte.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </motion.div>
      </AlertDialog>

      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 text-primary">
            <div className="space-y-2 w-full">
              <h1 className="text-center lg:text-left text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {"Engaje seus colaboradores de maneira divertida e eficaz"}
              </h1>
              <p className="max-w-[600px] m-auto lg:m-0 text-primary md:text-xl text-center lg:text-left">
                {
                  "Impulsione a produtividade, melhore a retenção e fortaleça uma cultura organizacional positiva com nossa plataforma de engajamento leve e inovadora."
                }
              </p>
            </div>
            <div className="flex flex-col m-auto lg:m-0 gap-4 min-[400px]:flex-row">
              <Button variant="secondary" size="lg">
                <Link
                  className="flex items-center gap-2"
                  href="https://dev-israelsantos.notion.site/Engajador-Pr-mios-SaaS-1aa17f0d5d2380159ab5edee57cc1a09"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💡Documentação
                </Link>
              </Button>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1.02, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="default" size="lg" asChild>
                    <Link
                      className="flex items-center gap-2"
                      href="https://dev-israelsantos.notion.site/1ab17f0d5d238057bac4f2b90e96674b?pvs=105"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🚀 Formulário de participação
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              width={500}
              height={500}
              src={bannerImg}
              alt={"Dashboard de uma plataforma de engajamento"}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
