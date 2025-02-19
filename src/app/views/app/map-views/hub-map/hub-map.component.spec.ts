import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubMapComponent } from './hub-map.component';

describe('HubMapComponent', () => {
  let component: HubMapComponent;
  let fixture: ComponentFixture<HubMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HubMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
