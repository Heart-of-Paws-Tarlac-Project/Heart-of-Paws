import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRescueFormComponent } from './update-rescue-form.component';

describe('UpdateRescueFormComponent', () => {
  let component: UpdateRescueFormComponent;
  let fixture: ComponentFixture<UpdateRescueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRescueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRescueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
