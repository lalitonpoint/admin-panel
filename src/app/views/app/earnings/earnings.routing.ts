import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyEarningComponent } from './daily-earning/daily-earning.component';
import { TripEarningComponent } from './trip-earning/trip-earning.component';
import { WeeklyEarningComponent } from './weekly-earning/weekly-earning.component';
import { PartnerWeeklyPaymentsComponent } from './partner-weekly-payments/partner-weekly-payments.component';
import { EarningsComponent} from './earnings.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { WalletHistoryComponent } from './wallet-history/wallet-history.component';
import { RedeemHistoryComponent } from './redeem-history/redeem-history.component';
import { OpenRideTripEarningComponent } from './open-ride-trip-earning/open-ride-trip-earning.component';
import { RentalRequestEarningComponent } from './rental-request-earning/rental-request-earning.component';

const routes: Routes =  [
  {
    path: '', component: EarningsComponent,
    children: [
      { path: '', redirectTo: 'order', pathMatch: 'full' },
      {
        path: 'order', children: [
          { path: '', redirectTo: 'trip-earning', pathMatch: 'full' },
          { path: 'trip-earning', component: TripEarningComponent, data: {auth: 'trip-earning'} },
          { path: 'open-ride-trip-earning', component: OpenRideTripEarningComponent, data: {auth: 'open-ride-trip-earning'} },
          { path: 'rental-request-earning', component: RentalRequestEarningComponent, data: {auth: 'rental-request-earning'} },
          { path: 'daily-earning', component: DailyEarningComponent, data: {auth: 'daily-earning'} },
          { path: 'weekly-earning', component: WeeklyEarningComponent, data: {auth: 'weekly-earning'} },
          { path: 'partner-weekly-payments', component: PartnerWeeklyPaymentsComponent, data: {auth: 'partner-weekly-payments'} },
        ]
      },
      {
        path: 'wallet', children: [
          { path: '', redirectTo: 'wallet-history', pathMatch: 'full' },
          { path: 'wallet-history', component: WalletHistoryComponent, data: {auth: 'wallet-history'} },
          { path: 'transaction-history', component: TransactionHistoryComponent, data: {auth: 'transaction_history'}},
          { path: 'redeem-history', component: RedeemHistoryComponent, data: {auth: 'redeem_history'}},
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarningsRoutingModule { }
