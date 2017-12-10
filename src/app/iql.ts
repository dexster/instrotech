import {NgModule, InjectionToken} from '@angular/core';

export const IQL_MODULE = new InjectionToken<any>('IQL module');

@NgModule({
  providers: [{
      provide: IQL_MODULE, useValue: new IQL()
  }]
})

export class IQL {

  static connection;
  static audio;
  static isConnected = false;
  static isConnecting = false;
  static watchdogTimer = null;
  static isListening = false;


  /*
   * WATCHDOG
   */

  watchdog() {
    // console.log("WATCHDOG <" + isConnected + "><" + isConnecting + ">  " + new Date());

    if (!IQL.isConnected && !IQL.isConnecting) {
      console.log('WATCHDOG <RECONNECT>  ' + new Date());
      this.connect();
    }
  }


  /*
   * IQL WEBSOCKET
   */

  dispatch(resultset) {
    const tag = resultset.tag;

    console.log(resultset);

    // if (tag === 'modules') {
    //   configure(resultset);
    // }

    // if (tag === 'summary') {
    //   summary(resultset);
    // }

    // if (tag === 'fft') {
    //   fft_draw(resultset.fft);
    // }

    // if (tag === 'metrics') {
    //   metrics_draw(resultset.samples);
    // }

    // if (tag === 'chart') {
    //   var start = new Date(resultset.start);
    //   var end = new Date(resultset.end);
    //   var data = resultset.trace;

    //   chart_draw(start, end, data);
    // }

    // if (tag === 'dbaudio') {
    //   plotAudio(resultset);
    // }

    // if (tag === 'dbevents') {
    //   plotEvents(resultset);
    // }

    // if (tag === 'din') {
    //   digitalInputs(resultset.records);
    // }

    // if (tag === 'dout') {
    //   digitalOutputs(resultset.records);
    // }

    // if (tag === 'ain') {
    //   analogInputs(resultset.records);
    // }

    // if (tag === 'aout') {
    //   analogOutputs(resultset.records);
    // }

    // if (tag === 'modbus') {
    //   modbus(resultset.records);
    // }

    // if (tag === 'sysinfo') {
    //   sysinfo(resultset.records);
    // }

    // if (tag === 'audio') {
    //   listen_play(resultset.rate, resultset.audio);
    // }
  }

  public connect(connectedCallback: any = null, disconnectedCallback: any = null, dispatchCallback: any = null) {
    const host = window.location.host.substring(0, window.location.host.indexOf(':')) + ':8080';
    const wsurl = 'ws://' + host + '/websockets/iql.js';

    IQL.connection = new WebSocket(wsurl);

    IQL.connection.onopen = function (event) {
      console.log(' -- CONNECTED');
      IQL.isConnected = true;
      IQL.isConnecting = false;
      if (typeof connectedCallback === 'function') {
        connectedCallback();
      }
    };

    IQL.connection.onclose = function (event) {
      console.log(' -- DISCONNECTED');
      IQL.isConnected = false;
      IQL.isConnecting = false;
      if (typeof disconnectedCallback === 'function') {
        disconnectedCallback();
      }
    };

    IQL.connection.onmessage = function (event) {
      if (typeof dispatchCallback === 'function') {
        // dispatch(JSON.parse(event.data));
        dispatchCallback(JSON.parse(event.data));
      }
    };

    IQL.connection.onerror = function (err) {
      console.log('ERROR: ' + err);
    };

    window.clearInterval(IQL.watchdogTimer);
    IQL.watchdogTimer = window.setInterval(this.watchdog, 2500);
    IQL.isConnecting = true;

    return IQL.connection;
  }

  query(iql) {
    if (Array.isArray(iql)) {
      IQL.connection.send(iql.join(';'));
    } else {
      IQL.connection.send(iql);
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

    IQL.audio = new WebSocket(wsurl);

    IQL.audio.onopen = function (event) {
      console.log(' -- LISTEN: CONNECTED');
      // play_start();
      IQL.isListening = true;
      // listening(true);
      IQL.audio.send(iql);
    };

    IQL.audio.onclose = function (event) {
      console.log(' -- LISTEN: DISCONNECTED');
      IQL.isListening = false;
      // listening(false);
      // play_stop();
    };

    IQL.audio.onerror = function (event) {
      console.log(' --- AUDIO ERROR');
    };

    IQL.audio.onmessage = function (event) {
      this.dispatch(JSON.parse(event.data));
    };
  }

  unlisten() {
    IQL.audio.close();
  }
}
