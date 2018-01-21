import {Injectable} from '@angular/core';
import {LoggerService} from '../services/logger/logger.service';

@Injectable()
export class IQLService {

    private connection;
    private audio;
    private isConnected = false;
    private isConnecting = false;
    public watchdogTimer = null;
    private isListening = false;
    private logger: any;

    constructor(private loggerService: LoggerService) {
        this.logger = {
            debug: (message) => {
                this.loggerService.debug(`${this.constructor.name} - ${message}`);
            },
            error: (message) => {
                this.loggerService.error(`${this.constructor.name} - ${message}`);
            }
        }
    }

    watchdog(connectedCallback) {
        // this.logger.debug("WATCHDOG <" + this.isConnected + "><" + this.isConnecting + ">  " + new Date());

        if (!this.isConnected && !this.isConnecting) {
            this.logger.debug('WATCHDOG <RECONNECT>  ' + new Date());
            this.connect(connectedCallback);
        }
    }

    public connect(connectedCallback: any = null, disconnectedCallback: any = null, dispatchCallback: any = null) {
        this.logger.debug('connect');
        const host = window.location.host.substring(0, window.location.host.indexOf(':')) + ':8080';
        // const host = 'netdevci.ddns.net:8080';
        const wsurl = 'ws://' + host + '/websockets/iql.js';

        this.connection = new WebSocket(wsurl);

        this.connection.onopen = (event) => {
            this.logger.debug(' -- CONNECTED');
            this.isConnected = true;
            this.isConnecting = false;
            if (typeof connectedCallback === 'function') {
                connectedCallback();
            }
        };

        this.connection.onclose = (event) => {
            this.logger.debug(' -- DISCONNECTED');
            this.isConnected = false;
            this.isConnecting = false;
            if (typeof disconnectedCallback === 'function') {
                disconnectedCallback();
            }
        };

        this.connection.onmessage = (event) => {
            if (typeof dispatchCallback === 'function') {
                // dispatch(JSON.parse(event.data));
                dispatchCallback(JSON.parse(event.data));
            }
        };

        this.connection.onerror =  (err) => {
            this.logger.error('ERROR: ' + err);
        };

        window.clearInterval(this.watchdogTimer);
        this.watchdogTimer = window.setInterval(() => this.watchdog(connectedCallback), 2500);
        this.isConnecting = true;

        return this.connection;
    }

    query(iql) {
        if (this.isConnected) {
            if (Array.isArray(iql)) {
                this.connection.send(iql.join(';'));
            } else {
                this.connection.send(iql);
            }
        }
    }

    execute(iql) {
        const host = window.location.host.substring(0, window.location.host.indexOf(':')) + ':8080';
        const wsurl = 'ws://' + host + '/websockets/iql.js';
        const socket = new WebSocket(wsurl);

        socket.onopen = (event) => {
            this.logger.debug('socket onopen');
            socket.send(iql);
            socket.close();
        };

        socket.onclose = (event) => {
            this.logger.debug('socket onclose');
        };

        socket.onerror = (event) => {
            this.logger.debug('socket onerror');
        };

        socket.onmessage = (event) => {
            this.logger.debug('socket onmessage');
        };
    }

    listen(iql) {
        const host = '192.168.1.114:8080'; // window.location.host;
        const wsurl = 'ws://' + host + '/websockets/listen.js';

        this.audio = new WebSocket(wsurl);

        this.audio.onopen = function (event) {
            console.log(' -- LISTEN: CONNECTED');
            // play_start();
            this.isListening = true;
            // listening(true);
            this.audio.send(iql);
        };

        this.audio.onclose = function (event) {
            console.log(' -- LISTEN: DISCONNECTED');
            this.isListening = false;
            // listening(false);
            // play_stop();
        };

        this.audio.onerror = function (event) {
            console.log(' --- AUDIO ERROR');
        };

        this.audio.onmessage = function (event) {
            this.dispatch(JSON.parse(event.data));
        };
    }

    unlisten() {
        this.audio.close();
    }
}
