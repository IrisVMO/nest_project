import { Status } from './users.entity';

export interface UpdateUserInterface {
  username?: string;
  tokenVerify?: string;
  email?: string;
  id: string;
  status?: Status;
}

export interface FindOneUserInterface {
  username?: string;
  email?: string;
  id?: string;
}

export interface ChangePassword {
  newPassword: string;
  id: string;
}
