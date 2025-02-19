import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddBannerModalComponent } from 'src/app/containers/pages/add-banner-modal/add-banner-modal.component';
import { BannerService } from 'src/app/services/banner.service';
import { Helper } from 'src/app/shared/helper';


interface Banner {
  banner_title: string;
  redirect_url: string;
  action_link: string;
  is_visible: boolean;
  action_text: string;
}

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit {


  banner_list: Array<Banner> = []
  bannerObservable : Subscription;

  @ViewChild('AddBannerModal' , {static : true}) AddBannerModal : AddBannerModalComponent;
  constructor(public _helper: Helper, private bannerSerivce: BannerService) { }

  ngOnInit(): void {
    this.getBannerList()
  }


  getBannerList() {
    this.bannerObservable = this.bannerSerivce._bannerObservable.subscribe((res) => {
      this.bannerSerivce.get_banner_list({is_admin_list: true}).then((res_data) => {
        if (!res_data.success) {
          this.banner_list = res_data?.banners;
          return this.banner_list;
        }
        this.banner_list = res_data?.banners;
      })
    })
  }

  onAdd(isEdit: boolean, banner: any) {
    this.AddBannerModal.show(isEdit, banner)
  }

  onDeleteBanner(banner: Banner) {
    this.bannerSerivce.delete_banner(banner).then((res_data) => {
      if (!res_data.success) {
        return
      }
      this.getBannerList()
    })
  }
}
