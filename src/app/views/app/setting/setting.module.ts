import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingRoutingModule} from './setting.routing';
import { LanguagesComponent } from './languages/languages.component';
import { PromoCodeComponent } from './promo-code/promo-code.component';
import { DocumentsComponent } from './documents/documents.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule , FormsModule } from '@angular/forms';
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
import { QuillModule } from 'ngx-quill';
import { DirectivesModule} from 'src/app/directives/directives.module';
import { SmsSettingComponent} from './sms-setting/sms-setting.component';
import { MailSettingComponent} from './mail-setting/mail-setting.component';
import { ReferralCodeComponent } from './referral-code/referral-code.component';
import { MassNotificationComponent } from './mass-notification/mass-notification.component';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { TermsPrivacySettingComponent } from './terms-privacy-setting/terms-privacy-setting.component';
import { GuestTokenComponent } from './guest-token/guest-token.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CancellationReasonComponent } from './cancellation-reason/cancellation-reason.component';
import { LogsComponent } from './logs/logs.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BannerComponent } from './banner/banner.component';
import { WsalConfigurationsComponent } from 'src/app/containers/pages/wsal-configurations/wsal-configurations.component';
import { RentalPaymentConfigurationComponent } from 'src/app/containers/pages/rental-payment-configuration/rental-payment-configuration.component';
@NgModule({
  declarations: [ BannerComponent, LanguagesComponent, PromoCodeComponent, DocumentsComponent, AdminSettingComponent, SmsSettingComponent, MailSettingComponent, ReferralCodeComponent, MassNotificationComponent, TermsPrivacySettingComponent, GuestTokenComponent, CancellationReasonComponent, LogsComponent, BannerComponent, WsalConfigurationsComponent, RentalPaymentConfigurationComponent],
  imports: [
    FormsModule,
    QuillModule.forRoot(),
    SharedModule,
    CommonModule,
    SettingRoutingModule,
    LayoutContainersModule,
    PagesContainersModule,
    DirectivesModule,
    ComponentsChartModule,
    PipeModule,
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
    NgxPaginationModule,
    DirectivesModule,
    TooltipModule
  ]
})
export class SettingModule { }
