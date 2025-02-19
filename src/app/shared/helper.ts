import { ASSIGN_TYPE, BRAND, DRIVER_APPROVE_TYPE, NAME_TYPE, OPEN_HISTORY_TYPE, PANEL_TYPE, PDFSIZE, REDIRECT_PERMISSION, REDIRECT_PERMISSION_TYPE, RENTAL_TRIP_STATUS_TIMELIME_STRING, SERVICE_PRICE_TYPE, VEHICLE_HISTORY_TYPE, VEHICLE_HISTORY_TYPE_STRING } from './../constants/constants';
import { Injectable, NgZone, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DATE_FORMAT, DEFAULT_IMAGE, PER_PAGE_LIST, USERS_PER_PAGE_LIST, PERMISSION, REQUEST_TYPE, CREATED_BY, TRIP_STATUS_TYPE_VALUE, TRIP_STATUS_TIMELIME, TRIP_STATUS_TIMELIME_STRING, TRIP_STATUS_TYPE_VALUE_STRING, VEHICLE_TYPE, RENTAL_REQUEST_TYPE } from "../../app/constants/constants";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import * as moment from 'moment-timezone';
import { EncryptionDecryptionService } from '../services/encrypt-decrypt.service';
declare let google;

export interface Column {
    key: string;
    label: string;
    isDecimal?: boolean;
    isHidden?: boolean;
    isExtra?: boolean;
    isSort?: boolean;
    isDate?: boolean;
    isCurrencySign?: boolean;
    isWrap?: boolean;
    isMeterDistance?: boolean;
    isSecondTime?: boolean;
    isRate?: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class Helper {

    public image_url = environment.IMAGE_URL;
    public DEFAULT_IMAGE = DEFAULT_IMAGE;
    public DATE_FORMAT = DATE_FORMAT;
    public PER_PAGE_LIST = PER_PAGE_LIST;
    public USERS_PER_PAGE_LIST = USERS_PER_PAGE_LIST;
    public PANEL_TYPE = PANEL_TYPE;
    public PERMISSION = PERMISSION;
    public REQUEST_TYPE = REQUEST_TYPE;
    public CREATED_BY = CREATED_BY;
    public TRIP_STATUS_TYPE_VALUE = TRIP_STATUS_TYPE_VALUE;
    public TRIP_STATUS_TIMELIME = TRIP_STATUS_TIMELIME;
    public TRIP_STATUS_TIMELIME_STRING = TRIP_STATUS_TIMELIME_STRING;
    public RENTAL_TRIP_STATUS_TIMELIME_STRING = RENTAL_TRIP_STATUS_TIMELIME_STRING;
    public TRIP_STATUS_TYPE_VALUE_STRING = TRIP_STATUS_TYPE_VALUE_STRING;
    public VEHICLE_TYPE = VEHICLE_TYPE;
    public ASSIGN_TYPE = ASSIGN_TYPE;
    public DRIVER_APPROVE_TYPE = DRIVER_APPROVE_TYPE;
    public BRAND = BRAND;
    public PDFSIZE = PDFSIZE;
    public VEHICLE_HISTORY_TYPE = VEHICLE_HISTORY_TYPE;
    public SERVICE_PRICE_TYPE = SERVICE_PRICE_TYPE;
    public REDIRECT_PERMISSION_TYPE = REDIRECT_PERMISSION_TYPE;
    public REDIRECT_PERMISSION = REDIRECT_PERMISSION;
    public VEHICLE_HISTORY_TYPE_STRING = VEHICLE_HISTORY_TYPE_STRING;
    public OPEN_HISTORY_TYPE = OPEN_HISTORY_TYPE;
    public RENTAL_REQUEST_TYPE = RENTAL_REQUEST_TYPE;
    public NAME_TYPE = NAME_TYPE;
    public is_main_admin = false;
    public is_rental = false;
    selected_id = '';
    history_type = '';
    type: any;
    type_name: any;
    maxlength: number = 6;
    to_fixed_number: number = 2;
    uploadFile = ["image/jpeg", "image/jpg", "image/png"];
    uploadDocFile = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    timezone: any;
    timelocal: any;
    public timeZone = new BehaviorSubject<any>(null);
    display_date_timezone = this.timeZone.asObservable();
    moment = moment;
    public created_at = new BehaviorSubject<any>(null);
    created_date = this.created_at.asObservable();
    permissions: any[] = [];
    public decimal = new BehaviorSubject<any>(null);
    decimal_number = this.decimal.asObservable();
    public admin_settings = new BehaviorSubject<any>(null);
    setting_details = this.admin_settings.asObservable();
    admin_setting_details: any;

    public notification = new BehaviorSubject<any>(null);
    notification_detail = this.notification.asObservable();
    public country = new BehaviorSubject<any>(null);
    country_id = this.country.asObservable();

    async set_notification_detail(notification): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.notification.next(notification);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    public user_details: any;

    token: any;
    randomQueryParam: any = `random=${Math.random()}`;
    public google_key = new BehaviorSubject<any>(null);
    googleKey = this.google_key.asObservable();
    GOOGLE_KEY: any;
    helper_is_loading: boolean = false;
    language_is_loading: boolean = true;
    maximum_first_name_character_limit: number = 30;
    maximum_last_name_character_limit: number = 50;
    maximum_full_name_character_limit: number = 70;

    constructor(public http: HttpClient, public _route: Router, public trans: TranslateService, public ngZone: NgZone, @Inject(DOCUMENT) private _documentRef: any, private _encryptionDecryptionService: EncryptionDecryptionService) {
        if (localStorage.getItem('userData')) {
            this._encryptionDecryptionService.decryptData(localStorage.getItem('userData')).then((response) => {
                this.user_details = response;
            })
        }
        this.decimal_number.subscribe(number => {
            if (number || number == 0) {
                this.to_fixed_number = number;
            }
        })
        this.setting_details.subscribe((detail) => {
            this.admin_setting_details = detail;
        })
        this.googleKey.subscribe((key) => {
            if (key) {
                this.GOOGLE_KEY = key;
            }
        })
    }


    async isUpadtedlocalStorage() {
        if (localStorage.getItem('userData')) {
            this.user_details = await this._encryptionDecryptionService.decryptData(localStorage.getItem('userData'))
        } else {
            this.user_details = null;
        }
    }
    phone_number_validation(evt) {
        let charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57) || charCode === 101) {
            return false;
        }
        return true;
    }

    decimalNum_validation(evt, value = 0) {
        if (evt.key === '.' && value != null && (value.toString().indexOf('.') === value.toString().lastIndexOf('.'))) {
            return true;
        }
        let charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            if (charCode == 46) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    }

    nagetiveNumValidation(evt: KeyboardEvent, value: number = 0): boolean {
        const charCode = evt.which || evt.keyCode;
        // Check if the input already contains a negative sign
        if (value.toString().includes('-')) {
            return false;
        }
        // Allow negative sign and decimal point
        if (charCode === 45 || charCode === 46) {
            // Check if the input already contains a decimal point
            if (charCode === 46 && value.toString().includes('.')) {
                return false;
            }
            return true;
        }
        // Allow digits 0-9
        if (charCode >= 48 && charCode <= 57) {
            return true;
        }

        return false;
    }

    has_permission(type, static_url = null) {
        if (!this.is_main_admin) {
            let url = this._route.url.split('/').pop()
            if (static_url) {
                url = static_url
            }
            let index = this.permissions.findIndex((x) => x.url == url);
            if (index !== -1) {
                let permission = this.permissions[index].permission.split('');
                if (permission[Number(type)] == '1') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    number_validation(evt, value = 0) {
        if (evt.key === '.' && value != null && (value.toString().indexOf('.') === value.toString().lastIndexOf('.'))) {
            return false;
        }
        let charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            if (charCode == 46) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    }

    max_number_validation(evt, value = 0, maxLength = 0) {
        if (evt.key === '.') {
            return false;
        }
        let charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            if (charCode == 46) {
                if (value?.toString().length >= maxLength) {
                    return false;
                }
                return true;
            }
            else {
                return false;
            }
        }
        if (value?.toString().length >= maxLength) {
            return false;
        }
        return true;
    }

    keyUpDown(evt) {
        let charCode = (evt.which) ? evt.which : evt.keyCode
        if (charCode == 38 || charCode == 40 || evt.key == 'ArrowUp' || evt.key == 'ArrowDown' || charCode == 109 || charCode == 107 || charCode == 189) {
            return false;
        }
    }

    maxLengthValidation(event: any, maxLength: number): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        if (value.length >= maxLength) {
            event.preventDefault();
        }
    }

    space_validation(evt) {
        if (evt.code == "Space" && evt.target.value.length < 1) {
            return false;
        }
        return true
    }

    preventNumberInput(evt) {
        // Prevent number input (key codes for numbers are between '0' and '9')
        if (evt.key >= '0' && evt.key <= '9') {
            return false;
        }
        return true;
    }

    nospace_validation(evt) {
        if (evt.code == "Space") {
            return false;
        }
        return true
    }
    spaceEventPreventValidation(evt) {
        if (evt.code == "Space" && evt.target.selectionStart == 0) {
            evt.preventDefault();
        }
    }

    special_char_validation_and_space_validation(event) {
        if (event.code == "Space" && (event.target.value.length < 1 || event.target.value)) {
            return false;
        } else {
            let k;
            k = event.charCode;
            return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
        }
    }

    special_char_validation(event){
        if (event.code == "Space" && event.target.selectionStart == 0) {
            event.preventDefault();
        } else {
            let k;
            k = event.charCode;
            return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
        }
    }

    special_char_space_and_number_validation(event){
        if (event.code == "Space" && event.target.selectionStart == 0) {
            event.preventDefault();
        } else if(event.key >= '0' && event.key <= '9'){
            return false;
        } else {
            let k;
            k = event.charCode;
            return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
        }
    }

    get generate_new_uuid(): string {
        return 'xxxxxxxx-xxxx-xxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    loadGoogleScript(url) {
        return new Promise((resolve, reject) => {
            if (!document.querySelector('script[src="' + url + '"]')) {
                const script = this._documentRef.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.text = ``;
                script.async = true;
                script.defer = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            } else {
                resolve(true);
            }
        })
    }
    downloadImage(url: string, fileName: string) {
        const a: any = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = 'display: none';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    downloadUrl(url: string) {
        return this.http.get(url, { responseType: 'blob' }).pipe(switchMap(response => this.readFile(response)));
    }
    private readFile(blob: Blob): Observable<string> {
        return new Observable(obs => {
            const reader = new FileReader();

            reader.onerror = err => obs.error(err);
            reader.onabort = err => obs.error(err);
            reader.onload = () => {
                obs.next(reader.result as string);
                obs.complete();
            };

            reader.readAsDataURL(blob);

            // Cleanup logic (unsubscribe) can be added here if needed
            return () => {
                reader.abort();
            };
        });
    }
    downloadFile(res: any) {
        this.http.get(res, { responseType: 'blob' as const }).subscribe(fileData => {
            const blob: any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let filename = res.split('xlsheet/')
            let link = document.createElement("a");

            if (link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename[1]);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        );
    }

    getWeeks(startDate) {
        // Convert the start date to a JavaScript Date object
        const start = new Date(startDate);
        const today = new Date();

        // Adjust the start date to the beginning of the week
        start.setDate(start.getDate() - start.getDay());

        const weeks = [];
        let current = new Date(start);

        while (current < today) {
            const weekStart = new Date(current);
            const weekEnd = new Date(current);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weeks.push({ start: weekStart, end: weekEnd });
            current.setDate(current.getDate() + 7);
        }

        return weeks;
    }

    getMonthDay(date, index) {
        let start_date;
        if (index == 0) {
            start_date = moment().format('YYYY-MM-DD').toString()
        } else {
            start_date = moment(date.toString()).add(-6, 'months').format('YYYY-MM-DD').toString()
        }
        return [start_date];
    }

    getFutureDay(date, index) {
        let start_date;
        if (index == 0) {
            start_date = moment(date).format('YYYY-MM-DD').toString();
        } else {
            let todayDate = new Date();
            let todayDate_month = todayDate.getMonth();
            let todayDate_year = todayDate.getFullYear().toString();
            let compare_date = moment(date.toString()).add(6, 'months').format('DD-M-YYYY').toString()
            let date_year = compare_date.split('-')[2];
            let date_month = compare_date.split('-')[1];

            if (date_year == todayDate_year && Number(date_month) <= todayDate_month) {
                start_date = moment(date.toString()).add(6, 'months').format('YYYY-MM-DD').toString()
            } else if (date_year < todayDate_year) {
                start_date = moment(date.toString()).add(6, 'months').format('YYYY-MM-DD').toString()
            } else {
                start_date = moment(todayDate.toString()).format('YYYY-MM-DD').toString()
            }
        }
        return [start_date];
    }

    getSixMonthDifference(date) {
        let createdAt = new Date(date); // Replace with your actual response.created_at
        let counter: number = 0;
        const array = [];
        let end_date;

        while (createdAt < new Date() && (end_date ? end_date <= new Date() : true) || counter === 0) {

            createdAt = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1, 0, 0, 0);
            let start_date = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1, 0, 0, 0);

            let offsetInMilliseconds = start_date.getTimezoneOffset() * 60000; // 1 minute = 60000 milliseconds
            let adjustedDate = new Date(start_date.getTime() - offsetInMilliseconds);
            let isoString = adjustedDate.toISOString();
            start_date = new Date(isoString);

            let end_month = start_date.getMonth() + 5;
            end_date = new Date(start_date.getFullYear(), end_month + 1);

            end_date.setUTCHours(23, 59, 59, 999);
            let endDate_offsetInMilliseconds = end_date.getTimezoneOffset() * 60000; // 1 minute = 60000 milliseconds
            let endDate_adjustedDate = new Date(end_date.getTime() + endDate_offsetInMilliseconds);
            let endDate_isoString = endDate_adjustedDate.toISOString();
            end_date = new Date(endDate_isoString);

            // Add 6 months to the start month
            createdAt.setMonth(end_date.getMonth() + 1);
            if (end_date.getMonth() <= 5) {//for end_date.getMonth() value 0 means january
                createdAt.setFullYear(end_date.getFullYear());
            }

            if (createdAt >= new Date()) {
                counter++;
                end_date = new Date();
            }
            if (end_date >= new Date()) {
                counter++;
            }
            array.push([start_date, end_date]);
        }
        return array;
    }

    findnearest(value) {
        value = Math.abs(Math.ceil(value));
        let length = value.toString().length;
        if (length === 1) {
            return length;
        } else {
            let test1 = "1";
            for (let index = 0; index < length - 1; index++) {
                test1 = test1 + "0";
            }
            let test2 = value % Number(test1);
            let test3 = value - test2;
            let test4: any = test2.toString().length === length - 1 ? Number(test2.toString()[0]) + 1 : 1;
            for (let index = 0; index < length - 2; index++) {
                test4 = test4 + "0";
            }
            let final = Number(test3) + Number(test4);
            return final
        }

    }

    geocoder({ latitude, longitude }) {
        return new Promise((resolve, rejects) => {
            if (typeof google === 'object' && typeof google.maps === 'object') {
                let geocoder = new google.maps.Geocoder();
                let request = { latLng: new google.maps.LatLng(latitude, longitude) };
                geocoder.geocode(request, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        resolve(results[0]);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        })
    }

    maxCharacterValidation(value, max_character_limit): boolean | null {
        if (!value || value == null || value == '') {
            return null;
        }
        if (value?.toString()?.length > max_character_limit) {
            return true;
        }
        return null
    }

    validateAndUpdateError(value: string, max_character_limit): boolean | null {
        return this.maxCharacterValidation(value, max_character_limit);
    }
}


