import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesComponent} from './services.component';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { CorporateComponent } from './corporate/corporate.component';
import { PartnerComponent } from './partner/partner.component';

const routes: Routes = [
  {
    path: '', component: ServicesComponent,
    children: [
      { path: '', redirectTo: 'dispatcher', pathMatch: 'full' },
      { path: 'dispatcher', component: DispatcherComponent, data: {auth: 'dispatcher'} },
      { path: 'corporate', component: CorporateComponent, data: {auth: 'corporate'} },
      { path: 'partner', component: PartnerComponent, data: {auth: 'partner'} }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
