import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewsComponent } from './reviews.component';
import { ReviewsRoutingModule } from './reviews.routing';
import { EberReviewComponent } from './eber-review/eber-review.component';
import { CancellationComponent } from './cancellation/cancellation.component';
import { ReviewComponent } from './review/review.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { LayoutContainersModule } from "../../../../containers/layout/layout.containers.module";
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [ReviewsComponent, EberReviewComponent, CancellationComponent, ReviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReviewsRoutingModule,
    PagesContainersModule,
    LayoutContainersModule,
    RatingModule.forRoot(),
    ProgressbarModule,
    PaginationModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [
    
  ]
})
export class ReviewsModule { }
