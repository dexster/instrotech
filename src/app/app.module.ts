import 'zone.js';
import 'reflect-metadata';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import {LoggerService} from './services/logger/logger.service';

import { routing, appRoutingProviders } from './app.routing';

import { MatTabsModule, MatIconModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { TimesPipe } from './services/times.pipe/times.pipe';

import { GraphConfigModule } from './chartConfig';
import { BarsConfigModule } from './barsConfig';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnitOverviewComponent } from './unit-overview/unit-overview.component';
import { MimicComponent } from './mimic/mimic.component';
import { TrendComponent } from './trend/trend.component';
import { SpectrumComponent } from './spectrum/spectrum.component';
import { ChannelsComponent } from './channels/channels.component';
import { UnitsComponent } from './units/units.component';
// import { IQLService } from './iql';
import { FFTService } from './services/fft';
import { BandsService } from './services/bands';
import { UnitSelectService } from './services/unit-select/unit-select.service';
import { ChannelSelectService } from './services/channel-select/channel-select.service';

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
        FormsModule,
        MatTabsModule,
        MatIconModule,
        MatRadioModule,
        MatCheckboxModule,
        GraphConfigModule,
        BarsConfigModule,
        LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR})
],
    providers: [appRoutingProviders, FFTService, BandsService, UnitSelectService, ChannelSelectService, LoggerService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
