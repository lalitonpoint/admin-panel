import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  darkTheme = localStorage.getItem('vien-themecolor')
  logoClr: boolean = false;
  buttonDisabled = false;
  buttonState = '';
  IMAGE_URL = environment.IMAGE_URL;
  showPassword: any;
  loginSubscription: Subscription;
  token;

  constructor(private _authService: AuthService, public helper: Helper,private elementRef: ElementRef) { }
  ngOnInit(): void {
    if (this.darkTheme.startsWith('dark')) {
      this.logoClr = true;
    }
    if(this.helper.user_details){
      if(this.helper.is_rental){
        this._authService.check_subscription().then((response)=>{
          if(response){
            this.helper._route.navigateByUrl('/app/dashboard');
          }else{
            this.helper._route.navigateByUrl('/admin/check-subscription');
          }
        })
      }else{
        this.helper._route.navigateByUrl('/app/dashboard');
      }
    }
    this.tokenGenerator();
  }

  tokenGenerator() {
    length = 32;
    let token = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++)
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    this.token = token;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      const firstInvalidInputElement = this.elementRef.nativeElement.querySelector('input.ng-invalid');
      if (firstInvalidInputElement) {
        firstInvalidInputElement.focus();
      }
    }
  
    if (this.loginForm.valid) {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';
      let json: any = { username: this.loginForm.value.username, password: this.loginForm.value.password, token: this.token, device_type:'web' }

      this._authService.login(json).then(islogin => {
        if (islogin) {
          if(this.helper.is_rental){
            this._authService.check_subscription().then((response)=>{
              if(response){
                this.helper._route.navigateByUrl('/app/dashboard');
              }else{
                this.helper._route.navigateByUrl('/admin/check-subscription');
              }
              setTimeout(() => {
                this.buttonDisabled = false;
                this.buttonState = '';
                this.loginForm.reset();
              }, 1000)
            })
          }else{
            this.helper._route.navigateByUrl('/app/dashboard').then(()=>{
              setTimeout(() => {
                this.buttonDisabled = false;
                this.buttonState = '';
                this.loginForm.reset();
              }, 1000)
            })
          }
        } else {
          this.buttonDisabled = false;
          this.buttonState = '';
        }
      });
    }
  }
  
  ngOnDestroy() {
    // this.loginSubscription.unsubscribe()
  }
}
