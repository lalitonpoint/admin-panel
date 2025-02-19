import { Component, EventEmitter,  Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotifiyService } from 'src/app/services/notifier.service';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';
@Component({
  selector: 'app-add-new-surge-time-modal',
  templateUrl: './add-new-surge-time-modal.component.html',
  styleUrls: ['./add-new-surge-time-modal.component.scss']
})
export class AddNewSurgeTimeModalComponent {
  surgeDayForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  basicTime = new Date();
  addSlotTime = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  }
  daysSurgeBoolean  = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  }
  errorMultiplier: boolean = false;
  errorMaxvalue: boolean = false;
  errorStartTime: boolean = false;
  errorEndTime: boolean = false;
  btnDisable: boolean = false;
  is_surge_hours: boolean = false;
  service_type_id: string;
  multiplier: number;
  start_time: any;
  end_time: any;
  cityid: string;
  surge_hours: any = [];
  day_time: any = [];
  delete_slot_time: any = [];
  ngModelOptions = { 
    updateOn: 'submit'
  };

  @Output() data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(public _helper:Helper,private modalService: BsModalService, private typeCityService: TypeCityAssociationService,private _notifiyService:NotifiyService) { }

  show(surge_hours, is_surge_hours, city_id, service_type_id): void {
    this.cityid = city_id
    this.service_type_id = service_type_id;
    this.is_surge_hours = is_surge_hours;
    this.surge_hours = surge_hours;
    surge_hours.forEach((element,index) => {
      this.daysSurgeBoolean[index] = element.is_surge
    });
    this.delete_slot_time = JSON.parse(JSON.stringify(surge_hours))
    this.modalRef = this.modalService.show(this.template, this.config);
    this.addSlotTime = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false
    }
  }
  pad2(number) {
    return (number < 10 ? '0' : '') + number
  }
  addNewSlot(index) {
    this.errorMultiplier = false;
    this.errorStartTime = false;
    this.errorEndTime = false;
    this.errorMaxvalue = false;
    this.start_time = undefined;
    this.end_time = undefined;
    this.multiplier = undefined;
    this.addSlotTime = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false
    }
    if (this.addSlotTime[index]) {
      this.addSlotTime[index] = false
    } else {
      this.addSlotTime[index] = true
    }
  }
  // save day slot 
  saveSlot(index) {
    if (!this.multiplier || !this.start_time || !this.end_time || this.multiplier > 99999) {
      if (!this.multiplier) {
        this.errorMultiplier = true;
      }
      if (!this.start_time) {
        this.errorStartTime = true;
      }
      if (!this.end_time) {
        this.errorEndTime = true;
      }

      if(this.multiplier > 99999){
        this.errorMaxvalue = true;
      }
      return;
    } else {
      this.errorMultiplier = false;
      this.errorStartTime = false;
      this.errorEndTime = false;
      this.errorMaxvalue = false;
    }
    if ((this.start_time < this.end_time) && this.end_time && this.start_time && this.multiplier) {
      let openHour = this.pad2((new Date(this.start_time.getTime())).getHours());
      let closeHour = this.pad2((new Date(this.end_time.getTime())).getHours());
      let openMinute = this.pad2((new Date(this.start_time.getTime())).getMinutes());
      let closeMinute = this.pad2((new Date(this.end_time.getTime())).getMinutes());
      let open_time = openHour + ':' + openMinute;
      let close_time = closeHour + ':' + closeMinute;

      this.addSlotTime[index] = false;
      if (this.surge_hours[index].day_time) {
        this.surge_hours[index].day_time.push({ start_time: open_time, end_time: close_time, multiplier: this.multiplier })
      } else {
        this.day_time.push({ start_time: open_time, end_time: close_time, multiplier: this.multiplier })
        this.surge_hours[index]['day_time'] = this.day_time;
      }
      this.start_time = undefined;
      this.end_time = undefined;
      this.multiplier = undefined;
    }else{
      this._notifiyService.showNotification('error',this._helper.trans.instant('label-title.end-time-must-be-greater-than-the-start-time'))
    }
  }

  changeDay(event:any,index){
    this.daysSurgeBoolean[index] =event;
    if (this.addSlotTime[index]) {
      this.addSlotTime[index] = false
    }
  }

  // update days surge
  onSave() {
    for (let index = 0; index <= 6 ; index++) {
     this.surge_hours[index].is_surge = this.daysSurgeBoolean[index]
    }
    this.btnDisable = true;
    let josn: any = { is_surge_hours: this.is_surge_hours, cityid: this.cityid, service_type_id: this.service_type_id, surge_hours: this.surge_hours }
    this.typeCityService.updateSurgeHour(josn).then(res => {
      if (res.success) {
        this.data.emit(1);
        this.onClose();
        setTimeout(() => {
          this.btnDisable = false;
        }, 500);
      } else {
        this.btnDisable = false;
      }
    })
  }

  onCheck(slot_index, day_index) {
    this.surge_hours[day_index].day_time.splice(slot_index, 1);
  }

  onClose() {
    this.modalRef.hide();
    this.errorMultiplier = false;
    this.errorStartTime = false;
    this.errorEndTime = false;
    this.errorMaxvalue = false;
    this.start_time = undefined;
    this.end_time = undefined;
    this.multiplier = undefined;
  }

  ////
  onMultipler(multiplier) {
    if (multiplier) {
      this.errorMultiplier = false;
      this.errorMaxvalue = false;
    }
  }

}
