export const apiColletions = {

    //get report
    "get_trip_report":"/history/get_trip_report",
    "get_details_country_city_wise":"/get_details_country_city_wise",

    //dashboard_detail
    "dashboard_detail" : "/dashboard_detail",
    "get_six_month_earning" : "/get_six_month_earning",
    "get_six_month_trip":"/get_six_month_trip",


    //refund 
    "refund_trip_amount":"/refund_trip_amount",

    //driver 
    "unfreeze_provider":"/unfreeze_provider",
    "add_provider_vehicle":"/add_provider_vehicle",
    "type_is_approved":"/type_is_approved",

    //rent vehicle
    "admin_get_rent_vehicle_list":"/admin_get_rent_vehicle_list",
    "admin_get_rent_vehicle_detail":"/admin_get_rent_vehicle_detail",
    "admin_approve_reject_rent_vehicle":"/admin_approve_reject_rent_vehicle",
    "admin_approve_reject_rental_driver":"/admin_approve_reject_rental_driver",

    //earning
    "trip_earning_statement":"/earning/statement_provider_trip_earning",
    "statement_provider_daily_and_weekly_earning":"/earning/statement_provider_daily_and_weekly_earning",
    "admin_partner_weekly_earning_statement":"/earning/partner_weekly_earning_statement",
    "weekly_and_daily_earning": "/earning/weekly_and_daily_earning",
    "trip_earning": "/earning/trip_earning",
    "admin_partner_weekly_earning": "/earning/partner_weekly_earning",
    "admin_wallet_history": "/earning/wallet_history",
    "admin_transaction_history": "/earning/transaction_history",
    "redeem_point_history": "/earning/redeem_point_history",

    //service-type
    "service_type_list":"/get_type_list",
    "add_service_type":"/add_service_type",
    "edit_service_type":"/edit_service_type",
    "fetch_service_type":"/fetch_service_type",

    // car-rent-service
    "add_edit_car_rent_type":"/add_edit_car_rent_type",
    "fetch_car_rent_type":"/fetch_car_rent_type",
    "add_edit_car_rent_brand_model": "/add_edit_car_rent_brand_model",
    "fetch_car_rent_brand_model":"/fetch_car_rent_brand_model",
    "add_edit_car_rent_feature":"/add_edit_car_rent_feature",
    "fetch_car_rent_feature":"/fetch_car_rent_feature",
    "add_edit_car_rent_spedification":"/add_edit_car_rent_spedification",
    "fetch_car_rent_specification":"/fetch_car_rent_specification",
    
    //coutry
    "get_All_country_list":"/get_country_json_list",
    "fetch_country_details":"/fetch_country_details",
    "check_country_exists":"/check_country_exists",
    "add_country_details":"/add_country_details",
    "update_country_details":"/update_country_details",
    "get_country_code":"/get_country_code",
    
    //city
    "admin_get_city_list":"/fetch_city_list",
    "admin_add_city_details":"/add_city_details",
    "admin_update_city_details":"/update_city_details",
    "admin_fetch_destination_city":"/fetch_destination_city",
    "admin_check_city_avaliable":"/check_city_avaliable",

    //city-type assocation
    "admin_fetch_service_price":"/fetch_service_price",
    "admin_fetch_unique_types":"/fetch_unique_types",
    "update_service_price":"/update_service_price",
    "add_service_price":"/add_service_price",

    //all zone detail
    "admin_fetch_airport_details":"/fetch_airport_details",
    "admin_fetch_cityzone_details":"/fetch_cityzone_details",
    "admin_fetch_redzone_details":"/fetch_redzone_details",
    "admin_update_zone_details":"/update_zone_details",
    "admin_update_airport_details":"/update_airport_details",
    "admin_update_redzone_details":"/update_redzone_details",
    "add_zone_queue":"/add_zone_queue",

    //zone price 
    "admin_fetch_airport_price":"/fetch_airport_price",
    "admin_fetch_zone_price":"/fetch_zone_price",
    "admin_fetch_city_price":"/fetch_city_price",
    "check_zone_price_exist":"/check_zone_price_exist",

    //rental price 
    "admin_fetch_car_rental":"/fetch_car_rental",

    //rich surge 
    "admin_fetch_rich_surge":"/fetch_rich_surge",

    //update surge hour
    "update_surge_hour":"/update_surge_hour",

    //Common
    "get_countries": "/country_list",
    "get_user_setting_detail": "/get_user_setting_detail",
    "get_country_timezone":"/get_country_timezone",
    
    // auth
    "login":"/login",
    "logout":"/sign_out",
    "forgot_password":"/forgot_password",
    "new_password":"/update_password",

    //sub-admin
    "admin_url_list":"/url_list",
    "add_new_admin":"/add_new_admin",
    "admin_list":"/list",
    "update_admin_details":"/update_admin_details",
    "delete_admin":"/delete_admin",
    "get_permissions":"/get_permissions",

    //map view
    "provider_list_for_map":"/provider_list_for_map",
    "fetch_vehicle_type_list":"/fetch_vehicle_type_list",
    "fetch_provider_list":"/fetch_provider_list",
    "fetch_all_city":"/fetch_all_city",
    "fetch_heat_map":"/fetch_heat_map",

    //mass notification
    "fetch_notification_list":"/mass_notifications/fetch_notification_list",
    "send_mass_notification":"/mass_notifications/send_mass_notification",

    //review
    "reviews_list":"/reviews_list",

    //settings
    "admin_get_setting_details":"/get_setting_details",
    "admin_update_setting_details":"/update_setting_details",
    "admin_upload_logo_images":"/upload_logo_images",
    "uplodad_user_panel_images":"/uplodad_user_panel_images",

    //language
    "get_language_list":"/get_language_list",
    "add_new_language":"/add_new_language",
    "edit_language":"/edit_language",
    "delete_language":"/delete_language",

    //request
    "get_trip_list":"/history/get_trip_list",
    "get_trip_detail":"/get_trip_detail",
    "set_trip_status_by_admin":"/set_trip_status_by_admin",
    "trip_cancel_by_admin":"/trip_cancel_by_admin",
    "trip_complete_by_admin":"/trip_complete_by_admin",
    "scheduled_trip_cancel_by_admin":"/scheduled_trip_cancel_by_admin",
    "chat_history":"/chat_history",
    "generate_firebase_access_token":"/generate_firebase_access_token",
    "trip_pay_payment":"/trip_pay_payment",

    //promocode
    "admin_fetch_promo_list":"/fetch_promo_list",
    "admin_promo_used_info":"/promo_used_info",
    "admin_add_promo":"/add_promo",
    "admin_delete_promocode":"/delete_promocode",
    "admin_update_promo_details":"/update_promo_details",

    //document
    "admin_get_document_list":"/get_document_list",
    "admin_add_document_details":"/add_document_details",
    "admin_update_document_details":"/update_document_details",

    //sms setting
    "fetch_sms_details":"/fetch_sms_details",
    "update_sms_details":"/update_sms_details",

    //email setting
    "admin_get_email_title":"/get_email_title",
    "admin_fetch_email_detail":"/fetch_email_detail",
    "update_email_detail":"/update_email_detail",

    // user and driver list
    "get_user_detail_list" : "/user_details_list",
    "get_zone_provider_list" : "/get_zone_provider_list",
    
    // wsal apis
    "check_wsal_status":"/check_wsal_status",

    // Filter list api  
    "admin_all_type_list" : "/fetch_type_list",
    "admin_rent_car_owner_list" : "/fetch_rent_car_owner_list",

    // Edit_data_api
    "fetch_type_details" : "/fetch_type_details",
    "service_type_trip_list" : "/history/service_type_trip_list",

    // Update List By Type 

    "update_type_details" : "/update_type_details",
    
    // Delete List Item Data 

    "delete_type_details" : "/delete_type_details",

    // Add Amount in Wallet 

    "add_wallet_amount" : "/add_wallet_amount",

    // Vehicle Document List

    "fetch_document_list" : "/fetch_document_list",
    "update_document_details" : "/type_update_document",
    "type_update_vehicle" : "/type_update_vehicle", 

    // Add New By Type 

    "add_new_type" : "/add_new_type",

    // Referral History

    "fetch_referral_list" : "/fetch_referral_list",
    "referral_list" : "/referral_list",
    "referral_details" : "/referral_details",

    //Export History
    "get_export_history_list":"/history/get_export_history_list",
    "delete_export_file":"/history/delete_export_file",

    //cancellation reason

    "add_cancellation_reason" : "/add_cancellation_reason",
    "get_cancellation_reason" : "/get_cancellation_reason",
    "update_cancellation_reason" : "/update_cancellation_reason",
    "delete_cancellation_reason" : "/delete_cancellation_reason",


    //logs
    "get_change_logs": "/get_change_logs",


    //notification

    "get_admin_notifications":"/get_admin_notifications",
    "remove_notification":"/remove_notification ",

    //vehicle

    "get_admin_vehicles":"/get_admin_vehicles",
    "add_admin_vehicle":"/add_admin_vehicle",
    "fetch_vehicle_admin_types":"/fetch_vehicle_admin_types",
    "admin_add_provider":"/admin_add_provider",
    "fetch_admin_vehicles":"/fetch_admin_vehicles",
    "get_vehicle_brand_model":"/get_vehicle_brand_model",
    "get_vehicle_history":"/get_vehicle_history",

    //Hub
    "assign_unassign_vehicle_to_hub":"/assign_unassign_vehicle_to_hub",
    "get_hub_providers":"/get_hub_providers",
    "get_hub_users":"/get_hub_users",
    "add_hub_user":"/add_hub_user",
    "update_hub_user":"/update_hub_user",
    "delete_hub_user":"/delete_hub_user",
    "add_edit_vehicle_model_brand": "/add_edit_vehicle_model_brand",
    "get_all_hub_list": "/get_all_hub_list",
    "get_hub_list": "/get_hub_list",

    //send invoice email
    "send_invoice_mail" : "/send_invoice_mail",

    //guest token,
    "fetch_guest_tokens_list" :"/fetch_guest_tokens_list",
    "add_update_guest_token_new" : "/add_update_guest_token_new",

    //before login settings detils
    "get_admin_setting_detail":"/get_admin_setting_detail",
    
    //whatsapp
    "whatsapp_logout": "/whatsapp/logout",

    //open ride
    "open_ride_cancel_by_admin": "/open_ride_cancel_by_admin",
    "scheduled_open_ride_cancel_by_admin": "/scheduled_open_ride_cancel_by_admin",
    "openride_get_trip_list": "/history/openride_get_trip_list",
    "openride_get_trip_detail": "/openride_get_trip_detail",
    "openride_trip_earning": "/earning/openride_trip_earning",
    "open_ride_statement_provider_trip_earning":"/open_ride_statement_provider_trip_earning",
    'openride_get_trip_report':"/history/openride_get_trip_report",

    //subscription
    'check_subscription' : '/check_subscription',
    'create_subscription_session': '/create_subscription_session',

    //banner api
    "add_banner":'/add_banner',
    "update_banner":'/update_banner',
    "delete_banner":'/delete_banner',
    "get_banner_list" : '/get_banner_list',

    // rental trip apis
    "get_rental_trip_list": "/history/get_rental_trip_list",
    "get_rental_trip_detail":"/get_rental_trip_detail",
    "rental_trip_cancel_by_admin":"/rental_trip_cancel_by_admin",
    "refund_rental_trip_amount":"/refund_rental_trip_amount",
    "get_rental_trip_report":"/history/get_rental_trip_report",
    "rental_trip_earning": "/earning/rental_trip_earning"

}