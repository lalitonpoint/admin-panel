import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiColletions } from '../constants/api_collection';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	constructor(private _api: ApiService) { }

	async getSixMonthEarning(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.get_six_month_earning, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async getSixMonthTrip(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.get_six_month_trip, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null
		}
	}

}
