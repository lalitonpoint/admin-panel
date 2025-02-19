import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';
import { DocumentsComponent } from './documents/documents.component';
import { LanguagesComponent } from './languages/languages.component';
import { PromoCodeComponent } from './promo-code/promo-code.component';
import { SmsSettingComponent } from './sms-setting/sms-setting.component';
import { MailSettingComponent } from './mail-setting/mail-setting.component';
import { ReferralCodeComponent } from './referral-code/referral-code.component';
import { MassNotificationComponent } from './mass-notification/mass-notification.component';
import { TermsPrivacySettingComponent } from './terms-privacy-setting/terms-privacy-setting.component';
import { GuestTokenComponent } from './guest-token/guest-token.component';
import { CancellationReasonComponent } from './cancellation-reason/cancellation-reason.component';
import { LogsComponent } from './logs/logs.component'
import { BannerComponent } from './banner/banner.component';

const routes: Routes = [
  {
    path: '', component: SettingComponent,
    children: [
      { path: '', redirectTo: 'basic-settings/admin', pathMatch: 'full' },
      {
        path: 'basic-settings', children: [
          { path: '', redirectTo: 'admin', pathMatch: 'full' },
          { path: 'admin', component: AdminSettingComponent, data: {auth: 'admin'}  },
          { path: 'document', component: DocumentsComponent, data: {auth: 'document'}  },
          { path: 'language', component: LanguagesComponent, data: {auth: 'language'}  },
          { path: 'banner', component: BannerComponent, data: { auth: 'banner' } }
        ]
      },
      {
        path: 'discount', children: [
          { path: '', redirectTo: 'offer', pathMatch: 'full' },
          { path: 'offer', component: PromoCodeComponent, data: {auth: 'offer'} },
          { path: 'referral-code', component: ReferralCodeComponent},
        ]
      },
      {
        path: 'other-settings', children: [
          { path: '', redirectTo: 'email-settings', pathMatch: 'full' },
          { path: 'email-settings', component: MailSettingComponent, data: {auth: 'email-settings'} },
          { path: 'sms-settings', component: SmsSettingComponent, data: {auth: 'sms-settings'} },
          { path: 'mass-notification', component: MassNotificationComponent, data: {auth: 'mass-notification'} },
          { path: 'terms_and_privacy_setting', component: TermsPrivacySettingComponent, data: {auth: 'terms_and_privacy_setting'} },
          { path: 'cancellation-reason', component: CancellationReasonComponent, data: {auth: 'cancellation-reason'}},
          { path: 'logs', component: LogsComponent, data: {auth: 'logs'}},
          { path: 'guest-token', component: GuestTokenComponent , data: {auth: 'guest-token'}},
        ]
      },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingRoutingModule { }
