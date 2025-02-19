import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripChargeSettingmodalComponent } from './trip-charge-settingmodal.component';

describe('TripChargeSettingmodalComponent', () => {
  let component: TripChargeSettingmodalComponent;
  let fixture: ComponentFixture<TripChargeSettingmodalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripChargeSettingmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripChargeSettingmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
