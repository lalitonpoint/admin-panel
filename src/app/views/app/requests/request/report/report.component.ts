import { Component, OnInit } from '@angular/core';
import { RequestMainType } from 'src/app/constants/constants';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  RequestMainType = RequestMainType;

  requestMainType: any;

  ngOnInit(): void {
    this.requestMainType = this.RequestMainType.NORMAL;
  }
}