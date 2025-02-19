import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestsComponent } from './requests.component';

const routes: Routes = [
    {
        path: '', component: RequestsComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'history' },
            { path: 'request-type', loadChildren: () => import('../requests/request/request.module').then(m => m.RequestModule) },
            { path: 'open-ride', loadChildren: () => import('../requests/open-ride/open-ride.module').then(m => m.OpenRideModule) },
            { path: 'rental-request', loadChildren: () => import('../requests/rental-request/rental-request.module').then(m => m.RentalRequestModule) },
            { path: 'reviews', loadChildren: () => import('../requests/reviews/reviews.module').then(m => m.ReviewsModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RequestsRoutingModule { }