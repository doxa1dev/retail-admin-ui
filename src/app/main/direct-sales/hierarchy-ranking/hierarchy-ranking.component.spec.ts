import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyRankingComponent } from './hierarchy-ranking.component';

describe('HierarchyRankingComponent', () => {
  let component: HierarchyRankingComponent;
  let fixture: ComponentFixture<HierarchyRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchyRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
