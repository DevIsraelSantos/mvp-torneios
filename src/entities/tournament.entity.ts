import { TournamentCategories } from "@prisma/client";
import { Space } from "./space.entity";
import { Team } from "./team.entity";

export interface Tournament {
  id?: string;
  name?: string;
  numberOfSets?: number;
  category: TournamentCategories;
  status?: boolean;

  hasStarted?: boolean;

  lossPoints?: number;
  winPoints?: number;
  spaces: Space[];
  teams: Team[];

  createdAt?: Date;
  updatedAt?: Date;
}
