import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiColletions } from '../constants/api_collection';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root'
})
export class ReferralService {

	constructor(private _api: ApiService, private _http: HttpClient) { }

	async fetchReferralList(parameters) {
		try {
			let params = new HttpParams();
			params = params.append('type', parameters.type);
			params = params.append('page', parameters.page);
			params = params.append('limit', parameters.limit);

			if (parameters.search_value && parameters.search_item) {
				params = params.append('search_item', parameters.search_item);
				params = params.append('search_value', parameters.search_value);
			}
			if (parameters.is_excel_sheet) {
				params = params.append('is_excel_sheet', parameters.is_excel_sheet);
			}
			const response = await this._api.getwithparams({ url: apiColletions.referral_list, params })
			if (response.success) {
				return response.data
			} else {
				return true
			}
		} catch (error) {
			return false
		}
	}

	async fetchReferralDetails(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.referral_details, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}
}


