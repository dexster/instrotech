import { Injectable } from '@angular/core';

@Injectable()
export class IQLService {

    private connection;
    private audio;
    private isConnected = false;
    private isConnecting = false;
    private watchdogTimer = null;
    private isListening = false;


    /*
     * WATCHDOG
     */

    watchdog(connectedCallback) {
        // console.log("WATCHDOG <" + isConnected + "><" + isConnecting + ">  " + new Date());

        if (!this.isConnected && !this.isConnecting) {
            console.log('WATCHDOG <RECONNECT>  ' + new Date());
            this.connect(connectedCallback);
        }
    }

    public connect(connectedCallback: any = null, disconnectedCallback: any = null, dispatchCallback: any = null) {
        const host = window.location.host.substring(0, window.location.host.indexOf(':')) + ':8080';
        // const host = 'netdevci.ddns.net:8080';
        const wsurl = 'ws://' + host + '/websockets/iql.js';
        const that = this;

        this.connection = new WebSocket(wsurl);

        this.connection.onopen = function (event) {
            console.log(' -- CONNECTED');
            that.isConnected = true;
            that.isConnecting = false;
            if (typeof connectedCallback === 'function') {
                connectedCallback();
            }
        };

        this.connection.onclose = function (event) {
            console.log(' -- DISCONNECTED');
            that.isConnected = false;
            that.isConnecting = false;
            if (typeof disconnectedCallback === 'function') {
                disconnectedCallback();
            }
        };

        this.connection.onmessage = function (event) {
            if (typeof dispatchCallback === 'function') {
                // dispatch(JSON.parse(event.data));
                dispatchCallback(JSON.parse(event.data));
            }
        };

        this.connection.onerror = function (err) {
            console.log('ERROR: ' + err);
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

        socket.onopen = function (event) {
            socket.send(iql);
            socket.close();
        };

        socket.onclose = function (event) {
        };

        socket.onerror = function (event) {
        };

        socket.onmessage = function (event) {
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
