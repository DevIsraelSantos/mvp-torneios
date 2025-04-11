import { AchievementStatus } from "@prisma/client";

export interface MissionDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly points: number;
  readonly isEnable: boolean;
  readonly status?: AchievementStatus; // Usado para filtrar as missões do colaborador

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
