import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewsComponent } from './reviews.component';
import { ReviewComponent } from './review/review.component';


const routes: Routes = [
    {
      path: '', component: ReviewsComponent,
      children: [
        { path: '', redirectTo: 'review', pathMatch: 'full' },
        { path:'review' , component : ReviewComponent, data: {auth: 'reviews'}},
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReviewsRoutingModule { }