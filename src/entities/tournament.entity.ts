import { Space } from "./space.entity";
import { Team } from "./team.entity";

export interface Tournament {
  id?: string;
  name?: string;
  numberOfSets?: number;
  status?: boolean;

  lossPoints?: number;
  winPoints?: number;
  spaces?: Space[];
  teams?: Team[];

  createdAt?: Date;
  updatedAt?: Date;
}
