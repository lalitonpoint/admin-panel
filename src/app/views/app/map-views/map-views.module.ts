import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapViewsRoutingModule } from './map-views-routing.module';
import { DriversMapViewComponent } from './drivers-map-view/drivers-map-view.component';
import { DriverTrackingComponent } from './driver-tracking/driver-tracking.component';
import { AllCitiesComponent } from './all-cities/all-cities.component';
import { LayoutContainersModule } from "../../../containers/layout/layout.containers.module";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HubMapComponent } from './hub-map/hub-map.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
    declarations: [DriversMapViewComponent, DriverTrackingComponent, AllCitiesComponent,HeatMapComponent, HubMapComponent],
    imports: [
        CommonModule,
        MapViewsRoutingModule,
        LayoutContainersModule,
        PerfectScrollbarModule,
        TranslateModule,
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        DirectivesModule,
        TabsModule.forRoot(),
        PipeModule,
        BsDatepickerModule.forRoot(),
        TooltipModule
    ],
    providers: [ BsDatepickerConfig],
})
export class MapViewsModule { }
