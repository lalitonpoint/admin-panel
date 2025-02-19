import { TranslateService } from '@ngx-translate/core';
import { Component, Input, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { Colors } from '../../../constants/colors.service'
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent implements OnDestroy, OnChanges {
  @Input() shadow = true;
  @Input() options;
  @Input() data;
  @Input() class = 'chart-container';
  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  chart: Chart;
  total_wallet_payment: number;
  total_promo_payment: number;
  total_other_payment: number;
  total_cash_payment: number;
  pieChartData1 = {
    labels: [
      // this.translate.instant('label-title.total-payment'), 
      this.translate.instant('label-title.admin-earning'),
      this.translate.instant('label-title.provider-earning'
      )],
    datasets: [{
      backgroundColor: [Colors.getColors().themeColor1_10, Colors.getColors().themeColor2_10, Colors.getColors().themeColor3_10],
      borderColor: [Colors.getColors().themeColor1, Colors.getColors().themeColor2, Colors.getColors().themeColor3],
      borderWidth: 3,
      data: [],
      label: "",
    }]
  }
  pieChartData2: any;

  public constructor(private translate: TranslateService, private _helper: Helper) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart) {
      this.chart.destroy();
    }

    Chart.defaults.pieWithShadow = Chart.defaults.pie;
    Chart.controllers.pieWithShadow = Chart.controllers.pie.extend({
      draw(ease) {
        Chart.controllers.pie.prototype.draw.call(this, ease);
        const chartCtx = this.chart.chart.ctx;
        chartCtx.save();
        chartCtx.shadowColor = 'rgba(0,0,0,0.15)';
        chartCtx.shadowBlur = 10;
        chartCtx.shadowOffsetX = 0;
        chartCtx.shadowOffsetY = 10;
        chartCtx.responsive = true;
        Chart.controllers.pie.prototype.draw.apply(this, arguments);
        chartCtx.restore();
      }
    });
    if (this.data.total > 0) {
      this.pieChartData1.datasets[0].data = [
        // this.data.total, 
        this.data.total_admin_earning?.toFixed(this._helper.to_fixed_number),
        this.data.total_provider_earning?.toFixed(this._helper.to_fixed_number)]
      const chartRefEl = this.chartRef.nativeElement;
      const ctx = chartRefEl.getContext('2d');
      this.chart = new Chart(ctx, {
        type: this.shadow ? 'pieWithShadow' : 'pie',
        data: this.pieChartData1,
        options: this.options
      });
    } else if (this.data?.total_cash_payment) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.pieChartData2 = {
        labels: [
          this.translate.instant('label-title.wallet'),
          this.translate.instant('label-title.card'),
          this.translate.instant('label-title.cash'),
          this.translate.instant('label-title.promo'),
          this.translate.instant('label-title.remaining'),],
        datasets: [{
          backgroundColor: [Colors.getColors().themeColor1_10, Colors.getColors().themeColor2_10, Colors.getColors().themeColor3_10, Colors.getColors().themeColor4_10, Colors.getColors().themeColor5_10],
          borderColor: [Colors.getColors().themeColor1, Colors.getColors().themeColor2, Colors.getColors().themeColor3, Colors.getColors().themeColor4, Colors.getColors().themeColor5],
          borderWidth: 3,
          data: [],
          label: "",
        }]
      }
      this.pieChartData2.datasets[0].data = [
        this.data.total_wallet_payment?.toFixed(this._helper.to_fixed_number),
        this.data.total_card_payment?.toFixed(this._helper.to_fixed_number),
        this.data.total_cash_payment?.toFixed(this._helper.to_fixed_number),
        this.data.total_promo_payment?.toFixed(this._helper.to_fixed_number),
        this.data.total_remaining_payment?.toFixed(this._helper.to_fixed_number)]
      const chartRefEl = this.chartRef.nativeElement;
      const ctx = chartRefEl.getContext('2d');
      this.chart = new Chart(ctx, {
        type: this.shadow ? 'pieWithShadow' : 'pie',
        data: this.pieChartData2,
        options: this.options
      });
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
