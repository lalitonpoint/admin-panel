import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  app_name: any = 'Welcome To HCa-Go';
  IMAGE_URL = environment.IMAGE_URL;
  constructor(private authService: AuthService, public helper:Helper) { }

  ngOnInit(): void {
    this.authService.check_subscription().then((response)=>{
      if(response){
        this.helper._route.navigateByUrl('/app/dashboard');
      }
    })
  }

  onClickAddCard(){
    let host = `${window.location}`
    this.authService.create_subscription_session({ url: host }).then((response: any) => {
      if(response.success){
        window.open(response.data.url, '_self');
      }
    })
  }
}
