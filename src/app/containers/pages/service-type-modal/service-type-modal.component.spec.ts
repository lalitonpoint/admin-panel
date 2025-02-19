import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceTypeModalComponent } from './service-type-modal.component';

describe('ServiceTypeModalComponent', () => {
  let component: ServiceTypeModalComponent;
  let fixture: ComponentFixture<ServiceTypeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
