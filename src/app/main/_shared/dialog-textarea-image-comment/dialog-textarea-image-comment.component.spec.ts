import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTextareaImageCommentComponent } from './dialog-textarea-image-comment.component';

describe('DialogTextareaImageCommentComponent', () => {
  let component: DialogTextareaImageCommentComponent;
  let fixture: ComponentFixture<DialogTextareaImageCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTextareaImageCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTextareaImageCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
