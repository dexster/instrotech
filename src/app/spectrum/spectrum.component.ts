import { AfterViewInit, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { IQLService } from '../iql';
import { FFTService } from '../fft';
import * as d3 from 'd3';

@Component({
    selector: 'spectrum',
    templateUrl: './spectrum.component.html',
    styleUrls: ['./spectrum.component.scss']
})

export class SpectrumComponent implements OnInit, AfterViewInit, OnDestroy {

    svg: any;
    connection: any;

    constructor(private iql: IQLService, private fft: FFTService) {
    }

    ngOnInit() {
        const boundConnected = this.connected.bind(this);
        const boundDisconnected = this.disconnected.bind(this);
        const boundDispatch = this.dispatch.bind(this);

        this.connection = this.iql.connect(boundConnected, boundDisconnected, boundDispatch);
    }

    ngOnDestroy() {
        this.connection.close();
    }

    connected() {
        console.log('connected!');

        this.iql.query([
            // 'SELECT MODULES AS modules FROM cache.SYSTEM EVERY 15000 ms',
            'SELECT FFT     AS fft     FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms'// ,
            // 'SELECT METRICS AS metrics FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms',
            // 'SELECT TRACE   AS chart   FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms'
        ]);
    }

    dispatch(data) {
        // console.log(data);
        switch (data.tag) {
            case 'fft':
                this.fft.fft_draw(data.fft);
                break;
            case 'maxfft':
                console.table(data);
                break;
            /*
                        case 'metrics':
                            SpectrumComponent.fft.metrics_draw(data.samples);
                            break;
            */
        }
    }

    disconnected() {
        console.log('disconnected!');
    }

    ngAfterViewInit() {
        this.render();
    }

    render() {
        this.fft.fft_setup();

        d3.select(window).on('resize', () => {
            d3.select('#spectrum > svg').remove();
            this.render();
        });
    }
}
