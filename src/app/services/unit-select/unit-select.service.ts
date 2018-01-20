import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class UnitSelectService {

    private selectedUnit = new Subject<number>();

    unitUpdated$ = this.selectedUnit.asObservable();

    updateUnit(unit: number) {
        this.selectedUnit.next(unit);
    }
}
