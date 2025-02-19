import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardsRoutingModule } from './dashboards.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [ DashboardComponent],
  imports: [
    SharedModule,
    LayoutContainersModule,
    DashboardsContainersModule,
    DashboardsRoutingModule,
    ComponentsChartModule,
    PipeModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    BsDropdownModule.forRoot(),
    TranslateModule,
    TooltipModule,
    NgSelectModule,
  ]
})
export class DashboardsModule { }
