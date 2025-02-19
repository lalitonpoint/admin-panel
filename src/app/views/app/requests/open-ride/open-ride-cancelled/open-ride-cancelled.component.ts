import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-open-ride-cancelled',
  templateUrl: './open-ride-cancelled.component.html',
  styleUrls: ['./open-ride-cancelled.component.scss']
})
export class OpenRideCancelledComponent implements OnInit {
  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.OPEN_RIDE;
    this.requestSubType = this.RequestSubType.CANCELLED;
  }
}