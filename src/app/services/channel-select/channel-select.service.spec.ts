import { TestBed, inject } from '@angular/core/testing';

import { UnitSelectService } from './unit-select.service';

describe('UnitSelectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitSelectService]
    });
  });

  it('should be created', inject([UnitSelectService], (service: UnitSelectService) => {
    expect(service).toBeTruthy();
  }));
});
