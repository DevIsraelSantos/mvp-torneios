"use server";

import { AchievementListDto } from "@/app/api/dtos/achievements/achievement-list.dto";
import { AchievementDto } from "@/app/api/dtos/achievements/achievement.dto";
import { MessageDto } from "@/app/api/dtos/message.dto";
import { MissionListDto } from "@/app/api/dtos/missions/mission-list.dto";
import { MissionDto } from "@/app/api/dtos/missions/mission.dto";
import { bff } from "@/lib/bff-instance";
import { CatchHandler } from "@/lib/catch-handler";
import { MissionAchievement, MissionStatusEnum } from "@/lib/definitions";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const missions: MissionDto[] = [];
const submissions: MissionAchievement[] = [];

// Schema de validação para missão
const MissionSchema = z.object({
  id: z.string().nullable().optional(),
  name: z
    .string()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  points: z.coerce
    .number()
    .min(1, { message: "Os pontos devem ser maiores que 0" }),
  status: z.enum(["active", "inactive"]),
});

// Schema de validação para submissão
const SubmissionSchema = z.object({
  missionId: z.string(),
  evidence: z
    .string()
    .min(5, { message: "A evidência deve ter pelo menos 5 caracteres" }),
});

// Schema de validação para avaliação de submissão
const EvaluationSchema = z.object({
  submissionId: z.string(),
  status: z.enum(["approved", "rejected"]),
  feedback: z.string().optional(),
});

// Ação para criar ou atualizar uma missão
export async function createOrUpdateMissionAction(
  prevState: unknown,
  formData: FormData
) {
  const validatedFields = MissionSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    points: formData.get("points"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Falha ao salvar a missão.",
    };
  }

  const { id, name, description, points, status } = validatedFields.data;

  try {
    const isNewMission = !id;
    if (isNewMission) {
      await bff.post<MissionDto>("/missions", {
        name,
        description,
        points,
        isEnable: status === "active",
      });
    }

    if (!isNewMission) {
      await bff.patch<MissionDto>(`/missions/${id}`, {
        name,
        description,
        points,
        isEnable: status === "active",
      });
    }

    revalidatePath("/admin/missions");
    return { success: true, message: "Missão salva com sucesso!" };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      CatchHandler(error);
      if (error.response?.data.message) {
        return {
          message: error.response?.data.message,
        };
      }
    }
    return {
      message: "Erro ao salvar a missão. Por favor, tente novamente.",
    };
  }
}

// Ação para deletar uma missão
export async function deleteMissionAction(id: string): Promise<string> {
  try {
    const { data } = await bff.delete<MessageDto>(`/missions/${id}`);

    revalidatePath("/admin/missions");
    return data?.message || "Missão deletada com sucesso!";
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      CatchHandler(error);
      if (error.response?.data.message) {
        return error.response?.data.message;
      }
    }
    return "❗Erro ao deletar a missão. Por favor, tente novamente.";
  }
}

// Ação para submeter evidência para uma missão
export async function submitMissionEvidence(
  prevState: unknown,
  formData: FormData
) {
  const validatedFields = SubmissionSchema.safeParse({
    missionId: formData.get("missionId"),
    evidence: formData.get("evidence"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Falha ao submeter evidência.",
    };
  }

  const { missionId, evidence } = validatedFields.data;

  try {
    await bff.post<MissionDto>("/achievements", {
      missionId,
      evidence,
    });

    revalidatePath("/missions");
    return { success: true, message: "✅ Conquista solicitada!" };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      CatchHandler(error);
      if (error.response?.data.message) {
        return {
          message: error.response?.data.message,
        };
      }
    }
    return {
      message: "! Erro ao salvar a missão. Por favor, tente novamente.",
    };
  }
}

// Ação para avaliar uma submissão (aprovar ou rejeitar)
export async function evaluateSubmission(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  const validatedFields = EvaluationSchema.safeParse({
    submissionId: formData.get("submissionId"),
    status: formData.get("status"),
    feedback: formData.get("feedback"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Falha ao avaliar submissão.",
    };
  }

  const { submissionId, status, feedback } = validatedFields.data;

  try {
    const index = submissions.findIndex((s) => s.id === submissionId);
    if (index !== -1) {
      submissions[index] = {
        ...submissions[index],
        status,
        feedback: feedback || "",
        updatedAt: new Date(),
      };

      // Se aprovado, adicionar pontos ao usuário
      if (status === "approved") {
        const mission = missions.find(
          (m) => m.id === submissions[index].missionId
        );
        if (mission) {
          // Em produção, atualize os pontos do usuário no banco de dados
          console.log(
            `Adicionados ${mission.points} pontos ao usuário ${submissions[index].userId}`
          );
        }
      }
    }

    revalidatePath("/admin/submissions");
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      message: "Erro ao avaliar submissão. Por favor, tente novamente.",
    };
  }
}

// Ação para obter todas as missões (Com ou sem filtro de status)
export async function getMissions(
  status?: MissionStatusEnum
): Promise<MissionDto[]> {
  try {
    const { data } = await bff.get<MissionListDto>(`/missions`, {
      params: { status },
    });

    return data.missions || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      CatchHandler(error);
      if (error.response?.data.message) {
        return [];
      }
    }
    return [];
  }
}

// Ação para obter uma missão específica
export async function getMission(id: string): Promise<MissionDto | null> {
  const m = missions.find((m) => m.id === id);
  if (!m) {
    return null;
  }
  return {
    id: m.id,
    name: m.name,
    description: m.description,
    points: m.points,
    isEnable: m.isEnable,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

// Ação para obter todas as submissões (Com ou sem filtro de status)
export async function getAchievements(): Promise<{
  achievements: AchievementDto[];
  error?: string;
}> {
  try {
    const { data } = await bff.get<AchievementListDto>(`/achievements`);

    return { achievements: data.achievements };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      CatchHandler(error);
      return {
        achievements: [],
        error:
          error.response?.data.message ||
          "Erro ao obter as conquistas. Por favor, tente novamente.",
      };
    }
    console.log(error);

    return {
      achievements: [],
      error: "Erro ao obter as conquistas. Por favor, tente novamente.",
    };
  }
}

// Ação para obter todas as submissões de um usuário
export async function getUserSubmissions(userId: string) {
  return submissions.filter((s) => s.userId === userId);
}
