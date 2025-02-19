import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { apiColletions } from '../constants/api_collection'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
    providedIn: 'root'
})
export class HotelService {

    public _hotelChanges = new BehaviorSubject<any>(null);
    _hotelObservable = this._hotelChanges.asObservable()

    constructor(private _api: ApiService) { }

    async addNewHotel(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.add_new_type, parameters })
            if (response.success) {
                this._hotelChanges.next({})
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
}
