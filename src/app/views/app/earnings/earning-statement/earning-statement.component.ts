import { Component, Input, SimpleChanges } from '@angular/core';
import { EarningService } from 'src/app/services/earning.service';
import { Helper } from 'src/app/shared/helper';
import { StatementDetails } from '../../../../models/statement_detail.model';

@Component({
  selector: 'app-earning-statement',
  templateUrl: './earning-statement.component.html',
  styleUrls: ['./earning-statement.component.scss']
})
export class EarningStatementComponent {
  date_string: string;
  analyticDeatil: any;
  tripsList: any = [];

  @Input() tripId: any;
  @Input() start_date: any;
  @Input() end_date: any;
  @Input() typestatement: any;
  statementDetail: StatementDetails = new StatementDetails();

  constructor(public _helper: Helper, private earningService: EarningService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.statementData(this.tripId, this.start_date, this.end_date, this.typestatement)
  }

  statementData(tripId, start_date, end_date, typestatement): void {
    if (tripId) {
      this.start_date=start_date;
      this.end_date=end_date;
      this.tripId = tripId;
      this.typestatement = typestatement;
      if ((typestatement == 1) || (typestatement == 2)) {
        let json: any = { provider_id: tripId, start_date: start_date, end_date: end_date }
        this.earningService.dailyWeeklyStatementTripEarning(json).then(res => {
          if (res) {
            this.statementDetail = res.detail;
            this.analyticDeatil = res.provider_daily_analytic_data;
            this.date_string = res.date_string;
            if (res.trips) {
              this.tripsList = res.trips;
            }
          }
        });
      }else{
        let json: any = { partner_id: tripId, week_start_date: start_date, week_end_date: end_date }
        this.earningService.partnerWeeklyStatementTripEarning(json).then(res => {
          if (res) {
            this.statementDetail = res.detail;
            this.analyticDeatil = res.provider_daily_analytic_data;
          }
        });
        
      }
    }
  }
}
