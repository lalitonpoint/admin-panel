import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TripChargeSettingmodalComponent } from 'src/app/containers/pages/trip-charge-settingmodal/trip-charge-settingmodal.component';
import { Subscription } from 'rxjs';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-trip-price',
  templateUrl: './trip-price.component.html',
  styleUrls: ['./trip-price.component.scss']
})
export class TripPriceComponent implements OnInit {
  cityType_subscriber:Subscription;
  selected_cityType: any = null;
  unit:number;
  currencysign:any;

  @Output() tripchargeHandler: EventEmitter<any> = new EventEmitter();
  @ViewChild('tripChargeSettingModal', { static: true }) tripChargeSettingModal: TripChargeSettingmodalComponent;

  constructor(private typeCityService:TypeCityAssociationService,public _helper:Helper) { }

  ngOnInit(): void {
    this.cityType_subscriber = this.typeCityService._cityTypeSelect.subscribe(cityType=>{
      if(cityType){
        this.selected_cityType = JSON.parse(JSON.stringify(cityType))
        this.unit=this.selected_cityType.city_detail.unit;
        this.currencysign = this.selected_cityType.country_detail.currencysign;
      }
    })
    this.cityType_subscriber = this.typeCityService._unselectCityType.subscribe(() => {
      this.selected_cityType = null ;     
    })
  }

  //open trip charge setting modal 
  showPriceSettingModal(): void{
    this.tripChargeSettingModal.show(this.selected_cityType);
  }
  
  ngOnDestroy() {
    this.cityType_subscriber.unsubscribe()
  }

  // child to parent call
  parentCall(){    
    this.tripchargeHandler.emit();
  }
}
