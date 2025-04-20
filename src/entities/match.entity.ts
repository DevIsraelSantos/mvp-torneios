import { Score } from "./score.entity";
import { Space } from "./space.entity";
import { Team } from "./team.entity";

export interface Match {
  id?: string;
  tournamentId?: string;
  space?: Space;

  scores?: Array<Score>;

  teamLeft?: Team;
  teamRight?: Team;

  winner?: Team;

  createdAt?: Date;
  updatedAt?: Date;
}
