import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifiyService } from 'src/app/services/notifier.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';
import { USER_PANEL_RATIO } from 'src/app/constants/constants';
import { ImageCropModelComponent } from '../image-crop-model/image-crop-model.component';

export const user_panel_images = {
  bg_image: 1,
  map: 2,
  rentals: 3,
  taxi_hailing: 4,
  ride_share: 5,
  split_payment: 6,
  driver_going_home: 7,
  multiple_stop: 8,
  extensive_range_of_cabs: 9,
  secure_and_swift_ride: 10,
  licensed_drivers: 11,
  cashless_rides: 12,
  airport_transfer: 13,
  flexible_bookings: 14,
}

export const user_panel_images_name = {
  1: 'bg_image',
  2: 'map',
  3: 'rentals',
  4: 'taxi_hailing',
  5: 'ride_share',
  6: 'split_payment',
  7: 'driver_going_home',
  8: 'multiple_stop',
  9: 'extensive_range_of_cabs',
  10: 'secure_and_swift_ride',
  11: 'licensed_drivers',
  12: 'cashless_rides',
  13: 'airport_transfer',
  14: 'flexible_bookings',
}

@Component({
  selector: 'app-user-panel-images',
  templateUrl: './user-panel-images.component.html',
  styleUrls: ['./user-panel-images.component.scss']
})
export class UserPanelImagesComponent implements OnInit {
  public formData: FormData;
  is_edit_images = false;
  type: number;
  user_panel_images = user_panel_images;
  user_panel_images_name = user_panel_images_name;
  upload_images = {
    bg_image: '',
    map: '',
    rentals: '',
    taxi_hailing: '',
    ride_share: '',
    split_payment: '',
    driver_going_home: '',
    multiple_stop: '',
    extensive_range_of_cabs: '',
    secure_and_swift_ride: '',
    licensed_drivers: '',
    cashless_rides: '',
    airport_transfer: '',
    flexible_bookings: '',
  }
  randomQueryParam: any;

  @ViewChild('cropModel', { static: true }) cropModel: ImageCropModelComponent;

  constructor(public _helper: Helper, private _notifierService: NotifiyService, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this.randomQueryParam = `random=${Math.random()}`;
  }

  onClickImagesSetting() {
    this.is_edit_images = !this.is_edit_images;
    if (this.is_edit_images) {
      this.formData = new FormData();
    } else {
      this.formData.append('admin_id', this._helper.user_details._id);
      this._settingService.uplodadUserPanelImages(this.formData).then(res => {
        if (res) {
          window.location.reload();
        }
      });
    }
  }

  //select image and render
  onSelectImageFile(event, type) {
    if (event.target.files?.length) {
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const width = img.naturalWidth;
            if (type == user_panel_images.bg_image) {
              if (width < USER_PANEL_RATIO.bg_image_max_width) {
                this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.minimum-image-1920px'))
                return;
              }
            } else if (type == user_panel_images.extensive_range_of_cabs || type == user_panel_images.secure_and_swift_ride || type == user_panel_images.licensed_drivers || type == user_panel_images.cashless_rides || type == user_panel_images.airport_transfer || type == user_panel_images.flexible_bookings) {
              if (width < USER_PANEL_RATIO.icon_image_max_width) {
                this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.minimum-image-180px'))
                return;
              }
            } else if (width < USER_PANEL_RATIO.image_max_width) {
              this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.minimum-image-900px'))
              return;
            }

            this.type = type;
            let files = event.target.files;
            if (files.length === 0)
              return;
            const mimeType = files[0].type;
            let fileType = this._helper.uploadFile.filter((element) => {
              return mimeType == element;
            })
            if (mimeType != fileType) {
              this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.invalid-image-format'))
              return;
            }

            let aspectRatio;
            let resizeToWidth;
            if (type == user_panel_images.bg_image) {
              aspectRatio = USER_PANEL_RATIO.bg_image_ratio;
              resizeToWidth = USER_PANEL_RATIO.bg_image_max_width;
            } else if (type == user_panel_images.extensive_range_of_cabs || type == user_panel_images.secure_and_swift_ride || type == user_panel_images.licensed_drivers || type == user_panel_images.cashless_rides || type == user_panel_images.airport_transfer || type == user_panel_images.flexible_bookings) {
              aspectRatio = USER_PANEL_RATIO.icon_image_ratio;
              resizeToWidth = USER_PANEL_RATIO.icon_image_max_width;
            } else {
              aspectRatio = USER_PANEL_RATIO.image_ratio;
              resizeToWidth = USER_PANEL_RATIO.image_max_width;
            }

            this.cropModel.imageChangedEvent = event;
            this.cropModel.show(aspectRatio, resizeToWidth);
          };
        };
      }
    }
  }

  imageCropped(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    const logo_image = event;
    this.formData.append(user_panel_images_name[this.type], logo_image);
    reader.onload = (_event) => {
      this.upload_images[user_panel_images_name[this.type]] = reader.result
    }
  }

}
