import { Injectable } from "@angular/core";
import { Helper } from './helper';

@Injectable({
    providedIn: 'root'
})

export class SubAdminUrl {
    
    public url_array =
        [
            {
                index: 0,
                value: "dashboard",
                actions: "10000",
                label: this._helper.trans.instant('menu.dashboards'),
                route:"/app/dashboard"
            },
            {
                index: 1,
                value: "running_requests",
                actions: "10101",
                label: this._helper.trans.instant('menu.running_requests'),
                route:"/app/requests/request-type/running_requests"
            },
            {
                index: 2,
                value: "completed_requests",
                actions: "10101",
                label: this._helper.trans.instant('menu.completed_requests'),
                route:"/app/requests/request-type/completed_requests"
            },
            {
                index: 3,
                value: "scheduled_requests",
                actions: "10101",
                label: this._helper.trans.instant('menu.scheduled_requests'),
                route:"/app/requests/request-type/scheduled_requests"
            },
            {
                index: 4,
                value: "cancelled_requests",
                actions: "10001",
                label: this._helper.trans.instant('menu.cancelled_requests'),
                route:"/app/requests/reques-type/cancelled_requests"
            },
            {
                index: 39,
                value: "report",
                actions: "10001",
                label: this._helper.trans.instant('menu.report'),
                route:"/app/requests/request-type/report"
            },
            {
                index: 42,
                value: "open_ride_running_requests",
                actions: "10001",
                label: this._helper.trans.instant('menu.open_ride_running_requests'),
                route:"/app/requests/reques-type/open_ride_running_requests"
            },
            {
                index: 43,
                value: "open_ride_completed_requests",
                actions: "10001",
                label: this._helper.trans.instant('menu.open_ride_completed_requests'),
                route:"/app/requests/reques-type/open_ride_completed_requests"
            },
            {
                index: 44,
                value: "open_ride_scheduled_requests",
                actions: "10001",
                label: this._helper.trans.instant('menu.open_ride_scheduled_requests'),
                route:"/app/requests/reques-type/open_ride_scheduled_requests"
            },
            {
                index: 45,
                value: "open_ride_cancelled_requests",
                actions: "10001",
                label: this._helper.trans.instant('menu.open_ride_cancelled_requests'),
                route:"/app/requests/reques-type/open_ride_cancelled_requests"
            },
            {
                index: 47,
                value: "open_ride_report",
                actions: "10001",
                label: this._helper.trans.instant('menu.open_ride_report'),
                route:"/app/requests/request-type/open_ride_report"
            },
            {
                index: 5,
                value: "reviews",
                actions: "10000",
                label: this._helper.trans.instant('menu.review'),
                route:"/app/requests/reviews/review"
            },
            {
                index: 6,
                value: "mapview",
                actions: "10000",
                label: this._helper.trans.instant('menu.map-view'),
                route:"/app/map-views/drivers-map-view"
            },
            {
                index: 7,
                value: "provider_track",
                actions: "10000",
                label: this._helper.trans.instant('menu.track-provider'),
                route:"/app/map-views/driver-tracking"
            },
            {
                index: 8,
                value: "all_city",
                actions: "10000",
                label: this._helper.trans.instant('menu.all-city-map'),
                route:"/app/map-views/all-cities"
            },
            {
                index: 36,
                value: "heat_map",
                actions: "10000",
                label: this._helper.trans.instant('menu.heat-map'),
                route:"/app/map-views/heat-map"
            },
            {
                index: 41,
                value: "hub_map",
                actions: "10000",
                label: this._helper.trans.instant('menu.hub-map'),
                route:"/app/map-views/hub-map"
            },
            {
                index: 9,
                value: "trip-earning",
                actions: "10001",
                label: this._helper.trans.instant('menu.trip-earning'),
                route:"/app/earnings/order/trip-earning"
            },
            {
                index: 46,
                value: "open-ride-trip-earning",
                actions: "10001",
                label: this._helper.trans.instant('menu.open-ride-trip-earning'),
                route:"/app/earnings/order/open-ride-trip-earning"
            },
            {
                index: 10,
                value: "daily-earning",
                actions: "10001",
                label: this._helper.trans.instant('menu.daily-earning'),
                route:"/app/earnings/order/daily-earning"
            },
            {
                index: 11,
                value: "weekly-earning",
                actions: "10001",
                label: this._helper.trans.instant('menu.weekly_earning'),
                route:"/app/earnings/order/weekly-earning"
            },
            {
                index: 12,
                value: "partner-weekly-payments",
                actions: "10001",
                label: this._helper.trans.instant('menu.admin-partner-earning'),
                route:"/app/earnings/order/partner-weekly-payments"
            },
            {
                index: 13,
                value: "wallet-history",
                actions: "10001",
                label: this._helper.trans.instant('menu.wallet-history'),
                route:"/app/earnings/wallet/wallet-history"
            },
            {
                index: 14,
                value: "transaction_history",
                actions: "10000",
                label: this._helper.trans.instant('menu.transaction-history'),
                route:"/app/earnings/wallet/transaction-history"
            },
            {
                index: 34,
                value: "redeem_history",
                actions: "10000",
                label: this._helper.trans.instant('menu.redeem-history'),
                route:"/app/earnings/wallet/redeem-history"
            },
            {
                index: 15,
                value: "type",
                actions: "11100",
                label: this._helper.trans.instant('label-title.service-type'),
                route:"/app/service-types/type"
            },
            {
                index: 37,
                value: "manage-vehicle",
                actions: "11110",
                label: this._helper.trans.instant('menu.manage-vehicle'),
                route:"/app/service-types/manage-vehicle"
            },
            {
                index: 16,
                value: "country-city-info",
                actions: "11110",
                label: this._helper.trans.instant('menu.country-city'),
                route:"/app/service-types/country-city-info"
            },
            {
                index: 17,
                value: "city-type",
                actions: "11110",
                label: this._helper.trans.instant('menu.pricing'),
                route:"/app/service-types/city-type"
            },
            {
                index: 18,
                value: "user",
                actions: "11111",
                label: this._helper.trans.instant('menu.users'),
                route:"/app/users/user"
            },
            {
                index: 19,
                value: "driver-user",
                actions: "11111",
                label: this._helper.trans.instant('menu.driver-user'),
                route:"/app/users/driver-user"
            },
            {
                index: 20,
                value: "dispatcher",
                actions: "11111",
                label: this._helper.trans.instant('menu.dispatcher'),
                route:"/app/users/dispatcher"
            },
            {
                index: 21,
                value: "corporate",
                actions: "11111",
                label: this._helper.trans.instant('menu.corporate'),
                route:"/app/users/corporate"
            },
            {
                index: 22,
                value: "partner",
                actions: "11111",
                label: this._helper.trans.instant('menu.partner'),
                route:"/app/users/partner"
            },
            {
                index: 35,
                value: "hotel",
                actions: "11111",
                label: this._helper.trans.instant('menu.hotel'),
                route:"/app/users/hotel"
            },
            {
                index: 38,
                value: "hub",
                actions: "11101",
                label: this._helper.trans.instant('menu.hub'),
                route:"/app/users/hub"
            },
            {
                index: 23,
                value: "admin",
                actions: "10100",
                label: this._helper.trans.instant('label-title.settings'),
                route:"/app/setting/basic-settings/admin"
            },
            {
                index: 24,
                value: "document",
                actions: "11100",
                label: this._helper.trans.instant('label-title.documents'),
                route:"/app/setting/basic-settings/document"
            },
            {
                index: 25,
                value: "language",
                actions: "11111",
                label: this._helper.trans.instant('menu.language'),
                route:"/app/setting/basic-settings/language"
            },
            {
                index: 26,
                value: "offer",
                actions: "11110",
                label: this._helper.trans.instant('menu.promocode'),
                route:"/app/setting/discount/offer"
            },
            {
                index: 27,
                value: "email-settings",
                actions: "10100",
                label: this._helper.trans.instant('menu.email'),
                route:"/app/setting/other-settings/email-settings"
            },
            {
                index: 28,
                value: "sms-settings",
                actions: "10100",
                label: this._helper.trans.instant('menu.sms'),
                route:"/app/setting/other-settings/sms-settings"
            },
            {
                index: 29,
                value: "mass-notification",
                actions: "11000",
                label: this._helper.trans.instant('menu.sms-mass-notification'),
                route:"/app/setting/other-settings/mass-notification"
            },
            {
                index: 30,
                value: "terms_and_privacy_setting",
                actions: "10100",
                label: this._helper.trans.instant('menu.terms-and-privacy-setting'),
                route:"/app/setting/other-settings/terms_and_privacy_setting"
            },
            {
                index: 31,
                value: "referral_code",
                actions: "10000",
                label: this._helper.trans.instant('menu.referral-code'),
                route:"/app/setting/discount/referral-code"
            },
            {
                index: 32,
                value: "cancellation-reason",
                actions: "11110",
                label: this._helper.trans.instant('menu.cancellation-reason'),
                route:"/app/setting/other-settings/cancellation-reason"
            },
            {
                index: 33,
                value: "logs",
                actions: "10000",
                label: this._helper.trans.instant('menu.logs'),
                route:"/app/setting/other-settings/logs"
            },
            {
                index: 40,
                value: "guest-token",
                actions: "11100",
                label: this._helper.trans.instant('menu.guest_token'),
                route:"/app/setting/other-settings/guest-token"
            },
            { 
                index:48, 
                value: 'banner', 
                actions: "11110", 
                label: this._helper.trans.instant('menu.banner'), 
                route:'/app/setting/other-settings/banner'
            }
        ]

    constructor(private _helper:Helper){}
}