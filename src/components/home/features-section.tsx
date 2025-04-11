"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CheckSquare,
  Clock,
  Gift,
  ListChecks,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "./container";

export default function FeaturesSection({ id }: { id: string }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const features = [
    {
      title: "Gestão de Missões",
      description:
        "Permite a criação, edição e inativação de missões com título, descrição e pontuação personalizada.",
      icon: <ListChecks className="w-6 h-6" />,
    },
    {
      title: "Sistema de Prêmios",
      description:
        "Administradores podem configurar prêmios com diferentes valores de pontos e gerenciar sua disponibilidade.",
      icon: <Gift className="w-6 h-6" />,
    },
    {
      title: "Aprovação de Conquistas",
      description:
        "Valide as missões completadas pelos colaboradores para garantir que os pontos sejam distribuídos corretamente.",
      icon: <CheckSquare className="w-6 h-6" />,
    },
    {
      title: "Login com Gmail",
      description:
        "Facilite o acesso com login seguro via OAuth do Gmail, evitando cadastros complicados.",
      icon: <Mail className="w-6 h-6" />,
    },
    {
      title: "Histórico de Atividades",
      description:
        "Permite que os administradores visualizem o histórico de missões e prêmios de cada colaborador.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Relatórios de Engajamento",
      description:
        "Obtenha insights detalhados sobre missões mais populares e níveis de participação dos colaboradores.",
      icon: <BarChart3 className="w-6 h-6" />,
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
      className="w-full py-12 md:py-24 lg:py-32 flex bg-secondary text-primary"
      id={id}
    >
      <Container column>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          {"Funcionalidades"}
        </h2>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
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
              <Card className="h-full w-full bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      {index + 1}.
                    </span>
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      {feature.icon}
                    </div>
                    <p>{feature.description}</p>
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
