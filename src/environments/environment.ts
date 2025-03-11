// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { UserRole } from '../app/shared/auth.roles';

export const environment = {

  // API_URL: '',
  // IMAGE_URL: '',
  // LANGUAGE_URL: '',
  // BASE_URL: '',
  // SOCKET_URL: '',
  // HISTORY_API_URL: '',
  // WHATSAPP_API_URL: '',
  // MASS_NOTIFICATION_API_URL: '',


  // API_URL: 'http://13.203.141.238:5000/admin',
  // IMAGE_URL: 'http://13.203.141.238:5000/',
  // BASE_URL: 'http://13.203.141.238:5000/',
  // SOCKET_URL: 'http://13.203.141.238:5000/',
  // LANGUAGE_URL: 'http://13.203.141.238:5000/',
  // HISTORY_API_URL: 'http://13.203.141.238:5001',
  // WHATSAPP_API_URL: 'http://13.203.141.238:5004',
  // MASS_NOTIFICATION_API_URL: 'http://13.203.141.238:5003',

  API_URL: 'http://localhost:5000/admin',
  IMAGE_URL: 'http://localhost:5000/',
  BASE_URL: 'http://localhost:5000/',
  SOCKET_URL: 'http://localhost:5000/',
  LANGUAGE_URL: 'http://localhost:5000/',
  HISTORY_API_URL: 'http://localhost:5001',
  WHATSAPP_API_URL: 'http://localhost:5004',
  MASS_NOTIFICATION_API_URL: 'http://localhost:5003',

  
  api_encryption_decryption: false,
  production: false,
  isJivoChat: false,
  isWhatsAppChat: false,
  buyUrl: 'https://1.envato.market/6NV1b',
  SCARF_ANALYTICS: false,
  adminRoot: '/app',
  apiUrl: 'https://api.coloredstrategies.com',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1442,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'vien-themecolor',
  isMultiColorActive: true,
  defaultColor: 'light.blueyale',
  isDarkSwitchActive: true,
  defaultDirection: 'ltr',
  themeRadiusStorageKey: 'vien-themeradius',
  isAuthGuardActive: true,
  defaultRole: UserRole.Admin,
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  }
};
