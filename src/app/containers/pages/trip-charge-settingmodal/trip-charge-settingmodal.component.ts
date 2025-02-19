import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-trip-charge-settingmodal',
  templateUrl: './trip-charge-settingmodal.component.html',
  styleUrls: ['./trip-charge-settingmodal.component.scss']
})
export class TripChargeSettingmodalComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  cityType_form: UntypedFormGroup;
  selected_cityType: any;
  countries_list: [] = [];
  city_list: [] = [];
  type_list: [] = [];
  currencysign: string = '';
  city_Id: string;
  btnDisable: boolean = false;
  unit: number = 1;
  vehicleCapacityValidation: any

  @Output() tripChargeHandler: EventEmitter<any> = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        setTimeout(() => {
          this._initCountryForm();
        }, 500);
      })
    }
  }

  constructor(public _helper: Helper, private _cityService: CityService, private _countryService: CountryService, private modalService: BsModalService, private typeCityService: TypeCityAssociationService) { }

  ngOnInit(): void {
    this._initCountryForm()
  }

  show(selected_cityType): void {
    if (selected_cityType) {
      this.selected_cityType = selected_cityType;
      this.currencysign = this.selected_cityType.country_detail.currencysign;
      this.unit = this.selected_cityType.city_detail.unit;
      this.selected_cityType.typename = this.selected_cityType.type_detail.typename;
      this.selected_cityType.typeid = this.selected_cityType.type_detail._id;
      this.selected_cityType.type_image = this.selected_cityType.type_detail.type_image_url;
      this.selected_cityType.service_type_id = this.selected_cityType._id;
      this.cityType_form.patchValue({
        ...this.selected_cityType
      })
    } else {
      this.getCountryList()
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //initialize form
  _initCountryForm() {
    let numericValidation = [
      Validators.required,
      Validators.max(99999)
    ]
    this.vehicleCapacityValidation = [
      Validators.required,
      Validators.max(99999),
      Validators.min(1),
    ]
    this.cityType_form = new UntypedFormGroup({
      type: new UntypedFormControl(1),
      surge_multiplier: new UntypedFormControl(1),
      surge_start_hour: new UntypedFormControl(0),
      surge_end_hour: new UntypedFormControl(0),
      type_image: new UntypedFormControl(''),
      countryid: new UntypedFormControl(''),
      cityid: new UntypedFormControl(''),
      typeid: new UntypedFormControl(''),
      service_type: new UntypedFormControl(''),
      service_type_id: new UntypedFormControl(''),
      countryname: new UntypedFormControl(null, Validators.required),
      cityname: new UntypedFormControl(null, Validators.required),
      typename: new UntypedFormControl(null, Validators.required),
      provider_profit: new UntypedFormControl(0, [Validators.required, this.profitValueValidation]),
      base_price_distance: new UntypedFormControl(0, [Validators.required, this.basePriceDistanceValidation]),
      base_price: new UntypedFormControl(0, numericValidation),
      price_per_unit_distance: new UntypedFormControl(0, numericValidation),
      price_for_total_time: new UntypedFormControl(0, numericValidation),
      waiting_time_start_after_minute: new UntypedFormControl(0, numericValidation),
      price_for_waiting_time: new UntypedFormControl(0, numericValidation),
      waiting_time_start_after_minute_multiple_stops: new UntypedFormControl(0, [Validators.required, this.freeWaitingTimeStartValidation]),
      price_for_waiting_time_multiple_stops: new UntypedFormControl(0, numericValidation),
      min_fare: new UntypedFormControl(0, numericValidation),
      max_space: new UntypedFormControl(1, this.vehicleCapacityValidation),
      cancellation_fee: new UntypedFormControl(0, numericValidation),
      tax: new UntypedFormControl(0, [Validators.required, this.profitValueValidation]),
      user_miscellaneous_fee: new UntypedFormControl(0, numericValidation),
      user_tax: new UntypedFormControl(0, [Validators.required, this.profitValueValidation]),
      provider_miscellaneous_fee: new UntypedFormControl(0, numericValidation),
      provider_tax: new UntypedFormControl(0, [Validators.required, this.profitValueValidation]),
      is_business: new UntypedFormControl(true, Validators.required),
      is_car_rental_business: new UntypedFormControl(true, Validators.required),
      is_zone: new UntypedFormControl(true, Validators.required),
      is_surge_hours: new UntypedFormControl(true, Validators.required),
      is_ride_share: new UntypedFormControl(0, Validators.required),
      luggage_allowacation: new UntypedFormControl(0, numericValidation),
      vehicle_capacity: new UntypedFormControl(1, this.vehicleCapacityValidation),
    })
  }

  //profit value validation error message code 
  profitValueValidation(control: AbstractControl): any {
    if (control.value < 0) {
      return { minprofitValueInvalid: true }
    }
    if (control.value > 100) {
      return { profitValueInvalid: true }
    }
    return null
  }

  //Base Price Distance value validation error message code 
  basePriceDistanceValidation(control: AbstractControl): any {
    if (control.value > 25) {
      return { basePriceDistanceValueInvalid: true }
    }
    return null
  }

  //free Waiting Time Start value validation error message code 
  freeWaitingTimeStartValidation(control: AbstractControl): any {
    if (control.value > 10) {
      return { freewaitingTimeStartValueInvalid: true }
    }
    return null
  }

  // get CountryList
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.countries_list = res.country_list
      } else {
        this.countries_list = []
      }
    })
  }

  // get city from country 
  getCityList(country_Id) {
    this._cityService.fetchDestinationCity({ country_id: country_Id ,type:1}).then(res => {
      if (res.success) {
        this.city_list = res.destination_list;
      } else {
        this.city_list = []
      }
    })
  }

  // get TypeList from city 
  getTypeList() {
    this.cityType_form.patchValue({ typename: '' });
    if (this.city_Id) {
      let json: any = { cityid: this.city_Id, is_ride_share: this.cityType_form.value.is_ride_share }
      this.typeCityService.fetchTypelist(json).then(res => {
        if (res.success) {
          this.type_list = res.type_unique;
        } else {
          this.type_list = []
        }
      })
    }else{
      this.type_list = []
    }
  }

  // get country to input field
  getCountry(countrydata) {
    this.currencysign = countrydata.currencysign;
    this.cityType_form.patchValue({ countryname: countrydata.countryname, countryid: countrydata._id });
    this.cityType_form.patchValue({ cityname: '' });
    this.city_Id = '';
    this.cityType_form.patchValue({ typename: '' });
    this.type_list = []
    this.getCityList(countrydata._id)
  }

  // get city to input field
  getCity(citydata) {
    this.unit = citydata.unit
    this.cityType_form.patchValue({ cityname: citydata.cityname, cityid: citydata._id });
    this.city_Id = citydata._id;
    this.cityType_form.patchValue({ typename: '' });
    this.getTypeList()
  }

  // get TypeName to input field
  getTypeName(type) {
    this.cityType_form.patchValue({ typename: type.typename, typeid: type._id, type_image: type.type_image_url });
  }

  // update cityType 
  updateCityType() {
    //check and do changes if proce type is pool
    this.checkCarpoolType();
    this.checkOpenRideType();
    if(this.cityType_form.invalid){
      this.cityType_form.markAllAsTouched();
      return;
    }
    if (this.cityType_form.valid) {
      this.btnDisable = true;
      this.typeCityService.updateTypeCity(this.cityType_form.value).then(res => {
        if (res.success) {
          this.tripChargeHandler.emit();
          setTimeout(() => {
            this.btnDisable = false;
          }, 500);
          this.close();
        } else {
          this.btnDisable = false;
        }
      })
    }
  }

  // add new cityType 
  addCityType() {
    //check and do changes if proce type is pool
    this.checkCarpoolType();
    this.checkOpenRideType();
    if(this.cityType_form.invalid){
      this.cityType_form.markAllAsTouched();
      return;
    }
    if (this.cityType_form.valid) {
      this.btnDisable = true;
      this.typeCityService.addTypeCity(this.cityType_form.value).then(res => {
        if (res.success) {
          this.tripChargeHandler.emit();
          setTimeout(() => {
            this.btnDisable = false;
          }, 500);
          this.close();
        } else {
          this.btnDisable = false;
        }
      })
    }
  }

  close() {
    this.modalRef.hide()
    setTimeout(() => {
      this._initCountryForm();
    }, 200);
  }

  checkCarpoolType() {
    if (this.cityType_form.value.is_ride_share == this._helper.SERVICE_PRICE_TYPE.CAR_POOL) {
      this.cityType_form.controls['waiting_time_start_after_minute_multiple_stops'].setValidators(null);
      this.cityType_form.controls['price_for_waiting_time_multiple_stops'].setValidators(null);
      this.cityType_form.get('waiting_time_start_after_minute_multiple_stops').updateValueAndValidity();
      this.cityType_form.get('price_for_waiting_time_multiple_stops').updateValueAndValidity();
      this.cityType_form.patchValue({
        waiting_time_start_after_minute_multiple_stops: 0,
        price_for_waiting_time_multiple_stops: 0,
        is_car_rental_business: false,
      });
    }
  }

  checkOpenRideType() {
    if (this.cityType_form.value.is_ride_share == this._helper.SERVICE_PRICE_TYPE.OPEN_RIDE) {
      this.cityType_form.controls['waiting_time_start_after_minute'].setValidators(null);
      this.cityType_form.controls['waiting_time_start_after_minute_multiple_stops'].setValidators(null);
      this.cityType_form.controls['price_for_waiting_time'].setValidators(null);
      this.cityType_form.controls['max_space'].setValidators(null);
      this.cityType_form.controls['price_for_waiting_time_multiple_stops'].setValidators(null);
      this.cityType_form.get('max_space').updateValueAndValidity();
      this.cityType_form.get('waiting_time_start_after_minute').updateValueAndValidity();
      this.cityType_form.get('waiting_time_start_after_minute_multiple_stops').updateValueAndValidity();
      this.cityType_form.get('price_for_waiting_time').updateValueAndValidity();
      this.cityType_form.get('price_for_waiting_time_multiple_stops').updateValueAndValidity();
      this.cityType_form.patchValue({
        waiting_time_start_after_minute: null,
        waiting_time_start_after_minute_multiple_stops: null,
        price_for_waiting_time: null,
        price_for_waiting_time_multiple_stops: null,
        is_car_rental_business: false,
      });
    } else {
      this.cityType_form.controls['max_space'].setValidators(this.vehicleCapacityValidation);
      this.cityType_form.controls['luggage_allowacation'].setValidators(null);
      this.cityType_form.controls['vehicle_capacity'].setValidators(null);
      this.cityType_form.get('luggage_allowacation').updateValueAndValidity();
      this.cityType_form.get('vehicle_capacity').updateValueAndValidity();
      this.cityType_form.patchValue({
        luggage_allowacation: null,
        vehicle_capacity: null,
      });
    }
  }

}
