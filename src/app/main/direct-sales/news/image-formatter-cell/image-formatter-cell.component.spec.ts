import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFormatterCellComponent } from './image-formatter-cell.component';

describe('ImageFormatterCellComponent', () => {
  let component: ImageFormatterCellComponent;
  let fixture: ComponentFixture<ImageFormatterCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageFormatterCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFormatterCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
