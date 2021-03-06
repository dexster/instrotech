import {NgModule} from '@angular/core';
import {UnitOverviewComponent} from './unit-overview.component';
import {IQLService} from '../services/iql';

@NgModule({
    declarations: [
        UnitOverviewComponent
    ],
    exports: [
        UnitOverviewComponent
    ],
    providers: [IQLService]

})
export class UnitOverviewModule {
}
