"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createPremio, updatePremio } from "@/actions/reward-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RewardDto } from "@/app/api/dtos/reward.dto";

type Premio = RewardDto;

const premioSchema = z.object({
  titulo: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  descricao: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  pontos: z.coerce.number().int().positive({
    message: "Os pontos devem ser um número positivo.",
  }),
  disponivel: z.boolean().default(true),
  imagem: z.string().optional(),
});

type PremioFormValues = z.infer<typeof premioSchema>;

interface PremioFormProps {
  premio?: Premio;
}

export function PremioForm({ premio }: PremioFormProps) {
  const router = useRouter();
  const isEditing = !!premio;

  const form = useForm<PremioFormValues>({
    resolver: zodResolver(premioSchema),
    defaultValues: {
      titulo: premio?.name || "",
      descricao: premio?.description || "",
      pontos: premio?.points || 0,
      disponivel: premio?.isEnable ?? true,
      imagem: "",
    },
  });

  async function onSubmit(values: PremioFormValues) {
    try {
      if (isEditing) {
        await updatePremio(premio.id, values);
        toast.success("Prêmio atualizado com sucesso!");
      } else {
        await createPremio(values);
        toast.success("Prêmio criado com sucesso!");
      }
      router.push("/admin/premios");
      router.refresh();
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o prêmio.");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do prêmio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite a descrição do prêmio"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pontos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontos</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Quantidade de pontos necessários para resgatar este prêmio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imagem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input
                  placeholder="URL da imagem do prêmio (opcional)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                URL da imagem que representa o prêmio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disponivel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Disponibilidade</FormLabel>
                <FormDescription>
                  Determina se o prêmio está disponível para resgate.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">
          {isEditing ? "Atualizar Prêmio" : "Criar Prêmio"}
        </Button>
      </form>
    </Form>
  );
}
