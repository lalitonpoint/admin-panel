import { Component, ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { GOOGLE_KEY_TYPE } from 'src/app/constants/constants';
import { GoogleKeySettingModalComponent } from 'src/app/containers/pages/google-key-setting-modal/google-key-setting-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-admin-google-key-settings',
  templateUrl: './admin-google-key-settings.component.html',
  styleUrls: ['./admin-google-key-settings.component.scss']
})
export class AdminGoogleKeySettingsComponent {

  GOOGLE_KEY_TYPE = GOOGLE_KEY_TYPE;

  @Input() setting_detail:any;
  @Output() google_key_data = new EventEmitter<any>();
  @ViewChild('googleKeySettingModal', { static: true }) googleKeySettingModal: GoogleKeySettingModalComponent;
  
  constructor(public _helper: Helper) { }

  //open modal
  showGoogleKeySettingModal(key_type): void{
    this.googleKeySettingModal.show(this.setting_detail,key_type);
  }
  //emit data
  getSettingData(){
    this.google_key_data.emit();
  }

}
