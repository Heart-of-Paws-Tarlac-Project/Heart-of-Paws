import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRescueFormComponent } from './admin-rescue-form.component';

describe('AdminRescueFormComponent', () => {
  let component: AdminRescueFormComponent;
  let fixture: ComponentFixture<AdminRescueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRescueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRescueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
