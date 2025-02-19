import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypeCityAssociationComponent } from './type-city-association.component';

describe('TypeCityAssociationComponent', () => {
  let component: TypeCityAssociationComponent;
  let fixture: ComponentFixture<TypeCityAssociationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeCityAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeCityAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
