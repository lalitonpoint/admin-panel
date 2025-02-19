import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportHistoryModelComponent } from './export-history-model.component';

describe('UserModelComponent', () => {
  let component: ExportHistoryModelComponent;
  let fixture: ComponentFixture<ExportHistoryModelComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ExportHistoryModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportHistoryModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
