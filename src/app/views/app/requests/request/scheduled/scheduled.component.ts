import { Component, OnInit } from '@angular/core';
import { RequestMainType, RequestSubType } from 'src/app/constants/constants';

@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss']
})
export class ScheduledComponent implements OnInit {
  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  requestMainType: any;
  requestSubType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.NORMAL;
    this.requestSubType = this.RequestSubType.SCHEDULED;
  }
}