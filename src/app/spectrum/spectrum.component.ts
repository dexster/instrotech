import {Component, Inject, OnInit} from '@angular/core';
import {GRAPH_DATA} from '../chartConfig';
import * as d3 from 'd3';

@Component({
    selector: 'app-spectrum',
    templateUrl: './spectrum.component.html',
    styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnInit {

    constructor (@Inject(GRAPH_DATA) private graphConfig) { }

    ngOnInit() {
        var svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseTime = d3.timeParse("%d-%b-%y");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var area = d3.area()
            .x(function(d) { return x(d.date); })
            .y1(function(d) { return y(d.close); });

        d3.tsv("assets/areas.tsv", function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
            return d;
        }, (error, data) => {
            if (error) throw error;

            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.close; })]);
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
                .style("border-style",this.graphConfig.borderStyle)
                .style("border-color",this.graphConfig.borderColor)
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
                .style("border-style",this.graphConfig.borderStyle)
                .style("border-color",this.graphConfig.borderColor)
                .call(d3.axisLeft(y))
                .append("text");
        });
    }
}
