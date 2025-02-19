import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewDetailsModalComponent } from 'src/app/containers/pages/review-details-modal/review-details-modal.component';
import { RequestService } from 'src/app/services/request.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor')
  itemSearch = { label: 'label-title.user', value: 'user_details.first_name' };
  itemOptionsSearch = [
    { label: 'label-title.user', value: 'user_details.first_name' },
    { label: 'label-title.driver', value: 'provider_details.first_name' },
  ];
  itemOptionsPerPage = [];
  review_list: [] = [];
  userCount: any[] = [];
  providerCount: any[] = [];
  user_count_array: any[] = [];
  provider_count_array: any[] = [];
  search_value: string = '';
  timezone_for_display_date:string = '';
  itemsPerPage = 20;
  current_page: number = 1;
  total_page: number;
  total_user_count: number;
  total_provider_count: number;
  all_user_count: number;
  all_provider_count: number;
  darkMode:boolean=false;
  is_clear_disabled:boolean = true;

  @ViewChild('reviewDetails', { static: true }) reviewDetails: ReviewDetailsModalComponent;

  constructor(private _requestService: RequestService, public _helper:Helper) { }

  ngOnInit(): void {
    this.getReviewList();

    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
    if(this.darkTheme.startsWith('dark')){
      this.darkMode=true;
    }

    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  //get review list and user and driver rating
  getReviewList() {
    let json: any = { limit: this.itemsPerPage, page: this.current_page, search_item: this.itemSearch.value, search_value: this.search_value }
    this._requestService.reviewsList(json).then(res => {
      if (res.success) {
        if (res.review_list[0].data.length > 0) {
          this.review_list = res.review_list[0].data[0].data;

          this.userCount = res.review_list[0].userCount;
          let total_user_count = 0;
          let all_user_count = 0;
          this.userCount.forEach((user) => {
            if (user.userCount) {
              let string = user?._id?.toString();
              let data = string?.split('.')[1];
              if (!data && string != 0) {
                total_user_count += user.userCount;
              }
              if (!data) {
                all_user_count += user.userCount;
              }
            }
          })
          this.total_user_count = total_user_count;
          this.all_user_count = all_user_count;

          this.providerCount = res.review_list[0].providerCount;
          let total_provider_count = 0;
          let all_provider_count = 0;
          this.providerCount.forEach((provider) => {
            if (provider.providerCount) {
              let string = provider._id.toString();
              let data = string.split('.')[1];
              if (!data && string != 0) {
                total_provider_count += provider.providerCount;
              }
              if (!data) {
                all_provider_count += provider.providerCount;
              }
            }
          })
          this.total_provider_count = total_provider_count;
          this.all_provider_count = all_provider_count;

          this.total_page = res.review_list[0].data[0].total;

          this.get_percentage();
        } else {
          this.review_list = [];
          this.total_user_count = 0;
          this.all_user_count = 0;
          this.total_provider_count = 0;
          this.all_provider_count = 0;
          this.user_count_array.forEach(data => {
            data.percent = 0;
            data.userCount = 0;
          })
          this.provider_count_array.forEach(data => {
            data.percent = 0;
            data.providerCount = 0;
          })
        }
      }
    })
  }

  //filter data for user and driver rating
  get_percentage() {
    this.user_count_array = [];
    this.provider_count_array = [];
    let finds = []
    if (this.total_user_count > 0) {
      this.userCount.forEach((count, index) => {
        let value = (count.userCount / this.total_user_count) * 100;
        if (count._id == 1) {
          this.user_count_array.push({ id: count._id, percent: value, userCount: count.userCount })
        }
        if (count._id == 2) {
          this.user_count_array.push({ id: count._id, percent: value, userCount: count.userCount })
        }
        if (count._id == 3) {
          this.user_count_array.push({ id: count._id, percent: value, userCount: count.userCount })
        }
        if (count._id == 4) {
          this.user_count_array.push({ id: count._id, percent: value, userCount: count.userCount })
        }
        if (count._id == 5) {
          this.user_count_array.push({ id: count._id, percent: value, userCount: count.userCount })
        }
      })
      let a = [5, 4, 3, 2, 1];
      let b = this.user_count_array.map((value) => value.id)
      a.forEach((value) => {
        let findmissing = b.indexOf(value)
        if (findmissing == -1) {
          this.user_count_array.push({ id: value, percent: 0, providerCount: 0 })
        }
      })
      this.user_count_array.sort(function (a, b) {
        return b.id - a.id;
      })
    }

    if (this.total_provider_count > 0) {
      this.providerCount.forEach((count) => {
        let value = (count.providerCount / this.total_provider_count) * 100;
        if (count._id == 1) {
          this.provider_count_array.push({ id: count._id, percent: value, providerCount: count.providerCount })
        }
        if (count._id == 2) {
          this.provider_count_array.push({ id: count._id, percent: value, providerCount: count.providerCount })
        }
        if (count._id == 3) {
          this.provider_count_array.push({ id: count._id, percent: value, providerCount: count.providerCount })
        }
        if (count._id == 4) {
          this.provider_count_array.push({ id: count._id, percent: value, providerCount: count.providerCount })
        }
        if (count._id == 5) {
          this.provider_count_array.push({ id: count._id, percent: value, providerCount: count.providerCount })
        }
      })

      this.provider_count_array.sort(function (a, b) {
        return b.id - a.id;
      })

      let c = [5,4,3,2,1];  
      let d = this.provider_count_array.map((value) => value.id)
      c.forEach((value) => {
        let findmissing = d.indexOf(value)
        if (findmissing == -1) {
          this.provider_count_array.push({ id: value, percent: 0, providerCount: 0 })
        }
      })
      this.provider_count_array.sort(function (a, b) {
        return b.id - a.id;
      })
    }
  }

  //when change value in serch by dropdown
  onChangeSearchBy(item): void {
    this.itemSearch = item;
    this.is_clear_disabled = false;
  }

  //when change page limit
  onChangeItemsPerPage(item) {
    if(this.total_page >= this.current_page){
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.getReviewList();
  }

  //when change pagination page
  pageChanged(event) {
    this.current_page = event;
    this.getReviewList();
  }

  //apply filter
  apply() {
    this.current_page = 1;
    this.getReviewList();
  }

  //clear filter
  clear() {
    this.search_value = '';
    this.itemSearch = { label: 'label-title.user', value: 'user_details.first_name' };
    this.current_page = 1;
    this.itemsPerPage = 20;
    this.getReviewList();
    this.is_clear_disabled = true;
  }

  //open review detail modal
  showReviewModal(review) {
    this.reviewDetails.show(review);
  }

}
