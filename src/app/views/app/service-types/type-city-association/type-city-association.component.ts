import { Component, OnInit, ViewChild, OnDestroy, Renderer2, } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { TripChargeSettingmodalComponent } from 'src/app/containers/pages/trip-charge-settingmodal/trip-charge-settingmodal.component';
import { TypeCityAssociationService } from '../../../../services/type-city-association.service'
import { Helper } from 'src/app/shared/helper';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-type-city-association',
  templateUrl: './type-city-association.component.html',
  styleUrls: ['./type-city-association.component.scss']
})

export class TypeCityAssociationComponent implements OnInit, OnDestroy {
  searchByList = [
    { label: 'label-title.city', value: 'city_detail.cityname' },
    { label: 'label-title.country', value: 'country_detail.countryname' },
    { label: 'label-title.type', value: 'type_detail.typename' },
  ];
  selectedSearchBy = { label: 'label-title.city', value: 'city_detail.cityname' };
  search_item: any = undefined;
  search_value: string = '';
  values: string = '';
  search_text: string = '';
  current_page: number = 0;
  itemsPerPage: number = 10;
  total_page: number;
  unit:number;
  tabType: number = 0;
  is_ride_share:number=1;
  typeCity_list:any [] = [];
  cityid: string;
  service_type_id: string;
  updateCityTypeId:string;
  currencysign:string;
  selected_cityType: any = null;
  zone_data:any;
  cityType_select_subscriber: Subscription;

  @ViewChild('scroll') scrollRef: PerfectScrollbarComponent;
  @ViewChild('tripChargeSettingModal', { static: true }) tripChargeSettingModal: TripChargeSettingmodalComponent;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;

  constructor(public _helper:Helper,private renderer: Renderer2, private typeCityService: TypeCityAssociationService,private _commonService:CommonService) { }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-footer');
    
    this.cityType_select_subscriber = this.typeCityService._unselectCityType.subscribe(() => {
      this.selected_cityType = null;
      this.selectTab(0)
    })
    this.cityType_select_subscriber = this.typeCityService._addCityType.subscribe(city => {
      this.fetchDataTypeCity();
    })
    this.cityType_select_subscriber = this.typeCityService._cityTypeChanges.subscribe(updatedId => {      
      this.updateCityTypeId=updatedId;
      this.fetchDataTypeCity();
    })
  }

  // tab selection function
  selectTab(tabId: number) {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }

  // Open Add Trip Charges Setting Modal
  showTripChargeSettingModal(): void {
    this.tripChargeSettingModal.show('');
  }

  // get typelist 
  fetchDataTypeCity() {    
    let json :any = {};
    this.typeCityService.getAllTypeCitylist(json).then(res => {
      if (res.success) {
        this.typeCity_list = res.city_price_list;
        if (this.typeCity_list.length > 0) {
          if(this.updateCityTypeId){
            let index = this.typeCity_list.findIndex((x) => x._id == this.updateCityTypeId)
            this.onSelectCityType(res.city_price_list[index])
          }else{
            this.onSelectCityType(res.city_price_list[0])
          }
          this.total_page = res.total_page
        }
      } else {
        this.typeCity_list = []
      }
    })
  }

  // search city, country, type filter flow start 
  changeSearchBy(event) {
    this.selectedSearchBy = event;
  }

  applyFilter() {
    this.search_item = this.selectedSearchBy.value
    this.search_value = this.values
    this.current_page = 0;
    this.fetchDataTypeCity();
  }

  onPage(event): void {
    this.current_page = event.page - 1
    this.fetchDataTypeCity();
  }
  // search city, country, type filter flow end

  // Select the particular typecity 
  onSelectCityType(typeCity) {
    if(this.tabType!=1){
      this.selectTab(0);
    }else{
      this.tabType = 1;
      this.selectTab(1); 
    }
    this.selected_cityType = typeCity;
    this.is_ride_share=typeCity.is_ride_share;    
    this.typeCityService._cityTypeSelect.next(typeCity);
    this.zone_data = null;
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-footer');
    this.cityType_select_subscriber.unsubscribe()
    this.updateCityTypeId=null;
  }

  // ids pass by surge tab, zone tab and rental tab 
  fetchIds(type) {
    this.tabType = type;
    if(type==2){
      this.currencysign =this.selected_cityType.country_detail.currencysign;
    }
    if(type==3){
      this.unit=this.selected_cityType.city_detail.unit;
      this.currencysign =this.selected_cityType.country_detail.currencysign;
    }
    if (this.selected_cityType) {
      this.cityid = this.selected_cityType.cityid;
      this.service_type_id = this.selected_cityType._id;
    }
    if(type == 4){
      this.getZoneList();
    }
  }

  //get zone price list 
  getZoneList(){
    let josn: any = { cityid: this.cityid, service_type_id: this.service_type_id }
    this.typeCityService.fetchZonePrice(josn).then(res => {
      if (res.success) {
        this.zone_data = res;
        this.zone_data.zone_list.forEach((zone) => {
          zone.is_checked = false;
          this.selected_cityType.zone_ids.forEach((zone_id) => {
            if(zone_id == zone._id){
              zone.is_checked = true;
            }
          })
        })
      } else {
        this.zone_data = null;
      }
    })
  }

  //when zone cheked or unchecked
  zoneForQueueCheck(zone){
    zone.is_checked = !zone.is_checked;
  }

  //save zone for queue
  saveZoneForQueue(){
    let checkedZoneArray:any [] = [];
    this.zone_data.zone_list.forEach((zone) => {
      if(zone.is_checked){
        checkedZoneArray.push(zone._id)
      }
    })
    let json: any = { service_type_id: this.service_type_id,zone_ids:checkedZoneArray }
    this.typeCityService.addZoneQueue(json).then((response) => {
      if(response.success){
        this.typeCityService._cityTypeChanges.next(json.service_type_id);
        this.fetchDataTypeCity();
      }
    })
  }

}
