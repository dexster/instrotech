import {NgModule} from '@angular/core';
import {SpectrumComponent} from './spectrum.component';
import {IQLService} from '../services/iql';

@NgModule({
    declarations: [
        SpectrumComponent
    ],
    exports: [
        SpectrumComponent
    ],
    providers: [IQLService]

})
export class SpectrumModule {
}
