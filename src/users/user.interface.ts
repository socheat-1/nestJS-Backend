
export interface IUser {
  id: number;
  phone: string;
  f_name: string;
  username: string;
  password: string;
  roleId: number;
}


export enum StatusUser {
  ACTIVE = 1,
  PENDING = 2,
  BANNED = 3,
}

export const StatusUserName = {
  [StatusUser.ACTIVE]: 'active',
  [StatusUser.PENDING]: 'pending',
  [StatusUser.BANNED]: 'banned',
};

