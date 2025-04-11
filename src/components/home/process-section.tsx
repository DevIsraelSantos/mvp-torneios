"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Gift,
  Heart,
  Star,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "./container";

export default function ProcessSection({ id }: { id: string }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const steps = [
    {
      title: "Crie missões desafiadoras",
      description:
        "Os administradores podem configurar missões com diferentes níveis de dificuldade e pontos para engajar colaboradores.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      title: "Conquiste pontos",
      description:
        "Os colaboradores completam missões para acumular pontos, promovendo um ambiente competitivo saudável.",
      icon: <Star className="w-6 h-6" />,
    },
    {
      title: "Troque pontos por prêmios",
      description:
        "Com os pontos acumulados, os colaboradores podem resgatar prêmios disponíveis no catálogo.",
      icon: <Gift className="w-6 h-6" />,
    },
    {
      title: "Aprovação simplificada",
      description:
        "Os administradores validam as missões completadas e aprovam resgates de forma prática.",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    {
      title: "Acompanhe o progresso",
      description:
        "Visualize relatórios de engajamento e desempenho para entender como as missões impactam a equipe.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Aumente o engajamento",
      description:
        "Criar um ambiente mais colaborativo e motivador com missões e prêmios atrativos.",
      icon: <Heart className="w-6 h-6" />,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const section = document.getElementById(id);
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [id, hasAnimated]);

  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 bg-secondary flex"
      id={id}
    >
      <Container column>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-primary">
          {"Como Funciona"}
        </h2>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: index * 0.5,
              }}
            >
              <Card className="bg-card h-full w-full text-primary">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      {index + 1}.
                    </span>
                    <span>{step.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      {step.icon}
                    </div>
                    <p>{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
