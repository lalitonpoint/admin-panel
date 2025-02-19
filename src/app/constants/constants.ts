export const PDFSIZE = 100000;

export const DEFAULT_IMAGE = {
	DEFAULT_PDF_IMG: 'assets/default_images/pdf_img.png',
	DEFAULT_TAXI_IMAGE: 'assets/img/Taxi/Taxi.jpg',
	USER_PROFILE: 'assets/default_images/user.png',
	USER_SQUARE: 'assets/default_images/user_square.png',
	DOCUMENT_PROFILE: 'assets/default_images/document_default.png',
	PICKUP_ICON: 'assets/default_images/map_pin/pickup.png',
	DESTINATION_ICON: 'assets/default_images/map_pin/destination.png',
	DRIVER_ICON: 'assets/default_images/map_pin/driver.png',
	STOP_ICON: 'assets/default_images/map_pin/stop_icon.svg',
	COUNTRY_FLAG: 'assets/default_images/country.png',
	DRIVER_IN_TRIP: 'assets/default_images/map_pin/provider_in_trip.png',
	DRIVER_ONLINE: 'assets/default_images/map_pin/provider_online.png',
	DRIVER_OFFLINE: 'assets/default_images/map_pin/provider_offline.png',
}
export const DATE_FORMAT = {
	DD_MM_YYYY_HH_MM_A: 'dd MMM yyyy hh:mm a',
	DD_MM_YYYY: 'dd MMM yyyy',
	DD_MM_YY: "DD MMM YY",
	MOMENT_DD_MMM_YYYY: "DD MMM YYYY",
	D_MMM_H_MM_A: "d MMM yy - h:mm a",
	dd_mm_yyyy: 'dd/MM/yyyy',
	medium: 'medium',
	HH_MM_A: "hh:mm a",
	DASHED_DD_MM_YYYY: "DD-MM-YYYY",
	MMM_YYYY: "MMM-yyyy"
}
export const VEHICLE_RATIO = {
	vehicle_image_ratio: 1.67,
	vehicle_image_max_width: 500,
	vehicle_map_pin_ratio: 0.45,
	vehicle_map_pin_max_width: 90
}

export const USER_PANEL_RATIO = {
	bg_image_ratio: 1.50,
	bg_image_max_width: 1920,
	image_ratio: 1.59,
	image_max_width: 900,
	icon_image_ratio: 1,
	icon_image_max_width: 180,
}

export const TRIP_TYPE = {
	TRIP_TYPE_NORMAL: 0,
	TRIP_TYPE_VISITOR: 1,
	TRIP_TYPE_HOTEL: 2,
	TRIP_TYPE_DISPATCHER: 3,
	TRIP_TYPE_SCHEDULE: 5,
	TRIP_TYPE_PROVIDER: 6,
	TRIP_TYPE_CORPORATE: 7,

	TRIP_TYPE_AIRPORT: 11,
	TRIP_TYPE_ZONE: 12,
	TRIP_TYPE_CITY: 13,
	TRIP_TYPE_CAR_RENTAL: 14,
	TRIP_TYPE_GUEST_TOKEN: 15,
}

export const SPLIT_PAYMENT = {
	WAITING: 0,
	ACCEPTED: 1,
	REJECTED: 2
}

export const DOMAIN = {
	1: "gmail",
	2: "other"
}

export const CERTIFICATE_MODE = {
	1: "sandbox",
	2: "production"
}

export const PANEL_TYPE = {
	USER: '1',
	PROVIDER: '2',
	PARTNER: '3',
	CORPORATE: '4',
	HOTEL: '5',
	DISPATCHER: '6',
	HUB: '19',
}

export const EXPORT_HISTORY_REQUEST_TYPE = {
	USER: '16',
	PROVIDER: '17',
	PARTNER: '18',
	CORPORATE: '19',
	HOTEL: '20',
	DISPATCHER: '21',
	HUB: ''
}

export const PANEL_NAME = {
	USER: 'Customer',
	PROVIDER: 'Provider',
	PARTNER: 'Partner',
	CORPORATE: 'Corporate',
	HOTEL: 'Hotel',
	DISPATCHER: 'Dispatcher',
	HUB: 'Hub',
}

export const PROMO_CODE = {
	RUNNING: '1',
	INACTIVE: '2',
	EXPIRED: '3',
}

export const TRIP_STATUS = {
	RUNNING: 1,
	SCHEDULED: 2,
	COMPLETED: 3,
	CANCELLED: 4,
	COMPLETED_TRIP_REPORT: 15,
	OPEN_RIDE_RUNNING_TRIP: 20,
	OPEN_RIDE_SCHEDULED_TRIP: 21,
	OPEN_RIDE_COMPLETED_TRIP: 22,
	OPEN_RIDE_CANCELLED_TRIP: 23,
	OPEN_RIDE_TRIPS_REPORT: 24,
	RENTAL_RUNNING_REQUEST: 25,
	RENTAL_COMPLETED_REQUEST: 26,
	RENTAL_CANCELLED_REQUEST: 27,
	RENTAL_REQUEST_REPORT: 28,
}

export const PROVIDER_STATUS = {
	WAITING: 0,
	ACCEPTED: 0,
	ACCEPT: 1,
	COMING: 2,
	AFTER_TIME_WAITING: 3,
	ARRIVED: 4,
	STARTED: 6,
	COMPLETED: 9
}

export const PROVIDER_ACCEPTED = {
	WAITING: 0,
	ACCEPTED: 1,
	AFTER_TIME_WAITING: 3,
}

export const PER_PAGE_LIST = [20, 50, 100]
export const USERS_PER_PAGE_LIST = [15, 30, 60]

export const EXPORT_HISTORY_STATUS = {
	QUEUED: 0,
	COMPLETED: 1,
	FAILED: 2
}

export const EXPORT_HISTORY_EARNING_TYPE = {
	TRIP_EARNING: 5,
	DAILY_EARNING: 6,
	DRIVER_WEEKLY_EARNING: 7,
	PARTNER_WEEKLY_EARNING: 8,
	WALLET_HISTORY: 18,
	RENTAL_TRIP_EARNING: 29
}

export const PERMISSION = {
	VIEW: 0,
	ADD: 1,
	EDIT: 2,
	DELETE: 3,
	EXPORT: 4
}

export const CREATED_BY = {
	CREATED_BY_USER: 0,
	CREATED_BY_HOTEL: 2,
	CREATED_BY_DISPATCHER: 3,
	CREATED_BY_PROVIDER: 6,
	CREATED_BY_CORPORATE: 7
}

export const UPDATE_LOG_TYPE = {
	ADMIN_SETTINGS: 1,
	CITY_SETTINGS: 2,
	AIRPORT_SETTINGS: 3,
	ZONE_SETTINGS: 4,
	RED_ZONE_SETTINGS: 5,
	COUNTRY_SETTINGS: 6,
	TYPE_DETAIL: 7,
	CITY_TYPE_SETTINGS: 8,
	RICH_AREA_SURGE_SETTINGS: 9,
	CITY_TO_CITY_SETTINGS: 10,
	AIRPORT_TO_CITY_SETTINGS: 11,
	RENTAL_CAR_SETTINGS: 12,
	DOCUMENT_SETTINGS: 13,

	LANGUAGE_SETTINGS: 14,
	PROMO_SETTINGS: 15,
	EMAIL_SETTINGS: 16,
	SMS_SETTINGS: 17,
	PRIVACY_SETTINGS: 18,
	CANCEL_REASON_SETTINGS: 19,
	SUB_ADMIN_SETTINGS: 20,
}

export const UPDATE_LOG_STRING = {
	[UPDATE_LOG_TYPE.ADMIN_SETTINGS]: 'menu.admin-setting',
	[UPDATE_LOG_TYPE.CITY_SETTINGS]: 'heading-title.city-details',
	[UPDATE_LOG_TYPE.AIRPORT_SETTINGS]: 'label-title.airport-settings',
	[UPDATE_LOG_TYPE.ZONE_SETTINGS]: 'label-title.zone-settings',
	[UPDATE_LOG_TYPE.RED_ZONE_SETTINGS]: 'label-title.red-zone-settings',
	[UPDATE_LOG_TYPE.COUNTRY_SETTINGS]: 'label-title.country-settings',
	[UPDATE_LOG_TYPE.TYPE_DETAIL]: 'label-title.type-detail',
	[UPDATE_LOG_TYPE.CITY_TYPE_SETTINGS]: 'label-title.city-type-settings',
	[UPDATE_LOG_TYPE.RICH_AREA_SURGE_SETTINGS]: 'label-title.rich-area-surge-settings',
	[UPDATE_LOG_TYPE.CITY_TO_CITY_SETTINGS]: 'label-title.city-to-city-settings',
	[UPDATE_LOG_TYPE.AIRPORT_TO_CITY_SETTINGS]: 'label-title.airport-to-city-settings',
	[UPDATE_LOG_TYPE.RENTAL_CAR_SETTINGS]: 'label-title.rental-car-settings',
	[UPDATE_LOG_TYPE.DOCUMENT_SETTINGS]: 'label-title.document-settings',

	[UPDATE_LOG_TYPE.LANGUAGE_SETTINGS]: 'label-title.language-settings',
	[UPDATE_LOG_TYPE.PROMO_SETTINGS]: 'label-title.promo-settings',
	[UPDATE_LOG_TYPE.EMAIL_SETTINGS]: 'label-title.email-settings',
	[UPDATE_LOG_TYPE.SMS_SETTINGS]: 'label-title.sms-settings',
	[UPDATE_LOG_TYPE.PRIVACY_SETTINGS]: 'label-title.privacy-settings',
	[UPDATE_LOG_TYPE.CANCEL_REASON_SETTINGS]: 'label-title.cancel-reason-settings',
	[UPDATE_LOG_TYPE.SUB_ADMIN_SETTINGS]: 'label-title.sub-admin',

}

export const LOG_TYPE_VALUE = {
	ADD: 1,
	UPDATE: 2,
	DELETE: 3
}

export const LOG_TYPE_STRING = {
	ADDED: 'button-title.add',
	UPDATED: 'button-title.update',
	DELETED: 'button-title.delete',
}

export const REQUEST_TYPE = {
	ALL: 0,
	RIDE_NOW: 1,
	SCHEDULED: 2,
	CITY_TO_CITY: 3,
	RENTAL: 4,
	AIRPORT: 5,
	ZONE: 6,
	GUEST: 7,
	BIDDING: 8,
	FIXED: 9,
	RIDE_SHARE: 10,
	OPEN_RIDE: 11
}

export const RENTAL_REQUEST_TYPE = {
	PENDING: 0,
	UPCOMING: 1,
    ONGOING: 2
}

export const ADMIN_NOTIFICATION_TYPE = {
	USER_REGISTERED: 1,
	DRIVER_REGISTERED: 2,
	PARTNER_REGISTERED: 3,
	CORPORATE_REGISTERED: 4,
}

export const ADMIN_NOTIFICATION_STRING = {
	[ADMIN_NOTIFICATION_TYPE.USER_REGISTERED]: 'label-title.user-registered',
	[ADMIN_NOTIFICATION_TYPE.DRIVER_REGISTERED]: 'label-title.driver-registered',
	[ADMIN_NOTIFICATION_TYPE.PARTNER_REGISTERED]: 'label-title.partner-registered',
	[ADMIN_NOTIFICATION_TYPE.CORPORATE_REGISTERED]: 'label-title.corporate-registered',
}


export const REDIRECT_NOTIFICATION_ROUTE = {
	[ADMIN_NOTIFICATION_TYPE.USER_REGISTERED]: '/app/users/user',
	[ADMIN_NOTIFICATION_TYPE.DRIVER_REGISTERED]: '/app/users/driver-user',
	[ADMIN_NOTIFICATION_TYPE.PARTNER_REGISTERED]: '/app/users/partner',
	[ADMIN_NOTIFICATION_TYPE.CORPORATE_REGISTERED]: '/app/users/corporate',
}

export const TRIP_STATUS_TYPE_VALUE = {
	USER: 1,
	PROVIDER: 2,
	PARTNER: 3,
	CORPORATE: 4,
	HOTEL: 5,
	DISPATCHER: 6,
	VEHICLE: 7,
	ADMIN: 8,
	HUB: 9,
	OWNER: 100
}

export const TRIP_STATUS_TYPE_VALUE_STRING = {
	[TRIP_STATUS_TYPE_VALUE.USER]: 'label-title.user',
	[TRIP_STATUS_TYPE_VALUE.PROVIDER]: 'label-title.driver',
	[TRIP_STATUS_TYPE_VALUE.PARTNER]: 'label-title.partner',
	[TRIP_STATUS_TYPE_VALUE.CORPORATE]: 'label-title.corporate',
	[TRIP_STATUS_TYPE_VALUE.HOTEL]: 'menu.hotel',
	[TRIP_STATUS_TYPE_VALUE.DISPATCHER]: 'menu.dispatcher',
	[TRIP_STATUS_TYPE_VALUE.VEHICLE]: 'label-title.vehicle',
	[TRIP_STATUS_TYPE_VALUE.ADMIN]: 'label-title.admin',
	[TRIP_STATUS_TYPE_VALUE.OWNER]: 'label-title.vehicle-owner',
}

export const TRIP_STATUS_TIMELIME = {
	CREATED: 0,
	ACCEPTED: 1,
	COMING: 2,
	ARRIVED: 3,
	TRIP_STARTED: 4,
	TRIP_COMPLETED: 5,
	TRIP_CANCELLED: 6,
	OPEN_RIDE_USER_DROPPED: 7,
};

export const TRIP_STATUS_TIMELIME_STRING = {
	[TRIP_STATUS_TIMELIME.CREATED]: 'label-title.created',
	[TRIP_STATUS_TIMELIME.ACCEPTED]: 'label-title.accepted',
	[TRIP_STATUS_TIMELIME.COMING]: 'label-title.coming',
	[TRIP_STATUS_TIMELIME.ARRIVED]: 'label-title.arrived',
	[TRIP_STATUS_TIMELIME.TRIP_STARTED]: 'label-title.started',
	[TRIP_STATUS_TIMELIME.TRIP_COMPLETED]: 'label-title.complete',
	[TRIP_STATUS_TIMELIME.TRIP_CANCELLED]: 'label-title.cancelled',
	[TRIP_STATUS_TIMELIME.OPEN_RIDE_USER_DROPPED]: 'label-title.dropped',
};

export const VEHICLE_TYPE = {
	NORMAL: 0,
	EV: 1,
}

export const ASSIGN_TYPE = {
	ASSIGN: 1,
	REMOVE: 0
}

export const DRIVER_APPROVE_TYPE = {
	NORMAL: 0,
	PARTNER: 1,
	ADMIN: 2,
	RENTAL:3
}

export const BRAND = {
	BRAND: 1,
	BRAND_MODEL: 2,
}

export const VEHICLE_HISTORY_TYPE = {
	ADDED: 0,
	UPDATED: 1,
	ASSIGNED: 2,
	UNASSIGNED: 3,
	PICKED: 4,
	DROPPED: 5,
}

export const VEHICLE_HISTORY_TYPE_STRING = {
	[VEHICLE_HISTORY_TYPE.ADDED]: 'label-title.added',
	[VEHICLE_HISTORY_TYPE.UPDATED]: 'label-title.updated',
	[VEHICLE_HISTORY_TYPE.ASSIGNED]: 'label-title.assigned',
	[VEHICLE_HISTORY_TYPE.UNASSIGNED]: 'label-title.unassigned',
	[VEHICLE_HISTORY_TYPE.PICKED]: 'label-title.picked',
	[VEHICLE_HISTORY_TYPE.DROPPED]: 'label-title.dropped',
}

export const SERVICE_PRICE_TYPE = {
	NORMAL: 0,
	CAR_POOL: 1,
	OPEN_RIDE: 2
}

export const REDIRECT_PERMISSION_TYPE = {
	CUSTOMER: 0,
	DRIVER: 1,
	PARTNER: 2,
	CORPORATE: 3,
	COUNTRY: 4,
	CITY: 5,
	RUNNING: 6,
	COMPLETED: 7,
	SCHDULED: 8,
	CANCELLED: 9,
}

export const REDIRECT_PERMISSION = [
	{ path: '/app/users/user', permission_name: 'user', is_permission: false },
	{ path: '/app/users/driver-user', permission_name: 'driver-user', is_permission: false },
	{ path: '/app/users/partner', permission_name: 'partner', is_permission: false },
	{ path: '/app/users/corporate', permission_name: 'corporate', is_permission: false },
	{ path: '/app/service-types/country-city-info', permission_name: 'country-city-info', is_permission: false },
	{ path: '/app/service-types/country-city-info', permission_name: 'country-city-info', is_permission: false },
	{ path: '/app/requests/request-type/running_requests', permission_name: 'running_requests', is_permission: false },
	{ path: '/app/requests/request-type/completed_requests', permission_name: 'completed_requests', is_permission: false },
	{ path: '/app/requests/request-type/scheduled_requests', permission_name: 'scheduled_requests', is_permission: false },
	{ path: '/app/requests/request-type/cancelled_requests', permission_name: 'cancelled_requests', is_permission: false },
]

export const GUEST_TOKEN = {
	RUNNING: '1',
	INACTIVE: '2',
	EXPIRED: '3',
}

export const GOOGLE_KEY_TYPE = {
	ANDROID_USER_APP_KEYS: 1,
	ANDROID_DRIVER_APP_KEYS: 2,
	IOS_USER_APP_KEYS: 3,
	IOS_DRIVER_APP_KEYS: 4,
	WEB_APP_KEYS: 5,
	FLUTTER_USER_APP_KEYS: 6,
	FLUTTER_DRIVER_APP_KEYS: 7,
}

export const OPEN_HISTORY_TYPE = {
	NORMAL: 1,
	OPEN_RIDE: 2,
}

export const NAME_TYPE = {
	FIRST_NAME: 1,
	LAST_NAME: 2,
}

export const RENT_VEHICLE_STATUS = {
	RUNNING: 0,
	APPROVED: 1,
	REJECTED: 2
}

export enum RequestMainType {
	NORMAL = "NORMAL",
	OPEN_RIDE = "OPEN_RIDE",
	RENTAL_RIDE = "RENTAL_RIDE"
}

export enum RequestSubType {
	RUNNING = "RUNNING",
	COMPLETED = "COMPLETED",
	SCHEDULED = "SCHEDULED",
	CANCELLED = "CANCELLED",
}

export const RENTAL_TRIP_STATUS = {
	CREATED: 0,
    ACCEPTED: 1,
    PAYMENT: 2,
    DRIVER_HANDOVER: 3,
    USER_HANDOVER: 4,
    ADDITIONAL_PAYMENT: 5,
    COMPLETED: 6,
    CANCELLED: 7
}

export const RENTAL_TRIP_STATUS_TIMELIME_STRING = {
	[RENTAL_TRIP_STATUS.CREATED]: 'label-title.created',
	[RENTAL_TRIP_STATUS.ACCEPTED]: 'label-title.accepted',
	[RENTAL_TRIP_STATUS.PAYMENT]: 'label-title.payment-paid',
	[RENTAL_TRIP_STATUS.DRIVER_HANDOVER]: 'label-title.driver-handover',
	[RENTAL_TRIP_STATUS.USER_HANDOVER]: 'label-title.user-handover',
	[RENTAL_TRIP_STATUS.ADDITIONAL_PAYMENT]: 'label-title.additional-payment-paid',
	[RENTAL_TRIP_STATUS.COMPLETED]: 'label-title.complete',
	[RENTAL_TRIP_STATUS.CANCELLED]: 'label-title.cancelled',
};