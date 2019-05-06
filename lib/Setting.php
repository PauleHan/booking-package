<?php
    if(!defined('ABSPATH')){
    	exit;
	}
    
    class booking_package_setting {
        
        public $prefix = null;
        
        public $pluginName = null;
        
        public $booking_sync =  array(   
            "iCal" => array(
                'ical_active' => array('name' => 'Active', 'value' => '0', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('1' => 'Enable', '0' => 'Disable')), 
                'ical_token' => array('name' => 'iCal URL', 'value' => '', 'inputLimit' => 1, 'inputType' => 'CUSTOMIZE')
                
            ),
            /**
            "Google_Calendar" => array(
                'googleCalendar_active' => array('name' => 'Active', 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('1' => 'Enable', '0' => 'Disable')), 
                'googleCalendar_json' => array('name' => 'Service account', 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXTAREA')
            )
            **/
        );
        
        public $member_setting = array(
            'function_for_member' => array('name' => 'User account', 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'CHECK', 'valueList' => array('0' => 'Enable')), 
            'reject_non_membder' => array('name' => 'Reject non-user account bookings', 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'CHECK', 'valueList' => array('0' => 'Enable')), 
            'visitors_registration_for_member' => array('name' => 'User registration from visitors', 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'CHECK', 'valueList' => array('0' => 'Enable')), 
            'check_email_for_member' => array('name' => 'Confirm whether the user\'s email address exists', 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'CHECK', 'valueList' => array('0' => 'Enable')), 
            'accept_subscribers_as_users' => array('name' => 'Approve subscriber as users', 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'CHECK', 'valueList' => array('0' => 'Enable')), 
            'subject_email_for_member' => array('Subject of email sent when confirming email address' => 'Active', 'value' => '', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'valueList' => array()), 
            'body_email_for_member' => array('Body of email sent when confirming email address' => 'Active', 'value' => '', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXTAREA', 'valueList' => array()), 
        );
        
        public $formInputType = array(
            'id' => array('key' => 'id', 'name' => 'Unique ID', 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', "class" => ""),
            'name' => array('key' => 'name', 'name' => 'Name', 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', "class" => ""),
            'value' => array('key' => 'value', 'name' => 'Value', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', "class" => "hidden_panel"),
            'description' => array('key' => 'description', 'name' => 'Description', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', "class" => ""),
            'active' => array('key' => 'active', 'name' => 'Active', 'value' => 'true', 'inputLimit' => 2, 'inputType' => 'CHECK', 'valueList' => array('true' => 'on'), "class" => ""),
            'required' => array('key' => 'required', 'name' => 'Required', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => 'Yes', 'false' => 'No'), "class" => ""),
            'isName' => array('key' => 'isName', 'name' => 'Is Name', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => 'Yes', 'false' => 'No')),
            'isAddress' => array('key' => 'isAddress', 'name' => 'Is a location in Google Calendar', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => 'Yes', 'false' => 'No'), "class" => ""),
            'isEmail' => array('key' => 'isEmail', 'name' => 'Is Email', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => 'Yes', 'false' => 'No'), "class" => ""),
            'type' => array('key' => 'type', 'name' => 'Type', 'value' => 'TEXT', 'inputLimit' => 1, 'inputType' => 'SELECT', 'valueList' => array('TEXT' => 'TEXT', 'SELECT' => 'SELECT', 'CHECK' => 'CHECK', 'RADIO' => 'RADIO', 'TEXTAREA' => 'TEXTAREA'), "class" => ""),
            'options' => array('key' => 'options', 'name' => 'Options', 'value' => '', 'inputLimit' => 2, 'inputType' => 'OPTION')
        );
        
        public $form = array(
        	array('id' => 'firstname', 'name' => 'First name', 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'true', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
        	array('id' => 'lastname', 'name' => 'Last name', 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'true', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
        	array('id' => 'email', 'name' => 'Email', 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'false', 'isAddress' => 'false', 'isEmail' => 'true', 'isTerms' => 'false'),
        	array('id' => 'phone', 'name' => 'Phone', 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'false', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
        	array('id' => 'zip', 'name' => 'Zip', 'value' => '', 'type' => 'TEXT', 'options' => '', 'required' => 'false', 'isName' => 'false', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
        	array('id' => 'address', 'name' => 'Address', 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'false', 'isName' => 'false', 'isAddress' => 'true', 'isEmail' => 'false', 'isTerms' => 'false'),
        	array('id' => 'terms', 'name' => 'Terms of Service', 'value' => '', 'type' => 'CHECK', 'active' => 'true', 'options' => 'I agree', 'required' => 'false', 'isName' => 'false', 'isAddress' => 'true', 'isEmail' => 'false', 'isTerms' => 'true'),
        );
        					
        public $email_message = array(
            "mail_new_admin" => array("key" => "mail_new_admin", "subject" => "", "content" => "", 'enable' => '1', 'format' => 'html', 'title' => 'New booking', 'message' => 'Email is sending to Admin after Making of booking.'), 
            /** "mail_new_visitor" => array("key" => "mail_new_visitor", "subject" => "", "content" => "", 'enable' => '1', 'format' => 'html', 'title' => 'New booking(Visitor)', 'message' => 'Email is sending to visitor after Making of booking.'), **/
            "mail_approved" => array("key" => "mail_approved", "subject" => "", "content" => "", 'enable' => '1', 'format' => 'html', 'title' => 'Approval of booking', 'message' => 'Email is sending to visitor after Approval of booking.'),
            "mail_pending" => array("key" => "mail_pending", "subject" => "", "content" => "", 'enable' => '1', 'format' => 'html', 'title' => 'Pending of booking', 'message' => 'Email is sending to Visitor after Booking set as Pending.'),
            /**"mail_cancel" => array("key" => "mail_cancel", "subject" => "", "content" => "", 'enable' => '1', 'format' => 'html', 'title' => 'Cancellation of booking', 'message' => 'Email is sending to Visitor after Deletion of booking.'),**/
            "mail_deleted" => array("key" => "mail_deleted", "subject" => "", "content" => "", 'enable' => '1', 'format' => 'html', 'title' => 'Deletion of booking', 'message' => 'Email is sending to Visitor after Deletion of booking.'),
            "mail_canceled_by_visitor_user" => array("key" => "mail_canceled_by_visitor_user", "subject" => "", "content" => "", 'enable' => '1', 'format' => 'html', 'title' => 'Cancellation of booking by visitor and user', 'message' => 'Email is sending to visitor or user after Cancellation of booking.')
        );
        
        /**
        public $calendarAccount = array(
            'name' => array('key' => 'name', 'name' => 'Name', 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'option' => 0),
            'type' => array('key' => 'type', 'name' => 'Select booking business', 'value' => 'day', 'inputLimit' => 1, 'inputType' => 'RADIO', 'option' => 1, 'optionsList' => array('cost', 'numberOfRoomsAvailable', 'numberOfPeopleInRoom', 'includeChildrenInRoom', 'expressionsCheck'), 'valueList' => array('day' => 'Booking is completed within 24 hours (hair salon, hospital etc.)', 'hotel' => 'Accommodation (hotels, campgrounds, etc.)')),
            'cost' => array('key' => 'cost', 'name' => 'Cost per night', 'disabled' => 1, 'value' => '0', 'inputLimit' => 1, 'inputType' => 'TEXT', 'option' => 0),
            'numberOfRoomsAvailable' => array('key' => 'numberOfRoomsAvailable', 'name' => 'Number of rooms available', 'disabled' => 1, 'value' => '1', 'inputLimit' => 2, 'inputType' => 'TEXT', 'option' => 0), 
            'numberOfPeopleInRoom' => array('key' => 'numberOfPeopleInRoom', 'name' => 'Maximum number of people staying in one room', 'disabled' => 1, 'value' => '2', 'inputLimit' => 2, 'inputType' => 'TEXT', 'option' => 0), 
            'includeChildrenInRoom' => array('key' => 'includeChildrenInRoom', 'name' => 'Include children in the maximum number of people in the room', 'disabled' => 1, 'value' => 0, 'inputLimit' => 1, 'inputType' => 'RADIO', 'option' => 0, 'valueList' => array(1 => 'Include', 0 => 'Exclude')),
            'expressionsCheck' => array('key' => 'expressionsCheck', 'name' => 'Expressions of arrival and departure', 'disabled' => 1, 'value' => 0, 'inputLimit' => 1, 'inputType' => 'RADIO', 'option' => 0, 'valueList' => array(0 => __('Arrival (Check-in) & Departure (Check-out)', $this->pluginName), 1 => __('Arrival & Departure', $this->pluginName), 2 => __('Check-in & Check-out', $this->pluginName))),
            'status' => array('key' => 'status', 'name' => 'Calendar status', 'value' => 'open', 'inputLimit' => 1, 'inputType' => 'RADIO', 'option' => 0, 'valueList' => array('open' => __('Publish calendar', $this->pluginName), 'close' => __('Unpublish calendar', $pluginName))),
            'courseBool' => array('key' => 'courseBool', 'name' => 'Enable the service function', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
            'courseTitle' => array('key' => 'courseTitle', 'name' => 'Plan name', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'option' => 0),
            'googleCalendarID' => array('key' => 'googleCalendarID', 'name' => 'Google Calendar ID', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'option' => 0),
        );
        **/
        
        public function __construct($prefix, $pluginName = null) {
            
            $this->prefix = $prefix;
            $this->pluginName = $pluginName;
            
        }
        
        public function defaultFrom() {
            
            $form = array(
            	array('id' => 'firstname', 'name' => __('First name', $this->pluginName), 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'true', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
            	array('id' => 'lastname', 'name' => __('Last name', $this->pluginName), 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'true', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
            	array('id' => 'email', 'name' => __('Email', $this->pluginName), 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'false', 'isAddress' => 'false', 'isEmail' => 'true', 'isTerms' => 'false'),
            	array('id' => 'phone', 'name' => __('Phone', $this->pluginName), 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'true', 'isName' => 'false', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
            	array('id' => 'zip', 'name' => __('Zip', $this->pluginName), 'value' => '', 'type' => 'TEXT', 'options' => '', 'required' => 'false', 'isName' => 'false', 'isAddress' => 'false', 'isEmail' => 'false', 'isTerms' => 'false'),
            	array('id' => 'address', 'name' => __('Address', $this->pluginName), 'value' => '', 'type' => 'TEXT', 'active' => 'true', 'options' => '', 'required' => 'false', 'isName' => 'false', 'isAddress' => 'true', 'isEmail' => 'false', 'isTerms' => 'false'),
            	array('id' => 'terms', 'name' => __('Terms of Service', $this->pluginName), 'value' => '', 'type' => 'CHECK', 'active' => 'true', 'options' => __('I agree', $this->pluginName), 'required' => 'false', 'isName' => 'false', 'isAddress' => 'true', 'isEmail' => 'false', 'isTerms' => 'true'),
            );
            return $form;
            
        }
        
        public function guestsInputType(){
            
            $guestsInputTypeList = array(
                'name' => array('key' => 'name', 'name' => 'Name', 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT'),
                'target' => array('key' => 'target', 'name' => 'Target', 'value' => 'adult', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('adult' => __('Adult', $this->pluginName), 'children' => __('Children', $this->pluginName))),
                'required' => array('key' => 'required', 'name' => 'Required', 'value' => '0', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array(1 => __('Yes', $this->pluginName), 0 => __('No', $this->pluginName))),
                'json' => array('key' => 'json', 'name' => 'Options', 'value' => '', 'inputLimit' => 1, 'inputType' => 'EXTRA', "optionsType" => array("numberOfPeople" => array("type" => "TEXT", "value" => ""), "price" => array("type" => "TEXT", "value" => ""), "title" => array("type" => "TEXT", "value" => "")), 'titleList' => array('number' => __('Number of people', $this->pluginName), 'price' => __('Surcharge', $this->pluginName), 'name' => __('Title', $this->pluginName))),
            );
            
            return $guestsInputTypeList;
            
        }
        
        public function getList(){
            
            $list = array();
            $list =  array(   
                "General" => array(
                    'site_name' => array('name' => __('Site name', $this->pluginName), 'value' => 'Site name', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'email_to' => array('name' => __('To (Email Address)', $this->pluginName), 'value' => '', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'email_title_to' => array('name' => __('To (Email Title)', $this->pluginName), 'value' => '', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'email_from' => array('name' => __('From (Email Address)', $this->pluginName), 'value' => '', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'email_title_from' => array('name' => __('From (Email Title)', $this->pluginName), 'value' => '', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    /**
                    'maxAccountScheduleDay' => array('name' => __('Public days from today', $this->pluginName), 'value' => '7', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'TEXT'), 
                    **/
                    /**
                    'unavailableDaysFromToday' => array('name' => __('Unavailable days from today', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'SELECT', 'valueList' => array('0' => '0', '1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5', '6' => '6', '7' => '7', '8' => '8', '9' => '9', '10' => '10', '11' => '11', '12' => '12', '13' => '13', '14' => '14', '15' => '15', '16' => '16', '17' => '17', '18' => '18', '19' => '19', '20' => '20', '21' => '21', '22' => '22', '23' => '23', '24' => '24', '25' => '25', '26' => '26', '27' => '27', '28' => '28', '29' => '29', '30' => '30')),
                    **/
                    /**
                    'reserveTimeBlock' => array('name' => __('Unavailable time from now', $this->pluginName), 'value' => '60', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'TEXT'), 
                    **/
                    /**
                    'reserveCancelBool' => array('name' => __('Enable to cancel booking by users', $this->pluginName), 'value' => 'false', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'RADIO', 'valueList' => array('true' => 'On', 'false' => 'Off')), 
                    **/
                    /**
                    'reserveCancelTimeBlock' => array('name' => __('reserveCancelTimeBlock', $this->pluginName), 'value' => '60', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'TEXT'), 
                    **/
                    'timezone' => array('name' => __('Default Timezone', $this->pluginName), 'value' => 'UTC', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'SELECT_TIMEZONE', 'valueList' => array()),
                    'country' => array('name' => __('Country', $this->pluginName), 'value' => 'US', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'SELECT_GROUP', 'valueList' => array()),
                    'currency' => array('name' => __('Currency', $this->pluginName), 'value' => 'usd', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'SELECT', 'valueList' => array('usd' => 'USD', 'gbp' => 'GBP', 'eur' => 'EUR', 'jpy' => 'JPY - 日本円', 'dkk' => 'DKK - Dansk krone', 'cny' => 'CNY - 人民币', 'twd' => 'TWD - 台湾元', 'thb' => 'THB - Thai Baht', 'cop' => 'COP - Colombian Peso', 'cad' => 'CAD - Canadian Dollar', 'aud' => 'AUD - Australian Dollar', 'huf' => 'HUF - Magyar forint', 'uah' => 'UAH - Українська гривня')),
                    'dateFormat' => array('name' => __('Date format', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'RADIO', 'valueList' => array()),
                    'positionOfWeek' => array('name' => __('Position of the day of the week', $this->pluginName), 'value' => 'before', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'RADIO', 'valueList' => array('before' => __('Before the date and time', $this->pluginName), 'after' => __('After the date and time', $this->pluginName))),
                    'automaticApprove' => array('name' => __('Automatic approve of booking', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'CHECK', 'valueList' => array('1' => __('Enable', $this->pluginName))), 
                    'javascriptSyntaxErrorNotification' => array('name' => __('Javascript syntax error notification', $this->pluginName), 'value' => 1, 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'CHECK', 'valueList' => array('1' => __('Automatically notify developers', $this->pluginName))), 
                    'characterCodeOfDownloadFile' => array('name' => __('Character code of download file', $this->pluginName), 'value' => 'UTF-8', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'RADIO', 'valueList' => array('UTF-8' => 'UTF-8', 'EUC-JP' => 'EUC-JP', 'SJIS' => 'SJIS')),
                    
                ),
                "Design" => array(
                    'headingPosition' => array('name' => __('Define "position: sticky" for the css (style) in the calendar for visitors', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 0, 'inputLimit' => 2, 'inputType' => 'CHECK', 'valueList' => array('1' => __('Enable', $this->pluginName))),
                    'fontSize' => array('name' => __('Font size', $this->pluginName), 'value' => '14px', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    #'fontColor' => array('name' => __('Font color', $this->pluginName), 'value' => '#969696', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    'backgroundColor' => array('name' => __('Background color', $this->pluginName), 'value' => '#FFF', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    'calendarBackgroundColorWithSchedule' => array('name' => __('Calendar background color with schedule', $this->pluginName), 'value' => '#FFF', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    'calendarBackgroundColorWithNoSchedule' => array('name' => __('Calendar background color with no schedule', $this->pluginName), 'value' => '#EEE', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    
                    #'backgroundColorOfNationalHolidays' => array('name' => __('Background color of national holidays', $this->pluginName), 'value' => '#FFF', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    'backgroundColorOfRegularHolidays' => array('name' => __('Background color of regular holidays', $this->pluginName), 'value' => '#FFD5D5', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    
                    'scheduleAndServiceBackgroundColor' => array('name' => __('Schedule and service background color', $this->pluginName), 'value' => '#FFF', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    'backgroundColorOfSelectedLabel' => array('name' => __('Background color of selected label', $this->pluginName), 'value' => '#EAEDF3', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    'mouseHover' => array('name' => __('Background color when the pointer overlaps a link', $this->pluginName), 'value' => '#EAEDF3', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    'borderColor' => array('name' => __('Border color', $this->pluginName), 'value' => '#ddd', 'isExtensionsValid' => 0, 'inputLimit' => 1, 'inputType' => 'TEXT', 'js' => 'colorPicker'), 
                    
                ),
                "Mailgun" => array(
                    'mailgun_active' => array('name' => __('Active', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('1' => __('Enable', $this->pluginName), '0' => __('Disable', $this->pluginName))), 
                    'mailgun_aip_base_url' => array('name' => __('API Base URL', $this->pluginName), 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'mailgun_api_key' => array('name' => __('API Key', $this->pluginName), 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'mailgun_password' => array('name' => __('Password', $this->pluginName), 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXT'),
                ),
                "Stripe" => array(
                    'stripe_active' => array('name' => __('Active', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('1' => __('Enable', $this->pluginName), '0' => __('Disable', $this->pluginName))), 
                    'stripe_public_key' => array('name' => __('Public Key', $this->pluginName), 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'stripe_secret_key' => array('name' => __('Secret Key', $this->pluginName), 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXT')
                ),
                "PayPal" => array(
                    'paypal_active' => array('name' => __('Active', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('1' => __('Enable', $this->pluginName), '0' => __('Disable', $this->pluginName))), 
                    'paypal_live' => array('name' => __('Mode', $this->pluginName), 'value' => '0', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('1' => __('Live', $this->pluginName), '0' => __('Test', $this->pluginName))), 
                    'paypal_client_id' => array('name' => __('Client ID', $this->pluginName), 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                    'paypal_secret_key' => array('name' => __('Secret Key', $this->pluginName), 'value' => '', 'isExtensionsValid' => 1, 'inputLimit' => 1, 'inputType' => 'TEXT'), 
                )
            );
            
            $newDataFormatList = array();
            $dateFormatList = array(
                "m/d/Y / m/Y", 
                "m-d-Y / m-Y", 
                "F d, Y / F, Y", 
                "d/m/Y / m/Y", 
                "d-m-Y / m-Y", 
                "d F, Y / F, Y", 
                "Y/m/d / Y/m", 
                "Y-m-d / Y-m", 
                "d.m.Y / m.Y",
                "d.m.Y / F.Y",
            );
            for($i = 0; $i < count($dateFormatList); $i++){
                
                $format = $dateFormatList[$i];
                $date = date($format);
                $dateFormatList[$i] = $date;
                
            }
            #asort($newDataFormatList);
            
            #$this->list['General']['dateFormat']['valueList'] = $dateFormatList;
            $list['General']['dateFormat']['valueList'] = $dateFormatList;
            foreach($list as $listKey => $listValue){
                
                $category = array();
                foreach($listValue as $key => $value){
                    
                    $optionsValue = get_option($this->prefix.$key);
                    if($optionsValue !== false){
                        
                        $value['value'] = $optionsValue;
                        
                    }
                    
                    $category[$this->prefix.$key] = $value;
                    
                }
                
                $list[$listKey] = $category;
                
            }
            
            return $list;
            
        }
        
        public function getBookingSyncList($accountKey = false){
            
            $list = array();
            
            foreach($this->booking_sync as $listKey => $listValue){
                
                $category = array();
                foreach($listValue as $key => $value){
                    
                    $optionsValue = get_option($this->prefix.$key);
                    if($optionsValue !== false){
                        
                        $value['value'] = stripslashes($optionsValue);
                        
                    }
                    
                    $category[$this->prefix.$key] = $value;
                    
                }
                
                $list[$listKey] = $category;
                
            }
            
            return $list;
            
        }
        
        public function getMemberSetting($extension = false){
            
            $member_setting = $this->member_setting;
            foreach($member_setting as $key => $input){
                
                $defaultValue = $input['value'];
                $value = get_option($this->prefix.$key);
                if($value !== false){
                    
                    $member_setting[$key]['value'] = $value;
                    
                }else{
                    
                    add_option($this->prefix.$key, sanitize_text_field($defaultValue));
                    
                }
                
                if($extension !== true && $input['isExtensionsValid'] == 1){
                    
                    $member_setting[$key]['value'] = 0;
                    update_option($this->prefix.$key, "0");
                    
                }
                
            }
            
            return $member_setting;
            
        }
        
        public function getMemberSettingValues(){
            
            $member_setting = $this->member_setting;
            $values = array(
                'function_for_member' => $member_setting['function_for_member']['value'],
                'visitors_registration_for_member' => $member_setting['visitors_registration_for_member']['value'],
                'check_email_for_member' => $member_setting['check_email_for_member']['value'],
                'reject_non_membder' => $member_setting['reject_non_membder']['value'],
                'accept_subscribers_as_users' => $member_setting['accept_subscribers_as_users']['value'],
            );
            
            foreach($values as $key => $value){
                
                $value = get_option($this->prefix.$key, $value);
                $values[$key] = $value;
                
            }
            
            return $values;
            
        }
        
        public function getEmailMessageList($accountKey = 1){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_emailSetting";
            $email_message = $this->email_message;
            foreach($email_message as $key => $value){
                
                #var_dump($value);
                $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d AND `mail_id` = %s;", array(intval($accountKey), $value['key']));
                $row = $wpdb->get_row($sql, ARRAY_A);
                if(is_null($row)){
                    
                    #var_dump($row);
                    $wpdb->insert(
                        $table_name, 
    					array(
    				        'accountKey' => intval($accountKey), 
    					    'mail_id' => sanitize_text_field($value['key']),
    					    'data' => date('U')
    					), 
    					array('%d', '%s', '%d')
    				);
                    
                }else{
                    
                    #var_dump($row);
                    $email_message[$key]['enable'] = intval($row['enable']);
                    $email_message[$key]['format'] = $row['format'];
                    $email_message[$key]['subjectForAdmin'] = $row['subjectForAdmin'];
                    $email_message[$key]['contentForAdmin'] = $row['contentForAdmin'];
                    if(!is_null($row['subject'])){
                        
                        $email_message[$key]['subject'] = $row['subject'];
                        
                    }
                    
                    if(!is_null($row['content'])){
                        
                        $email_message[$key]['content'] = $row['content'];
                        
                    }
                    
                }
                
                #break;
                
            }
            
            #var_dump($email_message);
            $response = array('emailMessageList' => $email_message);
            $response['formData'] = $this->getForm($accountKey);
            return $response;
            
        }
        
        public function getEmailMessage($keys = null){
            
            $list = array();
            foreach($this->email_message as $key => $value){
                
                $value['key'] = $this->prefix.$key;
                
                if($keys == null || in_array("subject", $keys) === true){
                    
                    $optionsValue = get_option($this->prefix.$key."_subject", "");
                    if($optionsValue !== false){
                        
                        $value['subject'] = $optionsValue;
                        
                    }
                    
                }
                
                if($keys == null || in_array("content", $keys) === true){
                    
                    $optionsValue = get_option($this->prefix.$key."_content", "<div>No message</div>");
                    if($optionsValue !== false){
                        
                        $value['content'] = $optionsValue;
                        
                    }
                    
                }
                
                if($keys == null || in_array("enable", $keys) === true){
                    
                    $optionsValue = get_option($this->prefix.$key."_enable", 1);
                    if($optionsValue !== false){
                        
                        $value['enable'] = $optionsValue;
                        
                    }
                    
                }
                
                if($keys == null || in_array("format", $keys) === true){
                    
                    $optionsValue = get_option($this->prefix.$key."_format", "html");
                    if($optionsValue !== false){
                        
                        $value['format'] = $optionsValue;
                        
                    }
                    
                }
                
                $list[$key] = $value;
            }
            
            return $list;
            
        }
        
        public function getElementForCalendarAccount(){
            
            $calendarAccount = array(
                'name' => array('key' => 'name', 'name' => 'Name', 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0),
                'type' => array(
                    'key' => 'type', 
                    'name' => 'Type of booking', 
                    'value' => 'day', 
                    'inputLimit' => 1, 
                    'inputType' => 'RADIO', 
                    'isExtensionsValid' => 0, 
                    'option' => 1, 
                    'optionsList' => array(
                        'cost' => 0, 
                        'subscriptionIdForStripe' => 1,
                        'termsOfServiceForSubscription' => 1,
                        /**'enableSubscriptionForStripe' => 1,**/
                        'numberOfRoomsAvailable' => 0, 
                        'numberOfPeopleInRoom' => 0, 
                        'includeChildrenInRoom' => 0, 
                        'expressionsCheck' => 0, 
                        'preparationTime' => 1,
                        'flowOfBooking' => 1,
                        'courseBool' => 1,
                        'hasMultipleServices' => 1,
                        'courseTitle' => 1,
                        'displayRemainingCapacity' => 1
                    ), 'valueList' => array(
                        'day' => 'Booking is completed within 24 hours (hair salon, hospital etc.)', 
                        'hotel' => 'Accommodation (hotels, campgrounds, etc.)'
                    )
                ),
                'email_to' => array('key' => 'email_to', 'name' => __('To (Email Address)', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0),
                'email_from_title' => array('key' => 'email_from_title', 'name' => __('From (Email Title)', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0),
                'email_from' => array('key' => 'email_from', 'name' => __('From (Email Address)', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0),
                'status' => array('key' => 'status', 'name' => 'Calendar status', 'value' => 'open', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array('open' => __('Publish calendar', $this->pluginName), 'close' => __('Unpublish calendar', $this->pluginName))),
                'timezone' => array('key' => 'timezone', 'name' => __('Timezone', $this->pluginName), 'value' => 'open', 'inputLimit' => 1, 'inputType' => 'SELECT_TIMEZONE', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array()),
                'startOfWeek' => array('key' => 'startOfWeek', 'name' => __('Week Starts On', $this->pluginName), 'disabled' => 0, 'value' => '0', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array('0' => __('Sunday', $this->pluginName), '1' => __('Monday', $this->pluginName), '2' => __('Tuesday', $this->pluginName), '3' => __('Wednesday', $this->pluginName), '4' => __('Thursday', $this->pluginName), '5' => __('Friday', $this->pluginName), '6' => __('Saturday', $this->pluginName))),
                'paymentMethod' => array('key' => 'paymentMethod', 'name' => __('Select payment method', $this->pluginName), 'value' => 'open', 'inputLimit' => 1, 'inputType' => 'CHECK', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array('locally' => __('I will pay locally', $this->pluginName), 'stripe' => __('Pay with Stripe', $this->pluginName), 'paypal' => __('Pay with PayPal', $this->pluginName))),
                
                'subscriptionIdForStripe' => array('key' => 'subscriptionIdForStripe', 'name' => 'Product ID of subscription for Stripe', 'value' => '', 'inputLimit' => 2, 'inputType' => 'SUBSCRIPTION', 'optionKeys' => array('subscriptionIdForStripe' => array('title' => __('Product ID', $this->pluginName), 'inputType' => 'TEXT'), 'enableSubscriptionForStripe' => array('title' => __('Enable', $this->pluginName), 'inputType' => 'CHECKBOX')), 'isExtensionsValid' => 1, 'option' => 0, 'optionValues' => array("enableSubscriptionForStripe" => "")),
                'termsOfServiceForSubscription' => array('key' => 'termsOfServiceForSubscription', 'name' => 'The terms of service for subscription', 'value' => '', 'inputLimit' => 2, 'inputType' => 'SUBSCRIPTION', 'optionKeys' => array('termsOfServiceForSubscription' => array('title' => 'URI', 'inputType' => 'TEXT'), 'enableTermsOfServiceForSubscription' => array('title' => __('Enable', $this->pluginName), 'inputType' => 'CHECKBOX')), 'isExtensionsValid' => 1, 'option' => 0, 'optionValues' => array("enableTermsOfServiceForSubscription" => "")),
                'privacyPolicyForSubscription' => array('key' => 'privacyPolicyForSubscription', 'name' => 'The privacy policy for subscription', 'value' => '', 'inputLimit' => 2, 'inputType' => 'SUBSCRIPTION', 'optionKeys' => array('privacyPolicyForSubscription' => array('title' => 'URI', 'inputType' => 'TEXT'), 'enablePrivacyPolicyForSubscription' => array('title' => __('Enable', $this->pluginName), 'inputType' => 'CHECKBOX')), 'isExtensionsValid' => 1, 'option' => 0, 'optionValues' => array("enablePrivacyPolicyForSubscription" => "")),
                #'subscriptionIdForPayPal' => array('key' => 'subscriptionIdForPayPal', 'name' => 'Subscription ID for PayPal', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 1, 'option' => 0),
                
                'cost' => array('key' => 'cost', 'name' => 'Cost per night', 'disabled' => 1, 'value' => '0', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0, "message" => __('For example, if you want to specify $20.00 in a currency with fractional coins, enter 2000.', $this->pluginName)),
                'numberOfRoomsAvailable' => array('key' => 'numberOfRoomsAvailable', 'name' => 'Number of rooms available', 'disabled' => 1, 'value' => '1', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0), 
                'numberOfPeopleInRoom' => array('key' => 'numberOfPeopleInRoom', 'name' => 'Maximum number of people staying in one room', 'disabled' => 1, 'value' => '2', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0), 
                'includeChildrenInRoom' => array('key' => 'includeChildrenInRoom', 'name' => 'Include children in the maximum number of people in the room', 'disabled' => 1, 'value' => 0, 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(1 => 'Include', 0 => 'Exclude')),
                'expressionsCheck' => array('key' => 'expressionsCheck', 'name' => 'Expressions of arrival and departure', 'disabled' => 1, 'value' => 0, 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(0 => __('Arrival (Check-in) & Departure (Check-out)', $this->pluginName), 1 => __('Arrival & Departure', $this->pluginName), 2 => __('Check-in & Check-out', $this->pluginName))),
                
                'preparationTime' => array('key' => 'preparationTime', 'name' => __('Preparation time', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 1, 'valueList' => array()),
                'positionPreparationTime' => array('key' => 'positionPreparationTime', 'name' => __('Position of preparation time', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'option' => 0, 'valueList' => array('before_after' => __('Before and after booked time', $this->pluginName), 'before' => __('Before booked time', $this->pluginName), 'after' => __('After booked time', $this->pluginName))),
                
                'flowOfBooking' => array('key' => 'flowOfBooking', 'name' => __('Flow of booking procedure on front-end page', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array('calendar' => __('Start by selecting a date', $this->pluginName), 'services' => __('Start by selecting a service', $this->pluginName))),
                'courseBool' => array('key' => 'courseBool', 'name' => __('Enable the service function', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
                'hasMultipleServices' => array('key' => 'hasMultipleServices', 'name' => __('Selection of multiple services', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
                'courseTitle' => array('key' => 'courseTitle', 'name' => __('Service name', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0),
                
                'displayRemainingCapacityInCalendar' => array('key' => 'displayRemainingCapacityInCalendar', 'name' => __('Display the remaining capacity as a phrase or symbol in the calendar', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
                'displayRemainingCapacityInCalendarAsNumber' => array('key' => 'displayRemainingCapacityInCalendarAsNumber', 'name' => __('Display the remaining capacity as a number instead of symbols in the calendar', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
                'displayThresholdOfRemainingCapacity' => array('key' => 'displayThresholdOfRemainingCapacity', 'name' => __('Threshold of remaining capacity', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(90 => '90%', 80 => '80%', 70 => '70%', 60 => '60%', 50 => '50%', 40 => '40%', 30 => '30%', 20 => '20%', 10 => '10%')),
                'displayRemainingCapacityHasMoreThenThreshold' => array('key' => 'displayRemainingCapacityHasMoreThenThreshold', 'name' => __('A phrase or symbol on a day when the remaining capacity has more than threshold', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'REMAINING_CAPACITY', 'isExtensionsValid' => 0, 'option' => 0, 'format' => 'json', 'valueList' => '', "optionsType" => array("symbol" => array("type" => "TEXT", "value" => ""), "color" => array("type" => "TEXT", "value" => "#969696", "js" => "colorPicker")), 'titleList' => array(), 'message' => __('You can use the web font of <a href="https://material.io/tools/icons/?style=baseline" target="_blank">Material icons</a>.', $this->pluginName)),
                'displayRemainingCapacityHasLessThenThreshold' => array('key' => 'displayRemainingCapacityHasLessThenThreshold', 'name' => __('A phrase or symbol on a day when the remaining capacity has less than threshold', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'REMAINING_CAPACITY', 'isExtensionsValid' => 0, 'option' => 0, 'format' => 'json', 'valueList' => '', "optionsType" => array("symbol" => array("type" => "TEXT", "value" => ""), "color" => array("type" => "TEXT", "value" => "#969696", "js" => "colorPicker")), 'titleList' => array(), 'message' => __('You can use the web font of <a href="https://material.io/tools/icons/?style=baseline" target="_blank">Material icons</a>.', $this->pluginName)),
                'displayRemainingCapacityHas0' => array('key' => 'displayRemainingCapacityHas0', 'name' => __('A phrase or symbol on a day when remaining capacity has 0%', $this->pluginName), 'value' => 'close', 'inputLimit' => 2, 'inputType' => 'REMAINING_CAPACITY', 'isExtensionsValid' => 0, 'option' => 0, 'format' => 'json', 'valueList' => '', "optionsType" => array("symbol" => array("type" => "TEXT", "value" => ""), "color" => array("type" => "TEXT", "value" => "#969696", "js" => "colorPicker")), 'titleList' => array(), 'message' => __('You can use the web font of <a href="https://material.io/tools/icons/?style=baseline" target="_blank">Material icons</a>.', $this->pluginName)),
                
                #'displayRemainingCapacityHasMoreThenThreshold1' => array('key' => 'displayRemainingCapacityHasMoreThenThreshold1', 'name' => __('A phrase or symbol on a day when the remaining capacity has more than threshold', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'REMAINING_CAPACITY', 'isExtensionsValid' => 0, 'option' => 0, 'format' => 'json', 'valueList' => '', "optionsType" => array("symbol" => array("type" => "TEXT", "value" => ""), "color" => array("type" => "TEXT", "value" => "#969696", "js" => "colorPicker")), 'titleList' => array()),
                #'displayRemainingCapacityHasMoreThenThreshold2' => array('key' => 'displayRemainingCapacityHasMoreThenThreshold2', 'name' => __('A phrase or symbol on a day when the remaining capacity has more than threshold', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'REMAINING_CAPACITY', 'isExtensionsValid' => 0, 'option' => 0, 'format' => 'json', 'valueList' => '', "optionsType" => array("symbol" => array("type" => "TEXT", "value" => ""), "color" => array("type" => "TEXT", "value" => "", "js" => "colorPicker")), 'titleList' => array()),
                #, 'format' => 'json', 'valueList' => '', "optionsType" => array("name" => array("type" => "TEXT", "value" => ""), "cost" => array("type" => "TEXT", "value" => ""), "time" => array("type" => "SELECT", "value" => 0, "start" => 0, "end" => 245, "addition" => 5, 'unit' => __("%s min", $this->pluginName))), 'titleList' => array('name' => __('Name', $this->pluginName), 'cost' => __('Price', $this->pluginName), 'time' => __('Additional time', $this->pluginName))
                
                'displayRemainingCapacity' => array('key' => 'displayRemainingCapacity', 'name' => 'Display remaining capacity', 'value' => 0, 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
                'maxAccountScheduleDay' => array('key' => 'maxAccountScheduleDay', 'name' => 'Public days from today', 'disabled' => 0, 'value' => '0', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'option' => 0),
                'unavailableDaysFromToday' => array('key' => 'unavailableDaysFromToday', 'name' => 'Unavailable days from today', 'disabled' => 0, 'value' => '0', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array('0' => '0', '1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5', '6' => '6', '7' => '7', '8' => '8', '9' => '9', '10' => '10', '11' => '11', '12' => '12', '13' => '13', '14' => '14', '15' => '15', '16' => '16', '17' => '17', '18' => '18', '19' => '19', '20' => '20', '21' => '21', '22' => '22', '23' => '23', '24' => '24', '25' => '25', '26' => '26', '27' => '27', '28' => '28', '29' => '29', '30' => '30')),
                'fixCalendar' => array('key' => 'fixCalendar', 'name' => 'Fixed calendar', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'FIX_CALENDAR', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(0 => 'month', 1 => 'year')),
                #'googleCalendarID' => array('key' => 'googleCalendarID', 'name' => 'Google Calendar ID', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', 'isExtensionsValid' => 1, 'option' => 0),
                
                'displayDetailsOfCanceled' => array('key' => 'displayDetailsOfCanceled', 'name' => __('Display details of the canceled visitors and user on the Report & Booking page', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
                'cancellationOfBooking' => array('key' => 'cancellationOfBooking', 'name' => __('Cancellation of booking by visitor and user', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'option' => 0, 'valueList' => array(1 => 'Enable', 0 => 'Disable')),
                'allowCancellationVisitor' => array('key' => 'allowCancellationVisitor', 'name' => __('Allow cancellation by visitor up to', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 1, 'option' => 0, 
                    'valueList' => array(
                        30 => sprintf(__('%s minutes ago', $this->pluginName), "30"), 
                        60 => sprintf(__('%s hour ago', $this->pluginName), "1"), 
                        120 => sprintf(__('%s hours ago', $this->pluginName), "2"), 
                        240 => sprintf(__('%s hours ago', $this->pluginName), "4"), 
                        480 => sprintf(__('%s hours ago', $this->pluginName), "8"), 
                        720 => sprintf(__('%s hours ago', $this->pluginName), "12"), 
                        1440 => sprintf(__('%s day ago', $this->pluginName), "1"), 
                        2880 => sprintf(__('%s days ago', $this->pluginName), "2"), 
                        4320 => sprintf(__('%s days ago', $this->pluginName), "3"),
                        5760 => sprintf(__('%s days ago', $this->pluginName), "4"),
                        7200 => sprintf(__('%s days ago', $this->pluginName), "5"),
                    )
                ),
                'refuseCancellationOfBooking' => array('key' => 'refuseCancellationOfBooking', 'name' => __('Status to refuse cancellation of booking', $this->pluginName).":", 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 1, 'option' => 0, 
                    'valueList' => array(
                        'not_refuse' => __('Not refuse', $this->pluginName), 
                        'pending' => __('Pending', $this->pluginName), 
                        'approved' => __('Approved', $this->pluginName), 
                    )
                ),
                
            );
            
            return $calendarAccount;
            
        }
        
        public function getCourseData(){
            
            $addNewCourse =  array(
                'name' => array('name' => __('Name', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => ''),
                'description' => array('name' => __('Description', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXTAREA', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => ''),
                'active' => array('name' => __('Active', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'CHECK', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => array('true' => __('Enable', $this->pluginName))),
                'target' => array('name' => __('Target', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 0, 'valueList' => array('visitors_users' => __('Visitors and Users', $this->pluginName), 'visitors' => __('Visitors only', $this->pluginName), 'users' => __('Users only', $this->pluginName))),
                'cost' => array('name' => __('Price', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'valueList' => '', "message" => __('For example, if you want to specify $20.00 in a currency with fractional coins, enter 2000.', $this->pluginName)),
                'time' => array('name' => __('Duration time', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => array()),
                'timeToProvide' => array('name' => __('Time to provide service', $this->pluginName), 'value' => '0', 'inputLimit' => 2, 'inputType' => 'TIME_TO_PROVIDE', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => array()),
                'selectOptions' => array('name' => __('Selection of multiple options', $this->pluginName), 'value' => '0', 'inputLimit' => 2, 'inputType' => 'CHECK', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => array('1' => __('Enable', $this->pluginName))),
                'options' => array('name' => __('Options', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'EXTRA', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 0, 'format' => 'json', 'valueList' => '', "optionsType" => array("name" => array("type" => "TEXT", "value" => ""), "cost" => array("type" => "TEXT", "value" => ""), "time" => array("type" => "SELECT", "value" => 0, "start" => 0, "end" => 245, "addition" => 5, 'unit' => __("%s min", $this->pluginName))), 'titleList' => array('name' => __('Name', $this->pluginName), 'cost' => __('Price', $this->pluginName), 'time' => __('Additional time', $this->pluginName))),
            );
            return $addNewCourse;
            
        }
        
        public function getSubscriptionsData(){
            
            $addSubscriptions = array(
                'subscription' => array('name' => __('Subscription', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => ''),
                'name' => array('name' => __('Name', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => ''),
                'active' => array('name' => __('Active', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'CHECK', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => array('true' => __('Enable', $this->pluginName))),
                'renewal' => array('name' => __('Automatic subscription renewal', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'valueList' => array('0' => __('Invalid', $this->pluginName), '1' => __('Valid', $this->pluginName)), "message" => ''),
                'limit' => array('name' => __('Booking limit', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'valueList' => array('0' => __('Invalid', $this->pluginName), '1' => __('Valid', $this->pluginName)), "message" => ''),
                'numberOfTimes' => array('name' => __('Number of times users can book by the following deadline', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'SELECT', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => array(1 => '1', 2 => '2')),
            );
            
            return $addSubscriptions;
            
        }
        
        public function getTaxesData(){
            
            $addSubscriptions = array(
                'name' => array('name' => __('Name', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => ''),
                'active' => array('name' => __('Active', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'CHECK', 'isExtensionsValid' => 0, 'isExtensionsValidPanel' => 1, 'valueList' => array('true' => __('Enable', $this->pluginName))),
                'type' => array('name' => __('Type', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => array('tax' => __('Tax', $this->pluginName), 'surcharge' => __('Surcharge', $this->pluginName)), 'option' => 1, 'optionsList' => array('tax' => 1)),
                'tax' => array('name' => __('Tax', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => array('tax_exclusive' => __('Tax-exclusive pricing', $this->pluginName), 'tax_inclusive' => __('Tax-inclusive pricing', $this->pluginName))),
                'method' => array('name' => __('Calculation method', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => array('addition' => __('Addition', $this->pluginName), 'multiplication' => __('Multiplication', $this->pluginName))),
                'target' => array('name' => __('Target of tax or surcharge', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => array('room' => __('Per room', $this->pluginName), 'guest' => __('Per guest', $this->pluginName))),
                'scope' => array('name' => __('Range of tax or surcharge', $this->pluginName), 'value' => '', 'inputLimit' => 2, 'inputType' => 'RADIO', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => array('day' => __('Per day', $this->pluginName), 'booking' => __('Per one booking', $this->pluginName))),
                'value' => array('name' => __('Value', $this->pluginName), 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', 'isExtensionsValid' => 1, 'isExtensionsValidPanel' => 1, 'valueList' => ''),
                
            );
            
            return $addSubscriptions;
            
        }
        
        public function getFormInputType(){
            
            $formInputType = array(
                'id' => array('key' => 'id', 'name' => 'Unique ID', 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', "class" => ""),
                'name' => array('key' => 'name', 'name' => 'Name', 'value' => '', 'inputLimit' => 1, 'inputType' => 'TEXT', "class" => ""),
                'value' => array('key' => 'value', 'name' => 'Value', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', "class" => "hidden_panel"),
                
                'groupId' => array('key' => 'groupId', 'name' => 'Group ID', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', "class" => ""),
                #'groupName' => array('key' => 'groupName', 'name' => 'Group name', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', "class" => ""),
                'uri' => array('key' => 'uri', 'name' => 'URI', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXT', "class" => ""),
                
                'description' => array('key' => 'description', 'name' => 'Description', 'value' => '', 'inputLimit' => 2, 'inputType' => 'TEXTAREA', "class" => ""),
                'active' => array('key' => 'active', 'name' => 'Active', 'value' => 'true', 'inputLimit' => 2, 'inputType' => 'CHECK', 'valueList' => array('true' => __('On', $this->pluginName)), "class" => ""),
                'required' => array('key' => 'required', 'name' => 'Required', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => __('Yes', $this->pluginName), 'false' => __('No', $this->pluginName)), "class" => ""),
                'isName' => array('key' => 'isName', 'name' => 'Is Name', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => __('Yes', $this->pluginName), 'false' => __('No', $this->pluginName)), "class" => ""),
                'isAddress' => array('key' => 'isAddress', 'name' => 'Is a location in Google Calendar', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => __('Yes', $this->pluginName), 'false' => __('No', $this->pluginName)), "class" => ""),
                'isEmail' => array('key' => 'isEmail', 'name' => 'Is Email', 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => __('Yes', $this->pluginName), 'false' => __('No', $this->pluginName)), "class" => ""),
                'isTerms' => array('key' => 'isTerms', 'name' => __('Is Terms of Service or Privacy Policy', $this->pluginName), 'value' => 'false', 'inputLimit' => 1, 'inputType' => 'RADIO', 'valueList' => array('true' => __('Yes', $this->pluginName), 'false' => __('No', $this->pluginName)), "class" => ""),
                
                'type' => array('key' => 'type', 'name' => 'Type', 'value' => 'TEXT', 'inputLimit' => 1, 'inputType' => 'SELECT', 'valueList' => array('TEXT' => 'TEXT', 'SELECT' => 'SELECT', 'CHECK' => 'CHECK', 'RADIO' => 'RADIO', 'TEXTAREA' => 'TEXTAREA'), "class" => ""),
                'options' => array('key' => 'options', 'name' => 'Options', 'value' => '', 'inputLimit' => 2, 'inputType' => 'OPTION', 'format' => 'array', "class" => "", "options" => array("name" => "text")),
            );
            return $formInputType;
            
        }
        
        public function updateMemberSetting(){
            
            $isExtensionsValid = $this->extensionFunction();
            $member_setting = $this->member_setting;
            foreach($member_setting as $key => $input){
                
                if(isset($_POST[$key])){
                    
                    $value = sanitize_text_field($_POST[$key]);
                    if($isExtensionsValid !== true && $input['inputType'] == "CHECK"){
                        
                        $value = 0;
                        
                    }
                    
                    if($input['inputType'] == "TEXTAREA"){
                        
                        $value = sanitize_textarea_field($_POST[$key]);
                        
                    }
                    
                    update_option($this->prefix.$key, $value);
                    $member_setting[$key]["value"] = $value;
                    
                }
                
            }
            
            return $member_setting;
            
        }
        
        public function update($post){
            
            $extentionBool = $this->extensionFunction(false);
            $list = $this->getList();
            if($_POST['type'] == "bookingSync"){
                
                $list = $this->getBookingSyncList();
                
            }
            
            
            
            foreach($list as $listKey => $listValue){
                
                if($extentionBool === false && ($listKey == 'Mailgun' || $listKey == 'Stripe')){
                    
                    continue;
                    
                }
                
                $category = array();
                foreach($listValue as $key => $value){
                    
                    if(isset($post[$key]) === true){
                        
                        $value = "";
                        if($listValue['inputType'] == "TEXTAREA"){
                            
                            $value = sanitize_textarea_field($post[$key]);
                            if($key == 'booking_package_googleCalendar_json'){
                                
                                $value = array();
                                $json = json_decode($post[$key], true);
                                foreach($json as $jsonKey => $jsonValue){
                                    
                                    $value[sanitize_text_field($jsonKey)] = sanitize_text_field($jsonValue);
                                    
                                }
                                
                                $value = json_encode($value);
                                
                            }
                            
                        }else{
                            
                            $value = sanitize_text_field($post[$key]);
                            
                        }
                        #$value = sanitize_text_field($post[$key]);
                        
                        if(get_option($key) === false){
					        
	                        add_option($key, $value);
					        
                        }else{
				            
				            update_option($key, $value);
				            
			            }
                        
                    }
                    
                    $category[$key] = $value;
                    
                }
                
                $list[$listKey] = $category;
                
            }
            
            return $list;
            
        }
        
        public function refreshToken($key, $home = false){
            
            $key = sanitize_text_field($key);
            $token = hash('ripemd160', sanitize_text_field($home));
            if($home === false){
                
                #$timezone = get_option('timezone_string');
                #date_default_timezone_set($timezone);
                $token = hash('ripemd160', date('U'));
                
            }
            
            update_option($key, $token);
            return array('status' => 'success', 'token' => $token, 'key' => $key);
            
        }
        
        public function getForm($accountKey = 1){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_form";
            #$wpdb->query("DROP TABLE IF EXISTS ".$table_name.";");
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d;", array(intval($accountKey)));
            $row = $wpdb->get_row($sql, ARRAY_A);
            if (is_null($row)) {
                
                $wpdb->insert(
                    $table_name, 
    				array(
    			        'accountKey' => intval($accountKey), 
    			        'data' => json_encode($this->defaultFrom())
    				), 
    				array('%d', '%s')
    	        );
                
                return $this->defaultFrom();
                
            } else {
                
                $form = array();
                $data = json_decode($row['data'], true);
                foreach ($data as $key => $value) {
                    
                    array_push($form, $value);
                    
                }
                return $form;
                #return json_decode($row['data'], true);
                
            }
            
        }
        
        /**
        public function getFormList(){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_form";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d;", array(intval($accountKey)));
            
        }
        **/
        
        public function getCourseList($accountKey = 1){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_courseData";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            $isExtensionsValid = $this->extensionFunction(false);
            for($i = 0; $i < count($rows); $i++){
                
                $rows[$i]['timeToProvide'] = json_decode($rows[$i]['timeToProvide'], true);
                if (is_null($rows[$i]['timeToProvide']) || $rows[$i]['timeToProvide'] === false) {
                    
                    $rows[$i]['timeToProvide'] = array();
                    
                }
                
                if ($isExtensionsValid === false) {
                    
                    $rows[$i]['options'] = "[]";
                    $rows[$i]['timeToProvide'] = array();
                    
                }
                
            }
            /**
            if ($isExtensionsValid === false) {
				
				for($i = 0; $i < count($rows); $i++){
					
					$rows[$i]['options'] = "[]";
					
				}
				
			}
            **/
            return $rows;
            
        }
        
        /**
        public function getAllCourseList(){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_courseData";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            
            
        }
        **/
        
        
        
        public function getGuestsList($accountKey = false, $booking = false){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_guests";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            if($booking == true){
                
                foreach($rows as $key => $value){
                    
                    $list = json_decode($value['json'], true);
                    array_unshift($list, array("number" => 0, "price" => 0, "name" => __("SELECT")));
                    #var_dump($list);
                    $value['json'] = json_encode($list);
                    $rows[$key] = $value;
                    
                }
                
            }
            return $rows;
            
        }
        
        public function updateGuests($accountKey = false){
            
            global $wpdb;
            if($accountKey != false){
                
                $json = array();
                if(isset($_POST['json'])){
                    
                    $jsonList = json_decode(str_replace("\\", "", $_POST['json']), true);
                    for($i = 0; $i < count($jsonList); $i++){
                        
                        $object = array();
                        foreach($jsonList[$i] as $key => $value){
                            
                            $object[sanitize_text_field($key)] = sanitize_text_field($value);
                            if ($key == 'price') {
                                
                                $object[sanitize_text_field($key)] = intval($value);
                                
                            }
                            
                        }
                        
                        array_push($json, $object);
                        
                    }
                    
                    
                    $table_name = $wpdb->prefix."booking_package_guests";
                    $wpdb->update(
                        $table_name,
                        array(
                            'name' => sanitize_text_field($_POST['name']), 
                            'target' => sanitize_text_field($_POST['target']), 
                            'json' => json_encode($json),
                            'required' => intval($_POST['required']),
                        ),
                        array('key' => intval($_POST['key'])),
                        array('%s', '%s', '%s', '%d'),
                        array('%d')
                    );
                    
                }
                
                #return $json;
                return $this->getGuestsList($accountKey);
                
            }
            
            die();
            
        }
        
        public function addGuests($accountKey = false){
            
            global $wpdb;
            if($accountKey != false){
                
                $json = array();
                if(isset($_POST['json'])){
                    
                    $jsonList = json_decode(str_replace("\\", "", $_POST['json']), true);
                    for($i = 0; $i < count($jsonList); $i++){
                        
                        $object = array();
                        foreach($jsonList[$i] as $key => $value){
                            
                            $object[sanitize_text_field($key)] = sanitize_text_field($value);
                            if ($key == 'price') {
                                
                                $object[sanitize_text_field($key)] = intval($value);
                                
                            }
                            
                        }
                        
                        array_push($json, $object);
                        
                    }
                    
                    
                    $table_name = $wpdb->prefix."booking_package_guests";
                    $sql = $wpdb->prepare("SELECT COUNT(*) FROM ".$table_name." WHERE `accountKey` = %d;", array(intval($accountKey)));
                    $row = $wpdb->get_row($sql, ARRAY_A);
                    $count = $row['COUNT(*)'] + 1;
                    #var_dump($count);
                    
                    $wpdb->insert(
                        $table_name, 
    					array(
                            'accountKey' => intval($accountKey), 
    			            'name' => sanitize_text_field($_POST['name']), 
    			            'target' => sanitize_text_field($_POST['target']), 
    				        'json' => json_encode($json), 
    				        'ranking' => intval($count),
    				        'required' => intval($_POST['required']),
    					), 
    					array('%d', '%s', '%s', '%s', '%d', '%d')
    				);
                    
                }
                
                return $this->getGuestsList($accountKey);
                
            }
            
            die();
            
        }
        
        public function deleteGuestsItem($accountKey = false){
            
            global $wpdb;
            if($accountKey != false){
                
                $table_name = $wpdb->prefix."booking_package_guests";
                $wpdb->delete($table_name, array('key' => intval($_POST['key'])), array('%d'));
                
                return $this->getGuestsList($accountKey);
                
            }
            
            die();
            
        }
        
        public function changeGuestsRank($accountKey = false){
            
            global $wpdb;
            if($accountKey != false){
                
                $table_name = $wpdb->prefix."booking_package_guests";
                $keyList = explode(",", $_POST['keyList']);
                for($i = 0; $i < count($keyList); $i++){
                    
                    $ranking = $i + 1;
                    $wpdb->update(
                        $table_name,
                        array(
                            'ranking' => intval($ranking)
                        ),
                        array('key' => intval($keyList[$i]), 'accountKey' => intval($accountKey)),
                        array('%d'),
                        array('%d', '%d')
                    );
                    
                }
                
                return $this->getGuestsList($accountKey);
                
            }
            
            die();
            
        }
        
        public function addCourse(){
            
            $accountKey = 1;
            if(isset($_POST['accountKey'])){
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            $options = array();
            if(isset($_POST['options'])){
                
                $jsonList = json_decode(str_replace("\\", "", $_POST['options']), true);
                for($i = 0; $i < count($jsonList); $i++){
                    
                    $object = array();
                    foreach($jsonList[$i] as $key => $value){
                        
                        $object[sanitize_text_field($key)] = sanitize_text_field($value);
                        
                    }
                    array_push($options, $object);
                    
                }
                
                if ($this->extensionFunction() === false) {
                    
                    $options = array();
                    
                }
                
            }
            
            $timeToProvide = array();
            if (isset($_POST['timeToProvide'])) {
                
                $jsonList = json_decode(str_replace("\\", "", $_POST['timeToProvide']), true);
                for($i = 0; $i < count($jsonList); $i++){
                    
                    $object = array();
                    foreach($jsonList[$i] as $key => $value){
                        
                        $object[sanitize_text_field($key)] = sanitize_text_field($value);
                        
                    }
                    array_push($timeToProvide, $object);
                    
                }
                
                
                if ($this->extensionFunction() === false) {
                    
                    $timeToProvide = array();
                    
                }
                
            }
            
            if (!isset($_POST['target'])) {
                
                $_POST['target'] = 'visitors_users';
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_courseData";
            $wpdb->insert(	$table_name, 
    						array(
    					   		'accountKey'    => intval($accountKey), 
    							'name'          => sanitize_text_field($_POST['name']), 
    							'description'   => sanitize_textarea_field($_POST['description']),
    							'cost'          => intval($_POST['cost']), 
    							'time'          => intval($_POST['time']), 
    							'ranking'       => intval($_POST['rank']),
    							'active'        => sanitize_text_field($_POST['active']),
    							'target'        => sanitize_text_field($_POST['target']),
    							'selectOptions' => intval($_POST['selectOptions']),
    							'options'       => json_encode($options),
    							'timeToProvide' => json_encode($timeToProvide),
    						), 
    						array(
    						    '%d', '%s', '%s', '%d', '%d', '%d', '%s', '%s', '%d', '%s', 
    						    '%s',
                            )
    					);
    		/**
			$sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            return $rows;
            **/
            return $this->getCourseList($accountKey);
            
        }
        
        public function updateCourse(){
            
            $accountKey = 1;
            if(isset($_POST['accountKey'])){
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            $options = array();
            if(isset($_POST['options'])){
                
                $jsonList = json_decode(str_replace("\\", "", $_POST['options']), true);
                for($i = 0; $i < count($jsonList); $i++){
                    
                    $object = array();
                    foreach($jsonList[$i] as $key => $value){
                        
                        $object[sanitize_text_field($key)] = sanitize_text_field($value);
                        
                    }
                    
                    array_push($options, $object);
                    
                }
                
                if ($this->extensionFunction(false) === false) {
                    
                    $options = array();
                    
                }
                
            }
            
            $timeToProvide = array();
            if (isset($_POST['timeToProvide'])) {
                
                $jsonList = json_decode(str_replace("\\", "", $_POST['timeToProvide']), true);
                for($i = 0; $i < count($jsonList); $i++){
                    
                    $object = array();
                    foreach($jsonList[$i] as $key => $value){
                        
                        $object[sanitize_text_field($key)] = sanitize_text_field($value);
                        
                    }
                    array_push($timeToProvide, $object);
                    
                }
                
                
                if ($this->extensionFunction() === false) {
                    
                    $timeToProvide = array();
                    
                }
                
            }
            
            if (!isset($_POST['target'])) {
                
                $_POST['target'] = 'visitors_users';
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_courseData";
            $wpdb->update(  $table_name,
                            array(
                                'name'          => sanitize_text_field($_POST['name']), 
                                'description'   => sanitize_textarea_field($_POST['description']),
                                'time'          => intval($_POST['time']), 
                                'cost'          => intval($_POST['cost']), 
                                'active'        => sanitize_text_field($_POST['active']),
                                'target'        => sanitize_text_field($_POST['target']),
                                'selectOptions' => intval($_POST['selectOptions']),
                                'options'       => json_encode($options),
                                'timeToProvide' => json_encode($timeToProvide),
                            ),
                            array('key' => intval($_POST['key'])),
                            array('%s', '%s', '%d', '%d', '%s', '%s', '%d', '%s', '%s'),
                            array('%d')
                        );
            /**
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            return $rows;
            **/
            return $this->getCourseList($accountKey);
            
        }
        
        public function deleteCourse(){
            
            $accountKey = 1;
            if(isset($_POST['accountKey'])){
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_courseData";
            $wpdb->delete($table_name, array('key' => intval($_POST['key'])), array('%d'));
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            return $rows;
            
        }
        
        public function getSubscriptions(){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_subscriptions";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($_POST['accountKey'])));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            $isExtensionsValid = $this->extensionFunction(false);
            if ($isExtensionsValid === false) {
				
				return array();
				
			} else {
			    
			    return $rows;
			    
			}
            
        }
        
        public function addSubscriptions(){
            
            $accountKey = $_POST['accountKey'];
            if ($this->extensionFunction() === false) {
                
                return array();
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_subscriptions";
            $wpdb->insert(	$table_name, 
    						array(
    					   		'accountKey'    => intval($accountKey), 
    							'name'          => sanitize_text_field($_POST['name']), 
    							'subscription'  => sanitize_text_field($_POST['subscription']), 
    							'active'        => sanitize_text_field($_POST['active']), 
    							'ranking'       => intval($_POST['rank']),
    							'renewal'       => intval($_POST['renewal']),
    							'limit'         => intval($_POST['limit']),
    							'numberOfTimes' => intval($_POST['numberOfTimes']),
    						), 
    						array('%d', '%s', '%s', '%s', '%d', '%d', '%d', '%d')
    					);
    		
			$sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            return $rows;
            
        }
        
        public function updateSubscriptions(){
            
            $accountKey = $_POST['accountKey'];
            if ($this->extensionFunction(false) === false) {
                
                return array();
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_subscriptions";
            $wpdb->update(
                $table_name,
                array(
                    'name' => sanitize_text_field($_POST['name']), 
                    'active' => sanitize_text_field($_POST['active']),
                    'renewal' => intval($_POST['renewal']), 
                    'limit' => intval($_POST['limit']), 
                    'numberOfTimes' => intval($_POST['numberOfTimes']),
                ),
                array('key' => intval($_POST['key'])),
                array('%s', '%s', '%d', '%d', '%d'),
                array('%d')
            );
            
            return $this->getSubscriptions();
            
        }
        
        public function deleteSubscriptions(){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_subscriptions";
            $wpdb->delete($table_name, array('key' => intval($_POST['key'])), array('%d'));
            return $this->getSubscriptions();
            
        }
        
        public function changeSubscriptionsRank(){
            
            $keyList = explode(",", $_POST['keyList']);
            $indexList = explode(",", $_POST['indexList']);
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_subscriptions";
            for($i = 0; $i < count($keyList); $i++){
                
                $wpdb->update(  $table_name,
                                array('ranking' => intval($indexList[$i])),
                                array('key' => intval($keyList[$i])),
                                array('%d'),
                                array('%d')
                            );
                
            }
            
            return $this->getSubscriptions();
            
        }
        
        public function getTaxes($accountKey) {
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_taxes";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            $isExtensionsValid = $this->extensionFunction(false);
            if ($isExtensionsValid === false) {
				
				return array();
				
			} else {
			    
			    return $rows;
			    
			}
            
        }
        
        public function addTaxes($accountKey) {
            
            if ($_POST['type'] == 'surcharge') {
                
                $_POST['tax'] = 'tax_inclusive';
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_taxes";
            $wpdb->insert(
                $table_name, 
    			array(
                    'accountKey'    => intval($accountKey), 
    				'name'          => sanitize_text_field($_POST['name']),  
    				'ranking'       => intval($_POST['rank']),
    				'active'        => sanitize_text_field($_POST['active']),
    				'type'          => sanitize_text_field($_POST['type']),
    				'tax'          => sanitize_text_field($_POST['tax']),
    				'method'        => sanitize_text_field($_POST['method']),
    				'target'        => sanitize_text_field($_POST['target']),
    				'scope'         => sanitize_text_field($_POST['scope']),
    				'value'         => floatval($_POST['value']),
    			), 
    			array('%d', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%f')
    		);
    		
            return $this->getTaxes($accountKey);
            
        }
        
        public function updateTaxes($accountKey) {
            
            if (!isset($_POST['active']) || strlen($_POST['active']) == 0) {
                
                $_POST['active'] = "false";
                
            }
            
            if ($_POST['type'] == 'surcharge') {
                
                $_POST['tax'] = 'tax_inclusive';
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_taxes";
            $wpdb->update(
                $table_name,
                array(
                    'name'          => sanitize_text_field($_POST['name']),  
    				'active'        => sanitize_text_field($_POST['active']),
    				'type'          => sanitize_text_field($_POST['type']),
    				'tax'          => sanitize_text_field($_POST['tax']),
    				'method'        => sanitize_text_field($_POST['method']),
    				'target'        => sanitize_text_field($_POST['target']),
    				'scope'         => sanitize_text_field($_POST['scope']),
    				'value'         => floatval($_POST['value']),
                ),
                array('key' => intval($_POST['key'])),
                array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%f'),
                array('%d')
            );
            
            return $this->getTaxes($accountKey);
            
        }
        
        public function deleteTaxes($accountKey){
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_taxes";
            $wpdb->delete($table_name, array('key' => intval($_POST['key'])), array('%d'));
            return $this->getTaxes($accountKey);
            
        }
        
        public function changeTaxesRank($accountKey){
            
            $keyList = explode(",", $_POST['keyList']);
            $indexList = explode(",", $_POST['indexList']);
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_taxes";
            for ($i = 0; $i < count($keyList); $i++) {
                
                $wpdb->update(
                    $table_name,
                    array('ranking' => intval($indexList[$i])),
                    array('key' => intval($keyList[$i])),
                    array('%d'),
                    array('%d')
                );
                
            }
            
            return $this->getTaxes($accountKey);
            
        }
        
        public function changeCourseRank(){
            
            $accountKey = 1;
            if (isset($_POST['accountKey'])) {
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            $keyList = explode(",", $_POST['keyList']);
            $indexList = explode(",", $_POST['indexList']);
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_courseData";
            for ($i = 0; $i < count($keyList); $i++) {
                
                $wpdb->update(
                    $table_name,
                    array('ranking' => intval($indexList[$i])),
                    array('key' => intval($keyList[$i])),
                    array('%d'),
                    array('%d')
                );
                
            }
            
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d ORDER BY ranking ASC;", array(intval($accountKey)));
            $rows = $wpdb->get_results($sql, ARRAY_A);
            return $rows;
            
        }
        
        public function addForm(){
            
            $accountKey = 1;
            if (isset($_POST['accountKey'])) {
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_form";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d;", array(intval($accountKey)));
            $row = $wpdb->get_row($sql, ARRAY_A);
            if (is_null($row)) {
                
                return array('status' => 'error');
                
            } else {
                
                $id = strtolower($_POST['id']);
                $id = preg_replace('/[^0-9a-zA-Z]/', '', $id);
                $id  = preg_replace("/^( )|(　)$/", "", $id );

                $data = json_decode($row['data'], true);
                foreach ($data as $key => $value) {
                    
                    if ($value->id == $id) {
                        
                        return array("status" => "error", "message" => "An ID with the same name already exists in the form.");
                        
                    }
                    
                }
                
                $item = array(  "id"                => $id, 
                                "name"              => sanitize_text_field($_POST["name"]), 
                                "description"       => sanitize_textarea_field($_POST["description"]),
                                "value"             => "", 
                                "uri"               => sanitize_textarea_field($_POST["uri"]),
                                "type"              => sanitize_text_field($_POST["type"]), 
                                "active"            => sanitize_text_field($_POST["active"]), 
                                "options"           => sanitize_text_field($_POST["options"]), 
                                "required"          => sanitize_text_field($_POST["required"]), 
                                "isName"            => sanitize_text_field($_POST["isName"]),
                                "isEmail"           => sanitize_text_field($_POST["isEmail"]),
                                "isAddress"         => sanitize_text_field($_POST["isAddress"]),
                                "isTerms"           => sanitize_text_field($_POST["isTerms"]),
                            );
                array_push($data, $item);
                $json = json_encode($data);
                if (defined('JSON_NUMERIC_CHECK')) {
                    
                    $json = json_encode($data, JSON_NUMERIC_CHECK);
                    
                }
                
                $wpdb->update(  
                    $table_name,
                    array('data' => $json),
                    array('key' => intval($row['key'])),
                    array('%s'),
                    array('%d')
                );
                
                return $data;
                        
            }
            
        }
        
        public function updateForm(){
            
            $accountKey = 1;
            if(isset($_POST['accountKey'])){
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_form";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d;", array(intval($accountKey)));
            $row = $wpdb->get_row($sql, ARRAY_A);
            if(is_null($row)){
                
                return array('status' => 'error');
                
            }else{
                
                $id = strtolower($_POST['id']);
                $id = preg_replace('/[^0-9a-zA-Z]/', '', $id);
                $id  = preg_replace("/^( )|(　)$/", "", $id );
                $input = array();
                $data = json_decode($row['data']);
                #for($i = 0; $i < count($data); $i++){
                foreach($data as $i => $value) {
                    
                    if(intval($i) == intval($_POST['key']) && $value->id == $id){
                        
                        $value->name                = sanitize_text_field($_POST['name']);
                        $value->description         = sanitize_textarea_field($_POST['description']);
                        $value->uri                 = sanitize_text_field($_POST['uri']);
                        $value->active              = sanitize_text_field($_POST['active']);
                        $value->type                = sanitize_text_field($_POST['type']);
                        $value->options             = sanitize_text_field($_POST['options']);
                        $value->required            = sanitize_text_field($_POST['required']);
                        $value->isName              = sanitize_text_field($_POST['isName']);
                        $value->isAddress           = sanitize_text_field($_POST['isAddress']);
                        $value->isEmail             = sanitize_text_field($_POST['isEmail']);
                        $value->isTerms             = sanitize_text_field($_POST['isTerms']);
                        /**
                        $data[$i]->name         = sanitize_text_field($_POST['name']);
                        $data[$i]->description  = sanitize_textarea_field($_POST['description']);
                        $data[$i]->active       = sanitize_text_field($_POST['active']);
                        $data[$i]->type         = sanitize_text_field($_POST['type']);
                        $data[$i]->options      = sanitize_text_field($_POST['options']);
                        $data[$i]->required     = sanitize_text_field($_POST['required']);
                        $data[$i]->isName       = sanitize_text_field($_POST['isName']);
                        $data[$i]->isAddress    = sanitize_text_field($_POST['isAddress']);
                        $data[$i]->isEmail      = sanitize_text_field($_POST['isEmail']);
                        **/
                        #break;
                        
                    }
                    
                    array_push($input, $value);
                    
                }
                
                $json = json_encode($input);
                if (defined('JSON_NUMERIC_CHECK')) {
                    
                    $json = json_encode($input, JSON_NUMERIC_CHECK);
                    
                }
                $wpdb->update(  
                                $table_name,
                                array('data' => $json),
                                array('key' => intval($row['key'])),
                                array('%s'),
                                array('%d')
                            );
                
                return $input;
                
            }
            
            
        }
        
        public function deleteFormItem(){
            
            $accountKey = 1;
            if(isset($_POST['accountKey'])){
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_form";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d;", array(intval($accountKey)));
            $row = $wpdb->get_row($sql, ARRAY_A);
            if(is_null($row)){
                
                return array('status' => 'error');
                
            }else{
                
                $data = json_decode($row['data']);
                array_splice($data, intval($_POST['key']), 1);
                $json = json_encode($data);
                if (defined('JSON_NUMERIC_CHECK')) {
                    
                    $json = json_encode($data, JSON_NUMERIC_CHECK);
                    
                }
                $wpdb->update(  
                                $table_name,
                                array('data' => $json),
                                array('key' => intval($row['key'])),
                                array('%s'),
                                array('%d')
                            );
                
                return $data;
                        
            }
            
            
        }
        
        public function changeFormRank(){
            
            $accountKey = 1;
            if(isset($_POST['accountKey'])){
                
                $accountKey = $_POST['accountKey'];
                
            }
            
            $keyList = explode(",", $_POST['keyList']);
            $indexList = explode(",", $_POST['indexList']);
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_form";
            $sql = $wpdb->prepare("SELECT * FROM ".$table_name." WHERE `accountKey` = %d;", array(intval($accountKey)));
            $row = $wpdb->get_row($sql, ARRAY_A);
            if(is_null($row)){
                
                return array('status' => 'error');
                
            }else{
                
                $newData = array();
                $data = json_decode($row['data']);
                #for($i = 0; $i < count($data); $i++){
                foreach ($data as $key => $value) {
                    
                    $search = array_search($value->name, $keyList);
                    $index = intval($indexList[$search]);
                    $newData[$index] = $value;
                    
                }
                
                ksort($newData);
                $json = json_encode($newData);
                if (defined('JSON_NUMERIC_CHECK')) {
                    
                    $json = json_encode($newData, JSON_NUMERIC_CHECK);
                    
                }
                $wpdb->update(  
                                $table_name,
                                array('data' => $json),
                                array('key' => intval($row['key'])),
                                array('%s'),
                                array('%d')
                            );
                
                return $newData;
                        
            }
            
            
        }
        
        public function getCss($fileName, $plugin_dir_path) {
            
            if (get_option('_' . $this->pluginName . '_css_v') === false) {
                
                add_option('_' . $this->pluginName . '_css_v', date('U'));
                
            }
            
            $upload_dir = wp_upload_dir();
            $dirname = $upload_dir['basedir'] . '/' . $this->pluginName;
            /**
            if (function_exists('get_sites') && class_exists('WP_Site_Query')) {
                
                $id = get_current_blog_id();
                $dirname .= '/' . $id;
                
            }
            **/
            $css = "";
            if (!file_exists($dirname)) {
            	
            	#wp_mkdir_p($dirname);
            	if (wp_mkdir_p($dirname) === true) {
            	    
            	    $css = file_get_contents($plugin_dir_path . 'css/front_end.css');
            	    file_put_contents($dirname . '/' . $fileName, $css);
            	    
            	} else {
            	    
            	    $css = "There is a problem with directory permissions on wp-content or wp-content/uploads.";
            	    
            	}
            	
            } else {
                
                $css = file_get_contents($dirname . '/' . $fileName);
                
            }
            
            return $css;
            
        }
        
        public function getCssUrl($fileName) {
            
            $upload_dir = wp_upload_dir();
            $dirname = $upload_dir['baseurl'] . '/' . $this->pluginName;
            /**
            if (function_exists('get_sites') && class_exists('WP_Site_Query')) {
                
                $id = get_current_blog_id();
                $dirname .= '/' . $id . '/' . $fileName;
                
            } else {
                
                $dirname .= '/' . $fileName;
                
            }
            **/
            $dirname .= '/' . $fileName;
            return array('dirname' => $dirname, 'v' => get_option('_' . $this->pluginName . '_css_v'));
            
        }
        
        public function updateCss($fileName) {
            
            update_option('_' . $this->pluginName . '_css_v', date('U'));
            $upload_dir = wp_upload_dir();
            $dirname = $upload_dir['basedir'] . '/' . $this->pluginName;
            /**
            if (function_exists('get_sites') && class_exists('WP_Site_Query')) {
                
                $id = get_current_blog_id();
                $dirname .= '/' . $id;
                
            }
            **/
            $value = str_replace("\\\"", "\"", $_POST['value']);
            $value = str_replace("\'", "'", $value);
            file_put_contents($dirname . '/' . $fileName, $value);
            return array("status" => "success");
            
        }
        
        public function updataEmailMessageForCalendarAccount(){
            
            $accountKey = intval($_POST['accountKey']);
            $mail_id = sanitize_text_field($_POST['mail_id']);
            $subject = sanitize_text_field($_POST['subject']);
            $content = balanceTags(wp_kses_post($_POST['content']));
            $subjectForAdmin = sanitize_text_field($_POST['subjectForAdmin']);
            $contentForAdmin = balanceTags(wp_kses_post($_POST['contentForAdmin']));
            $enable = intval($_POST['enable']);
            $format = sanitize_text_field($_POST['format']);
            
            global $wpdb;
            $table_name = $wpdb->prefix."booking_package_emailSetting";
            $wpdb->update(
                $table_name,
                array('subject' => $subject, 'content' => $content, 'subjectForAdmin' => $subjectForAdmin, 'contentForAdmin' => $contentForAdmin, 'enable' => $enable, 'format' => $format),
                array('accountKey' => $accountKey, 'mail_id' => $mail_id),
                array('%s', '%s', '%s', '%s', '%d', '%s'),
                array('%d', '%s')
            );
            
            return $this->getEmailMessageList($accountKey);
            
        }
        
        public function updataEmailMessage($key, $subject, $content, $enable, $format){
            
            $key = sanitize_text_field($key);
            $subject = sanitize_text_field($subject);
            $content = balanceTags(wp_kses_post($content));
            $enable = sanitize_text_field($enable);
            $format = sanitize_text_field($format);
            
            if(get_option($key."_subject") === false){
					    
				add_option($key."_subject", $subject);
				
		    }else{
				
				update_option($key."_subject", $subject);
	            
			 }
			 
			 if(get_option($key."_content") === false){
					    
				add_option($key."_content", $content);
				
		    }else{
				
				update_option($key."_content", $content);
	            
			 }
			 
			 if(get_option($key."_enable") === false){
					    
				add_option($key."_enable", $enable);
				
		    }else{
				
				update_option($key."_enable", $enable);
	            
		    }
		    
		    if(get_option($key."_format") === false){
					    
				add_option($key."_format", $format);
				
		    }else{
				
				update_option($key."_format", $format);
	            
		    }
            
            return $this->getEmailMessage();
            
        }
        
        public function lookingForSubscription(){
            
            global $wpdb;
            $url = BOOKING_PACKAGE_EXTENSION_URL;
            #$host = parse_url(admin_url());
            #$lookingForUrl = $host['scheme']."://".$host['host'];
            $lookingForUrl = site_url();
            $response = array(
                'status' => 'error', 
                'customer_id_for_subscriptions' => $_POST['customer_id_for_subscriptions'],
                'customer_email_for_subscriptions' => $_POST['customer_email_for_subscriptions'],
                'subscriptions_id_for_subscriptions' => $_POST['subscriptions_id_for_subscriptions'],
                'url' => $lookingForUrl,
            );
            
            $params = array(
                'mode' => 'error', 
                'customer_id_for_subscriptions' => $_POST['customer_id_for_subscriptions'],
                'customer_email_for_subscriptions' => $_POST['customer_email_for_subscriptions'],
                'subscriptions_id_for_subscriptions' => $_POST['subscriptions_id_for_subscriptions'],
                'url' => $lookingForUrl,
            );
            
            $header = array(
                "Content-Type: application/x-www-form-urlencoded",
                "Content-Length: ".strlen(http_build_query($params))
            );
            
            $context = array(
                "http" => array(
	                "method"  => "POST",
	                "header"  => implode("\r\n", $header),
	                "content" => http_build_query($params)
                )
                
            );
            /**
			$response = file_get_contents($url."lookingForSubscription/", false, stream_context_create($context));
            $response = json_decode($response, true);
            if (intval($response['status']) == 1) {
                
                unset($response['status']);
                foreach($response as $key => $value){
                    
                    if (get_option('_'.$this->prefix.$key) !== false) {
                        
                        update_option('_'.$this->prefix.$key, sanitize_text_field($value));
                        
                    } else {
                        
                        $bool = add_option('_'.$this->prefix.$key, sanitize_text_field($value));
                        
                    }
                    
                }
                
            }
            **/
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url."lookingForSubscription/");
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            curl_setopt($ch, CURLOPT_POST, 1);
            ob_start();
            $response = curl_exec($ch);
			$response = ob_get_contents();
			ob_end_clean();
			curl_close($ch);
			$response = json_decode($response, true);
            if (intval($response['status']) == 1) {
                
                unset($response['status']);
                foreach($response as $key => $value){
                    
                    if (get_option('_'.$this->prefix.$key) !== false) {
                        
                        update_option('_'.$this->prefix.$key, sanitize_text_field($value));
                        
                    } else {
                        
                        $bool = add_option('_'.$this->prefix.$key, sanitize_text_field($value));
                        
                    }
                    
                }
                
            }
            
            return $response;
            
        }
        
        public function upgradePlan($type){
            
            $response = array('status' => 'error');
            if($type == 'regist'){
                
                #$values = ['customer_id_for_subscriptions', 'id_for_subscriptions', 'customer_email_for_subscriptions'];
                $values = array('customer_id_for_subscriptions', 'id_for_subscriptions', 'customer_email_for_subscriptions', 'invoice_id_for_subscriptions', 'expiration_date_for_subscriptions');
                for($i = 0; $i < count($values); $i++){
                    
                    $key = $values[$i];
                    $value = sanitize_text_field($_GET[$key]);
                    if(get_option('_'.$this->prefix.$key) === false){
					   
				        add_option('_'.$this->prefix.$key, $value);
				    
		            }else{
				        
				        update_option('_'.$this->prefix.$key, $value);
	                    
                    }
		            
                }
                
                $response['status'] = 'success';
                
            }else if($type == 'update'){
                
                #$values = ['invoice_id_for_subscriptions', 'expiration_date_for_subscriptions'];
                $values = array('invoice_id_for_subscriptions', 'expiration_date_for_subscriptions');
                for($i = 0; $i < count($values); $i++){
                    
                    $key = $values[$i];
                    $value = sanitize_text_field($_POST[$key]);
                    if(get_option('_'.$this->prefix.$key) === false){
					   
				        add_option('_'.$this->prefix.$key, $value);
				    
		            }else{
				        
				        update_option('_'.$this->prefix.$key, $value);
	                    
                    }
		            
                }
                
                $response['status'] = 'success';
                
            }else if($type == 'get'){
                
                #$values = ['customer_id_for_subscriptions', 'id_for_subscriptions', 'customer_email_for_subscriptions', 'invoice_id_for_subscriptions', 'expiration_date_for_subscriptions'];
                $values = array('customer_id_for_subscriptions', 'id_for_subscriptions', 'customer_email_for_subscriptions', 'invoice_id_for_subscriptions', 'expiration_date_for_subscriptions');
                for($i = 0; $i < count($values); $i++){
                    
                    $key = $values[$i];
                    $value = get_option('_'.$this->prefix.$key, 0);
                    if (get_option($this->prefix.$key) !== false) {
                        
                        $value = get_option($this->prefix.$key);
                        delete_option($this->prefix.$key);
                        add_option('_'.$this->prefix.$key, $value);
                        
                    }
                    $response[$key] = $value;
                    
                }
                
                $response['status'] = 'success';
                
            }else if($type == 'delete'){
                
                $values = array('customer_id_for_subscriptions', 'id_for_subscriptions', 'customer_email_for_subscriptions', 'invoice_id_for_subscriptions', 'expiration_date_for_subscriptions');
                for($i = 0; $i < count($values); $i++){
                    
                    $key = $values[$i];
                    $value = sanitize_text_field($_POST[$key]);
                    if(get_option('_'.$this->prefix.$key) === false){
					   
				        add_option('_'.$this->prefix.$key, 0);
				    
		            }else{
				        
				        update_option('_'.$this->prefix.$key, 0);
	                    
                    }
		            
                }
                
                $response['status'] = 'success';
                
            }
            
            return $response;
            
        }
        
        public function extensionFunction($loadScript = true){
            
            $url = BOOKING_PACKAGE_EXTENSION_URL;
            $response = array('status' => 'error');
            $subscriptions = $this->upgradePlan('get');
            
            if(intval($subscriptions['expiration_date_for_subscriptions']) == 0){
                
                return false;
                
            }
            
            $expiration_date = intval($subscriptions['expiration_date_for_subscriptions']);
            #$expiration_date = 0;
            #$timezone = date_default_timezone_get();
            #$timezone = get_option('timezone_string');
            #date_default_timezone_set($timezone);
            if($expiration_date < date('U')){
                
                #print "update license.";
                
                $params = array("customer_id" => $subscriptions['customer_id_for_subscriptions'], "subscriptions_id" => $subscriptions['id_for_subscriptions']);
                
                $tmp_path = sys_get_temp_dir();
                
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url."updateLicense/");
                curl_setopt($ch, CURLOPT_USERPWD, $subscriptions['customer_id_for_subscriptions'].":");
                curl_setopt($ch, CURLOPT_COOKIEJAR, $tmp_path."/".$this->prefix."session.cookie");
                curl_setopt($ch, CURLOPT_COOKIEFILE, $tmp_path."/".$this->prefix."session.cookie");
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
                curl_setopt($ch, CURLOPT_POST, 1);
                ob_start();
                $response = curl_exec($ch);
				$response = ob_get_contents();
				ob_end_clean();
				$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                $error = curl_error($ch);
                if(strlen($error) != 0){
	                
	                $header = array(
		                "Content-Type: application/x-www-form-urlencoded",
		                "Content-Length: ".strlen(http_build_query($params))
	                );
	                $context = array(
		                
		                "http" => array(
			                "method"  => "POST",
			                "header"  => implode("\r\n", $header),
			                "content" => http_build_query($params)
		                )
		                
	                );
					$response = file_get_contents($url."updateLicense/", false, stream_context_create($context));
	                
                }
                curl_close($ch);


                /**
                ob_start();
                $response = curl_exec($ch);
                $response = ob_get_contents();
                ob_end_clean();
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close ($ch);
                **/
                $response = json_decode($response);
                #var_dump($response);
                if(intval($response->status) != 0){
                    
                    #var_dump($response);
                    update_option('_'.$this->prefix."invoice_id_for_subscriptions", sanitize_text_field($response->invoice_id));
                    $bool = update_option('_'.$this->prefix."expiration_date_for_subscriptions", sanitize_text_field($response->expiration_date));
                    $subscriptions = $this->upgradePlan('get');
                    #print "Success.";
                    
                }else{
                    
                    return false;
                    
                }
                
            }
            
            if($loadScript === true){
                
                #print "get extensions.";
                $url .= "expiration/extensions.js?token=".hash('ripemd160', $subscriptions['invoice_id_for_subscriptions'])."&customer_id=".$subscriptions['customer_id_for_subscriptions'];
                wp_enqueue_script('extension_function_js', $url);
                
            }
            
            return true;
            
        }
        
        public function payNewSubscriptions(){
            
            $url = BOOKING_PACKAGE_EXTENSION_URL;
            $response = array("status" => "error", "customer_id_for_subscriptions" => $_POST['customer_id_for_subscriptions']);
            $params = array(
                "customer_id_for_subscriptions" => $_POST['customer_id_for_subscriptions'], 
                "customer_email_for_subscriptions" => $_POST['customer_email_for_subscriptions'],
                "site" => $_POST['site'],
            );
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url."payNewSubscriptions/");
            curl_setopt($ch, CURLOPT_USERPWD, $subscriptions['customer_id_for_subscriptions'].":");
            curl_setopt($ch, CURLOPT_COOKIEJAR, $tmp_path."/".$this->prefix."session.cookie");
            curl_setopt($ch, CURLOPT_COOKIEFILE, $tmp_path."/".$this->prefix."session.cookie");
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            curl_setopt($ch, CURLOPT_POST, 1);
            ob_start();
            $response = curl_exec($ch);
			$response = ob_get_contents();
			ob_end_clean();
			$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            $response = json_decode($response, true);
            if ($response['status'] == 'success') {
                
                foreach($response as $key => $value) {
                    
                    $_GET[$key] = $value;
                    
                }
                $this->upgradePlan('regist');
                
            }
            
            return $response;
            
        }
        
        public function updateChannelGC($calendarAccountList){
            
            $url_parce = parse_url(get_home_url());
            if($url_parce['scheme'] != 'https'){
                
                return false;
                
            }
            
            $keyList = array();
            $calendarIdList = array();
            for($i = 0; $i < count($calendarAccountList); $i++){
                
                if($calendarAccountList[$i]['expirationForGoogleWebhook'] < date('U')){
                    
                    array_push($keyList, $calendarAccountList[$i]['key']);
                    array_push($calendarIdList, $calendarAccountList[$i]['googleCalendarID']);
                    
                }
                
            }
            
            if(count($calendarIdList) == 0){
                
                return null;
                
            }
            
            $calendarIdList = implode(",", $calendarIdList);
            
            $googleCalendar = array();
    		$bookingSync = $this->getBookingSyncList();
    		$bookingSync = $bookingSync['Google_Calendar'];
    		if(intval($bookingSync['booking_package_googleCalendar_active']['value']) == 1){
    		    
    		    if($this->extensionFunction(false) === true){
    		        
    		        $expiration_for_google_webhook = get_option($this->prefix."expiration_for_google_webhook", 0);
    		        $expiration_for_google_webhook -= (1440 * 60) * 2;
    		        #$timezone = get_option('timezone_string');
			        date_default_timezone_set("UTC");
			        if(date('U') < $expiration_for_google_webhook){
			            
			            return false;
			            
			        }
    		        
		            $host = $url_parce["host"];
		            $address = get_home_url()."/?webhook=google";
    		        $id = hash('ripemd160', date('U'));
    		        $timezone = get_option('timezone_string');
    		        $subscriptions = $this->upgradePlan('get');
    		        
    				$customer_id = $subscriptions['customer_id_for_subscriptions'];
    				$params = array(
    					'mode' => 'updateChannel',
    					'customer_id' => $customer_id, 
    					'calendarIdList' => $calendarIdList,
    					/**'calendarId' => $bookingSync['booking_package_calendar_id']['value'], **/
    					'service_account' => $bookingSync['booking_package_googleCalendar_json']['value'],
    					'id' => $id,
    					'token' => 'target='.hash('ripemd160', microtime()),
    					'address' => $address,
    					'timeZone' => get_option('timezone_string')
    				);
    				#var_dump($params);
    				if(isset($bookingSync['booking_package_googleCalendar_json'])){
    				    
    				    $params['calendarId'] = $bookingSync['booking_package_calendar_id']['value'];
    				    
    				}
    				
    				$tmp_path = sys_get_temp_dir();
    				
    				$url = BOOKING_PACKAGE_EXTENSION_URL;
    				$ch = curl_init();
                	curl_setopt($ch, CURLOPT_URL, $url."googleCalendar/");
                	curl_setopt($ch, CURLOPT_COOKIEJAR, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_COOKIEFILE, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
                	curl_setopt($ch, CURLOPT_POST, 1);
                	
                	ob_start();
                	$response = curl_exec($ch);
                	$response = ob_get_contents();
                	ob_end_clean();
                	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                	curl_close ($ch);
                	$response = json_decode($response, true);
                	#var_dump($response);
                	if($response['status'] != 'error'){
                	    
                	    for($i = 0; $i < count($response); $i++){
                    	    
                    	    $response[$i]['key'] = $keyList[$i];
                    	    
                    	}
                    	
                    	if(isset($response['expiration'])){
                    	    
                    	    $response['expiration'] /= 1000;
                    	    $list = array('id' => 'id_for_google_webhook', 'token' => 'token_for_google_webhook', 'expiration' => 'expiration_for_google_webhook');
                    	    foreach($list as $key => $value){
                    	        
                    	        $optionKey = sanitize_text_field($this->prefix.$value);
                    	        $optionValue = sanitize_text_field($response[$key]);
                    	        if(get_option($optionKey) === false){
    					            
    	                            add_option($optionKey, $optionValue);
    					        
                                }else{
    				                
    				                update_option($optionKey, $optionValue);
    				                
    			                }
                    	        
                    	    }
                    	    
                    	}
                	    
                	}else{
                	    
                	    $response = array();
                	    
                	}
                	
                	
                	
                	#var_dump($response);
                	
                	return $response;
    		        
    		    }
    		    
    		}
            
        }
        
        public function listsGC($accountKey, $googleCalendarID, $timeMin){
            
            if(strlen($googleCalendarID) == 0){
                
                return array();
                
            }
            
            
            $eventList = array();
    		$bookingSync = $this->getBookingSyncList($accountKey);
    		$bookingSync = $bookingSync['Google_Calendar'];
    		#var_dump($bookingSync);
    		if(intval($bookingSync['booking_package_googleCalendar_active']['value']) == 1){
    			
    			#var_dump($this->extensionFunction(false));
    			if($this->extensionFunction(false) === true){
    			    
    			    $subscriptions = $this->upgradePlan('get');
    				$customer_id = $subscriptions['customer_id_for_subscriptions'];
    				$params = array(
    								'mode' => 'lists',
    								'timeMin' => $timeMin,
    								'customer_id' => $customer_id, 
    								'calendarId' => $googleCalendarID, 
    								'service_account' => $bookingSync['booking_package_googleCalendar_json']['value'],
    								'timeZone' => get_option('timezone_string')
    							);
    			    
    			    #var_dump($params);
    			    $tmp_path = sys_get_temp_dir();
    			    
    			    $url = BOOKING_PACKAGE_EXTENSION_URL;
    				$ch = curl_init();
                	curl_setopt($ch, CURLOPT_URL, $url."googleCalendar/");
                	#curl_setopt($ch, CURLOPT_USERPWD, $subscriptions['customer_id_for_subscriptions'].":");
                	curl_setopt($ch, CURLOPT_COOKIEJAR, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_COOKIEFILE, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
                	curl_setopt($ch, CURLOPT_POST, 1);
                	
                	ob_start();
                	$response = curl_exec($ch);
                	$response = ob_get_contents();
                	ob_end_clean();
                	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                	curl_close ($ch);
                	$eventList = json_decode($response);
                	if($eventList->status != 'error'){
                		
                	}
                	
                	return $eventList;
    			    
    			}
    			
    		}
            
        }
        
        public function pushGC($mode, $accountKey, $type, $id, $googleCalendarID, $sql_start_unixTime, $sql_end_unixTime, $form, $iCalID = false){
    		
    		if(strlen($googleCalendarID) == 0){
                
                return array();
                
            }
    		
    		$id = intval($id);
    		$googleCalendar = array();
    		$bookingSync = $this->getBookingSyncList($accountKey);
    		$bookingSync = $bookingSync['Google_Calendar'];
    		if(intval($bookingSync['booking_package_googleCalendar_active']['value']) == 1){
    			
    			if($this->extensionFunction(false) === true){
    				
    				if(is_null($sql_end_unixTime)){
    					
    					$sql_end_unixTime = $sql_start_unixTime;
    					
    				}
    				$nameList = array();
    				$addressList = array();
    				for($i = 0; $i < count($form); $i++){
    					
    					if($form[$i]->isName == 'true'){
    						
    						array_push($nameList, $form[$i]->value);
    						
    					}
    					
    					if($form[$i]->isAddress == 'true'){
    						
    						array_push($addressList, $form[$i]->value);
    						
    					}
    					
    				}
    				
    				$subscriptions = $this->upgradePlan('get');
    				$customer_id = $subscriptions['customer_id_for_subscriptions'];
    				$params = array(
    								'mode' => $mode,
    								'customer_id' => $customer_id, 
    								'calendarId' => $googleCalendarID, 
    								'service_account' => $bookingSync['booking_package_googleCalendar_json']['value'],
    								'startTime' => intval($sql_start_unixTime),
    								'endTime' => intval($sql_end_unixTime),
    								'form' => json_encode($form),
    								'timeZone' => get_option('timezone_string'),
    								'type' => $type
    							);
    							
    				if($iCalID !== false){
    				    
    				    $params['iCalID'] = $iCalID;
    				    
    				}
    				
    				#var_dump($params);
    				
    				$tmp_path = sys_get_temp_dir();
    				
    				$url = BOOKING_PACKAGE_EXTENSION_URL;
    				$ch = curl_init();
                	curl_setopt($ch, CURLOPT_URL, $url."googleCalendar/");
                	curl_setopt($ch, CURLOPT_COOKIEJAR, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_COOKIEFILE, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
                	curl_setopt($ch, CURLOPT_POST, 1);
                	
                	ob_start();
                	$response = curl_exec($ch);
                	$response = ob_get_contents();
                	ob_end_clean();
                	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                	curl_close ($ch);
                	#var_dump($response);
                	$googleCalendar = json_decode($response);
                	if($googleCalendar->status != 'error'){
                		
                	}
                	
                	#var_dump($httpCode);
                	$googleCalendar->responseMode = $mode;
                	if($httpCode >= 400){
                	    
                	    $googleCalendar->responseCode = $httpCode;
                	    $googleCalendar->responseStatus = 0;
                	    
                	}else{
                	    
                	    $googleCalendar->responseStatus = 1;
                	    
                	}
                	
                	return $googleCalendar;
                		
    			}
    			
    		}
    		
    	}
    	
    	public function deleteGC($accountKey, $id, $googleCalendarID){
            
            if(strlen($googleCalendarID) == 0){
                
                return array();
                
            }
            
            if(is_null($id)){
                
                return array("id" => "No ID");
                
            }
            
            $googleCalendar = array();
    		$bookingSync = $this->getBookingSyncList($accountKey);
    		$bookingSync = $bookingSync['Google_Calendar'];
    		if(intval($bookingSync['booking_package_googleCalendar_active']['value']) == 1){
    		    
    		    if($this->extensionFunction(false) === true){
    		        
    		        $timezone = get_option('timezone_string');
    		        $subscriptions = $this->upgradePlan('get');
    				$customer_id = $subscriptions['customer_id_for_subscriptions'];
    				$params = array(
    								'mode' => 'delete',
    								'customer_id' => $customer_id, 
    								'calendarId' => $googleCalendarID, 
    								'service_account' => $bookingSync['booking_package_googleCalendar_json']['value'],
    								'id' => $id,
    								'timeZone' => get_option('timezone_string')
    							);
    				#var_dump($params);
    				
    				$tmp_path = sys_get_temp_dir();
    				
    				$url = BOOKING_PACKAGE_EXTENSION_URL;
    				$ch = curl_init();
                	curl_setopt($ch, CURLOPT_URL, $url."googleCalendar/");
                	#curl_setopt($ch, CURLOPT_USERPWD, $subscriptions['customer_id_for_subscriptions'].":");
                	curl_setopt($ch, CURLOPT_COOKIEJAR, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_COOKIEFILE, $tmp_path."/".$this->prefix."session.cookie");
                	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
                	curl_setopt($ch, CURLOPT_POST, 1);
                	
                	ob_start();
                	$response = curl_exec($ch);
                	$response = ob_get_contents();
                	ob_end_clean();
                	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                	curl_close ($ch);
                	$response = json_decode($response, true);
                	
                	return $response;
    		        
    		    }
    		    
    		}
            
        }
        
        public function activation($url, $mode, $version = null, $timezone = null, $site = null){
			
			/**
			if($mode == 'upgrader'){
			    
			    $current_version = $this->prefix."current_version";
			    $old_version = get_option($current_version, 0);
			    if($old_version == 0){
			        
			        add_option($current_version, $version);
			        
			    }else{
			        
			        update_option($current_version, $version);
			        
			    }
			    
			    if($old_version == $version){
			        
			        return null;
			        
			    }
			    
			}
			**/
			
			if (is_null($timezone)) {
			    
			    $timezone = get_option($this->prefix . 'timezone', null);
    			if (is_null($timezone)) {
    			    
    			    $timezone = get_option('timezone_string', '');
        			if(is_null($timezone) || strlen($timezone) == 0){
        				
        				$timezone = 'UTC';
        				
        			}
        			
        			add_option($this->prefix."timezone", sanitize_text_field($timezone));
    			    
    			}
			    
			}
			
			if (is_null($site)) {
			    
			    $site = site_url();
			    
			}
			
			$id = get_option($this->prefix."activation_id", null);
			$params = array("mode" => $mode, "timeZone" => $timezone, "local" => get_locale(), "site" => $site);
			
			if(!is_null($id) || $id != 0){
				
				$params['id'] = $id;
				
			}
			
			if(!is_null($version)){
			    
			    $params['version'] = $version;
			    
			}
			#var_dump($params);
			/**
			$header = array(
				"Content-Type: application/x-www-form-urlencoded",
				"Content-Length: ".strlen(http_build_query($params))
			);
			
			$context = array(
				"http" => array(
					"method"  => "POST",
					"header"  => implode("\r\n", $header),
					"content" => http_build_query($params)
				)
			);
			
			$response = file_get_contents($url."activation/", false, stream_context_create($context));
			**/
			$ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url."activation/");
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            curl_setopt($ch, CURLOPT_POST, 1);
            ob_start();
            $response = curl_exec($ch);
			$response = ob_get_contents();
			ob_end_clean();
			curl_close($ch);
			$object = json_decode($response);
			#var_dump($object);
			if($mode == 'activation'){
				
				if(get_option($this->prefix."activation_id") === false){
					
					add_option($this->prefix."activation_id", intval($object->key));
					
				}else{
					
					update_option($this->prefix."activation_id", intval($object->key));
					
				}
				
			}
			
		}
        
    }
    
    
?>