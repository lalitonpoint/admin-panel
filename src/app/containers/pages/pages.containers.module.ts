import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LightboxModule } from 'ngx-lightbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListPageHeaderComponent } from './list-page-header/list-page-header.component';
import { LayoutContainersModule } from '../layout/layout.containers.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AddNewSurgeTimeModalComponent } from './add-new-surge-time-modal/add-new-surge-time-modal.component';
import { AddNewPlaceModalComponent } from './add-new-place-modal/add-new-place-modal.component';
import { AddNewZoneModalComponent } from './add-new-zone-modal/add-new-zone-modal.component';
import { ServiceTypeModalComponent } from './service-type-modal/service-type-modal.component';
import { TripEarningDetailsModalComponent } from './trip-earning-details-modal/trip-earning-details-modal.component';
import { AddNewPromoModalComponent } from './add-new-promo-modal/add-new-promo-modal.component';
import { AddNewLanguageModalComponent } from './add-new-language-modal/add-new-language-modal.component';
import { RentalPackageSettingModalComponent } from './rental-package-setting-modal/rental-package-setting-modal.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { EditDriverModalComponent } from './edit-driver-modal/edit-driver-modal.component';
import { TripDetailsModalComponent } from './trip-details-modal/trip-details-modal.component';
import { UserModelComponent } from './user-model/user-model.component';
import { ExportHistoryModelComponent } from './export-history-model/export-history-model.component';
import { AddHotelModelComponent } from './add-hotel-model/add-hotel-model.component';
import { AddDispatcherModelComponent } from './add-dispatcher-model/add-dispatcher-model.component';
import { EditDispatcherModalComponent } from './edit-dispatcher-modal/edit-dispatcher-modal.component';
import { CorporateModalComponent } from './corporate-modal/corporate-modal.component';
import { EditHotelModelComponent } from './edit-hotel-model/edit-hotel-model.component';
import { PartnerModalComponent } from './partner-modal/partner-modal.component';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { HttpClientModule } from '@angular/common/http';
import { BasicAndTripSettingsModalComponent } from './basic-and-trip-setting-modal/basic-and-trip-setting-modal.component';
import { AppUrlSettingModalComponent } from './app-url-setting-modal/app-url-setting-modal.component';
import { GoogleKeySettingModalComponent } from './google-key-setting-modal/google-key-setting-modal.component';
import { FirebaseKeyModalComponent } from './firebase-key-modal/firebase-key-modal.component';
import { PromoCodeModalComponent } from './promo-code-modal/promo-code-modal.component';
import { SmsConnectModalComponent } from './sms-connect-modal/sms-connect-modal.component';
import { TripPriceComponent } from './trip-price/trip-price.component';
import { TripSurgePriceComponent } from './trip-surge-price/trip-surge-price.component';
import { TripZonePriceComponent } from './trip-zone-price/trip-zone-price.component';
import { TripRentalComponent } from './trip-rental/trip-rental.component';
import { MassNotificationModalComponent } from './mass-notification-modal/mass-notification-modal.component';
import { AdminBasicSettingsComponent } from './admin-basic-settings/admin-basic-settings.component';
import { AdminLogoSettingsComponent } from './admin-logo-settings/admin-logo-settings.component';
import { AdminNotificationTripSettingsComponent } from './admin-notification-trip-settings/admin-notification-trip-settings.component';
import { AdminAppUrlComponent } from './admin-app-url/admin-app-url.component';
import { AdminAppVersionSettingComponent } from './admin-app-version-setting/admin-app-version-setting.component';
import { AdminGoogleKeySettingsComponent } from './admin-google-key-settings/admin-google-key-settings.component';
import { AdminFirebaseGCMKeySettingsComponent } from './admin-firebase-gcm-key-settings/admin-firebase-gcm-key-settings.component';
import { AdminNotificationIosCertificatesComponent } from './admin-notification-ios-certificates/admin-notification-ios-certificates.component';
import { SubAdminModalComponent } from './sub-admin-modal/sub-admin-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropModelComponent } from './image-crop-model/image-crop-model.component'
import { TripFeatureComponent } from './trip-feature/trip-feature.component';
import { PanelNameComponent } from './panel-name/panel-name.component';
import { PanelNameModalComponent } from './panel-name-modal/panel-name-modal.component';
import { SmsConfigurationComponent } from './sms-configuration/sms-configuration.component';
import { SmsConfigurationModalComponent } from './sms-configuration-modal/sms-configuration-modal.component';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { EmailConfigurationModalComponent } from './email-configuration-modal/email-configuration-modal.component';
import { PaymentConfigurationModalComponent } from './payment-configuration-modal/payment-configuration-modal.component';
import { PaymentConfigurationsComponent } from './payment-configurations/payment-configurations.component';
import { TripChargeSettingmodalComponent } from './trip-charge-settingmodal/trip-charge-settingmodal.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GuestTokenModalComponent } from './guest-token-modal/guest-token-modal.component';
import { ReviewDetailsModalComponent } from './review-details-modal/review-details-modal.component';
import { ReferralDetailsComponent } from './referral-details/referral-details.component';
import { TimeconvertPipe } from './timeconvert.pipe';
import { UserPanelImagesComponent } from './user-panel-images/user-panel-images.component';
import { BaseUrlComponent } from './base-url/base-url.component';
import { BaseUrlModalComponent } from './base-url-modal/base-url-modal.component'
import { FilterPipe } from './urlfilter.pipe';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { AddNewCancellationReasonComponent } from './add-new-cancellation-reason/add-new-cancellation-reason.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AddHubModelComponent } from './add-hub-model/add-hub-model.component';
import { EditHubModelComponent } from './edit-hub-model/edit-hub-model.component';
import { VehicleModalComponent } from './vehicle-modal/vehicle-modal.component';
import { AddDriverModalComponent } from './add-driver-modal/add-driver-modal.component';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { BrandModalComponent } from './brand-modal/brand-modal.component';
import { TripSettingsComponent } from './trip-settings/trip-settings.component';
import { WhatsappConfigurationComponent } from './whatsapp-configuration/whatsapp-configuration.component';
import { GoogleCaptchaConfigurationComponent } from './google-captcha-configuration/google-captcha-configuration.component';
import { GoogleCaptchaConfigurationModalComponent } from './google-captcha-configuration-modal/google-captcha-configuration-modal.component';
import { OpenRideTripDetailsModalComponent } from './open-ride-trip-details-modal/open-ride-trip-details-modal.component';
import { OpenRideEarningDetailsModalComponent } from './open-ride-earning-details-modal/open-ride-earning-details-modal.component';
import { AppForceUpdateSettingsComponent } from './app-force-update-settings/app-force-update-settings.component';
import { AddBannerModalComponent } from './add-banner-modal/add-banner-modal.component';
import { WsalResponseModalComponent } from './wsal-response-modal/wsal-response-modal.component';
import { RentCarTypeModelComponent } from './rent-car-type-model/rent-car-type-model.component';
import { RentCarBrandModelComponent } from './rent-car-brand-model/rent-car-brand-model.component';
import { RentCarSpecificationModelComponent } from './rent-car-specification-model/rent-car-specification-model.component';
import { RentCarFeatureModelComponent } from './rent-car-feature-model/rent-car-feature-model.component';
import { CarouselModule as OwlCarouselModule } from 'ngx-owl-carousel-o';
import { CarouselModule as BootstrapCarouselModule } from 'ngx-bootstrap/carousel';
import { TripRequestComponent } from './trip-request/trip-request.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TripReportComponent } from './trip-report/trip-report.component';
import { RentalTripDetailModelComponent } from './rental-trip-detail-model/rental-trip-detail-model.component';

@NgModule({
  declarations: [
    FilterPipe,
    ImageCropModelComponent,
    ListPageHeaderComponent,
    AddNewSurgeTimeModalComponent,
    AddNewPlaceModalComponent,
    AddNewZoneModalComponent,
    ServiceTypeModalComponent,
    TripEarningDetailsModalComponent,
    AddNewPromoModalComponent,
    AddNewLanguageModalComponent,
    RentalPackageSettingModalComponent,
    EditDriverModalComponent,
    TripDetailsModalComponent,
    UserModelComponent,
    ExportHistoryModelComponent,
    AddHotelModelComponent,
    AddDispatcherModelComponent,
    EditDispatcherModalComponent,
    CorporateModalComponent,
    EditHotelModelComponent,
    PartnerModalComponent,
    BasicAndTripSettingsModalComponent,
    AppUrlSettingModalComponent,
    GoogleKeySettingModalComponent,
    FirebaseKeyModalComponent,
    PromoCodeModalComponent,
    SmsConnectModalComponent,
    TripPriceComponent,
    TripSurgePriceComponent,
    TripZonePriceComponent,
    TripRentalComponent,
    MassNotificationModalComponent,
    AdminBasicSettingsComponent,
    AdminLogoSettingsComponent,
    AdminNotificationTripSettingsComponent,
    AdminAppUrlComponent,
    AdminAppVersionSettingComponent,
    AdminGoogleKeySettingsComponent,
    AdminFirebaseGCMKeySettingsComponent,
    AdminNotificationIosCertificatesComponent,
    SubAdminModalComponent,
    TripFeatureComponent,
    PanelNameComponent,
    PanelNameModalComponent,
    SmsConfigurationComponent,
    SmsConfigurationModalComponent,
    EmailConfigurationComponent,
    EmailConfigurationModalComponent,
    PaymentConfigurationModalComponent,
    PaymentConfigurationsComponent,
    TripChargeSettingmodalComponent,
    GuestTokenModalComponent,
    ReviewDetailsModalComponent,
    ReferralDetailsComponent,
    TimeconvertPipe,
    UserPanelImagesComponent,
    BaseUrlComponent,
    BaseUrlModalComponent,
    AddNewCancellationReasonComponent,
    AddHubModelComponent,
    EditHubModelComponent,
    VehicleModalComponent,
    EditHubModelComponent,
    AddDriverModalComponent,
    BrandModalComponent,
    TripSettingsComponent,
    WhatsappConfigurationComponent,
    GoogleCaptchaConfigurationComponent,
    GoogleCaptchaConfigurationModalComponent,
    OpenRideTripDetailsModalComponent,
    OpenRideEarningDetailsModalComponent,
    AppForceUpdateSettingsComponent,
    AddBannerModalComponent,
    WsalResponseModalComponent,
    RentCarTypeModelComponent,
    RentCarBrandModelComponent,
    RentCarSpecificationModelComponent,
    RentCarFeatureModelComponent,
    TripRequestComponent,
    TripReportComponent,
    RentalTripDetailModelComponent,
  ],
  imports: [
    TooltipModule.forRoot(),
    ImageCropperModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    CollapseModule,
    ComponentsChartModule,
    FormsModule,
    BsDatepickerModule,
    ModalModule.forRoot(),
    LayoutContainersModule,
    NgSelectModule,
    LightboxModule,
    PaginationModule.forRoot(),
    RatingModule.forRoot(),
    DashboardsContainersModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule,
    HttpClientModule,
    ComponentsStateButtonModule,
    DirectivesModule,
    PipeModule,
    OwlCarouselModule,
    BootstrapCarouselModule.forRoot(),
    NgxPaginationModule
  ],
  exports: [
    ImageCropModelComponent,
    ListPageHeaderComponent,
    AddNewSurgeTimeModalComponent,
    AddNewPlaceModalComponent,
    AddNewZoneModalComponent,
    ServiceTypeModalComponent,
    TripEarningDetailsModalComponent,
    AddNewPromoModalComponent,
    AddNewLanguageModalComponent,
    RentalPackageSettingModalComponent,
    EditDriverModalComponent,
    TripDetailsModalComponent,
    UserModelComponent,
    ExportHistoryModelComponent,
    AddHotelModelComponent,
    AddDispatcherModelComponent,
    EditDispatcherModalComponent,
    CorporateModalComponent,
    EditHotelModelComponent,
    PartnerModalComponent,
    BasicAndTripSettingsModalComponent,
    AppUrlSettingModalComponent,
    GoogleKeySettingModalComponent,
    FirebaseKeyModalComponent,
    PromoCodeModalComponent,
    SmsConnectModalComponent,
    TripPriceComponent,
    TripSurgePriceComponent,
    TripZonePriceComponent,
    TripRentalComponent,
    MassNotificationModalComponent,
    AdminBasicSettingsComponent,
    AdminLogoSettingsComponent,
    AdminNotificationTripSettingsComponent,
    AdminAppUrlComponent,
    AdminAppVersionSettingComponent,
    AdminGoogleKeySettingsComponent,
    AdminFirebaseGCMKeySettingsComponent,
    AdminNotificationIosCertificatesComponent,
    SubAdminModalComponent,
    TripFeatureComponent,
    PanelNameComponent,
    PanelNameModalComponent,
    SmsConfigurationComponent,
    SmsConfigurationModalComponent,
    EmailConfigurationComponent,
    EmailConfigurationModalComponent,
    PaymentConfigurationModalComponent,
    PaymentConfigurationsComponent,
    TripChargeSettingmodalComponent,
    GuestTokenModalComponent,
    ReviewDetailsModalComponent,
    ReferralDetailsComponent,
    UserPanelImagesComponent,
    BaseUrlComponent,
    BaseUrlModalComponent,
    AddNewCancellationReasonComponent,
    AddHubModelComponent,
    EditHubModelComponent,
    VehicleModalComponent,
    EditHubModelComponent,
    AddDriverModalComponent,
    BrandModalComponent,
    TripSettingsComponent,
    WhatsappConfigurationComponent,
    GoogleCaptchaConfigurationComponent,
    GoogleCaptchaConfigurationModalComponent,
    OpenRideTripDetailsModalComponent,
    OpenRideEarningDetailsModalComponent,
    AppForceUpdateSettingsComponent,
    AddBannerModalComponent,
    WsalResponseModalComponent,
    RentCarTypeModelComponent,
    RentCarBrandModelComponent,
    RentCarSpecificationModelComponent,
    RentCarFeatureModelComponent,
    TripRequestComponent,
    TripReportComponent,
    RentalTripDetailModelComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesContainersModule { }
