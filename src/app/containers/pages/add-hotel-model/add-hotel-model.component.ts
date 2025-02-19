import { Helper } from 'src/app/shared/helper';
import { HotelService } from '../../../services/hotel.service';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import * as $ from "jquery";

declare const google: any;

@Component({
  selector: 'app-add-hotel-model',
  templateUrl: './add-hotel-model.component.html',
  styleUrls: ['./add-hotel-model.component.scss']
})
export class AddHotelModelComponent implements OnInit {
  commonForm: UntypedFormGroup;
  city_form: UntypedFormGroup
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  timezones: any = []
  hotelType: any;
  countryList: any;
  countryId: any;
  cityList: any;
  country: any;
  map: any;
  fullCityname: any;
  selectedCity: any;
  cityLatLng: any;
  allCountry: any;
  name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private countryService: CountryService, private cityService: CityService, private hotelService: HotelService, public _helper: Helper) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.commonForm = new UntypedFormGroup({
      hotelName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      phone: new UntypedFormControl('', [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
      email: new UntypedFormControl(null, [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]),
      password: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
      country: new UntypedFormControl(null, [Validators.required]),
      countryname: new UntypedFormControl(null),
      countryphonecode: new UntypedFormControl(null),
      city: new UntypedFormControl(null, [Validators.required]),
      address: new UntypedFormControl(null, [Validators.required]),
      cityLatitude: new UntypedFormControl(null, [Validators.required]),
      cityLongitude: new UntypedFormControl(null, [Validators.required]),
    });
  }

  show(type): void {
    this.name_error = false;
    this._initForm();
    this.commonForm.reset();
    this.modalRef = this.modalService.show(this.template, this.config);
    this.hotelType = type;
    this.countryService.fetchCountry().then((res_data) => {
      this.countryList = res_data.country_list;
    })
  }

  onSubmit(): void {
  }

  getCountry(event) {
    this.countryId = event._id;
    this.country = event.countryname;
    this.allCountry = event;
    this.commonForm.patchValue({
      city: '',
      address: '',
      cityLatitude: '',
      cityLongitude: ''
    })
    this.selectedCity = '';
    this.fullCityname = '';
    this.cityLatLng = '';

    this.commonForm.patchValue({
      countryphonecode: this.allCountry.countryphonecode
    })

    this.cityService.fetchDestinationCity({ country_id: event._id }).then((res_data) => {
      this.cityList = res_data.destination_list
    })
    let autocompleteElm = <HTMLInputElement>document.getElementById('address');
    google.maps.event.clearInstanceListeners(autocompleteElm);
  }

  cityChange(event) {
    this.selectedCity = event.cityname;
    this.cityLatLng = event.cityLatLong;

    if (this.allCountry) {
      this.timezones = this.allCountry.country_all_timezone

      let autocompleteElm = <HTMLInputElement>document.getElementById('address');
      google.maps.event.clearInstanceListeners(autocompleteElm);

      let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { componentRestrictions: { country: this.allCountry.countrycode } });
      $('.search-address').find("#address").on("focus click keypress", () => {
        $('.search-address').css({ position: "relative" }).append($(".pac-container"));
      });
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        let city_code = null;

        for (const element of place.address_components) {
          if (element.types[0] == "locality") {
            city_code = element;
            city_code = city_code.short_name;
          }
        }

        if (city_code === null) {
          for (const element of place.address_components) {
            if (element.types[0] == "locality") {
              city_code = element;
              city_code = city_code.short_name;
            }
          }
        }

        this.fullCityname = place.formatted_address;


        this.commonForm.patchValue({
          cityLatitude: lat,
          cityLongitude: lng,
        })

      });
    }
  }

  addNewHotel() {
    if(this.name_error){
      return;
    }
    this.commonForm.patchValue({
      hotelName: this.commonForm.value.hotelName?.toString().trim(),
      email: this.commonForm.value.email?.toString().trim(),
      password: this.commonForm.value.password?.toString().trim(),
    })
    if(this.commonForm.invalid){
      this.commonForm.markAllAsTouched();
      return;
    }
    let form_data = new FormData;
    form_data.append('hotel_name', this.commonForm.value.hotelName);
    form_data.append('email', this.commonForm.value.email);
    form_data.append('country_phone_code', this.commonForm.value.countryphonecode);
    form_data.append('phone', this.commonForm.value.phone);
    form_data.append('password', this.commonForm.value.password);
    form_data.append('country', this.country);
    form_data.append('city', this.selectedCity);
    form_data.append('countryid', this.countryId);
    form_data.append('address', this.fullCityname);
    form_data.append('latitude', this.commonForm.value.cityLatitude);
    form_data.append('longitude', this.commonForm.value.cityLongitude);
    form_data.append('type', this.hotelType);
    this.commonForm.markAllAsTouched();
    if (this.commonForm.valid) {
      this.hotelService.addNewHotel(form_data).then((res_data: any) => {
        if (res_data.success) {
          this.modalRef.hide()
        }
      })
    }
  }

  checkCharacterLimitvalidation(value) {
    this.name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_full_name_character_limit);
  }

}
