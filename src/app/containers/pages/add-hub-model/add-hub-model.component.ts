import { Helper } from 'src/app/shared/helper';
import { HubService } from '../../../services/hub.service';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import * as $ from "jquery";

declare const google: any;

@Component({
  selector: 'app-add-hub-model',
  templateUrl: './add-hub-model.component.html',
  styleUrls: ['./add-hub-model.component.scss']
})
export class AddHubModelComponent implements OnInit {
  commonForm: UntypedFormGroup;
  city_form: UntypedFormGroup
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  timezones: any = []
  hotelType: any;
  countryList: any;
  countryId: any;
  cityId: any;
  cityList: any;
  country: any;
  map: any;
  fullCityname: any;
  selectedCity: any;
  cityLatLng: any;
  allCountry: any;
  zone_map: any = '';
  drawing_manager: any = '';
  kmlzone: any = [];
  location: any = [];
  pickup_marker: any;
  isInsidePolygon: boolean = true;
  is_overlaping: boolean = false;
  all_hub_zones: any[] = [];
  hubs: any[] = [];
  same_hub_location: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closeModal();
      })
    }
  }

  constructor(private modalService: BsModalService, private countryService: CountryService, private cityService: CityService, private hubService: HubService, public _helper: Helper, private _commonService: CommonService, private _notifiyService: NotifiyService) { }

  async ngOnInit(): Promise<void> {
    let current_location: any = await this.getCurrentLocation()
    this.location = [current_location?.coords?.latitude, current_location?.coords?.longitude]
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

  _initForm() {
    this.commonForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      country: new UntypedFormControl(null, [Validators.required]),
      countryname: new UntypedFormControl(null),
      city: new UntypedFormControl(null, [Validators.required]),
      address: new UntypedFormControl(null, [Validators.required]),
      cityLatitude: new UntypedFormControl(null, [Validators.required]),
      cityLongitude: new UntypedFormControl(null, [Validators.required]),
    });
  }

  // airport map init
  _initZoneMap() {
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.zone_map = new google.maps.Map(document.getElementById('zone_map'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: this.location[0], lng: this.location[1] },
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
      this.zone_map = new google.maps.Map(document.getElementById('zone_map'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: this.location[0], lng: this.location[1] }
      });
    }
    this.drawing_manager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        fillColor: 'green',
        strokeColor: 'green',
        fillOpacity: 0.3,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });
    this.drawing_manager.setMap(this.zone_map);

    google.maps.event.addListener(this.drawing_manager, 'overlaycomplete', (polygon) => {

      let shape = polygon.overlay;
      this.drawing_manager.setDrawingMode(null);
      let location_array = []
      shape.getPath().getArray().forEach((location) => {
        location_array.push([location.lng(), location.lat()])
      });
      this.kmlzone = location_array;
      this.checkMarkerInsidePolygon();
      this.zone_overlaping_check();
      google.maps.event.addListener(shape.getPath(), 'set_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.kmlzone = location_array;
        this.checkMarkerInsidePolygon();
        this.zone_overlaping_check();
      });
      google.maps.event.addListener(shape.getPath(), 'insert_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.kmlzone = location_array;
        this.checkMarkerInsidePolygon();
        this.zone_overlaping_check();
      });

      google.maps.event.addListener(shape.getPath(), 'remove_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.kmlzone = location_array;
        this.zone_overlaping_check();
      });

      if (this.kmlzone.length > 0) {
        this.drawing_manager.setOptions({
          drawingControl: false,
        });
      }

    });

    if (this.commonForm?.value.address) {
      if (this.pickup_marker) {
        this.pickup_marker.setMap(null);
        this.pickup_marker = null;
      }

      let bounds = new google.maps.LatLngBounds();

      let pickuplat_lng = new google.maps.LatLng({ lat: this.location[0], lng: this.location[1] });
      this.pickup_marker = new google.maps.Marker({
        position: pickuplat_lng,
        map: this.zone_map,
        draggable: false,
        icon: this._helper.DEFAULT_IMAGE.DRIVER_ICON,
      });
      bounds.extend(this.pickup_marker.position);
      this.zone_map.fitBounds(bounds);

      this.drawAllHubZone(this.hubs);
    }
  }

  show(type): void {
    this._initForm();
    this.commonForm.reset();
    this.modalRef = this.modalService.show(this.template, this.config);
    this._initZoneMap()
    this.hotelType = type;
    this.countryService.fetchCountry().then((res_data) => {
      this.countryList = res_data.country_list;
    })
  }

  closeModal() {
    this.modalRef?.hide();
    this.all_hub_zones = [];
    this.is_overlaping = false;
    this.isInsidePolygon = true;
    this.same_hub_location = false;
    setTimeout(() => {
      this.commonForm.reset();
    }, 100);
  }

  onSubmit(): void {
  }

  getCountry(event) {
    this.countryId = event._id;
    this.country = event.countryname;

    this.allCountry = event;

    this.commonForm.patchValue({
      city: '',
      address: '',
      cityLatitude: '',
      cityLongitude: ''
    })
    this.selectedCity = '';
    this.fullCityname = '';
    this.cityLatLng = '';

    this.cityService.fetchDestinationCity({ country_id: event._id }).then((res_data) => {
      this.cityList = res_data.destination_list
    })
  }

  cityChange(event) {
    this.selectedCity = event.cityname;
    this.cityLatLng = event.cityLatLong;
    this.cityId = event._id;

    let hub_list_json: any = { city_id: this.cityId }
    this.hubService.getAllHubList(hub_list_json).then((response) => {
      if (response.success) {
        this.hubs = response.hubs;
        this.drawAllHubZone(response.hubs);
      }
    })

    if (this.allCountry) {
      this.timezones = this.allCountry.country_all_timezone

      let autocompleteElm = <HTMLInputElement>document.getElementById('address');

      let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { componentRestrictions: { country: this.allCountry.countrycode } });
      $('.search-address').find("#address").on("focus click keypress", () => {
        $('.search-address').css({ position: "relative" }).append($(".pac-container"));
      });

      this.zone_map.setCenter({ lat: this.cityLatLng[0], lng: this.cityLatLng[1] });

      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        let city_code = null;
        for (const address_component of place.address_components) {
          if (address_component.types[0] == "locality") {
            city_code = address_component;
            city_code = city_code.short_name;
          }
        }

        if (city_code === null) {
          for (const address_component of place.address_components) {
            if (address_component.types[0] == "locality") {
              city_code = address_component;
              city_code = city_code.short_name;
            }
          }
        }

        this.fullCityname = place.formatted_address;

        this.commonForm.patchValue({
          cityLatitude: lat,
          cityLongitude: lng,
        })

        this.location = [lat, lng]
        this.zone_map.setCenter({ lat: lat, lng: lng });
        this.zone_map.setZoom(20)
        this._initZoneMap();
      });
    }
  }

  addNewHub() {
    this.commonForm.patchValue({
      name: this.commonForm.value.name?.toString().trim(),
    })
    let json = {
      type: this._helper.PANEL_TYPE.HUB,
      name: this.commonForm.value.name,
      country: this.country,
      cityid: this.cityId,
      countryid: this.countryId,
      address: this.fullCityname,
      latitude: this.commonForm.value.cityLatitude,
      longitude: this.commonForm.value.cityLongitude,
      kmlzone: this.kmlzone,
    }

    if (this.is_overlaping || !this.isInsidePolygon) {
      return;
    }

    this.commonForm.markAllAsTouched();
    if (this.commonForm.value.cityLatitude) {
      this.zone_overlaping_check();
      this.checkMarkerInsidePolygon();
      this.checkSameLocationAddress();
    }
    if (this.same_hub_location) {
      this._notifiyService.showNotification('error', this._helper.trans.instant("validation-title.hub-already-exists-at-address"));
      return;
    }

    if (this.commonForm.valid) {
      this.hubService.addNewHub(json).then((res_data: any) => {
        if (res_data.success) {
          this.closeModal();
        }
      })
    }
  }

  checkMarkerInsidePolygon() {
    if (this.kmlzone.length > 0) {
      this.isInsidePolygon = this.isPointInsidePolygon(this.kmlzone, this.location);

      if (!this.isInsidePolygon) {
        this._notifiyService.showNotification('error', this._helper.trans.instant('validation-title.area-must-be-around-location'));
      }
    }
  }

  isPointInsidePolygon(polygon: [number, number][], point: [number, number]): boolean {
    const x = point[1];
    const y = point[0];
    let isInside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

      if (intersect) {
        isInside = !isInside;
      }
    }

    return isInside;
  }

  // draw zone poligon
  drawAllHubZone(hubs) {
    let drawMap = this.zone_map;

    hubs.forEach((hub) => {
      let zone = [];
      hub.kmlzone.forEach((kml) => {
        zone.push({ lat: Number(kml[1]), lng: Number(kml[0]) })
      });

      let _ = new google.maps.Polygon({
        map: drawMap,
        paths: zone,
        fillColor: 'black',
        fillOpacity: 0.3,
        strokeWeight: 2,
        clickable: false,
        editable: false,
        zIndex: 1,
        strokeOpacity: 1,
        draggable: false,
        geodesic: true
      });
    })
  }

  // this function check zones are overlap or not
  zone_overlaping_check() {
    this.all_hub_zones = [];
    this.all_hub_zones.push(this.kmlzone);
    this.hubs.forEach((hub) => {
      this.all_hub_zones.push(hub.kmlzone);
    })

    this.is_overlaping = false;
    loop1:
    for (const element of this.all_hub_zones) {

      loop2:
      for (const ele of this.all_hub_zones) {

        if (ele != element) {
          loop3:
          for (let j = 0; j < element?.length; j++) {
            let inside__ = this.insideZoesPoints(element[j], ele);
            if (inside__) {
              this.is_overlaping = true;
              this._notifiyService.showNotification('error', this._helper.trans.instant('validation-title.area-is-overlapping'));
              break loop3;
            }
          }
        }
        if (this.is_overlaping) {
          break loop2;
        }
      }
      if (this.is_overlaping) {
        break loop1;
      }
    }
  }

  insideZoesPoints(point, vs) {
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i][0], yi = vs[i][1];
      let xj = vs[j][0], yj = vs[j][1];

      let intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  checkSameLocationAddress() {
    let location = [this.commonForm.value.cityLatitude, this.commonForm.value.cityLongitude]
    let filter_data = this.hubs.filter((hub) => hub.location[0] == location[0] && hub.location[1] == location[1]);
    if (filter_data.length > 0) {
      this.same_hub_location = true;
    } else {
      this.same_hub_location = false;
    }
  }

}
