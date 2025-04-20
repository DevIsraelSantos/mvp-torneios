import { Score } from "./score.entity";
import { Team } from "./team.entity";

export interface Match {
  id?: string;
  tournamentId?: string;

  scores?: Array<Score>;

  teamLeft?: Team;
  teamRight?: Team;

  winner?: Team;

  createdAt?: Date;
  updatedAt?: Date;
}
