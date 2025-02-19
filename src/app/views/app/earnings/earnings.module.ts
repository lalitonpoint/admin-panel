import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarningsRoutingModule } from './earnings.routing';
import { TripEarningComponent } from './trip-earning/trip-earning.component';
import { EarningStatementComponent } from './earning-statement/earning-statement.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { HttpClientModule} from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectivesModule} from 'src/app/directives/directives.module';
import { WalletHistoryComponent } from './wallet-history/wallet-history.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { DailyEarningComponent } from './daily-earning/daily-earning.component';
import { WeeklyEarningComponent } from './weekly-earning/weekly-earning.component';
import { PartnerWeeklyPaymentsComponent } from './partner-weekly-payments/partner-weekly-payments.component';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { RedeemHistoryComponent } from './redeem-history/redeem-history.component';
import { OpenRideTripEarningComponent } from './open-ride-trip-earning/open-ride-trip-earning.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RentalRequestEarningComponent } from './rental-request-earning/rental-request-earning.component';
@NgModule({
  declarations: [TripEarningComponent, EarningStatementComponent, WalletHistoryComponent, TransactionHistoryComponent, DailyEarningComponent, WeeklyEarningComponent, PartnerWeeklyPaymentsComponent, RedeemHistoryComponent, OpenRideTripEarningComponent, RentalRequestEarningComponent],
  imports: [
    PipeModule,
    CommonModule,
    EarningsRoutingModule,
    SharedModule,
    DashboardsContainersModule,
    LayoutContainersModule,
    PagesContainersModule,
    ComponentsChartModule,
    RatingModule.forRoot(),
    FormsModuleAngular,
    ReactiveFormsModule,
    DirectivesModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule,
    CollapseModule.forRoot(),
    ProgressbarModule,
    HttpClientModule,
    NgxPaginationModule,
    TooltipModule
  ]
})
export class EarningsModule { }
