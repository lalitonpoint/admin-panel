import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-open-ride-completed',
  templateUrl: './open-ride-completed.component.html',
  styleUrls: ['./open-ride-completed.component.scss']
})
export class OpenRideCompletedComponent implements OnInit {
  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.OPEN_RIDE;
    this.requestSubType = this.RequestSubType.COMPLETED;
  }
}