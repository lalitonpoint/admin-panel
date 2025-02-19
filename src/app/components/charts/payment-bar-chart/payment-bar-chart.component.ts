import { Component, Input, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Colors } from '../../../constants/colors.service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-bar-chart',
  templateUrl: './payment-bar-chart.component.html'
})
export class PaymentBarChartComponent implements OnDestroy, OnInit {

  @Input() shadow = false;
  @Input() options;
  @Input() data;
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;

  chart: Chart;
  chartData: any;
  concatinedArray: any = [];

  barChartData = {
    datasets: [{
      borderColor: Colors.getColors().themeColor1,
      fill: false,
      backgroundColor: Colors.getColors().themeColor1,
      data: [],
      borderWidth: 2,
      pointBackgroundColor: "white",
      pointBorderColor: Colors.getColors().themeColor1,
      pointBorderWidth: 2,
      pointHoverBackgroundColor: Colors.getColors().themeColor1,
      pointHoverBorderColor: "white",
      pointHoverRadius: 6,
      pointRadius: 4,
      label: this._trans.instant('label-title.cash')
    },
    {
      borderColor: Colors.getColors().themeColor2,
      fill: false,
      backgroundColor: Colors.getColors().themeColor2,
      data: [],
      borderWidth: 2,
      pointBackgroundColor: "white",
      pointBorderColor: Colors.getColors().themeColor2,
      pointBorderWidth: 2,
      pointHoverBackgroundColor: Colors.getColors().themeColor2,
      pointHoverBorderColor: "white",
      pointHoverRadius: 6,
      pointRadius: 4,
      label: this._trans.instant('label-title.promo')
    },
    {
      borderColor: Colors.getColors().themeColor3,
      fill: false,
      backgroundColor: Colors.getColors().themeColor3,
      data: [],
      borderWidth: 2,
      pointBackgroundColor: "white",
      pointBorderColor: Colors.getColors().themeColor3,
      pointBorderWidth: 2,
      pointHoverBackgroundColor: Colors.getColors().themeColor3,
      pointHoverBorderColor: "white",
      pointHoverRadius: 6,
      pointRadius: 4,
      label: this._trans.instant('label-title.wallet')
    },
    {
      borderColor: Colors.getColors().themeColor4,
      fill: false,
      backgroundColor: Colors.getColors().themeColor4,
      data: [],
      borderWidth: 2,
      pointBackgroundColor: "white",
      pointBorderColor: Colors.getColors().themeColor4,
      pointBorderWidth: 2,
      pointHoverBackgroundColor: Colors.getColors().themeColor4,
      pointHoverBorderColor: "white",
      pointHoverRadius: 6,
      pointRadius: 4,
      label: this._trans.instant('label-title.other')
    }]
  }
  labels = []

  public constructor( private _trans: TranslateService) {
  }

  ngOnInit() {
    console.log(this.labels);
  }


  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
