import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup,UntypedFormControl,Validators } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-app-force-update-settings',
  templateUrl: './app-force-update-settings.component.html',
  styleUrls: ['./app-force-update-settings.component.scss']
})
export class AppForceUpdateSettingsComponent implements OnInit {

  appVersionSettingsForm:UntypedFormGroup;
  is_edit_app_update_settings = false;
  appForceUpdateForm: UntypedFormGroup;
  is_edit_force_update_settings = false;

  @Input() setting_detail:any;
  @Output() force_update_event = new EventEmitter<any>();

  constructor(public _helper:Helper,private _settingService:SettingsService) { }

  ngOnInit(): void {
    this._initForm();
    if(this.setting_detail == null){
      this.is_edit_force_update_settings = true;
    }else{
      this.appForceUpdateForm.disable();
    }
    this.appForceUpdateForm.patchValue(this.setting_detail);
    this.appForceUpdateForm.patchValue({
      setting_id:this.setting_detail._id
    });
  }

  // intialize form
  _initForm(){
    this.appForceUpdateForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null),
      android_user_app_force_update: new UntypedFormControl(null, Validators.required),
      android_provider_app_force_update: new UntypedFormControl(null, Validators.required),
      ios_user_app_force_update: new UntypedFormControl(null, Validators.required),
      ios_provider_app_force_update: new UntypedFormControl(null, Validators.required),
    })

  }

  //toggle between edit and save and on save click update data
  onClickAppForceSetting() {
    this.is_edit_force_update_settings = !this.is_edit_force_update_settings;
    if (this.is_edit_force_update_settings) {
      this.appForceUpdateForm.enable();
    } else {
      this.appForceUpdateForm.disable();
      this._settingService.updateSettingDetails(this.appForceUpdateForm.value).then(res => {
        if(res.success){
          this.force_update_event.emit();
        }
      });
    }
  }

}
