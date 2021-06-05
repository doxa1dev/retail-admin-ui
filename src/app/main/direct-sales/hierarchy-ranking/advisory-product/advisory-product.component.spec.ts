import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryProductComponent } from './advisory-product.component';

describe('AdvisoryProductComponent', () => {
  let component: AdvisoryProductComponent;
  let fixture: ComponentFixture<AdvisoryProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisoryProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
