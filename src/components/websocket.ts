/** WS SERVER */
interface DefilerWebsocketOptions {
    serverPath: string;
    shortTimeout: number;
    shortTries: number;
    longTimeout: number;
    pingPeriod: number;
    debug: boolean;
} 

const defaultOptions = {
    serverPath: undefined,
    shortTimeout: 500,
    shortTries: 5,
    longTimeout: 60000,
    pingPeriod: 5000,
    debug: false,
}

type SocketHandler = (...arg: any) => void
type SocketEvent = 'Open' | 'Message' | 'Close' | 'Error' | 'Ping' | 'Pong'

export default class DefilerWebSocketServer {
    options: DefilerWebsocketOptions
    handlers: {
        onOpen: SocketHandler[]
        onMessage: SocketHandler[]
        onClose: SocketHandler[]
        onError: SocketHandler[]
        onPing: SocketHandler[]
        onPong: SocketHandler[]
    }
    stCounter: number
    ping: string
    server?: WebSocket
    connectTime?: number
    pingStartTime?: number
    reconnectPointer?: number
    pingPongPointer?: number

    constructor(options: DefilerWebsocketOptions) {
        this.options = { ...defaultOptions, ...options }
        this.handlers = {
            onOpen: [],
            onMessage: [],
            onClose: [],
            onError: [],
            onPing: [],
            onPong: [],
        }
        this.stCounter = 0
        this.ping = '?'

        this.init()
    }

    init() {
        if (!this.options.serverPath) {
            console.error('Kirov reporting: server path is not defined')
            return false
        }

        this.connect()
    }
    /** service */

    connected() {
        return this.server && this.server.readyState !== WebSocket.CLOSED
    }

    getPing() {
        if (!this.connected()) return 'dead'
        return this.ping
    }

    getLifeTime() {
        return this.connectTime ? Date.now() - this.connectTime : undefined
    }

    addListener(eventType: SocketEvent, handler: SocketHandler) {
        if (!this.handlers[`on${eventType}`]) return false
        this.handlers[`on${eventType}`].push(handler)
        return true
    }

    /** system */

    send(message: string) {
        if (!this.server || this.server.readyState === WebSocket.CLOSED) {
            return false
        }
        if (message === 'ping') {
            this.pingStartTime = Date.now()
            this.handlers.onPing.forEach(pingCb => pingCb())
        }
        this.server.send(typeof message === 'object' ? JSON.stringify(message) : message)
        return true
    }

    connect() {
        this.server = new WebSocket(this.options.serverPath)
        this.server.onopen = this.onOpen.bind(this)
        this.server.onclose = this.onClose.bind(this)
        this.server.onmessage = this.onMessage.bind(this)
        this.server.onerror = this.onError.bind(this)
    }

    onMessage(event) {
        if (this.options.debug) console.log(event.data)
        if (event.data === 'pong') {
            if (this.pingStartTime !== undefined) {
                this.ping = `${Date.now() - this.pingStartTime}`
                for (let i = 0; i < this.handlers.onPong.length; i++)
                    this.handlers.onPong[i](this.ping, this.getLifeTime())
                if (this.options.debug) console.log('ping: ' + this.ping + 'ms')
            }
            if (this.options.pingPeriod > 0) {
                clearTimeout(this.pingPongPointer)
                this.pingPongPointer = window.setTimeout(() => this.send('ping'), this.options.pingPeriod)
            }
        }
        for (let i = 0; i < this.handlers.onMessage.length; i++)
            this.handlers.onMessage[i](event.data)
    }

    onOpen(event) {
        this.ping = '?'
        this.connectTime = Date.now()
        this.stCounter = 0
        clearTimeout(this.reconnectPointer)
        console.log(`Kirov reporting: [${this.options.serverPath}] connected.`)

        this.handlers.onOpen.forEach(openCb => openCb())

        if (this.options.pingPeriod > 0) this.send('ping')
    }

    onClose(event) {
        clearTimeout(this.pingPongPointer)
        const
            timeout = this.stCounter < this.options.shortTries ? this.options.shortTimeout : this.options.longTimeout
        this.reconnectPointer = window.setTimeout(this.check.bind(this), timeout)
        this.stCounter < this.options.shortTries && this.stCounter++
        //console.log(`Kirov reporting: ${this.options.serverPath} is closed. Try to reconnect in ${timeout} ms..`, event.reason)
        console.log(`Kirov reporting: ${this.options.serverPath} is closed. Try to reconnect in ${timeout} ms..`)

        for (let i = 0; i < this.handlers.onClose.length; i++)
            this.handlers.onClose[i]()
    }

    onError(error) {
        this.server?.close()
        //console.error(`Kirov reporting: our base is under attack!`);

        for (let i = 0; i < this.handlers.onError.length; i++)
            this.handlers.onError[i]()
    }

    check() {
        if (!this.server || this.server.readyState === WebSocket.CLOSED) this.connect()
    }
}