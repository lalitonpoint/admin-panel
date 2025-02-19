import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartService } from 'src/app/components/charts/chart.service';
import { CommonService } from 'src/app/services/common.service';
import { barChartData, polarAreaChartData, pieChartData } from '../../../../data/charts';
import * as moment from 'moment';
import { Helper } from 'src/app/shared/helper';
import { BarChartComponent } from 'src/app/components/charts/bar-chart/bar-chart.component';
import { SettingsService } from 'src/app/services/settings.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  barChartData = barChartData;
  polarAreaChartData = polarAreaChartData;
  pieChartData = pieChartData
  last_six_month_earning: any;
  list: any = {};
  order_detail1 = {
    cancelled_order: 0,
    total_deliveries: 0,
    total_orders: 0
  }
  order_detail = {
    admin_earn_per: 0,
    admin_earning: 0,
    cash_payment: 0,
    completed_order: 0,
    delivery_payment: 0,
    order_payment: 0,
    other_payment: 0,
    promo_payment: 0,
    provider_earn_per: 0,
    provider_earning: 0,
    provider_payment_pre_earning: 0,
    store_earn_per: 0,
    store_earning: 0,
    store_payment_pre_earning: 0,
    total_item_sold: 0,
    total_payments: 0,
    wallet_payment: 0,
  }
  itemOptions = [
    { label: 'label-title.all', value: '0' },
    { label: 'label-title.today', value: '1' },
    { label: 'label-title.yesterday', value: '2' },
    { label: 'label-title.this_week', value: '3' },
    { label: 'label-title.this_month', value: '4' },
    { label: 'label-title.this_year', value: '5' },
    { label: 'label-title.custom', value: '6' },
  ];
  itemSelected = { label: 'label-title.all', value: '0' };
  chartDataConfig: any;
  todayDate: Date = new Date();
  item_bsRangeValue: any;
  start_date: any = '';
  end_date: any = '';
  week_days = [];
  selected_end_month: any;
  selected_start_month: any;
  bar_chart_item_bsRangeValue = [];
  direction = localStorage.getItem('direction');
  country_list: any[] = [];
  country_id:string = 'all';
  country:string = 'all';
  created_at: Date = null;
  created_date: Date;

  @ViewChild('barChartComponent', { static: true }) barChartComponent: BarChartComponent;

  constructor(private _chartService: ChartService, private _commonService: CommonService, public _helper: Helper, private _settingService: SettingsService,private _notifiyService:NotifiyService,private _authService:AuthService, private _changeDetectorRef:ChangeDetectorRef,private _countryService:CountryService) {
    this.chartDataConfig = this._chartService;
  }

  ngOnInit() {
    this._countryService.fetchCountry().then(res => {
      this.country_list = res.country_list;
      this._helper.created_date.subscribe(data => {
        let date = new Date(data)
        this.created_date = date;
      })
      this.configMonthList();
      this.getList();
      this.checkPermissions();
    })
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
            this.bar_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
            this.bar_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
            this.barChartComponent.parentCalled();
          } else{
            let months;
            let d2 = new Date();
            let d1 = new Date(this.created_at);
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth();
            months += d2.getMonth();
            let bet_months = months <= 0 ? 0 : months;
            let months_between = Math.ceil(bet_months/6) + 1;

            for (let index = 0; index < months_between; index++) {
              let date = this.week_days[index - 1] ? this.week_days[index - 1] : new Date();
              this.week_days.push(this._helper.getMonthDay(date, index).toString());
            }
            if (this.week_days.length == 8) {
              this.week_days = [...new Set(this.week_days)];
              this.selected_start_month = this.week_days[0];
              this.selected_end_month = this.week_days[1];
              this.bar_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
              this.bar_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
              this.barChartComponent.parentCalled();
            }
            this.selected_start_month = this.week_days[1];
            this.selected_end_month = this.week_days[0];
            this.bar_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
            this.bar_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
            this.barChartComponent.parentCalled();
          }
        }
      })
    }
  }

  changeMonts(selected_start_month, selected_end_month) {
    this.selected_start_month = selected_start_month;
    this.selected_end_month = selected_end_month;
    this.bar_chart_item_bsRangeValue[0] = new Date(this.selected_start_month);
    this.bar_chart_item_bsRangeValue[1] = new Date(this.selected_end_month);
    this.barChartComponent.parentCalled();
  }

  getList() {
    let json = {
      country_id: this.country_id,
      start_date: this.start_date,
      end_date: this.end_date,
    }
    this._commonService.dashboard_detail(json).then((res_data: any) => {
      if (res_data.success) {
        this.list = res_data.detail
      }
    })
  }

  //when change value in serch by dropdown
  onChangeSearchBy(item): void {
    this.itemSelected = item;
    let data = Number(item.value)
    let start_date = "";
    let end_date = moment().format('YYYY-MM-DD');
    if (data == 1) {
      start_date = moment().format('YYYY-MM-DD');
      end_date = moment().format('YYYY-MM-DD').toString()
    } else if (data == 2) {
      start_date = moment().subtract(1, 'days').format('YYYY-MM-DD').toString();
      end_date = moment().subtract(1, 'days').format('YYYY-MM-DD').toString();
    }
    else if (data == 3) {
      start_date = moment().startOf('isoWeek').format('YYYY-MM-DD').toString();
    }
    else if (data == 4) {
      start_date = moment().startOf('month').format('YYYY-MM-DD').toString();
    }
    else if (data == 5) {
      start_date = moment().startOf('year').format('YYYY-MM-DD').toString();
    } else {
      start_date = '';
      end_date = '';
    }
    if (data !== 6) {
      this.start_date = new Date(start_date)
      this.end_date = new Date(end_date)
      this.getList();
    }
  }

  apply() {
    if (this.item_bsRangeValue?.length) {
      this.start_date = this.item_bsRangeValue[0];
      this.end_date = this.item_bsRangeValue[1];
    }
    if (this.start_date) {
      this.start_date = new Date(this.start_date);
      this.start_date.setHours(0,0,0,0);
      const diff = new Date(this.start_date).getTimezoneOffset() * 60000
      const secs = new Date(this.start_date).getTime()
      this.start_date = new Date(secs - diff).toUTCString()
    }
    if (this.end_date) {
      this.end_date = new Date(this.end_date)
      const diff = new Date(this.end_date).getTimezoneOffset() * 60000
      const secs = new Date(this.end_date).getTime()
      this.end_date = new Date(secs - diff).toUTCString()
    }

    this.getList();
  }

  checkPermissions(){
    this._authService.authPermission.subscribe((permissions) => {
      this._helper.REDIRECT_PERMISSION.forEach(permission => {
        if(this._helper.has_permission(this._helper.PERMISSION.VIEW, permission.permission_name)){
          permission.is_permission = true;
        }
      })
      this._changeDetectorRef.detectChanges();
    })
  }

  onChangeCountry(country){
    if(country !== 'all'){
      this.country = country?.countryname;
      this.country_id = country?._id;
    }else{
      this.country = 'all';
      this.country_id = 'all';
    }
    this._helper.country.next(this.country_id);
    this.getList();
  }

}

