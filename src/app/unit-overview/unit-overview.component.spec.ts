import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOverviewComponent } from './unit-overview.component';

describe('UnitOverviewComponent', () => {
  let component: UnitOverviewComponent;
  let fixture: ComponentFixture<UnitOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
