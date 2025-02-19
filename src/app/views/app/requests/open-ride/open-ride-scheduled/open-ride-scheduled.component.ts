import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-open-ride-scheduled',
  templateUrl: './open-ride-scheduled.component.html',
  styleUrls: ['./open-ride-scheduled.component.scss']
})
export class OpenRideScheduledComponent implements OnInit {
  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.OPEN_RIDE;
    this.requestSubType = this.RequestSubType.SCHEDULED;
  }
}