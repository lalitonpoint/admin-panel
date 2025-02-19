import { Component, Input, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Helper } from 'src/app/shared/helper';
import { Colors } from '../../../constants/colors.service';
import { DashboardService } from 'src/app/services/dashboard.service';
 
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html'
})
export class LineChartComponent implements OnInit, OnDestroy {
  @Input() shadow = false;
  @Input() options;
  @Input() data;
  @Input() class = 'chart-container1';
  @Input() line_chart_item_bsRangeValue;
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  concatinatedArrray: any = [];
  is_negative: boolean = false;
  lineChartData:any;
  labels = [];
  chart: Chart;
  chartData: any = {
    datasets: [{
      label: "Test",
      data: [ 52, 58, 65, 78, 98, 138, 160],
      borderColor: '#000000',
      fill: false,
      borderWidth: 2,
      pointBackgroundColor: "white",
      pointBorderColor: "#000000",
      pointBorderWidth: 2,
      pointHoverBackgroundColor: "#000000",
      pointHoverBorderColor: "white",
      pointHoverRadius: 6,
      pointRadius: 4,
    }], 
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  };
  start_date:any ;
  end_date:any ;
  country_id: string = "all";

  public constructor( private _helper: Helper, private _dashboardService:DashboardService) {
    this._helper.country_id.subscribe((country_id) => {
      if(country_id){
        this.country_id = country_id;
        this.ngOnDestroy();
        this.ngOnInit();
      }
    })
  }
 
  parentCalled(){
    if(this.line_chart_item_bsRangeValue && this.line_chart_item_bsRangeValue.length > 0){
      if(this.chart){
        this.start_date = this.line_chart_item_bsRangeValue[1];
        this.end_date = this.line_chart_item_bsRangeValue[0];
        this.chart.destroy();
        this.chart = null;
        for(const datatset of this.lineChartData.datasets){
          datatset.data = [];
        }
        this.concatinatedArrray = [];
        this.labels = [];
      }
      this.ngOnInit();
    }
  }

  ngOnInit() {
    this.start_date = this.line_chart_item_bsRangeValue[0];
    this.end_date = this.line_chart_item_bsRangeValue[1];
    let json:any = {start_month :this.start_date,end_month:this.end_date,country_id:this.country_id}
    if(this.start_date && this.end_date){
      this._dashboardService.getSixMonthEarning(json).then(res_data => {
        if(res_data.success){
          this.lineChartData = {
            datasets: [{
              borderColor: Colors.getColors().themeColor1,
              fill: false,
              data: [],
              borderWidth: 2,
              pointBackgroundColor: "white",
              pointBorderColor: Colors.getColors().themeColor1,
              pointBorderWidth: 2,
              pointHoverBackgroundColor: Colors.getColors().themeColor1,
              pointHoverBorderColor: "white",
              pointHoverRadius: 6,
              pointRadius: 4,
              label: this._helper.trans.instant('label-title.admin-earnings')
            },
            {
              borderColor: Colors.getColors().themeColor2,
              fill: false,
              data: [],
              borderWidth: 2,
              pointBackgroundColor: "white",
              pointBorderColor: Colors.getColors().themeColor2,
              pointBorderWidth: 2,
              pointHoverBackgroundColor: Colors.getColors().themeColor2,
              pointHoverBorderColor: "white",
              pointHoverRadius: 6,
              pointRadius: 4,
              label: this._helper.trans.instant('label-title.provider') + ' ' + this._helper.trans.instant('menu.earnings')
            },
            {
              borderColor: Colors.getColors().themeColor5,
              fill: false,
              data: [],
              borderWidth: 2,
              pointBackgroundColor: "white",
              pointBorderColor: Colors.getColors().themeColor5,
              pointBorderWidth: 2,
              pointHoverBackgroundColor: Colors.getColors().themeColor5,
              pointHoverBorderColor: "white",
              pointHoverRadius: 6,
              pointRadius: 4,
              label: this._helper.trans.instant('label-title.total')
            }]
          }
          let response_data = res_data.total;
          if(res_data.total.length > 6){
            response_data = res_data.total.slice(0, 6);
          }
  
          if (this.shadow) {
            Chart.controllers.lineWithShadow = Chart.controllers.line;
            Chart.controllers.lineWithShadow = Chart.controllers.line.extend({
              draw(ease) {
                Chart.controllers.line.prototype.draw.call(this, ease);
                const chartCtx = this.chart.ctx;
                chartCtx.save();
                chartCtx.shadowColor = 'rgba(0,0,0,0.15)';
                chartCtx.shadowBlur = 10;
                chartCtx.shadowOffsetX = 0;
                chartCtx.shadowOffsetY = 10;
                chartCtx.responsive = true;
                chartCtx.stroke();
                Chart.controllers.line.prototype.draw.apply(this, arguments);
                chartCtx.restore();
              }
            });
          }

          // set for unique month-year
          const uniqueLabelsSet = new Set();
          let months = ['none',this._helper.trans.instant('month-name.jan'),this._helper.trans.instant('month-name.fab'),this._helper.trans.instant('month-name.mar'),this._helper.trans.instant('month-name.apr'),this._helper.trans.instant('month-name.may'),this._helper.trans.instant('month-name.jun'),this._helper.trans.instant('month-name.jul'),this._helper.trans.instant('month-name.aug'),this._helper.trans.instant('month-name.sep'),this._helper.trans.instant('month-name.oct'),this._helper.trans.instant('month-name.nov'),this._helper.trans.instant('month-name.dec')];
          response_data.forEach(data => {
            this.lineChartData.datasets[0].data.push(data.admin_earning.toFixed(2))
            this.lineChartData.datasets[1].data.push(data.provider_earning.toFixed(2))
            this.lineChartData.datasets[2].data.push(data.total.toFixed(2))
            const monthName = months[data._id.month];
            const label = `${monthName} ${data._id.year}`;

            uniqueLabelsSet.add(label);
          });
          this.labels = [...uniqueLabelsSet];
          
          this.chartData = this.lineChartData
          this.chartData.labels = this.labels
          this.concatinatedArrray = this.lineChartData.datasets[0].data
          this.concatinatedArrray = this.concatinatedArrray.concat(this.lineChartData.datasets[1].data)
          this.concatinatedArrray = this.concatinatedArrray.concat(this.lineChartData.datasets[2].data)
          let max_value = Math.max(...this.concatinatedArrray)
          let min_value = Math.min(...this.concatinatedArrray)
  
          let slot = 10;
          let near_max = this._helper.findnearest(max_value);
          let near_min = this._helper.findnearest(min_value);
          let slot_range = 0;
          if(Number(Math.ceil(min_value)) < 0){
            slot_range = this._helper.findnearest((near_max + near_min) / slot);
          }else{
            slot_range = this._helper.findnearest((near_max - near_min) / slot);
          }
  
          const chartRefEl = this.chartRef.nativeElement;
          const ctx = chartRefEl.getContext('2d');
          this.chart = new Chart(ctx, {
            type: this.shadow ? 'lineWithShadow' : 'line',
            data: this.chartData,
            options: this.options
          });
          this.chart.options.scales.yAxes[0].ticks.max = near_max
          this.chart.options.scales.yAxes[0].ticks.min = -near_min
          this.chart.options.scales.yAxes[0].ticks.stepSize = slot_range
          this.chart.update()
        }
      })
    }
  }

  findtest(value){
    value = Math.abs(Math.ceil(value));
    let length = value.toString().length;

    if(length === 1){
      return length;
    }else{
      let test1 = "1";
      for (let index = 0; index < length -1 ; index++) {
        test1 = test1 + "0";      
      }
      let test2 = value % Number(test1);
      let test3 = value - test2;
      let test4:any = test2.toString().length === length - 1 ? Number(test2.toString()[0]) + 1 : 1;
      for (let index = 0; index < length - 2 ; index++) {
        test4 = test4 + "0";      
      }
      let final = Number(test3) + Number(test4);
      return final
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}