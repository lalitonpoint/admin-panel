import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';

@NgModule({ 
  declarations: [
  LoaderComponent
],
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [
    LoaderComponent
  ]
})
export class LoaderModule { }
