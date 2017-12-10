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
        console.log(data);
        switch (data.tag) {
            case 'fft':
                SpectrumComponent.fft.fft_draw(data.fft);
                break;
            case 'metrics':
                SpectrumComponent.fft.metrics_draw(data.samples);
                break;
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

        /*
        d3.select('#spectrum > svg').remove();
        this.svg = d3.select('#spectrum').append('svg');
        const margin = { top: 20, right: 40, bottom: 30, left: 40 },
            width = parseInt(this.svg.style('width'), 10) - margin.left - margin.right,
            height = parseInt(this.svg.style('height'), 10) - margin.top - margin.bottom,
            g = this.svg.append('g').attr('transfor', 'translate(' + margin.left + ',' + margin.top + ')');

        const parseTime = d3.timeParse('%d-%b-%y');

        const x = d3.scaleTime()
            .rangeRound([0, width]);

        const y = d3.scaleLinear()
            .rangeRound([height, 0]);

            const area = d3.area()
            .x(function (d) {
                return x(d.date);
            })
            .y1(function (d) {
                return y(d.close);
            });

        d3.tsv("assets/areas.tsv", function (d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            return d;
        }, (error, data) => {
            if (error) throw error;

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.close;
            })]);
            area.y0(y(0));

            g.append("path")
                .datum(data)
                .attr("fill", "steelblue")
                .attr("d", area);

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", this.graphConfig.xAxisName)
                .style("stroke", this.graphConfig.stroke)
                .style("border", this.graphConfig.borderWidth)
                .style("border-style", this.graphConfig.borderStyle)
                .style("border-color", this.graphConfig.borderColor)
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Price ($)")
                .attr("class", this.graphConfig.yAxisName)
                .style("stroke", this.graphConfig.stroke)
                .style("border", this.graphConfig.borderWidth)
                .style("border-style", this.graphConfig.borderStyle)
                .style("border-color", this.graphConfig.borderColor)
                .call(d3.axisLeft(y))
                .append("text");
        });
        */

        d3.select(window).on('resize', () => {
            this.render();
        });
    }
}
