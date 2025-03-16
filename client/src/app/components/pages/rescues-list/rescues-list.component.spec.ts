import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescuesListComponent } from './rescues-list.component';

describe('RescuesListComponent', () => {
  let component: RescuesListComponent;
  let fixture: ComponentFixture<RescuesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescuesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
