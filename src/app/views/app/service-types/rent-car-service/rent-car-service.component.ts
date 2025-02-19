import { Component, OnInit, ViewChild } from '@angular/core';
import { RentCarBrandModelComponent } from 'src/app/containers/pages/rent-car-brand-model/rent-car-brand-model.component';
import { RentCarTypeModelComponent } from 'src/app/containers/pages/rent-car-type-model/rent-car-type-model.component';
import { CarRentServiceService } from 'src/app/services/car-rent-service.service';
import { CountryService } from 'src/app/services/country.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rent-car-service',
  templateUrl: './rent-car-service.component.html',
  styleUrls: ['./rent-car-service.component.scss']
})
export class RentCarServiceComponent implements OnInit {
  country:boolean = true;
  country_search_text:string = '';
  countries_list:[] = [];
  updateCountryId:string;
  selected_country: any = null;
  tab_number: number = 1;
  rent_car_type_list:any[] = [];
  rent_car_brand_list: any[] = [];

  @ViewChild('typeModel', { static: true }) typeModel: RentCarTypeModelComponent;
  @ViewChild('brandModal', { static: true }) brandModal: RentCarBrandModelComponent;
  constructor(private _countryService: CountryService, public _helper: Helper, private _carRentServiceService: CarRentServiceService) { }

  ngOnInit(): void {
    this.getCountryList()
  }

  //get country list 
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.countries_list = res.country_list;
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

  onSelectCountry(country) {
    this.selected_country = country;
    this.onSelectTab(this.tab_number);
  }

  onSelectTab(tab_number: number) {
    this.tab_number = tab_number;
    if(tab_number == 1){
      this.getCarRentTypeList();
    } else {
      this.getCarRentBrandList();
    }
  }

  getCarRentTypeList(){
    let json = {
      country_id: this.selected_country._id
    }
    this._carRentServiceService.getRentCarTypeList(json).then(res => {
      if (res.success) {
        this.rent_car_type_list = res.car_rent_type_list;
      }else{
        this.rent_car_type_list = [];
      }
    })
  }

  getCarRentBrandList(){
    let json = {
      type: this._helper.BRAND.BRAND,
      country_id: this.selected_country._id
    }
    this._carRentServiceService.getRentCarTypeBrandModel(json).then(res => {
      if (res.success) {
        this.rent_car_brand_list = res.list;
      }else{
        this.rent_car_brand_list = [];
      }
    })
  }

  opentypeModel(details): void {
    this.typeModel.show(details, this.selected_country);
  }

  openbrandModal(details) {
    this.brandModal.show(details, this.selected_country);
  }

}
