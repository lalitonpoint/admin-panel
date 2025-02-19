import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DEFAULT_IMAGE } from 'src/app/constants/constants';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { DriverService } from 'src/app/services/driver.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';
import * as $ from "jquery";

declare const google;

@Component({
  selector: 'app-add-driver-modal',
  templateUrl: './add-driver-modal.component.html',
  styleUrls: ['./add-driver-modal.component.scss']
})
export class AddDriverModalComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  IMAGE_URL = environment.IMAGE_URL;
  DEFAULT_IMAGE = DEFAULT_IMAGE.DOCUMENT_PROFILE;
  USER_PROFILE = DEFAULT_IMAGE.USER_SQUARE;
  profile_image: any;
  driverDetailForm: UntypedFormGroup;
  imagefile: Blob;
  country_list: any[] = [];
  city_list: any[] = [];
  cityData:any;
  first_name_error: boolean = false;
  last_name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(public _helper: Helper, private _notifierService: NotifiyService, private modalService: BsModalService, private _countryService: CountryService, private _driverService: DriverService,private _cityService:CityService) { }

  ngOnInit(): void {
    //empty for future implementation
  }

  show() {
    this.first_name_error = false;
    this.last_name_error = false;
    this._initForm();
    this.getCountryList();
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  _initForm() {
    this.driverDetailForm = new UntypedFormGroup({
      first_name: new UntypedFormControl('', [Validators.required]),
      last_name: new UntypedFormControl('', [Validators.required]),
      phone: new UntypedFormControl('', [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
      country_phone_code: new UntypedFormControl(''),
      email: new UntypedFormControl('', [Validators.required]),
      country_id: new UntypedFormControl('',[Validators.required]),
      city: new UntypedFormControl('',[Validators.required]),
      address: new UntypedFormControl('',[Validators.required]),
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
      password: new UntypedFormControl(null, [Validators.required,Validators.minLength(6)])
    })
  }

  _initAutocomplete(country) {
    let autocompleteElm = <HTMLInputElement>document.getElementById('address');
    google.maps.event.clearInstanceListeners(autocompleteElm);
    let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { componentRestrictions: { country: country.countrycode } });
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place['formatted_address'];
      this.driverDetailForm.patchValue({
        address: address,
        latitude: lat,
        longitude: lng
      })
    });
    $('.search-address').find("#address").on("focus click keypress", () => {
      $('.search-address').css({ position: "relative" }).append($(".pac-container"));
    });
  }

  onSelectImageFile(event) {
    let files = event.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    let fileType = this._helper.uploadFile.filter((element) => {
      return mimeType == element;
    })
    if (mimeType != fileType) {
      this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.invalid-image-format'));
    } else {
      this.imagefile = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.imagefile);
      reader.onload = (_event) => {
        this.profile_image = reader.result;
      }
    }
  }

  //get country list
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      this.country_list = res.country_list;
    })
  }

  onChangeCountry(id){
    this.driverDetailForm.patchValue({
      city : '',
    })
    this.getCityList(id);

    let country = this.country_list.filter(x => x._id == id);

    this._initAutocomplete(country[0]);

    this.driverDetailForm.patchValue({
      country_phone_code : country[0].countryphonecode
    })
  }

  // get city from country
  getCityList(country_Id) {
    this._cityService.fetchDestinationCity({ country_id: country_Id, type: 1 }).then(res => {
      if (res.success) {
        this.city_list = res.destination_list;
      } else {
        this.city_list = [];
      }
    })
  }

  closeModal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.driverDetailForm.reset();
    }, 1000);
  }

  cityChanges(city:any){
    this.cityData =city;
  }

  save() {
    if(this.first_name_error || this.last_name_error){
      if (this.first_name_error) {
        document.getElementById('first_name')?.focus();
      } else if (!this.first_name_error && this.last_name_error) {
        document.getElementById('last_name')?.focus();
      }
      return;
    }
    this.driverDetailForm.patchValue({
      first_name: this.driverDetailForm.value.first_name?.toString().trim(),
      last_name: this.driverDetailForm.value.last_name?.toString().trim(),
      email: this.driverDetailForm.value.email?.toString().trim(),
      password: this.driverDetailForm.value.password?.toString().trim(),
    })
    if (this.driverDetailForm.invalid) {
      this.driverDetailForm.markAllAsTouched();
    }
    if (this.driverDetailForm.valid) {
      let  form_data = new FormData;
      form_data.append('first_name', this.driverDetailForm.value.first_name);
      form_data.append('last_name', this.driverDetailForm.value.last_name);
      form_data.append('country_phone_code', this.driverDetailForm.value.country_phone_code);
      form_data.append('phone', this.driverDetailForm.value.phone);
      form_data.append('email', this.driverDetailForm.value.email);
      form_data.append('country_id', this.driverDetailForm.value.country_id);
      if (this.cityData != null) {
        form_data.append('city', this.cityData.cityname);
        form_data.append('cityid', this.cityData._id);
      } else {
        form_data.append('city', this.driverDetailForm.value.city);
      }
      form_data.append('address', this.driverDetailForm.value.address);
      form_data.append('latitude', this.driverDetailForm.value.latitude);
      form_data.append('longitude', this.driverDetailForm.value.longitude);
      if (this.driverDetailForm.value.password != null) {
        form_data.append('password', this.driverDetailForm.value.password);
      }
      if (this.imagefile) {
        form_data.append('picture', this.imagefile)
      }
      form_data.append('type', this._helper.TRIP_STATUS_TYPE_VALUE.ADMIN.toString())
      this._driverService.admin_add_provider(form_data).then((res: any) => {
        if (res.success) {
          this.cityData = null;
          this.closeModal();
        }
      })
    }
  }

  checkCharacterLimitvalidation(value, type) {
    if (type == this._helper.NAME_TYPE.FIRST_NAME) {
      this.first_name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_first_name_character_limit);
    }
    if (type == this._helper.NAME_TYPE.LAST_NAME) {
      this.last_name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_last_name_character_limit);
    }
  }

}
