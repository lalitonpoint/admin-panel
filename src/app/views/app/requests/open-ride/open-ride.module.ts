import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenRideRoutingModule } from './open-ride-routing.module';
import { OpenRideComponent } from './open-ride.component';
import { OpenRideRunningComponent } from './open-ride-running/open-ride-running.component';
import { OpenRideCompletedComponent } from './open-ride-completed/open-ride-completed.component';
import { OpenRideScheduledComponent } from './open-ride-scheduled/open-ride-scheduled.component';
import { OpenRideCancelledComponent } from './open-ride-cancelled/open-ride-cancelled.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContainersModule } from "../../../../containers/layout/layout.containers.module";
import { PagesContainersModule } from "../../../../containers/pages/pages.containers.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { OpenRideReportComponent } from './open-ride-report/open-ride-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    OpenRideComponent,
    OpenRideRunningComponent,
    OpenRideCompletedComponent,
    OpenRideScheduledComponent,
    OpenRideCancelledComponent,
    OpenRideReportComponent
  ],
  imports: [
    CommonModule,
    OpenRideRoutingModule,
    PipeModule,
    TranslateModule,
    LayoutContainersModule,
    PagesContainersModule,
    BsDatepickerModule,
    FormsModule,
    PaginationModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    NgxPaginationModule,
    ReactiveFormsModule,
    NgSelectModule,
    PaginationModule,
    TooltipModule
  ]
})
export class OpenRideModule { }
