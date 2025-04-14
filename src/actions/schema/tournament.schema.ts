import { z } from "zod";

export const TournamentSchema = z.object({
  id: z.string().nullable().optional(),
  name: z
    .string()
    .min(2, { message: "O título deve ter pelo menos 2 caracteres" }),
  numberOfSets: z.number(),
  winPoints: z
    .number()
    .min(0, { message: "O valor deve ser maior ou igual a 0" }),
  lossPoints: z
    .number()
    .min(0, { message: "O valor deve ser maior ou igual a 0" }),
  spaces: z.array(
    z.object({
      name: z.string(),
    })
  ),
});
