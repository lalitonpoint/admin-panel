import { EXPORT_HISTORY_REQUEST_TYPE, PANEL_NAME, PANEL_TYPE } from '../../../constants/constants';
import { CommonService } from 'src/app/services/common.service';
import { Helper } from '../../../shared/helper';
import { DispatcherService } from '../../../services/dispatcher.service';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CountryService } from 'src/app/services/country.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import * as $ from "jquery";
import { HubService } from 'src/app/services/hub.service';

declare const google: any;

@Component({
    selector: 'app-edit-hub-model',
    templateUrl: './edit-hub-model.component.html',
    styleUrls: ['./edit-hub-model.component.scss']
})
export class EditHubModelComponent implements OnInit {
    modalRef: BsModalRef;
    country_code_modal: BsModalRef;
    confirmModelRef: BsModalRef;
    userDeleteConfirmModelRef: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right'
    };
    confirmationModalConfig = {
        backdrop: true,
        ignoreBackdropClick: true,
    }
    hotelSettingForm: UntypedFormGroup;
    vehicleAssignForm: UntypedFormGroup;
    addUserForm: UntypedFormGroup;
    updateUserForm: UntypedFormGroup;
    form_data: FormData;
    PANEL_NAME = PANEL_NAME;
    PANEL_TYPE = PANEL_TYPE;
    EXPORT_HISTORY_REQUEST_TYPE = EXPORT_HISTORY_REQUEST_TYPE;
    updateParameters = {};
    requestList: any;
    listData: any;
    hotel_id: string;
    type: string;
    selectedVehicle: any;
    vehicle_list: any[] = [];
    hub_vehicle_list: any[] = [];
    hub_providers: any[] = [];
    countries: any[] = [];
    hub_users: any[] = [];
    addNewUser: boolean = false;
    SearchText: any;
    isCollapsed: boolean = false;
    tab_number: number;
    polygon_array: any[] = [];
    zone_map: any = '';
    drawing_manager: any = '';
    kmlzone: any = [];
    location: any = [];
    selected_user: any;
    pickup_marker: any;
    isInsidePolygon: boolean = true;
    is_overlaping: boolean = false;
    all_hub_zones: any[] = [];
    hubs: any[] = [];
    same_hub_location: boolean = false;
    timezone_for_display_date: string = '';
    hub_users_permissions: any;
    first_name_error: boolean = false;
    last_name_error: boolean = false;

    @ViewChild('template', { static: true }) template: TemplateRef<any>;
    @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
    @ViewChild('userDeleteConfirmationTemplate', { static: true }) userDeleteConfirmationTemplate: TemplateRef<any>;

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Escape' || event.code === 'Escape') {
            this.modalRef?.onHidden.subscribe(() => {
                this.closeModal();
            })
        }
    }

    constructor(private modalService: BsModalService, private _fb: UntypedFormBuilder, private dispatcherService: DispatcherService, public _helper: Helper, private commonService: CommonService, private _countryService: CountryService, private _notifiyService: NotifiyService, private _hubService: HubService) { }


    ngOnInit(): void {
        this._helper.display_date_timezone.subscribe(data => {
            this.timezone_for_display_date = data;
        })
    }

    show(id, type): void {
        this.first_name_error = false;
        this.last_name_error = false;
        this.__initForm();
        this.selectedTab(1);
        this.modalRef = this.modalService.show(this.template, this.config);
        if (id != '') {
            this.updateParameters['_id'] = id;
            this.updateParameters['type'] = type;
            this.hotel_id = id;
            this.type = type;
            this.commonService.fetchUpdateData(this.updateParameters).then((res_data: any) => {
                this.requestList = res_data;
                this.listData = res_data.type_detail[0];
                this.location = this.listData.location;
                this.__patchValue();
                this._initZoneMap();
                if (this.listData.kmlzone.length > 0) {
                    this.drawCityZone();
                }
            })

        }
        if (!this._helper.has_permission(this._helper.PERMISSION.EDIT)) {
            this.hotelSettingForm.disable();
            this.updateUserForm.disable();
        }
    }

    __initForm() {
        this.hotelSettingForm = this._fb.group({
            name: new UntypedFormControl('', [Validators.required]),
            city: new UntypedFormControl(''),
            country: new UntypedFormControl(''),
            address: new UntypedFormControl(null, [Validators.required]),
            latitude: new UntypedFormControl(null, [Validators.required]),
            longitude: new UntypedFormControl(null, [Validators.required]),
        })

        this.vehicleAssignForm = new UntypedFormGroup({
            vehicle: new UntypedFormControl('', [Validators.required]),
        })

        this.addUserForm = new UntypedFormGroup({
            first_name: new UntypedFormControl('', [Validators.required]),
            last_name: new UntypedFormControl('', [Validators.required]),
            country_phone_code: new UntypedFormControl('', [Validators.required]),
            phone: new UntypedFormControl('', [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
            email: new UntypedFormControl('', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),]),
            password: new UntypedFormControl('', [Validators.required]),
        })

        this.updateUserForm = new UntypedFormGroup({
            first_name: new UntypedFormControl('', [Validators.required]),
            last_name: new UntypedFormControl('', [Validators.required]),
            country_phone_code: new UntypedFormControl('', [Validators.required]),
            phone: new UntypedFormControl('', [Validators.required]),
            email: new UntypedFormControl('', [Validators.required]),
            password: new UntypedFormControl('', [Validators.minLength(6)]),
        })
    }

    __patchValue() {
        this.hotelSettingForm.patchValue({
            name: this.listData.name,
            city: this.listData.city,
            country: this.listData.country,
            address: this.listData.address,
            latitude: this.listData.location[0],
            longitude: this.listData.location[1],
        })
        setTimeout(() => {
            this._initAutocomplete();
        }, 500);
    }

    updateHotel() {
        this.hotelSettingForm.patchValue({
            name: this.hotelSettingForm.value.name?.toString().trim(),
        })
        if (this.hotelSettingForm.value.latitude) {
            this.checkMarkerInsidePolygon();
            this.zone_overlaping_check();
            this.checkSameLocationAddress();
        }
        if (this.is_overlaping || !this.isInsidePolygon) {
            return;
        }
        if (this.same_hub_location) {
            this._notifiyService.showNotification('error', this._helper.trans.instant("validation-title.hub-already-exists-at-address"));
            return;
        }

        this.hotelSettingForm.markAllAsTouched();
        if (this.hotelSettingForm.valid) {
            let json: any = { update_id: this.hotel_id, type: this.type, ...this.hotelSettingForm.value, cityid: this.listData.city_id, countryid: this.listData.country_id, kmlzone: this.listData.kmlzone };
            this.commonService.updateItemByType(json).then((res_data: any) => {
                if (res_data.success) {
                    this.closeModal();
                }
            })
        }
    }

    getHistory() {
        let historyData = {
            _id: this.hotel_id,
            type: this.PANEL_TYPE.HUB,
            type_name: this.PANEL_NAME.HUB,
            name: this.listData.name,
            export_request_type: this.EXPORT_HISTORY_REQUEST_TYPE.HUB
        }
        localStorage.setItem("historyData", JSON.stringify(historyData))
        this.modalRef.hide();
        this._helper._route.navigate(['/app/users/hub/history'])
    }

    _initAutocomplete() {
        let autocompleteElm = <HTMLInputElement>document.getElementById('address');
        let autocomplete = new google.maps.places.Autocomplete((autocompleteElm));
        $('.search-address').find("#address").on("focus click keypress", () => {
            $('.search-address').css({ position: "relative" }).append($(".pac-container"));
        });
        autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
            let lat = place.geometry.location.lat();
            let lng = place.geometry.location.lng();

            this.hotelSettingForm.patchValue({
                latitude: lat,
                longitude: lng,
                address: place.formatted_address
            })
            this.location = [lat, lng];
            this._initZoneMap();
            if (this.listData.kmlzone.length > 0) {
                this.drawCityZone();
            }
        });
    }

    async _initZoneMap() {
        let theme = localStorage.getItem('vien-themecolor');
        if (theme.includes('dark')) {
            this.zone_map = new google.maps.Map(document.getElementById('zone_map'), {
                zoom: 10,
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
                zoom: 10,
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

        let hub_list_json: any = { city_id: this.listData.city_id }
        await this._hubService.getAllHubList(hub_list_json).then((response) => {
            if (response.success) {
                let hubs = response.hubs.filter(hub => hub._id != this.hotel_id)
                this.hubs = hubs;
                this.drawAllHubZone(this.hubs);
            }
        })

        if (this.hotelSettingForm?.value.address) {
            if (this.pickup_marker) {
                this.pickup_marker.setMap(null);
                this.pickup_marker = null;
            }

            let pickuplat_lng = new google.maps.LatLng({ lat: this.location[0], lng: this.location[1] });
            this.pickup_marker = new google.maps.Marker({
                position: pickuplat_lng,
                map: this.zone_map,
                draggable: false,
                icon: this._helper.DEFAULT_IMAGE.DRIVER_ICON,
            });

            this.checkMarkerInsidePolygon();
        }

        if (this.listData.kmlzone.length > 0) {
            this.drawing_manager.setOptions({
                drawingControl: false,
            });
            return
        }
        this.drawing_manager.setMap(this.zone_map);

        google.maps.event.addListener(this.drawing_manager, 'overlaycomplete', (polygon) => {

            let shape = polygon.overlay;
            this.drawing_manager.setDrawingMode(null);
            let location_array = []
            shape.getPath().getArray().forEach((location) => {
                location_array.push([location.lng(), location.lat()])
            });
            this.listData.kmlzone = location_array
            this.checkMarkerInsidePolygon();
            this.zone_overlaping_check();
            google.maps.event.addListener(shape.getPath(), 'set_at', (event) => {
                let location_array = []
                shape.getPath().getArray().forEach((location) => {
                    location_array.push([location.lng(), location.lat()])
                });
                this.listData.kmlzone = location_array;
                this.checkMarkerInsidePolygon();
                this.zone_overlaping_check();
            });
            google.maps.event.addListener(shape.getPath(), 'insert_at', (event) => {
                let location_array = []
                shape.getPath().getArray().forEach((location) => {
                    location_array.push([location.lng(), location.lat()])
                });
                this.listData.kmlzone = location_array;
                this.checkMarkerInsidePolygon();
                this.zone_overlaping_check();
            });

            google.maps.event.addListener(shape.getPath(), 'remove_at', (event) => {
                let location_array = []
                shape.getPath().getArray().forEach((location) => {
                    location_array.push([location.lng(), location.lat()])
                });
                this.listData.kmlzone = location_array;
                this.checkMarkerInsidePolygon();
                this.zone_overlaping_check();
            });

            if (this.listData.kmlzone.length > 0) {
                this.drawing_manager.setOptions({
                    drawingControl: false,
                });
            }

        });
    }

    // draw zone poligon
    drawCityZone() {
        this.polygon_array = [];
        let drawMap = this.zone_map;

        let zone = [];
        this.listData.kmlzone.forEach((kml) => {
            zone.push({ lat: Number(kml[1]), lng: Number(kml[0]) })
        });

        let polygon2 = new google.maps.Polygon({
            map: drawMap,
            paths: zone,
            fillColor: 'green',
            strokeColor: 'green',
            fillOpacity: 0.3,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            zIndex: 1,
            strokeOpacity: 1,
            draggable: false,
            geodesic: true
        });

        this.polygon_array.push({ polygon2: polygon2, _id: this.listData._id });

        google.maps.event.addListener(polygon2.getPath(), 'set_at', (event) => {
            let location_array = []
            polygon2.getPath().getArray().forEach((location) => {
                location_array.push([location.lng(), location.lat()])
            });

            this.listData.kmlzone = location_array;
            this.checkMarkerInsidePolygon();
            this.zone_overlaping_check();
        });
        google.maps.event.addListener(polygon2.getPath(), 'insert_at', (event) => {
            let location_array = []
            polygon2.getPath().getArray().forEach((location) => {
                location_array.push([location.lng(), location.lat()])
            });

            this.listData.kmlzone = location_array;
            this.checkMarkerInsidePolygon();
            this.zone_overlaping_check();
        });
        google.maps.event.addListener(polygon2.getPath(), 'remove_at', (event) => {
            let location_array = []
            polygon2.getPath().getArray().forEach((location) => {
                location_array.push([location.lng(), location.lat()])
            });

            this.listData.kmlzone = location_array;
            this.checkMarkerInsidePolygon();
            this.zone_overlaping_check();
        });

        let bounds = new google.maps.LatLngBounds();
        // Iterate through the KML array and extend the bounds

        for (const point of this.listData.kmlzone) {
            bounds.extend(new google.maps.LatLng({ lat: point[1], lng: point[0] }));
        }

        // Fit the map bounds to the calculated bounds
        this.zone_map.fitBounds(bounds);
    }

    selectedTab(tab_number: number) {
        this.tab_number = tab_number;
        this.addNewUser = false;
        this.isCollapsed = false;
        if (tab_number == 2) {
            this.addUserForm.reset();
            this.getHubUsers();
            this.getCountryList();
            this.addUserForm.patchValue({
                country_phone_code: this.listData.country_phone_code
            })
        }
        if (tab_number == 3) {
            this.vehicleAssignForm.reset();
            this.fetchAvailableAdminVehicles();
            this.fetchHubVehicles();
        }
        if (tab_number == 4) {
            this.getHubProviders();
        }
    }

    fetchAvailableAdminVehicles() {
        let json: any = { user_type_id: null, country_id: this.listData.country_id }
        this._hubService.fetchAdminVehicles(json).then((response: any) => {
            if (response?.success) {
                this.vehicle_list = response.vehicles;
                if (this.vehicle_list.length > 0) {
                    this.vehicleAssignForm.patchValue({
                        vehicle: this.vehicle_list[0]._id
                    })
                }
            }
        })
    }

    fetchHubVehicles() {
        let json: any = { user_type_id: this.updateParameters['_id'], country_id: this.listData.country_id }
        this._hubService.fetchAdminVehicles(json).then((response: any) => {
            if (response?.success) {
                this.hub_vehicle_list = response.vehicles;
            }
        })
    }

    AssignVehicle(type, vehicle_id = null) {//type 1:Assign 0:remove
        if (type == this._helper.ASSIGN_TYPE.ASSIGN) {
            if (this.vehicleAssignForm.invalid) {
                this.vehicleAssignForm.markAllAsTouched();
                return
            }
            vehicle_id = this.vehicleAssignForm.value.vehicle;
        }
        let json: any = { hub_id: this.updateParameters['_id'], vehicle_id: vehicle_id, state: type }
        this._hubService.assignUnassignVehicleToHub(json).then((response: any) => {
            if (response?.success) {
                this.vehicleAssignForm.reset();
                this.fetchAvailableAdminVehicles();
                this.fetchHubVehicles();
                if (this.confirmModelRef) {
                    this.cancel();
                }
            }
        })
    }

    removeVehicle(vehicle) {
        this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
        this.selectedVehicle = vehicle;
    }

    cancel() {
        this.confirmModelRef.hide();
    }

    getHubProviders() {
        let json: any = { hub_id: this.updateParameters['_id'] }
        this._hubService.getHubProviders(json).then((response: any) => {
            if (response?.success) {
                this.hub_providers = response.providers;
            }
        })
    }

    //add new user
    newUser(add) {
        this.first_name_error = false;
        this.last_name_error = false;
        if (add == 'add') {
            this.addUserForm.patchValue({
                country_phone_code: this.listData.country_phone_code
            })
            this.addNewUser = true;
            this.isCollapsed = false;
            if (this.hub_users?.length > 0) {
                this.hub_users.forEach((user) => {
                    if (user.is_edit) {
                        user.is_edit = false;
                    }
                })
            }
        } else {
            this.addNewUser = false;
            setTimeout(() => {
                this.addUserForm.reset();
            }, 500);
        }
    }

    openPhoneCodeModal(openPhoneCode: TemplateRef<any>): void {
        setTimeout(() => {
            let search_country = document.getElementById('search-country');
            search_country.focus();
        }, 500);
        this.country_code_modal = this.modalService.show(openPhoneCode, { class: 'custom-modal-sm modal-dialog-custom ' });
    }

    countryPhoneCode(country) {
        this.addUserForm.patchValue({
            country_phone_code: country.code
        })
        this.country_code_modal.hide();
        this.SearchText = '';
    }

    getCountryList() {
        this._countryService.getAllCountry().then((response: any) => {
            if (response?.success) {
                this.countries = response.country_list;
            }
        })
    }

    getHubUsers() {
        let json: any = { hub_id: this.updateParameters['_id'] }
        this._hubService.getHubUsers(json).then((response: any) => {
            if (response?.success) {
                this.hub_users_permissions = response;
                this.hub_users = response.users;
                if (this.hub_users_permissions?.is_show_email !== false) {
                    this.updateUserForm.controls['email'].setValidators([Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),])
                } else {
                    this.updateUserForm.get('email').disable();
                }
                if (this.hub_users_permissions?.is_show_phone !== false) {
                    this.updateUserForm.controls['phone'].setValidators([Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)])
                } else {
                    this.updateUserForm.get('phone').disable();
                    this.updateUserForm.get('country_phone_code').disable();
                }
                this.updateUserForm.patchValue({
                    password: ""
                })
            }
        })
    }

    // save new user data
    saveNewUser() {
        if (this.first_name_error || this.last_name_error) {
            if (this.first_name_error) {
                document.getElementById('first_name')?.focus();
            } else if (!this.first_name_error && this.last_name_error) {
                document.getElementById('last_name')?.focus();
            }
            return;
        }
        this.addUserForm.patchValue({
            first_name: this.addUserForm.value.first_name?.toString().trim(),
            last_name: this.addUserForm.value.last_name?.toString().trim(),
            email: this.addUserForm.value.email?.toString().trim(),
            password: this.addUserForm.value.password?.toString().trim(),
        })
        if (this.addUserForm.invalid) {
            this.addUserForm.markAllAsTouched();
            return;
        }
        let json: any = { hub_id: this.updateParameters['_id'], ...this.addUserForm.value };
        this._hubService.addHubUser(json).then((response: any) => {
            if (response?.success) {
                this.addNewUser = false;
                this.addUserForm.reset();
                this.getHubUsers();
            }
        })
    }

    closeModal() {
        this.modalRef?.hide();
        this.addNewUser = false;
        this.isCollapsed = false;
        this.all_hub_zones = [];
        this.is_overlaping = false;
        this.isInsidePolygon = true;
        this.same_hub_location = false;
    }

    editUser(user) {
        this.first_name_error = false;
        this.last_name_error = false;
        user.is_edit = !user.is_edit
        this.isCollapsed = !this.isCollapsed;
        this.updateUserForm.patchValue({
            first_name: user.first_name,
            last_name: user.last_name,
            country_phone_code: user.country_phone_code,
            phone: user.phone,
            email: user.email,
        })
    }

    // save new user data
    updateUser(user) {
        if (this.first_name_error || this.last_name_error) {
            if (this.first_name_error) {
                document.getElementById('first_name')?.focus();
            } else if (!this.first_name_error && this.last_name_error) {
                document.getElementById('last_name')?.focus();
            }
            return;
        }
        this.updateUserForm.patchValue({
            first_name: this.updateUserForm.value.first_name?.toString().trim(),
            last_name: this.updateUserForm.value.last_name?.toString().trim(),
            email: this.updateUserForm.value.email?.toString().trim(),
            password: this.updateUserForm.value.password?.toString().trim(),
        })
        if (this.updateUserForm.invalid) {
            this.updateUserForm.markAllAsTouched();
            return;
        }
        let json: any = { hub_id: this.updateParameters['_id'], user_id: user._id, ...this.updateUserForm.value };
        this._hubService.updateHubUser(json).then((response: any) => {
            if (response?.success) {
                this.updateUserForm.reset();
                user.is_edit = false;
                this.isCollapsed = false;
                this.getHubUsers();
            }
        })
    }

    openDeleteUserModal(user) {
        this.selected_user = user;
        this.userDeleteConfirmModelRef = this.modalService.show(this.userDeleteConfirmationTemplate, this.confirmationModalConfig);
    }

    cancelUserDeleteModal() {
        this.userDeleteConfirmModelRef?.hide();
    }

    DeleteHubUser(user) {
        let json: any = { user_id: user._id };
        this._hubService.deleteHubUser(json).then((response: any) => {
            if (response.success) {
                this.cancelUserDeleteModal();
                this.getHubUsers();
                this.isCollapsed = false;
            }
        })
    }

    checkMarkerInsidePolygon() {
        if (this.listData.kmlzone.length > 0) {
            this.isInsidePolygon = this.isPointInsidePolygon(this.listData.kmlzone, this.location);

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
        this.all_hub_zones.push(this.listData.kmlzone);
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
        let location = [this.hotelSettingForm.value.latitude, this.hotelSettingForm.value.longitude]
        let filter_data = this.hubs.filter((hub) => hub.location[0] == location[0] && hub.location[1] == location[1]);
        if (filter_data.length > 0) {
            this.same_hub_location = true;
        } else {
            this.same_hub_location = false;
        }
    }

    checkCharacterLimitvalidation(value, type) {
        if (type == this._helper.NAME_TYPE.FIRST_NAME) {
            this.first_name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_first_name_character_limit);
        }
        if (type == this._helper.NAME_TYPE.LAST_NAME) {
            this.last_name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_last_name_character_limit);
        }
    }

}
