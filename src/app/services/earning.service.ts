import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class EarningService {

    constructor(private _api: ApiService) { }
    // trip earning list
    async fetchTripEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.trip_earning, parameters })
            if (parameters.is_export) {
                if (response) {
                    return (response.data);
                } else {
                    return (null);
                }
            } else if (response.success) {
                return (response.data);
            } else {
                return (null);
            }
        } catch (err) {
            return (null);
        }
    }
    // trip earning statement
    async getTripStatement(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.trip_earning_statement, parameters })
            if (response.success) {
                return (response.data);
            } else {
                return (null);
            }
        } catch (err) {
            return (null);
        }
    }
    // driver daily Weekly trip earning list
    async dailyWeeklyTripEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.weekly_and_daily_earning, parameters })
            if (parameters.is_export) {
                if (response) {
                    return response.data
                } else {
                    return null
                }
            } else if (response.success) {
                return response.data
            } else {
                return null
            }
        } catch (err) {
            return null
        }
    }
    // driver daily Weekly trip earning Statement
    async dailyWeeklyStatementTripEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.statement_provider_daily_and_weekly_earning, parameters })
            if (parameters.is_export) {
                if (response) {
                    return response.data;
                } else {
                    return null;
                }
            } else if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }
    // partner Weekly trip earning list
    async partnerWeeklyTripEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.admin_partner_weekly_earning, parameters })
            if (parameters.is_export) {
                if (response) {
                    return response.data;
                } else {
                    return null;
                }
            } else if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }
    // partner Weekly trip earning Statement
    async partnerWeeklyStatementTripEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.admin_partner_weekly_earning_statement, parameters })
            if (response) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }
    // wallet history 
    async walletHistory(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.admin_wallet_history, parameters })
            if (parameters.is_export) {
                if (response) {
                    return response.data;
                } else {
                    return null
                }
            } else if (response.success) {
                return response.data;
            } else {
                return null
            }
        } catch (err) {
            return null
        }
    }
    // transaction history 
    async transactionHistory(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.admin_transaction_history, parameters })
            if (response) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async redeemPointHistory(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.redeem_point_history, parameters })
            if (response) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async openRideTripEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.openride_trip_earning, parameters })
            if (response) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async openRideStatementProviderEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.open_ride_statement_provider_trip_earning, parameters })
            if (response) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async rentalTripEarning(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.rental_trip_earning, parameters })
            if (response) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }
}
