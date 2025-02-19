import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenRideComponent } from './open-ride.component';
import { OpenRideScheduledComponent } from './open-ride-scheduled/open-ride-scheduled.component';
import { OpenRideCompletedComponent } from './open-ride-completed/open-ride-completed.component';
import { OpenRideRunningComponent } from './open-ride-running/open-ride-running.component';
import { OpenRideCancelledComponent } from './open-ride-cancelled/open-ride-cancelled.component';
import { OpenRideReportComponent } from './open-ride-report/open-ride-report.component';

const routes: Routes = [
  {
    path : '', component : OpenRideComponent,
    children : [
      { path: '', redirectTo: 'open_ride_running_requests', pathMatch: 'full' },
      { path: 'open_ride_running_requests', component: OpenRideRunningComponent, data: {auth: 'open_ride_running_requests'} },
      { path: 'open_ride_completed_requests', component: OpenRideCompletedComponent, data: {auth: 'open_ride_completed_requests'}},
      { path: 'open_ride_scheduled_requests', component: OpenRideScheduledComponent, data: {auth: 'open_ride_scheduled_requests'}},
      { path: 'open_ride_cancelled_requests', component: OpenRideCancelledComponent, data: {auth: 'open_ride_cancelled_requests'}},
      { path:'open_ride_report' , component : OpenRideReportComponent, data: {auth: 'open_ride_report'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenRideRoutingModule { }
