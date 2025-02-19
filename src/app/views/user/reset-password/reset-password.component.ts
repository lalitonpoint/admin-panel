import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  @ViewChild('resetForm') resetForm: NgForm;

  buttonDisabled = false;
  buttonState = '';
  IMAGE_URL = environment.IMAGE_URL;
  darkTheme = localStorage.getItem('vien-themecolor')
  logoClr: boolean = false;
  params:any;
  showPassword:any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public _helper:Helper
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.params = params;
      if (!params['id']) {
        this.router.navigate(['/admin/login']);
      }
    });
    if (this.darkTheme.startsWith('dark')) {
      this.logoClr = true;
    }
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';
      let json: any = { id:this.params.id, token:this.params.link, password:this.resetForm.value.password};
      this.authService.new_password(json).then(isForgot => {
        if (isForgot) {
          this.router.navigate(['/admin/login']).then(() => {
            setTimeout(() => {
              this.buttonDisabled = false;
              this.buttonState = '';
              this.resetForm.reset();
            }, 1000)
          });
        } else {
          this.buttonDisabled = false;
          this.buttonState = '';
        }
      });
    }
  }
}
