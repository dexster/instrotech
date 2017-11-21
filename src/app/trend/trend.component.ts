import { Component, OnInit, Inject } from '@angular/core';
import {GRAPH_DATA} from '../chartConfig';
import * as d3 from 'd3';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.scss']
})
export class TrendComponent implements OnInit {

  constructor (@Inject(GRAPH_DATA) private graphConfig) { }

  ngOnInit() {
      // set the dimensions and margins of the graph
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

// parse the date / time
      var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

// define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
      var svg = d3.select("#trend").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
      d3.csv("assets/trend.csv", (error, data) => {
          if (error) throw error;

          // format the data
          data.forEach(function(d) {
              d.date = parseTime(d.date);
              d.close = +d.close;
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return d.close; })]);

          // Add the valueline path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .attr("d", valueline);

          // Add the X Axis
          svg.append("g")
              .attr("class", this.graphConfig.xAxisName)
              .style("stroke", this.graphConfig.stroke)
              .style("border", this.graphConfig.borderWidth)
              .style("border-style",this.graphConfig.borderStyle)
              .style("border-color",this.graphConfig.borderColor)
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // Add the Y Axis
          svg.append("g")
              .attr("class", this.graphConfig.yAxisName)
              .style("stroke", this.graphConfig.stroke)
              .style("border", this.graphConfig.borderWidth)
              .style("border-style",this.graphConfig.borderStyle)
              .style("border-color",this.graphConfig.borderColor)
              .call(d3.axisLeft(y));
      });
  }
}