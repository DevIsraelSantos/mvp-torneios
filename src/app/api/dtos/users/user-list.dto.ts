import { UserDto } from "./user.dto";

export interface UserListDto {
  readonly users: Array<UserDto>;
}
