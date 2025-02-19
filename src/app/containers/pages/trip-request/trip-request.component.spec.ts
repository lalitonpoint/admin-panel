import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRequestComponent } from './trip-request.component';

describe('RequestComponent', () => {
  let component: TripRequestComponent;
  let fixture: ComponentFixture<TripRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripRequestComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TripRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
