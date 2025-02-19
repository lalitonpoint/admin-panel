import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-rental-request-running',
  templateUrl: './rental-request-running.component.html',
  styleUrls: ['./rental-request-running.component.scss']
})
export class RentalRequestRunningComponent implements OnInit {
  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.RENTAL_RIDE;
    this.requestSubType = this.RequestSubType.RUNNING;
  }

}
