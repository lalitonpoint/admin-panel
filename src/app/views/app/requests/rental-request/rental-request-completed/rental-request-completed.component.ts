import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-rental-request-completed',
  templateUrl: './rental-request-completed.component.html',
  styleUrls: ['./rental-request-completed.component.scss']
})
export class RentalRequestCompletedComponent implements OnInit {

  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.RENTAL_RIDE;
    this.requestSubType = this.RequestSubType.COMPLETED;
  }

}
