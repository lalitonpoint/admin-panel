import { TypeRequestsComponent } from '../requests/type-requests/type-requests.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverComponent } from './driver/driver.component';
import { UserComponent } from './user/user.component';
import { SubAdminComponent } from './sub-admin/sub-admin.component';
import { UsersComponent} from './users.component';
import { HotelComponent } from '../services/hotel/hotel.component';
import { DispatcherComponent } from '../services/dispatcher/dispatcher.component';
import { CorporateComponent } from '../services/corporate/corporate.component';
import { PartnerComponent } from '../services/partner/partner.component';
import { HubComponent } from '../services/hub/hub.component';
import { RentCarOwnerComponent } from './rent-car-owner/rent-car-owner.component';

const routes: Routes = [
    {
        path: '', component: UsersComponent,
        children: [
            { path: '', redirectTo: 'user', pathMatch: 'full' },
            { path: 'user', component: UserComponent, data: {auth: 'user'} },
            { path: 'user/history', component: TypeRequestsComponent },
            { path: 'user/open_ride_history', component: TypeRequestsComponent },
            { path: 'driver-user', component: DriverComponent, data: {auth: 'driver-user'} },
            { path: 'driver-user/history', component: TypeRequestsComponent },
            { path: 'driver-user/open_ride_history', component: TypeRequestsComponent },
            { path: 'hotel', component: HotelComponent, data: {auth: 'hotel'} },
            { path: 'hotel/history', component: TypeRequestsComponent },
            { path: 'dispatcher', component: DispatcherComponent, data: {auth: 'dispatcher'} },
            { path: 'dispatcher/history', component: TypeRequestsComponent },
            { path: 'corporate', component: CorporateComponent, data: {auth: 'corporate'} },
            { path: 'corporate/history', component: TypeRequestsComponent },
            { path: 'partner', component: PartnerComponent, data: {auth: 'partner'} },
            { path: 'partner/history', component: TypeRequestsComponent },
            { path: 'sub-admin', component: SubAdminComponent, data: {auth: 'admin_list'} },
            { path: 'hub', component: HubComponent, data: {auth: 'hub'} },
            { path: 'hub/history', component: TypeRequestsComponent },
            { path: 'rent-car-owner', component: RentCarOwnerComponent, data: {auth: 'rent-car-owner'} },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
