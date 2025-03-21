import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRescueFormComponent } from './create-rescue-form.component';

describe('CreateRescueFormComponent', () => {
  let component: CreateRescueFormComponent;
  let fixture: ComponentFixture<CreateRescueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRescueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRescueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
