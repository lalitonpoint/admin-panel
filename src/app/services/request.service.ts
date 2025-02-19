import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private _api: ApiService) { }

  async requestList(data): Promise<any> {
    try {
      let params = new HttpParams();
      params = params.append('type', data.type);
      params = params.append('page', data.page);
      params = params.append('limit', data.limit);
      params = params.append('payment_mode', data.payment_mode);
      if (data.start_date && data.end_date) {
        params = params.append('start_date', data.start_date);
        params = params.append('end_date', data.end_date);
      }
      if (data.search_value && data.search_by) {
        params = params.append('search_by', data.search_by);
        params = params.append('search_value', data.search_value);
      }
      if (data.user_type == 2) {
        if (data.user_type_id) {
          params = params.append('provider_id', data.user_type_id)
        }
      } else if (data.user_type_id) {
        params = params.append('user_type_id', data.user_type_id)
      }

      if (data.user_type) {
        params = params.append('user_type', data.user_type)
      }
      if (data.is_excel_sheet) {
        params = params.append('is_excel_sheet', data.is_excel_sheet)
        params = params.append('header' , data.header)
      }
      if (data.export_user_id) {
        params = params.append('export_user_id', data.export_user_id)
      }

      if (data.sort_item && data.sort_order) {
        params = params.append('sort_item', data.sort_item)
        params = params.append('sort_order', data.sort_order)
      }

      if (data.booking_type) {
        params = params.append('booking_type', data.booking_type)
      }

      const res = await this._api.getwithparams({ url: apiColletions.get_trip_list, params })
      if (data.is_excel_sheet) {
        if (res) {
          return res.data;
        } else {
          return true
        }
      } else if (res.success){
        return res.data;
      } else {
        return true
      }
    } catch (error) {
      return false
    }
  }

  async getTripDetails(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.get_trip_detail, parameters })
      if (res) {
        return res.data;
      } else {
        return null
      }
    } catch (error) {
      return null;
    }
  }

  async getChatHistory(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.chat_history, parameters })
      if (res) {
        return res.data;
      } else {
        return null
      }
    } catch (error) {
      return null;
    }
  }

  async setTripStatus(parameters): Promise<any> {
    try {
      const res =  await this._api.post({ url: apiColletions.set_trip_status_by_admin, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null;
    }
  }

  async cancelTrip(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.trip_cancel_by_admin, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
        return null;
    }
  }

  async completeTrip(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.trip_complete_by_admin, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
        return null
    }
  }

  async payTripPayment(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.trip_pay_payment, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  async scheduledTripCancelByAdmin (parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.scheduled_trip_cancel_by_admin , parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null;
    }
  }

  async reviewsList(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.reviews_list, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  async refundTripAmount(parameters): Promise<any> {
    try {
        const res = await this._api.post({ url: apiColletions.refund_trip_amount, parameters })
        if (res) {
          return res.data
        } else {
          return null
        }
    } catch (error) {
        return null
    }
  }

  async getServieceTypeTripList(parameters) :  Promise<any>{
    try {
        let params = new HttpParams();
        params = params.append('user_type_id', parameters.user_type_id);
        params = params.append('type', parameters.type);
        params = params.append('page', parameters.page);
        params = params.append('limit', parameters.limit);
        params = params.append('payment_mode', parameters.payment_mode);
        if (parameters.start_date && parameters.end_date) {
          params = params.append('start_date', parameters.start_date);
          params = params.append('end_date', parameters.end_date);
        }
        if (parameters.search_value && parameters.search_by) {
          params = params.append('search_by', parameters.search_by);
          params = params.append('search_value', parameters.search_value);
        }
        if (parameters.is_excel_sheet) {
          params = params.append('is_excel_sheet', parameters.is_excel_sheet)
        }
        if (parameters.export_history_type) {
          params = params.append('export_history_type', parameters.export_history_type)
        }
        if (parameters.export_user_id) {
          params = params.append('export_user_id', parameters.export_user_id)
        }

        if (parameters.sort_item && parameters.sort_order) {
          params = params.append('sort_item', parameters.sort_item)
          params = params.append('sort_order', parameters.sort_order)
        }
        
        const res = await this._api.getwithparams({ url: apiColletions.service_type_trip_list, params })
        if (parameters.is_excel_sheet) {
          if (res) {
            return res.data
          } else {
            return true
          }
        } else if (res.success) {
          return res.data
        } else {
          return true
        }
    } catch (error) {
        return null
    }
  }

  async reportrequestList(data): Promise<any> {
    try {
      let params = new HttpParams();
      params = params.append('type', data.type);
      params = params.append('page', data.page);
      params = params.append('limit', data.limit);
      params = params.append('payment_mode', data.payment_mode);
      params = params.append('country_id', data.country_id);
      params = params.append('booking_type', data.booking_type);
      params = params.append('created_by', data.created_by);

      if(data.city_id){
        params = params.append('city_id', data.city_id);
      }
      if (data.user_name) {
        params = params.append('user_name', data.user_name);
      }
      if (data.driver_id) {
        params = params.append('driver_id', data.driver_id);
      }
      if (data.provider_type_id) {
        params = params.append('provider_type_id', data.provider_type_id);
      }
      if (data.user_type_id) {
        params = params.append('user_type_id', data.user_type_id);
      }
      if(data.service_type_id){
        params = params.append('service_type_id', data.service_type_id);
      }
      if (data.trip_status) {
        params = params.append('trip_status', data.trip_status)
      }
      if (data.trip_end_date) {
        params = params.append('trip_end_date', data.trip_end_date);
      }
       
      if (data.is_excel_sheet) {
        params = params.append('is_excel_sheet', data.is_excel_sheet)
        params = params.append('header' , data.header)
      }
      if (data.export_user_id) {
        params = params.append('export_user_id', data.export_user_id)
      }
      if (data.start_date) {
        params = params.append('start_date', data.start_date)
      }
      if (data.end_date) {
        params = params.append('end_date', data.end_date)
      }
        
      if (data.sort_item && data.sort_order) {
        params = params.append('sort_item', data.sort_item)
        params = params.append('sort_order', data.sort_order)
      }

      const res = await this._api.getwithparams({ url: apiColletions.get_trip_report, params })
      if (data.is_excel_sheet) {
        if (res) {
          return res.data
        } else {
          return true
        }
      } else  if (res.success) {
        return res.data
      } else {
        return true
      }
    } catch (error) {
        return false
    }
  }

  async openRideReportList(data): Promise<any> {
    try {
      let params = new HttpParams();
      params = params.append('type', data.type);
      params = params.append('page', data.page);
      params = params.append('limit', data.limit);
      if(data.payment_mode){
        params = params.append('payment_mode', data.payment_mode);
      }
      params = params.append('country_id', data.country_id);

      if(data.city_id){
        params = params.append('city_id', data.city_id);
      }
      if (data.user_name) {
        params = params.append('user_name', data.user_name);
      }
      if (data.driver_id) {
        params = params.append('driver_id', data.driver_id);
      }
      if (data.provider_type_id) {
        params = params.append('provider_type_id', data.provider_type_id);
      }
      if(data.service_type_id){
        params = params.append('service_type_id', data.service_type_id);
      }
      if (data.trip_status) {
        params = params.append('trip_status', data.trip_status)
      }
      if (data.trip_end_date) {
        params = params.append('trip_end_date', data.trip_end_date);
      }
       
      if (data.is_excel_sheet) {
        params = params.append('is_excel_sheet', data.is_excel_sheet)
        params = params.append('header' , data.header)
      }
      if (data.export_user_id) {
        params = params.append('export_user_id', data.export_user_id)
      }
      if (data.start_date) {
        params = params.append('start_date', data.start_date)
      }
      if (data.end_date) {
        params = params.append('end_date', data.end_date)
      }
        
      if (data.sort_item && data.sort_order) {
        params = params.append('sort_item', data.sort_item)
        params = params.append('sort_order', data.sort_order)
      }

      const res = await this._api.getwithparams({ url: apiColletions.openride_get_trip_report, params })
      if (data.is_excel_sheet) {
        if (res) {
          return res.data
        } else {
          return true
        }
      } else  if (res.success) {
        return res.data
      } else {
        return true
      }
    } catch (error) {
        return false
    }
  }

  async get_details_country_city_wise_list(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.get_details_country_city_wise, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }
  
  async send_invoice_mail(parameters) : Promise<any>{
    try {
      const res = await this._api.post({ url: apiColletions.send_invoice_mail, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  async openRideCancelTrip(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.open_ride_cancel_by_admin, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  async scheduledOpenRideCancelByAdmin(parameters) : Promise<any>{
    try {
      const res = await this._api.post({ url: apiColletions.scheduled_open_ride_cancel_by_admin, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  async openRideRequestList(data): Promise<any> {
    try {
        let params = new HttpParams();
        params = params.append('type', data.type);
        params = params.append('page', data.page);
        params = params.append('limit', data.limit);
        params = params.append('payment_mode', data.payment_mode);
        if (data.start_date && data.end_date) {
          params = params.append('start_date', data.start_date);
          params = params.append('end_date', data.end_date);
        }
        if (data.search_value && data.search_by) {
          params = params.append('search_by', data.search_by);
          params = params.append('search_value', data.search_value);
        }
        if (data.user_type == 2) {
          if (data.user_type_id) {
            params = params.append('provider_id', data.user_type_id)
          }
        } else if (data.user_type_id){
            params = params.append('user_type_id', data.user_type_id)
        }
        if (data.user_type) {
          params = params.append('user_type', data.user_type)
        }
        if (data.is_excel_sheet) {
          params = params.append('is_excel_sheet', data.is_excel_sheet)
          params = params.append('header' , data.header)
        }
        if (data.export_user_id) {
          params = params.append('export_user_id', data.export_user_id)
        }

        if (data.sort_item && data.sort_order) {
          params = params.append('sort_item', data.sort_item)
          params = params.append('sort_order', data.sort_order)
        }

      const res = await this._api.getwithparams({ url: apiColletions.openride_get_trip_list, params })
      if (data.is_excel_sheet) {
        if (res) {
          return res.data
        } else {
          return true
        }
      } else if (res.success) {
        return res.data
      } else {
        return true
      }
    } catch (error) {
      return false
    }
  }

  async openRideGetTripDetails(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.openride_get_trip_detail, parameters })
      if (res) {
        return res.data
      } else {
        return null
      }
    } catch (error) {
        return null
    }
  }

  // rental request 
  async requestRentalList(data): Promise<any> {
    try {
      let params = new HttpParams();
      params = params.append('type', data.type);
      params = params.append('page', data.page);
      params = params.append('limit', data.limit);

      if (data.start_date && data.end_date) {
        params = params.append('start_date', data.start_date);
        params = params.append('end_date', data.end_date);
      }
      if (data.search_value && data.search_by) {
        params = params.append('search_by', data.search_by);
        params = params.append('search_value', data.search_value);
      }
      if (data.user_type == 2) {
        if (data.user_type_id) {
          params = params.append('provider_id', data.user_type_id)
        }
      } else if (data.user_type_id) {
        params = params.append('user_type_id', data.user_type_id)
      }

      if (data.user_type) {
        params = params.append('user_type', data.user_type)
      }
      if (data.is_excel_sheet) {
        params = params.append('is_excel_sheet', data.is_excel_sheet)
        params = params.append('header' , data.header)
      }
      if (data.export_user_id) {
        params = params.append('export_user_id', data.export_user_id)
      }

      if (data.sort_item && data.sort_order) {
        params = params.append('sort_item', data.sort_item)
        params = params.append('sort_order', data.sort_order)
      }

      if (data.booking_type) {
        params = params.append('booking_type', data.booking_type)
      }

      const res = await this._api.getwithparams({ url: apiColletions.get_rental_trip_list, params })
      if (data.is_excel_sheet) {
        if (res) {
          return res.data;
        } else {
          return true
        }
      } else if (res.success){
        return res.data;
      } else {
        return true
      }
    } catch (error) {
      return false
    }
  }

  async getRentalTripDetails(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.get_rental_trip_detail, parameters })
      if (res) {
        return res.data;
      } else {
        return null
      }
    } catch (error) {
      return null;
    }
  }

  async cancelRentalTrip(parameters): Promise<any> {
    try {
      const res = await this._api.post({ url: apiColletions.rental_trip_cancel_by_admin, parameters })
      if (res) {
        return res.data;
      } else {
        return null
      }
    } catch (error) {
      return null;
    }
  }

  async refundRentalTripAmount(parameters): Promise<any> {
    try {
        const res = await this._api.post({ url: apiColletions.refund_rental_trip_amount, parameters })
        if (res) {
          return res.data
        } else {
          return null
        }
    } catch (error) {
        return null
    }
  }

  async rentalRequestReportList(data): Promise<any> {
    try {
      let params = new HttpParams();
      params = params.append('type', data.type);
      params = params.append('page', data.page);
      params = params.append('limit', data.limit);
      params = params.append('country_id', data.country_id);

      if (data.user_name) {
        params = params.append('user_name', data.user_name);
      }
      if (data.driver_id) {
        params = params.append('driver_id', data.driver_id);
      }
      if (data.trip_status) {
        params = params.append('trip_status', data.trip_status)
      }
      if (data.trip_end_date) {
        params = params.append('trip_end_date', data.trip_end_date);
      }
      if (data.is_excel_sheet) {
        params = params.append('is_excel_sheet', data.is_excel_sheet)
        params = params.append('header' , data.header)
      }
      if (data.export_user_id) {
        params = params.append('export_user_id', data.export_user_id)
      }
      if (data.start_date) {
        params = params.append('start_date', data.start_date)
      }
      if (data.end_date) {
        params = params.append('end_date', data.end_date)
      }
      if (data.sort_item && data.sort_order) {
        params = params.append('sort_item', data.sort_item)
        params = params.append('sort_order', data.sort_order)
      }

      const res = await this._api.getwithparams({ url: apiColletions.get_rental_trip_report, params })
      if (data.is_excel_sheet) {
        if (res) {
          return res.data
        } else {
          return true
        }
      } else  if (res.success) {
        return res.data
      } else {
        return true
      }
    } catch (error) {
        return false
    }
  }

}
   