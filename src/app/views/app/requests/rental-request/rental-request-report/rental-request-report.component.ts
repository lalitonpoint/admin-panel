import { Component, OnInit } from '@angular/core';
import { RequestMainType } from 'src/app/constants/constants';
@Component({
  selector: 'app-rental-request-report',
  templateUrl: './rental-request-report.component.html',
  styleUrls: ['./rental-request-report.component.scss']
})
export class RentalRequestReportComponent implements OnInit {

  RequestMainType = RequestMainType;

  requestMainType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.RENTAL_RIDE;
  }

}
