import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BasicAndTripSettingsModalComponent } from 'src/app/containers/pages/basic-and-trip-setting-modal/basic-and-trip-setting-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'admin-basic-settings',
  templateUrl: './admin-basic-settings.component.html',
  styleUrls: ['./admin-basic-settings.component.scss']
})
export class AdminBasicSettingsComponent {

  @Input() setting_detail:any;
  @Output() basic_setting_data = new EventEmitter<any>();
  @ViewChild('storeSettingModal', { static: true }) storeSettingModal: BasicAndTripSettingsModalComponent;
  
  constructor(public _helper:Helper) { }

  //open modal
  showStoreSettingModal(): void{
    this.storeSettingModal.show(this.setting_detail,1);
  }

  //emit data
  getSettingData(){
    this.basic_setting_data.emit();
  }

}
