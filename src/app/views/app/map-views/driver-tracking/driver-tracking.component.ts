import { Component, OnInit } from '@angular/core';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { MapViewService } from 'src/app/services/map-view.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

declare const google: any;

@Component({
  selector: 'app-driver-tracking',
  templateUrl: './driver-tracking.component.html',
  styleUrls: ['./driver-tracking.component.scss']
})
export class DriverTrackingComponent implements OnInit {
  map: any;
  provider: any;
  city_list: any;
  provider_marker: any;
  all_countries: any[] = [];
  provider_list: [] = [];
  cityLatLong: number[] = [0, 0];
  country_id: string;
  city_id: string;
  cityname: string;

  constructor(private _countryService: CountryService, private _cityService: CityService, private _mapViewService: MapViewService, public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this.getSettingData();
    //get country list
    this._countryService.fetchCountry().then(res => {
      this.all_countries = res.country_list;
    })
  }

  //get admin location
  getSettingData() {
    let json: any = { admin_id: this._helper.user_details._id };
    this._settingService.getSettingDetails(json).then((response) => {
      if (response.success && response.setting_detail) {
        this.cityLatLong = response.setting_detail[0].location;
      }
      this._initMap();
    })
  }

  //initialize map
  _initMap() {
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.map = new google.maps.Map(document.getElementById('driver_tracking_map'), {
        zoom: 2,
        streetViewControl: false,
        center: { lat: this.cityLatLong[0], lng: this.cityLatLong[1] },
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ],
      });
    } else {
      this.map = new google.maps.Map(document.getElementById('driver_tracking_map'), {
        zoom: 2,
        streetViewControl: false,
        center: { lat: this.cityLatLong[0], lng: this.cityLatLong[1] }
      });
    }

    if (this.cityLatLong[0] != 0) {
      this.map.setZoom(12)
    } else {
      this.map.setZoom(2)
    }

  }

  //when change country get city list for that country
  onChangeCountry(id) {
    let i = this.all_countries.findIndex((x: any) => x._id == id)
    if (this.all_countries[i].countryLatLong[0]) {
      let theme = localStorage.getItem('vien-themecolor');
      if (theme.includes('dark')) {
        this.map = new google.maps.Map(document.getElementById('driver_tracking_map'), {
          zoom: 5,
          streetViewControl: false,
          center: { lat: this.all_countries[i].countryLatLong[0], lng: this.all_countries[i].countryLatLong[1] },
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ],
        });
      } else {
        this.map = new google.maps.Map(document.getElementById('driver_tracking_map'), {
          zoom: 5,
          streetViewControl: false,
          center: { lat: this.all_countries[i].countryLatLong[0], lng: this.all_countries[i].countryLatLong[1] },
        });
      }
    } else {
      this.map.setZoom(2)
    }
    if (id) {
      this.city_id = null;
      this.cityname = null;
      this.provider = null;
      this.cityLatLong = [0, 0];
      this.country_id = id;
      let json: any = { country_id: id, type: 1 };
      this._cityService.fetchDestinationCity(json).then(city => {
        if (city.success) {
          this.city_list = city.destination_list;
        }
      })
    } else {
      if (this.provider_marker) {
        this.provider_marker.setMap(null);
        this.provider_marker = null;
      }
      this.country_id = null;
      this.city_id = null;
      this.cityname = null;
      this.provider = null;
      this.cityLatLong = [0, 0];
      this.city_list = [];
      this.provider_list = [];
    }
  }

  //when change city get provider list from that city 
  onChangeCity(city) {
    if (city) {
      this.provider = null;
      this.city_id = city._id;
      this.cityname = city.cityname;
      this.cityLatLong = city.cityLatLong;
      this._initMap();
      let json: any = { city_id: this.city_id }
      this._mapViewService.providerListFromCity(json).then(res => {
        if (res) {
          this.provider_list = res;
        }
      })
    } else {
      if (this.provider_marker) {
        this.provider_marker.setMap(null);
        this.provider_marker = null;
      }
      this.city_id = null;
      this.cityname = null;
      this.provider = null;
      this.cityLatLong = [0, 0];
      this.provider_list = [];
    }
  }

  //when change provider
  onChangeProvider(provider) {
    if (provider) {
      this.createMarker(provider);
    } else {
      if (this.provider_marker) {
        this.provider_marker.setMap(null);
        this.provider_marker = null;
      }
      this.provider = null;
    }
  }

  //create marker of provider
  createMarker(provider) {
    if (this.provider_marker) {
      this.provider_marker.setMap(null);
      this.provider_marker = null;
    }

    let bounds = new google.maps.LatLngBounds();

    let icon_url = 'assets/default_images/map_pin/provider_online.png';
    let marker = new google.maps.Marker({
      position: { lat: Number(provider.providerLocation[0]), lng: Number(provider.providerLocation[1]) },
      map: this.map,
      icon: icon_url
    });

    this.provider_marker = marker;
    bounds.extend(this.provider_marker.position);
    this.map.fitBounds(bounds);
    this.map.setZoom(12);

    let provider_car_model = '';
    if (provider.vehicle_detail) {
      provider.vehicle_detail.forEach(vehicle => {
        if (vehicle.is_selected) {
          provider_car_model = vehicle.model
        }
      })
    }
    let to_fixed_number = this._helper.to_fixed_number;
    let driver = this._helper.trans.instant('label-title.driver_name');
    let phone = this._helper.trans.instant('menu.driver') + ' ' + this._helper.trans.instant('heading-title.phone');
    let car = this._helper.trans.instant('label-title.car-model');
    let rating = this._helper.trans.instant('label-title.rating');
    let contentString =
      '<p><b>' + driver + '</b>: ' + provider.first_name + ' ' + provider.last_name +
      '<br><b>' + phone + '</b>: ' + provider.country_phone_code + provider.phone +
      '<br><b>' + rating + '</b>: ' + provider.rate.toFixed(to_fixed_number) +
      '<br><b>' + car + '</b>: ' + provider_car_model +
      '</p>';

    let message = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 320
    });

    google.maps.event.addListener(marker, 'click', function (e) {
      message.open(this.map, marker);
      setTimeout(function () { message.close(); }, 5000);
    });
  }

}
