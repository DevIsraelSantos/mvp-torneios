import { UserRole } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  active: boolean;
}
