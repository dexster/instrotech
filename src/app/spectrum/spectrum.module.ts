import {NgModule} from '@angular/core';
import {SpectrumComponent} from './spectrum.component';
import {IQLService} from '../iql';

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
