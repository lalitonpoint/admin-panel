import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-rental-request-cancelled',
  templateUrl: './rental-request-cancelled.component.html',
  styleUrls: ['./rental-request-cancelled.component.scss']
})
export class RentalRequestCancelledComponent implements OnInit {

  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.RENTAL_RIDE;
    this.requestSubType = this.RequestSubType.CANCELLED;
  }

}
