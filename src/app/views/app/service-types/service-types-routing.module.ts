import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceTypesComponent } from './service-types.component'
import { TypeComponent } from './type/type.component';
import { CountryComponent } from './country/country.component';
import { TypeCityAssociationComponent } from './type-city-association/type-city-association.component';
import { ManageVehicleComponent } from './manage-vehicle/manage-vehicle.component';
import { RentCarServiceComponent } from './rent-car-service/rent-car-service.component';
import { RentCarSpecificationComponent } from './rent-car-specification/rent-car-specification.component';

const routes: Routes = [
  {
    path: '', component: ServiceTypesComponent,
    children: [
      { path: '', redirectTo: 'type', pathMatch: 'full' },
      { path: 'type', component: TypeComponent, data: {auth: 'type'} },
      { path: 'country-city-info', component: CountryComponent , data: {auth: 'country-city-info'} },
      { path: 'city-type', component: TypeCityAssociationComponent , data: {auth: 'city-type'} },
      { path: 'manage-vehicle', component: ManageVehicleComponent , data: {auth: 'manage-vehicle'} },
      { path: 'rent-car-service', children: [
        { path: '', redirectTo: 'rent-car-price', pathMatch: 'full' },
        { path: 'rent-car-price', component: RentCarServiceComponent, data: {auth: 'rent-car-price'} },
        { path: 'rent-car-specification', component: RentCarSpecificationComponent, data: {auth: 'rent-car-specification'}},
      ]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceTypesRoutingModule { }
