import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class CityService {
	public _cityChanges = new BehaviorSubject<any>(null);
	_cityObservable = this._cityChanges.asObservable()
	public _citySelect = new Subject<any>();
	public _addCity = new Subject<any>();
	public _unselectCity = new Subject<any>(); d

	constructor(private _api: ApiService) { }

	async fetchCity(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_get_city_list, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async fetchDestinationCity(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_fetch_destination_city, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async addCity(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_add_city_details, parameters })
			if (response.success) {
				this._cityChanges.next({})
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async updateCity(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_update_city_details, parameters })
			if (response.success) {
				if (parameters.city_id) {
					this._cityChanges.next(parameters.city_id)
				}
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async checkCity(parameters): Promise<boolean> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_check_city_avaliable, parameters })
			if (response.success) {
				return response.success;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async fetch_airport(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_fetch_airport_details, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async fetch_cityzone(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_fetch_cityzone_details, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async fetch_redzone(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_fetch_redzone_details, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async updateCityZone(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_update_zone_details, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async updateAirportZone(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_update_airport_details, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async updateRedZone(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_update_redzone_details, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

}
