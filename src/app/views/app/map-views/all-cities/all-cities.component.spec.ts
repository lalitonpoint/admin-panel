import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllCitiesComponent } from './all-cities.component';

describe('AllCitiesComponent', () => {
  let component: AllCitiesComponent;
  let fixture: ComponentFixture<AllCitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
