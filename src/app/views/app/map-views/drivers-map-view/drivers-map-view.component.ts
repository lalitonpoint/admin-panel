import { Component, OnDestroy, OnInit } from '@angular/core';
import { Helper } from 'src/app/shared/helper';
import { MapViewService } from 'src/app/services/map-view.service';
import * as $ from "jquery";
import { CountryService } from 'src/app/services/country.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SocketService } from 'src/app/services/sockert.service';
import { DEFAULT_IMAGE } from 'src/app/constants/constants';
import { environment } from 'src/environments/environment';
import { CityService } from 'src/app/services/city.service';

declare let google: any;

@Component({
  selector: 'app-drivers-map-view',
  templateUrl: './drivers-map-view.component.html',
  styleUrls: ['./drivers-map-view.component.scss']
})
export class DriversMapViewComponent implements OnInit, OnDestroy {
  map: any;
  all_countries: any[] = [];
  provider_list: any[] = [];
  provider_markers: any[] = [];
  vehicle_list: any[] = [];
  country_id: string = 'all';
  type_id: string = 'all';
  country_code: string = null;
  address: string = 'all';
  type_name: string = 'all';
  is_active_selected = true;
  is_inactive_selected = true;
  is_waiting_selected = true;
  is_in_trip_selected = true;
  cityLatLong: number[] = [0, 0];
  SearchText: any;
  searchKeyword = '';
  filtered_provider_list = [];
  filter_type = 1
  IMAGE_URL = environment.IMAGE_URL;
  DEFAULT_USER_PROFILE = DEFAULT_IMAGE.USER_PROFILE;
  geocoder: any;
  country = "";
  city_list = [];
  infoWindowsArray: Array<any> = [];
  slected_city_id: string = 'all';

  constructor(private _socket: SocketService, public _helper: Helper, private _mapViewService: MapViewService, private _countryService: CountryService, private _settingService: SettingsService, private _cityService: CityService) { }

  async ngOnInit(): Promise<void> {
    this.getSettingData();

    //get country list
    await this._countryService.fetchCountry().then(res => {
      this.all_countries = res.country_list;
      this.country_id = this.all_countries[0]._id;
      this.country = this.all_countries[0].countryname;
    })

    //Get current location
    let location: any = await this.getCurrentLocation()
    if (location) {
      let response = await this._helper.geocoder({ latitude: location.coords.latitude, longitude: location.coords.longitude })
      response['address_components'].forEach(element => {
        let type = element.types[0]
        if (type == 'country') {
          this.country = element.long_name;
        }
      });
    }

    // Set location on the map and country dropdown menu
    this.setCurrentLocationOnMap(this.country);
    this.vehicleTypeList();
    this.init_socket()
  }

  getCurrentLocation() {
    return new Promise((resolve, rejects) => {
      navigator.geolocation.getCurrentPosition(function (location) {
        resolve(location);
      }, (error) => {
        resolve(false);
      });
    });
  }

  setCurrentLocationOnMap(country) {
    let current_country = this.all_countries.find(obj => obj['countryname'] == country);
    if (current_country) {
      this.country_id = current_country?._id;
    } else {
      current_country = this.all_countries[0];
      this.country_id = this.all_countries[0]?._id;
      this.country = this.all_countries[0].countryname;
    }

    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.map = new google.maps.Map(document.getElementById('driver_map'), {
        zoom: 5,
        streetViewControl: false,
        center: { lat: current_country.countryLatLong[0], lng: current_country.countryLatLong[1] },
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
      this.map = new google.maps.Map(document.getElementById('driver_map'), {
        zoom: 5,
        streetViewControl: false,
        center: { lat: current_country.countryLatLong[0], lng: current_country.countryLatLong[1] }
      });
    }
    //get city
    this._cityService.fetchDestinationCity({ country_ids: [this.country_id], type: 1 }).then(city => {
      if (city.success) {
        this.city_list = city.destination_list
      }
    })
  }

  async init_socket() {
    this._socket.connectRoom("admin_panel");

    this._socket.listener("provider_state_update").subscribe((res: any) => {
      let field = ""
      let value = 1
      switch (this.filter_type) {
        case 1:// Online
          field = "is_active"
          break;
        case 2: // Offline
          field = "is_active"
          value = 0
          break;
        case 3: // In Trip
          field = "is_available"
          value = 0
          break;
      }

      const main_index = this.provider_list.findIndex((x: any) => x._id == res.provider_id);
      if (main_index != -1) {
        const provider = this.provider_list[main_index];
        if (res.providerLocation?.length > 0) {
          provider.providerLocation[0] = res.providerLocation[0];
          provider.providerLocation[1] = res.providerLocation[1];
        }
        provider.is_active = res.is_active;
        provider.is_available = res.is_available;
      }

      const index1 = this.provider_markers.findIndex((x: any) => x.provider_id == res.provider_id);
      if (index1 != -1) {
        let marker = this.provider_markers[index1].marker;
        marker.setMap(null);
        this.provider_markers.splice(index1, 1);
      }

      if (res?.provider_id) {
        const index = this.filtered_provider_list.findIndex((x: any) => x._id == res.provider_id);
        if (index != -1) {
          if (res[field] == value) {
            const filteredProvider = this.filtered_provider_list[index];
            filteredProvider.providerLocation[0] = res.providerLocation[0];
            filteredProvider.providerLocation[1] = res.providerLocation[1];
            filteredProvider.is_active = res.is_active;
            filteredProvider.is_available = res.is_available;
            this.updateMarker(filteredProvider);
          } else {
            this.filtered_provider_list.splice(index, 1);
          }
        } else if (main_index != -1) {
          this.addFilteredProvider(res, field, value, this.provider_list[main_index]);
        }
      }
    })
  }

  addFilteredProvider(res, field, value, provider) {
    if (res[field] == value) {
      this.filtered_provider_list.push(provider)
      this.updateMarker(provider);
    }
  }

  //create marker on map
  updateMarker(data) {
    let to_fixed_number = this._helper.to_fixed_number;

    let icon_name = '';

    switch (this.filter_type) {
      case 1:
        icon_name = DEFAULT_IMAGE.DRIVER_IN_TRIP;
        break;
      case 2:
        icon_name = DEFAULT_IMAGE.DRIVER_OFFLINE;
        break;
      case 3:
        icon_name = DEFAULT_IMAGE.PICKUP_ICON;
        break;
    }

    if (data.providerLocation != undefined) {
      let marker = new google.maps.Marker({
        position: { lat: Number(data.providerLocation[0]), lng: Number(data.providerLocation[1]) },
        map: this.map,
        icon: icon_name
      });


      let infoWindow = new google.maps.InfoWindow();

      let provider_car_model = '';
      if (data.vehicle_detail) {
        data.vehicle_detail.forEach(vehicle => {
          if (vehicle.is_selected) {
            provider_car_model = vehicle.model
          }
        })
      }

      this.provider_markers.push({ marker: marker, provider_id: data._id });
      let driver = this._helper.trans.instant('label-title.driver_name');
      let phone = this._helper.trans.instant('menu.driver') + ' ' + this._helper.trans.instant('heading-title.phone');
      let car = this._helper.trans.instant('label-title.car-model');
      let rating = this._helper.trans.instant('label-title.rating');
      //Attach click event to the marker.
      (function (marker, data) {
        google.maps.event.addListener(marker, "click", function (e) {

          infoWindow.setContent("<div>" + '<p style="text-align:left"><b>' + driver + '</b>: ' + data.name +
            '<br><b>' + phone + '</b>: ' + data.country_phone_code + '' + data.phone +
            '<br><b>' + car + '</b>: ' + provider_car_model +
            '<br><b>' + rating + '</b>: ' + data.rate.toFixed(to_fixed_number) +
            '</p>' + "</div>");
          infoWindow.open(this.map, marker);
        });
      })(marker, data);

    }
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
      this.map = new google.maps.Map(document.getElementById('driver_map'), {
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
      this.map = new google.maps.Map(document.getElementById('driver_map'), {
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

  //google place autocomplete for searchbox
  _initAutocomplete() {
    if (this.country_id == 'all') {
      this.country_code = null;
    } else {
      this.all_countries.forEach((country) => {
        if (country._id == this.country_id) {
          this.country_code = country.countrycode
        }
      })
    }

    let autocompleteElm = <HTMLInputElement>document.getElementById('store_address');
    google.maps.event.clearInstanceListeners(autocompleteElm);
    let autocomplete;
    if (this.country_code) {
      autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { types: ['(cities)'], componentRestrictions: { country: this.country_code } });
    } else {
      autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { types: ['(cities)'] });
    }
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      this.address = place['formatted_address'];
      this.cityLatLong = [lat, lng];
      this._initMap();
      this.vehicleTypeList();
    });
    $('.search-address').find("#store_address").on("focus click keypress", () => {
      $('.search-address').css({ position: "relative" }).append($(".pac-container"));
    });
  }

  //get typelist for vehicle and get provider list
  vehicleTypeList() {
    this.vehicle_list = [];
    let json: any = { country_id: this.country_id };
    this._mapViewService.vehicleTypeList(json).then(res => {
      this.vehicle_list = res.type_list;
      this.providerList(this.country_id, this.type_id);
    })
  }

  //get type and provider list when change country
  onChangeCountry(id) {
    this.address = null;
    this.type_id = 'all';
    this.type_name = 'all';
    this.country_id = id;
    this.vehicleTypeList();
    let i = this.all_countries.findIndex((x: any) => x._id == id)
    this.country = this.all_countries[i].countryname;
    if (this.all_countries[i]?.countryLatLong[0]) {
      let theme = localStorage.getItem('vien-themecolor');
      if (theme.includes('dark')) {
        this.map = new google.maps.Map(document.getElementById('driver_map'), {
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
        this.map = new google.maps.Map(document.getElementById('driver_map'), {
          zoom: 5,
          streetViewControl: false,
          center: { lat: this.all_countries[i].countryLatLong[0], lng: this.all_countries[i].countryLatLong[1] }
        });
      }
    } else {
      this.map.setZoom(2)
    }

    this._cityService.fetchDestinationCity({ country_ids: [this.country_id], type: 1 }).then(city => {
      if (city.success) {
        this.city_list = city.destination_list
      }
    })
  }

  onChangeCity(id) {
    if (id == 'all') {
      this.slected_city_id = id;
      this.setCurrentLocationOnMap(this.country);
    } else {
      this.slected_city_id = id._id;
      this.cityLatLong = id.cityLatLong
      this._initMap();
    }
    this.providerList(this.country_id, this.type_id)
    this.vehicleTypeList();
  }

  //get provider list
  providerList(country_id, type_id) {
    let json: any = {
      country_id: country_id,
      type_id: type_id,
    }
    if (this.slected_city_id != 'all') {
      json['city_id'] = this.slected_city_id;
    }
    if (this.vehicle_list.length == 0) {
      this.type_name = null;
    }
    this._mapViewService.providerList(json).then(res => {
      if (res.success) {
        this.provider_list = res.provider_list;
        this.filtered_provider_list = res.provider_list;

        this.filter(this.filter_type);
      }
    })
  }

  //get provider list when change vehicle type
  onChangeVehicleType(id) {
    this.type_id = id._id;
    if (!this.type_id) {
      this.type_id = "all";
    }
    this.providerList(this.country_id, this.type_id);
  }

  //filter data and give marker on map when checkbox selected or not selected
  filter(provider_state) {
    this.filter_type = provider_state;
    let field = ""
    let value = 1
    switch (provider_state) {
      case 1:// Online
        field = "is_active"
        value = 1
        break;
      case 2: // Offline
        field = "is_active"
        value = 0
        break;
      case 3: // In Trip
        field = "is_available"
        value = 0
        break;
      default:
        break;
    }

    this.filtered_provider_list = this.provider_list.filter(function (provider) { return provider[field] == value && provider.is_approved == 1 });
    this.createMarker(this.filtered_provider_list)
  }

  //create marker on map
  createMarker(provider_list) {
    this.provider_markers.forEach((marker) => {
      marker.marker.setMap(null);
    });
    this.provider_markers = [];
    let to_fixed_number = this._helper.to_fixed_number;

    for (const element of provider_list) {
      let data = element;

      let icon_name = '';
      switch (this.filter_type) {
        case 1:
          icon_name = DEFAULT_IMAGE.DRIVER_IN_TRIP;
          break;
        case 2:
          icon_name = DEFAULT_IMAGE.DRIVER_OFFLINE;
          break;
        case 3:
          icon_name = DEFAULT_IMAGE.PICKUP_ICON;
          break;
      }

      if (data.providerLocation != undefined) {
        let marker = new google.maps.Marker({
          position: { lat: Number(data.providerLocation[0]), lng: Number(data.providerLocation[1]) },
          map: this.map,
          icon: icon_name
        });


        let infoWindow = new google.maps.InfoWindow();

        let provider_car_model = '';
        if (data.vehicle_detail) {
          data.vehicle_detail.forEach(vehicle => {
            if (vehicle.is_selected) {
              provider_car_model = vehicle.model
            }
          })
        }

        this.provider_markers.push({ marker: marker, provider_id: data._id });
        let driver = this._helper.trans.instant('label-title.driver_name');
        let phone = this._helper.trans.instant('menu.driver') + ' ' + this._helper.trans.instant('heading-title.phone');
        let car = this._helper.trans.instant('label-title.car-model');
        let rating = this._helper.trans.instant('label-title.rating');
        //Attach click event to the marker.
        let component = this;
        (function (marker, data) {
          google.maps.event.addListener(marker, "click", function (e) {

            infoWindow.setContent("<div>" + '<p style="text-align:left"><b>' + driver + '</b>: ' + data.name +
              '<br><b>' + phone + '</b>: ' + data.country_phone_code + '' + data.phone +
              '<br><b>' + car + '</b>: ' + provider_car_model +
              '<br><b>' + rating + '</b>: ' + data.rate.toFixed(to_fixed_number) +
              '</p>' + "</div>");
            infoWindow.open(this.map, marker);
            component.infoWindowsArray.push(infoWindow);
          });
        })(marker, data);

      }
    }
  }

  onSelecProvider(provider) {
    this.infoWindowsArray.forEach((infowindow) => {
      infowindow?.close();
    })
    let index = this.provider_markers.findIndex((x: any) => x.provider_id == provider._id);
    if (index != -1) {
      let marker = this.provider_markers[index].marker;
      this.map.setCenter(marker.position);
      this.map.setZoom(20);
      google.maps.event.trigger(marker, 'click');
    }
  }

  ngOnDestroy(): void {
    this._socket.disconnetRoom("admin_panel");
    this.infoWindowsArray = [];
  }

}
