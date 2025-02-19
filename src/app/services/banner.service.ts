import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiColletions } from '../constants/api_collection';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private _api: ApiService) { }

  public _bannerChanges = new BehaviorSubject<any>(null);
  _bannerObservable = this._bannerChanges.asObservable()

  async add_banner(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.add_banner, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

  async update_banner(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.update_banner, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async get_banner_list(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.get_banner_list, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async delete_banner(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.delete_banner, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

}
