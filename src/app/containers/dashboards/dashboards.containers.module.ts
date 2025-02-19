import { NgModule } from '@angular/core';
import { OrderStockRadarChartComponent } from './order-stock-radar-chart/order-stock-radar-chart.component';
import { ProductCategoriesDoughnutComponent } from './product-categories-doughnut/product-categories-doughnut.component';
import { ProductCategoriesPolarAreaComponent } from './product-categories-polar-area/product-categories-polar-area.component';
import { SalesChartCardComponent } from './sales-chart-card/sales-chart-card.component';
import { SmallLineChartsComponent } from './small-line-charts/small-line-charts.component';
import { WebsiteVisitsChartCardComponent } from './website-visits-chart-card/website-visits-chart-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { FormsModule  } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { OrdersBarChartComponent } from './orders-bar-chart/orders-bar-chart.component';
import { VersionBarChartComponent } from './version-bar-chart/version-bar-chart.component';
import { OrderBarChart1Component } from './order-bar-chart1/order-bar-chart1.component'; // a plugin
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
    declarations: [
        OrderStockRadarChartComponent,
        ProductCategoriesDoughnutComponent,
        ProductCategoriesPolarAreaComponent,
        SalesChartCardComponent,
        SmallLineChartsComponent,
        WebsiteVisitsChartCardComponent,
        OrdersBarChartComponent,
        VersionBarChartComponent,
        OrderBarChart1Component,

    ],
    imports: [
        SharedModule,
        ComponentsChartModule,
        RatingModule.forRoot(),
        FormsModule,
        NgSelectModule,
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule,
        TooltipModule
    ],
    providers: [ ],
    exports: [
        OrderStockRadarChartComponent,
        ProductCategoriesDoughnutComponent,
        ProductCategoriesPolarAreaComponent,
        SalesChartCardComponent,
        SmallLineChartsComponent,
        WebsiteVisitsChartCardComponent,
        OrdersBarChartComponent,
        VersionBarChartComponent,
        OrderBarChart1Component
    ]
})

export class DashboardsContainersModule { }
