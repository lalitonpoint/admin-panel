import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSettingsComponent } from './trip-settings.component';

describe('TripSettingsComponent', () => {
  let component: TripSettingsComponent;
  let fixture: ComponentFixture<TripSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
