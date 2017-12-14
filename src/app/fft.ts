import { NgModule, InjectionToken } from '@angular/core';
import * as d3 from 'd3';

export const FFT_MODULE = new InjectionToken<any>('FFT module');

@NgModule({
    providers: [{
        provide: FFT_MODULE, useValue: new FFT()
    }]
})

export class FFT {

    static FFTs = [];
    static fft;
    static max;

    make_x_axis(x) {
        return d3.axisBottom(x).ticks(10);
    }

    make_y_axis(y, ticks) {
        return d3.axisLeft(y).ticks(ticks);
    }

    public fft_setup() {
        // ... initialise FFT

        const fs = 44100;
        const N = 128;

        for (let i = 0; i < 64; i++) {
            FFT.FFTs[i] = {
                frequency: (i * fs / (N - 2)).toString(),
                dbv: -100.0,
                max: -100.0,
                mean: -100.0
            };
        }

        // ... initialise static chart area

        const margin = { top: 20, right: 20, bottom: 150, left: 40 };
        // const width = 960 - margin.left - margin.right;
        const width = document.documentElement.getBoundingClientRect().width - margin.left - margin.right;
        // const height = 480 - margin.top - margin.bottom;
        const height = document.documentElement.getBoundingClientRect().height - margin.top - margin.bottom;

console.log('width: ' + width + ', height: ' + height);

        const x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 22000]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 100]);
            // .domain([-80, 0]);

        const xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickFormat(d3.format('d'));

        const yAxis = d3.axisLeft(y)
            .ticks(6)
            .tickFormat(d3.format('d'));

        const svg = d3.select('#spectrum').append('svg')
            .attr('id', 'fft')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const clip = svg.append('defs')
            .append('svg:clipPath')
            .attr('id', 'clip')
            .append('svg:rect')
            .attr('id', 'clip-rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', width)
            .attr('height', height);

        const body = svg.append('g')
            .attr('clip-path', 'url(#clip)');

        const rect = body.append('svg:rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill-opacity', '0');

        // ... setup FFT line

        FFT.fft = d3.area()
            // .interpolate("cardinal")
            .x(function (d) { return x(d.frequency); })
            .y0(height)
            .y1(function (d) { return y(100 + d.dbv); })
            .curve(d3.curveCardinal);

        body.append('path')
            .data([FFT.FFTs])
            .attr('id', 'fftx')
            .attr('class', 'fft')
            .attr('d', FFT.fft);

        // ... setup MAX line

        FFT.max = d3.area()
            // .interpolate("cardinal")
            .x(function (d) { return x(d.frequency); })
            .y0(height)
            .y1(function (d) { return y(d.max); })
            .curve(d3.curveCardinal);


        body.append('path')
            .data([FFT])
            .attr('id', 'maxx')
            .attr('class', 'max')
            .attr('d', FFT.max);

        // ... draw grid

        svg.append('g')
            .attr('class', 'grid')
            .attr('stroke-opacity', '0')
            .attr('transform', 'translate(0,' + height + ')')
            .call(this.make_x_axis(x)
                .tickSize(-height, 0, 0)
                .tickFormat(''));

        svg.append('g')
            .attr('class', 'grid')
            .attr('stroke-opacity', '0')
            .call(this.make_y_axis(y, 10)
                .tickSize(-width, 0, 0)
                .tickFormat(''));

        // ... draw X-axis label

        svg.append('g')
            // .attr('id', 'garethx')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text')
            .attr('x', width / 2)
            .attr('dy', '3.5em')
            .style('text-anchor', 'end')
            .text('FREQUENCY (kHz)');

        // ... draw Y-axis label

        svg.append('g')
            // .attr('id', 'garethy')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('g')
            // .style('text-anchor', 'end')
            .append('text')
            .attr('y', 6)
            .attr('x', -(height / 2))
            .attr('dy', '-2.75em')
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(270,12,19)')
            .text('LEVEL (dB)');

        // ... draw outline

        // svg.append('rect')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('height', height)
        //     .attr('width', width)
        //     .attr('fill', 'none')
        //     .attr('stroke', '#808080')
        //     .attr('stroke-width', 1);
    }

    fft_draw(data) {
        const svg = d3.select('#spectrum');

        svg.selectAll('#fftx')
            .data([data])
            .transition()
            .attr('d', FFT.fft);
    }

    metrics_draw(data) {
        const svg = d3.select('#spectrum');

        svg.selectAll('#maxx')
            .data([data])
            .transition()
            .attr('d', FFT.max);
    }
}
