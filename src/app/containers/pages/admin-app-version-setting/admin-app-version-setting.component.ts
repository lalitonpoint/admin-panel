import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup,UntypedFormControl } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-admin-app-version-setting',
  templateUrl: './admin-app-version-setting.component.html',
  styleUrls: ['./admin-app-version-setting.component.scss']
})
export class AdminAppVersionSettingComponent implements OnInit {

  appVersionSettingsForm:UntypedFormGroup;
  is_edit_app_update_settings = false;

  @Input() setting_detail:any;
  @Output() app_version_data = new EventEmitter<any>();

  constructor(public _helper:Helper,private _settingService:SettingsService) { }

  ngOnInit(): void {
    this._initForm();
    if(this.setting_detail == null){
      this.is_edit_app_update_settings = true;
    }else{
      this.appVersionSettingsForm.disable();
    }
    this.appVersionSettingsForm.patchValue(this.setting_detail);
    this.appVersionSettingsForm.patchValue({
      setting_id:this.setting_detail._id
    });
  }

  //update datils
  onClickAppUpdateSetting(): void{
    if(this.appVersionSettingsForm.invalid){
      this.appVersionSettingsForm.markAllAsTouched();
    }
    this.is_edit_app_update_settings = !this.is_edit_app_update_settings;
    if(this.is_edit_app_update_settings){
      this.appVersionSettingsForm.enable();
    }else{
      this.appVersionSettingsForm.disable();
      this._settingService.updateSettingDetails(this.appVersionSettingsForm.value).then(res => {
        if(res.success){
          this.app_version_data.emit();
        }
      })
    }
  }

  // intialize form
  _initForm(){
    this.appVersionSettingsForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      android_user_app_version_code:new UntypedFormControl(null),
      android_provider_app_version_code:new UntypedFormControl(null),
      ios_user_app_version_code:new UntypedFormControl(null),
      ios_provider_app_version_code:new UntypedFormControl(null),
    })
  }

}
