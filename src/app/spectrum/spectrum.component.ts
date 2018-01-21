import {AfterViewInit, Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {LoggerService} from '../services/logger/logger.service';
import {UnitSelectService} from '../services/unit-select/unit-select.service';
import {ChannelSelectService} from '../services/channel-select/channel-select.service';
import {IQLService} from '../services/iql';
import {FFTService} from '../services/fft';
import * as d3 from 'd3';

@Component({
    selector: 'spectrum',
    templateUrl: './spectrum.component.html',
    styleUrls: ['./spectrum.component.scss'],
    providers: [IQLService, LoggerService]
    // providers: [IQLService, LoggerService,
    //     {provide: 'className', useValue: 'SpectrumComponent'}]
})

export class SpectrumComponent implements OnInit, AfterViewInit, OnDestroy {

    svg: any;
    connection: any;
    unit: number;
    channels: Array<any>;
    unitSubscription: Subscription;
    channelSubscription: Subscription;
    logger: any;

    constructor(private loggerService: LoggerService,
                private iql: IQLService,
                private fft: FFTService,
                private unitSelectService: UnitSelectService,
                private channelSelectService: ChannelSelectService) {
        this.unitSubscription = unitSelectService.unitUpdated$.subscribe((selectedUnit) => {
            this.unit = selectedUnit;
        });
        this.channelSubscription = channelSelectService.channelsUpdated$.subscribe((selectedChannels) => {
            this.channels = selectedChannels;
        });

        this.logger = {
            debug: (message) => {
                this.loggerService.debug(`${this.constructor.name} - ${message}`);
            },
            error: (message) => {
                this.loggerService.error(`${this.constructor.name} - ${message}`);
            }
        }
    }

    ngOnInit() {
        const boundConnected = this.connected.bind(this);
        const boundDisconnected = this.disconnected.bind(this);
        const boundDispatch = this.dispatch.bind(this);

        this.logger.debug('iql.connect');
        this.connection = this.iql.connect(boundConnected, boundDisconnected, boundDispatch);
    }

    ngOnDestroy() {
        window.clearInterval(this.iql.watchdogTimer);
        this.connection.close();
        this.unitSubscription.unsubscribe();
        this.channelSubscription.unsubscribe();
    }

    connected() {
        this.logger.debug('connected!');

        this.iql.query([
            // 'SELECT MODULES AS modules FROM cache.SYSTEM EVERY 15000 ms',
            //`SELECT FFT     AS fft     FROM cache.AUDIO  WHERE PIU.id=${this.unit} AND CHANNEL IN ${this.channels} EVERY 1000 ms`// ,
            `SELECT FFT     AS fft     FROM cache.AUDIO  WHERE PIU.id=${this.unit} AND CHANNEL=1 EVERY 1000 ms`// ,
            // 'SELECT METRICS AS metrics FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms',
            // 'SELECT TRACE   AS chart   FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms'
        ]);
    }

    dispatch(data) {
        this.logger.debug('dispatch!');
        switch (data.tag) {
            case 'fft':
                this.fft.fft_draw(data.fft);
                break;
            /*
                        case 'metrics':
                            SpectrumComponent.fft.metrics_draw(data.samples);
                            break;
            */
        }
    }

    disconnected() {
        this.logger.debug('disconnected!');
    }

    ngAfterViewInit() {
        this.render();
    }

    render() {
        this.logger.debug('render!');
        this.fft.fft_setup();

        d3.select(window).on('resize', () => {
            d3.select('#spectrum > svg').remove();
            this.render();
        });
    }
}
