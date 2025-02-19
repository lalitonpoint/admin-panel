import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewRoutingModule } from './views.routing';
import { SharedModule } from '../shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeadroomModule } from '@ctrl/ngx-headroom';
import { AuthGuard } from '../shared/auth.guard';
import { CarouselModule as OwlCarouselModule } from 'ngx-owl-carousel-o';
import { CarouselModule as BootstrapCarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ViewRoutingModule,
    SharedModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    TabsModule.forRoot(),
    BrowserAnimationsModule,
    HeadroomModule,
    OwlCarouselModule,
    BootstrapCarouselModule.forRoot()
  ],
  providers: [AuthGuard],
})
export class ViewsModule {}
