import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  @ViewChild('forgotPassForm') forgotPassForm: NgForm;
  buttonDisabled = false;
  buttonState = '';
  IMAGE_URL = environment.IMAGE_URL;
  darkTheme = localStorage.getItem('vien-themecolor')
  logoClr:boolean=false;
  constructor(private _authService: AuthService, private router: Router,public _helper:Helper) { }
  ngOnInit(): void {
    if(this.darkTheme.startsWith('dark') ){
      this.logoClr=true;
    }
  }
  onSubmit(): void {
    if (this.forgotPassForm.valid) {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';
      let json: any = { email: this.forgotPassForm.value.email, device_type:'web' }
      
      this._authService.forgot_password_Email(json).then(isForgot => {
        if (isForgot) {
          this.router.navigateByUrl('/admin/login').then(() => {
            setTimeout(() => {
              this.buttonDisabled = false;
              this.buttonState = '';
              this.forgotPassForm.reset();
            },1000)
          })
        } else {
          this.buttonDisabled = false;
          this.buttonState = '';
        }
      });
    }
  }

}
