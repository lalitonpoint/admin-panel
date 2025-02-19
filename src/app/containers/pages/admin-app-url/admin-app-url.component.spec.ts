import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminAppUrlComponent } from './admin-app-url.component';

describe('AdminAppUrlComponent', () => {
  let component: AdminAppUrlComponent;
  let fixture: ComponentFixture<AdminAppUrlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAppUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAppUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
