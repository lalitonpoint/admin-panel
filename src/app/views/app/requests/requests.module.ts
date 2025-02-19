import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsComponent } from './requests.component';
import { RequestsRoutingModule } from './requests.routing';
import { LayoutContainersModule } from "../../../containers/layout/layout.containers.module";
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PagesContainersModule } from "../../../containers/pages/pages.containers.module";

@NgModule({
    declarations: [RequestsComponent],
    imports: [
        CommonModule,
        RequestsRoutingModule,
        LayoutContainersModule,
        TranslateModule,
        BsDatepickerModule,
        FormsModule,
        PaginationModule,
        BsDropdownModule.forRoot(),
        AccordionModule.forRoot(),
        NgxPaginationModule,
        PagesContainersModule
    ]
})
export class RequestsModule { }
