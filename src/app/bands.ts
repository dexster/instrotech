import { Injectable } from '@angular/core';
import * as d3 from 'd3';

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

    bands_setup(selector) {
        d3.select(selector + ' > svg').remove();
        this.svg = d3.select(selector).append('svg');
        this.margin = { top: 20, right: 40, bottom: 30, left: 20 };
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

        this.yAxis = this.svg.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top) + ')')
            .call(d3.axisLeft(this.y).ticks(10, 's').tickSize(0))
            .append('text')
            .attr('x', 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .attr('fill', '#fff');
    }

    draw_x_axis() {
        this.xAxis = this.svg.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(' + this.margin.left + ',' + (this.height + this.margin.top) + ')')
            .call(d3.axisBottom(this.x).tickSize(0));
    }

    bands_draw(data) {
        const that = this;

        this.x.domain(data.map(function (d) {
            return d.unit;
        }));
        this.draw_x_axis();

        this.z.domain(data.columns.slice(1));

        this.selection = this.g.selectAll('.serie')
            .data(this.stack.keys(data.columns.slice(1))(data))
            .enter().append('g')
            .attr('class', 'serie')
            .attr('fill', function (d) {
                return that.z(d.key);
            })
            .selectAll('rect')
            .data(function (d) {
                return d;
            })
            .enter().append('rect')
            .attr('x', (d) => {
                return this.x(d.data.unit);
            })
            .attr('y', (d) => {
                return this.y(d[1]);
            })
            .attr('height', (d) => {
                return this.y(d[0]) - this.y(d[1]);
            })
            .attr('width', this.x.bandwidth());

        // this.xAxis = this.g.append('g')
        //     .attr('transform', 'translate(0,' + this.height + ')')
        //     .attr('class', 'axis')
        //     .call(d3.axisBottom(this.x));

        // this.yAxis = this.g.append('g')
        //     .attr('class', 'axis')
        //     .call(d3.axisLeft(this.y).ticks(10, 's'))
        //     .append('text')
        //     .attr('x', 2)
        //     .attr('dy', '0.35em')
        //     .attr('text-anchor', 'start')
        //     .attr('fill', '#fff');
    }
}
