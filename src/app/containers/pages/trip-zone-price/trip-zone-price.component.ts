import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AddNewZoneModalComponent } from 'src/app/containers/pages/add-new-zone-modal/add-new-zone-modal.component';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { ZoneData} from '../../../models/zones.model'
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-trip-zone-price',
  templateUrl: './trip-zone-price.component.html',
  styleUrls: ['./trip-zone-price.component.scss']
})
export class TripZonePriceComponent implements OnChanges {
  selected_cityType: any;
  zone_data: ZoneData = new ZoneData();
  airport_data:any []= [];
  city_data:any []= [];
  zoneLength:number;

  @Input() currencysign: any;
  @Input() cityid: any;
  @Input() service_type_id: any;
  @ViewChild('zoneSettingModal', { static: true }) zoneSettingModal: AddNewZoneModalComponent;

  constructor(public _helper:Helper,private typeCityService: TypeCityAssociationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getAirportList();
    this.getZoneList();
    this.getCityList();
  }

  // get airport price list
  getAirportList(){
    let josn: any = { cityid: this.cityid, service_type_id: this.service_type_id }
    this.typeCityService.fetchAirportPrice(josn).then(res => {
      if (res.success) {
        if(res.airport_value.length>0){
          this.airport_data = res.airport_value;
          if(res.airport_value.length != res.airport_list.length) {
            for(let data of res.airport_list) {
              let obj = this.airport_data.find((obj) => obj.airport_id == data._id)
              if(!obj) {
                this.airport_data.push(data)
              }
            }
          }
        } else {
          this.airport_data = res.airport_list;
        }
      } else {
        this.airport_data = []
      }
    })
  }
  
  //get zone price list 
  getZoneList(){
    let josn: any = { cityid: this.cityid, service_type_id: this.service_type_id }
    this.typeCityService.fetchZonePrice(josn).then(res => {
      if (res.success) {
        this.zone_data = res;
        this.zoneLength = this.zone_data.zone_value.length;
      } else {
        this.zone_data = null;
        this.zoneLength = 0;
      }
    })
  }

  // get city price list 
  getCityList(){
    let josn: any = { cityid: this.cityid, service_type_id: this.service_type_id }
    this.typeCityService.fetchCityPrice(josn).then(res => {
      if (res.success) {
        if(res.city_value.length > 0 && res.city_list.length > 0){
          const filtered_city_list = res.city_list;
          const cityValueArrayMap = new Map();
          for (const element of res.city_value) {
              cityValueArrayMap.set(element.destination_name._id, element);
          }
  
          for (let i = 0; i < filtered_city_list.length; i++) {
              const destinationId = filtered_city_list[i].destination_name._id;
              if (cityValueArrayMap.has(destinationId)) {
                filtered_city_list[i] = cityValueArrayMap.get(destinationId);
              }
          }
          this.city_data = filtered_city_list;
        }else{
          this.city_data = res.city_list;
        }
      } else {
        this.city_data = [];
      }
    })
  }

  openZoneModal(list, type): void {
    this.zoneSettingModal.show(list, type,this.cityid,this.service_type_id,this.currencysign);
  }

  handlerCall(type){
    if(type == 1){
      this.getZoneList()
    }else if(type == 2){
      this.getCityList()
    }else if(type == 3){
      this.getAirportList()
    }
  }
}
