import { Owner } from "./Owners";
import { Player } from "./Players";

export interface LoginUserResponse {
  status: string;
  token: string;
  player?: Player;
  owner?: Owner;
}
