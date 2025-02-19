import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.scss']
})
export class AdminSettingComponent implements OnInit {
  is_edit_app_update_settings = false;
  is_gcm_api_key_settings = false;
  is_edit_ios_certificate_settings = false;
  setting_detail:any;
  admin_detail:any

  constructor(public _settingService:SettingsService,public _helper:Helper) {
    this.admin_detail = _helper.user_details;
  }

  ngOnInit(): void {
    this.getSettingData();
  }

  onClickAppUpdateSetting(): void{
    this.is_edit_app_update_settings = !this.is_edit_app_update_settings;
  }

  onClickGCMApiKeySetting(): void{
    this.is_gcm_api_key_settings = !this.is_gcm_api_key_settings;
  }

  onClickIOSCertificatesSetting(): void{
    this.is_edit_ios_certificate_settings = !this.is_edit_ios_certificate_settings;
  }

  getSettingData() {
    let json: any = { admin_id: this._helper.user_details._id };
    this._settingService.getSettingDetails(json).then((response) => {
      if(response.success){
        this.setting_detail = response.setting_detail[0];
        if(response.setting_detail){
          this._helper.timeZone.next(response.setting_detail[0].timezone_for_display_date);
          this._helper.decimal.next(response.setting_detail[0].decimal_point_value);
          this._helper.admin_settings.next(response.setting_detail[0]);
        }
      }
    })
  }
}
