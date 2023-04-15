/** WS SERVER */
interface IDefilerSocketOptions {
  serverPath: string;
  shortTimeout: number;
  shortTries: number;
  longTimeout: number;
  pingPeriod: number;
  debug: boolean;
}

export const DefilerSocketDefaults: IDefilerSocketOptions = {
  debug: false,
  serverPath: 'wss://defiler.ru:2346',
  shortTimeout: 500,
  shortTries: 5,
  longTimeout: 60000,
  pingPeriod: 5000,
};

type ISocketHandler = (...arg: any) => void;
type ISocketEvent = 'Open' | 'Message' | 'Close' | 'Error' | 'Ping' | 'Pong';

// e.g. { cmd: 'tavern.say', auth: props.auth, text: value })
export type IMessagePayload = { cmd: string; auth: string; text: string };

export type IDefilerSocketRef = React.MutableRefObject<DefilerSocket | null>;

export default class DefilerSocket {
  options: IDefilerSocketOptions;
  handlers: {
    onOpen: ISocketHandler[];
    onMessage: ISocketHandler[];
    onClose: ISocketHandler[];
    onError: ISocketHandler[];
    onPing: ISocketHandler[];
    onPong: ISocketHandler[];
  };
  stCounter: number;
  ping: string;
  server?: WebSocket;
  connectTime?: number;
  pingStartTime?: number;
  reconnectPointer?: number;
  pingPongPointer?: number;

  constructor(options: IDefilerSocketOptions) {
    this.options = { ...DefilerSocketDefaults, ...options };
    this.handlers = {
      onOpen: [],
      onMessage: [],
      onClose: [],
      onError: [],
      onPing: [],
      onPong: [],
    };
    this.stCounter = 0;
    this.ping = '?';

    this.init();
  }

  init() {
    if (!this.options.serverPath) {
      console.error('Kirov reporting: server path is not defined');
      return false;
    }

    this.connect();
  }
  /** service */

  connected() {
    return this.server && this.server.readyState !== WebSocket.CLOSED;
  }

  getPing() {
    if (!this.connected()) return 'dead';
    return this.ping;
  }

  getLifeTime() {
    return this.connectTime ? Date.now() - this.connectTime : undefined;
  }

  addListener(eventType: ISocketEvent, handler: ISocketHandler) {
    if (!this.handlers[`on${eventType}`]) return false;
    this.handlers[`on${eventType}`].push(handler);
    return true;
  }

  /** system */

  /**
   * TODO: define strict `message` type (idk what's on the server)
   */
  send(message: IMessagePayload | string) {
    if (!this.server || this.server.readyState === WebSocket.CLOSED) {
      return false;
    }
    if (message === 'ping') {
      this.pingStartTime = Date.now();
      this.handlers.onPing.forEach((pingCb) => pingCb());
    }
    this.server.send(
      typeof message === 'object' ? JSON.stringify(message) : message,
    );
    return true;
  }

  connect() {
    this.server = new WebSocket(this.options.serverPath);
    this.server.onopen = this.onOpen.bind(this);
    this.server.onclose = this.onClose.bind(this);
    this.server.onmessage = this.onMessage.bind(this);
    this.server.onerror = this.onError.bind(this);
  }

  onMessage(event) {
    if (this.options.debug) console.log(event.data);
    if (event.data === 'pong') {
      if (this.pingStartTime !== undefined) {
        this.ping = `${Date.now() - this.pingStartTime}`;
        for (let i = 0; i < this.handlers.onPong.length; i++)
          this.handlers.onPong[i](this.ping, this.getLifeTime());
        if (this.options.debug) console.log('ping: ' + this.ping + 'ms');
      }
      if (this.options.pingPeriod > 0) {
        clearTimeout(this.pingPongPointer);
        this.pingPongPointer = window.setTimeout(
          () => this.send('ping'),
          this.options.pingPeriod,
        );
      }
    }
    for (let i = 0; i < this.handlers.onMessage.length; i++)
      this.handlers.onMessage[i](event.data);
  }

  onOpen(event) {
    this.ping = '?';
    this.connectTime = Date.now();
    this.stCounter = 0;
    clearTimeout(this.reconnectPointer);
    console.log(`Kirov reporting: [${this.options.serverPath}] connected.`);

    this.handlers.onOpen.forEach((openCb) => openCb());

    if (this.options.pingPeriod > 0) this.send('ping');
  }

  onClose(event) {
    clearTimeout(this.pingPongPointer);
    const timeout =
      this.stCounter < this.options.shortTries
        ? this.options.shortTimeout
        : this.options.longTimeout;
    this.reconnectPointer = window.setTimeout(this.check.bind(this), timeout);
    this.stCounter < this.options.shortTries && this.stCounter++;
    //console.log(`Kirov reporting: ${this.options.serverPath} is closed. Try to reconnect in ${timeout} ms..`, event.reason)
    console.log(
      `Kirov reporting: ${this.options.serverPath} is closed. Try to reconnect in ${timeout} ms..`,
    );

    for (let i = 0; i < this.handlers.onClose.length; i++)
      this.handlers.onClose[i]();
  }

  onError(error) {
    this.server?.close();
    //console.error(`Kirov reporting: our base is under attack!`);

    for (let i = 0; i < this.handlers.onError.length; i++)
      this.handlers.onError[i]();
  }

  check() {
    if (!this.server || this.server.readyState === WebSocket.CLOSED)
      this.connect();
  }
}
