import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { apiColletions } from '../constants/api_collection'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
	providedIn: 'root'
})
export class HubService {

	public _hubChanges = new BehaviorSubject<any>(null);
	_hubObservable = this._hubChanges.asObservable()

	constructor(private _api: ApiService) { }

	async addNewHub(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.add_new_type, parameters })
			if (response.success) {
				this._hubChanges.next({})
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async getAllHubList(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.get_all_hub_list, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async fetchAdminVehicles(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.fetch_admin_vehicles, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async assignUnassignVehicleToHub(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.assign_unassign_vehicle_to_hub, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async getHubProviders(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.get_hub_providers, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async getHubUsers(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.get_hub_users, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async addHubUser(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.add_hub_user, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async updateHubUser(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.update_hub_user, parameters })
			if (response.success) {
				return response.data;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	async deleteHubUser(parameters) {
		try {
			const response = await this._api.post({ url: apiColletions.delete_hub_user, parameters })
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
