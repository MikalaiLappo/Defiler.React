/** WS SERVER */

export default function DefilerWebSocketServer(options) {
    this.init(options)
}

DefilerWebSocketServer.defaultOptions = {
    serverPath: false,
    shortTimeout: 500,
    shortTries: 5,
    longTimeout: 60000,
    pingPeriod: 5000,
    debug: false,
}

DefilerWebSocketServer.prototype = {
    init: function (options) {
        this.options = Object.assign({}, DefilerWebSocketServer.defaultOptions, options);

        this.stCounter = 0
        this.connectTime = false
        this.reconnectPointer = null
        this.pingPongPointer = null
        this.ping = '?'
        this.handlers = {
            onOpen: [],
            onMessage: [],
            onClose: [],
            onError: [],
            onPing: [],
            onPong: [],
        }

        if (this.serverPath === false) {
            console.error('Kirov reporting: server path is not defined')
            return false
        }

        this.connect()
    },

    /** service */

    connected: function () {
        return this.server && this.server.readyState !== WebSocket.CLOSED
    },

    getPing: function () {
        if (!this.connected()) return 'dead'
        return this.ping
    },

    getLifeTime: function () {
        return this.connectTime !== false ? Date.now() - this.connectTime : false
    },

    addListener: function (eventType, handler) {
        if (typeof handler === 'function') {
            this.handlers[eventType].push(handler)
            return true
        }
        return false
    },

    /** system */

    send: function (message) {
        if (this.server && this.server.readyState !== WebSocket.CLOSED) {
            if (message === 'ping') {
                this.pingStartTime = Date.now()
                for (let i = 0; i < this.handlers.onPing.length; i++)
                    this.handlers.onPing[i]()
            }
            this.server.send(typeof message === 'object' ? JSON.stringify(message) : message)
            return true
        }
        return false
    },

    connect: function () {
        this.server = new WebSocket(this.options.serverPath)
        this.server.onopen = this.onOpen.bind(this)
        this.server.onclose = this.onClose.bind(this)
        this.server.onmessage = this.onMessage.bind(this)
        this.server.onerror = this.onError.bind(this)
    },

    onMessage: function (event) {
        if (this.options.debug) console.log(event.data)
        if (event.data === 'pong') {
            if (this.pingStartTime !== false) {
                this.ping = Date.now() - this.pingStartTime
                for (let i = 0; i < this.handlers.onPong.length; i++)
                    this.handlers.onPong[i](this.ping, this.getLifeTime())
                if (this.options.debug) console.log('ping: ' + this.ping + 'ms')
            }
            if (this.options.pingPeriod > 0) {
                clearTimeout(this.pingPongPointer)
                this.pingPongPointer = setTimeout(function () {
                    this.send('ping')
                }.bind(this), this.options.pingPeriod)
            }
        }
        for (let i = 0; i < this.handlers.onMessage.length; i++)
            this.handlers.onMessage[i](event.data)
    },

    onOpen: function (event) {
        this.ping = '?'
        this.connectTime = Date.now()
        this.stCounter = 0
        clearTimeout(this.reconnectPointer)
        console.log(`Kirov reporting: [${this.options.serverPath}] connected.`)

        for (let i = 0; i < this.handlers.onOpen.length; i++)
            this.handlers.onOpen[i]()

        if (this.options.pingPeriod > 0) this.send('ping')
    },

    onClose: function (event) {
        clearTimeout(this.pingPongPointer)
        const
            timeout = this.stCounter < this.options.shortTries ? this.options.shortTimeout : this.options.longTimeout
        this.reconnectPointer = setTimeout(this.check.bind(this), timeout)
        this.stCounter < this.options.shortTries && this.stCounter++
        //console.log(`Kirov reporting: ${this.options.serverPath} is closed. Try to reconnect in ${timeout} ms..`, event.reason)
        console.log(`Kirov reporting: ${this.options.serverPath} is closed. Try to reconnect in ${timeout} ms..`)

        for (let i = 0; i < this.handlers.onClose.length; i++)
            this.handlers.onClose[i]()
    },

    onError: function (error) {
        this.server.close()
        //console.error(`Kirov reporting: our base is under attack!`);

        for (let i = 0; i < this.handlers.onError.length; i++)
            this.handlers.onError[i]()
    },

    check: function () {
        if (!this.server || this.server.readyState === WebSocket.CLOSED) this.connect()
    }
}