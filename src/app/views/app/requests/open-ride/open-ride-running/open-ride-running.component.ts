import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-open-ride-running',
  templateUrl: './open-ride-running.component.html',
  styleUrls: ['./open-ride-running.component.scss']
})
export class OpenRideRunningComponent implements OnInit {
  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.OPEN_RIDE;
    this.requestSubType = this.RequestSubType.RUNNING;
  }
}