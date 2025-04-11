export const TIME_TO_ENABLE_DELETE_BUTTON = 3;

// Tipos para o sistema de missões
export enum MissionStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ALL = "all",
}

export enum MissionViewStatusEnum {
  ALL = "all", // All missions
  AVAILABLE = "available", // Missions available to the user
  ACHIEVED = "achieved", // Achieved by the user
  DENIED = "denied", // Denied by the admin
  PENDING = "pending", // Attempted in review of the admin
}

export type AchievementStatus = "pending" | "approved" | "rejected";

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  status: MissionStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface MissionAchievement {
  id: string;
  missionId: string;
  userId: string;
  evidence: string;
  status: AchievementStatus;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "collaborator";
  points: number;
  createdAt: Date;
}
