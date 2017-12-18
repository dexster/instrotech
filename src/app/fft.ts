import {Injectable} from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class FFTService {

    private FFTs = [];
    private max;
    private fft;

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
            this.FFTs[i] = {
                frequency: (i * fs / (N - 2)).toString(),
                dbv: -100.0,
                max: -100.0,
                mean: -100.0
            };
        }

        // ... initialise static chart area

        const margin = { top: 20, right: 40, bottom: 150, left: 40 };
        // const width = document.documentElement.getBoundingClientRect().width - margin.left - margin.right;
        // const height = document.documentElement.getBoundingClientRect().height - margin.top - margin.bottom;

        const width = d3.select('#spectrum').node().getBoundingClientRect().width - margin.left - margin.right;
        let height = d3.select('#spectrum').node().getBoundingClientRect().height - margin.top - margin.bottom;

        if (height <= 0) {
            height = document.documentElement.getBoundingClientRect().height - margin.top - margin.bottom * 3;
        }

        const x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 22000]);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 100]);

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

        this.fft = d3.area()
            .x(function (d) { return x(d.frequency); })
            .y0(height)
            .y1(function (d) { return y(100 + d.dbv); })
            .curve(d3.curveCardinal);

        body.append('path')
            .data([this.FFTs])
            .attr('id', 'fftx')
            .attr('class', 'fft')
            .attr('d', this.fft);

        // ... setup MAX line

        this.max = d3.area()
            .x(function (d) { return x(d.frequency); })
            .y0(height)
            .y1(function (d) { return y(d.max); })
            .curve(d3.curveCardinal);

        body.append('path')
            .data([this.FFTs])
            .attr('id', 'maxx')
            .attr('class', 'max')
            .attr('d', this.max);

        // ... draw X-axis label

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text')
            .attr('x', width / 2)
            .attr('dy', '3.5em')
            .style('text-anchor', 'middle')
            .text('FREQUENCY (Hz)');

        // ... draw Y-axis label

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('g')
            .append('text')
            .attr('x', -(height / 2))
            .attr('dy', '-2.75em')
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(270,0,0)')
            .text('LEVEL (dB)');
    }

    fft_draw(data) {
        // const newdata = data.map((d) => 100 + d.dbv);
        // const maxnewdata = d3.max(newdata);
        // const o = data.find((d) => 100 + d.dbv === maxnewdata);
        // console.log('max dbv = ' + parseInt(100 + o.dbv, 10) + ' @ ' + o.frequency + ' Hz');

        const svg = d3.select('#spectrum');

        svg.select('#fftx')
            .data([data])
            .transition()
            .attr('d', this.fft);
    }

    metrics_draw(data) {
        const svg = d3.select('#spectrum');

        svg.selectAll('#maxx')
            .data([data])
            .transition()
            .attr('d', this.max);
    }
}
