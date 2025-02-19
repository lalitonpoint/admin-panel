import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypeRequestsComponent } from './type-requests.component';

describe('TypeRequestsComponent', () => {
  let component: TypeRequestsComponent;
  let fixture: ComponentFixture<TypeRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
