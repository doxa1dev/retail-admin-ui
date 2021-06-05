import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedActionComponent } from './completed-action.component';

describe('CompletedActionComponent', () => {
  let component: CompletedActionComponent;
  let fixture: ComponentFixture<CompletedActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
