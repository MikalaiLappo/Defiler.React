import { IStreamSource } from '../config';

type IStreamType = 'defiler' | 'progamer' | 'other' | 'heresy';

export interface IStream {
  id: number;
  state: string;
  source: IStreamSource;
  name: string;
  channel: string;
  info: string;
  type: IStreamType;
  pic: string;
  fame: number;
  race: string; // TODO: maybe define union type if it's not dynamic
}
