import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledActionComponent } from './cancelled-action.component';

describe('CompletedActionComponent', () => {
  let component: CancelledActionComponent;
  let fixture: ComponentFixture<CancelledActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
