import { UserRole } from "@prisma/client";

export interface UserDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly points: number;
  readonly image?: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
