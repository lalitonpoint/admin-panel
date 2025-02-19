import { Component } from '@angular/core';
import { ChartService } from '../../../components/charts/chart.service';
import { barChartData3 } from '../../../data/charts';

@Component({
  selector: 'app-version-bar-chart',
  templateUrl: './version-bar-chart.component.html',
  styleUrls: ['./version-bar-chart.component.scss']
})
export class VersionBarChartComponent{

  chartDataConfig: ChartService;
  barChartData = barChartData3;

  constructor(private chartService: ChartService) { 
    this.chartDataConfig = this.chartService;
  }

}
