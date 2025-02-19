import { Component } from '@angular/core';
import { ChartService } from '../../../components/charts/chart.service';
import { barChartData, barChartData2 } from '../../../data/charts';

@Component({
  selector: 'app-orders-bar-chart',
  templateUrl: './orders-bar-chart.component.html'
})
export class OrdersBarChartComponent{

  chartDataConfig: ChartService;
  barChartData = barChartData;
  ChartData2 = barChartData2;

  constructor(private chartService: ChartService) { 
    this.chartDataConfig = this.chartService;
  }

}
