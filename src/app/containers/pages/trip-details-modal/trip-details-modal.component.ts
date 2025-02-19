import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RequestService } from 'src/app/services/request.service';
import { DEFAULT_IMAGE, TRIP_STATUS, PROVIDER_STATUS, TRIP_TYPE } from 'src/app/constants/constants';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';
import * as html2pdf from 'html2pdf.js';
import { CountryService } from 'src/app/services/country.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SocketService } from 'src/app/services/sockert.service';
import * as moment from 'moment-timezone';
import { element } from 'protractor';

declare let google;
declare let $;

@Component({
  selector: 'app-trip-details-modal',
  templateUrl: './trip-details-modal.component.html',
  styleUrls: ['./trip-details-modal.component.scss']
})
export class TripDetailsModalComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  refundModelRef: BsModalRef;
  confirmModelRef: BsModalRef;
  confirmEmailModelRef: BsModalRef;
  confirmModelRef_complete: BsModalRef;
  comingModelRef: BsModalRef;
  arriveModelRef: BsModalRef;
  startModelRef: BsModalRef;
  refundModelConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  DEFAULT_IMAGE = DEFAULT_IMAGE.USER_PROFILE;
  TRIP_STATUS = TRIP_STATUS;
  PROVIDER_STATUS = PROVIDER_STATUS;
  TRIP_TYPE = TRIP_TYPE;
  IMAGE_URL = environment.IMAGE_URL;
  chatSubscription: Subscription;
  chats: any = [];
  trip_location: any = [];
  start_trip_location: any;
  end_trip_location: any;
  split_payment_users: any;
  tripdetail: any;
  map: any;
  pickup_marker: any;
  dest_marker: any;
  tripAddress: any;
  sourcelocation: any;
  destlocation: any;
  trip_id: string;
  status: number;
  totalcharge: number;
  totalOtherCharge: number;
  totalTax: number;
  userpayment: number;
  total_split_payment: number;
  selectedPaymentType: number = 1;
  walletAmount: number;
  case_number: number = 0;
  walletSelecteType: boolean = false;
  is_show_total: boolean = true;
  setting_details: any
  latitude: any;
  longitude: any;
  destinationAddress: any
  tollAmount: number
  addressRequired: boolean = false
  invalidAddress: boolean = false
  inputDestination: any;
  socketProviderLocation: any;
  buttonState = '';
  buttonDisabled = false;
  geocoder: any;
  driver_marker: any;
  trippath: any;
  total_distance = 0
  total_time = 0
  is_trips_has_fixed: any
  total_waiting_time = 0
  rejected_provider_detail: any;
  wait_time_interval: NodeJS.Timeout;
  timezone_for_display_date: string = '';
  total_main_user_payment: number;
  total_main_user_cash_payment: number;
  total_main_user_card_payment: number;
  total_main_user_wallet_payment: number;
  total_main_user_remaining_payment: number;

  @Output() trip_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('refundTemplate', { static: true }) refundTemplate: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
  @ViewChild('confirmationTemplate_complete', { static: true }) confirmationTemplate_complete: TemplateRef<any>;
  @ViewChild('comingTripTemplate', { static: true }) comingTripTemplate: TemplateRef<any>;
  @ViewChild('arriveTripTemplate', { static: true }) arriveTripTemplate: TemplateRef<any>;
  @ViewChild('startTripTemplate', { static: true }) startTripTemplate: TemplateRef<any>;
  @ViewChild('confirmationEmail', { static: true }) confirmationEmail: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closemodal();
      })
    }
  }

  constructor(private _socket: SocketService, private settingService: SettingsService, private cdr: ChangeDetectorRef, private modalService: BsModalService, private _requestService: RequestService, public _helper: Helper, private _chatService: ChatService, private countryService: CountryService) { }
  ngOnInit(): void {
    this.geocoder = new google.maps.Geocoder();
  }

  //open modal and get trip data from id
  show(id, status, timezone_for_display_date = null): void {
    if (timezone_for_display_date) {
      this.timezone_for_display_date = timezone_for_display_date;
    } else {
      this._helper.display_date_timezone.subscribe(data => {
        if (data) {
          this.timezone_for_display_date = data;
        }
      })
    }
    setTimeout(() => {
      this.trip_id = id;
      this.status = status;
      this.getTripDetails();
      this.getChatHistory();
      this.modalRef = this.modalService.show(this.template, this.config);
    }, 250);
  }

  async socket(trip_id) {
    let listner = "'" + trip_id + "'"
    this._socket.connectRoom(listner);
    this._socket.listener(listner).subscribe((res: any) => {
      if (res.is_trip_updated) {
        this.getTripDetails(true)
      } else if (res.location && res.location.length > 0) {
        this.trip_location.push({ lat: res.location[0], lng: res.location[1] })
        this.trippath.setPath(this.trip_location);
        this.driver_marker.setPosition(new google.maps.LatLng({ lat: res.location[0], lng: res.location[1] }))
        this.map.panTo(new google.maps.LatLng({ lat: res.location[0], lng: res.location[1] }));
        this.total_distance = res.total_distance
        // this.total_time = res.total_time
      }
    })
  }

  //get trip data
  getTripDetails(from_socket = false) {
    let json: any = { trip_id: this.trip_id }
    this._requestService.getTripDetails(json).then(res => {
      if (res.success) {
        if (res.trip_location_data) {
          res.trip_location_data.startTripToEndTripLocations?.forEach((location) => {
            this.trip_location.push({ lat: location[0], lng: location[1] })
          });
          this.start_trip_location = res.trip_location_data.startTripLocation;
          this.end_trip_location = res.trip_location_data.endTripLocation;
        }
        this.rejected_provider_detail = res.trip_detail[0]
        // this.total_time = res.trip_detail[0].total_time
        if (res.trip_detail[0].trip_status) {
          let stat4 = res.trip_detail[0].trip_status?.find((obj) => obj.status == 4)
          let stat3 = res.trip_detail[0].trip_status?.find((obj) => obj.status == 3)
          let arrived_date
          if (stat3) arrived_date = new Date(stat3?.timestamp)
          else arrived_date = moment(new Date(), "YYYY-MM-DD hh:mm:ss");
          let endDateFormat = moment(new Date(), "YYYY-MM-DD hh:mm:ss");
          this.total_waiting_time = endDateFormat.diff(moment(new Date(arrived_date), "YYYY-MM-DD hh:mm:ss"), 'minutes')
          if (stat3 && !stat4) {
            this.wait_time_interval = setInterval(() => {
              this.total_waiting_time += 1
            }, 60000)
          }
          if (stat4) {
            let difference: any = 0;
            let startDateFormat = moment(new Date(stat4?.timestamp), "YYYY-MM-DD hh:mm:ss");
            difference = endDateFormat.diff(startDateFormat, 'minutes')
            this.total_time = difference
            this.total_waiting_time = startDateFormat.diff(moment(new Date(arrived_date), "YYYY-MM-DD hh:mm:ss"), 'minutes')
            this.wait_time_interval = setInterval(() => {
              this.total_time += 1
            }, 60000)
          }
        }

        this.total_distance = res.trip_detail[0].total_distance
        // this.total_waiting_time = res.trip_detail[0].total_waiting_time
        this.totalcharge = 0;
        this.tripdetail = res.trip_detail[0];

        const tripStatus = res.trip_detail[0].trip_status;
        tripStatus?.sort((a, b) => {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
        this.tripdetail.trip_status = tripStatus;

        this.is_trips_has_fixed = this.tripdetail.is_fixed_fare
        if (this.tripdetail.trip_type == this.TRIP_TYPE.TRIP_TYPE_AIRPORT) {
          this.is_show_total = false;
          this.case_number = 1;
        } else if (this.tripdetail.trip_type == this.TRIP_TYPE.TRIP_TYPE_ZONE) {
          this.is_show_total = false;
          this.case_number = 2;
        } else if (this.tripdetail.trip_type == this.TRIP_TYPE.TRIP_TYPE_CITY) {
          this.is_show_total = false;
          this.case_number = 3;
        } else if (this.tripdetail.is_fixed_fare == 1) {
          this.is_show_total = false;
          this.case_number = 4;
        } else if (this.tripdetail.is_min_fare_used == 1) {
          this.is_show_total = true;
          this.case_number = 5;
        } else {
          this.is_show_total = true;
          this.case_number = 0;
        }
        this.sourcelocation = res.trip_detail[0].sourceLocation;
        this.destlocation = res.trip_detail[0].destinationLocation;
        this.tripAddress = res.trip_detail[0].destination_addresses;

        if (this.status == TRIP_STATUS.COMPLETED) {
          this.totalOtherCharge = this.tripdetail.tip_amount + this.tripdetail.toll_amount;
          this.totalTax = this.tripdetail.user_tax_fee + this.tripdetail.tax_fee + this.tripdetail.user_miscellaneous_fee;
          this.userpayment = this.tripdetail.wallet_payment + this.tripdetail.cash_payment + this.tripdetail.card_payment + this.tripdetail.remaining_payment;
          this.split_payment_users = res.trip_detail[0].split_payment_users;
          if (this.split_payment_users.length > 0) {
            let total_split_payment = 0;
            let total_split_cash_payment = 0;
            let total_split_card_payment = 0;
            let total_split_wallet_payment = 0;
            let total_split_remaining_payment = 0;
            this.split_payment_users.forEach((user) => {
              total_split_payment += user.total;
              if (user.cash_payment > 0) {
                total_split_cash_payment += user.cash_payment;
              }
              if (user.card_payment > 0) {
                total_split_card_payment += user.card_payment;
              }
              if (user.wallet_payment > 0) {
                total_split_wallet_payment += user.wallet_payment;
              }
              if (user.remaining_payment > 0) {
                total_split_remaining_payment += user.remaining_payment;
              }
            })
            this.total_split_payment = total_split_payment;
            this.total_main_user_payment = this.userpayment - this.total_split_payment;
            this.total_main_user_cash_payment = this.tripdetail.cash_payment - total_split_cash_payment;
            this.total_main_user_card_payment = this.tripdetail.card_payment - total_split_card_payment;
            this.total_main_user_wallet_payment = this.tripdetail.wallet_payment - total_split_wallet_payment;
            this.total_main_user_remaining_payment = this.tripdetail.remaining_payment - total_split_remaining_payment;
          }

          if (this.is_show_total && this.case_number == 0) {
            if (this.tripdetail.base_distance_cost > 0) {
              this.totalcharge += Number(this.tripdetail.base_distance_cost);
            }
            if (this.tripdetail.time_cost > 0) {
              this.totalcharge += Number(this.tripdetail.time_cost);
            }
            if (this.tripdetail.distance_cost > 0) {
              this.totalcharge += Number(this.tripdetail.distance_cost);
            }
            if (this.tripdetail.waiting_time_cost > 0) {
              this.totalcharge += Number(this.tripdetail.waiting_time_cost);
            }
            if (this.tripdetail.stop_waiting_time_cost > 0) {
              this.totalcharge += Number(this.tripdetail.stop_waiting_time_cost);
            }
            if (this.tripdetail.surge_fee > 0) {
              this.totalcharge += Number(this.tripdetail.surge_fee);
            }
          }
          if (!this.is_show_total || this.case_number != 0) {
            this.totalcharge = this.tripdetail.total_after_surge_fees;
          }
        }
        if (this.sourcelocation) {
          setTimeout(() => {
            this.setMap();
            if (!from_socket) {
              this.socket(this.trip_id);
            }
          }, 50);
        }
      }
    })
  }

  //get chat history
  getChatHistory() {
    this._chatService.readChat(this.trip_id)
    this.chatSubscription = this._chatService._chatObservable.subscribe((data: any) => {
      if (data) {
        let chats = [];
        Object.keys(data).forEach((element: any) => {
          let newObject = data[element];
          Object.keys(newObject).forEach((ele: any) => {
            chats.push(newObject[ele]);
          })
          this.chats = chats;
        })
      } else {
        this.chats = [];
      }
    })
  }

  setMap() {
    let lat = Number(this.sourcelocation[0]);
    let lng = Number(this.sourcelocation[1]);
    let bounds = new google.maps.LatLngBounds();
    if (lat && lng) {
      let theme = localStorage.getItem('vien-themecolor');
      if (theme.includes('dark')) {
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: { lat, lng },
          draggable: true,
          zoomControl: true,
          scrollwheel: true,
          disableDoubleClickZoom: false,
          fullscreenControl: true,
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
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: { lat, lng },
          draggable: true,
          zoomControl: true,
          scrollwheel: true,
          disableDoubleClickZoom: false,
          fullscreenControl: true
        });
      }

      const icons: Record<string, any> = {
        pickup_location: {
          name: this._helper.trans.instant('label-title.pickup'),
          icon: DEFAULT_IMAGE.PICKUP_ICON,
        },
        destination_location: {
          name: this._helper.trans.instant('label-title.destination'),
          icon: DEFAULT_IMAGE.DESTINATION_ICON,
        },
        stop_location: {
          name: this._helper.trans.instant('label-title.stops'),
          icon: DEFAULT_IMAGE.STOP_ICON,
        },
        driver_location: {
          name: this._helper.trans.instant('label-title.driver'),
          icon: DEFAULT_IMAGE.DRIVER_ICON,
        },
      };

      const legend = document.getElementById("legend");

      for (const key in icons) {
        const type = icons[key];
        const name = type.name;
        const icon = type.icon;
        const div = document.createElement("div");

        div.innerHTML = '<img src="' + icon + '"> ' + name;
        div.classList.add("legend-item"); // Add a class for styling
        legend?.appendChild(div);
      }

      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]?.push(legend);

      if (this.pickup_marker) {
        this.pickup_marker.setMap(null);
        this.pickup_marker = null;
      }

      let pickuplat_lng;
      if (this.status == TRIP_STATUS.COMPLETED) {
        pickuplat_lng = new google.maps.LatLng({ lat: this.start_trip_location[0], lng: this.start_trip_location[1] });
      } else {
        pickuplat_lng = new google.maps.LatLng({ lat: lat, lng: lng });
      }
      if (pickuplat_lng) {
        this.pickup_marker = new google.maps.Marker({
          position: pickuplat_lng,
          map: this.map,
          draggable: false,
          icon: DEFAULT_IMAGE.PICKUP_ICON,
        });
        bounds.extend(this.pickup_marker.position);
      }
      this.trippath = new google.maps.Polyline({
        path: this.trip_location,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      this.trippath.setMap(this.map);
    }

    if (this.tripAddress) {
      let stop_markers = 1;
      this.tripAddress.forEach((address, index) => {
        let location = new google.maps.LatLng(address.location[0], address.location[1]);
        let marker = new google.maps.Marker({
          position: location,
          map: this.map,
          label: {
            text: (stop_markers).toString(),
            fontSize: "16px",
            fontWeight: "bold",
            className: 'marker-position',
          },
          icon: DEFAULT_IMAGE.STOP_ICON
        });
        bounds.extend(marker.position);
        stop_markers++;
      });
    }

    if (this.dest_marker) {
      this.dest_marker.setMap(null);
      this.dest_marker = null;
    }

    let destLatlng;
    if (this.status == TRIP_STATUS.COMPLETED) {
      destLatlng = new google.maps.LatLng({ lat: this.end_trip_location[0], lng: this.end_trip_location[1] });
    } else {
      destLatlng = new google.maps.LatLng(this.destlocation[0], this.destlocation[1]);
    }

    if (this.destlocation.length > 0) {
      this.dest_marker = new google.maps.Marker({
        position: destLatlng,
        map: this.map,
        draggable: false,
        icon: DEFAULT_IMAGE.DESTINATION_ICON,

      });
      bounds.extend(this.dest_marker.position);
    }

    if (this.tripdetail.providerLocation.length > 0) {
      let location = new google.maps.LatLng({ lat: this.tripdetail.providerLocation[0], lng: this.tripdetail.providerLocation[1] });
      this.driver_marker = new google.maps.Marker({
        position: location,
        map: this.map,
        draggable: false,
        icon: DEFAULT_IMAGE.DRIVER_ICON,
      });
      bounds.extend(this.driver_marker.position)
    }
    this.map.fitBounds(bounds);

  }

  // coming trip
  comingTripModel() {
    this.comingModelRef = this.modalService.show(this.comingTripTemplate, this.refundModelConfig);
  }
  confirmComingTrip() {
    let [lat, lng] = this.tripdetail.providerLocation
    this._requestService.setTripStatus({ trip_id: this.trip_id, provider_id: this.tripdetail.confirmed_provider, is_provider_status: PROVIDER_STATUS.COMING, latitude: lat, longitude: lng }).then(res => {
      if (res.success) {
        this.trip_data.emit();
        this.comingModelRef.hide();
        this.tripdetail.is_provider_status = PROVIDER_STATUS.COMING
      }
    })
  }

  // arrive trip
  arriveTripModel() {
    this.arriveModelRef = this.modalService.show(this.arriveTripTemplate, this.refundModelConfig);
  }
  confirmArriveTrip() {
    let [lat, lng] = this.tripdetail.providerLocation
    this._requestService.setTripStatus({ trip_id: this.trip_id, provider_id: this.tripdetail.confirmed_provider, is_provider_status: PROVIDER_STATUS.ARRIVED, latitude: lat, longitude: lng }).then(res => {
      if (res.success) {
        this.trip_data.emit();
        this.arriveModelRef.hide();
        this.tripdetail.is_provider_status = PROVIDER_STATUS.ARRIVED
      }
    })
  }

  // start trip
  startTripModel() {
    this.startModelRef = this.modalService.show(this.startTripTemplate, this.refundModelConfig);
  }
  confirmStartTrip() {
    let [lat, lng] = this.tripdetail.providerLocation
    this._requestService.setTripStatus({ trip_id: this.trip_id, provider_id: this.tripdetail.confirmed_provider, is_provider_status: PROVIDER_STATUS.STARTED, latitude: lat, longitude: lng }).then(res => {
      if (res.success) {
        this.trip_data.emit();
        this.startModelRef.hide();
        this.tripdetail.is_provider_status = PROVIDER_STATUS.STARTED
      }
    })
  }

  //cancel trip modal
  cancelTrip() {
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.refundModelConfig);
  }

  //complete trip modal
  async completeTrip() {
    let json: any = { admin_id: this._helper.user_details._id };
    let { setting_detail } = await this.settingService.getSettingDetails(json)
    this.setting_details = setting_detail[0]
    this.destinationAddress = ""
    this.inputDestination = this.tripdetail.destination_address
    this.destinationAddress = this.tripdetail.destination_address
    this.latitude = this.tripdetail.destinationLocation[0]
    this.longitude = this.tripdetail.destinationLocation[1]
    this.tollAmount = 0
    this.invalidAddress = false
    this.addressRequired = false
    this.confirmModelRef_complete = this.modalService.show(this.confirmationTemplate_complete, this.refundModelConfig);
    this._initAutocomplete()
  }

  async _initAutocomplete() {
    let autocompleteElm = <HTMLInputElement>document.getElementById('address');
    let { countryCode } = await this.countryService.getCountryCode({ country_id: this.tripdetail.country_id })
    let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { types: [], componentRestrictions: { country: countryCode } });
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.destinationAddress = place['formatted_address'];
    });
    $('.search-address').find("#address").on("focus click keypress", () => {
      $('.search-address').css({ position: "relative" }).append($(".pac-container"));
    });
  }

  verifiedGoogleAddress() {
    new google.maps.places.AutocompleteService().getPlacePredictions(
      { input: this.inputDestination, componentRestrictions: { country: 'IND' } },
      (predictions: any[], status: any) => {
        if (status === 'OK' && predictions.length > 0) {
          const placeId = predictions[0].place_id;
          this.geocoder.geocode({ placeId: placeId }, (results: any[], status: any) => {
            if (status === 'OK' && results.length > 0) {
              this.invalidAddress = false
            } else {
              this.inputDestination = ""
              this.invalidAddress = true
            }
          });
        } else {
          this.inputDestination = ""
          this.invalidAddress = true
        }
      }
    );
  }

  //cancel trip
  confirm() {
    if (this.status == this.TRIP_STATUS.SCHEDULED) {
      let json1: any = { trip_id: this.trip_id, type: this.status.toString() }
      this._requestService.scheduledTripCancelByAdmin(json1).then(res => {
        if (res.success) {
          this.trip_data.emit();
          this.closemodal();
          this.cancel();
        }
      })
    } else {
      let json: any = { trip_id: this.trip_id, type: this.status.toString() }
      this._requestService.cancelTrip(json).then(res => {
        if (res.success) {
          this.trip_data.emit();
          this.closemodal();
          this.cancel();
        }
      })
    }
  }

  //compelte trip
  confirm_compelte() {
    if (this.tripdetail.destinationLocation.length == 0 && !this.inputDestination) {
      this.addressRequired = true;
      return this.addressRequired;
    }
    if (this.tripdetail.destinationLocation.length <= 0 && !this.latitude && !this.longitude) {
      this.invalidAddress = true;
      return this.invalidAddress;
    }
    const service = new google.maps.DistanceMatrixService();
    let origin1 = { lat: parseFloat(this.tripdetail.sourceLocation[0]), lng: parseFloat(this.tripdetail.sourceLocation[1]) };
    let destinationB = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
    const request = {
      origins: [origin1],
      destinations: [destinationB],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.MERTRIC,
      avoidHighways: false,
      avoidTolls: false
    };
    let callback = (response, status) => {
      if (status !== 'OK') {
        this.total_time = this.tripdetail.total_time
        this.total_distance = this.tripdetail.total_distance
      } else {
        const rows = response.rows;
        for (const row of rows) {
          const elements = row.elements;
          for (const element of elements) {
            this.total_distance = element.distance.value;
            this.total_time = element.duration.value;
          }
        }
      }
      let json = {
        trip_id: this.trip_id,
        provider_id: this.tripdetail.confirmed_provider,
        toll_amount: this.tollAmount ? +this.tollAmount : 0,
        bearing: 0,
        total_distance: this.total_distance,
        total_time: this.total_time,
        complete_by_admin: true
      }
      if (this.destinationAddress && this.latitude && this.longitude) {
        json['destination_address'] = this.destinationAddress;
        json['latitude'] = this.latitude;
        json['longitude'] = this.longitude;
        json['location'] = [[this.latitude, this.longitude, Date.now()]];
      }
      this._requestService.completeTrip(json).then(async (res) => {
        if (res.success) {
          let json = {
            trip_id: this.trip_id,
            provider_id: this.tripdetail.confirmed_provider,
            tip_amount: 0
          }
          let response = await this._requestService.payTripPayment(json)
          if (response.success) {
            this.trip_data.emit();
            this.closemodal();
            this.cancel_complete_modal();
          }
        }
      })
    }
    service.getDistanceMatrix(request, callback);
  }

  //cancel trip modal close
  cancel() {
    this.confirmModelRef.hide()
  }

  //complete trip modal close
  cancel_complete_modal() {
    this.confirmModelRef_complete.hide()
  }

  closemodal() {
    this.trip_location = [];
    this.trippath = null;
    this._socket.disconnectSocket(`'${this.trip_id}'`)
    setTimeout(() => {
      this.trip_id = "";
      this.is_show_total = true;
      this.case_number = 0;
      this.modalRef?.hide();
      this.trip_id = "";
      this.chatSubscription?.unsubscribe();
      this._chatService?.clearSubscription();
    }, 200);
  }

  ngOnDestroy(): void {
    this.trip_id = "";
    // this.map.setMap(null)
    let listner = "'" + this.trip_id + "'"
    this._socket.disconnetRoom(listner);
    this.chatSubscription?.unsubscribe();
    this._chatService?.clearSubscription();
  }

  // refund trip amount model
  refund() {
    this.modalRef.hide();
    this.refundModelRef = this.modalService.show(this.refundTemplate, this.refundModelConfig);
  }

  // close refund model
  closeRefundModal() {
    this.refundModelRef.hide();
    setTimeout(() => {
      this.selectedPaymentType = 1;
      this.walletAmount = null;
      this.walletSelecteType = false;
      this.trip_id = "";
    }, 1000);
  }

  // payment type wallet / card
  refundPaymentType(paymentType) {
    if (paymentType == 1) {
      this.walletSelecteType = true
    } else {
      let json: any = { trip_id: this.trip_id, type: this.selectedPaymentType }
      this._requestService.refundTripAmount(json).then(res => {
        if (res.success) {
          this.trip_data.emit();
          this.closeRefundModal();
        }
      })
    }
  }

  // wallet amount
  refundWallet() {
    let json: any = { trip_id: this.trip_id, type: this.selectedPaymentType, amount: this.walletAmount }
    this._requestService.refundTripAmount(json).then(res => {
      if (res.success) {
        this.walletAmount = null;
        this.trip_data.emit();
        this.closeRefundModal();
      }
    })
  }

  downloadPdf() {
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    const element = document.getElementById('htmlContent');
    const clonedElement = element.cloneNode(true) as HTMLElement;

    const targetDiv = clonedElement.querySelector('#test_trip');
    const additionalContentElement = document.createElement('div');
    additionalContentElement.innerHTML = `
    <div class="row d-flex flex-row justify-content-start justify-content-around mb-3">
    <div class="text-center ">
    <p class="text-center mb-1" style="font-size: large;font-weight: bold;">Trip ID : `+ this.tripdetail.unique_id + `</p>
    </div>
    </div>
    `;
    // Append the new HTML content to the cloned element
    targetDiv.appendChild(additionalContentElement);

    const date = Math.floor(new Date().getTime() / 1000);

    const options = {

      filename: date + this.tripdetail.invoice_number + '.pdf',
      margin: [10, 20, 10, 20],

    };

    html2pdf().set(options).from(clonedElement).toPdf().save().then(() => {
      this.buttonState = '';
      this.buttonDisabled = false;
    }).catch((error) => {
      console.error('Error generating PDF', error);
    });
  }

  sendMail() {
    this.confirmEmailModelRef = this.modalService.show(this.confirmationEmail, this.refundModelConfig);
    this.modalRef.hide();
  }

  confirmEmail() {
    let json = {
      trip_id: this.tripdetail._id,
      receiverMail: this.tripdetail.user_details.email
    }
    this._requestService.send_invoice_mail(json).then(res => {
      this.confirmEmailModelRef.hide();
    })
  }

}
