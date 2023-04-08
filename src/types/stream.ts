import { StreamSource } from '../config';

type StreamType = 'defiler' | 'progamer' | 'other' | 'heresy';

export interface IStream {
  id: number;
  state: string;
  source: StreamSource;
  name: string;
  channel: string;
  info: string;
  type: StreamType;
  pic: string;
  fame: number;
  race: string; // TODO: maybe define union type if it's not dynamic
}
