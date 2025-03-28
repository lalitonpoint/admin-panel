import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserModelComponent } from './user-model.component';

describe('UserModelComponent', () => {
  let component: UserModelComponent;
  let fixture: ComponentFixture<UserModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
