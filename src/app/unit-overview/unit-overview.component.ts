import {Component, AfterViewInit, Inject} from '@angular/core';
import {GRAPH_DATA} from '../chartConfig';
import * as d3 from 'd3';

@Component({
    selector: 'app-unit-overview',
    templateUrl: './unit-overview.component.html',
    styleUrls: ['./unit-overview.component.scss']
})
export class UnitOverviewComponent implements AfterViewInit {

    svg: any;

    constructor(@Inject(GRAPH_DATA) private graphConfig) {
    }

    ngAfterViewInit() {
        this.svg = d3.select("#stacked");
        let margin = {top: 20, right: 180, bottom: 30, left: 40},
            width = parseInt(this.svg.style("width")) - margin.left - margin.right,
            height = parseInt(this.svg.style("height")) - margin.top - margin.bottom,
            g = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // var margin = {top: 20, right: 150, bottom: 50, left: 40},
        //     width = 600 - margin.left - marginStacked.right,
        //     height = 500 - margin.top - marginStacked.bottom;
        //
        //
        // var svg = d3.select("#stacked").append("svg")
        //     .attr("width", widthStacked + marginStacked.left + marginStacked.right)
        //     .attr("height", heightStacked + marginStacked.top + marginStacked.bottom)
        //   .append("g")
        //     .attr("transform", "translate(" + marginStacked.left + "," + marginStacked.top + ")");

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.3)
            .align(0.3);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["#14B5EB", "#20C45C", "#FAC750", "#DC2846"]);

        var stack = d3.stack();

        d3.csv("assets/data.csv", this.type, (error, data) => {
            if (error) throw error;

            // data.sort(function(a, b) { return b.total - a.total; });

            x.domain(data.map(function (d) {
                return d.unit;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.total;
            })]).nice();
            z.domain(data.columns.slice(1));

            g.selectAll(".serie")
                .data(stack.keys(data.columns.slice(1))(data))
                .enter().append("g")
                .attr("class", "serie")
                .attr("fill", function (d) {
                    return z(d.key);
                })
                .selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter().append("rect")
                .attr("x", function (d) {
                    return x(d.data.unit);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("height", function (d) {
                    return y(d[0]) - y(d[1]);
                })
                .attr("width", x.bandwidth());

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", this.graphConfig.xAxisName)
                .style("stroke", this.graphConfig.stroke)
                .style("border", this.graphConfig.borderWidth)
                .style("border-style", this.graphConfig.borderStyle)
                .style("border-color", this.graphConfig.borderColor).call(d3.axisBottom(x));

            g.append("g")
                .attr("class", this.graphConfig.yAxisName)
                .style("stroke", this.graphConfig.stroke)
                .style("border", this.graphConfig.borderWidth)
                .style("border-style", this.graphConfig.borderStyle)
                .style("border-color", this.graphConfig.borderColor)
                .call(d3.axisLeft(y).ticks(10, "s"))
                .append("text")
                .attr("x", 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", "start")
                .attr("fill", "#fff");

            // var legend = g.selectAll(".legend")
            //     .data(data.columns.slice(1).reverse())
            //     .enter().append("g")
            //     .attr("class", "legend")
            //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            //     .style("font", "10px sans-serif");
            //
            // legend.append("rect")
            //     .attr("x", width + 18)
            //     .attr("width", 18)
            //     .attr("height", 18)
            //     .attr("fill", z);
            //
            // legend.append("text")
            //     .attr("x", width + 44)
            //     .attr("y", 9)
            //     .attr("dy", ".35em")
            //     .attr("text-anchor", "start")
            //     .text(function(d) { return d; });
        });

        d3.select(window).on('resize', () => {
            this.resize();
        });

        this.resize();
    }

    resize() {
        let aspect = parseInt(this.svg.style("width")) / parseInt(this.svg.style("height"));
        let width = parseInt(d3.select("#stacked").style("width")),
            height = parseInt(d3.select("#stacked").style("height"));
        let targetWidth = this.svg.node().getBoundingClientRect().width;
        this.svg.attr("width", targetWidth);
        this.svg.attr("height", targetWidth / aspect);
    }


    function

    type(d, i, columns) {
        var t: any = 0;
        for (var i: any = 1; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }
}
