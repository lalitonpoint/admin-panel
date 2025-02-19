import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalRequestComponent } from './rental-request.component';
import { RentalRequestRunningComponent } from './rental-request-running/rental-request-running.component';
import { RentalRequestCompletedComponent } from './rental-request-completed/rental-request-completed.component';
import { RentalRequestCancelledComponent } from './rental-request-cancelled/rental-request-cancelled.component';
import { RentalRequestReportComponent } from './rental-request-report/rental-request-report.component';


const routes: Routes = [
  {
    path : '', component : RentalRequestComponent,
    children : [
      { path: '', redirectTo: 'rental_request_running_requests', pathMatch: 'full' },
      { path: 'rental_request_running_requests', component: RentalRequestRunningComponent, data: {auth: 'rental_request_running_requests'} },
      { path: 'rental_request_completed_requests', component: RentalRequestCompletedComponent, data: {auth: 'rental_request_completed_requests'}},
      { path: 'rental_request_cancelled_requests', component: RentalRequestCancelledComponent, data: {auth: 'rental_request_cancelled_requests'}},
      { path: 'rental_request_report' , component : RentalRequestReportComponent, data: {auth: 'rental_request_report'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentalRequestRoutingModule { }
