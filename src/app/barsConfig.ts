import { NgModule, InjectionToken } from '@angular/core';

export const BARS_DATA = new InjectionToken<any>('BarsData');

const BARS_CONFIG = {
    low: 16,
    medium: 48,
    high: 80,
    over: 100
};

@NgModule({
    providers: [{
        provide: BARS_DATA, useValue: BARS_CONFIG
    }]
})
export class BarsConfigModule {
}
