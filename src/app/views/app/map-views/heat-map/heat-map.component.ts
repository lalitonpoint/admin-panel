import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { MapViewService } from 'src/app/services/map-view.service';
import { SettingsService } from 'src/app/services/settings.service';
import { CityService } from 'src/app/services/city.service';
import { Helper } from 'src/app/shared/helper';
declare const google: any;

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  map: any;
  heatmap: any;
  all_countries: any[] = [];
  vehicle_list: any[] = [];
  country_id: string;
  city_id: string = 'all';
  type_id: string = 'all';
  country_code: string = null;
  type_name: string = this._helper.trans.instant('label-title.all');
  cityLatLong: number[];
  current_location: any;
  direction = localStorage.getItem('direction');
  item_bsRangeValue = [new Date(), new Date()];
  todayDate: Date = new Date();
  created_date: Date;
  city_list: any;

  constructor(private _mapViewService: MapViewService, public _helper: Helper, private _settingService: SettingsService, private _countryService: CountryService, private _cityService: CityService,) { }

  ngOnInit(): void {
    this.getSettingData();
  }

  getSettingData() {
    let json: any = { admin_id: this._helper.user_details._id };
    this._settingService.getSettingDetails(json).then((response) => {
      if (response.success && response.setting_detail) {
        this.cityLatLong = response.setting_detail[0].location;
      }
      this._helper.created_date.subscribe(data => {
        if (data) {
          let date = new Date(data)
          this.created_date = date;
        }
      })
      //get country list
      this._countryService.fetchCountry().then(res => {
        this.all_countries = res.country_list;
        this._initMap();
      })
    })
  }

  //get type and provider list when change country
  onChangeCountry(id) {
    this.type_id = 'all';
    this.type_name = 'all';
    this.country_id = id;
    this.vehicleTypeList();
    this.getCityList(this.country_id);
    let i = this.all_countries.findIndex((x: any) => x._id == id)
    if (this.all_countries[i]?.countryLatLong[0]) {
      let theme = localStorage.getItem('vien-themecolor');
      if (theme.includes('dark')) {
        this.map = new google.maps.Map(document.getElementById('heat_map'), {
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
        this.map = new google.maps.Map(document.getElementById('heat_map'), {
          zoom: 5,
          streetViewControl: false,
          center: { lat: this.all_countries[i].countryLatLong[0], lng: this.all_countries[i].countryLatLong[1] }
        });
      }
    } else {
      this.map.setZoom(2)
    }
    this.getHeatMapData();
  }

  onChangeCity(id) {
    this.type_id = 'all';
    this.type_name = 'all';
    this.city_id = id;
    this.vehicleTypeList();
    let theme = localStorage.getItem('vien-themecolor');
    if (id != "all") {
      let i = this.city_list.findIndex((x: any) => x._id == id)
      if (this.city_list[i]?.cityLatLong[0]) {
        if (theme.includes('dark')) {
          this.map = new google.maps.Map(document.getElementById('heat_map'), {
            zoom: 10,
            streetViewControl: false,
            center: { lat: this.city_list[i].cityLatLong[0], lng: this.city_list[i].cityLatLong[1] },
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
          this.map = new google.maps.Map(document.getElementById('heat_map'), {
            zoom: 10,
            streetViewControl: false,
            center: { lat: this.city_list[i].cityLatLong[0], lng: this.city_list[i].cityLatLong[1] }
          });
        }
      } else {
        this.map.setZoom(2);
      }
    } else {
      let i = this.all_countries.findIndex((x: any) => x._id == this.country_id)
      if (this.all_countries[i]?.countryLatLong[0]) {
        if (theme.includes('dark')) {
          this.map = new google.maps.Map(document.getElementById('heat_map'), {
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
          this.map = new google.maps.Map(document.getElementById('heat_map'), {
            zoom: 5,
            streetViewControl: false,
            center: { lat: this.all_countries[i].countryLatLong[0], lng: this.all_countries[i].countryLatLong[1] }
          });
        }
      } else {
        this.map.setZoom(2)
      }
    }
    this.getHeatMapData();
  }

  // get city from country 
  getCityList(country_Id) {
    this._cityService.fetchDestinationCity({ country_id: country_Id, type: 1 }).then(res => {
      if (res.success) {
        this.city_id = "all";
        this.city_list = res.destination_list;
      } else {
        this.city_id = "all";
        this.city_list = [];
      }
    })
  }

  //get type and provider list when change country
  onChangeDate(event) {
    this.item_bsRangeValue = event
    this.getHeatMapData();
  }

  //get typelist for vehicle and get provider list
  vehicleTypeList() {
    this.vehicle_list = [];
    let json: any = { country_id: this.country_id, city_id: this.city_id };
    this._mapViewService.vehicleTypeList(json).then(res => {
      this.vehicle_list = res.type_list;
    })
  }

  //get provider list when change vehicle type
  onChangeVehicleType(id) {
    this.type_id = id._id;
    if (!this.type_id) {
      this.type_id = "all";
    }
    this.getHeatMapData();
  }

  //initialize map
  async _initMap() {
    if (this.current_location !== false) {
      this.current_location = await new Promise((resolve, rejects) => {
        navigator.geolocation.getCurrentPosition((location) => {
          resolve(location)
        }, (error) => {
          resolve(false)
        })
      })
    }
    if (this.current_location !== false) {
      new google.maps.Geocoder().geocode({ location: { lat: this.current_location.coords.latitude, lng: this.current_location.coords.longitude } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const country = results[0].address_components.find((component) => component.types.includes('country'));
          for (const _country of this.all_countries) {
            if (_country.countryname == country.long_name) {
              this.onChangeCountry(_country._id)
              break;
            }
          }
        }
      });
      let theme = localStorage.getItem('vien-themecolor');
      if (theme.includes('dark')) {
        this.map = new google.maps.Map(document.getElementById("heat_map"), {
          zoom: 6,
          center: { lat: this.current_location.coords.latitude, lng: this.current_location.coords.longitude },
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
        this.map = new google.maps.Map(document.getElementById("heat_map"), {
          zoom: 6,
          center: { lat: this.current_location.coords.latitude, lng: this.current_location.coords.longitude }
        });
      }
      this.current_location = false;
    } else {
      let theme = localStorage.getItem('vien-themecolor');
      if (theme.includes('dark')) {
        this.map = new google.maps.Map(document.getElementById("heat_map"), {
          zoom: 6,
          center: { lat: this.cityLatLong[0], lng: this.cityLatLong[1] }
        });
      } else {
        this.map = new google.maps.Map(document.getElementById("heat_map"), {
          zoom: 6,
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
      }
      this.onChangeCountry(this.all_countries[0]._id)
    }
  }

  getHeatMapData() {
    let start_date: any;
    if (this.item_bsRangeValue[0]) {
      this.item_bsRangeValue[0].setHours(0,0,0,0);
      const diff = new Date(this.item_bsRangeValue[0]).getTimezoneOffset() * 60000
      const secs = new Date(this.item_bsRangeValue[0]).getTime()
      start_date = new Date(secs - diff).toUTCString()
    }
    let end_date: any;
    if (this.item_bsRangeValue[1]) {
      const diff = new Date(this.item_bsRangeValue[1]).getTimezoneOffset() * 60000
      const secs = new Date(this.item_bsRangeValue[1]).getTime()
      end_date = new Date(secs - diff).toUTCString()
    }
    let json: any = {
      country_id: this.country_id,
      city_id: this.city_id,
      type_id: this.type_id,
      start_date: start_date,
      end_date: end_date
    }
    this._mapViewService.getHeatMapData(json).then(res => {
      if (res.success) {
        this.drawHeatMap(res.pickup_locations);
      }
    })
  }

  //draw HeatMap of
  drawHeatMap(data) {
    let latlang = []
    if (this.heatmap) {
      this.heatmap.setMap(null);
    }
    data.forEach(element => {
      latlang.push(new google.maps.LatLng(element.sourceLocation[0], element.sourceLocation[1]))
    });
    if (latlang.length > 0) {
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: latlang,
        map: this.map,
        opacity: 0.8,
        radius: 15
      });
    }
  }
}