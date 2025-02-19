import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule), },
            { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
            { path: 'requests', loadChildren: () => import('./requests/requests.module').then(m => m.RequestsModule) },
            { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
            { path: 'earnings', loadChildren: () => import('./earnings/earnings.module').then(m => m.EarningsModule) },
            { path: 'services', loadChildren: () => import('./services/services.module').then(m => m.ServicesModule) },
            { path: 'map-views', loadChildren: () => import('./map-views/map-views.module').then(m => m.MapViewsModule) },
            { path: 'service-types', loadChildren: () => import('./service-types/service-types.module').then(m => m.ServiceTypesModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
