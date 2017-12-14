import { AfterViewInit, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { GRAPH_DATA } from '../chartConfig';
import * as d3 from 'd3';
import { IQL_MODULE, IQL } from '../iql';
import { FFT_MODULE, FFT } from '../fft';

@Component({
    selector: 'spectrum',
    templateUrl: './spectrum.component.html',
    styleUrls: ['./spectrum.component.scss']
})

export class SpectrumComponent implements AfterViewInit, OnDestroy {

    static iql: IQL;
    static fft: FFT;
    svg: any;
    connection: any;

    constructor( @Inject(GRAPH_DATA) private graphConfig, @Inject(IQL_MODULE) private iql, @Inject(FFT_MODULE) private fft) {
        SpectrumComponent.iql = iql;
        SpectrumComponent.fft = fft;
        this.connection = SpectrumComponent.iql.connect(this.connected, this.disconnected, this.dispatch);
    }

    ngOnDestroy() {
        this.connection.close();
    }

    connected() {
        console.log('connected!');

        SpectrumComponent.iql.query([
            'SELECT MODULES AS modules FROM cache.SYSTEM EVERY 15000 ms',
            'SELECT FFT     AS fft     FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms',
            'SELECT METRICS AS metrics FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms',
            'SELECT TRACE   AS chart   FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms'
        ]);

    }

    dispatch(data) {
        // console.log(data);
        switch (data.tag) {
            case 'fft':
                SpectrumComponent.fft.fft_draw(data.fft);
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
