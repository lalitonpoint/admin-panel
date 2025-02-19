import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewsComponent } from './map-views.component';
import { DriversMapViewComponent } from './drivers-map-view/drivers-map-view.component';
import { DriverTrackingComponent } from './driver-tracking/driver-tracking.component';
import { AllCitiesComponent } from './all-cities/all-cities.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { HubMapComponent } from './hub-map/hub-map.component';

const routes: Routes = [
  {
    path: '', component: MapViewsComponent,
    children: [
      { path: '', redirectTo: 'drivers-map-view', pathMatch: 'full' },
      { path: 'drivers-map-view', component: DriversMapViewComponent, data: {auth: 'mapview'}},
      { path: 'driver-tracking', component: DriverTrackingComponent, data: {auth: 'provider_track'} },
      { path: 'all-cities', component: AllCitiesComponent, data: {auth: 'all_city'} },
      { path: 'heat-map', component: HeatMapComponent, data: {auth: 'heat_map'} },
      { path: 'hub-map', component: HubMapComponent, data: {auth: 'hub_map'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapViewsRoutingModule { }
