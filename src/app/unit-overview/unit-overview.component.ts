import { Component, AfterViewInit, Inject } from '@angular/core';
import { IQLService } from '../iql';
import { BandsService } from '../bands';
import * as d3 from 'd3';

@Component({
    selector: 'unit-overview',
    templateUrl: './unit-overview.component.html',
    styleUrls: ['./unit-overview.component.scss']
})
export class UnitOverviewComponent implements AfterViewInit {

    svg: any;
    xAxis: any;
    yAxis: any;
    selection: any;
    x: any;
    y: any;

    constructor(private iql: IQLService, private bands: BandsService) {
    }

    ngAfterViewInit() {
        this.render();
    }

    render() {
        this.bands.bands_setup('#unit-overview');


        d3.csv('assets/data.csv', this.type, (error, data) => {
            if (error) { throw error; }

            // data.sort(function(a, b) { return b.total - a.total; });
            this.bands.bands_draw(data);
        });

        d3.select(window).on('resize', () => {
            this.render();
        });
    }

    // resize() {
    //     if (this.selection) {
    //         const detectedHeight = window.innerHeight
    //             || document.documentElement.clientHeight
    //             || document.body.clientHeight;

    //         const aspect = parseInt(this.svg.style('width'), 10) / parseInt(this.svg.style('height'), 10);
    //         const targetWidth = this.svg.node().getBoundingClientRect().width;
    //         const targetHeight = this.svg.node().getBoundingClientRect().height;
    //         this.svg.attr('width', targetWidth);
    //         this.svg.attr('height', detectedHeight);
    //         this.selection.attr('width', this.x.bandwidth());
    //         this.xAxis.attr('transform', 'translate(0,' + detectedHeight + ')')

    //     }
    // }

    type(d, i, columns) {
        let t: any = 0;
        for (let j: any = 1; j < columns.length; ++j) {
            t += d[columns[j]] = +d[columns[j]];
        }
        d.total = t;
        return d;
    }
}
