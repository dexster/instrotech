import {Component, Inject, AfterViewInit} from '@angular/core';
import {GRAPH_DATA} from '../chartConfig';
import * as d3 from 'd3';

@Component({
    selector: 'trend',
    templateUrl: './trend.component.html',
    styleUrls: ['./trend.component.scss']
})
export class TrendComponent implements AfterViewInit {

    svg: any;

    constructor(@Inject(GRAPH_DATA) private graphConfig) {
    }

    ngAfterViewInit() {
        // this.render();
    }

    render() {
        this.svg = d3.select("#trend > svg").remove();
        this.svg = d3.select("#trend").append('svg');
        const margin = {top: 20, right: 40, bottom: 50, left: 40};

        let width = document.querySelector('trend .chart-container').getBoundingClientRect().width - margin.left - margin.right;
        let height = document.querySelector('trend .chart-container').getBoundingClientRect().height - margin.top - margin.bottom;
        let g = this.svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let parseTime = d3.timeParse("%Y%m%d");

        let x = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10);

        let line = d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.temperature);
            });

        d3.tsv("assets/trend.csv", type, (error, data) => {
            if (error) throw error;

            let cities = data.columns.slice(1).map(function (id) {
                return {
                    id: id,
                    values: data.map(function (d) {
                        return {date: d.date, temperature: d[id]};
                    })
                };
            });

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));

            y.domain([
                d3.min(cities, function (c) {
                    return d3.min(c.values, function (d) {
                        return d.temperature;
                    });
                }),
                d3.max(cities, function (c) {
                    return d3.max(c.values, function (d) {
                        return d.temperature;
                    });
                })
            ]);

            z.domain(cities.map(function (c) {
                return c.id;
            }));

            g.append("g")
                .attr("class", this.graphConfig.xAxisName)
                .style("stroke", this.graphConfig.stroke)
                .style("border", this.graphConfig.borderWidth)
                .style("border-style", this.graphConfig.borderStyle)
                .style("border-color", this.graphConfig.borderColor)
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", this.graphConfig.yAxisName)
                .style("stroke", this.graphConfig.stroke)
                .style("border", this.graphConfig.borderWidth)
                .style("border-style", this.graphConfig.borderStyle)
                .style("border-color", this.graphConfig.borderColor).call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Temperature, ºF");

            let city = g.selectAll(".city")
                .data(cities)
                .enter().append("g")
                .attr("class", "city");

            city.append("path")
                .attr("class", "line")
                .attr("d", function (d) {
                    return line(d.values);
                })
                .style("stroke", function (d) {
                    return z(d.id);
                });

            city.append("text")
                .datum(function (d) {
                    return {id: d.id, value: d.values[d.values.length - 1]};
                })
                .attr("transform", function (d) {
                    return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
                })
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font", "10px sans-serif")
                .text(function (d) {
                    return d.id;
                });
        });

        d3.select(window).on('resize', () => {
            this.render();
        });

        function type(d, _, columns) {
            d.date = parseTime(d.date);
            for (let i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            return d;
        }
    }
}
