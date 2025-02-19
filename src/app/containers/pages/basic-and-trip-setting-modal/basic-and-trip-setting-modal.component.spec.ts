import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicAndTripSettingsModalComponent } from './basic-and-trip-setting-modal.component';

describe('BasicAndTripSettingsModalComponent', () => {
  let component: BasicAndTripSettingsModalComponent;
  let fixture: ComponentFixture<BasicAndTripSettingsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicAndTripSettingsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicAndTripSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
