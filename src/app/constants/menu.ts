import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/auth.roles';
const adminRoot = environment.adminRoot;

export interface IMenuItem {
  id?: string;
  icon?: string;
  role?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
  roles?: UserRole[];
}

const data: IMenuItem[] = [
  {
    icon: 'iconsminds-dashboard',
    label: 'menu.dashboards',
    to: `${adminRoot}/dashboard`,
    roles: [UserRole.Admin, UserRole.Editor],
    role: 'dashboard'
  },
  {
    icon: 'iconsminds-add-user',
    label: 'menu.request',
    to: `${adminRoot}/requests`,
    subs: [
      {
        icon: 'simple-icon-check',
        label: 'menu.request',
        to: `${adminRoot}/requests/request-type`,
        subs: [
          {
            icon: 'iconsminds-loading-3',
            label: 'menu.running_requests',
            to: `${adminRoot}/requests/request-type/running_requests`,
            role: 'running_requests'
          },
          {
            icon: 'iconsminds-yes',
            label: 'menu.completed_requests',
            to: `${adminRoot}/requests/request-type/completed_requests`,
            role: 'completed_requests'
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'menu.scheduled_requests',
            to: `${adminRoot}/requests/request-type/scheduled_requests`,
            role: 'scheduled_requests'
          },
          {
            icon: 'iconsminds-arrow-x-left',
            label: 'menu.cancelled_requests',
            to: `${adminRoot}/requests/request-type/cancelled_requests`,
            role: 'cancelled_requests'
          },
          {
            icon: 'iconsminds-library',
            label: 'menu.report',
            to: `${adminRoot}/requests/request-type/report`,
            role: 'report'
          },
        ] 
      },
      {
        icon: 'simple-icon-check',
        label: 'menu.open-ride',
        to: `${adminRoot}/requests/open-ride`,
        subs: [
          {
            icon: 'iconsminds-loading-3',
            label: 'menu.running_requests',
            to: `${adminRoot}/requests/open-ride/open_ride_running_requests`,
            role: 'open_ride_running_requests'
          },
          {
            icon: 'iconsminds-yes',
            label: 'menu.completed_requests',
            to: `${adminRoot}/requests/open-ride/open_ride_completed_requests`,
            role: 'open_ride_completed_requests'
          },
          {
            icon: 'iconsminds-calendar-4',
            label: 'menu.scheduled_requests',
            to: `${adminRoot}/requests/open-ride/open_ride_scheduled_requests`,
            role: 'open_ride_scheduled_requests'
          },
          {
            icon: 'iconsminds-arrow-x-left',
            label: 'menu.cancelled_requests',
            to: `${adminRoot}/requests/open-ride/open_ride_cancelled_requests`,
            role: 'open_ride_cancelled_requests'
          },
          {
            icon: 'iconsminds-library',
            label: 'menu.open_ride_report',
            to: `${adminRoot}/requests/open-ride/open_ride_report`,
            role: 'open_ride_report'
          },
        ] 
      },
      {
        icon: 'simple-icon-check',
        label: 'menu.rental-request',
        to: `${adminRoot}/requests/rental-request`,
        subs: [
          {
            icon: 'iconsminds-loading-3',
            label: 'menu.running_requests',
            to: `${adminRoot}/requests/rental-request/rental_request_running_requests`,
            role: 'rental_request_running_requests'
          },
          {
            icon: 'iconsminds-yes',
            label: 'menu.completed_requests',
            to: `${adminRoot}/requests/rental-request/rental_request_completed_requests`,
            role: 'rental_request_completed_requests'
          },
          {
            icon: 'iconsminds-arrow-x-left',
            label: 'menu.cancelled_requests',
            to: `${adminRoot}/requests/rental-request/rental_request_cancelled_requests`,
            role: 'rental_request_cancelled_requests'
          },
          {
            icon: 'iconsminds-library',
            label: 'menu.rental-request-report',
            to: `${adminRoot}/requests/rental-request/rental_request_report`,
            role: 'rental_request_report'
          },
        ] 
      },
      {
        label: 'menu.review',
        to: `${adminRoot}/requests/reviews`,
        subs: [
          // {
          //   icon: 'simple-icon-like',
          //   label: 'menu.review',
          //   to: `${adminRoot}/pages/profile/review`,
          // },
          // {
          //   icon: 'simple-icon-like',
          //   label: 'menu.ebarReview',
          //   to: `${adminRoot}/pages/profile/ebarReview`,
          // },
          {
            icon: 'simple-icon-star',
            label: 'menu.review',
            to: `${adminRoot}/requests/reviews/review`,
            role: 'reviews'
          },
          // {
          //   icon: 'simple-icon-like',
          //   label: 'menu.e-review',
          //   to: `${adminRoot}/requests/reviews/e-review`,
          // },
          // {
          //   icon: 'iconsminds-close',
          //   label: 'menu.cancellation-reason',
          //   to: `${adminRoot}/requests/reviews/cancellation-reason`,
          // },
        ],
      },
    ],
  },
  {
    icon: 'iconsminds-map2',
    label: 'menu.map-view',
    to: `${adminRoot}/map-views`,
    subs: [
      {
        icon: 'iconsminds-geo2',
        label: 'menu.drivers-map-view',
        to: `${adminRoot}/map-views/drivers-map-view`,
        role: 'mapview'
      },
      {
        icon: 'iconsminds-map-marker',
        label: 'menu.driver-tracking',
        to: `${adminRoot}/map-views/driver-tracking`,
        role: 'provider_track'
      },
      {
        icon: 'iconsminds-road-2',
        label: 'menu.all-cities',
        to: `${adminRoot}/map-views/all-cities`,
        role: 'all_city'
      },
      {
        icon: 'iconsminds-geo2',
        label: 'menu.heat-map',
        to: `${adminRoot}/map-views/heat-map`,
        role: 'heat_map'
      },
      {
        icon: 'iconsminds-geo2',
        label: 'menu.hub-map',
        to: `${adminRoot}/map-views/hub-map`,
        role: 'hub_map'
      },
    ],
  },
  {
    icon: 'iconsminds-receipt-4',
    label: 'menu.earnings',
    to: `${adminRoot}/earnings`,
    subs: [
      {
        icon: 'simple-icon-layers',
        label: 'menu.earning',
        to: `${adminRoot}/earnings/order`,
        subs: [
          {
            icon: 'iconsminds-basket-coins',
            label: 'menu.trip-earning',
            to: `${adminRoot}/earnings/order/trip-earning`,
            role: 'trip-earning'
          },
          {
            icon: 'iconsminds-basket-coins',
            label: 'menu.open-ride-trip-earning',
            to: `${adminRoot}/earnings/order/open-ride-trip-earning`,
            role: 'open-ride-trip-earning'
          },
          {
            icon: 'iconsminds-basket-coins',
            label: 'menu.rental-request-earning',
            to: `${adminRoot}/earnings/order/rental-request-earning`,
            role: 'rental-request-earning'
          },
          {
            icon: 'iconsminds-coins',
            label: 'menu.daily-earning',
            to: `${adminRoot}/earnings/order/daily-earning`,
            role: 'daily-earning'
          },
          {
            icon: 'iconsminds-dollar-sign-2',
            label: 'menu.weekly-earning',
            to: `${adminRoot}/earnings/order/weekly-earning`,
            role: 'weekly-earning'
          },
          {
            icon: 'iconsminds-money-bag',
            label: 'menu.partner-weekly-payments',
            to: `${adminRoot}/earnings/order/partner-weekly-payments`,
            role: 'partner-weekly-payments'
          },
        ],
      },
      {
        icon: 'simple-icon-layers',
        label: 'menu.wallet',
        to: `${adminRoot}/earnings/wallet`,
        subs: [
          {
            icon: 'simple-icon-wallet',
            label: 'menu.wallet-history',
            to: `${adminRoot}/earnings/wallet/wallet-history`,
            role: 'wallet-history'
          },
          {
            icon: 'simple-icon-credit-card',
            label: 'menu.transaction-history',
            to: `${adminRoot}/earnings/wallet/transaction-history`,
            role: 'transaction_history'
          },
          {
            icon: 'simple-icon-badge',
            label: 'menu.redeem-history',
            to: `${adminRoot}/earnings/wallet/redeem-history`,
            role: 'redeem_history'
          },
        ],
      },
      // {
      //   icon: 'iconsminds-handshake',
      //   label: 'menu.referral',
      //   to: `${adminRoot}/earnings/referral`,
      //   subs: [
      //     {
      //       icon: 'iconsminds-handshake',
      //       label: 'menu.user-referral',
      //       to: `${adminRoot}/earnings/referral/user-referral`,
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: 'iconsminds-ship',
    label: 'menu.business-info',
    to: `${adminRoot}/service-types`,
    subs: [
      {
        icon: 'iconsminds-car',
        label: 'menu.type',
        to: `${adminRoot}/service-types/type`,
        role: 'type'
      },
      {
        icon: 'simple-icon-globe',
        label: 'menu.country-city',
        to: `${adminRoot}/service-types/country-city-info`,
        role: 'country-city-info'
      },
      {
        icon: 'iconsminds-billing',
        label: 'menu.pricing',
        to: `${adminRoot}/service-types/city-type`,
        role: 'city-type'
      },
      {
        icon: 'iconsminds-jeep',
        label: 'menu.manage-vehicle',
        to: `${adminRoot}/service-types/manage-vehicle`,
        role: 'manage-vehicle'
      },
      {
        label: 'menu.rent-car-service',
        to: `${adminRoot}/service-types/rent-car-service`,
        subs: [
          {
            icon: 'iconsminds-car',
            label: 'menu.rent-car-price',
            to: `${adminRoot}/service-types/rent-car-service/rent-car-price`,
            role: 'rent-car-price'
          },
          {
            icon: 'simple-icon-grid',
            label: 'menu.rent-car-specification',
            to: `${adminRoot}/service-types/rent-car-service/rent-car-specification`,
            role: 'rent-car-specification'
          }
        ]
      }
    ],
  },
  {
    icon: 'iconsminds-user',
    label: 'menu.users',
    to: `${adminRoot}/users`,
    subs: [
      {
        icon: 'simple-icon-people',
        label: 'menu.user',
        to: `${adminRoot}/users/user`,
        role: 'user'
      },
      {
        icon: 'iconsminds-car',
        label: 'menu.driver-user',
        to: `${adminRoot}/users/driver-user`,
        role: 'driver-user'
      },
      {
        icon: 'iconsminds-scooter',
        label: 'menu.dispatcher',
        to: `${adminRoot}/users/dispatcher`,
        role: 'dispatcher'
      },
      {
        icon: 'iconsminds-office',
        label: 'menu.corporate',
        to: `${adminRoot}/users/corporate`,
        role: 'corporate'
      },
      {
        icon: 'iconsminds-hotel',
        label: 'menu.hotel',
        to: `${adminRoot}/users/hotel`,
        role: 'hotel'
      },
      {
        icon: 'iconsminds-testimonal',
        label: 'menu.hub',
        to: `${adminRoot}/users/hub`,
        role: 'hub'
      },
      {
        icon: 'iconsminds-handshake',
        label: 'menu.partner',
        to: `${adminRoot}/users/partner`,
        role: 'partner'
      },
      {
        icon: 'iconsminds-network',
        label: 'menu.rent-car-owner',
        to: `${adminRoot}/users/rent-car-owner`,
        role: 'rent-car-owner'
      },
      {
        icon: 'iconsminds-administrator',
        label: 'menu.sub-admin',
        to: `${adminRoot}/users/sub-admin`,
        role: 'admin_list'
      }
    ]
  },
  // {
  //       // icon: 'simple-icon-bubbles',
  //       icon: 'iconsminds-speach-bubbles',
  //       label: 'menu.chat',
  //       to: `${adminRoot}/applications/chat`,
  // },
  // {
  //   icon: 'iconsminds-hotel',
  //   label: 'menu.services',
  //   to: `${adminRoot}/services`,
  //   subs: [
  //     {
  //       icon: 'iconsminds-scooter',
  //       label: 'menu.dispatcher',
  //       to: `${adminRoot}/services/dispatcher`,
  //       role: 'dispatcher'
  //     },
  //     {
  //       icon: 'iconsminds-office',
  //       label: 'menu.corporate',
  //       to: `${adminRoot}/services/corporate`,
  //       role: 'corporate'
  //     },
  //     {
  //       icon: 'iconsminds-hotel',
  //       label: 'menu.hotel',
  //       to: `${adminRoot}/services/hotel`,
  //       role: 'hotel'
  //     },
  //     {
  //       icon: 'iconsminds-money-bag',
  //       label: 'menu.partner',
  //       to: `${adminRoot}/services/partner`,
  //       role: 'partner'
  //     },
  //   ]
  // },
  {
    icon: 'iconsminds-three-arrow-fork',
    label: 'menu.setting',
    to: `${adminRoot}/setting`,
    // roles: [UserRole.Editor],
    subs: [
      {
        icon: 'simple-icon-layers',
        label: 'menu.basic-settings',
        to: `${adminRoot}/setting/basic-settings`,
        subs: [
          {
            icon: ' iconsminds-administrator',
            label: 'menu.admin',
            to: `${adminRoot}/setting/basic-settings/admin`,
            role: 'admin'
          },
          {
            icon: 'iconsminds-files',
            label: 'menu.document',
            to: `${adminRoot}/setting/basic-settings/document`,
            role: 'document'
          },
          {
            icon: 'iconsminds-box-with-folders',
            label: 'menu.language',
            to: `${adminRoot}/setting/basic-settings/language`,
            role: 'language'
          },
          {
            icon: 'iconsminds-megaphone',
            label: 'menu.banner',
            to: `${adminRoot}/setting/basic-settings/banner`,
            role: 'banner'
          },

        ],
      },
      {
        icon: 'simple-icon-layers',
        label: 'menu.discount',
        to: `${adminRoot}/setting/discount`,
        subs: [
          {
            icon: 'iconsminds-information',
            label: 'menu.promo-code',
            to: `${adminRoot}/setting/discount/offer`,
            role: 'offer'
          },
          {
            icon: 'iconsminds-gift-box',
            label: 'menu.referral-code',
            to: `${adminRoot}/setting/discount/referral-code`,
            role : 'referral_code'
          },
        ],
      },
      {
        icon: 'simple-icon-layers',
        label: 'menu.other-settings',
        to: `${adminRoot}/setting/other-settings`,
        subs: [
          {
            icon: 'iconsminds-mail-settings',
            label: 'menu.email-settings',
            to: `${adminRoot}/setting/other-settings/email-settings`,
            role: 'email-settings'
          },
          {
            icon: 'iconsminds-speach-bubble-dialog',
            label: 'menu.sms-settings',
            to: `${adminRoot}/setting/other-settings/sms-settings`,
            role: 'sms-settings'
          },
          {
            icon: 'simple-icon-screen-smartphone',
            label: 'menu.mass-notification',
            to: `${adminRoot}/setting/other-settings/mass-notification`,
            role: 'mass-notification'
          },
          {
            icon: 'iconsminds-letter-open',
            label: 'menu.terms_and_privacy',
            to: `${adminRoot}/setting/other-settings/terms_and_privacy_setting`,
            role: 'terms_and_privacy_setting'
          },
          {
            icon: 'iconsminds-close',
            label: 'menu.cancellation-reason',
            to: `${adminRoot}/setting/other-settings/cancellation-reason`,
            role: 'cancellation-reason'
          },
          {
            icon: 'simple-icon-chart',
            label: 'menu.logs',
            to: `${adminRoot}/setting/other-settings/logs`,
            role: 'logs'
          },{
            icon: 'simple-icon-user-following',
            label: 'menu.guest_token',
            to: `${adminRoot}/setting/other-settings/guest-token`,
            role: 'guest-token'
          },
        ],
      },
    ],
  }
];
export default data;
