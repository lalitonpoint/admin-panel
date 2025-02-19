import { TranslateService } from '@ngx-translate/core';
import { Component, Input, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Helper } from 'src/app/shared/helper';
import { Colors } from '../../../constants/colors.service';
import { DashboardService } from 'src/app/services/dashboard.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html'
})
export class BarChartComponent implements OnDestroy, OnInit {
  @Input() shadow = false;
  @Input() options;
  @Input() data;
  @Input() class = 'chart-container1';
  @Input() bar_chart_item_bsRangeValue;
  chart: Chart;
  chartData: any;
  max_number: number;
  min_number: number;
  concatinedArray: any = [];
  start_date;
  end_date;  
  barChartData:any;
  labels = [];
  country_id: string = "all";

  @ViewChild('chart', { static: true }) chartRef: ElementRef;

  public constructor( private _helper: Helper, private translate: TranslateService,private _dashboardService:DashboardService) {
    this._helper.country_id.subscribe((country_id) => {
      if(country_id){
        this.country_id = country_id;
        this.ngOnDestroy();
        this.ngOnInit();
      }
    })
  }

  parentCalled(){
    if(this.bar_chart_item_bsRangeValue && this.bar_chart_item_bsRangeValue.length > 0){
      if(this.chart){
        this.start_date = this.bar_chart_item_bsRangeValue[1];
        this.end_date = this.bar_chart_item_bsRangeValue[0];
        this.chart.destroy();
        this.chart = null;
        for(const dataset of this.barChartData.datasets){
          dataset.data = [];
        }
        this.concatinedArray = [];
        this.labels = [];
      }
      this.ngOnInit();
    }
  }

  ngOnInit() {
    this.start_date = this.bar_chart_item_bsRangeValue[0];
    this.end_date = this.bar_chart_item_bsRangeValue[1];
    let json:any = {start_month :this.start_date,end_month:this.end_date,country_id:this.country_id}
    if(this.start_date && this.end_date){
      this._dashboardService.getSixMonthTrip(json).then(res_data => {
        if (res_data.success) {
          this.barChartData = {
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
              label: this.translate.instant('label-title.cancelled')
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
              label: this.translate.instant('label-title.completed')
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
              label: this.translate.instant('label-title.total')
            },
            ]
          }
          if (this.shadow) {
            Chart.defaults.global.datasets.barWithShadow = Chart.defaults.global.datasets.bar;
            Chart.defaults.barWithShadow = Chart.defaults.bar;
            Chart.controllers.barWithShadow = Chart.controllers.bar.extend({
              draw(ease) {
                Chart.controllers.bar.prototype.draw.call(this, ease);
                const chartCtx = this.chart.ctx;
                chartCtx.save();
                chartCtx.shadowColor = 'rgba(0,0,0,0.2)';
                chartCtx.shadowBlur = 7;
                chartCtx.shadowOffsetX = 5;
                chartCtx.shadowOffsetY = 7;
                chartCtx.responsive = true;
                Chart.controllers.bar.prototype.draw.apply(this, arguments);
                chartCtx.restore();
              }
            });
          }
  
          let test = res_data.total
          if(res_data.total.length > 6){
            test = res_data.total.slice(0, 6);
          }
          // set for unique month-year
          const uniqueLabelsSet = new Set();
          let months = ['none',this.translate.instant('month-name.jan'),this.translate.instant('month-name.fab'),this.translate.instant('month-name.mar'),this.translate.instant('month-name.apr'),this.translate.instant('month-name.may'),this.translate.instant('month-name.jun'),this.translate.instant('month-name.jul'),this.translate.instant('month-name.aug'),this.translate.instant('month-name.sep'),this.translate.instant('month-name.oct'),this.translate.instant('month-name.nov'),this.translate.instant('month-name.dec')];
          test.forEach(data => {
            this.barChartData.datasets[0].data.push(data.cancelled)
            this.barChartData.datasets[1].data.push(data.completed)
            this.barChartData.datasets[2].data.push(data.total)
            const monthName = months[data._id.month];
            const label = `${monthName} ${data._id.year}`;

            uniqueLabelsSet.add(label);
          });
          this.labels = [...uniqueLabelsSet];
          this.concatinedArray = this.barChartData.datasets[0].data
          this.concatinedArray = this.concatinedArray.concat(this.barChartData.datasets[1].data)
          this.concatinedArray = this.concatinedArray.concat(this.barChartData.datasets[2].data)
          let max_value = Math.max(...this.concatinedArray)
          let slot_value = Math.ceil(max_value / 10)
          max_value = Math.ceil(max_value) + slot_value
  
          const chartRefEl = this.chartRef.nativeElement;
          const ctx = chartRefEl.getContext('2d');
          this.chartData = this.barChartData
          this.chartData.labels = this.labels
          console.log({lab:this.labels})
          this.chart = new Chart(ctx, {
            type: this.shadow ? 'barWithShadow' : 'bar',
            data: this.chartData,
            options: this.options
          });
          this.chart.options.scales.yAxes[0].ticks.max = max_value
          this.chart.options.scales.yAxes[0].ticks.min = 0
          this.chart.options.scales.yAxes[0].ticks.stepSize = slot_value
          this.chart.update()
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
