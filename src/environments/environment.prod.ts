// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { UserRole } from '../app/shared/auth.roles';

export const environment = {
  production: true,
  isJivoChat: false,
  isWhatsAppChat: false,
  buyUrl : "https://1.envato.market/6NV1b",
  SCARF_ANALYTICS : false,
  adminRoot: '/app',
  apiUrl:  'https://api.coloredstrategies.com',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1442,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'vien-themecolor',
  isMultiColorActive: true,

  //live server
  // API_URL: '',
  // HISTORY_API_URL: '',
  // IMAGE_URL: '',
  // LANGUAGE_URL: '',
  // MASS_NOTIFICATION_API_URL: '',
  // BASE_URL: '',
  // SOCKET_URL: '',
  // WHATSAPP_API_URL: '',

  API_URL: 'http://wow.codesquadz.com:5000/admin',
  IMAGE_URL: 'http://wow.codesquadz.com:5000/',
  BASE_URL: 'http://wow.codesquadz.com:5000/',
  SOCKET_URL: 'http://wow.codesquadz.com:5000/',
  LANGUAGE_URL: 'http://wow.codesquadz.com:5000/',
  HISTORY_API_URL: 'http://wow.codesquadz.com:5001',
  WHATSAPP_API_URL: 'http://wow.codesquadz.com:5004',
  MASS_NOTIFICATION_API_URL: 'http://wow.codesquadz.com:5003',


  /*
  Color Options:
  'light.blueyale', 'light.blueolympic', 'light.bluenavy', 'light.greenmoss', 'light.greenlime', 'light.yellowgranola', 'light.greysteel', 'light.orangecarrot', 'light.redruby', 'light.purplemonster'
  'dark.blueyale', 'dark.blueolympic', 'dark.bluenavy', 'dark.greenmoss', 'dark.greenlime', 'dark.yellowgranola', 'dark.greysteel', 'dark.orangecarrot', 'dark.redruby', 'dark.purplemonster'
  */
  api_encryption_decryption:false,
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
