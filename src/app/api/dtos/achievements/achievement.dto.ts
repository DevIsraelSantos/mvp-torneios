import { AchievementStatus } from "@prisma/client";
import { MissionDto } from "../missions/mission.dto";

export interface AchievementDto {
  id: string;
  evidence: string;
  creator: {
    id: string;
    name: string;
  };
  reviewer?: {
    id: string;
    name: string;
  };
  mission: MissionDto;
  feedback?: string;
  status: AchievementStatus;
  createdAt: Date;
  updatedAt: Date;
}
