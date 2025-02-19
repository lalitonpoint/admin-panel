import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { apiColletions } from '../constants/api_collection';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DispatcherService {

    private API_URL = environment.API_URL;

    public _userChanges = new BehaviorSubject<any>(null);
    _dispatcherObservable = this._userChanges.asObservable()

    constructor(private _api: ApiService, private _http: HttpClient, private _router: Router, private route: ActivatedRoute, private location: Location) { }

    async updateDispather(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_type_details, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async addNewDispatcher(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.add_new_type, parameters })
            if (response.success) {
                this._userChanges.next({})
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }



}
