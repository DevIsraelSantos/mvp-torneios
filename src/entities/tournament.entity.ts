import { Space } from "./space.entity";

export interface Tournament {
  id?: string;
  name?: string;
  numberOfSets?: number;
  status?: boolean;

  lossPoints?: number;
  winPoints?: number;
  spaces?: Space[];

  createdAt?: Date;
  updatedAt?: Date;
}
