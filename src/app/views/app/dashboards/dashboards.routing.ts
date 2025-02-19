import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',  component: DashboardsComponent,
    children: [
      // { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: '', component: DashboardComponent , data: {auth: 'dashboard'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
