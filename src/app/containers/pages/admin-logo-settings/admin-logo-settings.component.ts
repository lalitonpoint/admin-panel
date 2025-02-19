import { Component, OnInit } from '@angular/core';
import { Helper } from 'src/app/shared/helper';
import { SettingsService } from 'src/app/services/settings.service';
import { NotifiyService } from 'src/app/services/notifier.service';

export const admin_logo = {
  logo: 1,
  title_icon: 2,
  mail_title_logo: 3,
  authorised_logo: 4,
  user_logo: 5,
  dark_header_logo : 6,
  dark_website_logo : 7,
}

export const admin_logo_name = {
  1: 'logo_image',
  2: 'title_image',
  3: 'mail_title_image',
  4: 'authorised_image',
  5: 'user_logo',
  6: 'dark_header_logo',
  7: 'dark_website_logo',
}

@Component({
  selector: 'app-admin-logo-settings',
  templateUrl: './admin-logo-settings.component.html',
  styleUrls: ['./admin-logo-settings.component.scss']
})
export class AdminLogoSettingsComponent implements OnInit {
  public formData: FormData;
  admin_logo = admin_logo;
  admin_logo_name = admin_logo_name;
  upload_images = {
    logo_image: '',
    title_image: '',
    mail_title_image: '',
    authorised_image: '',
    user_logo: '',
    dark_header_logo: '',
    dark_website_logo: '',
  }
  is_edit_logo_settings = false;
  is_edit_dark_logo_settings = false;
  darkTheme = localStorage.getItem('vien-themecolor')
  logoClr:boolean=false;

  constructor(public _helper: Helper, private _settingService: SettingsService,private _notifierService:NotifiyService) { }

  ngOnInit(): void {
    if(this.darkTheme.startsWith('dark') ){
      this.logoClr=true;
    }
  }

  //toggle between edit and save and on save click update data
  onClickLogoSetting(): void {
    this.is_edit_logo_settings = !this.is_edit_logo_settings;
    if (this.is_edit_logo_settings) {
      this.formData = new FormData();
    } else {
      this.formData.append('admin_id',this._helper.user_details._id);
      this._settingService.uploadLogoImages(this.formData);
    }
  }

  //toggle between edit and save and on save click update data
  onClickDarkLogoSetting(): void {
    this.is_edit_dark_logo_settings = !this.is_edit_dark_logo_settings;
    if (this.is_edit_dark_logo_settings) {
      this.formData = new FormData();
    } else {
      this.formData.append('admin_id',this._helper.user_details._id);
      this._settingService.uploadLogoImages(this.formData);
    }
  }

  //select image and render
  onSelectImageFile(event, type) {
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.only-images-are-supported'))
      return;
    }
    const logo_image = files[0];
    this.formData.append(admin_logo_name[type], logo_image);

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.upload_images[admin_logo_name[type]] = reader.result
    }
  }

}
