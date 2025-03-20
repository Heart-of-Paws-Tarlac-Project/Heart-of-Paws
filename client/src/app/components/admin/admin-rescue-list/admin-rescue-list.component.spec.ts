import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRescueListComponent } from './admin-rescue-list.component';

describe('AdminRescueListComponent', () => {
  let component: AdminRescueListComponent;
  let fixture: ComponentFixture<AdminRescueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRescueListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRescueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
