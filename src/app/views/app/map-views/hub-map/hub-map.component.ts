import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';
import { CityService } from 'src/app/services/city.service';
import { CommonService } from 'src/app/services/common.service';
import { MapViewService } from 'src/app/services/map-view.service';

declare const google: any;

@Component({
  selector: 'app-hub-map',
  templateUrl: './hub-map.component.html',
  styleUrls: ['./hub-map.component.scss']
})
export class HubMapComponent implements OnInit {
  map: any;
  all_countries: any[] = [];
  city_list = [];
  cityLatLong: number[] = [0, 0];
  country_id: string = '';
  country = "";
  city_id: string = 'all';
  city = "all";
  infoWindow = null;
  SearchText: string = '';
  hub_list: any[] = [];
  polygon_list: any[] = [];
  searchKeyword = '';

  constructor(public _helper: Helper, private _countryService: CountryService, private _settingService: SettingsService, private _cityService: CityService, private _commonService: CommonService, private _mapViewService: MapViewService) { }

  async ngOnInit(): Promise<void> {
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
        switch (type) {
          case 'country':
            this.country = element.long_name;
            break;
          case 'administrative_area_level_2':
            this.city = element.short_name;
            break;
          default:
            break;
        }
      });
    }

    // Set location on the map and country dropdown menu
    this.setCurrentLocationOnMap(this.country);
  }

  //Get current location
  getCurrentLocation() {
    return new Promise((resolve, rejects) => {
      navigator.geolocation.getCurrentPosition(function (location) {
        resolve(location);
      }, (error) => {
        resolve(false);
      });
    });
  }

  // Set location on the map and country dropdown menu
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
      this.map = new google.maps.Map(document.getElementById('hub_map'), {
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
      this.map = new google.maps.Map(document.getElementById('hub_map'), {
        zoom: 5,
        streetViewControl: false,
        center: { lat: current_country.countryLatLong[0], lng: current_country.countryLatLong[1] }
      });
    }

    //get city
    this._cityService.fetchDestinationCity({ country_ids: [this.country_id], type: 1 }).then(city => {
      if (city.success) {
        this.city_list = city.destination_list;
        if (this.city_list.length > 0) {
          this.getHubListCityWise(this.city_id);
        }
      }
    })
  }

  //initialize map
  _initMap() {
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.map = new google.maps.Map(document.getElementById('hub_map'), {
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
      this.map = new google.maps.Map(document.getElementById('hub_map'), {
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

  //when change country
  onChangeCountry(id) {
    this.city = null;
    this.city_id = "all";
    this.country_id = id;
    let i = this.all_countries.findIndex((x: any) => x._id == id)
    if (this.all_countries[i]?.countryLatLong[0]) {
      let theme = localStorage.getItem('vien-themecolor');
      if (theme.includes('dark')) {
        this.map = new google.maps.Map(document.getElementById('hub_map'), {
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
        this.map = new google.maps.Map(document.getElementById('hub_map'), {
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
        this.city_list = city.destination_list;
        if (this.city_list.length > 0) {
          this.getHubListCityWise(this.city_id);
        } else {
          this.hub_list = [];
          this.city_id = null;
        }
      } else {
        this.hub_list = [];
        this.city_id = null;
      }
    })
  }

  //when change city
  onChangeCity(city_id) {
    let city = this.city_list.find(city => city._id == city_id);
    this.city_id = city_id;
    if (city_id != 'all') {
      this.cityLatLong = city.cityLatLong;
      this._initMap();
    } else {
      const country = this.all_countries.find((x) => x._id == this.country_id);
      this.map = new google.maps.Map(document.getElementById('hub_map'), {
        zoom: 5,
        streetViewControl: false,
        center: { lat: country.countryLatLong[0], lng: country.countryLatLong[1] }
      });
    }
    this.getHubListCityWise(city_id);
  }

  //get hublist from city
  getHubListCityWise(city_id) {
    let json: any = { country_id: this.country_id, city_id: city_id };
    this._mapViewService.getHubList(json).then((response) => {
      if (response.success) {
        this.hub_list = response.hubs;
        this.drawAllHubZone(response.hubs);
      }
    })
  }

  // draw hubs
  drawAllHubZone(hubs) {
    let drawMap = this.map;
    this.polygon_list = [];

    hubs.forEach((hub) => {
      let zone = [];
      hub.kmlzone.forEach((kml) => {
        zone.push({ lat: Number(kml[1]), lng: Number(kml[0]) })
      });

      const polygon = new google.maps.Polygon({
        map: drawMap,
        paths: zone,
        fillColor: 'green',
        strokeColor: 'green',
        fillOpacity: 0.3,
        strokeWeight: 2,
        clickable: true,
        editable: false,
        zIndex: 1,
        strokeOpacity: 1,
        draggable: false,
        geodesic: true
      });
      this.polygon_list.push({ _id: hub._id, polygon: polygon });

      google.maps.event.addListener(polygon, 'click', (event) => {
        if (this.infoWindow) {
          this.infoWindow.close();
        }

        this.infoWindow = new google.maps.InfoWindow({
          content: hub.name,
          maxWidth: 320
        });

        this.infoWindow.setPosition(event.latLng);
        this.infoWindow.open(this.map, polygon);
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng({ lat: hub.location[0], lng: hub.location[1] }));
        this.map.fitBounds(bounds);
        this.map.setZoom(16);
      });
    })

  }

  onSelecHub(hub) {
    const index = this.polygon_list.findIndex((polygon) => polygon._id == hub._id);
    if (index != -1) {
      const polygon = this.polygon_list[index].polygon;
      const customEvent = {
        latLng: new google.maps.LatLng(hub.location[0], hub.location[1])
      };
      google.maps.event.trigger(polygon, 'click', customEvent);
    }
  }

}
