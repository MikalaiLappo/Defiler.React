import { IUser } from './user';

/**
 * TODO: decouple `user`, `message` types
 */
export type IMessageProps = {
  user: IUser;
  message: {
    text: string;
    name: string;
    author: number;
    time: string; // TODO: consider `number` or `Date`
  };
  hideList: number[];
  // TODO: make sure where author callback argument is required
  addToHideList: (author: number) => void;
  insertName: (name: string) => void;
  insertPic: (pic: string) => void;
};
