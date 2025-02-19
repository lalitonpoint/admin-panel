import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

export class LegalInfo {
  user_terms_and_condition:string = '';
  user_privacy_policy:string = '';
  provider_terms_and_condition:string = '';
  provider_privacy_policy:string = '';
  user_delete_policy:string = '';
  provider_delete_policy:string = '';
  _id:string='';
}

@Component({
  selector: 'app-terms-privacy-setting',
  templateUrl: './terms-privacy-setting.component.html',
  styleUrls: ['./terms-privacy-setting.component.scss']
})
export class TermsPrivacySettingComponent implements OnInit {
  legal_info: LegalInfo = new LegalInfo();
  setting_detail:any;
  subadmin_readonly:boolean = false;

  constructor(private _settingService:SettingsService,public _helper:Helper) { }

  ngOnInit(): void {
    //get terms and condition
    let json: any = { admin_id: this._helper.user_details._id };
    this._settingService.getSettingDetails(json).then((response) => {
      if(response.success){
        this.legal_info = response.setting_detail[0];
      }
    })
    setTimeout(() => {
      if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
        this.subadmin_readonly = true;
      }
    }, 1000);
  }
  
  //update data
  save(){
    let json:any = {
      setting_id:this.legal_info._id,
      user_terms_and_condition:this.legal_info.user_terms_and_condition,
      user_privacy_policy:this.legal_info.user_privacy_policy,
      provider_terms_and_condition:this.legal_info.provider_terms_and_condition,
      provider_privacy_policy:this.legal_info.provider_privacy_policy,
      user_delete_policy:this.legal_info.user_delete_policy,
      provider_delete_policy:this.legal_info.provider_delete_policy,
    }
    this._settingService.updateSettingDetails(json).then(res => {
      if(res.success){
        this.ngOnInit();
      }
    })
  }

}
