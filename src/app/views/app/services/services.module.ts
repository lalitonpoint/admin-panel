import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersRoutingModule} from '../users/users.routing';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';
import { LayoutContainersModule } from '../../../containers/layout/layout.containers.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DashboardsContainersModule } from '../../../containers/dashboards/dashboards.containers.module';
import { HttpClientModule} from '@angular/common/http';
import { SharedModule } from '../../../shared/shared.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { ServicesRoutingModule } from 'src/app/views/app/services/services.routing';
import { CorporateComponent } from './corporate/corporate.component';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { HotelComponent } from './hotel/hotel.component';
import { PartnerComponent } from './partner/partner.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HubComponent } from './hub/hub.component';


@NgModule({
  declarations: [  CorporateComponent, DispatcherComponent, HotelComponent, HubComponent, PartnerComponent],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    LayoutContainersModule,
    DirectivesModule,
    PagesContainersModule,
    RatingModule.forRoot(),
    FormsModuleAngular,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule,
    DashboardsContainersModule,
    HttpClientModule,
    ServicesRoutingModule,
    NgxPaginationModule
  ]
})
export class ServicesModule { }
