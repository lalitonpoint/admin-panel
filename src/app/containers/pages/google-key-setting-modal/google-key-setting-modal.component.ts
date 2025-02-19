import { Component, OnInit, TemplateRef, ViewChild,Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup,UntypedFormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { GOOGLE_KEY_TYPE } from 'src/app/constants/constants';

@Component({
  selector: 'app-google-key-setting-modal',
  templateUrl: './google-key-setting-modal.component.html',
  styleUrls: ['./google-key-setting-modal.component.scss']
})
export class GoogleKeySettingModalComponent implements OnInit {
  googleApiForm:UntypedFormGroup;
  webGoogleApiForm:UntypedFormGroup;
  flutterGoogleApiForm:UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  key_type:number;
  GOOGLE_KEY_TYPE = GOOGLE_KEY_TYPE;
  modal_heading:string = '';

  @Output() google_key_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService,private _settingService:SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //initialize form
  _initForm(){
    this.googleApiForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      google_map_key: new UntypedFormControl(null),
      google_placeautocomplate_key: new UntypedFormControl(null),
      google_geocoding_key: new UntypedFormControl(null),
      google_distance_matrix_key: new UntypedFormControl(null),
      google_direction_matrix_key: new UntypedFormControl(null),
    })
    this.webGoogleApiForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      admin_panel_google_key:new UntypedFormControl(null),
      user_panel_google_key:new UntypedFormControl(null),
      driver_panel_google_key:new UntypedFormControl(null),
      dispatcher_panel_google_key:new UntypedFormControl(null),
      corporate_panel_google_key:new UntypedFormControl(null),
      hotel_panel_google_key:new UntypedFormControl(null),
      partner_panel_google_key:new UntypedFormControl(null),
    })
    this.flutterGoogleApiForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      google_placeautocomplate_key: new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail,key_type): void {
    this.key_type = key_type;
    this.patchForm(setting_detail,key_type);
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //patch values
  patchForm(setting_detail,key_type){
    switch (key_type) {
      case GOOGLE_KEY_TYPE.ANDROID_USER_APP_KEYS:
        this.modal_heading = 'heading-title.andriod-user-app';
        this.googleApiForm.patchValue({
          setting_id: setting_detail._id,
          google_map_key : setting_detail.android_user_app_google_map_key,
          google_placeautocomplate_key : setting_detail.android_user_app_google_places_autocomplete_key,
          google_geocoding_key : setting_detail.android_user_app_google_geocoding_key,
          google_distance_matrix_key : setting_detail.android_user_app_google_distance_matrix_key,
          google_direction_matrix_key : setting_detail.android_user_app_google_direction_matrix_key,
        })
        break;
      case GOOGLE_KEY_TYPE.ANDROID_DRIVER_APP_KEYS:
        this.modal_heading = 'heading-title.andriod-driver-app';
        this.googleApiForm.patchValue({
          setting_id: setting_detail._id,
          google_map_key : setting_detail.android_driver_app_google_map_key,
          google_placeautocomplate_key : setting_detail.android_driver_app_google_places_autocomplete_key,
          google_geocoding_key : setting_detail.android_driver_app_google_geocoding_key,
          google_distance_matrix_key : setting_detail.android_driver_app_google_distance_matrix_key,
          google_direction_matrix_key : setting_detail.android_driver_app_google_direction_matrix_key,
        })
        break;
      case GOOGLE_KEY_TYPE.IOS_USER_APP_KEYS:
        this.modal_heading = 'heading-title.ios-user-app';
        this.googleApiForm.patchValue({
          setting_id: setting_detail._id,
          google_map_key : setting_detail.ios_user_app_google_map_key,
          google_placeautocomplate_key : setting_detail.ios_user_app_google_places_autocomplete_key,
          google_geocoding_key : setting_detail.ios_user_app_google_geocoding_key,
          google_distance_matrix_key : setting_detail.ios_user_app_google_distance_matrix_key,
          google_direction_matrix_key : setting_detail.ios_user_app_google_direction_matrix_key,
        })
        break;
      case GOOGLE_KEY_TYPE.IOS_DRIVER_APP_KEYS:
        this.modal_heading = 'heading-title.ios-driver-app';
        this.googleApiForm.patchValue({
          setting_id: setting_detail._id,
          google_map_key : setting_detail.ios_driver_app_google_map_key,
          google_placeautocomplate_key : setting_detail.ios_driver_app_google_places_autocomplete_key,
          google_geocoding_key : setting_detail.ios_driver_app_google_geocoding_key,
          google_distance_matrix_key : setting_detail.ios_driver_app_google_distance_matrix_key,
          google_direction_matrix_key : setting_detail.ios_driver_app_google_direction_matrix_key,
        })
        break;
      case GOOGLE_KEY_TYPE.FLUTTER_USER_APP_KEYS:
        this.modal_heading = 'heading-title.flutter-user-app';
        this.flutterGoogleApiForm.patchValue({
          setting_id: setting_detail._id,
          google_placeautocomplate_key : setting_detail.flutter_user_app_google_places_autocomplete_key,
        })
        break;
      case GOOGLE_KEY_TYPE.FLUTTER_DRIVER_APP_KEYS:
        this.modal_heading = 'heading-title.flutter-driver-app';
        this.flutterGoogleApiForm.patchValue({
          setting_id: setting_detail._id,
          google_placeautocomplate_key : setting_detail.flutter_driver_app_google_places_autocomplete_key,
        })
        break;
      case GOOGLE_KEY_TYPE.WEB_APP_KEYS:
        this.modal_heading = 'heading-title.web-panel';
        this.webGoogleApiForm.patchValue({
          setting_id: setting_detail._id,
          admin_panel_google_key:setting_detail.admin_panel_google_key,
          user_panel_google_key:setting_detail.user_panel_google_key,
          driver_panel_google_key:setting_detail.driver_panel_google_key,
          dispatcher_panel_google_key:setting_detail.dispatcher_panel_google_key,
          corporate_panel_google_key:setting_detail.corporate_panel_google_key,
          hotel_panel_google_key:setting_detail.hotel_panel_google_key,
          partner_panel_google_key:setting_detail.partner_panel_google_key,
        })
        break;
    }
  }

  //update
  update(){
    let json:any;
    switch (this.key_type) {
      case GOOGLE_KEY_TYPE.ANDROID_USER_APP_KEYS:
        json = {
          setting_id : this.googleApiForm.value.setting_id ,
          android_user_app_google_map_key : this.googleApiForm.value.google_map_key ,
          android_user_app_google_places_autocomplete_key : this.googleApiForm.value.google_placeautocomplate_key ,
          android_user_app_google_geocoding_key : this.googleApiForm.value.google_geocoding_key ,
          android_user_app_google_distance_matrix_key : this.googleApiForm.value.google_distance_matrix_key ,
          android_user_app_google_direction_matrix_key : this.googleApiForm.value.google_direction_matrix_key ,
        }
        Object.keys(this.googleApiForm.controls).forEach((key) => this.googleApiForm.get(key).setValue(this.googleApiForm.get(key).value.trim()));
        break;
      case GOOGLE_KEY_TYPE.ANDROID_DRIVER_APP_KEYS:
        json = {
          setting_id : this.googleApiForm.value.setting_id ,
          android_driver_app_google_map_key : this.googleApiForm.value.google_map_key ,
          android_driver_app_google_places_autocomplete_key : this.googleApiForm.value.google_placeautocomplate_key ,
          android_driver_app_google_geocoding_key : this.googleApiForm.value.google_geocoding_key ,
          android_driver_app_google_distance_matrix_key : this.googleApiForm.value.google_distance_matrix_key ,
          android_driver_app_google_direction_matrix_key : this.googleApiForm.value.google_direction_matrix_key ,
        }
        Object.keys(this.googleApiForm.controls).forEach((key) => this.googleApiForm.get(key).setValue(this.googleApiForm.get(key).value.trim()));
        break;
      case GOOGLE_KEY_TYPE.IOS_USER_APP_KEYS:
        json = {
          setting_id : this.googleApiForm.value.setting_id ,
          ios_user_app_google_map_key : this.googleApiForm.value.google_map_key ,
          ios_user_app_google_places_autocomplete_key : this.googleApiForm.value.google_placeautocomplate_key ,
          ios_user_app_google_geocoding_key : this.googleApiForm.value.google_geocoding_key ,
          ios_user_app_google_distance_matrix_key : this.googleApiForm.value.google_distance_matrix_key ,
          ios_user_app_google_direction_matrix_key : this.googleApiForm.value.google_direction_matrix_key ,
        }
        Object.keys(this.googleApiForm.controls).forEach((key) => this.googleApiForm.get(key).setValue(this.googleApiForm.get(key).value.trim()));
        break;
      case GOOGLE_KEY_TYPE.IOS_DRIVER_APP_KEYS:
        json = {
          setting_id : this.googleApiForm.value.setting_id ,
          ios_driver_app_google_map_key : this.googleApiForm.value.google_map_key ,
          ios_driver_app_google_places_autocomplete_key : this.googleApiForm.value.google_placeautocomplate_key ,
          ios_driver_app_google_geocoding_key : this.googleApiForm.value.google_geocoding_key ,
          ios_driver_app_google_distance_matrix_key : this.googleApiForm.value.google_distance_matrix_key ,
          ios_driver_app_google_direction_matrix_key : this.googleApiForm.value.google_direction_matrix_key ,
        }
        Object.keys(this.googleApiForm.controls).forEach((key) => this.googleApiForm.get(key).setValue(this.googleApiForm.get(key).value.trim()));
        break;
      case GOOGLE_KEY_TYPE.FLUTTER_USER_APP_KEYS:
        json = {
          setting_id : this.flutterGoogleApiForm.value.setting_id ,
          flutter_user_app_google_places_autocomplete_key : this.flutterGoogleApiForm.value.google_placeautocomplate_key ,
        }
        Object.keys(this.flutterGoogleApiForm.controls).forEach((key) => this.flutterGoogleApiForm.get(key).setValue(this.flutterGoogleApiForm.get(key).value.trim()));
        break;
      case GOOGLE_KEY_TYPE.FLUTTER_DRIVER_APP_KEYS:
        json = {
          setting_id : this.flutterGoogleApiForm.value.setting_id ,
          flutter_driver_app_google_places_autocomplete_key : this.flutterGoogleApiForm.value.google_placeautocomplate_key ,
        }
        Object.keys(this.flutterGoogleApiForm.controls).forEach((key) => this.flutterGoogleApiForm.get(key).setValue(this.flutterGoogleApiForm.get(key).value.trim()));
        break;
      case GOOGLE_KEY_TYPE.WEB_APP_KEYS:
        json = {
          setting_id : this.webGoogleApiForm.value.setting_id ,
          admin_panel_google_key : this.webGoogleApiForm.value.admin_panel_google_key ,
          user_panel_google_key : this.webGoogleApiForm.value.user_panel_google_key ,
          driver_panel_google_key : this.webGoogleApiForm.value.driver_panel_google_key ,
          dispatcher_panel_google_key : this.webGoogleApiForm.value.dispatcher_panel_google_key ,
          corporate_panel_google_key : this.webGoogleApiForm.value.corporate_panel_google_key ,
          hotel_panel_google_key : this.webGoogleApiForm.value.hotel_panel_google_key ,
          partner_panel_google_key : this.webGoogleApiForm.value.partner_panel_google_key ,
        }
        Object.keys(this.webGoogleApiForm.controls).forEach((key) => this.webGoogleApiForm.get(key).setValue(this.webGoogleApiForm.get(key).value.trim()));
        break;
    }
    this._settingService.updateSettingDetails(json).then(res => {
      if(res.success){
        this.google_key_data.emit();
        this.closeModal();
      }
    })
  }

  closeModal(){
    this.modalRef.hide();
    setTimeout(() => {
      this.googleApiForm.reset();
    }, 500);
  }

}
