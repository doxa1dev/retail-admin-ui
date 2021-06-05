import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditButtonRenderComponent } from './edit-button-render.component';

describe('EditButtonRenderComponent', () => {
  let component: EditButtonRenderComponent;
  let fixture: ComponentFixture<EditButtonRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditButtonRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditButtonRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
