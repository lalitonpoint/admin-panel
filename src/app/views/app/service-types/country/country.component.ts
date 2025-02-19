import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryService } from '../../../../services/country.service';
import { UntypedFormControl, UntypedFormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Helper } from '../../../../shared/helper';
import { CityService } from '../../../../services/city.service';
import { LangService } from 'src/app/shared/lang.service';
import { CommonService } from 'src/app/services/common.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { SettingsService } from 'src/app/services/settings.service';

declare const google;

export class CountryDetail {
  sign: string;
  currency_code: string;
  code: string;
  alpha2: string;
  alpha3: string;
  name : string;
}
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  searchByList = [
    { label: 'label-title.city', value: 'cityname' },
    { label: 'label-title.country', value: 'countryname' },
  ];
  selectedSearchBy = { label: 'label-title.city', value: 'cityname' };
  search_item: any = undefined;
  search_value: string = '';
  values: string = '';
  current_page : number =  0;
  itemsPerPage: number = 10;
  total_page: number;
  countryDetail :CountryDetail = new CountryDetail();
  country_form: UntypedFormGroup
  country_subscriber: Subscription
  city_subscriber: Subscription
  city_select_subscriber: Subscription
  countries_list:[] = [];
  all_countries: [] = [];
  city_list:[] = [];
  selected_country: any = null
  selected_city:any = null
  city_search_text:string = '';
  country_search_text:string = '';
  updateCityId:string;
  updateCountryId:string;
  countrytimezoneData:[] = [];
  allTimeZones:any [] =[];
  country:boolean = true;
  city:boolean = false;
  addCity:boolean = true;
  addCountry:boolean = false;
  is_next_clicked:boolean = false;
  basic_details_form:UntypedFormGroup;
  bidding_form:UntypedFormGroup;
  redeem_form:UntypedFormGroup;
  setting_detail:any;

  @ViewChild('countryTabs', { static: false }) countryTabs?: TabsetComponent;

  constructor(public _commonService:CommonService, public _lang: LangService,private _countryService: CountryService,public _helper:Helper,private _cityService: CityService, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this.getSettingData();
    this.country_subscriber = this._countryService._countryObservable.subscribe((updatedId) => {
      if(updatedId){
        this.updateCountryId=updatedId;
        this.getCountryList()
      }
    })    
    this._countryService.getAllCountry().then((res => {
      this.all_countries = res.country_list;
    }))
    this.city_subscriber = this._cityService._cityObservable.subscribe((updatedId) => {
      if(updatedId){
        this.updateCityId=updatedId;
        this.getCityList()
      }
    })
    this.city_select_subscriber = this._cityService._unselectCity.subscribe(() => {
      this.selected_city = null      
    })
    this._initCountryForm()
    this.getCountryList()
    this.getCityList()
  }

  //get admin location
  getSettingData() {
    let json: any = { admin_id: this._helper.user_details._id };
    this._settingService.getSettingDetails(json).then((response) => {
      if (response.success && response.setting_detail) {
        this.setting_detail = response.setting_detail[0];
      }
    })
  }

  // search city, country filter flow start 
  changeSearchBy(event) {
    this.selectedSearchBy = event;
  }

  applyFilter(){
    this.search_item = this.selectedSearchBy.value
    this.search_value=this.values
    this.current_page = 1;
    this.getCityList();
  }

  onPage(event): void {
    this.current_page = event.page - 1
    this.getCityList();
  }
  // search city, country filter flow end

  //initialize form
  _initCountryForm() {
    let numericRegex = /^[a-zA-Z0-9]+$/
    let numericValidation = [
      Validators.required,
      Validators.pattern(numericRegex),
      Validators.max(99999),
    ]
    let driverValidation = [
      Validators.required,
      Validators.pattern(numericRegex),
      Validators.max(99999),
      Validators.min(1),
    ]

    //basic details form
    this.basic_details_form = new UntypedFormGroup({
      countrycode: new UntypedFormControl(null),
      country_id: new UntypedFormControl(null),
      countryname: new UntypedFormControl(null, Validators.required),
      countryphonecode: new UntypedFormControl(null, Validators.required),
      countrytimezone: new UntypedFormControl('',Validators.required),
      country_all_timezone:new UntypedFormControl(null),
      currencycode: new UntypedFormControl(null, Validators.required),
      currencysign: new UntypedFormControl(null, Validators.required),
      alpha2: new UntypedFormControl(null, Validators.required),

      is_auto_transfer: new UntypedFormControl(true),
      auto_transfer_day: new UntypedFormControl(0,[Validators.min(1),Validators.max(366)]),
      isBusiness: new UntypedFormControl(true, Validators.required),
      isRentalBusiness: new UntypedFormControl(true, Validators.required),
      is_referral: new UntypedFormControl(true, Validators.required),
      userreferral: new UntypedFormControl(0, numericValidation),
      bonus_to_userreferral: new UntypedFormControl(0, this.referalCombinedValidator),
      referral_bonus_to_user: new UntypedFormControl(0, this.referalCombinedValidator),
      providerreferral: new UntypedFormControl(0, numericValidation),
      bonus_to_providerreferral: new UntypedFormControl(0, this.referalCombinedValidator),
      referral_bonus_to_provider: new UntypedFormControl(0, this.referalCombinedValidator),
      is_provider_referral: new UntypedFormControl(true, Validators.required),
      payment_gateways:new UntypedFormControl('10'),
      countryLatLong : new UntypedFormControl([0,0]),
      is_send_money_for_user: new UntypedFormControl(true, Validators.required),
      is_send_money_for_provider: new UntypedFormControl(true, Validators.required),
      is_use_wsal: new UntypedFormControl(false, Validators.required)
    })

    //trip bidding details form
    this.bidding_form = new UntypedFormGroup({
      is_allow_trip_bidding: new UntypedFormControl(true, Validators.required),
      is_user_can_set_bid_price: new UntypedFormControl(true, Validators.required),
      user_bidding_timeout: new UntypedFormControl(0, numericValidation),
      provider_bidding_timeout: new UntypedFormControl(0, numericValidation),
      no_of_providers_can_bid: new UntypedFormControl(1, driverValidation),
      user_min_bidding_limit: new UntypedFormControl(0, this.profitValueValidation),
      driver_max_bidding_limit: new UntypedFormControl(0, this.profitValueValidation),
    })

    //redeem details form
    this.redeem_form = new UntypedFormGroup({
      is_user_redeem_point_reward_on: new UntypedFormControl(false, Validators.required),
      trip_redeem_point: new UntypedFormControl(0, numericValidation),
      tip_redeem_point: new UntypedFormControl(0, numericValidation),
      referring_redeem_point_to_user: new UntypedFormControl(0, numericValidation),
      user_review_redeem_point: new UntypedFormControl(0, numericValidation),
      user_minimum_point_require_for_withdrawal: new UntypedFormControl(1, driverValidation),
      user_redeem_point_value: new UntypedFormControl(1, this.combinedValidator),
      
      is_driver_redeem_point_reward_on: new UntypedFormControl(false, Validators.required),
      daily_completed_trip_count_for_redeem_point: new UntypedFormControl(0, numericValidation),
      daily_accepted_trip_count_for_redeem_point: new UntypedFormControl(0, numericValidation),
      rating_average_count_for_redeem_point: new UntypedFormControl(0, numericValidation),
      daily_completed_trip_redeem_point: new UntypedFormControl(0, numericValidation),
      daily_accepted_trip_redeem_point: new UntypedFormControl(0, numericValidation),
      high_rating_redeem_point: new UntypedFormControl(0, numericValidation),
      driver_review_redeem_point: new UntypedFormControl(0, numericValidation),
      driver_minimum_point_require_for_withdrawal: new UntypedFormControl(1, driverValidation),
      driver_redeem_point_value: new UntypedFormControl(1, this.combinedValidator),
    })
  }

  profitValueValidation(control: AbstractControl): any {
    let numericValidation = [
      Validators.required,
    ]
    for (const validator of numericValidation) {
      const validationResult = validator(control);
      if (validationResult !== null) {
        return validationResult;
      }
    }
    if (control.value > 100) {
      return { profitValueInvalid: true }
    }
    return null
  }

  combinedValidator(control: AbstractControl): { [key: string]: any } | null {
    // Apply numericValidation
    let numericValidation = [
      Validators.required,
      Validators.max(99999),
    ]
    for (const validator of numericValidation) {
      const validationResult = validator(control);
      if (validationResult !== null) {
        return validationResult;
      }
    }
  
    // Your additional validation logic
    if (control.value <= 0) {
      return { redeemValueInvalid: true };
    }
  
    return null; // All validations passed
  }

  referalCombinedValidator(control: AbstractControl): { [key: string]: any } | null {
    // Apply numericValidation
    let numericValidation = [
      Validators.required,
      Validators.max(99999),
    ]
    for (const validator of numericValidation) {
      const validationResult = validator(control);
      if (validationResult !== null) {
        return validationResult;
      }
    }
  
    // Your additional validation logic
    if (control.value < 0) {
      return { redeemValueInvalid: true };
    }
  
    return null; // All validations passed
  }

  //get country list 
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.countries_list = res.country_list
        if(this.updateCountryId){
          let index = this.countries_list.findIndex((x:any) => x._id == this.updateCountryId)
          this.onSelectCountry(res.country_list[index])
        }else{
          this.onSelectCountry(res.country_list[0])
        }
      }else{
        this.countries_list = []
      }
    })
  }

  //get city list
  getCityList() {
    let json :any = {};
    this._cityService.fetchCity(json).then(res => {
      if(res.success){
        this.city_list = res.city_list;
        if (this.city_list.length > 0) {
          if(this.updateCityId){
            let index = this.city_list.findIndex((x:any) => x._id == this.updateCityId)
            this.onSelectCity(res.city_list[index])
          }else{
            this.onSelectCity(res.city_list[0])
          }      
          this.total_page = res.total_page
        }
      }else{
        this.city_list = []
      }
    })
  }

  // country tab
  CountryShow(): void {
    this.selected_city = null;
    this.addCountry= true;
    this.addCity=false;
    this.country = true;
    this.city = false;  
    if(this.countries_list.length == 0){
      this._initCountryForm();
    }
  }

  // city tab
  CityShow(): void {
    this.addCountry= false;
    this.addCity=true;
    this.city = true;
    this.country = false;
    this.getCityList();
  }

  //add new country
  AddCountry(): void {
    this.addCountry = true;
    this.selected_country = null
    this.is_next_clicked = false;
    this._initCountryForm()
    this.selectTab(0);
    setTimeout(() => {
      this.basic_details_form.enable();
      this.bidding_form.enable();
      this.redeem_form.enable();
    }, 200);
    this.showAutoTransfer(true);
  }

  //add new city
  AddCity(): void {
    this.addCity = true;
    if(this.selected_city){
      this._cityService._addCity.next({})
    }
    this.selected_city = null
  }

  //update & add country
  async saveCountry(): Promise<void> {
    if(!this.redeem_form.value.is_driver_redeem_point_reward_on){
      this.redeem_form.controls['driver_minimum_point_require_for_withdrawal'].setValidators(null);
      this.redeem_form.controls['driver_redeem_point_value'].setValidators(null);
      this.redeem_form.get('driver_minimum_point_require_for_withdrawal').updateValueAndValidity();
      this.redeem_form.get('driver_redeem_point_value').updateValueAndValidity();
    }

    if(!this.redeem_form.value.is_user_redeem_point_reward_on){
      this.redeem_form.controls['user_minimum_point_require_for_withdrawal'].setValidators(null);
      this.redeem_form.controls['user_redeem_point_value'].setValidators(null);
      this.redeem_form.get('user_minimum_point_require_for_withdrawal').updateValueAndValidity();
      this.redeem_form.get('user_redeem_point_value').updateValueAndValidity();
    }
    if(this.basic_details_form.invalid || this.bidding_form.invalid || this.redeem_form.invalid){
      this.basic_details_form.markAllAsTouched();
      this.bidding_form.markAllAsTouched();
      this.redeem_form.markAllAsTouched();
      return;
    }
    if(this.basic_details_form.valid && this.bidding_form.valid && this.redeem_form.valid){
      if (this.basic_details_form.value.countryLatLong[0] == 0 || this.basic_details_form.value.countryLatLong[1] == 0) {
        let geocoder = new google.maps.Geocoder();
        let request = { address: this.basic_details_form.value.countryname };
        await geocoder.geocode(request, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            let countryLatLong = [0,0]
            countryLatLong[0] = results[0].geometry.location.lat()
            countryLatLong[1] = results[0].geometry.location.lng()
            this.basic_details_form.patchValue({countryLatLong : countryLatLong})
          }
        });
      }
      if (this.basic_details_form.value.country_id) {
        let arr = [];
        if((this.basic_details_form.value.payment_gateways == undefined) || (this.basic_details_form.value.payment_gateways == '')){
          arr.push('10'); 
        }else{
          arr.push(this.basic_details_form.value.payment_gateways); 
        }
        this.basic_details_form.patchValue({
          payment_gateways:arr
        })
        if(this._helper.has_permission(this._helper.PERMISSION.EDIT)){
          this._countryService.updateCountry({...this.basic_details_form.value,...this.bidding_form.value,...this.redeem_form.value,redeem_settings:true}).then(res => {
          })
        }     
      } else {
        let arr = [];
        arr.push(this.basic_details_form.value.payment_gateways); 
        this.basic_details_form.patchValue({
          payment_gateways:arr
        })
        if(this.allTimeZones == undefined){
          let timeZones = [];
          timeZones.push(this.basic_details_form.value.countrytimezone); 
          this.basic_details_form.patchValue({
            country_all_timezone:timeZones
          })
        }
        if(this._helper.has_permission(this._helper.PERMISSION.ADD)){
          this._countryService.addCountry({...this.basic_details_form.value,...this.basic_details_form.value,...this.redeem_form.value}).then(res => {
            if(res.success){
              this.getCountryList()
              this.allTimeZones = [];
            }
          })
        }
      }
      this._initCountryForm();
      this.selected_country = null
      this.addCountry= false
    }
  }

  onChangeTimeZone(time){
    this.basic_details_form.patchValue({countrytimezone:time});
  }

  // country selection 
  onChangeCountry(countryData) {
    this.countryDetail=countryData;
    
    this.basic_details_form.patchValue({
      currencysign: null,
      country_all_timezone: null,
      currencycode: null,
      countryphonecode: null,
      alpha2: null,
      countrycode: null,
      countrytimezone:null
    })
    if (countryData?.name) {
      this._countryService.getCountryData({ countryname: countryData.name }).then(res => {
        if (res) {
          this.countrytimezoneData= countryData.timezones;
          this.allTimeZones= countryData.timezones;
          if(countryData.timezones != undefined){
            this.basic_details_form.patchValue({
              countrytimezone:countryData.timezones[0]
            })
          }else{
            this._commonService.getCountryTimezone().then((res)=>{
              this.countrytimezoneData= res.timezone_list;
              this.basic_details_form.patchValue({
                countrytimezone:res.timezone_list[0]
              })
            })
          }
          this.basic_details_form.patchValue({
            currencysign: countryData.sign,
            currencycode: countryData.currency_code,
            countryphonecode: countryData.code,
            alpha2: countryData.alpha2,
            countrycode: countryData.alpha3,
            countryname:countryData.name,
            country_all_timezone:countryData.timezones
          })
        } else {
          this.countrytimezoneData= [];
          this.allTimeZones = [];
          this._initCountryForm()
        }
      })
    }
  }

  // select country in sidebar
  onSelectCountry(country) {
    this.selectTab(0);
    this.selected_country = country
    this.basic_details_form.patchValue({ ...this.selected_country,countryLatLong : this.selected_country?.countryLatLong || [0,0], country_id: this.selected_country?._id,payment_gateways:country?.payment_gateways[0]})    
    this.bidding_form.patchValue({ ...this.selected_country});
    this.redeem_form.patchValue({ ...this.selected_country});  
    if(this.selected_country?.user_redeem_settings?.length > 0){
      this.redeem_form.patchValue({...this.selected_country.user_redeem_settings[0]})
    }
    if(this.selected_country?.driver_redeem_settings?.length > 0){
      this.redeem_form.patchValue({...this.selected_country.driver_redeem_settings[0]})
    }
    if(this.selected_country?.is_auto_transfer === true){
      this.showAutoTransfer(true);
    }else{
      this.showAutoTransfer(false);
    }
    setTimeout(() => {
      if(this.selected_country){
        if((this._helper.has_permission(this._helper.PERMISSION.ADD) && !this._helper.has_permission(this._helper.PERMISSION.EDIT)) || (!this._helper.has_permission(this._helper.PERMISSION.ADD) && !this._helper.has_permission(this._helper.PERMISSION.EDIT))){
          this.basic_details_form.disable();
          this.bidding_form.disable();
          this.redeem_form.disable();
        }else{
          this.basic_details_form.enable();
          this.bidding_form.enable();
          this.redeem_form.enable();
        }
      }else{
        this.basic_details_form.enable();
        this.bidding_form.enable();
        this.redeem_form.enable();
      }
    }, 200);
  }

  // select city in sidebar
  onSelectCity(city){
    this.selected_city = city;
    this._cityService._citySelect.next(city);
  }

  nextPage(tabNumber: number): void {
    this.is_next_clicked = true;
    if(!this.redeem_form.value.is_driver_redeem_point_reward_on){
      this.redeem_form.controls['driver_minimum_point_require_for_withdrawal'].setValidators(null);
      this.redeem_form.controls['driver_redeem_point_value'].setValidators(null);
      this.redeem_form.get('driver_minimum_point_require_for_withdrawal').updateValueAndValidity();
      this.redeem_form.get('driver_redeem_point_value').updateValueAndValidity();
    }

    if(!this.redeem_form.value.is_user_redeem_point_reward_on){
      this.redeem_form.controls['user_minimum_point_require_for_withdrawal'].setValidators(null);
      this.redeem_form.controls['user_redeem_point_value'].setValidators(null);
      this.redeem_form.get('user_minimum_point_require_for_withdrawal').updateValueAndValidity();
      this.redeem_form.get('user_redeem_point_value').updateValueAndValidity();
    }
    if (this.basic_details_form.invalid || this.bidding_form.invalid || this.redeem_form.invalid) {
      this.basic_details_form.markAllAsTouched();
      this.bidding_form.markAllAsTouched();
      this.redeem_form.markAllAsTouched();
      return;
    }
    this.selectTab(tabNumber);
  }

  selectTab(tabId: number): void {
    if (this.countryTabs?.tabs[tabId]) {
      this.countryTabs.tabs[tabId].active = true;
    }
  }

  showAutoTransfer(boolean) {
    if (boolean === true) {
      this.basic_details_form.get('auto_transfer_day').setValidators([Validators.min(1), Validators.max(366), Validators.required]);
    } else {
      this.basic_details_form.get('auto_transfer_day').clearValidators();
      if (!this.basic_details_form.value.auto_transfer_day) {
        this.basic_details_form.patchValue({ auto_transfer_day: 0 });
      }
    }
    this.basic_details_form.get('auto_transfer_day').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.country_subscriber.unsubscribe()
    this.city_subscriber.unsubscribe()
    this.city_select_subscriber.unsubscribe();
    this.updateCityId=null;
    this.updateCountryId=null;
    this._cityService._cityChanges.next(null);
    this._countryService._countryChanges.next(null);
  }
}
