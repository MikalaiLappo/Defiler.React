/**
 * TODO: decouple `user`, `message` types
 */
export type IMessageProps = {
  user: {
    id: number;
    name: string;
  };
  message: {
    text: string;
    name: string;
    author: number;
    time: Date;
  };
  hideList: number[];
  // TODO: make sure where author callback argument is required
  addToHideList: (author: number) => void;
  insertName: () => void;
  insertPic: () => void;
};
