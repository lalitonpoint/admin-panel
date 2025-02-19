import { Injectable } from '@angular/core';
import { apiColletions } from '../constants/api_collection';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GuestTokenService {

	public tokenUpdate = new BehaviorSubject<any>(null);
	_tokenObservable = this.tokenUpdate.asObservable();
	constructor(private _api: ApiService) { }

	async get_guest_token(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.fetch_guest_tokens_list, parameters })
			if (response.success) {
				return response.data
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async add_and_update_guest_token(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.add_update_guest_token_new, parameters })
			if (response.success) {
				this.tokenUpdate.next({})
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}
}
