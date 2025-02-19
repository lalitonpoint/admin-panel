import { Component, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-whatsapp-configuration',
  templateUrl: './whatsapp-configuration.component.html',
  styleUrls: ['./whatsapp-configuration.component.scss']
})
export class WhatsappConfigurationComponent {

  @Input() setting_detail:any;

  constructor(private _settingService:SettingsService,private _helper:Helper) { }

  logout() {
    let json: any = {}
    this._settingService.whatsappLogout(json).then((response: any) => {
      if (response.success) {
        this._helper.helper_is_loading = true;
        setTimeout(() => {
          this._helper.helper_is_loading = false;
          this.getSettingData();
        }, 6000);
      }
    })
  }

  getSettingData() {
    let json: any = { admin_id: this._helper.user_details._id };
    this._settingService.getSettingDetails(json).then((response) => {
      if (response.success) {
        this.setting_detail = response.setting_detail[0];
      }
    })
  }

}
