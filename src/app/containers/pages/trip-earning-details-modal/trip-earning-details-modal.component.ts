import { Component, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DEFAULT_IMAGE,TRIP_TYPE } from 'src/app/constants/constants';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';
import { EarningService } from 'src/app/services/earning.service';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-trip-earning-details-modal',
  templateUrl: './trip-earning-details-modal.component.html',
  styleUrls: ['./trip-earning-details-modal.component.scss']
})
export class TripEarningDetailsModalComponent implements OnDestroy {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  DEFAULT_IMAGE = DEFAULT_IMAGE.USER_PROFILE;
  IMAGE_URL = environment.IMAGE_URL;
  TRIP_TYPE = TRIP_TYPE;
  split_payment_users: any;
  tripdetail: any;
  map: any;
  pickup_marker: any;
  dest_marker: any;
  tripAddress: any;
  sourcelocation: any;
  destlocation: any;
  trip_id: string;
  status: number;
  totalcharge: number;
  total: number;
  totalOtherCharge: number;
  userpayment: number;
  total_split_payment: number;
  totalTax:number;
  case_number:number = 0;
  is_show_total:boolean = true;
  buttonState = '';
  buttonDisabled = false; 
  timezone_for_display_date:string = '';

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private earningService: EarningService, public _helper: Helper) { }

  //open modal and get trip data from id
  show(id): void {
    this._helper.display_date_timezone.subscribe(data => {
      if(data){
        this.timezone_for_display_date = data;
      }
    })
    this.trip_id = id;
    this.getTripDetails();
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //get trip data
  getTripDetails() {
    let json: any = { trip_id: this.trip_id }
    this.earningService.getTripStatement(json).then(res => {      
      if (res.success) {
        this.totalcharge = 0;
        this.tripdetail = res.detail[0];
        if(this.tripdetail.trip_type == this.TRIP_TYPE.TRIP_TYPE_AIRPORT){
          this.is_show_total = false;
          this.case_number = 1;
        }else if(this.tripdetail.trip_type == this.TRIP_TYPE.TRIP_TYPE_ZONE){
          this.is_show_total = false;
          this.case_number = 2;
        }else if(this.tripdetail.trip_type == this.TRIP_TYPE.TRIP_TYPE_CITY){
          this.is_show_total = false;
          this.case_number = 3;
        }else if(this.tripdetail.is_fixed_fare == 1){
          this.is_show_total = false;
          this.case_number = 4;
        }else if(this.tripdetail.is_min_fare_used == 1){
          this.is_show_total = true;
          this.case_number = 5;
        }else{
          this.is_show_total = true;
          this.case_number = 0;
        }
        this.sourcelocation = res.detail[0].sourceLocation;
        this.destlocation = res.detail[0].destinationLocation;
        this.tripAddress = res.detail[0].destination_addresses;

        this.totalOtherCharge = this.tripdetail.tip_amount + this.tripdetail.toll_amount;
        this.totalTax = this.tripdetail.user_tax_fee + this.tripdetail.tax_fee + this.tripdetail.user_miscellaneous_fee;
        this.userpayment = this.tripdetail.wallet_payment + this.tripdetail.cash_payment + this.tripdetail.card_payment + this.tripdetail.remaining_payment;
        this.split_payment_users = res.detail[0].split_payment_users;

        let total = 0;
        this.split_payment_users.forEach((data) => {
          total += data.total;
        })
        this.total_split_payment = total;

        if (this.is_show_total && this.case_number == 0) {
          if (this.tripdetail.base_distance_cost > 0) {
            this.totalcharge += Number(this.tripdetail.base_distance_cost);
          }
          if (this.tripdetail.time_cost > 0) {
            this.totalcharge += Number(this.tripdetail.time_cost);
          }
          if (this.tripdetail.distance_cost > 0) {
            this.totalcharge += Number(this.tripdetail.distance_cost);
          }
          if (this.tripdetail.waiting_time_cost > 0) {
            this.totalcharge += Number(this.tripdetail.waiting_time_cost);
          }
          if (this.tripdetail.stop_waiting_time_cost > 0) {
            this.totalcharge += Number(this.tripdetail.stop_waiting_time_cost);
          }
          if (this.tripdetail.surge_fee > 0) {
            this.totalcharge += Number(this.tripdetail.surge_fee);
          }
        }
        if(!this.is_show_total || this.case_number != 0){
          this.totalcharge = this.tripdetail.total_after_surge_fees;
        }
      }
    })
  }

  closemodal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.trip_id = "";
    }, 1000);
  }

  ngOnDestroy(): void {
    this.trip_id = "";
  }

  downloadPdf(){    
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    const element = document.getElementById('htmlContent');
    const clonedElement = element.cloneNode(true) as HTMLElement;

    const targetDiv = clonedElement.querySelector('#test_trip');
    const additionalContentElement = document.createElement('div');
    additionalContentElement.innerHTML = `
    <div class="row d-flex flex-row justify-content-start justify-content-around mb-3">
    <div class="text-center ">
    <p class="text-center mb-1" style="font-size: large;font-weight: bold;">Trip ID : `+this.tripdetail.unique_id+`</p>
    </div>
    </div>
    `;
    // Append the new HTML content to the cloned element
    targetDiv.appendChild(additionalContentElement);
    
    const date = Math.floor(new Date().getTime() / 1000);

    const options = {
      filename: date + this.tripdetail.invoice_number + '.pdf', 
      margin: [10, 20, 10, 20] ,     

    };

    html2pdf().set(options).from(clonedElement).toPdf().save().then(() => {
      this.buttonState = '';
      this.buttonDisabled = false;
    }).catch((error) => {
      console.error('Error generating PDF', error);
    });
  }

}
