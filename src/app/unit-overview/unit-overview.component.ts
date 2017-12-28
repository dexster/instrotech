import { Component, AfterViewInit, Inject, OnInit, OnDestroy } from '@angular/core';
import { IQLService } from '../iql';
import { BandsService } from '../bands';
import * as d3 from 'd3';

@Component({
    selector: 'unit-overview',
    templateUrl: './unit-overview.component.html',
    styleUrls: ['./unit-overview.component.scss']
})
export class UnitOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

    connection: any;
    svg: any;
    xAxis: any;
    yAxis: any;
    selection: any;
    x: any;
    y: any;

    constructor(private iql: IQLService, private bands: BandsService) {
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
            // 'SELECT FFT     AS fft     FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms'// ,
            'SELECT METRICS AS metrics FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms',
            // 'SELECT TRACE   AS chart   FROM cache.AUDIO  WHERE PIU.id=1 AND CHANNEL=1 EVERY 1000 ms'
        ]);
    }

    dispatch(data) {
        // console.log(data);
        switch (data.tag) {
            case 'metrics':
                // this.fft.fft_draw(data.fft);
                // console.table(data);
                // console.table(data.samples.map((x) => x.mean));
                const maxmean = 100 + data.samples.map((x) => x.mean).reduce((a, b) => Math.max(a, b));
                console.log(maxmean);

                let datum;
                if (maxmean <= 10) {
                    datum = {channel: data.channel.id, low: maxmean, medium: 0, high: 0, over: 0};
                }
                if (maxmean >= 10 && maxmean < 48) {
                    datum = {channel: data.channel.id, low: 0, medium: maxmean, high: 0, over: 0};
                }
                if (maxmean >= 48 && maxmean < 64) {
                    datum = {channel: data.channel.id, low: 0, medium: 48, high: maxmean - 48, over: 0};
                }
                if (maxmean >= 64 && maxmean < 100) {
                    datum = {channel: data.channel.id, low: 0, medium: 48, high: 16, over: maxmean - 64};
                }

                const datum2 = {channel: 2, low: datum.low, medium: datum.medium, high: datum.high, over: datum.over / 2};

                this.bands.bands_draw([datum, datum2]);

                // console.log(100 + maxmean);
                // console.log( data.samples.find((x) => x.mean === maxmean) );
                // this.bands.bands_draw(data);
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
        this.bands.bands_setup('#unit-overview');


        d3.csv('assets/data.csv', this.type, (error, data) => {
            if (error) { throw error; }

            // data.sort(function(a, b) { return b.total - a.total; });
            // this.bands.bands_draw(data);
            // console.log(data);
        });

        d3.select(window).on('resize', () => {
            this.render();
        });
    }

    // resize() {
    //     if (this.selection) {
    //         const detectedHeight = window.innerHeight
    //             || document.documentElement.clientHeight
    //             || document.body.clientHeight;

    //         const aspect = parseInt(this.svg.style('width'), 10) / parseInt(this.svg.style('height'), 10);
    //         const targetWidth = this.svg.node().getBoundingClientRect().width;
    //         const targetHeight = this.svg.node().getBoundingClientRect().height;
    //         this.svg.attr('width', targetWidth);
    //         this.svg.attr('height', detectedHeight);
    //         this.selection.attr('width', this.x.bandwidth());
    //         this.xAxis.attr('transform', 'translate(0,' + detectedHeight + ')')

    //     }
    // }

    type(d, i, columns) {
        let t: any = 0;
        for (let j: any = 1; j < columns.length; ++j) {
            t += d[columns[j]] = +d[columns[j]];
        }
        d.total = t;
        return d;
    }
}
