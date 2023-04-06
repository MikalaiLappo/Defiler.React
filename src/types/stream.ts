import { StreamSource } from '../config';

export interface IStream {
  id: number;
  state: string;
  source: StreamSource;
  name: string;
  channel: string;
  info: string;
}
