import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AddNewPlaceModalComponent } from '../add-new-place-modal/add-new-place-modal.component';
import { AddNewSurgeTimeModalComponent } from '../add-new-surge-time-modal/add-new-surge-time-modal.component';
import { Subscription } from 'rxjs';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-trip-surge-price',
  templateUrl: './trip-surge-price.component.html',
  styleUrls: ['./trip-surge-price.component.scss']
})
export class TripSurgePriceComponent implements OnInit {
  @Input() tabType:any;
  cityType_subscriber: Subscription;
  selected_cityType: any = null;
  rich_area_surge: any[] = [];
  zone_data: any;

  surge_hours = [
    { day: '0', is_surge: false },
    { day: '1', is_surge: false },
    { day: '2', is_surge: false },
    { day: '3', is_surge: false },
    { day: '4', is_surge: false },
    { day: '5', is_surge: false },
    { day: '6', is_surge: false }
  ];
  is_surge_hours: boolean = false;
  cityid: string;
  service_type_id: string;

  @ViewChild('daysSurgeModal', { static: true }) daysSurgeModal: AddNewSurgeTimeModalComponent;
  @ViewChild('richAreaSurgeModal', { static: true }) richAreaSurgeModal: AddNewPlaceModalComponent;

  constructor(public _helper:Helper,private typeCityService: TypeCityAssociationService) { }

  ngOnInit(): void {
    this.cityType_subscriber = this.typeCityService._cityTypeSelect.subscribe(cityType => {
      if (cityType) {
        this.selected_cityType = JSON.parse(JSON.stringify(cityType))
        this.is_surge_hours = this.selected_cityType.is_surge_hours;
        this.surge_hours = this.selected_cityType.surge_hours;
        this.cityid = this.selected_cityType.cityid;
        this.service_type_id = this.selected_cityType._id;

        if(this.tabType == 1 ){
          this.rich_area_surge = [];
          this.richAreaList();
         }
      }
    })
    this.cityType_subscriber = this.typeCityService._unselectCityType.subscribe(() => {
      this.is_surge_hours = false;
      this.selected_cityType = null;
      this.rich_area_surge = [];
      this.surge_hours = [];
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.tabType == 1 ){
      this.rich_area_surge = [];
      this.richAreaList();
     }
  }

  //get data from child
  getData(data){
    this.surge_hours = data.surge_hours;
    this.is_surge_hours = data.is_surge_hours;
  }

  //rich surge area list
  richAreaList() {
    let josn: any = { cityid: this.selected_cityType.cityid, service_type_id: this.selected_cityType._id }
    this.typeCityService.fetchZonePrice(josn).then(res => {
      if (res.success) {
        this.zone_data = res.zone_list;
        for (const iterator of this.zone_data) {
          if (this.selected_cityType.rich_area_surge && this.selected_cityType.rich_area_surge.length > 0) {
            let surge_index = this.selected_cityType.rich_area_surge.findIndex((x) => x.id == iterator._id)
            let zone_index = this.zone_data.findIndex((x) => x._id == iterator._id)
            let surge_multiplier = 1;
            if (surge_index != -1) {
              this.rich_area_surge.push({ surge_multiplier: this.selected_cityType.rich_area_surge[surge_index].surge_multiplier, title: this.zone_data[zone_index].title, id: this.zone_data[zone_index]._id })
            }else{
            this.rich_area_surge.push({ surge_multiplier: surge_multiplier, title: iterator.title, id: iterator._id })
            }
          } else {
            this.rich_area_surge.push({ surge_multiplier:'', title: iterator.title, id: iterator._id })
          }
        }
      } else {
        this.zone_data = null;
      }
    })
  }
  // open days surge booking modal
  opensSurgeTimeModal(): void {
    this.daysSurgeModal.show(this.surge_hours, this.is_surge_hours, this.cityid, this.service_type_id);
  }
  // open rich surge modal
  openRichAreaSurgeModal(): void {
    this.richAreaSurgeModal.show(this.rich_area_surge, this.cityid, this.service_type_id);
  }

  ngOnDestroy() {
    this.rich_area_surge = [];
    this.cityType_subscriber.unsubscribe()
  }

}
