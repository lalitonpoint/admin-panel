import { Component } from '@angular/core';
import { ChartService } from '../../../components/charts/chart.service';
import { barChartData2 } from '../../../data/charts';

@Component({
  selector: 'app-order-bar-chart1',
  templateUrl: './order-bar-chart1.component.html',
  styleUrls: ['./order-bar-chart1.component.scss']
})
export class OrderBarChart1Component {

  chartDataConfig: ChartService;
  ChartData2 = barChartData2;

  constructor(private chartService: ChartService) { 
    this.chartDataConfig = this.chartService;
  }


}
