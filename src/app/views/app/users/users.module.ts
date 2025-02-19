import { TypeRequestsComponent } from '../requests/type-requests/type-requests.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from '../users/users.routing';
import { DriverComponent } from './driver/driver.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { HttpClientModule} from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserComponent } from './user/user.component';
import { DirectivesModule} from 'src/app/directives/directives.module';
import { SubAdminComponent } from './sub-admin/sub-admin.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CarouselModule as OwlCarouselModule } from 'ngx-owl-carousel-o';
import { CarouselModule as BootstrapCarouselModule } from 'ngx-bootstrap/carousel';
import { RentCarOwnerComponent } from './rent-car-owner/rent-car-owner.component';
@NgModule({
  declarations: [ DriverComponent, UserComponent, SubAdminComponent , TypeRequestsComponent, RentCarOwnerComponent ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    LayoutContainersModule,
    DirectivesModule,
    PagesContainersModule,
    ComponentsChartModule,
    RatingModule.forRoot(),
    FormsModuleAngular,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule,
    CollapseModule.forRoot(),
    DashboardsContainersModule,
    ProgressbarModule,
    HttpClientModule,
    NgxPaginationModule,
    OwlCarouselModule,
    BootstrapCarouselModule.forRoot(),
  ]
})
export class UsersModule { }
