import { MatchStatus, GameStatus } from "@prisma/client";
import { Score } from "./score.entity";
import { Space } from "./space.entity";
import { Team } from "./team.entity";

export interface Match {
  id?: string;
  tournamentId?: string;
  space?: Space;

  scores?: Array<Score>;

  round?: number;
  matchNumber?: number;
  status?: MatchStatus;
  gameStatus?: GameStatus;

  teamLeft?: Team;
  teamRight?: Team;

  winner?: Team;

  createdAt?: Date;
  updatedAt?: Date;
}
