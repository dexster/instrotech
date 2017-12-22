import 'zone.js';
import 'reflect-metadata';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {routing, appRoutingProviders} from './app.routing';

import {MatTabsModule, MatIconModule, MatRadioModule} from '@angular/material';
import {TimesPipe} from './services/times.pipe/times.pipe';

import {GraphConfigModule} from './chartConfig';

import {AppComponent} from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnitOverviewComponent } from './unit-overview/unit-overview.component';
import { MimicComponent } from './mimic/mimic.component';
import { TrendComponent } from './trend/trend.component';
import { SpectrumComponent } from './spectrum/spectrum.component';
import {ChannelsComponent} from './channels/channels.component';
import {UnitsComponent} from './units/units.component';
import { IQLService } from './iql';
import { FFTService } from './fft';
import { BandsService } from './bands';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        UnitOverviewComponent,
        MimicComponent,
        TrendComponent,
        SpectrumComponent,
        ChannelsComponent,
        UnitsComponent,
        TimesPipe
    ],
    imports: [
        routing,
        BrowserModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatIconModule,
        MatRadioModule,
        GraphConfigModule
    ],
    providers: [appRoutingProviders, IQLService, FFTService, BandsService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
