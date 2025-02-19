import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CountryService } from '../../../../services/country.service';
import { Subscription } from 'rxjs';
import { CityService } from '../../../../services/city.service';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from "jquery";
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Helper } from 'src/app/shared/helper';
import { SettingsService } from 'src/app/services/settings.service';

declare const google;
declare const jQuery: any;

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  modalRef: BsModalRef
  confirmModelRef: BsModalRef;
  country_subscriber: Subscription
  city_subscriber: Subscription
  city_form: UntypedFormGroup
  radiusRequired: boolean = false;
  is_use_radius: boolean = false;
  zonemap: boolean = false;
  airportmap: boolean = false;
  redmap: boolean = false;
  isPolygon: boolean = false;
  city_radius: any = 0;
  tabType: number;
  countries_list: any = [];
  destination_city_list: any[] = [];
  timezones: any = []
  city_zone: any = []
  airportcity_zone: any = []
  redcity_zone: any = []
  cityLatLong: number[] = [0, 0];
  polygon_array: any[] = [];
  selected_city: any;
  city_radius_circle: any;
  city_radius_drawing_manager: any;
  city_polygon: any;
  add_city_polygon: any;
  delete_zone: any;
  selected_shape: any;
  selected_color: any;
  full_cityname: any;
  city_radius_map: any = '';
  zone_map: any = '';
  drawing_manager: any = '';
  airportzone_map: any = '';
  airportdrawing_manager: any = '';
  redzone_map: any = '';
  reddrawing_manager: any = '';
  colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  }
  is_save_clicked: boolean = false;
  city_boundry_required: boolean = false;

  @Input() addCity = false;
  @Output() cityHandler: EventEmitter<any> = new EventEmitter();
  @ViewChild('deleteZone', { static: true }) deleteZone: TemplateRef<any>;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;

  constructor(public _helper: Helper, private _countryService: CountryService, private _cityService: CityService, private modalService: BsModalService, private _settingService: SettingsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.country_subscriber = this._countryService._countryObservable.subscribe(() => {
      this.getCountryList()
    })
    this.city_subscriber = this._cityService._cityObservable.subscribe(() => {
      setTimeout(() => {
        if (!this.selected_city) {
          if (!this._helper.has_permission(this._helper.PERMISSION.ADD)) {
            this.city_form.disable();
          }
        }
      }, 300);
    })
    this.city_subscriber = this._cityService._citySelect.subscribe(city => {
      if (city) {
        let autocompleteElm = <HTMLInputElement>document.getElementById('cityname');
        google.maps.event.clearInstanceListeners(autocompleteElm);
        this.destination_city.clear()
        this.getDestinationCity(city.countryid, city._id);
        this.selected_city = JSON.parse(JSON.stringify(city))
        this.selected_city.city_lat = this.selected_city.cityLatLong[0]
        this.selected_city.city_lng = this.selected_city.cityLatLong[1]
        this.selected_city.city_id = this.selected_city._id

        this.radiusRequired = false;
        this.city_form.patchValue({
          ...this.selected_city
        })
        if (this.city_form.value.cityname == '' && this.selected_city.full_cityname != '') {
          this.city_form.patchValue({
            cityname: this.selected_city.full_cityname
          })
        }

        this._countryService.fetchCountry().then(res => {
          if (res.success) {
            this.countries_list = res.country_list;
            let country = this.countries_list.filter(x => x._id == this.selected_city.countryid);
            if (country[0] && !country[0].is_auto_transfer) {
              this.city_form.patchValue({ is_provider_earning_set_in_wallet_on_other_payment: false })
              this.city_form.get('is_provider_earning_set_in_wallet_on_other_payment')?.disable()
            } else {
              this.city_form.get('is_provider_earning_set_in_wallet_on_other_payment')?.enable()
            }
          }
        })

        this.is_use_radius = this.selected_city.is_use_city_boundary
        this.city_radius = this.selected_city.cityRadius

        this.selectTab(0)
        this._initMap()
        this.setCenter()
        this.clearMap()
        this.drawRadius()
        // this.drawCityPoligon()

        if(this.selected_city){
          if((this._helper.has_permission(this._helper.PERMISSION.ADD) && !this._helper.has_permission(this._helper.PERMISSION.EDIT)) || (!this._helper.has_permission(this._helper.PERMISSION.ADD) && !this._helper.has_permission(this._helper.PERMISSION.EDIT))){
            this.city_form.disable();
          } else {
            this.city_form.enable();
          }
        }
        this.checkWalletChange();
      } else {
        this.selected_city = undefined;
      }
    })
    this.city_subscriber = this._cityService._addCity.subscribe(city => {
      this.allInitFunction();
      this.drawRadius();
    })
    this.selectTab(0)
    this._initCityForm()
    this.getSettingData();
  }

  changes_cash(event) {
    if ((this.city_form.value.is_payment_mode_cash == 0 || this.city_form.value.is_payment_mode_cash === false) && (this.city_form.value.is_payment_mode_card == 0 || this.city_form.value.is_payment_mode_card === false)) {
      this.city_form.patchValue({ is_payment_mode_card: true })
    }
  }

  changes_card(event) {
    if ((this.city_form.value.is_payment_mode_cash == 0 || this.city_form.value.is_payment_mode_cash === false) && (this.city_form.value.is_payment_mode_card == 0 || this.city_form.value.is_payment_mode_card === false)) {
      this.city_form.patchValue({ is_payment_mode_cash: true })
    }
  }

  selectTab(tabId: number) {
    this.tabType = tabId;
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }

  nextPage() {
    if (this.city_form?.invalid) {
      this.city_form.markAllAsTouched();
      return;
    }
    this.is_save_clicked = false;
    this.city_boundry_required = false;
    this.selectTab(1);
  }

  // airport zone area map init
  airportZoneArea() {
    this._initAirportZoneMap()
    this.zonemap = false;
    this.redmap = false;
    this.airportmap = true;

    this._cityService.fetch_airport({ cityid: this.selected_city._id }).then(res => {
      if (res.success) {
        this.airportcity_zone = res.airport_details
        this.setCenter()
        this.drawCityZone()
      } else {
        this.setCenter()
        this.drawCityZone()
      }
    })
  }

  // city zone area map init
  cityZoneArea() {
    this._initZoneMap()
    this.airportmap = false;
    this.redmap = false;
    this.zonemap = true;

    this._cityService.fetch_cityzone({ cityid: this.selected_city._id }).then(res => {
      if (res.success) {
        this.city_zone = res.cityzone_details
        this.setCenter()
        this.drawCityZone()
      } else {
        this.setCenter()
        this.drawCityZone()
      }
    })
  }

  // red zone area map init
  redZoneArea() {
    this._initRedZoneMap()
    this.zonemap = false;
    this.airportmap = false;
    this.redmap = true;

    this._cityService.fetch_redzone({ cityid: this.selected_city._id }).then(res => {
      if (res.success) {
        this.redcity_zone = res.redzone_details
        this.setCenter()
        this.drawCityZone()
      } else {
        this.setCenter()
        this.drawCityZone()
      }
    })
  }

  //initialize form
  _initCityForm() {
    this.city_form = new UntypedFormGroup({
      countryid: new UntypedFormControl(null, Validators.required),
      cityname: new UntypedFormControl(null, Validators.required),
      citycode: new UntypedFormControl(null),
      city_id: new UntypedFormControl(null),
      city_lat: new UntypedFormControl(null, Validators.required),
      city_lng: new UntypedFormControl(null, Validators.required),
      isBusiness: new UntypedFormControl(true, Validators.required),
      is_payment_mode_cash: new UntypedFormControl(1, Validators.required),
      is_payment_mode_card: new UntypedFormControl(1, Validators.required),
      isPromoApplyForCash: new UntypedFormControl(1, Validators.required),
      isPromoApplyForCard: new UntypedFormControl(1, Validators.required),
      is_check_provider_wallet_amount_for_received_cash_request: new UntypedFormControl(false, Validators.required),
      is_provider_earning_set_in_wallet_on_cash_payment: new UntypedFormControl(true, Validators.required),
      is_provider_earning_set_in_wallet_on_other_payment: new UntypedFormControl(true, Validators.required),
      provider_min_wallet_amount_set_for_received_cash_request: new UntypedFormControl(0),
      is_ask_user_for_fixed_fare: new UntypedFormControl(true, Validators.required),
      airport_business: new UntypedFormControl(1, Validators.required),
      city_business: new UntypedFormControl(1, Validators.required),
      zone_business: new UntypedFormControl(1, Validators.required),
      schedule_business: new UntypedFormControl(1, Validators.required),
      is_provider_initiate_trip: new UntypedFormControl(true, Validators.required),
      open_ride_business: new UntypedFormControl(1, Validators.required),
      timezone: new UntypedFormControl(null, Validators.required),
      unit: new UntypedFormControl(1, Validators.required),
      destination_city: new UntypedFormArray([]),
      city_locations: new UntypedFormControl([])
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
      if (this.selected_city) {
        this.setCenter();
        this.drawRadius()
      }
    })
  }

  // init city map
  _initMap() {
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.city_radius_map = new google.maps.Map(document.getElementById('city_radius_map'), {
        zoom: 10,
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
      this.city_radius_map = new google.maps.Map(document.getElementById('city_radius_map'), {
        zoom: 10,
        streetViewControl: false,
        center: { lat: this.cityLatLong[0], lng: this.cityLatLong[1] }
      });
    }
    if (this.cityLatLong[0] == 0) {
      this.city_radius_map.setZoom(2)
    }
    this._initDrawingManager()
  }

  // draw city map area
  _initDrawingManager() {
    this.city_radius_drawing_manager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        fillColor: 'black',
        fillOpacity: 0.3,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });
    this.city_radius_drawing_manager.setMap(this.city_radius_map);

    google.maps.event.addListener(this.city_radius_drawing_manager, 'overlaycomplete', (polygon) => {
      let shape = polygon.overlay;
      this.add_city_polygon = shape;
      this.city_radius_drawing_manager.setDrawingMode(null);
      this.city_radius_drawing_manager.setOptions({
        drawingControl: false,
      });
      let location_array = []
      shape.getPath().getArray().forEach((location) => {
        location_array.push([location.lng(), location.lat()])
      });

      this.city_form.patchValue({
        city_locations: location_array
      })
      google.maps.event.addListener(shape.getPath(), 'set_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.city_form.patchValue({
          city_locations: location_array
        })
      });
      google.maps.event.addListener(shape.getPath(), 'insert_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.city_form.patchValue({
          city_locations: location_array
        })
      });
      google.maps.event.addListener(shape.getPath(), 'remove_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.city_form.patchValue({
          city_locations: location_array
        })
      });
    });
  }

  // zone map init
  _initZoneMap() {
    let infoWindow = null;
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.zone_map = new google.maps.Map(document.getElementById('zoneMap'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: 0, lng: 0 },
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
      this.zone_map = new google.maps.Map(document.getElementById('zoneMap'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: 0, lng: 0 }
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
        fillColor: 'black',
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
      shape.type = polygon.type;
      shape.index = this.city_zone.length;
      shape.title = 'Polygon ' + (this.city_zone.length + 1);
      this.drawing_manager.setDrawingMode(null);
      let location_array = []
      shape.getPath().getArray().forEach((location) => {
        location_array.push([location.lng(), location.lat()])
      });

      let json = {
        kmlzone: location_array,
        index: this.city_zone.length,
        fill: shape.get('fillColor'),
        title: shape.title
      }
      this.city_zone.push(json);
      this.setSelection(shape);

      let locations = shape.getPath().getArray()
      let submit = this._helper.trans.instant('button-title.submit')
      let html = '<div><input type="text" id="title" name="title"/></div><br>' +
        '<div><input type="color" id="color" name="color"/></div><br>' +
        '<div><button id="submit_title" type="button" style="text-align: center;">' + submit + '</button></div>';

      setTimeout(() => {
        const titleInput = document.getElementById('title');
        let component_this = this;
        titleInput?.addEventListener('keypress', function (event: any) {
          component_this._helper.spaceEventPreventValidation(event);
        });
      }, 500);

      if (infoWindow) {
        infoWindow.close();
      }

      infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(html);
      infoWindow.setPosition(locations[0]);
      infoWindow.open(this.zone_map, shape);
      setTimeout(() => {
        jQuery('#submit_title').on('click', (event, res_data) => {
          if (this.selected_shape) {
            if (jQuery('#title').val().toString().trim() != '') {
              this.selected_shape.set('title', jQuery('#title').val());
              this.city_zone[this.selected_shape.index].title = jQuery('#title').val();
              shape.title = jQuery('#title').val();
            }
            if (jQuery('#color').val() != '') {
              this.makeColorButton(jQuery('#color').val());
              this.selected_shape.set('color', jQuery('#color').val());
              this.city_zone[this.selected_shape.index].fill = jQuery('#color').val();
              shape.fill = jQuery('#color').val();
            }
            infoWindow.close();
          }
        });
      }, 1000);

      google.maps.event.addListener(shape.getPath(), 'set_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.city_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(shape.getPath(), 'insert_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        this.city_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(shape.getPath(), 'remove_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        this.city_zone[this.selected_shape.index].kmlzone = location_array;
      });
    });

    this.buildColorPalette();
  }

  // airport map init
  _initAirportZoneMap() {
    let infoWindow = null;
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.airportzone_map = new google.maps.Map(document.getElementById('airportMap'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: 0, lng: 0 },
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
      this.airportzone_map = new google.maps.Map(document.getElementById('airportMap'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: 0, lng: 0 }
      });
    }
    this.airportdrawing_manager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        fillColor: 'black',
        fillOpacity: 0.3,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });
    this.airportdrawing_manager.setMap(this.airportzone_map);

    google.maps.event.addListener(this.airportdrawing_manager, 'overlaycomplete', (polygon) => {

      let shape = polygon.overlay;
      shape.type = polygon.type;
      shape.index = this.airportcity_zone.length;
      shape.title = 'Polygon ' + (this.airportcity_zone.length + 1);
      this.airportdrawing_manager.setDrawingMode(null);
      let location_array = []
      shape.getPath().getArray().forEach((location) => {
        location_array.push([location.lng(), location.lat()])
      });

      let json = {
        kmlzone: location_array,
        index: this.airportcity_zone.length,
        fill: shape.get('fillColor'),
        title: shape.title
      }
      this.airportcity_zone.push(json);
      this.setSelection(shape);

      let locations = shape.getPath().getArray()
      let submit = this._helper.trans.instant('button-title.submit')
      let html = '<div><input type="text" id="title" name="title"/></div><br>' +
        '<div><input type="color" id="color" name="color"/></div><br>' +
        '<div><button id="submit_title" type="button" style="text-align: center;">' + submit + '</button></div>';

      setTimeout(() => {
        const titleInput = document.getElementById('title');
        let component_this = this;
        titleInput?.addEventListener('keypress', function (event: any) {
          component_this._helper.spaceEventPreventValidation(event);
        });
      }, 500);

      if (infoWindow) {
        infoWindow.close();
      }

      infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(html);
      infoWindow.setPosition(locations[0]);
      infoWindow.open(this.airportzone_map, shape);
      setTimeout(() => {
        jQuery('#submit_title').on('click', (event, res_data) => {
          if (this.selected_shape) {
            if (jQuery('#title').val().toString().trim() != '') {
              this.selected_shape.set('title', jQuery('#title').val());
              this.airportcity_zone[this.selected_shape.index].title = jQuery('#title').val();
              shape.title = jQuery('#title').val();
            }
            if (jQuery('#color').val() != '') {
              this.makeColorButton(jQuery('#color').val());
              this.selected_shape.set('color', jQuery('#color').val());
              this.airportcity_zone[this.selected_shape.index].fill = jQuery('#color').val();
              shape.fill = jQuery('#color').val();
            }
            infoWindow.close();
          }
        });
      }, 1000);

      google.maps.event.addListener(shape.getPath(), 'set_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.airportcity_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(shape.getPath(), 'insert_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        this.airportcity_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(shape.getPath(), 'remove_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        this.airportcity_zone[this.selected_shape.index].kmlzone = location_array;
      });
    });

    this.buildColorPalette();
  }

  // red zone map init
  _initRedZoneMap() {
    let infoWindow = null;
    let theme = localStorage.getItem('vien-themecolor');
    if (theme.includes('dark')) {
      this.redzone_map = new google.maps.Map(document.getElementById('redZoneMap'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: 0, lng: 0 },
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
      this.redzone_map = new google.maps.Map(document.getElementById('redZoneMap'), {
        zoom: 12,
        streetViewControl: false,
        center: { lat: 0, lng: 0 }
      });
    }
    this.reddrawing_manager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        fillColor: 'black',
        fillOpacity: 0.3,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });
    this.reddrawing_manager.setMap(this.redzone_map);

    google.maps.event.addListener(this.reddrawing_manager, 'overlaycomplete', (polygon) => {

      let shape = polygon.overlay;
      shape.type = polygon.type;
      shape.index = this.redcity_zone.length;
      shape.title = 'Polygon ' + (this.redcity_zone.length + 1);
      this.reddrawing_manager.setDrawingMode(null);
      let location_array = []
      shape.getPath().getArray().forEach((location) => {
        location_array.push([location.lng(), location.lat()])
      });

      let json = {
        kmlzone: location_array,
        index: this.redcity_zone.length,
        fill: shape.get('fillColor'),
        title: shape.title
      }
      this.redcity_zone.push(json);
      this.setSelection(shape);

      let locations = shape.getPath().getArray()
      let submit = this._helper.trans.instant('button-title.submit')
      let html = '<div><input type="text" id="title" name="title"/></div><br>' +
        '<div><input type="color" id="color" name="color"/></div><br>' +
        '<div><button id="submit_title" type="button" style="text-align: center;">' + submit + '</button></div>';

      setTimeout(() => {
        const titleInput = document.getElementById('title');
        let component_this = this;
        titleInput?.addEventListener('keypress', function (event: any) {
          component_this._helper.spaceEventPreventValidation(event);
        });
      }, 500);

      if (infoWindow) {
        infoWindow.close();
      }

      infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(html);
      infoWindow.setPosition(locations[0]);
      infoWindow.open(this.redzone_map, shape);
      setTimeout(() => {
        jQuery('#submit_title').on('click', (event, res_data) => {
          if (this.selected_shape) {
            if (jQuery('#title').val().toString().trim() != '') {
              this.selected_shape.set('title', jQuery('#title').val());
              this.redcity_zone[this.selected_shape.index].title = jQuery('#title').val();
              shape.title = jQuery('#title').val();
            }
            if (jQuery('#color').val() != '') {
              this.makeColorButton(jQuery('#color').val());
              this.selected_shape.set('color', jQuery('#color').val());
              this.redcity_zone[this.selected_shape.index].fill = jQuery('#color').val();
              shape.fill = jQuery('#color').val();
            }
            infoWindow.close();
          }
        });
      }, 1000);

      google.maps.event.addListener(shape.getPath(), 'set_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });
        this.redcity_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(shape.getPath(), 'insert_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        this.redcity_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(shape.getPath(), 'remove_at', (event) => {
        let location_array = []
        shape.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        this.redcity_zone[this.selected_shape.index].kmlzone = location_array;
      });
    });

    this.buildColorPalette();
  }

  // get country list
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.countries_list = res.country_list
      } else {
        this.countries_list = []
      }
    })
  }

  // get country wise destination city list
  getDestinationCity(country_Id, city_id) {
    let json: any = { country_id: country_Id, city_id: city_id }
    this._cityService.fetchDestinationCity(json).then(res => {
      if (res.success) {
        this.destination_city_list = res.destination_list;
        this.destination_city_list.forEach(element => {
          this.destination_city.push(new UntypedFormControl(false))
        });
        this.selected_city.destination_city = this.convertedChekboxList(this.destination_city_list, this.selected_city.destination_city)
        this.city_form.patchValue({
          destination_city: this.selected_city.destination_city
        })
        this.is_save_clicked = false;
        this.city_boundry_required = false;
      } else {
        this.destination_city_list = []
      }
    })
  }

  // exist destination city list push in array
  convertedChekboxList(obj, array) {
    let checklist = []
    obj.forEach(destination => {
      let i = array.findIndex(x => x === destination._id);
      if (i < 0) {
        checklist.push(false)
      } else {
        checklist.push(true)
      }
    });
    return checklist
  }

  // some function & parameters ininialize
  allInitFunction() {
    this.city_form.enable();
    this.selected_city = null
    this._initCityForm();
    this._initMap()
    this.getCountryList();
    this.selectTab(0);
    this.is_use_radius = false
    this.city_radius = null;
    this.city_zone = [];
    this.airportcity_zone = [];
    this.redcity_zone = [];
    this.destination_city_list = [];
    this.airportmap = false;
    this.zonemap = false;
    this.redmap = false;
    this.full_cityname = null;
    this._cityService._unselectCity.next({})
  }

  // save city zone data
  saveCityZone() {
    let json: any = { cityid: this.selected_city._id, zone_array: this.city_zone }
    this._cityService.updateCityZone(json).then(res => {
      if (res.success) {
        this.city_zone = [];
        this.cityZoneArea();
      }
    })
  }

  // save airport zone data
  saveAirportZone() {
    let json: any = { cityid: this.selected_city._id, airport_array: this.airportcity_zone }
    this._cityService.updateAirportZone(json).then(res => {
      if (res.success) {
        this.airportcity_zone = [];
        this.airportZoneArea();
      }
    })
  }

  // save red zone data
  saveRedZone() {
    let json: any = { cityid: this.selected_city._id, red_zone_array: this.redcity_zone }
    this._cityService.updateRedZone(json).then(res => {
      if (res.success) {
        this.redcity_zone = [];
        this.redZoneArea();
      }
    })
  }

  // new add & update city
  saveCity() {
    if (this.city_form.invalid) {
      this.is_save_clicked = true;
      this.city_form.markAllAsTouched();
      return;
    }
    if (this.city_form.valid) {
      if (!this.selected_city) {
        if (this.is_use_radius === false && this.city_radius == undefined) {
          this.radiusRequired = true;
          let city_radius = document.getElementById('city_radius');
          city_radius.focus();
          return
        } else {
          this.radiusRequired = false;
        }
        if (this.is_use_radius === true && this.city_form.value.city_locations.length == 0) {
          this.city_boundry_required = true;
          return
        } else {
          this.city_boundry_required = false;
        }
        if (this._helper.has_permission(this._helper.PERMISSION.ADD)) {
          this._cityService.addCity({
            ...this.city_form.getRawValue(),
            cityRadius: this.city_radius,
            is_use_city_boundary: this.is_use_radius,
            full_cityname: this.full_cityname
          }).then(res => {
            if (res.success) {
              if (this.add_city_polygon) {
                this.add_city_polygon?.setMap(null)
                this.city_form.patchValue({
                  city_locations: []
                })
                this.add_city_polygon = null;
              }
              this.cityHandler.emit();
              this.is_save_clicked = false;
            }
          })
        }
      } else {
        if ((this.city_radius == undefined) && (this.tabType == 1) && this.is_use_radius === false) {
          this.radiusRequired = true;
          let city_radius = document.getElementById('city_radius');
          city_radius.focus();
          return
        } else {
          this.radiusRequired = false;
        }
        if (this.is_use_radius === true && this.city_form.value.city_locations.length == 0 && this.tabType == 1) {
          this.city_boundry_required = true;
          return
        } else {
          this.city_boundry_required = false;
        }
        this.convertCheckboxValue()
        if (this._helper.has_permission(this._helper.PERMISSION.EDIT)) {
          this._cityService.updateCity({
            ...this.city_form.value,
            cityRadius: this.city_radius,
            is_use_city_boundary: this.is_use_radius
          }).then(res => {
            if (res.success) {
              this.is_save_clicked = false;
            }
          })
        }
      }
      this.allInitFunction();
    }
  }

  clearPolygon() {
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
  }

  cancel() {
    this.confirmModelRef.hide()
  }

  confirm() {
    this.city_form.patchValue({
      city_locations: []
    })
    let json = {
      city_id: this.selected_city._id,
      city_locations: this.city_form.value.city_locations
    }
    this._cityService.updateCity(json).then(res => {
      this.allInitFunction();
    })
    this.confirmModelRef.hide()
  }

  // true destination city list id push in array
  convertCheckboxValue() {
    let destination_city_list = []
    for (let i = 0; i < this.destination_city_list.length; i++) {
      if (this.city_form.value.destination_city[i] === true) {
        destination_city_list.push(this.destination_city_list[i]._id)
      }
    }
    this.city_form.value.destination_city = destination_city_list
  }

  // country wise time zone
  getCountryTimeZones(country_id) {
    this.city_form.get('is_provider_earning_set_in_wallet_on_other_payment').enable()

    let country = this.countries_list.filter(value => country_id == value._id)

    if (!country[0].is_auto_transfer) {
      this.city_form.patchValue({ is_provider_earning_set_in_wallet_on_other_payment: false })
      this.city_form.get('is_provider_earning_set_in_wallet_on_other_payment')?.disable()
    }
    this.city_form.patchValue({
      citycode: null,
      cityname: null,
      city_lat: null,
      city_lng: null,
      timezone: null
    })
    if (country_id) {
      this.timezones = country[0].country_all_timezone
      if (this.timezones.length == 1) {
        this.city_form.patchValue({
          timezone: this.timezones[0]
        })
      }

      this.city_form.patchValue({ countryid: country_id })

      let autocompleteElm = <HTMLInputElement>document.getElementById('cityname');
      google.maps.event.clearInstanceListeners(autocompleteElm);
      let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { types: ['(cities)'], componentRestrictions: { country: country[0].countrycode } });
      $('.search-address').find("#cityname").on("focus click keypress", () => {
        $('.search-address').css({ position: "relative" }).append($(".pac-container"));
      });
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        let city_code = null;
        for (const address_component of place.address_components) {
          if (address_component.types[0] == "administrative_area_level_1") {
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

        this.full_cityname = place.formatted_address;

        this.city_form.patchValue({
          citycode: city_code,
          cityname: place.name,
          city_lat: lat,
          city_lng: lng,
        })
        this.cdr.detectChanges();
        let json: any = {
          latitude: this.city_form.value.city_lat,
          longitude: this.city_form.value.city_lng,
          cityname: place.name,
          countryid: country_id
        }

        this._cityService.checkCity(json).then((is_success) => {
          if (is_success === false) {
            this.city_form.patchValue({
              citycode: null,
              cityname: null,
              city_lat: null,
              city_lng: null,
              timezone: null
            })
          }
        })
        this.setCenter()
        if (this.city_radius_circle) {
          this.city_radius_circle.setMap(null);
          this.city_radius = null;
        }
        if (this.add_city_polygon) {
          this.add_city_polygon.setMap(null);
          this.city_form.patchValue({
            city_locations: []
          })
          this._initDrawingManager();
        }
      });
    }
  }

  // draw city radius
  drawRadius() {
    this.city_radius_drawing_manager.setDrawingMode(null);
    this.city_radius_drawing_manager.setOptions({
      drawingControl: false,
    });

    // Commented the code below due to an issue where clearing the city polygon and redrawing a new one was causing a problem.
    // The issue was that although the new city polygon was being saved properly but it was not being displayed on the map.
    // The cityLocation array is being set to an empty array (null) here that is related to this problem.
    // if(this.add_city_polygon){
    //   console.log("Here in addd city polygon")
    //   this.add_city_polygon.setMap(null)
    //   this.city_form.patchValue({
    //     city_locations:[]
    //   });
    // }

    let city_lattitude;
    let city_longitude;
    if (this.selected_city) {
      city_lattitude = this.selected_city?.city_lat;
      city_longitude = this.selected_city?.city_lng;
    } else {
      city_lattitude = this.city_form.value.city_lat;
      city_longitude = this.city_form.value.city_lng;
    }

    if (city_lattitude && city_longitude && !this.is_use_radius && this.city_radius > 0) {
      if (this.city_radius_circle) {
        this.city_radius_circle.setMap(null);
      }

      this.city_radius_circle = new google.maps.Circle({
        strokeColor: 'blue',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'blue',
        fillOpacity: 0.35,
        map: this.city_radius_map,
        center: { lat: city_lattitude, lng: city_longitude },
        radius: (this.city_radius * 1000)
      });
    } else if (this.city_radius_circle) {
      this.city_radius_circle.setMap(null);
    }

    if (this.is_use_radius === true) {
      this.drawCityPoligon()
    } else if (this.city_polygon) {
      this.city_polygon.setMap(null)
    } else if (this.add_city_polygon) {
      this.add_city_polygon.setMap(null);
      this.city_form.patchValue({
        city_locations: []
      })
    }

  }

  // draw city poligon
  drawCityPoligon() {
    if (this.is_use_radius === true) {
      if (this.city_form.value.city_locations && this.city_form.value.city_locations.length > 0) {
        this.city_radius_drawing_manager.setDrawingMode(null);
        this.city_radius_drawing_manager.setOptions({
          drawingControl: false,
        });
      } else {
        this._initDrawingManager()
      }

      if (this.city_form.value.city_locations && this.city_form.value.city_locations.length > 0) {
        let array = [];
        this.city_form.value.city_locations.forEach((location) => {
          array.push({ lat: Number(location[1]), lng: Number(location[0]) })
        });

        this.city_polygon = new google.maps.Polygon({
          map: this.city_radius_map,
          paths: array,
          strokeColor: 'blue',
          strokeOpacity: 1,
          strokeWeight: 1.2,
          fillColor: 'blue',
          fillOpacity: 0.3,
          draggable: false,
          geodesic: true,
          editable: true
        });

        if (this.city_form.value.city_locations.length > 0) {
          google.maps.event.addListener(this.city_polygon.getPath(), 'set_at', (event) => {
            let location_array = []
            this.city_polygon.getPath().getArray().forEach((location) => {
              location_array.push([location.lng(), location.lat()])
            });
            this.city_form.patchValue({
              city_locations: location_array
            })
          });
          google.maps.event.addListener(this.city_polygon.getPath(), 'insert_at', (event) => {
            let location_array = []
            this.city_polygon.getPath().getArray().forEach((location) => {
              location_array.push([location.lng(), location.lat()])
            });
            this.city_form.patchValue({
              city_locations: location_array
            })
          });
          google.maps.event.addListener(this.city_polygon.getPath(), 'remove_at', (event) => {
            let location_array = []
            this.city_polygon.getPath().getArray().forEach((location) => {
              location_array.push([location.lng(), location.lat()])
            });
            this.city_form.patchValue({
              city_locations: location_array
            })
          });
        }
      }
    }
  }

  // set (zone or redZone or airport zone) lat $ lag in map
  setCenter() {
    if (this.selected_city) {
      this.city_radius_map.setCenter({ lat: this.selected_city.city_lat, lng: this.selected_city.city_lng });
    } else {
      this.city_radius_map.setCenter({ lat: this.city_form.value.city_lat, lng: this.city_form.value.city_lng });
    }
    if (this.zonemap) {
      this.zone_map.setCenter({ lat: this.selected_city.city_lat, lng: this.selected_city.city_lng });
    }
    if (this.airportmap) {
      this.airportzone_map.setCenter({ lat: this.selected_city.city_lat, lng: this.selected_city.city_lng });
    }
    if (this.redmap) {
      this.redzone_map.setCenter({ lat: this.selected_city.city_lat, lng: this.selected_city.city_lng });
    }
  }

  // radius clear in city map
  clearMap() {
    if (this.city_radius_circle) {
      this.city_radius_circle.setMap(null);
    }
  }

  // draw (zone or redZone or airport zone) poligon
  drawCityZone() {
    this.polygon_array = [];

    let infoWindow = null;
    let allCity_zone: any;
    let drawMap: any;
    if (this.zonemap) {
      allCity_zone = this.city_zone;
      drawMap = this.zone_map;
    }
    if (this.airportmap) {
      allCity_zone = this.airportcity_zone;
      drawMap = this.airportzone_map;
    }
    if (this.redmap) {
      allCity_zone = this.redcity_zone;
      drawMap = this.redzone_map;
    }

    allCity_zone.forEach((city_zone_detail, index) => {

      let zone = [];
      city_zone_detail.kmlzone.forEach((kml) => {
        zone.push({ lat: Number(kml[1]), lng: Number(kml[0]) })
      });

      let polygon2 = new google.maps.Polygon({
        map: drawMap,
        paths: zone,
        strokeColor: city_zone_detail.fill,
        fill: city_zone_detail.fill,
        title: city_zone_detail.title,
        strokeOpacity: 1,
        strokeWeight: 1.2,
        fillColor: city_zone_detail.fill,
        fillOpacity: 0.3,
        draggable: false,
        geodesic: true
      });

      if (!this.polygon_array.some(item => item._id === city_zone_detail._id)) {
        this.polygon_array.push({ polygon2: polygon2, _id: city_zone_detail._id });
      }

      let shape: any = polygon2
      shape.index = index;

      google.maps.event.addListener(polygon2.getPath(), 'set_at', (event) => {
        let location_array = []
        polygon2.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        allCity_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(polygon2.getPath(), 'insert_at', (event) => {
        let location_array = []
        polygon2.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        allCity_zone[this.selected_shape.index].kmlzone = location_array;
      });
      google.maps.event.addListener(polygon2.getPath(), 'remove_at', (event) => {
        let location_array = []
        polygon2.getPath().getArray().forEach((location) => {
          location_array.push([location.lng(), location.lat()])
        });

        allCity_zone[this.selected_shape.index].kmlzone = location_array;
      });

      google.maps.event.addListener(shape, 'click', (e) => {
        let html;
        if (infoWindow) {
          infoWindow.close();
          html = null;
        }

        this.setSelection(shape);
        let update = this._helper.trans.instant('button-title.update')
        let locations = shape.getPath().getArray()
        html = '<div><input type="text" id="edit_titles" name="title" value="' + city_zone_detail.title + '" /></div><br>' +
          '<div><input type="color" id="edit_colors" name="color" value="' + city_zone_detail.fill + '"/></div><br>' +
          '<div><button id="update_title" type="button" style="text-align: center;">' + update + '</button></div>'

        setTimeout(() => {
          const titleInput = document.getElementById('edit_titles');
          let component_this = this;
          titleInput?.addEventListener('keypress', function (event: any) {
            component_this._helper.spaceEventPreventValidation(event);
          });
        }, 500);

        infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(html);
        infoWindow.setPosition(locations[0]);
        infoWindow.open(drawMap, shape);
        jQuery('#edit_titles').val(shape.title);
        jQuery('#edit_colors').val(shape.fill);

        setTimeout(() => {
          jQuery('#update_title').on('click', (event, res_data) => {
            if (this.selected_shape) {
              if (jQuery('#edit_colors').val() != '') {
                this.makeColorButton(jQuery('#edit_colors').val())
                this.selected_shape.set('color', jQuery('#edit_colors').val());
                allCity_zone[this.selected_shape.index].fill = jQuery('#edit_colors').val();
                shape.fill = jQuery('#edit_colors').val();
              }
              if (jQuery('#edit_titles').val().toString().trim() != '') {
                this.selected_shape.set('title', jQuery('#edit_titles').val());
                allCity_zone[this.selected_shape.index].title = jQuery('#edit_titles').val();
                shape.title = jQuery('#edit_titles').val();
              }
              infoWindow.close();
              html = null;
            }
          });
        }, 1000);
      });
    });
  }

  buildColorPalette() {
    this.selectColor(this.colors[0]);
  }

  setSelection(shape) {
    this.clearSelection();
    shape.setEditable(true);
    this.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
    this.selected_shape = shape;
  }

  clearSelection() {
    if (this.selected_shape) {
      this.selected_shape.setEditable(false);
      this.selected_shape = null;
    }
  }

  selectColor(color) {
    let polygonOptions: any;
    if (this.zonemap) {
      this.selected_color = color;
      polygonOptions = this.drawing_manager.get('polygonOptions');
      polygonOptions.fillColor = color;
      polygonOptions.strokeColor = color;
      this.drawing_manager.set('polygonOptions', polygonOptions);
    }
    if (this.airportmap) {
      this.selected_color = color;
      polygonOptions = this.airportdrawing_manager.get('polygonOptions');
      polygonOptions.fillColor = color;
      polygonOptions.strokeColor = color;
      this.airportdrawing_manager.set('polygonOptions', polygonOptions);
    }
    if (this.redmap) {
      this.selected_color = color;
      polygonOptions = this.reddrawing_manager.get('polygonOptions');
      polygonOptions.fillColor = color;
      polygonOptions.strokeColor = color;
      this.reddrawing_manager.set('polygonOptions', polygonOptions);
    }
  }

  setSelectedShapeColor(color) {
    if (this.selected_shape) {
      this.selected_shape.set('strokeColor', color);
      this.selected_shape.set('fillColor', color);
      if (this.zonemap) {
        this.city_zone[this.selected_shape.index].fill = color;
      }
      if (this.airportmap) {
        this.airportcity_zone[this.selected_shape.index].fill = color;
      }
      if (this.redmap) {
        this.redcity_zone[this.selected_shape.index].fill = color;
      }
    }
  }

  makeColorButton(color) {
    this.selectColor(color);
    this.setSelectedShapeColor(color);
  }

  get destination_city() {
    return this.city_form.get('destination_city') as UntypedFormArray;
  }

  deleteZoneConfirm(zone) {
    this.delete_zone = zone
    this.modalRef = this.modalService.show(this.deleteZone)
  }

  // zone delete
  deleteZoneArea(zone_id) {
    let arr = [];
    arr.push(zone_id);
    if (this.zonemap) {
      let json: any = { cityid: this.selected_city._id, deleted_zone: arr }
      this._cityService.updateCityZone(json).then(res => {
        if (res.success) {
          arr = null
          this.modalRef.hide();
          this.cityZoneArea();
        }
      })
    } else if (this.airportmap) {
      let json: any = { cityid: this.selected_city._id, deleted_airport: arr }
      this._cityService.updateAirportZone(json).then(res => {
        if (res.success) {
          arr = null
          this.modalRef.hide();
          this.airportZoneArea();
        }
      })
    } else if (this.redmap) {
      let json: any = { cityid: this.selected_city._id, deleted_red_zone: arr }
      this._cityService.updateRedZone(json).then(res => {
        if (res.success) {
          arr = null
          this.modalRef.hide();
          this.redZoneArea();
        }
      })
    }
  }

  setZoneCenter(zone, type) {
    let map: any = null;

    if (type == 1) {
      map = this.airportzone_map;
    } else if (type == 2) {
      map = this.zone_map;
    } else if (type == 3) {
      map = this.redzone_map;
    }

    let polygon = this.polygon_array.filter(x => x._id == zone._id)
    let polygon2 = polygon[0].polygon2;
    google.maps.event.trigger(polygon2, 'click');

    const bounds = new google.maps.LatLngBounds();
    polygon2.getPath().forEach((latLng) => {
      bounds.extend(latLng);
    });

    // Fit the map to the polygon bounds
    map.fitBounds(bounds);
  }

  checkWalletChange() {
    if (this.city_form.value.is_check_provider_wallet_amount_for_received_cash_request === true) {
      this.city_form.get('provider_min_wallet_amount_set_for_received_cash_request').setValidators([Validators.min(0), Validators.required])
    } else {
      this.city_form.get('provider_min_wallet_amount_set_for_received_cash_request').setValidators([])
      if (!this.city_form.value.provider_min_wallet_amount_set_for_received_cash_request) {
        this.city_form.patchValue({ provider_min_wallet_amount_set_for_received_cash_request: 0 })
      }
    }
  }

  ngOnDestroy() {
    this.country_subscriber.unsubscribe()
    this.city_subscriber.unsubscribe()
  }

}
