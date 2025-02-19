import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { MapViewService } from 'src/app/services/map-view.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';
declare const google: any;

@Component({
  selector: 'app-all-cities',
  templateUrl: './all-cities.component.html',
  styleUrls: ['./all-cities.component.scss']
})
export class AllCitiesComponent implements OnInit {
  map: any;
  city_circles: any[] = [];
  infoWindow = null;
  cityLatLong: number[] = [0, 0];

  constructor(private _mapViewService: MapViewService, public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this.getSettingData();
    this._initAutocomplete();
  }

  //get admin location
  getSettingData() {
    let json: any = { admin_id: this._helper.user_details._id };
    this._settingService.getSettingDetails(json).then((response) => {
      if (response.success && response.setting_detail) {
        this.cityLatLong = response.setting_detail[0].location;
      }
      this._initMap();
      this.getAllCities();
    })
  }

  //initialize map
  _initMap() {
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.map = new google.maps.Map(document.getElementById('city_map'), {
        zoom: 6,
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
      this.map = new google.maps.Map(document.getElementById('city_map'), {
        zoom: 6,
        streetViewControl: false,
        center: { lat: this.cityLatLong[0], lng: this.cityLatLong[1] }
      });
    }

    if (this.cityLatLong[0] != 0) {
      this.map.setZoom(12);
    } else {
      this.map.setZoom(2);
    }
  }

  //google place autocomplete for searchbox
  _initAutocomplete() {
    let autocompleteElm = <HTMLInputElement>document.getElementById('address');

    let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { types: [] });

    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      this.cityLatLong = [lat, lng];
      this._initMap();
      this.getAllCities();
    });
    $('.search-address').find("#address").on("focus click keypress", () => {
      $('.search-address').css({ position: "relative" }).append($(".pac-container"));
    });
  }

  //get all cities
  getAllCities() {
    this._mapViewService.getAllCities().then(res => {
      if (res.success) {
        this.drawRadius(res.city_list);
      }
    })
  }

  //draw radius of the cities
  drawRadius(city_list) {
    this.city_circles.forEach((circle) => {
      circle.setMap(null);
    })

    city_list.forEach((city) => {

      if (city.cityLatLong) {
        if (city.is_use_city_boundary === false) {
          let color: string;
          if (city.isBusiness == 0) {
            color = 'red'
          }
          if (city.isBusiness == 1) {
            color = 'green'
          }

          let city_radius_circle = new google.maps.Circle({
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            map: this.map,
            center: { lat: Number(city.cityLatLong[0]), lng: Number(city.cityLatLong[1]) },
            radius: (city.cityRadius * 1000)
          });


          google.maps.event.addListener(city_radius_circle, 'click', (event) => {
            if (this.infoWindow) {
              this.infoWindow.close();
            }

            this.infoWindow = new google.maps.InfoWindow({
              content: city.cityname,
              maxWidth: 320
            });

            this.infoWindow.setPosition(event.latLng);
            this.infoWindow.open(this.map, city_radius_circle);
          });
        } else {
          let array = [];
          city.city_locations.forEach((location) => {
            array.push({ lat: Number(location[1]), lng: Number(location[0]) })
          });
          let color: string;
          if (city.isBusiness == 0) {
            color = 'red'
          }
          if (city.isBusiness == 1) {
            color = 'green'
          }

          let city_polygon = new google.maps.Polygon({
            map: this.map,
            paths: array,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 1.2,
            fillColor: color,
            fillOpacity: 0.3,
            draggable: false,
            geodesic: true,
            editable: false
          });


          google.maps.event.addListener(city_polygon, 'click', (event) => {
            if (this.infoWindow) {
              this.infoWindow.close();
            }

            this.infoWindow = new google.maps.InfoWindow({
              content: city.cityname,
              maxWidth: 320
            });

            this.infoWindow.setPosition(event.latLng);
            this.infoWindow.open(this.map, city_polygon);
            // setTimeout(() => {

            //   this.infoWindow.close();
            // }, 5000);
          });
        }

      }
    })
  }

}
