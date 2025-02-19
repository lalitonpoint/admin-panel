import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { ViewsModule } from './views/views.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { LayoutContainersModule } from './containers/layout/layout.containers.module';
import { ResInterceptInterceptor } from './interceptor/res-intercept.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { LoaderModule } from 'src/app/components/loader/loader.module';
import { RecaptchaModule, RecaptchaV3Module, RecaptchaFormsModule } from "ng-recaptcha";
import { CommonService } from './services/common.service';
import { Helper } from './shared/helper';
import { CarouselModule as OwlCarouselModule } from 'ngx-owl-carousel-o';
import { CarouselModule as BootstrapCarouselModule } from 'ngx-bootstrap/carousel';

function load(config: CommonService, helper: Helper): () => Promise<boolean> {
  return async () => {
    try {
      helper.helper_is_loading = true;
      await config._initApp();
      helper.helper_is_loading = false;
      return true;
    } catch (err) {
      helper.helper_is_loading = true;
      return false;
    }
  };
}

@NgModule({
  imports: [
    LoaderModule,
    BrowserModule,
    ViewsModule,
    AppRoutingModule,
    LayoutContainersModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    RecaptchaV3Module,
		RecaptchaModule,
		RecaptchaFormsModule,
    OwlCarouselModule,
    BootstrapCarouselModule.forRoot()
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResInterceptInterceptor,
      multi: true
    },
    {
			provide: APP_INITIALIZER,
			useFactory: load,
			deps: [CommonService,Helper],
			multi: true
		},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
