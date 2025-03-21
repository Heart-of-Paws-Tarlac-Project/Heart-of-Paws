import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueApplicationsComponent } from './rescue-applications.component';

describe('RescueApplicationsComponent', () => {
  let component: RescueApplicationsComponent;
  let fixture: ComponentFixture<RescueApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescueApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescueApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
