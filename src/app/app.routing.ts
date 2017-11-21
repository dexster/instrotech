import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UnitOverviewComponent} from './unit-overview/unit-overview.component';
import {MimicComponent} from './mimic/mimic.component';
import {TrendComponent} from './trend/trend.component';
import {SpectrumComponent} from './spectrum/spectrum.component';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'unitoverview',
        component: UnitOverviewComponent
    },
    {
        path: 'mimic',
        component: MimicComponent
    },
    {
        path: 'trend',
        component: TrendComponent
    },
    {
        path: 'spectrum',
        component: SpectrumComponent
    }
];

export const appRoutingProviders: any[] = [];
export const routing = RouterModule.forRoot(appRoutes, {useHash: true});