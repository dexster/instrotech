import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    navLinks: object[] = [
        {path: 'dashboard', label: 'Dashboard'},
        {path: 'unitoverview', label: 'Unit overview'},
        {path: 'mimic', label: 'Mimic'},
        {path: 'spectrum', label: 'Spectrum'},
        {path: 'trend', label: 'Trend'}
    ];
}
