import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTextareaCommentComponent } from './dialog-textarea-comment.component';

describe('DialogTextareaCommentComponent', () => {
  let component: DialogTextareaCommentComponent;
  let fixture: ComponentFixture<DialogTextareaCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTextareaCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTextareaCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
