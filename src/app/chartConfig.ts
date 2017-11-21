import {NgModule, InjectionToken} from '@angular/core';

export const GRAPH_DATA = new InjectionToken<any>('GraphData');

const GRAPH_CONFIG = {
    yAxisName: 'axis axis--y',
    xAxisName: 'axis axis--x',
    stroke: '#fff',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#f00'
};

@NgModule({
    providers: [{
        provide: GRAPH_DATA, useValue: GRAPH_CONFIG
    }]
})
export class GraphConfigModule {
}
