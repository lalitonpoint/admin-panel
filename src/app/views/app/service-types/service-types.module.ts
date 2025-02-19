import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceTypesRoutingModule } from './service-types-routing.module';
import { TypeComponent } from './type/type.component';
import { CityComponent } from './city/city.component';
import { CountryComponent } from './country/country.component';
import { TypeCityAssociationComponent } from './type-city-association/type-city-association.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContainersModule } from "../../../containers/layout/layout.containers.module";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ManageVehicleComponent } from './manage-vehicle/manage-vehicle.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RentCarServiceComponent } from './rent-car-service/rent-car-service.component';
import { RentCarSpecificationComponent } from './rent-car-specification/rent-car-specification.component';

@NgModule({
  declarations: [TypeComponent, CityComponent, CountryComponent, TypeCityAssociationComponent , ManageVehicleComponent, RentCarServiceComponent, RentCarSpecificationComponent],
  imports: [
    CommonModule,
    ServiceTypesRoutingModule,
    PagesContainersModule,
    PerfectScrollbarModule,
    NgSelectModule,
    RatingModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    PipeModule,
    CollapseModule,
    FormsModuleAngular,
    ReactiveFormsModule,
    TranslateModule,
    LayoutContainersModule,
    BsDropdownModule.forRoot(),
    DirectivesModule,
    NgxPaginationModule,
    TooltipModule
  ]
})
export class ServiceTypesModule { }
