import {Component, OnInit, Inject} from '@angular/core';
import {GRAPH_DATA} from '../chartConfig';
import * as d3 from 'd3';

@Component({
    selector: 'app-unit-overview',
    templateUrl: './unit-overview.component.html',
    styleUrls: ['./unit-overview.component.scss']
})
export class UnitOverviewComponent implements OnInit {

    margin = {top: 10, right: 10, bottom: 25, left: 35};
    maxWidth = 5120;
    maxHeight = 2880;
    xVariable = 'unit';
    yVariable = 'total';
    xAxis;
    yAxis;
    xValue;
    yValue;
    faintGray = '#ededed';

    xScale = d3.scaleBand();
    yScale = d3.scaleLinear();

    layers;
    data;
    svg;

    constructor(@Inject(GRAPH_DATA) private graphConfig) {
        this.xAxis = d3.axisBottom().scale(this.xScale);
        this.yAxis = d3.axisLeft().scale(this.yScale);
        this.xValue = (d) => d[this.xVariable];
        this.yValue = (d) => d[this.yVariable];
        this.layers = this.defineLayers();
    }

    ngOnInit() {
        d3.csv('assets/data.csv', this.type, (error, response) => {
                this.updateData(response);
                this.render();
            }
        );
    }

    defineLayers() {
        this.svg = d3.select('body').append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        const chartArea = this.svg.append('g')
            .classed('chartArea', true)
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        const barGroup = chartArea.append('g')
            .classed('bars', true);

        const xAxisG = chartArea.append('g')
            .classed('axis', true)
            .classed('x', true);

        const yAxisG = chartArea.append('g')
            .classed('axis', true)
            .classed('y', true);

        return {
            chartArea, barGroup, xAxisG, yAxisG
        }
    }

    type(d, i, columns) {
        var t: any = 0;
        for (var i: any = 1; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }

    updateData(newData) {
        this.data = newData;
        this.xScale.domain(this.data.map(this.xValue));
        this.yScale.domain([0, d3.max(this.data.map(this.yValue))]);
    }

    render() {
        this.updateScales();
        this.renderAxes();
        this.renderBars();
    }

    updateScales() {
        let targetWidth = this.svg.node().getBoundingClientRect().width;
        let targetHeight = this.svg.node().getBoundingClientRect().height;
        const newWidth = d3.min([targetWidth, this.maxWidth]) - this.margin.left - this.margin.right;
        const newHeight = d3.min([targetHeight, this.maxHeight]) - this.margin.top - this.margin.bottom;

        this.xScale
            .range([0, newWidth])
            .paddingInner(0.1)
            .bandwidth(10);

        this.yScale.range([newHeight, 0]);
    }

    renderAxes() {
        let targetWidth = this.svg.node().getBoundingClientRect().width;
        let targetHeight = this.svg.node().getBoundingClientRect().height;
        const newHeight = d3.min([targetHeight, this.maxHeight]);

        this.layers.xAxisG
            .transition().duration(150)
            .attr('transform', `translate(0, ${newHeight - this.margin.top - this.margin.bottom})`)
            .call(this.xAxis);

        this.layers.yAxisG
            .transition().duration(150)
            .call(this.yAxis);

        // style the axes
        // d3.selectAll('.axis text')
        //     .styles({
        //         'font-family': 'sans-serif',
        //         'font-size': '10px'
        //     });
        //
        // d3.selectAll('.axis path')
        //     .styles({
        //         fill: 'none',
        //         stroke: '#161616'
        //     });
        //
        // d3.selectAll('.axis line')
        //     .styles({'stroke': 'black'});
    }

    renderBars() {
        const updateSelection = this.layers.barGroup.selectAll('rect').data(this.data);
        const enterSelection = updateSelection.enter().append('rect');
        const mergeSelection = updateSelection.merge(enterSelection);
        const exitSelection = updateSelection.exit();

        // enterSelection
        //     .classed('rect', true)
        //     .style('fill', this.faintGray)
        //     .on('mouseover', this.onBarActive)
        //     .on('mouseout', this.onBarInactive);
        //
        // mergeSelection
        //     .transition().duration(150)
        //     .attrs({
        //         x: (d) => this.xScale(this.xValue(d)),
        //         width: this.xScale.bandwidth,
        //         y: (d) => this.yScale(this.yValue(d)),
        //         height: (d) => this.yScale(0) - this.yScale(this.yValue(d))
        //     });
        //
        // exitSelection
        //     .on('mouseover', null)
        //     .on('mouseout', null)
        //     .remove();
    }

    onBarActive() {
        d3.select(this)
            .styles({
                'fill': 'steelblue',
                'fill-opacity': 0.6
            });
    }

    onBarInactive() {
        d3.select(this)
            .styles({
                'fill': this.faintGray,
                'fill-opacity': 1
            });
    }
}


// ngAfterViewInit2() {
//     this.svg = d3.select("#stackedbars").append('svg');
//     let margin = {top: 20, right: 180, bottom: 30, left: 40},
//             width = parseInt(this.svg.style("width")) - margin.left - margin.right,
//             height = parseInt(this.svg.style("height")) - margin.top - margin.bottom,
//             g = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//         this.y = d3.scaleLinear()
//             .rangeRound([height, 0]);
//
//         var z = d3.scaleOrdinal()
//             .range(["#14B5EB", "#20C45C", "#FAC750", "#DC2846"]);
//
//         var stack = d3.stack();
//
//         d3.csv("assets/data.csv", this.type, (error, data) => {
//             if (error) throw error;
//
//             // data.sort(function(a, b) { return b.total - a.total; });
//
//             this.x = d3.scaleBand()
//                 .rangeRound([0, width])
//                 .padding(0.3)
//                 .align(0.3)
//                 .domain(data.map(function (d) {
//                     return d.unit;
//                 }));
//
//             // this.x.domain(data.map(function (d) {
//             //     return d.unit;
//             // }));
//             this.y.domain([0, d3.max(data, function (d) {
//                 return d.total;
//             })]).nice();
//             z.domain(data.columns.slice(1));
//
//             this.selection = g.selectAll(".serie")
//                 .data(stack.keys(data.columns.slice(1))(data))
//                 .enter().append("g")
//                 .attr("class", "serie")
//                 .attr("fill", function (d) {
//                     return z(d.key);
//                 })
//                 .selectAll("rect")
//                 .data(function (d) {
//                     return d;
//                 })
//                 .enter().append("rect")
//                 .attr("x", (d) => {
//                     return this.x(d.data.unit);
//                 })
//                 .attr("y", (d) => {
//                     return this.y(d[1]);
//                 })
//                 .attr("height", (d) => {
//                     return this.y(d[0]) - this.y(d[1]);
//                 })
//                 .attr("width", this.x.bandwidth());
//
//             this.xAxis = g.append("g")
//                 .attr("transform", "translate(0," + height + ")")
//                 .attr("class", this.graphConfig.xAxisName)
//                 .style("stroke", this.graphConfig.stroke)
//                 .style("border", this.graphConfig.borderWidth)
//                 .style("border-style", this.graphConfig.borderStyle)
//                 .style("border-color", this.graphConfig.borderColor).call(d3.axisBottom(this.x));
//
//             this.yAxis = g.append("g")
//                 .attr("class", this.graphConfig.yAxisName)
//                 .style("stroke", this.graphConfig.stroke)
//                 .style("border", this.graphConfig.borderWidth)
//                 .style("border-style", this.graphConfig.borderStyle)
//                 .style("border-color", this.graphConfig.borderColor)
//                 .call(d3.axisLeft(this.y).ticks(10, "s"))
//                 .append("text")
//                 .attr("x", 2)
//                 .attr("dy", "0.35em")
//                 .attr("text-anchor", "start")
//                 .attr("fill", "#fff");
//
//             // var legend = g.selectAll(".legend")
//             //     .data(data.columns.slice(1).reverse())
//             //     .enter().append("g")
//             //     .attr("class", "legend")
//             //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
//             //     .style("font", "10px sans-serif");
//             //
//             // legend.append("rect")
//             //     .attr("x", width + 18)
//             //     .attr("width", 18)
//             //     .attr("height", 18)
//             //     .attr("fill", z);
//             //
//             // legend.append("text")
//             //     .attr("x", width + 44)
//             //     .attr("y", 9)
//             //     .attr("dy", ".35em")
//             //     .attr("text-anchor", "start")
//             //     .text(function(d) { return d; });
//         });
//
//         d3.select(window).on('resize', () => {
//             this.resize();
//         });
//
//         this.resize();
//     }
//
//     resize() {
//         if (this.selection) {
//             const detectedHeight = window.innerHeight
//                 || document.documentElement.clientHeight
//                 || document.body.clientHeight;
//
//             let aspect = parseInt(this.svg.style("width")) / parseInt(this.svg.style("height"));
//             // let width = parseInt(d3.select("#stackedbars").style("width")),
//             //     height = parseInt(d3.select("#stackedbars").style("height"));
//             let targetWidth = this.svg.node().getBoundingClientRect().width;
//             let targetHeight = this.svg.node().getBoundingClientRect().height;
//             this.svg.attr("width", targetWidth);
//             this.svg.attr("height", detectedHeight);
//             this.selection.attr("width", this.x.bandwidth());
//             this.xAxis.attr("transform", "translate(0," + detectedHeight + ")")
//
//             this.x.rangeRound([0, targetWidth], 0.1);
//
//
//         }
//     }
//
//
//     type(d, i, columns) {
//         var t: any = 0;
//         for (var i: any = 1; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
//         d.total = t;
//         return d;
//     }
// }
