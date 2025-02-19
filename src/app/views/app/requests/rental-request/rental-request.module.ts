import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RentalRequestComponent } from './rental-request.component';
import { RentalRequestRoutingModule } from './rental-request-routing.module';
import { RentalRequestRunningComponent } from './rental-request-running/rental-request-running.component';
import { RentalRequestCancelledComponent } from './rental-request-cancelled/rental-request-cancelled.component';
import { RentalRequestCompletedComponent } from './rental-request-completed/rental-request-completed.component';
import { RentalRequestReportComponent } from './rental-request-report/rental-request-report.component';


@NgModule({
  declarations: [
    RentalRequestComponent,
    RentalRequestRunningComponent,
    RentalRequestCancelledComponent,
    RentalRequestCompletedComponent,
    RentalRequestReportComponent
  ],
  imports: [
    RentalRequestRoutingModule,
    CommonModule,
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
export class RentalRequestModule { }
