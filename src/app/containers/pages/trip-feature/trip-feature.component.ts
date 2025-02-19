import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-trip-feature',
  templateUrl: './trip-feature.component.html',
  styleUrls: ['./trip-feature.component.scss']
})
export class TripFeatureComponent implements OnInit {
  tripForm:UntypedFormGroup;
  is_edit_trip_settings = false;

  @Input() setting_detail:any;
  @Output() trip_data = new EventEmitter<any>();

  constructor(public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm();
    this.tripForm.disable();
    this.tripForm.patchValue(this.setting_detail);
    this.tripForm.patchValue({
      setting_id:this.setting_detail._id
    });
  }

  //initialize form
  _initForm(){
    this.tripForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null, Validators.required),
      is_receive_new_request_near_destination: new UntypedFormControl(null, Validators.required),
      near_destination_radius: new UntypedFormControl(null, Validators.required),
      is_driver_go_home: new UntypedFormControl(null, Validators.required),
      is_driver_go_home_change_address: new UntypedFormControl(null, Validators.required),
      driver_go_home_radius: new UntypedFormControl(null, Validators.required),
      is_allow_multiple_stop: new UntypedFormControl(null, Validators.required),
      is_multiple_stop_waiting_free_on_each_stop: new UntypedFormControl(null, Validators.required),
      multiple_stop_count: new UntypedFormControl(null, Validators.required),
      is_allow_ride_share: new UntypedFormControl(null, Validators.required),
      ride_share_pickup_radius: new UntypedFormControl(null, Validators.required),
      ride_share_destination_radius: new UntypedFormControl(null, Validators.required),
      is_split_payment: new UntypedFormControl(null, Validators.required),
      max_split_user: new UntypedFormControl(null, Validators.required),
    })
  }

  //update 
  onClickTripSetting(): void {
    this.is_edit_trip_settings = !this.is_edit_trip_settings;
    if (this.is_edit_trip_settings) {
      this.tripForm.enable();
    } else {
      this.tripForm.disable();
      this._settingService.updateSettingDetails(this.tripForm.value).then(res => {
        if(res.success){
          this.trip_data.emit();
        }
      });
    }
  }

}
