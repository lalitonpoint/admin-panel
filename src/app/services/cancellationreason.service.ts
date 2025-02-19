import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Helper } from '../shared/helper';
import { ApiService } from './api.service';
import { apiColletions } from '../constants/api_collection';

@Injectable({ providedIn: 'root' })
export class CancellationReasonService {
	private _advertiseChanges = new BehaviorSubject<any>(null);
	_addvertiseObservable = this._advertiseChanges.asObservable();

	constructor(private helper: Helper, private _api: ApiService) { }

	async list(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.get_cancellation_reason, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async addCancellationReason(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.add_cancellation_reason, parameters })
			if (response.success) {
				this._advertiseChanges.next({})
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async deleteCancellationReason(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.delete_cancellation_reason, parameters })
			if (response.success) {
				this._advertiseChanges.next({})
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async updateCancellationReason(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.update_cancellation_reason, parameters })
			if (response.success) {
				this._advertiseChanges.next({})
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

}
