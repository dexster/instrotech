import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatRadioGroup} from '@angular/material';
import {UnitSelectService} from '../services/unit-select/unit-select.service';

@Component({
    selector: 'units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements AfterViewInit {
    @ViewChild('unitRadioGroup') unitRadioGroup: MatRadioGroup;
    selectedUnit: number;

    constructor(private unitSelectService: UnitSelectService) {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.selectedUnit = 1;
        });
    }

    unitChanged() {
        this.unitSelectService.updateUnit(this.selectedUnit);
    }
}
