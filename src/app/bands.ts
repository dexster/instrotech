import { Injectable, Inject } from '@angular/core';
import * as d3 from 'd3';
import { BarsConfigModule, BARS_DATA } from './barsConfig';

interface BandsThresholds {
    low: number;
    medium: number;
    high: number;
    over: number;
}

@Injectable()
export class BandsService {

    svg: any;
    x: any;
    y: any;
    z: any;
    xAxis: any;
    yAxis: any;
    selection: any;
    stack: any;
    margin: any;
    width: any;
    height: any;
    g: any;

    constructor(@Inject(BARS_DATA) private thresholds) {
        console.log(thresholds);
    }

    bands_setup(selector) {
        d3.select(selector + ' > svg').remove();
        this.svg = d3.select(selector).append('svg');
        this.margin = { top: 20, right: 40, bottom: 30, left: 40 };
        // this.width = parseInt(this.svg.style('width'), 10) - this.margin.left - this.margin.right;
        // this.height = parseInt(this.svg.style('height'), 10) - this.margin.top - this.margin.bottom;
        this.width = d3.select(selector).node().getBoundingClientRect().width - this.margin.left - this.margin.right;
        // this.height = d3.select(selector).node().getBoundingClientRect().height - this.margin.top - this.margin.bottom;
        this.height = 600;
        this.svg
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        this.g = this.svg.append('g').attr('id', 'mainG').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x = d3.scaleBand()
            .rangeRound([0, this.width])
            .padding(0.3)
            .align(0.3);

        this.y = d3.scaleLinear()
            .domain([0, 100])
            .rangeRound([this.height, 0]);

        this.z = d3.scaleOrdinal()
            .range(['#14B5EB', '#20C45C', '#FAC750', '#DC2846']);

        this.stack = d3.stack();

        this.yAxis = this.svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top) + ')')
            .call(d3.axisLeft(this.y).ticks(0).tickSize(0))
            .append('text')
            .attr('x', 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start');

        this.svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .append('text')
            .attr('x', this.width / 2)
            .attr('dy', '5em')
            .style('text-anchor', 'middle')
            .text('CHANNEL NUMBER');

        this.svg.append('g')
            .attr('class', 'axis')
            .append('g')
            .append('text')
            .attr('x', -(this.height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(270,0,0)')
            .text('ALARM LEVEL (%)');

        this.draw_x_axis();

        const watermarklines = this.svg
            .append('g')
            .attr('id', 'watermarklines');
        watermarklines
            .append('line')
            .attr('id', 'low')
            .attr('x1', this.margin.left)
            .attr('x2', this.width + this.margin.right)
            .attr('y1', this.y(this.thresholds.low) + this.margin.top)
            .attr('y2', this.y(this.thresholds.low) + this.margin.top)
            .attr('stroke', '#ccc');
        watermarklines
            .append('text')
            .style('text-anchor', 'start')
            .attr('x', this.margin.left - 20)
            .attr('y', this.y(this.thresholds.low) + this.margin.top + 4)
            .text(this.thresholds.low)
            .attr('fill', '#fff');
        watermarklines
            .append('line')
            .attr('id', 'medium')
            .attr('x1', this.margin.left)
            .attr('x2', this.width + this.margin.right)
            .attr('y1', this.y(this.thresholds.medium) + this.margin.top)
            .attr('y2', this.y(this.thresholds.medium) + this.margin.top)
            .attr('stroke', '#ccc');
        watermarklines
            .append('text')
            .style('text-anchor', 'start')
            .attr('x', this.margin.left - 20)
            .attr('y', this.y(this.thresholds.medium) + this.margin.top + 4)
            .text(this.thresholds.medium)
            .attr('fill', '#fff');
        watermarklines
            .append('line')
            .attr('id', 'high')
            .attr('x1', this.margin.left)
            .attr('x2', this.width + this.margin.right)
            .attr('y1', this.y(this.thresholds.high) + this.margin.top)
            .attr('y2', this.y(this.thresholds.high) + this.margin.top)
            .attr('stroke', '#ccc');
        watermarklines
            .append('text')
            .style('text-anchor', 'start')
            .attr('x', this.margin.left - 20)
            .attr('y', this.y(this.thresholds.high) + this.margin.top + 4)
            .text(this.thresholds.high)
            .attr('fill', '#fff');
    }

    draw_x_axis() {
        this.svg.select('g.x').remove();
        this.xAxis = this.svg.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(' + this.margin.left + ',' + (this.height + this.margin.top) + ')')
            .call(d3.axisBottom(this.x).tickSize(0).tickPadding(15));
    }

    bands_draw(data) {
        const that = this;

        this.x.domain(data.map(function (d) {
            return d.channel;
        }));
        this.draw_x_axis();

        this.z.domain(['low', 'medium', 'high', 'over']);
        // console.log(data);

        const barsdata = this.g.selectAll('.serie')
            .data(this.stack.keys(['low', 'medium', 'high', 'over'])(data));

        barsdata.enter()
            .append('g')
            .merge(barsdata)
            .attr('class', 'serie')
            .attr('fill', function (d) {
                return that.z(d.key);
            });

        const rectsdata = barsdata.selectAll('rect')
            .data(function (d) {
                return d;
            });

        rectsdata
            .enter()
            .append('rect')
            .merge(rectsdata)
            .transition()
            .attr('x', (d) => {
                return this.x(d.data.channel);
            })
            .attr('y', (d) => {
                return this.y(d[1]);
            })
            .attr('height', (d) => {
                const yheight = this.y(d[0]) - this.y(d[1]);
                if (yheight < 0) { return 0; }
                return this.y(d[0]) - this.y(d[1]);
            })
            .attr('width', this.x.bandwidth());
    }
}
