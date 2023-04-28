import { IUser } from './user';

export type IMessageData = {
  text: string;
  name: string;
  author: number;
  time: string; // TODO: consider `number` or `Date`
};
