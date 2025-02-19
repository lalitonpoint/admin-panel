import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { UsersComponent } from './users/users.component';
import { ServicesComponent } from './services/services.component';
import { SettingComponent} from './setting/setting.component';
import { EarningsComponent} from './earnings/earnings.component';
import { MapViewsComponent } from './map-views/map-views.component';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { ServiceTypesComponent } from './service-types/service-types.component';
@NgModule({
  declarations: [AppComponent, UsersComponent, SettingComponent, EarningsComponent, ServicesComponent,MapViewsComponent,DashboardsComponent,ServiceTypesComponent],
  imports: [
    TranslateModule,
    CommonModule,
    AppRoutingModule,
    SharedModule,
    LayoutContainersModule,
  ]
})
export class AppModule { }

