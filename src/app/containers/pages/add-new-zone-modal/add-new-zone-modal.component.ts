import { Component, EventEmitter, HostListener, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotifiyService } from 'src/app/services/notifier.service';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';
import { ZoneData } from '../../../models/zones.model'

@Component({
  selector: 'app-add-new-zone-modal',
  templateUrl: './add-new-zone-modal.component.html',
  styleUrls: ['./add-new-zone-modal.component.scss']
})
export class AddNewZoneModalComponent {
  ngModelOptions: (
    { updateOn: 'submit' }
  )
  deleteZonePriceModalRef: BsModalRef;
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  deleteZoneData: any;
  zone_data: ZoneData = new ZoneData();
  currencysign: any;
  airport_data: any;
  city_data: any;
  zone_price: any = [];
  city_price: any = [];
  airport_price: any = [];
  singleZonePrice: number;
  btnDisable: boolean = false;
  errorShow: boolean;
  maxValueError: boolean = false;
  maxValueErrorList: boolean[] = [];
  zoneAmount: number;
  type: number;
  zoneIndex: number;
  cityid: string;
  service_type_id: string;
  from_zone: string;
  to_zone: string;
  addClicked: boolean = false;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Output() parentHandler: EventEmitter<any> = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('deleteZonePriceTemplate', { static: true }) deleteZonePriceTemplate: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.parentHandler.emit(this.type);
        this.modalRef?.hide();
        this.errorShow = false;
        this.addClicked = false;
        this.maxValueErrorList = [];
      })
    }
  }

  constructor(private modalService: BsModalService, private typeCityService: TypeCityAssociationService, private _notifierService: NotifiyService, private _helper: Helper) { }

  show(data, type, city_id, service_type_id, currencysign): void {
    this.currencysign = currencysign;
    this.cityid = city_id
    this.service_type_id = service_type_id;
    if (type == 1) { // type: 1 -> zone data
      this.type = type;
      this.zone_data = data;
    } else if (type == 2) { // type: 2 -> city data
      this.type = type;
      this.city_data = JSON.parse(JSON.stringify(data));
    } else { // type: 3 -> airport data
      this.type = type;
      this.airport_data = JSON.parse(JSON.stringify(data));
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //fromzone selection 
  onChangeFormZone(from) {
    this.from_zone = from;
  }

  //tozone selection
  onChangeToZone(to) {
    this.to_zone = to;
  }

  changeZonePrice(event, i) {
    this.zoneIndex = i;
    this.singleZonePrice = event
    this.maxValueErrorList[i] = event > 99999;
  }

  checkMaxValue() {
    this.maxValueError = this.zoneAmount > 99999;
  }

  // update SignalZone price 
  updateSignalZone(data, i) {
    if (data) {
      if (this.singleZonePrice == null) {
        this.errorShow = true;
        return;
      } else {
        this.errorShow = false
      }
      // Check if the price exceeds the max value
      if (this.singleZonePrice > 99999) {
        this.maxValueErrorList[i] = true;  // Set max value error for specific row
        return; // Stop further execution if the max value is exceeded
      } else {
        this.maxValueErrorList[i] = false;  // Reset the max value error if the value is within range
      }
      if (this.zoneIndex != i) {
        this.singleZonePrice = data.amount
      }
      this.btnDisable = true;
      this.zone_price.push({ from: data.from, to: data.to, amount: this.singleZonePrice })
      let json: any = { cityid: this.cityid, service_type_id: this.service_type_id, zone_price: this.zone_price }
      this.typeCityService.updateTypeCity(json).then(res => {
        if (res.success) {
          this.getZoneList();
          this.singleZonePrice = null;
          this.zoneIndex = null;
          setTimeout(() => {
            this.zone_price = [];
            this.btnDisable = false;
          }, 500);
        } else {
          this.btnDisable = false;
        }
      })
    }
  }

  // delete SignalZone price 
  deleteSignalZone(data) {
    if (data._id) {
      this.btnDisable = true;
      let json: any = { cityid: this.cityid, service_type_id: this.service_type_id, delete_zone_id: data._id }
      this.typeCityService.updateTypeCity(json).then(res => {
        if (res.success) {
          this.getZoneList();
          this.closeDeleteZoneModel();
          setTimeout(() => {
            this.btnDisable = false;
          }, 500);
        } else {
          this.btnDisable = false;
        }
      })
    }
  }

  //add new zone data
  addNewZone(amount) {
    this.addClicked = true;
    if ((this.from_zone == null) || (this.to_zone == null) || (!this.zoneAmount && this.zoneAmount != 0) || (this.zoneAmount > 99999)) {
      return;
    }
    if(this.from_zone && this.to_zone && this.from_zone == this.to_zone){
      this._notifierService.showNotification('error',this._helper.trans.instant('validation-title.same-zones-are-not-allowed'))
      return
    }
    if (this.from_zone && this.to_zone && (amount || amount == 0)) {
      let checkjson: any = { cityid: this.cityid, service_type_id: this.service_type_id, from: this.from_zone, to: this.to_zone }
      this.typeCityService.checkZone(checkjson).then(res => { // check zone added or not
        if (res) {
          this.btnDisable = true;
          this.zone_price.push({ from: this.from_zone, to: this.to_zone, amount: amount })
          let json: any = { cityid: this.cityid, service_type_id: this.service_type_id, zone_price: this.zone_price }
          this.typeCityService.updateTypeCity(json).then(res => {
            if (res.success) {
              this.addClicked = false;
              this.getZoneList();
              setTimeout(() => {
                this.zoneAmount = 0;
                this.from_zone = null;
                this.to_zone = null;
                this.zone_price = [];
                this.btnDisable = false;
              }, 500);
            } else {
              this.btnDisable = false;
              this.zone_price = [];
            }
          })
        }
      })

    }
  }

  //fetch zone list
  getZoneList() {
    this.maxValueErrorList = [];
    let josn: any = { cityid: this.cityid, service_type_id: this.service_type_id }
    this.typeCityService.fetchZonePrice(josn).then(res => {
      if (res.success) {
        this.zone_data = res;
      } else {
        this.zone_data = null;
      }
    })
  }

  // all city price update
  cityPriceUpdate(data) {
    if (data) {
      let checkPrice = data.filter(value => {
        return value.price == null
      })
      if (checkPrice.length > 0) {
        this.errorShow = true;
        return;
      } else {
        this.errorShow = false
      }
      let checkMaxValue = data.filter(value => value.price > 99999);
      if (checkMaxValue.length > 0) {
        this.errorShow = true;
        this.maxValueError = true;
        return;
      }
      for (const datas of data) {
        this.city_price.push({ destination_city_id: datas.destination_name._id, price: datas.price })
      }
      this.btnDisable = true;
      let json: any = { cityid: this.cityid, service_type_id: this.service_type_id, city_price: this.city_price }
      this.typeCityService.updateTypeCity(json).then(res => {
        if (res.success) {
          this.parentHandler.emit(2);
          this.modalRef.hide();
          setTimeout(() => {
            this.city_price = []
            this.btnDisable = false;
          }, 500);
        } else {
          this.city_price = []
          this.btnDisable = false;
        }
      })
    }
  }

  // all airport price update
  airportPriceUpdate(data) {
    if (data) {
      let checkPrice = data.filter(value => {
        return value.price == null
      })
      if (checkPrice.length > 0) {
        this.errorShow = true;
        return;
      } else {
        this.errorShow = false
      }
      let checkMaxValue = data.filter(value => value.price > 99999);
      if (checkMaxValue.length > 0) {
        this.errorShow = true;
        this.maxValueError = true;
        return;
      }
      for (const datas of data) {
        if (datas.airport_id) {
          this.airport_price.push({ airport_id: datas.airport_id, price: datas.price })
        } else {
          this.airport_price.push({ airport_id: datas._id, price: datas.price })
        }
      }
      this.btnDisable = true;
      let json: any = { cityid: this.cityid, service_type_id: this.service_type_id, airport_price: this.airport_price }
      this.typeCityService.updateTypeCity(json).then(res => {
        if (res.success) {
          this.parentHandler.emit(3);
          this.modalRef.hide();
          setTimeout(() => {
            this.airport_price = []
            this.btnDisable = false;
          }, 500);
        } else {
          this.airport_price = []
          this.btnDisable = false;
        }
      })
    }
  }

  close(type) {
    this.parentHandler.emit(type);
    this.modalRef.hide();
    this.errorShow = false;
    this.addClicked = false;
    this.maxValueErrorList = [];
  }

  // open model delete zone to zone price
  deleteSignalZoneModel(data) {
    this.addClicked = false;
    this.modalRef.hide();
    this.deleteZoneData = data;
    this.deleteZonePriceModalRef = this.modalService.show(this.deleteZonePriceTemplate, this.confirmationModalConfig);
  }

  closeDeleteZoneModel() {
    this.deleteZonePriceModalRef.hide();
    this.modalRef = this.modalService.show(this.template, this.config);
  }
}
