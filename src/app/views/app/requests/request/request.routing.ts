import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompletedComponent } from './completed/completed.component';
import { RequestComponent } from './request.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { RunningComponent } from './running/running.component';
import { CancelledComponent } from './cancelled/cancelled.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
    {
        path: '', component: RequestComponent,
        children: [
            { path: '', redirectTo: 'running_requests', pathMatch: 'full' },
            { path: 'running_requests', component: RunningComponent, data: {auth: 'running_requests'} },
            { path: 'completed_requests', component: CompletedComponent, data: {auth: 'completed_requests'}},
            { path: 'scheduled_requests', component: ScheduledComponent, data: {auth: 'scheduled_requests'}},
            { path: 'cancelled_requests', component: CancelledComponent, data: {auth: 'cancelled_requests'}},
            { path:'report' , component : ReportComponent, data: {auth: 'report'}},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RequestRoutingModule { }
  