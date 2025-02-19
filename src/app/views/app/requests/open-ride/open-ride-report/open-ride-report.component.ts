import { Component, OnInit } from '@angular/core';
import { RequestMainType } from 'src/app/constants/constants';

@Component({
  selector: 'app-open-ride-report',
  templateUrl: './open-ride-report.component.html',
  styleUrls: ['./open-ride-report.component.scss']
})
export class OpenRideReportComponent implements OnInit {
  RequestMainType = RequestMainType;

  requestMainType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.OPEN_RIDE;
  }
}