import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartService } from '../../../components/charts/chart.service';
import { lineChartData, pieChartData } from '../../../data/charts';
import { LineChartComponent } from 'src/app/components/charts/line-chart/line-chart.component';
import { Helper } from 'src/app/shared/helper';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-sales-chart-card',
    templateUrl: './sales-chart-card.component.html'
})
export class SalesChartCardComponent implements OnInit {
    chartDataConfig: any;
    lineChartData = lineChartData;
    pieChartData = pieChartData;
    line_chart_item_bsRangeValue = [];
    todayDate: Date = new Date();
    selected_end_month: any;
    selected_start_month: any;
    week_days = [];
    created_at: Date = null;

    @ViewChild('lineChart', { static: true }) lineChart: LineChartComponent;

    constructor(private chartService: ChartService, public _helper: Helper, private _settingService: SettingsService) {
        this.chartDataConfig = this.chartService;
    }

    ngOnInit() {
        this.configMonthList()
    }

    configMonthList() {
        if (this._helper.user_details) {
            let json: any = { admin_id: this._helper.user_details._id };
            this._settingService.getSettingDetails(json).then((response) => {
                if (response.success && response.setting_detail) {
                    this.created_at = response.setting_detail[0].created_at;

                    if (this.created_at) {
                        this.week_days = this._helper.getSixMonthDifference(this.created_at);
                        this.week_days[this.week_days.length - 1][1] = new Date();
                        if (this.week_days) {
                          this.week_days = this.week_days.reverse();
                        }
                        this.selected_start_month = this.week_days[0][0];
                        this.selected_end_month = this.week_days[0][1];
                        this.line_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
                        this.line_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
                        this.lineChart.parentCalled();
                    } else {
                        let months;
                        let d2 = new Date();
                        let d1 = new Date(this.created_at);
                        months = (d2.getFullYear() - d1.getFullYear()) * 12;
                        months -= d1.getMonth();
                        months += d2.getMonth();
                        let bet_months = months <= 0 ? 0 : months;
                        let months_between = Math.ceil(bet_months / 6) + 1;

                        for (let index = 0; index < months_between; index++) {
                            let date = this.week_days[index - 1] ? this.week_days[index - 1] : new Date();
                            this.week_days.push(this._helper.getMonthDay(date, index).toString());
                        }
                        if (this.week_days.length == 8) {
                            this.week_days = [...new Set(this.week_days)];
                            this.selected_start_month = this.week_days[0];
                            this.selected_end_month = this.week_days[1];
                            this.line_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
                            this.line_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
                            this.lineChart.parentCalled();
                        }
                        this.selected_start_month = this.week_days[1];
                        this.selected_end_month = this.week_days[0];
                        this.line_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
                        this.line_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
                        this.lineChart.parentCalled();
                    }
                }
            })
        }
    }

    changeMonts(selected_start_month, selected_end_month) {
        this.selected_start_month = selected_start_month;
        this.selected_end_month = selected_end_month;
        this.line_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
        this.line_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
        this.lineChart.parentCalled();
    }
}
