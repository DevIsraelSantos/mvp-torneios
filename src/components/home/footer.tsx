import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Container from "./container";

export default function Footer({ id }: { id: string }) {
  const menuItems: Array<{
    title: string;
    href?: string;
    className?: string;
    items: Array<{
      title: string;
      href?: string;
      className?: string;
    }>;
  }> = [
    {
      title: "Sobre",
      items: [
        {
          title: "📃 Conheça nosso notion",
          href: "https://dev-israelsantos.notion.site/Engajador-Pr-mios-SaaS-1aa17f0d5d2380159ab5edee57cc1a09",
        },
        {
          title: "🚀 Formulário de participação",
          href: "https://dev-israelsantos.notion.site/1ab17f0d5d238057bac4f2b90e96674b?pvs=105",
        },
      ],
    },

    {
      title: "Contato",
      items: [
        {
          title: "✉️ dev.israelsantos@gmail.com",
          href: `mailto:${"dev.israelsantos@gmail.com"}`,
        },
        {
          title: "📲 Fale com a gente no WhatsApp",
          href: `https://api.whatsapp.com/send?phone=${encodeURIComponent(
            "15997004689"
          )}&text=${encodeURIComponent(
            "Olá! 👋 Vi seu MVP e gostaria de saber mais detalhes. Poderia me ajudar?"
          )}`,
        },
      ],
    },
  ];

  return (
    <footer className="w-full py-6 bg-background text-primary flex" id={id}>
      <Container className="">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((menu, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-lg font-semibold">{menu.title}</h4>
                <ul className="space-y-2">
                  {menu.items.map((item, j) => (
                    <li key={j}>
                      <Link
                        href={item.href ?? ""}
                        className={cn("hover:underline", item.className)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {menuItems.length - 1 !== i && (
                  <Separator className="md:hidden block" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-secondary pt-6 text-center">
            <p>{"© 2025 DevIsraelSantos. Todos os direitos reservados."}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
