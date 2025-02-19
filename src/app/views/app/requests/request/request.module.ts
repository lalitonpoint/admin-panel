import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './request.component';
import { RequestRoutingModule } from './request.routing';
import { RunningComponent } from './running/running.component';
import { CompletedComponent } from './completed/completed.component';
import { ScheduledComponent } from './scheduled/scheduled.component';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContainersModule } from "../../../../containers/layout/layout.containers.module";
import { PagesContainersModule } from "../../../../containers/pages/pages.containers.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CancelledComponent } from './cancelled/cancelled.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { ReportComponent } from './report/report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
    declarations: [RequestComponent, RunningComponent, CompletedComponent, ScheduledComponent, CancelledComponent,ReportComponent],
    imports: [
        PipeModule,
        CommonModule,
        RequestRoutingModule,
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
        TooltipModule
    ]
})
export class RequestModule { }
