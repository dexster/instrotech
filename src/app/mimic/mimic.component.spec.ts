import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MimicComponent } from './mimic.component';

describe('MimicComponent', () => {
  let component: MimicComponent;
  let fixture: ComponentFixture<MimicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MimicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MimicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
