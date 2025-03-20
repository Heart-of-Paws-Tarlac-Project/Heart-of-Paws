import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueOverviewComponent } from './rescue-overview.component';

describe('RescueOverviewComponent', () => {
  let component: RescueOverviewComponent;
  let fixture: ComponentFixture<RescueOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescueOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescueOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
