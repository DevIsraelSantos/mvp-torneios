import { TournamentCategories } from "@prisma/client";
import { Space } from "./space.entity";
import { Team } from "./team.entity";
import { Match } from "./match.entity";

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

  matches?: Match[];

  createdAt?: Date;
  updatedAt?: Date;
}
