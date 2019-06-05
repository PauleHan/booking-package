/*globals scriptError */
/*globals I18n */
/*globals Booking_App_XMLHttp */
/*globals FORMAT_COST */
/*globals Booking_Package_Member */
/*globals booking_package_subscriptions */
/*globals Booking_App_Calendar */
/*globals Hotel */
/*globals TAXES */

var reservation_info = reservation_info;
var booking_package_dictionary = booking_package_dictionary;
console.log(reservation_info);
//const url = reservation_info.url;
//const action = reservation_info.action;
//const nonce = reservation_info.nonce;
var currency = reservation_info.currency;

var courseBool = reservation_info.courseBool;
var courseList = reservation_info.courseList;

var xmlHttp = null;

var monthFullName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthShortName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


var booking_App = null;

//window.onload = function(){
window.addEventListener('load', function(){
    
    console.log(reservation_info);
    console.log(document.styleSheets);
    console.log(booking_package_dictionary);
    var userAgent = window.navigator.userAgent.toLowerCase();
    var ie = 0;
    console.log(userAgent);
    if (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
        
        console.log('Internet Explorer');
        ie = 1;
        var version = window.navigator.appVersion.toLowerCase();
        console.log(version);
        
    }
    
    if (courseBool == 'true') {
        
        courseBool = true;
        
    } else {
        
        courseBool = false;
        
    }
    
    var stateObj = {page: "nextPage", month: reservation_info['month'], day: reservation_info['day'], year: reservation_info['year']};
    window.history.pushState(stateObj, null, null);
    booking_App = new Booking_App(reservation_info, booking_package_subscriptions, booking_package_dictionary);
    booking_App.setIE(ie);
    //booking_App.start();
    var judge = booking_App.getJudge();
    console.log("judge = " + judge);
    if (judge == true) {
        
        console.log("judge = " + judge);
        console.log(booking_App._cancellationOfBooking);
        console.log(booking_App._myBookingDetailsBool);
        if (booking_App._myBookingDetailsBool == true) {
            
            booking_App.myBookingDetails();
            
        } else {
            
            booking_App.getReservationData(parseInt(reservation_info['month']), parseInt(reservation_info['day']), parseInt(reservation_info['year']), parseInt(reservation_info['accountKey']), false);
            
        }
        
    } else {
        
        
        
    }
    
});

window.onpopstate = function(event){
    
    console.log(event.state);
    console.log(event);
    
    /**
    if(event.state != null){
        
        var state = event.state;
        if(state.page == "nextPage" || state.page == "previousPage"){
            
            booking_App.getReservationData(state.month, state.day, state.year, state.accountKey);
            
        }else if(state.page == "selectSchedules"){
            
            booking_App.selectCourseAndSchedulePanel(state.month, state.day, state.year, state.calendarData, state.accountKey, null);
            
        }
        
    }
    **/
    
}


var defaultOrientation;

window.addEventListener('load', function(){
    
    if('orientation' in window) {
        
        var o1 = (window.innerWidth < window.innerHeight);
        var o2 = (window.orientation % 180 == 0);
        defaultOrientation = (o1 && o2) || !(o1 || o2);
        checkOrientation();
        
    }
    
}, false);

window.onerror = function(msg, url, line, col, error){
    
    console.log(url);
    var script_error = new scriptError(reservation_info, booking_package_dictionary, msg, url, line, col, error);
    script_error.setFunction(booking_App.getFunction());
    script_error.setResponseText(booking_App.getResponseText());
    script_error.send();
    
}

window.addEventListener('resize', checkOrientation, false);

function checkOrientation(response) {
    
    if('orientation' in window){
        var o = (window.orientation % 180 == 0);
        if((o && defaultOrientation) || !(o || defaultOrientation)) {
            
            var width = window.parent.screen.width;
            if(window.parent.screen.height < window.parent.screen.width){
                
                width = window.parent.screen.width;
                
            }
            console.log('portrait width = ' + width);
            
        }else{
            
            var width = window.parent.screen.width;
            if(window.parent.screen.height > window.parent.screen.width){
                
                width = window.parent.screen.height;
                
            }
            console.log('landscape width = ' + width);
            
        }
        
        if(booking_App != null){
            
            booking_App.resizeScreen(width);
            
        }
        
    }
    
}

    function Booking_App(reservation_info, booking_package_subscriptions, booking_package_dictionary) {
        
        this._i18n = new I18n(reservation_info.locale);
        this._i18n.setDictionary(booking_package_dictionary);
        
        this._dictionary = booking_package_dictionary;
        this._format = new FORMAT_COST(this._i18n);
        this._subscriptions = booking_package_subscriptions;
        this._subscription = null;
        this._member = new Booking_Package_Member(reservation_info.prefix, reservation_info.calendarAccount, reservation_info.memberSetting, booking_package_subscriptions, reservation_info.url, reservation_info.nonce, reservation_info.action, booking_package_dictionary);
        this._isExtensionsValid = parseInt(reservation_info.isExtensionsValid);
        this._reservation_info = reservation_info;
        this._memberSetting = reservation_info.memberSetting;
        this._prefix = reservation_info.prefix;
        this._locale = reservation_info.locale;
        this._url = reservation_info.url;
        this._action = reservation_info.action;
        this._nonce = reservation_info.nonce;
        this._dateFormat = reservation_info.dateFormat;
        this._positionOfWeek = reservation_info.positionOfWeek;
        this._country = reservation_info.country;
        this._currency = reservation_info.currency;
        this._formData = reservation_info.formData;
        this._courseName = reservation_info.courseName;
        this._courseList = reservation_info.courseList;
        this._enableFixCalendar = parseInt(reservation_info.calendarAccount.enableFixCalendar);
        this._topHeightList = [];
        this._top = 0;
        this._bottom = 0;
        this._topPanelHeight = 0;
        this._courseBool = true;
        this._dayPanelList = {};
        this._indexOfDayPanelList = [];
        this._calendarAccount = reservation_info.calendarAccount;
        this._guestsList = reservation_info.guestsList;
        this._lengthOfStayBool = true;
        this._step = "topPage";
        this._chagePanelList = {};
        this._screen_width_limit = 480;
        this._screen_width = parseInt(window.parent.screen.width);
        this._userInformation = {};
        this._headingPosition = reservation_info.headingPosition;
        this._startOfWeek = this._calendarAccount.startOfWeek;
        this._preparationTime = parseInt(this._calendarAccount.preparationTime);
        this._positionPreparationTime = this._calendarAccount.positionPreparationTime;
        this._nationalHoliday = {};
        this._function = {name: "root", post: {}};
        this._ie = 0;
        this._judge = true;
        this._responseText = null;
        this._taxes = reservation_info.taxes;
        this._thanksPage = reservation_info.thanksPage;
        console.log("_preparationTime = " + this._preparationTime);
        console.log("_isExtensionsValid = " + this._isExtensionsValid);
        
        this._permalink = window.location.href ;
        this._cancellationOfBooking = 0;
        if (reservation_info.cancellationOfBooking != null) {
            
            this._cancellationOfBooking = parseInt(reservation_info.cancellationOfBooking);
            
        }
        this._myBookingDetailsBool = false;
        this._myBookingDetails = {};
        if (reservation_info.myBookingDetails != null) {
            
            this._myBookingDetailsBool = true;
            this._myBookingDetails = reservation_info.myBookingDetails;
            console.log(this._myBookingDetails);
            
        }
        this._permalink = null;
        if (reservation_info.permalink != null) {
            
            this._permalink = reservation_info.permalink;
            
        }
        
        if(typeof this._headingPosition == 'string' && isNaN(parseInt(this._headingPosition)) == false){
            
            this._headingPosition = parseInt(this._headingPosition);
            
        }else{
            
            this._headingPosition = 0;
            
        }
        
        if(reservation_info.courseBool == 'false'){
            
            this._courseBool = false;
            
        }
        
        var judge = this.judgeSubscription();
        if(judge == false){
            
            this._judge = judge;
            
        }
        
        this._paymentMethod = reservation_info.paymentMethod;
        console.log(this._paymentMethod);
        
        this._stripe_active = parseInt(reservation_info.stripe_active);
        this._stripe_public_key = null;
        if(reservation_info.stripe_public_key != null){
            
            this._stripe_public_key = reservation_info.stripe_public_key;
            
        }
        
        this._paypal_active = parseInt(reservation_info.paypal_active);
        this._paypal_mode = parseInt(reservation_info.paypal_mode);
        this._paypal_client_id = null;
        if(reservation_info.paypal_client_id != null){
            
            this._paypal_client_id = reservation_info.paypal_client_id;
            
        }
        
        this._loginform = null;
        if(document.getElementById('booking-package-loginform') != null){
            
            this._loginform = document.getElementById('booking-package-loginform');
            this._loginform.classList.add("hidden_panel");
            this.memberOperation();
            
        }
        
        this._body = document.getElementsByTagName("body")[0];
        
        this.monthFullName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.monthShortName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];;
        this.weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this._calendar = new Booking_App_Calendar(this.weekName, this._dateFormat, this._positionOfWeek, this._startOfWeek, this._i18n);
        this._hotel = new Hotel(this._currency, this.weekName, this._dateFormat, this._positionOfWeek, this._startOfWeek, booking_package_dictionary);
        this._hotel.setTaxes(this._taxes);
        
        var MutationObserverBool = true;
        var userAgent = window.navigator.userAgent.toLowerCase();
        if(userAgent.indexOf('firefox') != -1){
            
            MutationObserverBool = false;
            
        }
        console.log(userAgent);
        
        
        //if(this._headingPosition == 1){
            
            if(typeof MutationObserver == 'function' && MutationObserverBool == true){
                
                var object = this;
                this._observer = new MutationObserver(function(mutations){
                    
                    for(var key in mutations){
                        
                        object.watchElement(mutations[key]);
                        
                    }
                    
                    
                });
                
                const config = { attributes: true, childList: false, characterData: false, subtree: true, attributeFilter: ['class', 'style']};
                this._observer.observe(this._body, config);
                
                /**
                this._observer = new MutationObserver((mutations) => {
                    
                    mutations.forEach((mutation) => {
                        
                        this.watchElement(mutation);
                        
                    });
                    
                });
                
                const config = { attributes: true, childList: false, characterData: false, subtree: true, attributeFilter: ['class', 'style']};
                this._observer.observe(this._body, config);
                **/
                
            }
            
            var rect = {left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0};
            if(document.getElementById("booking-package_calendarPage") != null && document.getElementById("booking-package_calendarPage").getBoundingClientRect() != null){
                
                rect = document.getElementById("booking-package_calendarPage").getBoundingClientRect();
                
            }
            var left = rect.left;
            var right = rect.right;
            console.log(rect);
            
            var wpadminbarTop = 0;
            if(document.getElementById("wpadminbar") != null){
                
                wpadminbarTop = document.getElementById("wpadminbar").clientHeight;
                
            }
            
            var list = this._body.getElementsByTagName("*");
            for(var i = 0; i < list.length; i++){
                
                var style = window.getComputedStyle(list[i], null);
                if(style.getPropertyValue("position") == "fixed" && style.getPropertyValue("display") != "none" && style.getPropertyValue("visibility") != "hidden"){
                    
                    var top = parseInt(style.getPropertyValue("top"));
                    var bottom = parseInt(style.getPropertyValue("bottom"));
                    var z_index = 0;
                    if(style.getPropertyValue("z-index") != "auto"){
                        
                        z_index = parseInt(style.getPropertyValue("z-index"));
                        
                    }
                    var rect = list[i].getBoundingClientRect();
                    console.log(list[i]);
                    console.log(rect);
                    if(top <= wpadminbarTop && rect.left < left && rect.right > right){
                        
                        this._topHeightList.push(rect.height);
                        this._top += rect.height;
                        list[i].setAttribute("data-watchTopKey", (this._topHeightList.length - 1));
                        list[i].setAttribute("data-watchPosition", 1);
                        if(z_index < 100){
                            
                            list[i].classList.add("topPanelIndex");
                            
                        }
                        
                        console.log(rect);
                        console.log("z_index = " + z_index);
                        console.log(this._topHeightList);
                        console.log("top = " + top);
                        
                    }
                    
                    if(bottom == 0 && rect.left < left && rect.right > right){
                        
                        this._bottom += rect.height;
                        if(z_index < 100){
                            
                            list[i].classList.add("bottomPanelIndex");
                            
                        }
                        console.log(list[i]);
                        console.log(rect);
                        console.log("z_index = " + z_index);
                        console.log("bottom = " + bottom);
                        
                    }
                    
                }
                
            }
            
            for(var i = 0; i < list.length; i++){
                
                var id = list[i].id;
                if(id == "booking-package_calendarPage"){
                    
                    break;
                    
                }
                
                /**
                var style = window.getComputedStyle(list[i], null);
                if(style.getPropertyValue("overflow") == "hidden"){
                    
                    list[i].setAttribute("style", "overflow: initial;");
                    
                }
                
                if(style.getPropertyValue("overflow-x") == "hidden"){
                    
                    list[i].setAttribute("style", "overflow-x: initial;");
                    
                }
                **/
                
            }
            
        //}
        /**else {
            
            //this.setIE(1);
            
            if(typeof MutationObserver == 'function' && MutationObserverBool == true){
                
                var object = this;
                this._observer = new MutationObserver(function(mutations){
                    
                    for(var key in mutations){
                        
                        object.watchElement(mutations[key]);
                        
                    }
                    
                    
                });
                
                const config = { attributes: true, childList: false, characterData: false, subtree: true, attributeFilter: ['class', 'style']};
                this._observer.observe(this._body, config);
                
            }
            
        }
        **/
        
    }
    
    Booking_App.prototype.setIE = function(ie){
        
        this._ie = parseInt(ie);
        if (parseInt(ie) == 1) {
            
            this._headingPosition = 0;
            this._ie = 0;
            
        }
        
    }
    
    Booking_App.prototype.getIE = function(){
        
        return this._ie;
        
    }
    
    Booking_App.prototype.getJudge = function(){
        
        return this._judge;
        
    }
    
    Booking_App.prototype.setUserInformation = function(userInformation){
        
        if(this._userInformation != null){
            
            this._userInformation = userInformation;
            
        }
        
    }
    
    Booking_App.prototype.setResponseText = function(responseText){
        
        this._responseText = responseText;
        
    }
    
    Booking_App.prototype.getResponseText = function(){
        
        return this._responseText;
        
    }
    
    Booking_App.prototype.setDayPanelList = function(dayPanelList){
        
        this._dayPanelList = dayPanelList;
        
    }
    
    Booking_App.prototype.getDayPanelList = function(){
        
        return this._dayPanelList;
        
    }
    
    Booking_App.prototype.serachDayPanelList = function(key){
        
        if(this._dayPanelList[key] != null){
            
            return this._dayPanelList[key];
            
        }
        
        return null;
        
    }
    
    Booking_App.prototype.resetIndexOfDayPanelList = function(){
        
        this._indexOfDayPanelList = [];
        
    }
    
    Booking_App.prototype.setIndexOfDayPanelList = function(value){
        
        this._indexOfDayPanelList.push(value);
        
    }
    
    Booking_App.prototype.getIndexOfDayPanelList = function(){
        
        return this._indexOfDayPanelList;
        
    }
    
    Booking_App.prototype.setSchedulesCallback = function(callback){
        
        this._callback = callback;
        
    }
    
    Booking_App.prototype.getSchedulesCallback = function(){
        
        return this._callback;
        
    }
    
    Booking_App.prototype.getGuestsList = function(){
        
        return this._guestsList;
        
    }
    
    Booking_App.prototype.initWeekDaysList = function(){
        
        this._weekDaysList = {};
        
    }
    
    Booking_App.prototype.addWeekDaysList = function(key, value){
        
        this._weekDaysList[key] = value;
        
    }
    
    Booking_App.prototype.getWeekDaysList = function(){
        
        return this._weekDaysList;
        
    }
    
    Booking_App.prototype.initInputData = function(){
        
        this._inputData = {};
        
    }
    
    Booking_App.prototype.setInputData = function(inputData){
        
        this._inputData = inputData;
        
    }
    
    Booking_App.prototype.addInputData = function(key, value){
        
        this._inputData[key] = value;
        
    }
    
    Booking_App.prototype.getInputData = function(){
        
        return this._inputData;
        
    }
    
    Booking_App.prototype.setFunction = function(name, post){
        
        this._function = {name: name, post: post};
        
    }
    
    Booking_App.prototype.getFunction = function(){
        
        return this._function;
        
    }
    
    Booking_App.prototype.setSubscription = function(subscription){
        
        this._subscription = subscription;
        
    }
    
    Booking_App.prototype.getSubscription = function(){
        
        return this._subscription;
        
    }
    
    Booking_App.prototype.watchElement = function(mutation){
        
        if(mutation.attributeName == "class"){
            
            var changeDataBool = true;
            var targetElement = mutation.target;
            var rect = targetElement.getBoundingClientRect();
            var style = window.getComputedStyle(targetElement, null);
            
            var wpadminbarTop = 0;
            if(document.getElementById("wpadminbar") != null){
                
                wpadminbarTop = document.getElementById("wpadminbar").clientHeight;
                
            }
            
            if(targetElement.id == "bookingBlockPanel"){
                
                return null;
                
            }
            
            
            if(style.getPropertyValue("display") == "none" && style.getPropertyValue("position") == "fixed" && (targetElement.getAttribute("data-watchPosition") == null || targetElement.getAttribute("data-watchPosition") == 0)){
                
                //if(rect.top <= wpadminbarTop){
                if(rect.top <= this._top){
                    
                    console.log(targetElement.getAttribute("data-watchPosition"));
                    if(targetElement.getAttribute("data-watchTopKey") == null){
                        
                        this._topHeightList.push((rect.height));
                        targetElement.setAttribute("data-watchTopKey", (this._topHeightList.length - 1));
                        
                    }
                    
                    this._top += (rect.height);
                    changeDataBool = false;
                    targetElement.setAttribute("data-watchPosition", 1);
                    console.log(rect);
                    console.error(rect);
                    console.log(mutation.target);
                    console.log(style.getPropertyValue("position"));
                    this.chageTop(this._top);
                    
                }
                
                console.log(this._top);
                
            }
            
            if(changeDataBool == true && style.getPropertyValue("position") != "fixed" && targetElement.getAttribute("data-watchPosition") == 1){
                
                this._top -= (rect.height);
                if(targetElement.style.height != null){
                    
                    targetElement.style.height = null;
                    
                }
                targetElement.setAttribute("data-watchPosition", 0);
                this.chageTop(this._top);
                console.log("return 0");
                
            }
            
            if(style.getPropertyValue("position") == "fixed" && targetElement.getAttribute("data-watchTopKey") != null){
                
                var key = targetElement.getAttribute("data-watchTopKey");
                this._topHeightList[key] = rect.height;
                if(style.getPropertyValue("position") == "fixed"){
                    
                    this._topHeightList[key] = rect.height;
                    
                }
                console.log(this._topHeightList);
                targetElement.style.height = rect.height + "px";
                this._top = 0;
                var heigthList = this._topHeightList;
                for(var i = 0; i < heigthList.length; i++){
                    
                    this._top += heigthList[i];
                    
                }
                
                console.log(this._top);
                this.chageTop(this._top);
                
            }
            
            this.chageTop(this._top);
            
        }
        
        if(mutation.attributeName == "style"){
            
            var targetElement = mutation.target;
            var style = window.getComputedStyle(targetElement, null);
            if(targetElement.getAttribute("data-watchTopKey") != null && style.getPropertyValue("display") == "none"){
                
                var key = targetElement.getAttribute("data-watchTopKey");
                var rect = targetElement.getBoundingClientRect();
                this._topHeightList[key] = 0;
                console.log(style.getPropertyValue("display"));
                console.log(targetElement);
                this._top = 0;
                var heigthList = this._topHeightList;
                for(var i = 0; i < heigthList.length; i++){
                    
                    this._top += heigthList[i];
                    
                }
                
                console.log(this._top);
                this.chageTop(this._top);
                
            }
            
            this.chageTop(this._top);
            
        }
        
    }
    
    Booking_App.prototype.createServiceGroupAndSortServices = function(services) {
        
        var object = this;
        var serviceGroup = [];
        var noServiceGroup = [];
        for (var key in services) {
            
            var service = services[key];
            console.log(service);
            if (service.group.length > 0) {
                
                console.log(serviceGroup.indexOf(service.group));
                if (serviceGroup.indexOf(service.group) < 0) {
                    
                    serviceGroup.push(service.group);
                    
                }
                
            } else {
                
                noServiceGroup.push(service);
                
            }
            
        }
        
        var newServices = [];
        if (serviceGroup != null && serviceGroup.length > 0) {
            
            for (var i = 0; i < serviceGroup.length; i++) {
                
                var service = serviceGroup[i];
                for (var key in services) {
                    
                    if (service == services[key].group) {
                        
                        newServices.push(services[key]);
                        
                    }
                    
                }
                
            }
            
            if (noServiceGroup.length > 0) {
                
                serviceGroup.push(object._i18n.get("Other"));
                for (var key in noServiceGroup) {
                    
                    newServices.push(noServiceGroup[key]);
                    
                }
                
            }
            
        }
        
        return {services: newServices, group: serviceGroup};
        
    };
    
    Booking_App.prototype.getReservationData = function(month, day, year, accountKey, update){
        
        var object = this;
        month = parseInt(month);
        day = parseInt(day);
        year = parseInt(year);
        
        if(document.getElementById("bookingBlockPanel") != null){
            
            var bookingBlockPanel = document.getElementById("bookingBlockPanel");
            bookingBlockPanel.classList.remove("hidden_panel");
            var post = {nonce: this._nonce, action: this._action, mode: object._prefix + 'getReservationData', year: year, month: month, day: 1, public: true, accountKey: accountKey};
            object.setFunction("getReservationData", post);
            new Booking_App_XMLHttp(this._url, post, false, function(calendarData){
                 
                bookingBlockPanel.classList.add("hidden_panel");
                console.log(calendarData);
                object.resetIndexOfDayPanelList();
                if(calendarData != null && typeof calendarData == 'object'){
                    
                    if(calendarData.date != null){
                        
                        var today = parseInt(calendarData.date.today);
                        var timestamp = parseInt(calendarData.date.timestamp);
                        var maxDeadlineDay = parseInt(calendarData.date.maxDeadlineDay);
                        for (var key in calendarData.schedule) {
                            
                            if (parseInt(key) >= today) {
                                
                                for(var i = 0; i < calendarData.schedule[key].length; i++){
                                    
                                    var schedule = calendarData.schedule[key][i];
                                    if(parseInt(schedule.unixTimeDeadline) < timestamp){
                                        
                                        schedule.remainder = 0;
                                        
                                    }
                                    
                                }
                                
                            } else if (parseInt(key) > maxDeadlineDay) {
                                
                                break;
                                
                            }
                            
                        }
                        
                        /**
                        if(calendarData.schedule[today] != null && calendarData.schedule[today].length > 0){
                            
                            var timestamp = parseInt(calendarData.date.timestamp);
                            for(var i = 0; i < calendarData.schedule[today].length; i++){
                                
                                var schedule = calendarData.schedule[today][i];
                                if(parseInt(schedule.unixTimeDeadline) < timestamp){
                                    
                                    schedule.remainder = 0;
                                    
                                }
                                
                            }
                            
                            console.log(calendarData.schedule[today]);
                            
                        }
                        **/
                        
                        if (object._calendarAccount.flowOfBooking == 'services' && update === false) {
                            
                            object.createServicesPanel(calendarData, month, day, year, accountKey);
                            
                        } else {
                            
                            object.createCalendar(calendarData, month, day, year, accountKey);
                            
                        }
                        
                        
                        
                    }else{
                        
                        if(window.confirm(calendarData.message)){
                            
                            window.location.reload(true);
                            
                        }
                        
                    }
                    
                }
                
            }, function(responseText){
                
                object.setResponseText(responseText);
                
            });
            
        }
        
        
        
    }
    
    Booking_App.prototype.i18n = function(str, args){
        
        var value = this._i18n.get(str, args);
        return value;
        
    }
    
    Booking_App.prototype.resizeScreen = function(width){
        
        console.log("width = " + width);
        
    }
    
    Booking_App.prototype.setStep = function(event){
        
        this._step = event;
        console.log("step = " + this._step);
    }
    
    Booking_App.prototype.memberOperation = function(){
        
        var object = this;
        var memberSetting = object._memberSetting;
        console.log(memberSetting);
        if(memberSetting.value != null){
            
            object.setUserInformation(memberSetting.value);
            
        }
        
        object._member.memberOperation();
        
        
    }
    
    Booking_App.prototype.judgeSubscription = function(){
        
        var object = this;
        var judge = true;
        console.log(object._calendarAccount.enableSubscriptionForStripe);
        console.log(object._reservation_info.visitorSubscriptionForStripe);
        
        
        
        if(parseInt(object._reservation_info.visitorSubscriptionForStripe) == 1 && parseInt(object._calendarAccount.enableSubscriptionForStripe) == 1){
            
            if(parseInt(object._memberSetting.function_for_member) == 0){
                
                window.alert("Please enable \"Member\"");
                return false;
                
            }
            
            object._memberSetting.reject_non_membder = 1;
            if(object._memberSetting.login == 0){
                
                judge = false;
                
            }
            
        }
        
        console.log("judge = " + judge);
        return judge;
        
    }
    
    Booking_App.prototype.subscription_form = function(){
        
        var object = this;
        var calendarAccount = object._calendarAccount;
        var member = object._memberSetting;
        var subscription = object._subscriptions;
        var calendarPanel = document.getElementById("booking-package_calendarPage");
        var subscription_form = document.getElementById("booking-package-subscription_form");
        var subscription_amount = document.getElementById("booking-package-subscription_amount");
        var subscription_input_form = document.getElementById("booking-package-subscription_input_form");
        
        if(subscription_form == null){
            
            return null;
            
        }
        
        console.log(calendarAccount);
        console.log(member);
        console.log(member.subscription_list);
        console.log(subscription);
        if(member.subscription_list != null){
            
            var items = member.subscription_list;
            for(var key in items){
                
                var item = items[key];
                if(subscription.product == key){
                    
                    var plans = item.items;
                    for(var i = 0; i < plans.length; i++){
                        
                        var plan = plans[i];
                        if(subscription.planKeys.indexOf(plan.id) >= 0){
                            
                            console.log(plan);
                            subscription.subscribed = 1;
                            object._member.setSubscription(subscription);
                            //object.setSubscription(subscription);
                            return null;
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
        
        var judge = true;
        if((subscription != null && parseInt(subscription.status) == 1) && parseInt(calendarAccount.enableSubscriptionForStripe) == 1 && member.login == 1){
            
            judge = false;
            calendarPanel.classList.add("hidden_panel");
            subscription_form.classList.remove("hidden_panel");
            var costFormat = new FORMAT_COST(object._i18n);
            var costLine = subscription_amount.textContent;
            costLine = object._i18n.get(costLine, [costFormat.formatCost(subscription.amount, subscription.currency)]);
            console.log(costLine);
            subscription_amount.textContent = costLine;
            
            /**
            var select_subscription = document.getElementById("booking-package-select_subscription");
            for(var i = 0; i < subscriptions.length; i++){
                
                var subscription = subscriptions[i];
                console.log(subscription);
                
                var radio = document.createElement("input");
                radio.name = "subscription";
                radio.type = "radio";
                
                var nameLabel = document.createElement("div");
                nameLabel.textContent = subscription.name;
                
                var priceLabel = document.createElement("div");
                priceLabel.textContent = object._i18n.get(costLine, [costFormat.formatCost(subscription.amount, subscription.currency)]);
                
                var subscriptionLabel = document.createElement("div");
                subscriptionLabel.appendChild(nameLabel);
                subscriptionLabel.appendChild(priceLabel);
                
                var label = document.createElement("label");
                label.appendChild(radio);
                label.appendChild(subscriptionLabel);
                select_subscription.appendChild(label);
                
            }
            **/
            
            if(object._stripe_active == 1 && subscription.amount != 0){
                
                var cartPanel = document.createElement("div");
                cartPanel.id = "paymentPanel";
                cartPanel.classList.add("cartPanel");
                subscription_input_form.appendChild(cartPanel);
                
                object.paypalPanelcartInputForStripe(object._stripe_public_key, object._country, subscription.currency, cartPanel, subscription.plans, null, function(paymentResponse){
                    
                    console.log(paymentResponse);
                    var token = null;
                    if(paymentResponse.paymentName == 'stripe'){
                        
                        if(paymentResponse.complete != null && typeof paymentResponse.complete == 'function'){
                            
                            token = paymentResponse.token.id;
                            
                        }else{
                            
                            token = paymentResponse.token.id;
                            
                        }
                        
                    }else if(paymentResponse.paymentName == 'paypal'){
                        
                        token = paymentResponse.paymentID;
                        
                    }
                    
                    if(token != null){
                        
                        var post = {nonce: object._nonce, action: object._action, mode: "createCustomer", payType: paymentResponse.paymentName, payToken: token, calendarAccountKey: calendarAccount.key};
                        console.log(post);
                        var bookingBlockPanel = document.getElementById("bookingBlockPanel");
                        bookingBlockPanel.classList.remove("hidden_panel");
                        new Booking_App_XMLHttp(object._url, post, false, function(response){
                            
                            console.log(response);
                            if(paymentResponse.paymentName == 'stripe'){
                                
                                if(parseInt(response.status) == 1){
                                    
                                    if(paymentResponse.complete != null && typeof paymentResponse.complete == 'function'){
                                        
                                        paymentResponse.complete('success');
                                        
                                    }
                                    window.location.reload(true);
                                    
                                }else{
                                    
                                    if(paymentResponse.complete != null && typeof paymentResponse.complete == 'function'){
                                        
                                        paymentResponse.complete('fail');
                                        bookingBlockPanel.classList.add("hidden_panel");
                                        
                                    }
                                    
                                }
                                
                            }
                            
                        });
                        
                    }
                    
                });
                
                var button = subscription_input_form.getElementsByClassName("paymentButton");
                if(typeof button == 'object' && button[0] != null){
                    
                    button[0].textContent = object._i18n.get("Submit Payment");
                    
                }
                
            }
            
        }else{
            
            if(member.login == 0){
                
                
                
            }
            
        }
        
        return judge;
        
    }
    
    Booking_App.prototype.myBookingDetails = function(){
        
        var object = this;
        var top = 0;
        var calendarAccount = object._calendarAccount;
        var myBookingDetails = object._myBookingDetails;
        var selectedOptions = JSON.parse(myBookingDetails.options);
        var course = null;
        var accommodationDetails = {};
        var schedule = {
            month: myBookingDetails.scheduleMonth,
            day: myBookingDetails.scheduleDay,
            year: myBookingDetails.scheduleYear,
            weekKey: myBookingDetails.scheduleWeek,
            hour: myBookingDetails.scheduleHour,
            min: myBookingDetails.scheduleMin,
            title: myBookingDetails.scheduleTitle,
            cost: myBookingDetails.scheduleCost
            
        };
        
        console.log(myBookingDetails);
        var courseList = JSON.parse(myBookingDetails.options);
        /**
        if (myBookingDetails.courseKey.length > 0) {
            
            course = {
                key: parseInt(myBookingDetails.courseKey),
                name: myBookingDetails.courseName,
                time: parseInt(myBookingDetails.courseTime),
                cost: parseInt(myBookingDetails.courseCost),
                
            }
            
        }
        **/
        
        if (myBookingDetails.accommodationDetails != 'null') {
            
            accommodationDetails = JSON.parse(myBookingDetails.accommodationDetails);
            
        }
        
        console.log(myBookingDetails);
        console.log(course);
        console.log(selectedOptions);
        console.log(accommodationDetails);
        
        var myBookingDetailsPanel = document.getElementById("booking-package_myBookingDetails");
        myBookingDetailsPanel.classList.remove("hidden_panel");
        
        var topBarPanel = myBookingDetailsPanel.getElementsByClassName("selectedDate")[0];
        if (object._headingPosition == 1) {
            
            topBarPanel.style.top = object._top + "px";
            
        }
        
        var totalCost = 0;
        var goodsList = [];
        var rowPanel = object.createRowPanel(object._i18n.get("ID"), myBookingDetails.key, null, null, null);
        myBookingDetailsPanel.appendChild(rowPanel);
        
        var status = myBookingDetails.status;
        var statusPanel = object.createRowPanel(object._i18n.get("Status"), object._i18n.get(myBookingDetails.status.toUpperCase()), null, null, null);
        myBookingDetailsPanel.appendChild(statusPanel);
        
        if(calendarAccount.type == 'day'){
            
            myBookingDetailsPanel.classList.remove("hidden_panel");
            var date = object._calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, schedule.hour, schedule.min, schedule.title, schedule.weekKey);
            var rowPanel = object.createRowPanel(object._i18n.get("Booking Date"), date, null, null, null);
            myBookingDetailsPanel.appendChild(rowPanel);
            top += parseInt(rowPanel.clientHeight);
            
            totalCost = parseInt(schedule.cost);
            
            if (courseList != null && courseList.length > 0) {
                
                var rowPanel = object.createRowPanel(myBookingDetails.courseTitle, "", null, null, null);
                myBookingDetailsPanel.appendChild(rowPanel);
                var valuePanel = rowPanel.getElementsByClassName("value")[0];
                valuePanel.textContent = null;
                
                var coursePanel = document.createElement("div");
                coursePanel.classList.add("mainPlan");
                valuePanel.appendChild(coursePanel);
                
                for (var key in courseList) {
                    
                    if (courseList[key].selected == 1) {
                        
                        course = true;
                        var courseCostPanel = null;
                        var goods = {label: courseList[key].name, amount: parseInt(courseList[key].cost)};
                        goodsList.push(goods);
                        totalCost += parseInt(courseList[key].cost);
                        
                        if (parseInt(courseList[key].cost) > 0) {
                            
                            courseCostPanel = document.createElement("span");
                            courseCostPanel.classList.add("planPrice");
                            courseCostPanel.textContent = object._format.formatCost(courseList[key].cost, object._currency);
                            
                        }
                        
                        var courseLinePanel = document.createElement("div");
                        courseLinePanel.classList.add("courseLinePanel");
                        coursePanel.appendChild(courseLinePanel);
                        
                        var courseNamePanel = document.createElement("span");
                        courseNamePanel.classList.add("planName");
                        courseNamePanel.textContent = courseList[key].name;
                        courseLinePanel.appendChild(courseNamePanel);
                        if (courseCostPanel != null) {
                            
                            courseLinePanel.appendChild(courseCostPanel);
                            
                        }
                        
                        var selectedOptions = courseList[key].selectedOptionsList;
                        if (selectedOptions != null && selectedOptions.length > 0) {
                            
                            var ul = document.createElement("ul");
                            coursePanel.appendChild(ul);
                            
                            for(var i = 0; i < selectedOptions.length; i++){
                                
                                var option = selectedOptions[i];
                                console.log(option);
                                if (parseInt(option.selected) == 1) {
                                    
                                    var goods = {label: option.name, amount: parseInt(option.cost)};
                                    goodsList.push(goods);
                                    totalCost += parseInt(option.cost);
                                    
                                    var optionNamePanel = document.createElement("span");
                                    optionNamePanel.classList.add("planName");
                                    optionNamePanel.textContent = option.name;
                                    
                                    var optionPricePanel = document.createElement("span");
                                    optionPricePanel.classList.add("planPrice");
                                    if (parseInt(option.cost) > 0) {
                                        
                                        optionPricePanel.textContent = object._format.formatCost(option.cost, object._currency);
                                        
                                    }
                                    
                                    var li = document.createElement("li");
                                    li.appendChild(optionNamePanel);
                                    li.appendChild(optionPricePanel);
                                    ul.appendChild(li);
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
            
            /**
            if(course != null){
                
                var courseCostPanel = null;
                if(course.cost != null){
                    
                    var goods = {label: course.name, amount: parseInt(course.cost)};
                    goodsList.push(goods);
                    totalCost += parseInt(course.cost);
                    
                    if (parseInt(course.cost) > 0) {
                        
                        courseCostPanel = document.createElement("span");
                        courseCostPanel.classList.add("planPrice");
                        courseCostPanel.textContent = object._format.formatCost(course.cost, object._currency);
                        
                    }
                    
                    
                }
                
                var rowPanel = object.createRowPanel(myBookingDetails.courseTitle, course.name, null, null, null);
                var valuePanel = rowPanel.getElementsByClassName("value")[0];
                valuePanel.textContent = null;
                
                var coursePanel = document.createElement("div");
                coursePanel.classList.add("mainPlan");
                valuePanel.appendChild(coursePanel);
                
                var courseNamePanel = document.createElement("span");
                courseNamePanel.classList.add("planName");
                courseNamePanel.textContent = course.name;
                coursePanel.appendChild(courseNamePanel);
                if (courseCostPanel != null) {
                    
                    coursePanel.appendChild(courseCostPanel);
                    
                }
                
                if (selectedOptions != null && selectedOptions.length > 0) {
                    
                    var ul = document.createElement("ul");
                    valuePanel.appendChild(ul);
                    
                    for(var i = 0; i < selectedOptions.length; i++){
                        
                        var option = selectedOptions[i];
                        console.log(option);
                        if (parseInt(option.selected) == 1) {
                            
                            var goods = {label: option.name, amount: parseInt(option.cost)};
                            goodsList.push(goods);
                            totalCost += parseInt(option.cost);
                            
                            var optionNamePanel = document.createElement("span");
                            optionNamePanel.classList.add("planName");
                            optionNamePanel.textContent = option.name;
                            
                            var optionPricePanel = document.createElement("span");
                            optionPricePanel.classList.add("planPrice");
                            if (parseInt(option.cost) > 0) {
                                
                                optionPricePanel.textContent = object._format.formatCost(option.cost, object._currency);
                                
                            }
                            
                            var li = document.createElement("li");
                            li.appendChild(optionNamePanel);
                            li.appendChild(optionPricePanel);
                            ul.appendChild(li);
                            
                        }
                        
                    }
                    
                }
                
                console.log(goodsList);
                myBookingDetailsPanel.appendChild(rowPanel);
                top += parseInt(rowPanel.clientHeight);
                
            }
            **/
            
            console.log("totalCost = " + totalCost);
            if(totalCost != 0){
                
                var formatPrice = object._format.formatCost(totalCost, myBookingDetails.currency);
                var rowPanel = object.createRowPanel(this._i18n.get("Total amount"), formatPrice, null, null, null);
                rowPanel.classList.add("total_amount");
                myBookingDetailsPanel.appendChild(rowPanel);
                top += parseInt(rowPanel.clientHeight);
                
            }
            
        }else{
            
            object._hotel.setCheckIn(accommodationDetails.checkInSchedule);
            object._hotel.setCheckOut(accommodationDetails.checkOutSchedule);
            var detailes = myBookingDetails.accommodationDetailsList;
            var scheduleDetails = accommodationDetails.scheduleDetails;
            for(var key in scheduleDetails) {
                
                object._hotel.addSchedule(scheduleDetails[key]);
                
            }
            
            console.log(detailes);
            
            var hotelDetails = object._hotel.verifySchedule(true);
            console.log(hotelDetails);
            totalCost = hotelDetails.amount + (hotelDetails.additionalFee * hotelDetails.nights);
            
            var amount = {label: this._i18n.get("Accommodation fees"), amount: parseInt(hotelDetails.amount)};
            var additionalFee = {label: this._i18n.get("Additional fees"), amount: parseInt(hotelDetails.additionalFee * hotelDetails.nights)};
            goodsList.push(amount);
            goodsList.push(additionalFee);
            console.log("totalCost = " + totalCost)
            //callback({mode: "top", top: object._top});
            
            var expressionsCheck = object._calendar.getExpressionsCheck(parseInt(object._calendarAccount.expressionsCheck));
            console.log(expressionsCheck);
            
            var checkInDatePanel = document.createElement("div");
            var checkInDate = object._calendar.formatBookingDate(accommodationDetails.checkInSchedule.month, accommodationDetails.checkInSchedule.day, accommodationDetails.checkInSchedule.year, null, null, null, accommodationDetails.checkInSchedule.weekKey);
            checkInDatePanel.textContent = checkInDate;
            
            var checkOutDatePanel = document.createElement("div");
            var checkOutDate = object._calendar.formatBookingDate(accommodationDetails.checkOutSchedule.month, accommodationDetails.checkOutSchedule.day, accommodationDetails.checkOutSchedule.year, null, null, null, accommodationDetails.checkOutSchedule.weekKey);
            checkOutDatePanel.textContent = checkOutDate;
            
            var checkInPanel = object.createRowPanel(expressionsCheck.arrival, checkInDatePanel, null, null, null);
            var checkOutPanel = object.createRowPanel(expressionsCheck.departure, checkOutDatePanel, null, null, null);
            
            var totalLengthOfStay = object.createRowPanel(object._i18n.get("Total length of stay") + ": " + detailes.totalLengthOfStay.main.replace(/\\/g, ""), "", null, null, null);
            var valueOfStay = totalLengthOfStay.getElementsByClassName("value")[0];
            for(var i = 0; i < detailes.totalLengthOfStay.sub.length; i++) {
                
                var stayPanel = document.createElement("div");
                stayPanel.textContent = detailes.totalLengthOfStay.sub[i].replace(/\\/g, "");
                valueOfStay.appendChild(stayPanel);
                
            }
            
            var nameLabel = document.createElement("div");
            nameLabel.classList.add("name");
            //nameLabel.setAttribute("style", "margin-top: 0.5em");
            nameLabel.textContent = object._i18n.get("Total number of guests") + ": " + detailes.totalLengthOfGuests.main.replace(/\\/g, "");
            valueOfStay.appendChild(nameLabel);
            for(var i = 0; i < detailes.totalLengthOfGuests.sub.length; i++) {
                
                var guestsPanel = document.createElement("div");
                guestsPanel.textContent = detailes.totalLengthOfGuests.sub[i].replace(/\\/g, "");
                valueOfStay.appendChild(guestsPanel);
                
            }
            
            for(var i = 0; i < detailes.totalLengthOfTaxes.sub.length; i++) {
                
                var taxesPanel = document.createElement("div");
                taxesPanel.textContent = detailes.totalLengthOfTaxes.sub[i].replace(/\\/g, "");
                valueOfStay.appendChild(taxesPanel);
                
            }
            
            /**
            var totalLengthOfGuests = object.createRowPanel(object._i18n.get("Total number of guests") + ": " + detailes.totalLengthOfGuests.main, "", null, null, null);
            var valueOfGuests = totalLengthOfGuests.getElementsByClassName("value")[0];
            for(var i = 0; i < detailes.totalLengthOfGuests.sub.length; i++) {
                
                var guestsPanel = document.createElement("div");
                guestsPanel.textContent = detailes.totalLengthOfGuests.sub[i];
                valueOfGuests.appendChild(guestsPanel);
                
            }
            **/
            
            var totalCost = object._format.formatCost(accommodationDetails.totalCost, myBookingDetails.currency);
            var totalPricePanel = object.createRowPanel(object._i18n.get("Total amount"), totalCost, null, null, null);
            totalPricePanel.classList.add("total_amount");
            if (parseInt(accommodationDetails.totalCost) == 0) {
                
                totalPricePanel.classList.add("hidden_panel");
                
            }
            
            //durationStay.insertAdjacentElement("beforeend", bookingDetailsTitle);
            myBookingDetailsPanel.insertAdjacentElement("beforeend", checkInPanel);
            myBookingDetailsPanel.insertAdjacentElement("beforeend", checkOutPanel);
            myBookingDetailsPanel.insertAdjacentElement("beforeend", totalLengthOfStay);
            //myBookingDetailsPanel.insertAdjacentElement("beforeend", totalLengthOfGuests);
            myBookingDetailsPanel.insertAdjacentElement("beforeend", totalPricePanel);
            
            
        }
        
        var returnButton = document.createElement("button");
        returnButton.classList.add("returnButton");
        returnButton.textContent = object._i18n.get("Return to calendar");
        
        var cancelButton = document.createElement("button");
        cancelButton.classList.add("cancelButton");
        cancelButton.textContent = object._i18n.get("Cancel booking");
        if (status == 'canceled') {
            
            cancelButton.classList.add("hidden_panel");
            
        }
        
        var buttonPanel = myBookingDetailsPanel.getElementsByClassName("buttonPanel")[0];
        buttonPanel.appendChild(returnButton);
        buttonPanel.appendChild(cancelButton);
        myBookingDetailsPanel.appendChild(buttonPanel);
        
        returnButton.onclick = function() {
            
            window.location.href = object._permalink;
            
        }
        
        if (object._cancellationOfBooking == 1 && status != 'canceled') {
            
            cancelButton.onclick = function() {
                
                var post = {nonce: object._nonce, action: object._action, mode: 'cancelBookingData', key: myBookingDetails.key, token: myBookingDetails.cancellationToken};
                console.log(post);
                if (window.confirm(object._i18n.get("Can we really cancel your booking?"))) {
                    
                    var bookingBlockPanel = document.getElementById("bookingBlockPanel");
                    bookingBlockPanel.classList.remove("hidden_panel");
                    new Booking_App_XMLHttp(object._url, post, false, function(response){
                        
                        console.log(response);
                        bookingBlockPanel.classList.add("hidden_panel");
                        if (response.status == 'success') {
                            
                            window.location.href = object._permalink;
                            
                        }
                        
                    });
                    
                }
                
            }
            
        } else {
            
            cancelButton.classList.add("hidden_panel");
            cancelButton.disabled = true;
            
        }
        
    }
    
    Booking_App.prototype.createServicesPanel = function(calendarData, month, day, year, accountKey) {
        
        var object = this;
        var services = object._courseList;
        console.log("accountKey = " + accountKey);
        console.log(calendarData);
        console.log(services);
        var rootPanel = document.getElementById("booking-package_servicePage");
        rootPanel.classList.remove("hidden_panel");
        object.setScrollY(rootPanel);
        var servicesPanel = rootPanel.getElementsByClassName("list")[0];
        servicesPanel.textContent = null;
        var titlePanel =  rootPanel.getElementsByClassName("title")[0];
        if (object._headingPosition == 1) {
            
            titlePanel.style.top = object._top + "px";
            
        } else {
            
            titlePanel.classList.add("noSticky");
            
        }
        
        var animationBool = true;
        var checkBoxList = [];
        var coursePanelList = [];
        object.createServicesList(animationBool, checkBoxList, coursePanelList, servicesPanel, function(table_row) {
            
            var serviceKey = table_row.getAttribute("data-key");
            var service = services[parseInt(serviceKey)];
            var options = JSON.parse(service.options);
            service.selectedOptionsList = options;
            table_row.getElementsByTagName("input")[0].classList.add("hidden_panel");
            console.log(service);
            console.log(options);
            if (options.length > 0) {
                
                var optionsTitle = document.createElement("div");
                optionsTitle.classList.add("optionTitle");
                optionsTitle.textContent = object._i18n.get("Select option");
                
                var optionsPanel = document.createElement("div");
                optionsPanel.appendChild(optionsTitle);
                optionsPanel.classList.add("selectOptionList");
                table_row.appendChild(optionsPanel);
                for (var i = 0; i < options.length; i++) {
                    
                    var option = options[i];
                    option.selected = 0;
                    console.log(option);
                    
                    var titleLabel = document.createElement("span");
                    titleLabel.textContent = option.name;
                    
                    var optionPanel = document.createElement("div");
                    optionPanel.setAttribute("data-key", i);
                    optionPanel.setAttribute("data-serviceKey", serviceKey);
                    optionPanel.classList.add("optionPanel");
                    optionPanel.appendChild(titleLabel);
                    
                    if(option.cost != null && option.cost != 0){
                        
                        var cost = object._format.formatCost(option.cost, object._currency);
                        var optionCostPanel = document.createElement("span");
                        optionCostPanel.classList.add("courseCostPanel");
                        optionCostPanel.textContent = cost;
                        optionPanel.appendChild(optionCostPanel);
                        
                    }
                    
                    optionsPanel.appendChild(optionPanel);
                    optionPanel.onclick = function() {
                        
                        var serviceKey = parseInt(this.getAttribute("data-serviceKey"));
                        var key = parseInt(this.getAttribute("data-key"));
                        var service = services[serviceKey];
                        var option = service.selectedOptionsList[key];
                        if (object._calendarAccount.hasMultipleServices == 0) {
                            
                            (function(selectedService, selectedServiceKey){
                                
                                console.log(selectedService);
                                var optionsPanel = servicesPanel.getElementsByClassName("optionPanel");
                                for (var i = 0; i < optionsPanel.length; i++) {
                                    
                                    if (parseInt(optionsPanel[i].getAttribute("data-serviceKey")) != selectedServiceKey) {
                                        
                                        optionsPanel[i].classList.remove("selectedOptionPanel");
                                        
                                    }
                                    
                                }
                                
                                for (var key in services) {
                                    
                                    if (parseInt(services[key].key) != parseInt(selectedService.key)) {
                                        
                                        var options = services[key].selectedOptionsList;
                                        for (var optionKey in options) {
                                            
                                            options[optionKey].selected = 0;
                                            
                                        }
                                        
                                    }
                                    
                                }
                                
                            }(service, serviceKey));
                            
                        }
                        
                        if (parseInt(service.selectOptions) == 0) {
                            
                            var parent = this.parentNode;
                            var children = parent.getElementsByClassName("optionPanel");
                            for (var i = 0; i < children.length; i++) {
                                
                                if (parseInt(children[i].getAttribute("data-key")) != key) {
                                    
                                    children[i].classList.remove("selectedOptionPanel");
                                    
                                }
                                
                            }
                            
                            var options = service.selectedOptionsList;
                            for (var optionKey in options) {
                                
                                if(parseInt(optionKey) == key) {
                                    
                                    console.log(this.classList.contains("selectedOptionPanel"));
                                    if (this.classList.contains("selectedOptionPanel") === true) {
                                        
                                        this.classList.remove("selectedOptionPanel");
                                        options[optionKey].selected = 0;
                                        
                                    } else {
                                        
                                        this.classList.add("selectedOptionPanel");
                                        options[optionKey].selected = 1;
                                        
                                    }
                                    
                                } else {
                                    
                                    options[optionKey].selected = 0;
                                    
                                }
                                
                            }
                            
                        } else {
                            
                            if (option.selected == 0) {
                                
                                option.selected = 1;
                                this.classList.add("selectedOptionPanel");
                                
                            } else {
                                
                                option.selected = 0;
                                this.classList.remove("selectedOptionPanel");
                                
                            }
                            
                        }
                        
                    };
                    
                }
                
            }
            
            table_row.onclick = function() {
                
                var servicePanel = this;
                var key = this.getAttribute("data-key");
                var service = services[parseInt(key)];
                var options = service.selectedOptionsList;
                if (object._calendarAccount.hasMultipleServices == 0) {
                    
                    (function(selectedService, selectedServiceKey){
                        
                        console.log(selectedService);
                        var hasOptions = false;
                        if (selectedService.selectedOptionsList.length > 0) {
                            
                            hasOptions = true;
                            
                        }
                        var optionsPanel = servicesPanel.getElementsByClassName("selectPanel");
                        for (var i = 0; i < optionsPanel.length; i++) {
                            
                            if (parseInt(optionsPanel[i].getAttribute("data-key")) != selectedServiceKey) {
                                
                                optionsPanel[i].classList.remove("selectedPanel");
                                
                            }
                            
                        }
                        
                        for (var key in services) {
                            
                            if (parseInt(services[key].key) != parseInt(selectedService.key)) {
                                
                                services[key].selected = 0;
                                
                            }
                            
                            if (hasOptions === false) {
                                
                                var options = services[key].selectedOptionsList;
                                for (var optionKey in options) {
                                    
                                    options[optionKey].selected = 0;
                                    
                                }
                                
                            }
                            
                        }
                        
                        if (hasOptions === false) {
                            
                            optionsPanel = servicesPanel.getElementsByClassName("optionPanel");
                            for (var i = 0; i < optionsPanel.length; i++) {
                                
                                optionsPanel[i].classList.remove("selectedOptionPanel");
                                
                            }
                            
                        }
                        
                    }(service, key));
                    
                }
                
                if (options.length == 0) {
                    
                    if (service.selected == null || service.selected == 0) {
                        console.log("selected true");
                        service.selected = 1;
                        servicePanel.classList.add("selectedPanel");
                        
                    } else if (service.selected == 1) {
                        console.log("selected false");
                        service.selected = 0;
                        servicePanel.classList.remove("selectedPanel");
                        
                    }
                    
                } else {
                    
                    var selected = 0;
                    for (var key in options) {
                        
                        if (parseInt(options[key].selected) == 1) {
                            
                            selected = 1;
                            break;
                            
                        }
                        
                    }
                    
                    console.log("selected = " + selected);
                    if (selected == 1) {
                        
                        service.selected = 1;
                        servicePanel.classList.add("selectedPanel");
                        
                    } else {
                        
                        service.selected = 0;
                        servicePanel.classList.remove("selectedPanel");
                        
                    }
                    
                }
                
                console.log(service);
                console.log(services);
                object.servicesDetails(calendarData, month, day, year, accountKey);
                
            };
            
        });
        
        object.servicesDetails(calendarData, month, day, year, accountKey);
        
    };
    
    Booking_App.prototype.servicesDetails = function(calendarData, month, day, year, accountKey) {
        
        var object = this;
        var services = object._courseList;
        var serviceDetails = document.getElementById("booking-package_serviceDetails");
        serviceDetails.classList.remove("hidden_panel");
        if (object._headingPosition == 1) {
            
            serviceDetails.style.top = object._top + "px";
            
        } else {
            
            serviceDetails.classList.add("noSticky");
            
        }
        
        //serviceDetails.textContent = "test";
        
        var myServiceDetails = serviceDetails.getElementsByClassName("list")[0];
        myServiceDetails.textContent = null;
        
        console.log(serviceDetails);
        console.log(services);
        console.log(object._top);
        
        var rowPanel = object.createRowPanel(object._courseName, "", null, null, null);
        myServiceDetails.appendChild(rowPanel);
        var valuePanel = rowPanel.getElementsByClassName("value")[0];
        valuePanel.textContent = null;
        
        var coursePanel = document.createElement("div");
        coursePanel.classList.add("mainPlan");
        valuePanel.appendChild(coursePanel);
        
        var next = false;
        var goodsList = [];
        var totalCost = 0;
        var response = object.selectedServicesPanel(next, services, goodsList, totalCost, coursePanel);
        next = response.course;
        totalCost = response.totalCost;
        
        console.log(next);
        if (next === true) {
            
            var surchargePanel = object.createRowPanel("Surcharge", "", null, null, null);
            surchargePanel.id = "surchargeTaxTitle";
            var taxePanel = object.createRowPanel("Surcharge and Tax", "", null, null, null);
            
            var taxes = new TAXES(object._i18n, object._currency);
            taxes.setTaxes(object._taxes);
            taxes.taxesDetails(totalCost, myServiceDetails, surchargePanel, taxePanel);
            var responseTaxes = taxes.getTaxes();
            for (var key in responseTaxes) {
                
                var tax = responseTaxes[key];
                if (tax.active != 'true') {
                    
                    continue;
                    
                }
                
                if ((tax.type == 'tax' && tax.tax == 'tax_exclusive') || tax.type == 'surcharge') {
                    
                    totalCost += parseInt(tax.taxValue);
                    var goods = {label: tax.name, amount: parseInt(tax.taxValue)};
                    goodsList.push(goods);
                    
                }
                
            }
            
            console.log("totalCost = " + totalCost);
            if(totalCost != 0){
                
                var formatPrice = object._format.formatCost(totalCost, object._currency);
                var rowPanel = object.createRowPanel(object._i18n.get("Total amount"), formatPrice, null, null, null);
                rowPanel.classList.add("total_amount");
                myServiceDetails.appendChild(rowPanel);
                
            }
            
            var goToCalendarButton = document.createElement("button");
            goToCalendarButton.textContent = object._i18n.get("Choose a date");
            goToCalendarButton.classList.add("goToCalendarButton");
            myServiceDetails.appendChild(goToCalendarButton);
            goToCalendarButton.onclick = function() {
                
                document.getElementById("booking-package_servicePage").classList.add("hidden_panel");
                serviceDetails.classList.add("hidden_panel");
                object.createCalendar(calendarData, month, day, year, accountKey);
                
            };
            
        } else {
            
            coursePanel.textContent = object._i18n.get("You have not selected anything");
            
        }
        
        
    };
    
    Booking_App.prototype.selectedServicesPanel = function(course, services, goodsList, totalCost, coursePanel) {
        
        var object = this;
        for (var key in services) {
            
            if (services[key].selected == 1) {
                
                course = true;
                var courseCostPanel = null;
                var goods = {label: services[key].name, amount: parseInt(services[key].cost)};
                goodsList.push(goods);
                totalCost += parseInt(services[key].cost);
                
                if (parseInt(services[key].cost) > 0) {
                    
                    courseCostPanel = document.createElement("span");
                    courseCostPanel.classList.add("planPrice");
                    courseCostPanel.textContent = object._format.formatCost(services[key].cost, object._currency);
                    
                }
                
                var courseLinePanel = document.createElement("div");
                courseLinePanel.classList.add("courseLinePanel");
                coursePanel.appendChild(courseLinePanel);
                
                var courseNamePanel = document.createElement("span");
                courseNamePanel.classList.add("planName");
                courseNamePanel.textContent = services[key].name;
                courseLinePanel.appendChild(courseNamePanel);
                if (courseCostPanel != null) {
                    
                    courseLinePanel.appendChild(courseCostPanel);
                    
                }
                
                var selectedOptions = services[key].selectedOptionsList;
                if (selectedOptions != null && selectedOptions.length > 0) {
                    
                    var ul = document.createElement("ul");
                    coursePanel.appendChild(ul);
                    
                    for(var i = 0; i < selectedOptions.length; i++){
                        
                        var option = selectedOptions[i];
                        console.log(option);
                        if (parseInt(option.selected) == 1) {
                            
                            var goods = {label: option.name, amount: parseInt(option.cost)};
                            goodsList.push(goods);
                            totalCost += parseInt(option.cost);
                            
                            var optionNamePanel = document.createElement("span");
                            optionNamePanel.classList.add("planName");
                            optionNamePanel.textContent = option.name;
                            
                            var optionPricePanel = document.createElement("span");
                            optionPricePanel.classList.add("planPrice");
                            if (parseInt(option.cost) > 0) {
                                
                                optionPricePanel.textContent = object._format.formatCost(option.cost, object._currency);
                                
                            }
                            
                            var li = document.createElement("li");
                            li.appendChild(optionNamePanel);
                            li.appendChild(optionPricePanel);
                            ul.appendChild(li);
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
        return {course: course, goodsList: goodsList, totalCost: totalCost};
        
    };
    
    Booking_App.prototype.createCalendar = function(calendarData, month, day, year, accountKey){
        
        console.log("accountKey = " + accountKey);
        console.log(calendarData);
        
        month = parseInt(calendarData.date.month);
        day = parseInt(calendarData.date.day);
        year = parseInt(calendarData.date.year);
        
        var object = this;
        object.setStep("topPage");
        var calendarAccount = this._calendarAccount;
        var calendarKey = object._calendar.getDateKey(month, day, year);
        object._nationalHoliday = calendarData.nationalHoliday.calendar;
        
        var calendarPanel = document.getElementById("booking-package_calendarPage");
        if(calendarPanel == null){
            
            return null;
            
        }
        calendarPanel.textContent = null;
        object.setScrollY(calendarPanel);
        
        var judge = object.subscription_form();
        if(judge == false){
            
            return null;
            
        }
        
        var checkInClearLabel = document.createElement("label");
        var checkOutClearLabel = document.createElement("label");
        if(document.getElementById("checkInClearLabel") != null){
            
            checkInClearLabel = document.getElementById("checkInClearLabel");
            
        }
        if(document.getElementById("checkOutClearLabel") != null){
            
            checkOutClearLabel = document.getElementById("checkOutClearLabel");
            
        }
        
        if(calendarAccount.type == "hotel" && object._lengthOfStayBool == true){
            
            object.lengthOfStayForHotel(calendarPanel, month, day, year, checkInClearLabel, checkOutClearLabel, calendarData, accountKey);
            object._lengthOfStayBool = false;
            
        }
        
        
        
        var dayHeight = parseInt(calendarPanel.clientWidth / 7);
	    
	    var datePanel = document.createElement("div");
	    datePanel.setAttribute("class", "calendarData");
	    datePanel.textContent = object._calendar.formatBookingDate(month, null, year, null, null, null, null);
	    console.log(year + "/" + month);
	    
	    var returnLabel = document.createElement("label");
	    var nextLabel = document.createElement("label");
	    var returnPanel = document.createElement("div");
	    var nextPanel = document.createElement("div");
	    if(object._enableFixCalendar == 0){
	        
	        returnLabel.setAttribute("class", "arrowLeft");
    	    if(month == 1){
                
    	        returnLabel.textContent = /**"＜" + **/object._calendar.formatBookingDate(12, null, null, null, null, null, null);
    	        
                
    	    }else{
                
                returnLabel.textContent = /**"＜" + **/object._calendar.formatBookingDate((parseInt(month) - 1), null, null, null, null, null, null);
                
    	    }
    	    
    	    var arrowRight = document.createElement("div");
    	    arrowRight.setAttribute("style", "font-family: 'Material Icons' !important");
    	    arrowRight.setAttribute("class", "material-icons arrowFont");
    	    arrowRight.textContent = "keyboard_arrow_left";
    	    returnLabel.insertAdjacentElement("afterbegin", arrowRight);
    	    
            returnPanel.setAttribute("class", "calendarChangeButton");
            returnPanel.insertAdjacentElement("beforeend", returnLabel);
            
            nextLabel.setAttribute("class", "arrowRight");
            if(month == 12){
                
                nextLabel.textContent = object._calendar.formatBookingDate(1, null, null, null, null, null, null)/** + "＞"**/;
                
            }else{
                
                nextLabel.textContent = object._calendar.formatBookingDate((parseInt(month) + 1), null, null, null, null, null, null)/** + "＞"**/;
                
            }
            
            var arrowLeft = document.createElement("div");
            arrowLeft.setAttribute("style", "font-family: 'Material Icons' !important");
    	    arrowLeft.setAttribute("class", "material-icons arrowFont");
    	    arrowLeft.textContent = "keyboard_arrow_right";
    	    nextLabel.insertAdjacentElement("beforeend", arrowLeft);
            
            nextPanel.setAttribute("style", "text-align: right;");
            nextPanel.setAttribute("class", "calendarChangeButton");
            nextPanel.insertAdjacentElement("beforeend", nextLabel);
	        
	    }
	    
        var topPanel = document.createElement("div");
        topPanel.setAttribute("class", "calendarPanel");
        
        topPanel.insertAdjacentElement("beforeend", returnPanel);
        topPanel.insertAdjacentElement("beforeend", datePanel);
        topPanel.insertAdjacentElement("beforeend", nextPanel);
        calendarPanel.insertAdjacentElement("beforeend", topPanel);
        
        var shortestTime = null;
        if (object._courseBool == true) {
            
            var courseList = object._courseList;
            for(var i = 0; i < courseList.length; i++){
                
                if(courseList[i].active == "true" && (parseInt(courseList[i].time) < shortestTime || shortestTime == null)){
                    
                    shortestTime = parseInt(courseList[i].time);
                    
                }
                
            }
            
        }
        
        if (object._preparationTime > 0) {
            
            if (shortestTime == null) {
                
                shortestTime = object._preparationTime;
                if (object._positionPreparationTime == 'before_after') {
                    
                    shortestTime += object._preparationTime;
                    
                }
                
            } else {
                
                shortestTime += object._preparationTime;
                if (object._positionPreparationTime == 'before_after') {
                    
                    shortestTime += object._preparationTime;
                    
                }
                
            }
            
        }
        
        console.log("shortestTime = " + shortestTime);
        
        var dayPanelList = {};
        var regularHoliday = calendarData.regularHoliday.calendar;
        var dayResponse = object._calendar.create(calendarPanel, calendarData, month, day, year, '', function(callback){
            
            console.log(callback);
            callback.select = 1;
            var dayPanel = callback.eventPanel;
            var rect = dayPanel.getBoundingClientRect();
            var height = parseInt(rect.width * 0.7);
            
            dayPanelList[callback.key] = callback;
            object.setDayPanelList(dayPanelList);
            object.setIndexOfDayPanelList(callback);
            var hotelDetails = object._hotel.getDetails();
            
            if(calendarAccount.type == "hotel"){
                
                dayPanel.style.height = null;
                
            }
            
            if(regularHoliday[callback.key] != null && parseInt(regularHoliday[callback.key].status) == 1){
                
                dayPanel.classList.add("holidayPanel");
                
            }
            
            if(callback.day > 0){
                
                //console.log(callback.key);
                if(calendarData.schedule[callback.key] != null && calendarData.schedule[callback.key].length != 0){
                    
                    if(callback.remainder <= 0){
                        
                        dayPanel.classList.remove("nationalHoliday");
                        dayPanel.classList.remove("pointer");
                        dayPanel.classList.add("closeDay");
                        if(calendarAccount.type == "hotel"){
                            
                            dayPanel.classList.add("pointer");
                            var indexOfDayPanel = object.getIndexOfDayPanelList();
                            var cancelIndex = parseInt(callback.index) - 1;
                            var cancelPanel = document.getElementById("booking-package-day-" + cancelIndex);
                            if(cancelPanel != null){
                                
                                var cancelPanelData = indexOfDayPanel[cancelIndex];
                                //cancelPanel.setAttribute("data-select", 0);
                                
                                //cancelPanel.classList.remove("pointer");
                                //cancelPanel.classList.add("closeDay");
                                cancelPanel.removeEventListener("click", null, false);
                                calendarPanel.removeEventListener("click", cancelPanel, false);
                                
                            }
                            
                        }
                        /**
                        object.displayRemainingCapacityInCalendar(calendarData, callback, shortestTime, function(panel){
                            
                            
                        });
                        **/
                        //return null;
                        
                    }
                    
                    var nextAction = false;
                    for(var i = 0; i < calendarData.schedule[callback.key].length; i++){
                        
                        nextAction = true;
                        break;
                        
                    }
                    
                    if(nextAction == false || calendarData.schedule[callback.key] == null || calendarData.schedule[callback.key][0] == null){
                        
                        object._calendar.setStopToCreateCalendar(true);
                        window.alert(object._i18n.get("An unknown cause of error occurred"));
                        window.stop();
                        
                    }
                    
                    var stop = 0;
                    if(calendarAccount.type == "hotel" && calendarData.schedule[callback.key][0].stop == 'true'){
                        
                        dayPanel.classList.remove("nationalHoliday");
                        dayPanel.classList.remove("pointer");
                        dayPanel.classList.add("closeDay");
                        return null;
                        
                    }
                    
                    object.displayRemainingCapacityInCalendar(calendarData, callback, shortestTime, function(panel){
                        
                        
                    });
                    
                    if (object._isExtensionsValid == 1 && calendarData.schedule[callback.key].length == 1) {
                        
                        var oneSchedule = calendarData.schedule[callback.key][0];
                        
                        console.log(oneSchedule.title);
                        var descriptionLabel = document.createElement("div");
                        descriptionLabel.setAttribute("title", oneSchedule.title);
                        descriptionLabel.classList.add("descriptionLabelForDay");
                        descriptionLabel.textContent = oneSchedule.title;
                        dayPanel.appendChild(descriptionLabel);
                        
                    }
                    
                    dayPanel.onclick = function(){
                        
                        var monthKey = parseInt(this.getAttribute("data-month"));
                        var dayKey = parseInt(this.getAttribute("data-day"));
                        var yearKey = parseInt(this.getAttribute("data-year"));
                        
                        if(calendarAccount.type == "hotel"){
                            
                            
                            
                            var checkInPanel = document.getElementById("checkInPanel");
                            var checkOutPanel = document.getElementById("checkOutPanel");
                            
                            var checkInDatePanel = document.getElementById("checkInDate");
                            var checkOutDatePanel = document.getElementById("checkOutDate");
                            
                            var checkDate = object._hotel.getCheckDate();
                            var calendarKey = parseInt(this.getAttribute("data-key"));
                            var schedule = calendarData.schedule[calendarKey][0];
                            var date = object._calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, null, null, null, schedule.weekKey);
                            
                            if(checkDate.checkIn == null){
                                
                                if(schedule.remainder <= 0){
                                    
                                    return null;
                                    
                                }
                                
                                var acceptBooking = parseInt(this.getAttribute("data-select"));
                                if(acceptBooking == 0){
                                    
                                    return null;
                                    
                                }
                                
                                object._hotel.setCheckIn(schedule);
                                object._hotel.setCheckInKey(schedule.key);
                                var checkDate = object._hotel.getCheckDate();
                                this.classList.add("selectedDayPanel");
                                checkInClearLabel.classList.remove("hidden_panel");
                                checkInDatePanel.textContent = date;
                                checkInDatePanel.classList.remove("chooseDate");
                                
                                if(checkDate.checkOut == null){
                                    
                                    checkOutPanel.classList.remove("hidden_panel");
                                    checkOutDatePanel.classList.add("chooseDate");
                                    
                                }
                                
                                for(var key in calendarData.schedule){
                                    
                                    if(calendarData.schedule[key].length > 0 && checkDate.checkIn.unixTime <= calendarData.schedule[key][0].unixTime){
                                        
                                        object._hotel.addSchedule(calendarData.schedule[key][0]);
                                        
                                    }
                                    
                                    if(key < calendarKey){
                                        
                                        dayPanelList[key].select = 0;
                                        
                                    }
                                    
                                }
                                
                                if(checkDate.checkOut != null && parseInt(checkDate.checkOut.unixTime) > parseInt(schedule.unixTime)){
                                    
                                    var verifySchedule = object._hotel.verifySchedule(true);
                                    if(verifySchedule.status == true){
                                        
                                        object.validateRangeForHotel(calendarKey, dayPanelList, verifySchedule);
                                        
                                        
                                    }
                                    
                                }
                                
                                object._hotel.pushCallback();
                                
                            }else if(checkDate.checkIn != null){
                                
                                if(parseInt(checkDate.checkIn.unixTime) < parseInt(schedule.unixTime)){
                                    
                                    object._hotel.setCheckOut(schedule);
                                    object._hotel.setCheckOutKey(schedule.key);
                                    
                                    for(var key in calendarData.schedule){
                                        
                                        if(calendarData.schedule[key].length > 0 && schedule.unixTime >= calendarData.schedule[key][0].unixTime){
                                            
                                            object._hotel.addSchedule(calendarData.schedule[key][0]);
                                            
                                        }
                                        
                                    }
                                    
                                    var verifySchedule = object._hotel.verifySchedule(true);
                                    if(verifySchedule.status == true){
                                        
                                        object.validateRangeForHotel(calendarKey, dayPanelList, verifySchedule);
                                        this.classList.add("selectedDayPanel");
                                        checkOutClearLabel.classList.remove("hidden_panel");
                                        checkOutDatePanel.textContent = date;
                                        checkOutDatePanel.classList.remove("chooseDate");
                                        object._hotel.pushCallback();
                                        
                                    }
                                    
                                }
                                
                            }
                            
                            
                        }else{
                            
                            object.selectCourseAndSchedulePanel(monthKey, dayKey, yearKey, calendarData, accountKey, function(response){
                                
                                console.log(response);
                                
                            });
                            
                        }
                        
                    }
                    
                    if(calendarAccount.type == 'hotel'){
                        
                        var checkDate = object._hotel.getCheckDate();
                        var checkInKey = null;
                        if(checkDate.checkIn != null){
                            
                            checkInKey = object._calendar.getDateKey(checkDate.checkIn.month, checkDate.checkIn.day, checkDate.checkIn.year);
                            if(dayPanelList[checkInKey] != null){
                                
                                dayPanelList[checkInKey].select = 1;
                                for(var key in dayPanelList){
                                    
                                    if(calendarData.schedule[key].length > 0 && checkDate.checkIn.unixTime <= calendarData.schedule[key][0].unixTime){
                                        
                                        object._hotel.addSchedule(calendarData.schedule[key][0]);
                                        
                                    }
                                    
                                }
                                
                            }
                        }
                        
                        if(checkDate.checkIn != null && checkDate.checkOut != null){
                            
                            var checkOutKey = object._calendar.getDateKey(checkDate.checkOut.month, checkDate.checkOut.day, checkDate.checkOut.year);
                            for(var key in dayPanelList){
                                
                                if(key >= checkInKey && key <= checkOutKey){
                                    
                                    dayPanelList[key].select = 1;
                                    dayPanelList[key].eventPanel.classList.add("selectedDayPanel");
                                    
                                }else{
                                    
                                    dayPanelList[key].select = 0;
                                    
                                }
                                
                                if(calendarData.schedule[key].length > 0 && checkDate.checkIn.unixTime <= calendarData.schedule[key][0].unixTime){
                                    
                                    object._hotel.addSchedule(calendarData.schedule[key][0]);
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }else{
                    
                    dayPanel.classList.remove("nationalHoliday");
                    dayPanel.classList.remove("pointer");
                    dayPanel.classList.add("closeDay");
                    
                }
                
            }
            
	    });
	    
	    if (object._calendarAccount.flowOfBooking == 'services') {
	        
	        var returnButton = document.createElement("button");
            returnButton.classList.add("returnButton");
            returnButton.classList.add("bookingButton");
            returnButton.textContent = object.i18n("Return");
            calendarPanel.appendChild(returnButton);
            returnButton.onclick = function() {
                
                document.getElementById("booking-package_servicePage").classList.remove("hidden_panel");
                document.getElementById("booking-package_serviceDetails").classList.remove("hidden_panel");
                object.setScrollY(document.getElementById("booking-package_servicePage"));
                //calendarPanel.classList.add("hidden_panel");
                calendarPanel.textContent = null;
                
            };
	        
	    }
	    
        var rect = calendarPanel.getBoundingClientRect();
        
        returnLabel.onclick = function(){
            
            if(month == 1){
                
                year--;
		        month = 12;
                
            }else{
                
                month--;
                
            }
            
            var stateObj = {page: "previousPage", month: month, day: 1, year: year, accountKey: accountKey};
            window.history.pushState(stateObj, null, "#previousPage");
            
            object.getReservationData(month, 1, year, accountKey, true);
        
        }
        
        nextLabel.onclick = function(){
            
            if(month == 12){
                
                year++;
                month = 1;
                
            }else{
                
                month++;
		        
            }
            
            var stateObj = {page: "nextPage", month: month, day: 1, year: year, accountKey: accountKey};
            window.history.pushState(stateObj, null, "#nextPage");
            
            object.getReservationData(month, 1, year, accountKey, true);
            
        }
        
    }
    
    Booking_App.prototype.displayRemainingCapacityInCalendar = function(calendarData, element, shortestTime, callback){
        
        console.log(element);
        var object = this;
        var calendarAccount = object._calendarAccount;
        var createSymbolPanel = function(calendarAccount, point, capacity, remainder){
            
            console.log("point = " + point);
            var symbolPanel = document.createElement("div");
            
            if (parseInt(calendarAccount.displayRemainingCapacityInCalendarAsNumber) == 1) {
                
                symbolPanel.classList.add("numberInsteadOfSymbols");
                symbolPanel.textContent = remainder;
                return symbolPanel;
                
            }
            
            symbolPanel.classList.add("symbolPanel");
            symbolPanel.classList.add("material-icons");
            symbolPanel.setAttribute("style", "font-family :'Material Icons' !important;");
            var displayThresholdOfRemainingCapacity = parseInt(calendarAccount.displayThresholdOfRemainingCapacity);
            if (point >= displayThresholdOfRemainingCapacity && object.isJSON(calendarAccount.displayRemainingCapacityHasMoreThenThreshold) == true) {
                
                
                var remainingCapacity = JSON.parse(calendarAccount.displayRemainingCapacityHasMoreThenThreshold);
                symbolPanel.textContent = remainingCapacity.symbol;
                symbolPanel.style.color = remainingCapacity.color;
                
            } else if (point < displayThresholdOfRemainingCapacity && point > 0 && object.isJSON(calendarAccount.displayRemainingCapacityHasLessThenThreshold) == true) {
                
                var remainingCapacity = JSON.parse(calendarAccount.displayRemainingCapacityHasLessThenThreshold);
                symbolPanel.textContent = remainingCapacity.symbol;
                symbolPanel.style.color = remainingCapacity.color;
                
            } else if (point == 0 && object.isJSON(calendarAccount.displayRemainingCapacityHas0) == true) {
                
                var remainingCapacity = JSON.parse(calendarAccount.displayRemainingCapacityHas0);
                symbolPanel.textContent = remainingCapacity.symbol;
                symbolPanel.style.color = remainingCapacity.color;
                
            }
            
            return symbolPanel;
            
        }
        
        if (calendarAccount.displayRemainingCapacityInCalendar != null && parseInt(calendarAccount.displayRemainingCapacityInCalendar) == 1) {
            
            var calendarKey = parseInt(element.key);
            var panel = element.eventPanel;
            /**
            console.log(calendarAccount);
            console.log(calendarData);
            console.log(panel);
            **/
            
            var regularHoliday = calendarData.regularHoliday.calendar;
            if (regularHoliday[calendarKey] != null && parseInt(regularHoliday[calendarKey].status) == 0) {
                
                var schedules = calendarData.schedule;
                var point = 0;
                var capacity = 0;
                var remainder = 0;
                if (parseInt(calendarAccount.courseBool) == 1) {
                    
                    console.log(schedules[calendarKey]);
                    for (var i = 0; i < calendarData['schedule'][calendarKey].length; i++) {
                        
                        var schedule = calendarData['schedule'][calendarKey][i];
                        capacity += parseInt(schedule.capacity);
                        remainder += parseInt(schedule.remainder);
                        if (parseInt(schedule["remainder"]) == 0 || schedule["stop"] == 'true') {
                            
                            var rejectionTime = (parseInt(schedule["hour"]) * 60 + parseInt(schedule["min"])) - shortestTime;
                            //console.log("rejectionTime = " + rejectionTime);
                            
                            (function(schedule, key, courseTime, rejectionTime, callback) {
                                
                                for (var i = 0; i < schedule.length; i++) {
                                    
                                    var time = parseInt(schedule[i]["hour"]) * 60 + parseInt(schedule[i]["min"]);
                                    if (time > rejectionTime && i < key) {
                                        
                                        //console.log("i = " + i + " hour = " + schedule[i]["hour"] + " min = " + schedule[i]["min"]);
                                        callback(parseInt(schedule[i].remainder));
                                        
                                    }
                                    
                                    if (i == key) {
                                        
                                        if (schedule[i].stop == 'true') {
                                            
                                            callback(parseInt(schedule[i].remainder));
                                            
                                        }
                                        break;
                                        
                                    }
                                    
                                }
                                
                            })(calendarData['schedule'][calendarKey], i, shortestTime, rejectionTime, function(responseRemainder) {
                                
                                //console.log("callback responseRemainder = " + responseRemainder);
                                remainder -= responseRemainder;
                                
                            });
                            
                        }
                        
                    }
                    
                    console.log("capacity = " + capacity + " remainder = " + remainder);
                    point = remainder / capacity * 100;
                    var symbolPanel = createSymbolPanel(calendarAccount, point, capacity, remainder);
                    panel.appendChild(symbolPanel);
                    if (point <= 0) {
                        
                        panel.classList.add("closeDay");
                        panel.classList.remove("pointer");
                        
                    }
                    
                } else {
                    
                    capacity = parseInt(element.capacity);
                    remainder = parseInt(element.remainder);
                    point = remainder / capacity * 100;
                    var symbolPanel = createSymbolPanel(calendarAccount, point, capacity, remainder);
                    panel.appendChild(symbolPanel);
                    
                }
                
            }
            
        }
        
    }
    
    Booking_App.prototype.chageTop = function(elementTop){
        
        var object = this;
        //console.log(document.getElementById("courseMainPanel").classList.contains("positionSticky"));
        if(document.getElementById("courseMainPanel") != null && document.getElementById("courseMainPanel").classList.contains("positionSticky") === true){
            
            document.getElementById("topPanel").style.top = elementTop + "px";
            document.getElementById("courseMainPanel").style.top = (elementTop + object._topPanelHeight) + "px";
            
        }
        
        if(document.getElementById("daysListPanel") != null && document.getElementById("daysListPanel").classList.contains("positionSticky") === true){
            
            document.getElementById("topPanel").style.top = elementTop + "px";
            document.getElementById("daysListPanel").style.top = (elementTop + object._topPanelHeight) + "px";
            
        }
        
    }
    
    Booking_App.prototype.changeHeight = function(rect){
        
        console.log(rect);
        var object = this;
        if(rect != null){
            
            var height = rect.height;
            var schedulePage = document.getElementById("booking-package_schedulePage");
            var topPanel = document.getElementById("topPanel");
            var daysListPanel = document.getElementById("daysListPanel").style.height = height + "px";
            var courseMainPanel = document.getElementById("courseMainPanel").style.height = height + "px";
            var optionsMainPanel = document.getElementById("optionsMainPanel");
            if(optionsMainPanel.classList.contains("hidden_panel") == false){
                
                optionsMainPanel = document.getElementById("optionsMainPanel").style.height = height + "px";
                
            }
            
            //optionsMainPanel = document.getElementById("optionsMainPanel").style.height = height + "px";
            var scheduleMainPanel = document.getElementById("scheduleMainPanel").style.height = height + "px";
            //var blockPanel = document.getElementById("blockPanel").style.height = (window.innerWidth - schedulePage.getBoundingClientRect().top - this._top) + "px";
            //var blockPanel = document.getElementById("blockPanel").style.height = height + "px";
            
        }else{
            
            var schedulePage = document.getElementById("booking-package_schedulePage").style.height = null;
            var topPanel = document.getElementById("topPanel");
            var daysListPanel = document.getElementById("daysListPanel").style.height = null;
            var courseMainPanel = document.getElementById("courseMainPanel").style.height = null;
            var optionsMainPanel = document.getElementById("optionsMainPanel").style.height = null;
            var scheduleMainPanel = document.getElementById("scheduleMainPanel").style.height = null;
            var blockPanel = document.getElementById("blockPanel").style.height = null;
            
        }
        
        
        
        
    }
    
    Booking_App.prototype.validateRangeForHotel = function(calendarKey, dayPanelList, verifySchedule){
        
        console.log(verifySchedule);
        var object = this;
        var rangeList = {};
        for(var key in verifySchedule.list){
            
            var schedule = verifySchedule.list[key];
            var rangeKey = object._calendar.getDateKey(schedule.month, schedule.day, schedule.year);
            rangeList[rangeKey] = schedule;
            
        }
        
        for(var key in dayPanelList){
            
            if(rangeList[key] != null || calendarKey == key){
                
                dayPanelList[key].eventPanel.classList.add("selectedDayPanel");
                dayPanelList[key].select = 1;
                
            }else{
                
                dayPanelList[key].eventPanel.classList.remove("selectedDayPanel");
                dayPanelList[key].select = 0;
                
            }
            
        }
        
    }
    
    Booking_App.prototype.addPanel = function(name, panel){
        
        this._chagePanelList[name] = panel;
        
    }
    
    Booking_App.prototype.lengthOfStayForHotel = function(calendarPanel, month, day, year, checkInClearLabel, checkOutClearLabel, calendarData, accountKey){
        
        
        var object = this;
        console.log("object._top = " + object._top);
        object._hotel.setCalendarAccount(object._calendarAccount);
        calendarPanel.classList.add("calendarWidthForHotel");
        
        var durationStay = document.getElementById("booking-package_durationStay");
        durationStay.removeAttribute("class");
        durationStay.removeAttribute("style");
        durationStay.textContent = null;
        
        var hotelDetails = {};
        
        var bookingDetailsTitle = document.createElement("div");
        bookingDetailsTitle.classList.add("bookingDetailsTitle");
        bookingDetailsTitle.textContent = object._i18n.get("Your Booking Details");
        
        if (object._headingPosition == 1) {
            
            calendarPanel.setAttribute("style", "top: " + object._top + "px;");
            bookingDetailsTitle.setAttribute("style", "top: " + object._top + "px;");
            
        }
        
        //checkInClearLabel = document.createElement("label");
        checkInClearLabel.id = "checkInClearLabel";
        checkInClearLabel.textContent = object._i18n.get("Clear");
        checkInClearLabel.setAttribute("class", "clearLabel hidden_panel");
        
        //checkOutClearLabel = document.createElement("label");
        checkOutClearLabel.id = "checkOutClearLabel";
        checkOutClearLabel.textContent = object._i18n.get("Clear");
        checkOutClearLabel.setAttribute("class", "clearLabel hidden_panel");
        
        var expressionsCheck = object._calendar.getExpressionsCheck(parseInt(object._calendarAccount.expressionsCheck));
        
        var checkInDatePanel = document.createElement("div");
        checkInDatePanel.id = "checkInDate";
        checkInDatePanel.textContent = expressionsCheck.chooseArrival;
        
        var checkOutDatePanel = document.createElement("div");
        checkOutDatePanel.id = "checkOutDate";
        checkOutDatePanel.textContent = expressionsCheck.chooseDeparture;
        
        
        var checkInPanel = object.createRowPanel(expressionsCheck.arrival, checkInDatePanel, null, null, checkInClearLabel);
        checkInPanel.id = "checkInPanel";
        var checkOutPanel = object.createRowPanel(expressionsCheck.departure, checkOutDatePanel, null, null, checkOutClearLabel);
        checkOutPanel.id = "checkOutPanel";
        checkOutPanel.classList.add("hidden_panel");
        
        checkInDatePanel.classList.add("chooseDate");
        
        var guestsListPanel = document.createElement("div");
        guestsListPanel.classList.add("hidden_panel");
        
        /**
        durationStay.appendChild(bookingDetailsTitle);
        durationStay.appendChild(checkInPanel);
        durationStay.appendChild(checkOutPanel);
        durationStay.appendChild(guestsListPanel);
        **/
        
        durationStay.insertAdjacentElement("beforeend", bookingDetailsTitle);
        durationStay.insertAdjacentElement("beforeend", checkInPanel);
        durationStay.insertAdjacentElement("beforeend", checkOutPanel);
        durationStay.insertAdjacentElement("beforeend", guestsListPanel);
        
        var guestsList = object.getGuestsList();
        var totalLengthOfStayValue = document.createElement("div");
        totalLengthOfStayValue.id = "totalLengthOfStayValue";
        var totalLengthOfStay = object.createRowPanel(object._i18n.get("Total length of stay"), totalLengthOfStayValue, null, null, null);
        //guestsListPanel.appendChild(totalLengthOfStay);
        guestsListPanel.insertAdjacentElement("beforeend", totalLengthOfStay);
        //console.log("guestsList.length = " + guestsList.length);
        for(var key in guestsList){
            
            var guests = guestsList[key];
            var list = guestsList[key].json;
            if(typeof guestsList[key].json == 'string'){
                
                list = JSON.parse(guestsList[key].json);
                
            }
            
            var values = [];
            for(var i = 0; i < list.length; i++){
                
                values.push(list[i].name);
                
            }
            
            guestsList[key].values = values;
            guestsList[key].type = "SELECT";
            guestsList[key].value = 0;
            guestsList[key].index = 0;
            guestsList[key].person = 0;
            object._hotel.addGuests(key, guestsList[key]);
            if(list[0] != null){
                
                guestsList[key].person = parseInt(list[0].number);
                var response = object._hotel.setGuests(key, 0, list[0].number);
                
            }
            
            var input = new Input();
            input.setPrefix(object._prefix);
            var guestsSelectPanel = input.createInput(guestsList[key]['name'], guestsList[key], {}, function(event){
                
                var key = this.parentElement.getAttribute("data-guset");
                var index = parseInt(this.selectedIndex);
                var list = guestsList[key].json;
                if(typeof guestsList[key].json == 'string'){
                    
                    list = JSON.parse(guestsList[key].json);
                    
                }
                guestsList[key].index = index;
                var response = object._hotel.setGuests(key, index, list[index].number);
                var feeList = object._hotel.getFeeList();
                
                var gutsetsValue = document.getElementById("guestsValue_" + key);
                if(0 < index){
                    
                    gutsetsValue.textContent = list[index].name;
                    
                }else{
                    
                    gutsetsValue.textContent = null;
                    
                }
               
                
                object._hotel.pushCallback();
                
                var taxAmount = 0;
                for(var key in response.taxes) {
                    
                    if ((response.taxes[key].type == 'tax' && response.taxes[key].tax == 'tax_exclusive') || response.taxes[key].type == 'surcharge') {
                        
                        taxAmount += response.taxes[key].taxValue;
                        
                    }
                    
                }
                
                console.log("taxAmount = " + taxAmount);
                //document.getElementById("totalGuests").textContent = response.person;
                //document.getElementById("additionalFee").textContent = object.formatCost((feeList.additionalFee * response.nights), object._currency);
                document.getElementById("bookingPrice").textContent = object._format.formatCost((feeList.additionalFee * response.nights) + response.amount + taxAmount, object._currency);
                if(response.booking == false || response.nights == 0 || response.requiredGuests == false){
                    
                    bookingNowButton.disabled = true;
                    bookingNowButton.classList.add("hidden_panel");
                    
                }else{
                    
                    bookingNowButton.disabled = false;
                    bookingNowButton.classList.remove("hidden_panel");
                    
                }
                
                totalNumberOfGuestsPanel.classList.remove("errorPanel");
                if(response.booking == false){
                    
                    totalNumberOfGuestsPanel.classList.add("errorPanel");
                    
                }
                
            });
            
            var guestsLabel = document.createElement("div");
            guestsLabel.id = "guestsValue_" + key;
            guestsLabel.setAttribute("class", "value hidden_panel");
            
            guestsSelectPanel.setAttribute("data-guset", key);
            guestsSelectPanel.id = "guestsSelect_" + key;
            var required = parseInt(guestsList[key].required);
            var rowPanel = object.createRowPanel(guestsList[key]['name'], guestsSelectPanel, null, required, guestsLabel);
            //guestsListPanel.appendChild(rowPanel);
            guestsListPanel.insertAdjacentElement("beforeend", rowPanel);
            
        }
        
        var totalNumberOfGuestsPanel = object.createRowPanel(object._i18n.get("Total number of guests"), String(0), "totalGuests", null, null);
        totalNumberOfGuestsPanel.id = "totalLengthOfGuestsPanel";
        //guestsListPanel.appendChild(totalNumberOfGuestsPanel);
        guestsListPanel.insertAdjacentElement("beforeend", totalNumberOfGuestsPanel);
        
        /**
        var totalLengthOfStayValue = document.createElement("div");
        totalLengthOfStayValue.id = "totalLengthOfStayValue";
        
        var totalLengthOfStay = object.createRowPanel(object._i18n.get("Total length of stay"), totalLengthOfStayValue, null, null, null);
        guestsListPanel.appendChild(totalLengthOfStay);
        **/
        
        /**
        var additionalFeeForNightsPanel = document.createElement("div");
        additionalFeeForNightsPanel.classList.add("forNights");
        var additionalFeePanel = object.createRowPanel(object._i18n.get("Additional fees"), String(0), "additionalFee", null, additionalFeeForNightsPanel);
        additionalFeePanel.id = "additionalFeePanel";
        guestsListPanel.appendChild(additionalFeePanel);
        **/
        
        var accommodationFeePanelForNightsPanel = document.createElement("div");
        accommodationFeePanelForNightsPanel.classList.add("forNights");
        /**
        var accommodationFeePanel = object.createRowPanel(object._i18n.get("Accommodation fees"), String(0), "bookingFee", null, accommodationFeePanelForNightsPanel);
        guestsListPanel.appendChild(accommodationFeePanel);
        **/
        
        var summaryListPanel = document.createElement("div");
        summaryListPanel.id = "summaryListPanel";
        var summaryPanel = object.createRowPanel(object._i18n.get("Summary"), summaryListPanel, "summaryPanel", null, null);
        summaryPanel.classList.add("summary");
        //guestsListPanel.appendChild(summaryPanel);
        guestsListPanel.insertAdjacentElement("beforeend", summaryPanel);
        
        var totalFeePanel = object.createRowPanel(object._i18n.get("Total amount"), String(0), "bookingPrice", null, null);
        totalFeePanel.setAttribute("style", "border-width: 0;");
        totalFeePanel.classList.add("total_amount");
        //guestsListPanel.appendChild(totalFeePanel);
        guestsListPanel.insertAdjacentElement("beforeend", totalFeePanel);
        
        var bookingNowButton = document.createElement("button");
        bookingNowButton.classList.add("goToBookingFormButton")
        bookingNowButton.textContent = object._i18n.get("Next");
        bookingNowButton.classList.add("hidden_panel");
        bookingNowButton.disabled = true;
        //guestsListPanel.appendChild(bookingNowButton);
        guestsListPanel.insertAdjacentElement("beforeend", bookingNowButton);
        
        object.addPanel("calendarPanel", calendarPanel);
        object.addPanel("durationStay", durationStay);
        object.addPanel("checkInDatePanel", checkInDatePanel);
        object.addPanel("checkOutDatePanel", checkOutDatePanel);
        
        if(object._screen_width <= object._screen_width_limit){
            
            //calendarPanel.classList.add("hidden_panel");
            
        }
            
        checkInDatePanel.onclick = function(){
            
            if(object._screen_width <= object._screen_width_limit){
                
                object.setStep("selectDayPage");
                calendarPanel.classList.remove("hidden_panel");
                durationStay.classList.add("hidden_panel");
            
            }
            
        }
        
        checkOutDatePanel.onclick = function(){
            
            if(object._screen_width <= object._screen_width_limit){
                
                object.setStep("selectDayPage");
                calendarPanel.classList.remove("hidden_panel");
                durationStay.classList.add("hidden_panel");
            
            }
            
        }
            
        
        
        object._hotel.setCallback(function(response){
            /**
            console.log(response);
            console.log(object._hotel.getCheckDate());
            console.log(object._step);
            **/
            var checkDate = object._hotel.getCheckDate();
            
            if(response.status == true || response.guests == false){
                
                object._hotel.showSummary(summaryListPanel, expressionsCheck);
                if(response.booking == true && response.guests == false && object._step != 'inputPage'){    
                    
                    bookingNowButton.disabled = false;
                    bookingNowButton.classList.remove("hidden_panel");
                    document.getElementById("totalLengthOfGuestsPanel").classList.add("hidden_panel");
                    //document.getElementById("additionalFeePanel").classList.add("hidden_panel");
                
                }else if(response.booking == true && response.guests == true){
                    /**
                    bookingNowButton.disabled = false;
                    bookingNowButton.classList.remove("hidden_panel");
                    document.getElementById("totalLengthOfGuestsPanel").classList.add("hidden_panel");
                    document.getElementById("additionalFeePanel").classList.add("hidden_panel");
                    **/
                }
                
                if(object._screen_width <= object._screen_width_limit){
                    
                    object.setStep("topPage");
                    //calendarPanel.classList.add("hidden_panel");
                    durationStay.classList.remove("hidden_panel");
                    
                }
                
                if(response.nights > 0 && checkDate.checkIn != null && checkDate.checkOut != null){
                    
                    guestsListPanel.classList.remove("hidden_panel");
                    
                }
                
                var nightsValue = response.nights + " " + object._i18n.get("nights");
                if(response.nights == 1){
                    
                    nightsValue = response.nights + " " + object._i18n.get("night");;
                    
                }
                totalLengthOfStayValue.textContent = nightsValue;
                
                var totalNumberOfGuests = parseInt(response.adult) + parseInt(response.children);
                var totalNumberOfGuestsValue = 0;
                if(totalNumberOfGuests > 1){
                    
                    totalNumberOfGuestsValue = totalNumberOfGuests + " " + object._i18n.get("people");
                    
                }else if(totalNumberOfGuests == 1){
                    
                    totalNumberOfGuestsValue = totalNumberOfGuests + " " + object._i18n.get("person");
                    
                }
                document.getElementById("totalGuests").textContent = totalNumberOfGuestsValue;
                
                /**
                var accommodationFee = object.formatCost(response.additionalFee * response.nights, object._currency);
                document.getElementById("additionalFee").textContent = accommodationFee;
                
                
                var additionalFee = object.formatCost(response.amount, object._currency);
                document.getElementById("bookingFee").textContent = additionalFee;
                **/
                
                var taxAmount = 0;
                for(var key in response.taxes) {
                    
                    console.log(response.taxes[key]);
                    if ((response.taxes[key].type == 'tax' && response.taxes[key].tax == 'tax_exclusive') || response.taxes[key].type == 'surcharge') {
                        
                        taxAmount += response.taxes[key].taxValue;
                        
                    }
                    
                }
                
                console.log("taxAmount = " + taxAmount);
                
                var additionalFee = object._format.formatCost(response.amount + taxAmount + (response.additionalFee * response.nights), object._currency);
                document.getElementById("bookingPrice").textContent = additionalFee;
                
                //var nightsText = "(for " + response.nights + " nights)";
                var nightsText = object._i18n.get("(for %s nights)", [response.nights]);
                if(response.nights == 1){
                    
                    //nightsText = "(for " + 1 + " night)";
                    nightsText = object._i18n.get("(for %s night)", [response.nights]);
                    
                }
                //additionalFeeForNightsPanel accommodationFeePanelForNightsPanel
                //additionalFeeForNightsPanel.textContent = nightsText;
                //accommodationFeePanelForNightsPanel.textContent = nightsText;
                
            }else{
                
                guestsListPanel.classList.add("hidden_panel");
                
            }
            
        });
        
        checkInClearLabel.onclick = function(){
            
            guestsListPanel.classList.add("hidden_panel");
            var dayPanelList = object.getDayPanelList();
            var checkDate = object._hotel.getCheckDate();
            var checkInDate = checkDate.checkIn;
            var checkOutDate = checkDate.checkOut;
            var checkInKey = null;
            var checkOutKey = null;
            
            if(checkInDate != null){
                
                checkInKey = object._calendar.getDateKey(checkInDate.month, checkInDate.day, checkInDate.year);
                
            }
            
            if(checkOutDate != null){
                
                checkOutKey = object._calendar.getDateKey(checkOutDate.month, checkOutDate.day, checkOutDate.year);
                
            }
            
            for(var key in dayPanelList){
                    
                dayPanelList[key].select = 0;
                dayPanelList[key].eventPanel.classList.remove("selectedDayPanel");
                    
            }
            
            //var expressionsCheck = object._calendar.getExpressionsCheck(parseInt(object._calendarAccount.expressionsCheck));
            
            checkInDatePanel.textContent = expressionsCheck.chooseArrival;
            checkInDatePanel.classList.add("chooseDate");
            checkInClearLabel.classList.add("hidden_panel");
            
            checkOutDatePanel.textContent = expressionsCheck.chooseDeparture;
            checkOutDatePanel.classList.add("chooseDate");
            checkOutPanel.classList.add("hidden_panel");
            checkOutClearLabel.classList.add("hidden_panel");
            
            object._hotel.setCheckIn(null);
            object._hotel.setCheckInKey(null)
            object._hotel.setCheckOut(null);
            object._hotel.setCheckOutKey(null);
            
        }
        
        checkOutClearLabel.onclick = function(){
            
            guestsListPanel.classList.add("hidden_panel");
            var dayPanelList = object.getDayPanelList();
            var checkDate = object._hotel.getCheckDate();
            var checkInDate = checkDate.checkIn;
            var checkOutDate = checkDate.checkOut;
            var checkInKey = null;
            var checkOutKey = null;
            
            if(checkInDate != null){
                
                checkInKey = object._calendar.getDateKey(checkInDate.month, checkInDate.day, checkInDate.year);
                
            }
            
            if(checkOutDate != null){
                
                checkOutKey = object._calendar.getDateKey(checkOutDate.month, checkOutDate.day, checkOutDate.year);
                
            }
            
            if(checkInKey != null){
                
                for(var key in dayPanelList){
                    
                    if(checkInKey != key){
                        
                        dayPanelList[key].select = 0;
                        dayPanelList[key].eventPanel.classList.remove("selectedDayPanel");
                        
                    }
                    
                }
                
            }
            
            checkOutDatePanel.textContent = expressionsCheck.chooseDeparture;
            checkOutDatePanel.classList.add("chooseDate");
            checkOutClearLabel.classList.add("hidden_panel");
            object._hotel.setCheckOut(null);
            object._hotel.setCheckOutKey(null);
            console.log(object._hotel.getCheckDate());
            
        }
        
        bookingNowButton.onclick = function(){
            
            var calendarPage = document.getElementById("booking-package_calendarPage");
            var durationStay = document.getElementById("booking-package_durationStay");
            var formPanel = document.getElementById("booking-package_inputFormPanel");
            var top = 0;
            var response = object._hotel.verifySchedule(true);
            var checkDate = object._hotel.getCheckDate();
            var month = parseInt(checkDate.checkIn.month);
            var day = parseInt(checkDate.checkIn.day);
            var year = parseInt(checkDate.checkIn.year);
            if(response.booking == true && response.status == true){
                
                var guestsList = object.getGuestsList();
                for(var key in guestsList){
                    
                    var gutsetsValue = document.getElementById("guestsValue_" + key);
                    var gutsetsSelect = document.getElementById("guestsSelect_" + key);
                    gutsetsValue.classList.remove("hidden_panel");
                    gutsetsSelect.classList.add("hidden_panel");
                    
                }
                
                
                
                object.createForm(month, day, year, null, null, calendarData, null, checkDate.checkIn, null, accountKey, function(response){
                    
                    if(response.status == 'success'){
                        
                        object._hotel.reset();
                        object._lengthOfStayBool = true;
                        document.getElementById("booking-package_calendarPage").classList.remove("hidden_panel");
                        object.createCalendar(response, month, day, year, accountKey);
                        
                    }
                    
                    if(response.mode == 'return'){
                        
                        var guestsList = object.getGuestsList();
                        for(var key in guestsList){
                            
                            var gutsetsValue = document.getElementById("guestsValue_" + key);
                            var gutsetsSelect = document.getElementById("guestsSelect_" + key);
                            gutsetsValue.classList.add("hidden_panel");
                            gutsetsSelect.classList.remove("hidden_panel");
                            
                        }
                        
                        durationStay.setAttribute("style", "");
                        durationStay.classList.remove("hidden_panel");
                        durationStay.classList.remove("position_sticky");
                        durationStay.classList.remove("nextPageBookingDetails");
                        durationStay.classList.add("returnPageBookingDetails");
                        document.getElementById("booking-package_inputFormPanel").classList.add("hidden_panel");
                        checkInClearLabel.classList.remove("hidden_panel");
                        checkOutClearLabel.classList.remove("hidden_panel");
                        bookingNowButton.classList.remove("hidden_panel");
                        
                        var scrollPositionNew = window.pageYOffset + durationStay.getBoundingClientRect().top - object._top;
                        var scrollPosition = durationStay.getBoundingClientRect().top - object._top;
                        window.scrollTo(0, scrollPositionNew);
                        
                        if(object._screen_width > object._screen_width_limit){
                            
                            durationStay.addEventListener("animationend", (function(){
                                
                                var timer = setInterval(function(){
                                    
                                    calendarPage.classList.remove("hidden_panel");
                                    console.error("Time out");
                                    clearInterval(timer);
                                    
                                }, 810);
                                
                                return function returnPage(){
                                    
                                    durationStay.removeEventListener("animationend", returnPage, false);
                                    
                                }
                                
                            })(), false);
                            
                        }else{
                            
                            calendarPage.classList.remove("hidden_panel");
                            
                        }
                        
                        
                    }else if(response.mode == 'top'){
                        
                        top = response.top;
                        
                    }
                    
                });
                
                checkInClearLabel.classList.add("hidden_panel");
                checkOutClearLabel.classList.add("hidden_panel");
                bookingNowButton.classList.add("hidden_panel");
                
                durationStay.classList.remove("returnPageBookingDetails");
                formPanel.classList.remove("returnPageVisitorDetails");
                
                calendarPage.classList.add("hidden_panel");
                durationStay.classList.add("nextPageBookingDetails");
                
                var interval = 810;
                if(object._screen_width < object._screen_width_limit){
                    
                    interval = 110;
                    
                }
                
                durationStay.addEventListener("animationend", (function(){
                    
                    var timer = setInterval(function(){
                        
                        //durationStay.setAttribute("style", "top: " + top + "px;");
                        durationStay.classList.add("position_sticky");
                        formPanel.classList.remove("hidden_panel");
                        formPanel.classList.add("nextPageVisitorDetails");
                        
                        if(object._screen_width < object._screen_width_limit){
                            
                            console.log("object._top = " + object._top);
                            var durationStayRect = durationStay.getBoundingClientRect();
                            var scrollPositionNew = window.pageYOffset + (durationStayRect.top + durationStayRect.height) - (object._top * 2);
                            window.scrollTo({top: scrollPositionNew, behavior: "smooth"});
                            
                        }
                        console.error("Time out");
                        clearInterval(timer);
                        
                    }, interval);
                    
                    return function next(){
                        
                        durationStay.removeEventListener("animationend", next, false);
                        
                    }
                    
                })(), false);
                
                
            }
            
            
        }
        
    }
    
    Booking_App.prototype.selectCourseAndSchedulePanel = function(month, day, year, calendarData, accountKey, callback){
        
        console.log("accountKey = " + accountKey);
        month = parseInt(month);
        day = parseInt(day);
        year = parseInt(year);
        
        var object = this;
        var calendarKey = object._calendar.getDateKey(month, day, year);
        
        if(callback != null){
            
            object.setSchedulesCallback(callback);
            
        }else{
            
            callback = object.getSchedulesCallback();
            
        }
        
        console.log("day = " + day + " month = " + month + " year = " + year + " week = " + calendarData.calendar[calendarKey].week);
        console.log(calendarData);
        var calendarArray = Object.keys(calendarData.calendar);
        
        var startDayKey = calendarData.calendar[calendarKey].number - 3;
        var endDayKey = calendarData.calendar[calendarKey].number + 3;
        console.log(calendarArray[startDayKey]);
        console.log(calendarData.calendar[calendarArray[startDayKey]]);
        
        var startDay = calendarData.calendar[calendarKey].number - 3;
        var endDay = calendarData.calendar[calendarKey].number + 3;
        if(startDayKey <= 0){
            
            startDay = 0;
            endDay = 6;
            
        }else{
            
            startDay = startDayKey;
            if(calendarArray[endDayKey] != null){
                
                endDay = endDayKey;
                
            }
            
        }
        
        if(endDay > calendarArray.length){
            
            startDay = calendarArray.length - 7;
            endDay = calendarArray.length - 1;
            
        }
        
        var calendarPage = document.getElementById("booking-package_calendarPage");
        calendarPage.setAttribute("class", "hidden_panel");
        
        var schedulePage = document.getElementById("booking-package_schedulePage");
        schedulePage.classList.remove("hidden_panel");
        object.setScrollY(schedulePage);
        var body = object._body;
        
        var selectedDate = document.createElement("div");
        selectedDate.id = "selectedDate";
        selectedDate.classList.add("selectedDate");
        selectedDate.textContent = object._calendar.formatBookingDate(month, day, year, null, null, null, calendarData.calendar[calendarKey].week);
        
        var leftButtonPanel = document.createElement("div");
        leftButtonPanel.id = "leftButtonPanel";
        leftButtonPanel.classList.add("leftButtonPanel");
        
        var rightButtonPanel = document.createElement("div");
        rightButtonPanel.id = "rightButtonPanel";
        rightButtonPanel.classList.add("rightButtonPanel");
        
        /**
        var topPanel = document.createElement("div");
        topPanel.id = "topPanel";
        **/
        var topPanel = document.getElementById("topPanel");
        topPanel.textContent = null;
        //topPanel.setAttribute("class", "topPanel");
        topPanel.appendChild(leftButtonPanel);
        topPanel.appendChild(selectedDate);
        topPanel.appendChild(rightButtonPanel);
        object._topPanelHeight = topPanel.clientHeight;
        if (object._headingPosition == 0) {
            
            //topPanel.classList.add("headingPosition");
            topPanel.classList.add("topPanelNoAnimation");
            
        } else {
            
            topPanel.classList.add("topPanel");
            
        }
        //schedulePage.appendChild(topPanel);
        
        
        /**
        var daysListPanel = document.createElement("div");
        daysListPanel.id = "daysListPanel";
        **/
        var daysListPanel = document.getElementById("daysListPanel");
        daysListPanel.textContent = null;
        daysListPanel.setAttribute("class", "daysListPanel");
        
        if (object._headingPosition == 0) {
            
            //daysListPanel.classList.add("headingPosition");
            daysListPanel.setAttribute("class", "daysListPanelNoAnimation");
            
        } else {
            
            daysListPanel.setAttribute("class", "daysListPanel");
            
        }
        
        //schedulePage.appendChild(daysListPanel);
        
        object.initWeekDaysList();
        var weekDaysPanelList = [];
        for(var i = startDay; i <= endDay; i++){
            
            if(calendarArray[i] == null){
                
                continue;
                
            }
            
            var calendar = calendarData.calendar[calendarArray[i]];
            var key = object._calendar.getDateKey(calendar.month, calendar.day, calendar.year);
            var weekNum = calendarData.calendar[key].week;
            var selecteWeekData = object.serachDayPanelList(key);
            
            var weekPanel = document.createElement("div");
            weekPanel.classList.add("weekPanel");
            weekPanel.classList.add(weekNum +"_OfWeek");
            weekPanel.textContent = this._i18n.get(this.weekName[weekNum]);
            
            var dayPanel = document.createElement("div");
            dayPanel.textContent = calendar.day;
            
            var weekDaysPanel = document.createElement("div");
            //weekDaysPanel.setAttribute("data-key", i);
            weekDaysPanel.setAttribute("data-key", calendar.number);
            weekDaysPanel.setAttribute("data-status", "1");
            weekDaysPanel.appendChild(weekPanel);
            weekDaysPanel.appendChild(dayPanel);
            weekDaysPanel.classList.add("selectPanel");
            
            if(calendar.day == day){
                
                weekDaysPanel.classList.add("selectPanelActive");
                
            }
            
            if(calendarData.schedule[key].length == 0 || (selecteWeekData != null && parseInt(selecteWeekData.remainder) <= 0)){
                
                weekDaysPanel.setAttribute("data-status", "0");
                weekDaysPanel.classList.remove("selectPanel");
                weekDaysPanel.classList.remove("selectPanelActive");
                weekDaysPanel.classList.add("selectPanelError");
                
            }else{
                
                //object.addWeekDaysList(String(i), this.weekName[weekNum] + " " + i);
                object.addWeekDaysList(String(calendar.number), this._i18n.get(this.weekName[weekNum]) + " " + calendar.day);
                weekDaysPanel.onclick = function(){
                    
                    this.setAttribute("class", "selectPanel selectPanelActive");
                    var key = parseInt(this.getAttribute("data-key"));
                    var calendar = calendarData.calendar[calendarArray[key]];
                    var calendarKey = object._calendar.getDateKey(calendar.month, calendar.day, calendar.year);
                    selectedDate.textContent = object._calendar.formatBookingDate(calendar.month, calendar.day, calendar.year, null, null, null, calendar.week);
                    object.unselectPanel(key, weekDaysPanelList, "selectPanel");
                    object.createCourseAndSchedules(calendar.month, calendar.day, calendar.year, daysListPanel, weekDaysPanelList, calendarData, rect, accountKey, function(response){
                        
                        if (response.mode == "completed") {
                            
                            if (object._calendarAccount.flowOfBooking == 'calendar') {
                                
                                object.createCalendar(response, calendar.month, calendar.day, calendar.year, accountKey);
                                
                            } else {
                                
                                calendarPage.textContent = null;
                                object.createServicesPanel(response, calendar.month, calendar.day, calendar.year, accountKey);
                                
                            }
                            
                        }
                        
                    });
                    
                }
                
            }
            
            weekDaysPanelList.push(weekDaysPanel);
            daysListPanel.appendChild(weekDaysPanel);
            
        }
        /**
        var scheduleMainPanel = document.createElement("div");
        scheduleMainPanel.id = "scheduleMainPanel";
        **/
        var scheduleMainPanel = document.getElementById("scheduleMainPanel");
        scheduleMainPanel.textContent = null;
        scheduleMainPanel.setAttribute("style", "");
        //scheduleMainPanel.setAttribute("class", "courseListPanel box_shadow hidden_panel");
        if (object._headingPosition == 0) {
            
            //scheduleMainPanel.classList.add("headingPosition");
            scheduleMainPanel.setAttribute("class", "courseListPanelNoAnimation box_shadow hidden_panel");
            
        } else {
            
            scheduleMainPanel.setAttribute("class", "courseListPanel box_shadow hidden_panel");
            
        }
        //schedulePage.appendChild(scheduleMainPanel);
        
        var optionsMainPanel = document.getElementById("optionsMainPanel");
        optionsMainPanel.setAttribute("style", "");
        optionsMainPanel.classList.add("hidden_panel");
        if (object._headingPosition == 0) {
            
            optionsMainPanel.classList.add("headingPosition");
            
        }
        
        var courseMainPanel = document.getElementById("courseMainPanel");
        courseMainPanel.textContent = null;
        courseMainPanel.setAttribute("style", "");
        courseMainPanel.setAttribute("class", "courseListPanel box_shadow");
        if (object._headingPosition == 0) {
            
            //courseMainPanel.classList.add("headingPosition");
            courseMainPanel.setAttribute("class", "courseListPanelNoAnimation box_shadow");
            
        } else {
            
            courseMainPanel.setAttribute("class", "courseListPanel box_shadow");
            
        }
        
        var blockPanel = document.getElementById("blockPanel");
        blockPanel.style.height = (document.clientHeight - schedulePage.getBoundingClientRect().top) + "px";
        if (object._headingPosition == 0) {
            
            //blockPanel.classList.add("headingPosition");
            
        }
        
        var rect = daysListPanel.getBoundingClientRect();
        
        var bottomPanel = document.getElementById("bottomPanel");
        bottomPanel.classList.add("bottomPanel");
        if (object._headingPosition == 0) {
            
            bottomPanel.classList.add("bottomPanelNoAnimation");
            
        }
        
        if (object._headingPosition == 1) {
            
            bottomPanel.style.bottom = object._bottom + "px";
            
        }
        
        var returnToCalendarButton = document.getElementById("returnToCalendarButton");
        returnToCalendarButton.classList.remove("hidden_panel");
        if(returnToCalendarButton.event != null){
            
            returnToCalendarButton.removeEventListener("click", null);
            
        }
        
        //returnToCalendarButton.textContent = object.i18n('Return');
        bottomPanel.appendChild(returnToCalendarButton);
        returnToCalendarButton.onclick = function(){
            
            document.getElementById("optionsMainPanel").setAttribute("class", "hidden_panel");
            schedulePage.setAttribute("class", "hidden_panel");
            calendarPage.setAttribute("class", "");
            
        }
        
        
        if(calendarData.schedule[calendarKey].length != 0){
            
            object.createCourseAndSchedules(month, day, year, daysListPanel, weekDaysPanelList, calendarData, rect, accountKey, function(response){
                
                if(response.mode == "completed"){
                    
                    if (object._calendarAccount.flowOfBooking == 'calendar') {
                        
                        calendarPage.classList.remove("hidden_panel");
                        object.createCalendar(response, month, day, year, accountKey);
                        
                    } else {
                        
                        calendarPage.textContent = null;
                        object.createServicesPanel(response, month, day, year, accountKey);
                        
                    }
                    
                }
                
            });
            
        }
        
    }
    
    Booking_App.prototype.createCourseAndSchedules = function(month, day, year, daysListPanel, weekDaysPanelList, calendarData, rect, accountKey, callback){
        
        console.log("accountKey = " + accountKey);
        var object = this;
        var calendarKey = object._calendar.getDateKey(month, day, year);
        var schedulePage = document.getElementById("booking-package_schedulePage");
        var serviceAndSchedulePanel = document.getElementById("booking-package_schedulePage");
        var scheduleMainPanel = document.createElement("div");
        if(document.getElementById("scheduleMainPanel")){
            
            scheduleMainPanel = document.getElementById("scheduleMainPanel");
            
        }else{
            
            scheduleMainPanel.id = "scheduleMainPanel";
            scheduleMainPanel.setAttribute("class", "courseListPanel box_shadow hidden_panel");
            schedulePage.appendChild(scheduleMainPanel);
            if (object._headingPosition == 0) {
                
                //scheduleMainPanel.classList.add("headingPosition");
                scheduleMainPanel.setAttribute("class", "courseListPanelNoAnimation box_shadow hidden_panel");
                
            } else {
                
                scheduleMainPanel.setAttribute("class", "courseListPanel box_shadow hidden_panel");
                
            }
            
        }
        
        var formMainPanel = document.createElement("div");
        if(document.getElementById("formMainPanel")){
            
            formMainPanel = document.getElementById("formMainPanel");
            
        }else{
            
            formMainPanel.id = "formMainPanel";
            formMainPanel.setAttribute("class", "courseListPanel box_shadow hidden_panel");
            schedulePage.appendChild(formMainPanel);
            
        }
        
        /**
        scheduleMainPanel.addEventListener("animationend", function(event){
            
            alert("animationend");
            
        });
        **/
        
        if(this._courseBool == true && object._courseList.length != 0){
            
            /**
            for (var i in object._courseList) {
                
                object._courseList[i].service = 1;
                object._courseList[i].selected = 0;
                object._courseList[i].selectedOptionsList = [];
                
            }
            
            var courseList = object._courseList;
            **/
            
            console.log(rect.height);
            var courseMainPanel = document.createElement("div");
            if(document.getElementById("courseMainPanel")){
                
                courseMainPanel = document.getElementById("courseMainPanel");
                courseMainPanel.textContent = null;
                
            }else{
                
                courseMainPanel.id = "courseMainPanel";
                courseMainPanel.setAttribute("class", "courseListPanel box_shadow");
                schedulePage.appendChild(courseMainPanel);
                if (object._headingPosition == 0) {
                    
                    courseMainPanel.setAttribute("class", "courseListPanelNoAnimation box_shadow");
                    
                } else {
                    
                    courseMainPanel.setAttribute("class", "courseListPanel box_shadow");
                    
                }
                
            }
            
            var animationBool = true;
            var checkBoxList = [];
            var coursePanelList = [];
            object.createServicesList(animationBool, checkBoxList, coursePanelList, courseMainPanel, function(table_row) {
                
                table_row.onclick = function() {
                    
                    console.log(courseList);
                    console.log("animationBool = " + animationBool);
                    //document.getElementById("optionsMainPanel").setAttribute("class", "hidden_panel");
                    var optionsMainPanel = document.getElementById("optionsMainPanel");
                    optionsMainPanel.classList.add("hidden_panel");
                    if(optionsMainPanel.classList.contains("postionDefaultForScheduleListPanel")){
                        
                        animationBool = true;
                        
                    }
                    console.log("animationBool = " + animationBool);
                    
                    courseMainPanel.classList.remove("box_shadow");
                    
                    if (object._headingPosition == 0) {
                        
                        courseMainPanel.classList.remove("postionReturnForCourseListPanel");
                        courseMainPanel.classList.add("postionLeftForCourseListPanelNoAnimation");
                        
                    } else {
                        
                        courseMainPanel.classList.remove("postionReturnForCourseListPanel");
                        courseMainPanel.classList.add("postionLeftForCourseListPanel");
                        
                    }
                    
                    this.setAttribute("class", "selectPanel selectPanelActive");
                    var key = this.getAttribute("data-key");
                    object.unselectPanel(key, coursePanelList, "selectPanel");
                    object.changeHeight(null);
                    
                    if(parseInt(object._calendarAccount.hasMultipleServices) == 0){
                        
                        for (var i in courseList) {
                            
                            courseList[i].selected = 0;
                            
                        }
                        
                        courseList[parseInt(key)].selected = 1;
                        
                    } else {
                        
                        var checkBox = checkBoxList[parseInt(key)];
                        if(checkBox.checked == true){
                            
                            checkBox.checked = false;
                            this.setAttribute("class", "selectPanel");
                            courseList[parseInt(key)].selected = 0;
                            //delete(selectedOptions[key]);
                            
                        }else{
                            
                            checkBox.checked = true;
                            this.setAttribute("class", "selectPanel selectPanelActive");
                            courseList[parseInt(key)].selected = 1;
                            //selectedOptions[key] = option;
                            
                        }
                        
                        var returnPage = true;
                        for (var i in courseList) {
                            
                            if (courseList[i].selected == 1) {
                                
                                returnPage = false;
                                
                            }
                            
                        }
                        
                        if (returnPage == true) {
                            
                            object.returnToDayList(daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, true);
                            if (document.getElementById("returnToDayListButton") != null) {
                                
                                document.getElementById("returnToDayListButton").classList.add("hidden_panel");
                                
                            }
                            
                            if (document.getElementById("returnToCalendarButton") != null) {
                                
                                document.getElementById("returnToCalendarButton").classList.remove("hidden_panel");
                                
                            }
                            
                            return null;
                            
                        }
                        
                        
                    }
                    
                    
                    //courseList[parseInt(key)].selected = 1;
                    console.log(courseList);
                    console.log(courseList[parseInt(key)]);
                    var course = courseList[parseInt(key)];
                    var options = [];
                    if(course.options != null){
                        
                        options = JSON.parse(course.options);
                        console.log(options);
                        
                    }
                    
                    if(0 < options.length){
                        
                        if (checkBox == null || checkBox.checked == true) {
                            
                            animationBool = object.createOptions(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList[parseInt(key)], accountKey, function(response){
                                
                                console.log(response);
                                courseList[parseInt(key)].selectedOptionsList = response.selectedOptions;
                                if (response.next == 1) {
                                    
                                    object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, null, accountKey, function(response){
                                        
                                        if(response.mode == 'changeDay'){
                                            
                                            day = parseInt(response.day);
                                            
                                        }
                                        callback(response);
                            
                                    });
                                    
                                }
                                
                            });
                            
                        } else {
                            
                            object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, null, accountKey, function(response){
                                
                                if(response.mode == 'changeDay'){
                                    
                                    day = parseInt(response.day);
                                    
                                }
                                callback(response);
                    
                            });
                            
                        }
                        
                    }else{
                        
                        var nextButton = document.getElementById("nextButton");
                        nextButton.removeEventListener("check", null);
                        nextButton.classList.add("hidden_panel");
                        animationBool = true;
                        //object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList[parseInt(key)], null, accountKey, function(response){
                        object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, null, accountKey, function(response){
                            
                            if(response.mode == 'changeDay'){
                                
                                day = parseInt(response.day);
                                
                            }
                            callback(response);
                
                        });
                        
                    }
                    
                };
                
            });
            
            
            /**
            var animationBool = true;
            var checkBoxList = [];
            var coursePanelList = [];
            for (var i in courseList) {
                
                var course = courseList[i];
                if (course.active != "true") {
                    
                    continue;
                    
                }
                
                course["status"] = true;
                
                var coursePanel = document.createElement("div");
                coursePanel.setAttribute("data-key", i);
                coursePanel.setAttribute("data-status", 1);
                
                var courseNamePanel = document.createElement("span");
                if(typeof course["name"] == "string"){
                    
                    course["name"] = course["name"].replace(/\\/g, "");
                    
                }
                courseNamePanel.textContent = course["name"];
                //coursePanel.appendChild(courseNamePanel);
                
                var checkBox = document.createElement("input");
                checkBox.setAttribute("data-key", i);
                checkBox.type = "checkbox";
                checkBox.value = "";
                //checkBox.disabled = true;
                
                checkBox.onclick = function() {
                    
                    if (this.checked == true) {
                        
                        this.checked = false;
                        
                    } else {
                        
                        this.checked = true;
                        
                    }
                    
                };
                
                checkBoxList.push(checkBox);
                
                var label = document.createElement("span");
                label.appendChild(checkBox);
                label.appendChild(courseNamePanel);
                if(parseInt(object._calendarAccount.hasMultipleServices) == 0){
                    
                    checkBox.classList.add("hidden_panel");
                    
                }
                coursePanel.appendChild(label);
                
                if(course.cost != null && course.cost != 0){
                    
                    var cost = object._format.formatCost(course.cost, object._currency);
                    var courseCostPanel = document.createElement("span");
                    courseCostPanel.classList.add("courseCostPanel");
                    courseCostPanel.textContent = cost;
                    coursePanel.appendChild(courseCostPanel);
                    
                }
                
                var table_row = document.createElement("div");
                table_row.setAttribute("data-key", i);
                table_row.setAttribute("data-status", 1);
                table_row.classList.add("selectPanel");
                table_row.appendChild(coursePanel);
                
                coursePanelList.push(table_row);
                courseMainPanel.appendChild(table_row);
                
                table_row.onclick = function(){
                    
                    console.log(courseList);
                    //document.getElementById("optionsMainPanel").setAttribute("class", "hidden_panel");
                    var optionsMainPanel = document.getElementById("optionsMainPanel");
                    optionsMainPanel.classList.add("hidden_panel");
                    if(optionsMainPanel.classList.contains("postionDefaultForScheduleListPanel")){
                        
                        animationBool = true;
                        
                    }
                    
                    courseMainPanel.classList.remove("box_shadow");
                    
                    if (object._headingPosition == 0) {
                        
                        courseMainPanel.classList.remove("postionReturnForCourseListPanel");
                        courseMainPanel.classList.add("postionLeftForCourseListPanelNoAnimation");
                        
                    } else {
                        
                        courseMainPanel.classList.remove("postionReturnForCourseListPanel");
                        courseMainPanel.classList.add("postionLeftForCourseListPanel");
                        
                    }
                    
                    this.setAttribute("class", "selectPanel selectPanelActive");
                    var key = this.getAttribute("data-key");
                    object.unselectPanel(key, coursePanelList, "selectPanel");
                    object.changeHeight(null);
                    
                    if(parseInt(object._calendarAccount.hasMultipleServices) == 0){
                        
                        for (var i in courseList) {
                            
                            courseList[i].selected = 0;
                            
                        }
                        
                        courseList[parseInt(key)].selected = 1;
                        
                    } else {
                        
                        var checkBox = checkBoxList[parseInt(key)];
                        if(checkBox.checked == true){
                            
                            checkBox.checked = false;
                            this.setAttribute("class", "selectPanel");
                            courseList[parseInt(key)].selected = 0;
                            //delete(selectedOptions[key]);
                            
                        }else{
                            
                            checkBox.checked = true;
                            this.setAttribute("class", "selectPanel selectPanelActive");
                            courseList[parseInt(key)].selected = 1;
                            //selectedOptions[key] = option;
                            
                        }
                        
                        var returnPage = true;
                        for (var i in courseList) {
                            
                            if (courseList[i].selected == 1) {
                                
                                returnPage = false;
                                
                            }
                            
                        }
                        
                        if (returnPage == true) {
                            
                            object.returnToDayList(daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, true);
                            if (document.getElementById("returnToDayListButton") != null) {
                                
                                document.getElementById("returnToDayListButton").classList.add("hidden_panel");
                                
                            }
                            
                            if (document.getElementById("returnToCalendarButton") != null) {
                                
                                document.getElementById("returnToCalendarButton").classList.remove("hidden_panel");
                                
                            }
                            
                            return null;
                            
                        }
                        
                        
                    }
                    
                    
                    //courseList[parseInt(key)].selected = 1;
                    console.log(courseList);
                    console.log(courseList[parseInt(key)]);
                    var course = courseList[parseInt(key)];
                    var options = [];
                    if(course.options != null){
                        
                        options = JSON.parse(course.options);
                        console.log(options);
                        
                    }
                    
                    if(0 < options.length){
                        
                        if (checkBox == null || checkBox.checked == true) {
                            
                            animationBool = object.createOptions(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList[parseInt(key)], accountKey, function(response){
                                
                                console.log(response);
                                courseList[parseInt(key)].selectedOptionsList = response.selectedOptions;
                                if (response.next == 1) {
                                    
                                    object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, null, accountKey, function(response){
                                        
                                        if(response.mode == 'changeDay'){
                                            
                                            day = parseInt(response.day);
                                            
                                        }
                                        callback(response);
                            
                                    });
                                    
                                }
                                
                            });
                            
                        } else {
                            
                            object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, null, accountKey, function(response){
                                
                                if(response.mode == 'changeDay'){
                                    
                                    day = parseInt(response.day);
                                    
                                }
                                callback(response);
                    
                            });
                            
                        }
                        
                    }else{
                        
                        var nextButton = document.getElementById("nextButton");
                        nextButton.removeEventListener("check", null);
                        nextButton.classList.add("hidden_panel");
                        animationBool = true;
                        //object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList[parseInt(key)], null, accountKey, function(response){
                        object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, null, accountKey, function(response){
                            
                            if(response.mode == 'changeDay'){
                                
                                day = parseInt(response.day);
                                
                            }
                            callback(response);
                
                        });
                        
                    }
                    
                }
                
            }
            **/
            
            courseMainPanel.style.height = null;
            daysListPanel.style.height = null;
            var blockPanel = document.getElementById("blockPanel");
            /**
            console.log(courseMainPanel.getBoundingClientRect());
            console.log(daysListPanel.getBoundingClientRect());
            console.log(document.getElementById("daysListPanel").getBoundingClientRect());
            **/
            if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                
                blockPanel.style.height = 0 + "px";
                object.changeHeight(daysListPanel.getBoundingClientRect());
                
            }else{
                
                blockPanel.style.height = courseMainPanel.getBoundingClientRect().height - daysListPanel.getBoundingClientRect().height + "px";
                object.changeHeight(courseMainPanel.getBoundingClientRect());
                
            }
            
            var topPanel = document.getElementById("topPanel");
            daysListPanel.style.height = null;
            console.log("_headingPosition = " + object._headingPosition);
            if (object._headingPosition == 0) {
                
                
                
            } else {
                
                topPanel.style.top = object._top + "px";
                daysListPanel.style.top = (object._top + object._topPanelHeight) + "px";
                daysListPanel.classList.add("positionSticky");
                
            }
            
        }else{
            
            var services = null;
            if (object._calendarAccount.flowOfBooking == 'services') {
                
                services = object._courseList;
                for (var key in object._courseList) {
                    
                    
                    
                }
                
            }
            
            var topPanel = document.getElementById("topPanel");
            daysListPanel.style.height = null;
            console.log("_headingPosition = " + object._headingPosition);
            if (object._headingPosition == 0) {
                
                
                
            } else {
                
                topPanel.style.top = object._top + "px";
                daysListPanel.style.top = (object._top + object._topPanelHeight) + "px";
                daysListPanel.classList.add("positionSticky");
                
            }
            console.log(this._courseBool);
            object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, services, null, accountKey, function(response){
                        
                if(response.mode == 'changeDay'){
                    
                    day = parseInt(response.day);
                    
                }
                callback(response);
                
            });
            
        }
        
        
    }
    
    Booking_App.prototype.createServicesList = function(animationBool, checkBoxList, coursePanelList, courseMainPanel, callback) {
        
        var object = this;
        console.log(object._courseList);
        
        for (var i in object._courseList) {
            
            object._courseList[i].service = 1;
            object._courseList[i].selected = 0;
            object._courseList[i].selectedOptionsList = [];
            
        }
        
        
        var courseList = object._courseList;
        
        //var animationBool = true;
        //var checkBoxList = [];
        //var coursePanelList = [];
        for (var i in courseList) {
            
            var course = courseList[i];
            if (course.active != "true") {
                
                continue;
                
            }
            
            course["status"] = true;
            
            var coursePanel = document.createElement("div");
            coursePanel.setAttribute("data-key", i);
            coursePanel.setAttribute("data-status", 1);
            
            var courseNamePanel = document.createElement("span");
            if(typeof course["name"] == "string"){
                
                course["name"] = course["name"].replace(/\\/g, "");
                
            }
            courseNamePanel.textContent = course["name"];
            //coursePanel.appendChild(courseNamePanel);
            
            var checkBox = document.createElement("input");
            checkBox.setAttribute("data-key", i);
            checkBox.type = "checkbox";
            checkBox.value = "";
            //checkBox.disabled = true;
            
            checkBox.onclick = function() {
                
                if (this.checked == true) {
                    
                    this.checked = false;
                    
                } else {
                    
                    this.checked = true;
                    
                }
                
            };
            
            checkBoxList.push(checkBox);
            
            var label = document.createElement("span");
            label.appendChild(checkBox);
            label.appendChild(courseNamePanel);
            if(parseInt(object._calendarAccount.hasMultipleServices) == 0){
                
                checkBox.classList.add("hidden_panel");
                
            }
            coursePanel.appendChild(label);
            
            if(course.cost != null && course.cost != 0){
                
                var cost = object._format.formatCost(course.cost, object._currency);
                var courseCostPanel = document.createElement("span");
                courseCostPanel.classList.add("courseCostPanel");
                courseCostPanel.textContent = cost;
                coursePanel.appendChild(courseCostPanel);
                
            }
            
            if (course.description != null && course.description.length > 0) {
                
                var description = document.createElement("div");
                description.classList.add("descriptionOfService");
                description.textContent = course.description;
                coursePanel.appendChild(description);
                
            }
            
            var table_row = document.createElement("div");
            table_row.setAttribute("data-key", i);
            table_row.setAttribute("data-status", 1);
            table_row.classList.add("selectPanel");
            table_row.appendChild(coursePanel);
            
            coursePanelList.push(table_row);
            courseMainPanel.appendChild(table_row);
            
            table_row.onclick = function(){
                
            }
            
            callback(table_row);
            
        }
        
        return checkBoxList;
        
    };
    
    Booking_App.prototype.createOptions = function(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, course, accountKey, callback){
        
        
        console.log(course);
        var selectedOptions = [];
        var object = this;
        var calendarAccount = object._calendarAccount;
        var returnToCalendarButton = document.getElementById("returnToCalendarButton");
        var nextButton = document.getElementById("nextButton");
        var optionsMainPanel = document.getElementById("optionsMainPanel");
        //optionsMainPanel.setAttribute("class", "courseListPanel box_shadow");
        optionsMainPanel.classList.remove("hidden_panel");
        //optionsMainPanel.classList.add("courseListPanel");
        optionsMainPanel.classList.add("box_shadow");
        optionsMainPanel.style.top = null;
        optionsMainPanel.style.height = null;
        optionsMainPanel.textContent = null;
        console.log("class = " + optionsMainPanel.getAttribute("class"));
        if (object._headingPosition == 0) {
            
            optionsMainPanel.classList.add("courseListPanelNoAnimation");
            
        } else {
            
            optionsMainPanel.classList.add("courseListPanel");
            
        }
        
        scheduleMainPanel.classList.add("hidden_panel");
        returnToCalendarButton.classList.add("hidden_panel");
        nextButton.classList.remove("hidden_panel");
        document.getElementById("returnDayButton").classList.add("hidden_panel");
        document.getElementById("nextDayButtton").classList.add("hidden_panel");
        
        var topPanel = document.getElementById("topPanel");
        object._topPanelHeight = topPanel.clientHeight;
        
        var blockPanel = document.getElementById("blockPanel");
        /**
        if(optionsMainPanel.getBoundingClientRect().height < courseMainPanel.getBoundingClientRect().height){
            
            console.error("no change");
            blockPanel.style.height = 0 + "px";
            object.changeHeight(courseMainPanel.getBoundingClientRect());
            
        }else{
            
            
            blockPanel.style.height = optionsMainPanel.getBoundingClientRect().height - courseMainPanel.getBoundingClientRect().height + "px";
            console.error(blockPanel.style.height);
            object.changeHeight(optionsMainPanel.getBoundingClientRect());
            
        }
        **/
        var optionPanelList = [];
        var checkBoxList = [];
        var options = JSON.parse(course.options);
        for(var i = 0; i < options.length; i++){
            
            var option = options[i];
            option.selected = 0;
            selectedOptions.push(option);
            console.log(option);
            
            var titleLabel = document.createElement("span");
            titleLabel.textContent = option.name;
            
            var checkBox = document.createElement("input");
            checkBox.setAttribute("data-key", i);
            checkBox.type = "checkbox";
            checkBox.value = "";
            //checkBox.disabled = true;
            
            checkBox.onclick = function() {
                
                if (this.checked == true) {
                    
                    this.checked = false;
                    
                } else {
                    
                    this.checked = true;
                    
                }
                
            };
            
            checkBoxList.push(checkBox);
            
            var label = document.createElement("span");
            label.appendChild(checkBox);
            label.appendChild(titleLabel);
            if(parseInt(course.selectOptions) == 0){
                
                checkBox.classList.add("hidden_panel");
                
            }
            
            var optionPanel = document.createElement("div");
            optionPanel.setAttribute("data-key", i);
            optionPanel.appendChild(label);
            
            if(option.cost != null && option.cost != 0){
                
                var cost = object._format.formatCost(option.cost, object._currency);
                var optionCostPanel = document.createElement("span");
                optionCostPanel.classList.add("courseCostPanel");
                optionCostPanel.textContent = cost;
                optionPanel.appendChild(optionCostPanel);
                
            }
            
            optionPanelList.push(optionPanel);
            
            var table_row = document.createElement("div");
            table_row.setAttribute("data-key", i);
            table_row.appendChild(optionPanel);
            
            table_row.setAttribute("data-status", 1);
            table_row.setAttribute("class", "selectPanel");
            table_row.onclick = function(){
                
                /**
                if(document.getElementById("returnDayButton") != null && document.getElementById("nextDayButtton") != null){
                    
                    document.getElementById("returnDayButton").classList.add("hidden_panel");
                    document.getElementById("nextDayButtton").classList.add("hidden_panel");
                    document.getElementById("returnToDayListButton").classList.add("hidden_panel");
                    
                }else{
                    
                    document.getElementById("returnToCalendarButton").classList.add("hidden_panel");
                    
                }
                
                this.setAttribute("class", "selectPanel selectPanelActive");
                **/
                var key = parseInt(this.getAttribute("data-key"));
                var option = options[key];
                console.log(option);
                var checkBox = checkBoxList[key];
                if(checkBox.checked == true){
                    
                    checkBox.checked = false;
                    this.setAttribute("class", "selectPanel");
                    selectedOptions[key].selected = 0;
                    //delete(selectedOptions[key]);
                    
                }else{
                    
                    checkBox.checked = true;
                    this.setAttribute("class", "selectPanel selectPanelActive");
                    selectedOptions[key].selected = 1;
                    //selectedOptions[key] = option;
                    
                }
                
                console.log(selectedOptions);
                nextButton.disabled = true;
                nextButton.classList.add("hidden_panel");
                for(var i = 0; i < selectedOptions.length; i++){
                    
                    if(selectedOptions[i].selected == 1){
                        
                        if(parseInt(course.selectOptions) == 0){
                            
                            optionsMainPanel.classList.add("hidden_panel");
                            /**
                            object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, course, selectedOptions, accountKey, function(response){
                                
                                if(response.mode == 'changeDay'){
                                    
                                    day = parseInt(response.day);
                                    
                                }
                                callback(response);
                    
                            });
                            **/
                            callback({selectedOptions: selectedOptions, next: 1});
                            
                        }else{
                            
                            nextButton.disabled = false;
                            nextButton.classList.remove("hidden_panel");
                            callback({selectedOptions: selectedOptions, next: 0});
                            
                        }
                        
                        break;
                        
                    }
                    
                }
                
            }
            
            optionsMainPanel.appendChild(table_row);
            
        }
        
        /**
        optionsMainPanel.classList.add("postionCenterForScheduleListPanel");
        optionsMainPanel.addEventListener("animationend", function(event){
            
            var element = document.body;
            console.log(element);
            
        });
        **/
        
        if(optionsMainPanel.getBoundingClientRect().height < courseMainPanel.getBoundingClientRect().height){
            
            blockPanel.style.height = 0 + "px";
            object.changeHeight(courseMainPanel.getBoundingClientRect());
            
        }else{
            
            blockPanel.style.height = optionsMainPanel.getBoundingClientRect().height - courseMainPanel.getBoundingClientRect().height + "px";
            object.changeHeight(optionsMainPanel.getBoundingClientRect());
            
        }
        
        if (object._headingPosition == 1) {
            
            topPanel.style.top = object._top + "px";
            
        }
        
        object._animationend = true;
        
        console.log("animationBool = " + animationBool);
        console.log("class = " + optionsMainPanel.getAttribute("class"));
        if(animationBool === true){
            
            if (object._headingPosition == 0) {
                
                daysListPanel.classList.add("hidden_panel");
                optionsMainPanel.classList.add("postionCenterForScheduleListPanelNoAnimation");
                
            } else {
                
                animationBool = false;
                optionsMainPanel.classList.add("postionCenterForScheduleListPanel");
                optionsMainPanel.addEventListener("animationend", function(event){
                    
                    var element = document.body;
                    console.log(element);
                    
                });
                courseMainPanel.addEventListener("animationend", (function(){
                    
                    var timer = setInterval(function(){
                        
                        courseMainPanel.style.height = null;
                        
                        daysListPanel.classList.add("hidden_panel");
                        courseMainPanel.style.top = (object._top + object._topPanelHeight) + "px";
                        courseMainPanel.classList.add("positionSticky");
                        console.error("Time out");
                        
                        clearInterval(timer);
                        
                    }, 1000);
                    
                    return function x(){
                        
                        courseMainPanel.removeEventListener("animationend", x, false);
                        
                    }
                    
                })(), false);
                
            }
            
            
            
        }else{
            
            daysListPanel.classList.add("hidden_panel");
            courseMainPanel.style.height = null;
            if (object._headingPosition == 1) {
                
                courseMainPanel.classList.add("positionSticky");
                //courseMainPanel.style.top = (object._top + object._topPanelHeight) + "px";
                
            }
            
        }
        
        nextButton.disabled = true;
        nextButton.classList.add("hidden_panel");
        for(var i = 0; i < selectedOptions.length; i++){
            
            if(selectedOptions[i].selected == 1){
                
                nextButton.disabled = false;
                nextButton.classList.remove("hidden_panel");
                break;
                
            }
            
        }
        
        nextButton.removeEventListener("check", null);
        nextButton.onclick = function(){
            
            nextButton.classList.add("hidden_panel");
            optionsMainPanel.classList.add("hidden_panel");
            /**
            object.createSchedule(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, course, selectedOptions, accountKey, function(response){
                
                if(response.mode == 'changeDay'){
                    
                    day = parseInt(response.day);
                    
                }
                callback(response);
    
            });
            **/
            callback({selectedOptions: selectedOptions, next: 1});
            
        }
        
        var returnToDayListButton = document.getElementById("returnToDayListButton");
        returnToDayListButton.classList.remove("hidden_panel");
        returnToDayListButton.removeEventListener("click", null);
        returnToDayListButton.onclick = function(){
            
            courseMainPanel.style.top = null;
            courseMainPanel.classList.remove("positionSticky");
            
            daysListPanel.style.top = null;
            daysListPanel.style.height = null;
            if (object._headingPosition == 1) {
                
                daysListPanel.classList.add("positionSticky");
                
            }
            
            daysListPanel.classList.remove("hidden_panel");
            /**
            if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                
                console.log("daysListPanel");
                console.log(daysListPanel.getBoundingClientRect());
                object.changeHeight(daysListPanel.getBoundingClientRect());
                
            }else{
                
                console.log("courseMainPanel");
                object.changeHeight(courseMainPanel.getBoundingClientRect());
                
            }
            **/
            
            if(typeof courseMainPanel == 'object'){
                
                nextButton.classList.add("hidden_panel");
                courseMainPanel.classList.remove("postionLeftForCourseListPanel");
                courseMainPanel.classList.remove("postionLeftForCourseListPanelNoAnimation");
                courseMainPanel.classList.remove("positionSticky");
                courseMainPanel.classList.remove("postionDefaultForCourseListPanel");
                courseMainPanel.classList.remove("postionDefaultForCourseListPanelNoAnimation");
                courseMainPanel.classList.add("box_shadow");
                //courseMainPanel.classList.add("postionReturnForCourseListPanel");
                //courseMainPanel.setAttribute("class", "courseListPanel box_shadow postionDefaultForCourseListPanel");
                if (object._headingPosition == 0) {
                    
                    courseMainPanel.classList.add("postionReturnForCourseListPanelNoAnimation");
                    optionsMainPanel.setAttribute("class", "courseListPanelNoAnimation postionDefaultForScheduleListPanelNoAnimation hidden_panel");
                    if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                        
                        console.log("daysListPanel");
                        object.changeHeight(daysListPanel.getBoundingClientRect());
                        
                    }else{
                        
                        console.log("courseMainPanel");
                        object.changeHeight(courseMainPanel.getBoundingClientRect());
                        
                    }
                    
                } else {
                    
                    courseMainPanel.classList.add("postionReturnForCourseListPanel");
                    optionsMainPanel.setAttribute("class", "courseListPanel postionDefaultForScheduleListPanel");
                    if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                        
                        console.log("daysListPanel");
                        object.changeHeight(daysListPanel.getBoundingClientRect());
                        
                    }else{
                        
                        console.log("courseMainPanel");
                        object.changeHeight(courseMainPanel.getBoundingClientRect());
                        
                    }
                    optionsMainPanel.addEventListener("animationend", (function(){
                        
                        var timer = setInterval(function(){
                            
                            optionsMainPanel.classList.add("hidden_panel");
                            console.error("Time out");
                            
                            clearInterval(timer);
                            
                        }, 801);
                        
                        return function x(){
                            
                            optionsMainPanel.removeEventListener("animationend", x, false);
                            
                        }
                        
                    })(), false);
                    
                }
                
                
            }
            
            returnToDayListButton.classList.add("hidden_panel");
            returnToCalendarButton.classList.remove("hidden_panel");
            //optionsMainPanel.setAttribute("class", "courseListPanel postionDefaultForScheduleListPanel");
            
        }
        
        return animationBool
        
    }
    
    Booking_App.prototype.getTotalTimeInOptions = function(options){
        
        var totalTimeInOptions = 0;
        if (options != null) {
            
            for(var i = 0; i < options.length; i++) {
                
                var option = options[i];
                if (parseInt(option.selected) == 1) {
                    
                    totalTimeInOptions += parseInt(option.time);
                    
                }
                
            }
            
        }
        
        console.log("totalTimeInOptions = " + totalTimeInOptions);
        return totalTimeInOptions;
        
    }
    
    Booking_App.prototype.createSchedule = function(month, day, year, animationBool, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, selectedOptions, accountKey, callback){
        
        console.log("day = " + day);
        console.log(calendarData);
        console.log(courseList);
        console.log(selectedOptions);
        console.log("animationBool = " + animationBool);
        var serviceAndSchedulePanel = document.getElementById("booking-package_schedulePage");
        var object = this;
        var calendarKey = this._calendar.getDateKey(month, day, year);
        var calendarArray = Object.keys(calendarData.calendar);
        day = parseInt(day);
        var timeToProvide = [];
        /**
        if (course != null && course.timeToProvide != null) {
            
            timeToProvide = course.timeToProvide;
            
        }
        **/
        var course = null;
        var totalTimeInOptions = 0;
        if (object._courseBool == true) {
            
            course = false;
            
            for (var key in courseList) {
                
                if (courseList[key].selected == 1 && courseList[key].timeToProvide != null) {
                    
                    course = true;
                    timeToProvide.push(courseList[key].timeToProvide);
                    
                }
                
                if (courseList[key].selected == 1 && courseList[key].selectedOptionsList.length > 0) {
                    
                    totalTimeInOptions += object.getTotalTimeInOptions(courseList[key].selectedOptionsList);
                    
                }
                
            }
            console.log(timeToProvide);
            
        }
        
        
        
        /**
        if (course.timeToProvide != null && course.timeToProvide.length > 0) {
            
            timeToProvide = JSON.parse(course)
            
        }
        **/
        //var totalTimeInOptions = object.getTotalTimeInOptions(selectedOptions);
        console.log(calendarData.calendar[calendarKey]);
        var selectedDate = document.getElementById("selectedDate");
        selectedDate.textContent = object._calendar.formatBookingDate(month, day, year, null, null, null, calendarData.calendar[calendarKey].week);
        
        scheduleMainPanel.classList.remove("hidden_panel");
        scheduleMainPanel.classList.remove("postionDefaultForScheduleListPanel");
        scheduleMainPanel.classList.remove("postionDefaultForScheduleListPanelNoAnimation");
        scheduleMainPanel.style.top = null;
        scheduleMainPanel.style.height = null;
        scheduleMainPanel.textContent = null;
        
        var topPanel = document.getElementById("topPanel");
        object._topPanelHeight = topPanel.clientHeight;
        
        var blockPanel = document.getElementById("blockPanel");
        console.log(window.innerHeight);
        
        if(calendarData['schedule'][calendarKey].length == 0){
            
            var errorPanel = document.createElement("div");
            errorPanel.setAttribute("class", "noSchedule");
            errorPanel.textContent = object.i18n("No schedules");
            scheduleMainPanel.appendChild(errorPanel);
            
        }else if(calendarData['schedule'][calendarKey].length == 1){
            
            object.createForm(month, day, year, courseMainPanel, scheduleMainPanel, calendarData, courseList, calendarData['schedule'][calendarKey][0], selectedOptions, accountKey, function(response){
                
                console.log(response);
                if(response.mode == "return"){
                    /**
                    for(var i = 0; i < titleLabelList.length; i++){
                        
                        titleLabelList[i].classList.remove("hidden_panel");
                        
                    }
                    **/
                    console.log(course);
                    if(course == null){
                        
                        var schedulePage = document.getElementById("booking-package_schedulePage");
                        schedulePage.classList.add("hidden_panel");
                        
                        var calendarPage = document.getElementById("booking-package_calendarPage");
                        calendarPage.classList.remove("hidden_panel");
                        
                        if(document.getElementById("returnDayButton") != null && document.getElementById("nextDayButtton") != null){
                        
                            document.getElementById("returnDayButton").classList.remove("hidden_panel");
                            document.getElementById("nextDayButtton").classList.remove("hidden_panel");
                            if(returnToDayListButton != null){
                                
                                returnToDayListButton.classList.remove("hidden_panel");
                                
                            }
                            
                        }else{
                            
                            document.getElementById("returnToCalendarButton").classList.remove("hidden_panel");
                            
                        }
                        
                    }else{
                        
                        if (document.getElementById("returnDayButton") != null && document.getElementById("returnDayButton") != null && document.getElementById("returnToDayListButton") != null) {
                            
                            document.getElementById("returnToDayListButton").classList.add("hidden_panel");
                            document.getElementById("returnDayButton").classList.add("hidden_panel");
                            document.getElementById("nextDayButtton").classList.add("hidden_panel");
                            
                        }
                        
                        object.selectCourseAndSchedulePanel(month, day, year, calendarData, accountKey, callback);
                        object.setScrollY(serviceAndSchedulePanel);
                        
                    }
                    
                }else if(response.mode == "completed"){
                    
                    callback(response);
                    
                }
                
            });
            
            return null;
            
        }
        
        var calendarKey = object._calendar.getDateKey(month, day, year);
        console.log(object._nationalHoliday[calendarKey]);
        var nationalHoliday = false;
        if (object._nationalHoliday[calendarKey] != null && parseInt(object._nationalHoliday[calendarKey].status) == 1) {
            
            nationalHoliday = true;
            
        }
        
        for(var i = 0; i < calendarData['schedule'][calendarKey].length; i++){
            
            var schedule = calendarData['schedule'][calendarKey][i];
            schedule["select"] = true;
            if(parseInt(schedule["remainder"]) == 0 || schedule["stop"] == 'true'){
                
                schedule["select"] = false;
                
            }
            
            var week = parseInt(schedule.weekKey);
            var minutes = parseInt(schedule.hour) * 60;
            if (nationalHoliday == true) {
                
                week = 7;
                
            }
            
            for (var key in timeToProvide) {
                
                if (timeToProvide[key][week] != null && parseInt(timeToProvide[key][week][minutes]) == 0) {
                    
                    schedule["select"] = false;
                    
                }
                
            }
            /**
            if (timeToProvide[week] != null && parseInt(timeToProvide[week][minutes]) == 0) {
                
                schedule["select"] = false;
                
            }
            **/
        }
        
        if (course != null || object._preparationTime > 0) {
            
            var courseTime = 0;
            if (object._positionPreparationTime == 'before_after' || object._positionPreparationTime == 'after') {
                    
                    courseTime = object._preparationTime;
                    
            }
            
            if (course != null) {
                
                //courseTime += parseInt(course["time"]) + totalTimeInOptions;
                for (var key in courseList) {
                    
                    if (courseList[key].selected == 1) {
                        
                        courseTime += parseInt(courseList[key].time);
                        
                    }
                    
                }
                
                courseTime += totalTimeInOptions;
                
            }
            
            var afterPreparationTime = 0;
            if (object._positionPreparationTime == 'before_after' || object._positionPreparationTime == 'before') {
                    
                    afterPreparationTime = object._preparationTime;
                    
            }
            //var courseTime = parseInt(course["time"]) + totalTimeInOptions;
            console.log("courseTime = " + courseTime);
            for(var i = 0; i < calendarData['schedule'][calendarKey].length; i++){
                
                var schedule = calendarData['schedule'][calendarKey][i];
                if (parseInt(schedule["remainder"]) == 0 || schedule["stop"] == 'true') {
                    
                    schedule["select"] = false;
                    var rejectionTime = (parseInt(schedule["hour"]) * 60 + parseInt(schedule["min"])) - courseTime;
                    console.log("rejectionTime = " + rejectionTime);
                    
                    (function(schedule, key, courseTime, rejectionTime, afterPreparationTime, callback){
                        
                        console.log(key);
                        var stopUnixTime = parseInt(schedule[key].unixTime);
                        stopUnixTime += afterPreparationTime * 60;
                        console.log("stopUnixTime = " + stopUnixTime);
                        for(var i = 0; i < schedule.length; i++){
                            
                            var time = parseInt(schedule[i]["hour"]) * 60 + parseInt(schedule[i]["min"]);
                            if (time > rejectionTime && i < key) {
                                
                                console.log("i = " + i + " hour = " + schedule[i]["hour"] + " min = " + schedule[i]["min"]);
                                callback(i);
                                
                            } else if (parseInt(schedule[i].unixTime) <= stopUnixTime && i > key) {
                                
                                console.log("i = " + i + " hour = " + schedule[i]["hour"] + " min = " + schedule[i]["min"]);
                                callback(i);
                                
                            } else if (parseInt(schedule[i].unixTime) >= stopUnixTime) {
                                
                                break;
                                
                            }
                            /**
                            if(i == key){
                                
                                console.log("i = " + i + " hour = " + schedule[i]["hour"] + " min = " + schedule[i]["min"]);
                                break;
                                
                            }
                            **/
                        }
                        
                    })(calendarData['schedule'][calendarKey], i, courseTime, rejectionTime, afterPreparationTime, function(key){
                        
                        console.log("callback key = " + key);
                        calendarData['schedule'][calendarKey][key]["select"] = false;
                        
                    });
                    
                }
                
            }
            
        }
        
        var scheduleListPanel = [];
        var titleLabelList = []
        for(var i = 0; i < calendarData['schedule'][calendarKey].length; i++){
            
            var schedule = calendarData['schedule'][calendarKey][i];
            if(typeof schedule['title'] == "string"){
                
                schedule['title'] = schedule['title'].replace(/\\/g, "");
                
            }
            console.log(schedule);
            
            var timeLabel = document.createElement("span");
            timeLabel.textContent = ("0" + schedule["hour"]).slice(-2) + ":" + ("0" + schedule["min"]).slice(-2) + " ";
            
            var titleLabel = document.createElement("span");
            titleLabel.textContent = schedule['title'];
            
            var schedulePanel = document.createElement("div");
            schedulePanel.setAttribute("data-key", i);
            schedulePanel.setAttribute("data-month", schedule.month);
            schedulePanel.setAttribute("data-day", schedule.day);
            schedulePanel.setAttribute("data-year", schedule.year);
            schedulePanel.appendChild(timeLabel);
            schedulePanel.appendChild(titleLabel);
            
            if(parseInt(object._calendarAccount.displayRemainingCapacity) == 1){
                
                var displayRemainingCapacityLabel = document.createElement("span");
                displayRemainingCapacityLabel.classList.add("displayRemainingCapacityLabel");
                displayRemainingCapacityLabel.textContent = object._i18n.get("%s remaining", [schedule.remainder]);
                schedulePanel.appendChild(displayRemainingCapacityLabel);
                
            }
            
            var table_row = document.createElement("div");
            table_row.setAttribute("data-key", i);
            table_row.appendChild(schedulePanel);
            scheduleListPanel.push(table_row);
            titleLabelList.push(titleLabel);
            
            if(schedule["select"] === true){
                
                table_row.setAttribute("data-status", 1);
                table_row.setAttribute("class", "selectPanel");
                table_row.onclick = function(){
                    
                    if(document.getElementById("returnDayButton") != null && document.getElementById("nextDayButtton") != null){
                        
                        document.getElementById("returnDayButton").classList.add("hidden_panel");
                        document.getElementById("nextDayButtton").classList.add("hidden_panel");
                        document.getElementById("returnToDayListButton").classList.add("hidden_panel");
                        
                    }else{
                        
                        document.getElementById("returnToCalendarButton").classList.add("hidden_panel");
                        
                    }
                    
                    for(var i = 0; i < titleLabelList.length; i++){
                        
                        titleLabelList[i].classList.add("hidden_panel");
                        
                    }
                    
                    this.setAttribute("class", "selectPanel selectPanelActive");
                    var key = this.getAttribute("data-key");
                    var schedule = calendarData['schedule'][calendarKey][key];
                    object.unselectPanel(key, scheduleListPanel, "selectPanel");
                    console.log(courseList);
                    object.createForm(month, day, year, courseMainPanel, scheduleMainPanel, calendarData, courseList, schedule, selectedOptions, accountKey, function(response){
                        
                        if(response.mode == "return"){
                            
                            for(var i = 0; i < titleLabelList.length; i++){
                                
                                titleLabelList[i].classList.remove("hidden_panel");
                                
                            }
                            
                            if(document.getElementById("returnDayButton") != null && document.getElementById("nextDayButtton") != null){
                                
                                if(object._courseBool == true){
                                    
                                    document.getElementById("returnDayButton").classList.remove("hidden_panel");
                                    document.getElementById("nextDayButtton").classList.remove("hidden_panel");
                                    document.getElementById("returnToDayListButton").classList.remove("hidden_panel");
                                    
                                }
                                
                            }else{
                                
                                document.getElementById("returnToCalendarButton").classList.remove("hidden_panel");
                                
                            }
                            
                            object.setScrollY(serviceAndSchedulePanel);
                            
                        }else if(response.mode == "completed"){
                            
                            callback(response);
                            
                        }
                        
                    });
                    
                }
                
            }else{
                
                table_row.setAttribute("data-status", 0);
                table_row.setAttribute("class", "selectPanelError");
                
            }
            
            scheduleMainPanel.appendChild(table_row);
            
        }
        console.log(course);
        if(course != null && object._calendarAccount.flowOfBooking == 'calendar'){
            
            if (scheduleMainPanel.getBoundingClientRect().height < courseMainPanel.getBoundingClientRect().height) {
                
                blockPanel.style.height = 0 + "px";
                object.changeHeight(courseMainPanel.getBoundingClientRect());
                
            } else {
                
                blockPanel.style.height = scheduleMainPanel.getBoundingClientRect().height - courseMainPanel.getBoundingClientRect().height + "px";
                object.changeHeight(scheduleMainPanel.getBoundingClientRect());
                
            }
            
            if (object._headingPosition == 0) {
                
                scheduleMainPanel.classList.add("postionCenterForScheduleListPanelNoAnimation");
                
            } else {
                
                scheduleMainPanel.classList.add("postionCenterForScheduleListPanel");
                scheduleMainPanel.addEventListener("animationend", function(event){
                    
                    var element = document.body;
                    console.log(element);
                    
                });
                
            }
            
            if (object._headingPosition == 1) {
                
                topPanel.style.top = object._top + "px";
                
            }
            
            object._animationend = true;
            if(animationBool === true){
                
                //daysListPanel.classList.add("hidden_panel");
                if (object._headingPosition == 0) {
                    
                    daysListPanel.classList.add("hidden_panel");
                    
                } else {
                    
                    courseMainPanel.addEventListener("animationend", (function(){
                        
                        var timer = setInterval(function(){
                            
                            courseMainPanel.style.height = null;
                            
                            daysListPanel.classList.add("hidden_panel");
                            courseMainPanel.classList.add("positionSticky");
                            console.error("Time out");
                            
                            clearInterval(timer);
                            
                        }, 1000);
                        
                        return function x(){
                            
                            courseMainPanel.removeEventListener("animationend", x, false);
                            
                        }
                        
                    })(), false);
                    
                }
                
            }else{
                
                courseMainPanel.style.height = null;
                if (object._headingPosition == 1) {
                    
                    courseMainPanel.style.top = (object._top + object._topPanelHeight) + "px";
                    
                }
                
            }
            
        }else{
            
            console.log(daysListPanel.getBoundingClientRect());
            console.log(scheduleMainPanel.getBoundingClientRect());
            if(scheduleMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                
                
                blockPanel.style.height = 0 + "px";
                object.changeHeight(daysListPanel.getBoundingClientRect());
                console.log("zero = " + blockPanel.style.height);
                
            }else{
                
                
                blockPanel.style.height = scheduleMainPanel.getBoundingClientRect().height - daysListPanel.getBoundingClientRect().height + "px";
                object.changeHeight(scheduleMainPanel.getBoundingClientRect());
                console.log("up = " + blockPanel.style.height);
                
            }
            
            
            daysListPanel.style.height = null;
            if (object._headingPostition == 1) {
                
                topPanel.style.top = object._top + "px";
                daysListPanel.style.top = (object._top + object._topPanelHeight) + "px";
                daysListPanel.classList.add("positionSticky");
                
            } else {
                
                if(scheduleMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                    
                    blockPanel.style.height = 0 + "px";
                    
                } else {
                    
                    blockPanel.style.height = scheduleMainPanel.getBoundingClientRect().height - daysListPanel.getBoundingClientRect().height + "px";    
                
                }
                
            }
            
            
            if(document.getElementById("courseMainPanel") != null){
                
                document.getElementById("courseMainPanel").classList.add("hidden_panel");
                
            }
            
            scheduleMainPanel.classList.add("positionOfPanelNotHavingCourseForScheduleListPanel");
            
        }
        
        var changeDay = function(key){
            
            //bottomPanel.removeChild(returnDayButton);
            //bottomPanel.removeChild(nextDayButtton);
            
            console.log(weekDaysPanelList);
            for(var i = 0; i < weekDaysPanelList.length; i++){
                
                if(weekDaysPanelList[i].getAttribute("data-status") == 1){
                    
                    if(weekDaysPanelList[i].getAttribute("data-key") == key){
                        
                        weekDaysPanelList[i].classList.add("selectPanelActive");
                        
                    }else{
                        
                        weekDaysPanelList[i].classList.remove("selectPanelActive");
                        
                    }
                    
                }
                
            }
            
            var calendar = calendarData.calendar[calendarArray[key]];
            console.log(calendar);
            console.log("day = " + key);
            callback({mode: "changeDay", month: calendar.month, day: calendar.day, year: calendar.year});
            object.createSchedule(calendar.month, calendar.day, calendar.year, false, daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, calendarData, courseList, selectedOptions, accountKey, callback);
            
        }
        
        if(this._courseBool === true){
            
            var returnToCalendarButton = document.getElementById("returnToCalendarButton");
            returnToCalendarButton.classList.add("hidden_panel");
            
            var weekDaysList = object.getWeekDaysList();
            console.log(weekDaysList);
            var keys = Object.keys(weekDaysList);
            console.log(keys);
            var returnKey = null;
            var key = calendarData.calendar[calendarKey].number;
            console.log(key);
            console.log(calendarArray);
            if(weekDaysList[key - 1] == null){
                
                returnKey = keys[keys.length - 1];
                for(var i = keys.length; i >= 0; i--){
                    
                    if(key > keys[i]){
                        
                        var calendar = calendarData.calendar[calendarArray[keys[i]]];
                        console.log(calendar);
                        returnKey = parseInt(calendar.number);
                        //returnKey = calendarArray[keys[i]];
                        break;
                        
                    }
                    
                }
                
            }else{
                
                returnKey = parseInt(key) - 1;
                
            }
            console.log("returnKey = " + returnKey);
            
            var nextKey = null;
            if(weekDaysList[key + 1] == null){
                
                nextKey = keys[0];
                for(var i = 0; i < keys.length; i++){
                    
                    if(key < keys[i]){
                        
                        var calendar = calendarData.calendar[calendarArray[keys[i]]];
                        console.log(calendar);
                        nextKey = parseInt(calendar.number);
                        //nextKey = calendarArray[keys[i]];
                        break;
                        
                    }
                    
                }
                
            }else{
                
                nextKey = parseInt(key) + 1;
                
            }
            console.log("nextKey = " + nextKey);
            
            var leftButtonPanel = document.getElementById("leftButtonPanel");
            var bottomPanel = document.getElementById("bottomPanel");
            var rightButtonPanel = document.getElementById("rightButtonPanel");
            
            /**
            var returnToDayListButton = document.createElement("button");
            if(document.getElementById("returnToDayListButton") != null){
                
                returnToDayListButton = document.getElementById("returnToDayListButton");
                if(returnToDayListButton.event != null){
                    
                    returnToDayListButton.removeEventListener("click", null);
                    
                }
                
            }else{
                
                bottomPanel.appendChild(returnToDayListButton);
                
            }
            
            returnToDayListButton.id = "returnToDayListButton";
            **/
            var returnToDayListButton = document.getElementById("returnToDayListButton");
            //returnToDayListButton.textContent = object.i18n("Return");
            returnToDayListButton.classList.remove("hidden_panel");
            if(returnToDayListButton.event != null){
                
                returnToDayListButton.removeEventListener("click", null);
                
            }
            
            returnToDayListButton.onclick = function(){
                
                
                console.log("returnToDayListButton");
                object.returnToDayList(daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, course);
                returnToDayListButton.classList.add("hidden_panel");
                returnToCalendarButton.classList.remove("hidden_panel");
                object.setScrollY(serviceAndSchedulePanel);
                /**
                object.changeHeight(null);
                if(course != null){
                    
                    document.getElementById("returnDayButton").classList.add("hidden_panel");
                    document.getElementById("nextDayButtton").classList.add("hidden_panel");
                    //courseMainPanel.removeEventListener("animationend", event);
                    courseMainPanel.style.top = null;
                    courseMainPanel.classList.remove("positionSticky");
                    
                    daysListPanel.style.top = null;
                    daysListPanel.style.height = null;
                    if (object._headingPosition == 1) {
                        
                        daysListPanel.classList.add("positionSticky");
                        
                    }
                    
                }
                
                returnToDayListButton.classList.add("hidden_panel");
                returnToCalendarButton.classList.remove("hidden_panel");
                
                console.log(typeof courseMainPanel);
                if(typeof courseMainPanel == 'object'){
                    
                    courseMainPanel.classList.remove("postionLeftForCourseListPanel");
                    courseMainPanel.classList.remove("postionLeftForCourseListPanelNoAnimation");
                    courseMainPanel.classList.remove("positionSticky");
                    courseMainPanel.classList.remove("postionDefaultForCourseListPanel");
                    courseMainPanel.classList.remove("postionDefaultForCourseListPanelNoAnimation");
                    courseMainPanel.classList.add("box_shadow");
                    //courseMainPanel.classList.add("postionReturnForCourseListPanel");
                    //courseMainPanel.setAttribute("class", "courseListPanel box_shadow postionDefaultForCourseListPanel");
                    
                    if (object._headingPosition == 0) {
                        
                        daysListPanel.classList.remove("hidden_panel");
                        scheduleMainPanel.classList.add("hidden_panel");
                        scheduleMainPanel.setAttribute("class", "courseListPanelNoAnimation postionDefaultForScheduleListPanelNoAnimation hidden_panel");
                        if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                            
                            console.log("daysListPanel");
                            object.changeHeight(daysListPanel.getBoundingClientRect());
                            
                        }else{
                            
                            console.log("courseMainPanel");
                            object.changeHeight(courseMainPanel.getBoundingClientRect());
                            
                        }
                        
                    } else {
                        
                        courseMainPanel.classList.add("postionReturnForCourseListPanel");
                        daysListPanel.classList.remove("hidden_panel");
                        if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                            
                            console.log("daysListPanel");
                            object.changeHeight(daysListPanel.getBoundingClientRect());
                            
                        }else{
                            
                            console.log("courseMainPanel");
                            object.changeHeight(courseMainPanel.getBoundingClientRect());
                            
                        }
                        
                        courseMainPanel.addEventListener("animationend", (function(){
                            
                            var timer = setInterval(function(){
                                
                                scheduleMainPanel.classList.add("hidden_panel");
                                console.error("Time out");
                                
                                clearInterval(timer);
                                
                            }, 801);
                            
                            return function x(){
                                
                                courseMainPanel.removeEventListener("animationend", x, false);
                                
                            }
                            
                        })(), false);
                        
                        scheduleMainPanel.setAttribute("class", "courseListPanel postionDefaultForScheduleListPanel");
                        
                    }
                
                    
                }
                
                object.setScrollY(document.getElementById("booking-package_schedulePage"));
                //scheduleMainPanel.setAttribute("class", "courseListPanel postionDefaultForScheduleListPanel");
                if (object._headingPosition == 0) {
                    
                    scheduleMainPanel.classList.add("headingPosition");
                    
                }
                
                **/
                
            }
            
            /**
            var returnDayButton = document.createElement("button");
            if(document.getElementById("returnDayButton") != null){
                
                returnDayButton = document.getElementById("returnDayButton");
                if(returnDayButton.event != null){
                    
                    returnDayButton.removeEventListener("click", null);
                    
                }
                
            }else{
                
                bottomPanel.appendChild(returnDayButton);
                //leftButtonPanel.appendChild(returnDayButton);
                
            }
            
            console.log("returnDayButton = " + weekDaysList[returnKey]);
            console.log(returnKey);
            console.log(weekDaysList);
            
            returnDayButton.id = "returnDayButton";
            **/
            var returnDayButton = document.getElementById("returnDayButton");
            returnDayButton.classList.remove("hidden_panel");
            returnDayButton.setAttribute("date-key", returnKey);
            returnDayButton.textContent = weekDaysList[returnKey];
            returnDayButton.classList.add("returnDayButton");
            returnDayButton.onclick = function(){
                
                object.setScrollY(serviceAndSchedulePanel);
                var key = parseInt(this.getAttribute("date-key"));
                changeDay(key);
                
            }
            
            /**
            console.log(nextDayButtton);
            var nextDayButtton = document.createElement("button");
            if(document.getElementById("nextDayButtton") != null){
                
                nextDayButtton = document.getElementById("nextDayButtton");
                nextDayButtton.removeEventListener("click", null);
                
            }else{
                
                bottomPanel.appendChild(nextDayButtton);
                //rightButtonPanel.appendChild(nextDayButtton);
                
            }
            
            console.log("nextDayButtton = " + weekDaysList[nextKey]);
            console.log(nextKey);
            console.log(weekDaysList);
            
            nextDayButtton.id = "nextDayButtton";
            **/
            var nextDayButtton = document.getElementById("nextDayButtton");
            nextDayButtton.classList.remove("hidden_panel");
            nextDayButtton.setAttribute("date-key", nextKey);
            nextDayButtton.textContent = weekDaysList[nextKey];
            nextDayButtton.classList.add("nextDayButtton");
            nextDayButtton.onclick = function(){
                
                object.setScrollY(serviceAndSchedulePanel);
                var key = parseInt(this.getAttribute("date-key"));
                changeDay(key);
                
            }
            
        }else{
            
            document.getElementById("returnDayButton").classList.add("hidden_panel");
            document.getElementById("nextDayButtton").classList.add("hidden_panel");
            
        }
        
        return scheduleMainPanel;
    
    }
    
    Booking_App.prototype.returnToDayList = function(daysListPanel, courseMainPanel, scheduleMainPanel, weekDaysPanelList, course) {
        
        var object = this;
        object.changeHeight(null);
        if(course != null){
            
            document.getElementById("returnDayButton").classList.add("hidden_panel");
            document.getElementById("nextDayButtton").classList.add("hidden_panel");
            //courseMainPanel.removeEventListener("animationend", event);
            courseMainPanel.style.top = null;
            courseMainPanel.classList.remove("positionSticky");
            
            daysListPanel.style.top = null;
            daysListPanel.style.height = null;
            if (object._headingPosition == 1) {
                
                daysListPanel.classList.add("positionSticky");
                
            }
            
        }
        
        
        
        console.log(typeof courseMainPanel);
        if(typeof courseMainPanel == 'object'){
            
            courseMainPanel.classList.remove("postionLeftForCourseListPanel");
            courseMainPanel.classList.remove("postionLeftForCourseListPanelNoAnimation");
            courseMainPanel.classList.remove("positionSticky");
            courseMainPanel.classList.remove("postionDefaultForCourseListPanel");
            courseMainPanel.classList.remove("postionDefaultForCourseListPanelNoAnimation");
            courseMainPanel.classList.add("box_shadow");
            //courseMainPanel.classList.add("postionReturnForCourseListPanel");
            //courseMainPanel.setAttribute("class", "courseListPanel box_shadow postionDefaultForCourseListPanel");
            
            if (object._headingPosition == 0) {
                
                daysListPanel.classList.remove("hidden_panel");
                scheduleMainPanel.classList.add("hidden_panel");
                scheduleMainPanel.setAttribute("class", "courseListPanelNoAnimation postionDefaultForScheduleListPanelNoAnimation hidden_panel");
                if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                    
                    console.log("daysListPanel");
                    object.changeHeight(daysListPanel.getBoundingClientRect());
                    
                }else{
                    
                    console.log("courseMainPanel");
                    object.changeHeight(courseMainPanel.getBoundingClientRect());
                    
                }
                
            } else {
                
                courseMainPanel.classList.add("postionReturnForCourseListPanel");
                daysListPanel.classList.remove("hidden_panel");
                if(courseMainPanel.getBoundingClientRect().height < daysListPanel.getBoundingClientRect().height){
                    
                    console.log("daysListPanel");
                    object.changeHeight(daysListPanel.getBoundingClientRect());
                    
                }else{
                    
                    console.log("courseMainPanel");
                    object.changeHeight(courseMainPanel.getBoundingClientRect());
                    
                }
                
                courseMainPanel.addEventListener("animationend", (function(){
                    
                    var timer = setInterval(function(){
                        
                        scheduleMainPanel.classList.add("hidden_panel");
                        console.error("Time out");
                        
                        clearInterval(timer);
                        
                    }, 801);
                    
                    return function x(){
                        
                        courseMainPanel.removeEventListener("animationend", x, false);
                        
                    }
                    
                })(), false);
                
                scheduleMainPanel.setAttribute("class", "courseListPanel postionDefaultForScheduleListPanel");
                
            }
        
            
        }
        
        object.setScrollY(document.getElementById("booking-package_schedulePage"));
        //scheduleMainPanel.setAttribute("class", "courseListPanel postionDefaultForScheduleListPanel");
        if (object._headingPosition == 0) {
            
            scheduleMainPanel.classList.add("headingPosition");
            
        }
        
    }
    
    Booking_App.prototype.createForm = function(month, day, year, courseMainPanel, scheduleMainPanel, calendarData, courseList, schedule, selectedOptions, accountKey, callback){
        
        console.log("accountKey = " + accountKey);
        console.log(schedule);
        console.log(courseList);
        if(this.getInputData() == null){
            
            this.initInputData();
            
        }
        console.log(this.getInputData());
        
        var object = this;
        object.setStep("inputPage");
        console.log(object._userInformation);
        var top = 0;
        var calendarKey = object._calendar.getDateKey(month, day, year);
        console.log(schedule);
        
        var calendarAccount = this._calendarAccount;
        console.log(calendarAccount);
        console.log(selectedOptions);
        
        var totalTimeInOptions = object.getTotalTimeInOptions(selectedOptions);
        
        /**
        var formMainPanel = document.getElementById("formMainPanel");
        formMainPanel.textContent = null;
        formMainPanel.setAttribute("class", "courseListPanel box_shadow positionCenterFormPanel");
        
        if(course != null){
            
            scheduleMainPanel.setAttribute("class", "courseListPanel postionLeftZeroForScheduleListPanel");
            
        }else{
            
            scheduleMainPanel.setAttribute("class", "courseListPanel positionOfNextPanelNotHavingCourseForScheduleListPanel");
            
        }
        
        var formPanel = document.createElement("div");
        formPanel.id = "inputFormPanel";
        formMainPanel.appendChild(formPanel);
        **/
        
        //document.scrollTop = object._top;
        
        var body = object._body;
        body.classList.remove("scrollBlock");
        
        var schedulePage = document.getElementById("booking-package_schedulePage");
        schedulePage.classList.add("hidden_panel");
        
        var formPanel = document.getElementById("booking-package_inputFormPanel");
        formPanel.textContent = null;
        
        
        var topBarPanel = document.createElement("div");
        topBarPanel.id = "reservationHeader";
        topBarPanel.classList.add("selectedDate");
        topBarPanel.textContent = object.i18n("Please fill in your details");
        formPanel.appendChild(topBarPanel);
        
        if (object._headingPosition == 1) {
            
            topBarPanel.style.top = object._top + "px";
            
        }
        
        var totalCost = 0;
        var goodsList = [];
        if(calendarAccount.type == 'day'){
            
            formPanel.classList.remove("hidden_panel");
            var date = object._calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, schedule.hour, schedule.min, schedule.title, schedule.weekKey);
            var rowPanel = object.createRowPanel(object._i18n.get("Booking Date"), date, null, null, null);
            formPanel.appendChild(rowPanel);
            top += parseInt(rowPanel.clientHeight);
            
            
            totalCost = parseInt(schedule.cost);
            var course = null;
            /**
            for (var key in courseList) {
                
                if (courseList[key].selected == 1) {
                    
                    course = true;
                    var goods = {label: courseList[key].name, amount: parseInt(courseList[key].cost)};
                    goodsList.push(goods);
                    totalCost += parseInt(courseList[key].cost);
                    
                    if (parseInt(courseList[key].cost) > 0) {
                        
                        courseCostPanel = document.createElement("span");
                        courseCostPanel.classList.add("planPrice");
                        courseCostPanel.textContent = object._format.formatCost(courseList[key].cost, object._currency);
                        
                    }
                    
                }
                
            }
            **/
            //if(course != null){
            if (object._courseBool == true || object._calendarAccount.flowOfBooking == 'services') {
                
                /**
                var courseCostPanel = null;
                if(course.cost != null){
                    
                    var goods = {label: course.name, amount: parseInt(course.cost)};
                    goodsList.push(goods);
                    totalCost += parseInt(course.cost);
                    
                    if (parseInt(course.cost) > 0) {
                        
                        courseCostPanel = document.createElement("span");
                        courseCostPanel.classList.add("planPrice");
                        courseCostPanel.textContent = object._format.formatCost(course.cost, object._currency);
                        
                    }
                    
                    
                }
                **/
                
                //var rowPanel = object.createRowPanel(object._courseName, course.name, null, null, null);
                var rowPanel = object.createRowPanel(object._courseName, "", null, null, null);
                var valuePanel = rowPanel.getElementsByClassName("value")[0];
                valuePanel.textContent = null;
                
                var coursePanel = document.createElement("div");
                coursePanel.classList.add("mainPlan");
                valuePanel.appendChild(coursePanel);
                
                var response = object.selectedServicesPanel(course, courseList, goodsList, totalCost, coursePanel);
                course = response.course;
                goodsList = response.goodsList;
                totalCost = response.totalCost;
                /**
                for (var key in courseList) {
                    
                    if (courseList[key].selected == 1) {
                        
                        course = true;
                        var courseCostPanel = null;
                        var goods = {label: courseList[key].name, amount: parseInt(courseList[key].cost)};
                        goodsList.push(goods);
                        totalCost += parseInt(courseList[key].cost);
                        
                        if (parseInt(courseList[key].cost) > 0) {
                            
                            courseCostPanel = document.createElement("span");
                            courseCostPanel.classList.add("planPrice");
                            courseCostPanel.textContent = object._format.formatCost(courseList[key].cost, object._currency);
                            
                        }
                        
                        var courseLinePanel = document.createElement("div");
                        courseLinePanel.classList.add("courseLinePanel");
                        coursePanel.appendChild(courseLinePanel);
                        
                        var courseNamePanel = document.createElement("span");
                        courseNamePanel.classList.add("planName");
                        courseNamePanel.textContent = courseList[key].name;
                        courseLinePanel.appendChild(courseNamePanel);
                        if (courseCostPanel != null) {
                            
                            courseLinePanel.appendChild(courseCostPanel);
                            
                        }
                        
                        var selectedOptions = courseList[key].selectedOptionsList;
                        if (selectedOptions != null && selectedOptions.length > 0) {
                            
                            var ul = document.createElement("ul");
                            coursePanel.appendChild(ul);
                            
                            for(var i = 0; i < selectedOptions.length; i++){
                                
                                var option = selectedOptions[i];
                                console.log(option);
                                if (parseInt(option.selected) == 1) {
                                    
                                    var goods = {label: option.name, amount: parseInt(option.cost)};
                                    goodsList.push(goods);
                                    totalCost += parseInt(option.cost);
                                    
                                    var optionNamePanel = document.createElement("span");
                                    optionNamePanel.classList.add("planName");
                                    optionNamePanel.textContent = option.name;
                                    
                                    var optionPricePanel = document.createElement("span");
                                    optionPricePanel.classList.add("planPrice");
                                    if (parseInt(option.cost) > 0) {
                                        
                                        optionPricePanel.textContent = object._format.formatCost(option.cost, object._currency);
                                        
                                    }
                                    
                                    var li = document.createElement("li");
                                    li.appendChild(optionNamePanel);
                                    li.appendChild(optionPricePanel);
                                    ul.appendChild(li);
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                **/
                console.log(goodsList);
                
                formPanel.appendChild(rowPanel);
                top += parseInt(rowPanel.clientHeight);
                
            }
            
            var surchargePanel = object.createRowPanel("Surcharge", "", null, null, null);
            surchargePanel.id = "surchargeTaxTitle";
            var taxePanel = object.createRowPanel("Tax", "", null, null, null);
            
            var taxes = new TAXES(object._i18n, object._currency);
            taxes.setTaxes(object._taxes);
            taxes.taxesDetails(totalCost, formPanel, surchargePanel, taxePanel);
            var responseTaxes = taxes.getTaxes();
            for (var key in responseTaxes) {
                
                var tax = responseTaxes[key];
                if (tax.active != 'true') {
                    
                    continue;
                    
                }
                
                if ((tax.type == 'tax' && tax.tax == 'tax_exclusive') || tax.type == 'surcharge') {
                    
                    totalCost += parseInt(tax.taxValue);
                    var goods = {label: tax.name, amount: parseInt(tax.taxValue)};
                    goodsList.push(goods);
                    
                }
                
            }
            
            
            console.log("totalCost = " + totalCost);
            if(totalCost != 0){
                
                var formatPrice = object._format.formatCost(totalCost, object._currency);
                var rowPanel = object.createRowPanel(this._i18n.get("Total amount"), formatPrice, null, null, null);
                rowPanel.classList.add("total_amount");
                formPanel.appendChild(rowPanel);
                top += parseInt(rowPanel.clientHeight);
                
            }
            
        }else{
            
            topBarPanel.textContent = object.i18n("Please fill in your details");
            
            var hotelDetails = object._hotel.verifySchedule(true);
            console.log(hotelDetails);
            totalCost = hotelDetails.amount + (hotelDetails.additionalFee * hotelDetails.nights);
            
            var amount = {label: this._i18n.get("Accommodation fees"), amount: parseInt(hotelDetails.amount)};
            var additionalFee = {label: this._i18n.get("Additional fees"), amount: parseInt(hotelDetails.additionalFee * hotelDetails.nights)};
            goodsList.push(amount);
            goodsList.push(additionalFee);
            for (var key in hotelDetails.taxes) {
                
                var tax = hotelDetails.taxes[key];
                if ((tax.type == 'tax' && tax.tax == 'tax_exclusive') || tax.type == 'surcharge') {
                    
                    goodsList.push({label: tax.name, amount: parseInt(tax.taxValue)});
                    
                }
                
            }
            console.log("totalCost = " + totalCost);
            object.setScrollY(document.getElementById("booking-package_durationStay"));
            //callback({mode: "top", top: object._top});
            
        }
        
        
        
        var formPanelList = {};
        //var inputData = {};
        var inputData = object.getInputData();
        var input = new Input();
        input.setUserInformation(object._userInformation);
        input.setPrefix(object._prefix);
        var formData = object._formData;
        for(var i = 0; i < formData.length; i++){
            
            if(formData[i].active != 'true'){
                
                continue;
                
            }
            
            if(typeof formData[i]['name'] == "string"){
                
                formData[i]['name'] = formData[i]['name'].replace(/\\/g, "");
                
            }
            
            var name = formData[i].name;
            if (formData[i].uri != null && formData[i].uri.length > 0) {
                
                name = document.createElement("a");
                name.target = "_blank";
                name.href = formData[i].uri;
                name.textContent = formData[i].name;
                console.log(typeof name);
                
            }
            
            console.log(inputData);
            
            var value = input.createInput(i, formData[i], inputData, null);
            var rowPanel = object.createRowPanel(name, value, formData[i].id, formData[i].required, null);
            
            formPanelList[i] = rowPanel;
            formPanel.appendChild(rowPanel);
            
            /**
            rowPanel.classList.remove("row");
            var filedPanel = document.createElement("div");
            filedPanel.classList.add("row");
    		filedPanel.id = object._prefix + "group_" + formData[i].id;
    		filedPanel.appendChild(rowPanel);
            
            formPanelList[i] = filedPanel;
            formPanel.appendChild(filedPanel);
            **/
            
        }
        
        console.log(object._paymentMethod);
        var paymentMethod = object._paymentMethod;
        if (totalCost == 0) {
            
            paymentMethod = ['locally'];
            
        }
        
        if (paymentMethod.length > 1) {
            
            var paymentEvent = function(payment) {
                
                var key = parseInt(payment.getAttribute("data-value"));
                console.log(paymentMethod[key]);
                var idList = ["booking-package_pay_locally", "booking-package_pay_with_paypal", "booking-package_pay_with_stripe"]
                for (var i = 0; i < idList.length; i++) {
                    
                    var id = idList[i];
                    if (document.getElementById(id) != null) {
                        
                        document.getElementById(id).classList.add("hidden_panel");
                        
                    }
                    
                }
                
                if (paymentMethod[key] == 'locally') {
                    
                    document.getElementById("booking-package_pay_locally").classList.remove("hidden_panel");
                    
                } else if (paymentMethod[key] == 'stripe' && document.getElementById("booking-package_pay_with_stripe") != null) {
                    
                    
                    document.getElementById("booking-package_pay_with_stripe").classList.remove("hidden_panel");
                    
                } else if (paymentMethod[key] == 'paypal' && document.getElementById("booking-package_pay_with_paypal") != null) {
                    
                    document.getElementById("booking-package_pay_with_paypal").classList.remove("hidden_panel");
                    
                }
                
            };
            
            var paymentData = {id: "paymentMethod", type: "RADIO", active: "true", name: object._i18n.get("Select payment method"), options: paymentMethod.join(","), value: ""};
            var value = input.createInput("paymentMethod", paymentData, [], paymentEvent);
            var paymentMethodPanel = object.createRowPanel(object._i18n.get("Select payment method"), value, "paymentMethod", "true", null);
            paymentMethodPanel.id = "booking-package_paymentMethod";
            formPanel.appendChild(paymentMethodPanel);
            
            var paymentMethodList = document.getElementById("booking_package_input_paymentMethod");
            var paymentRadios = paymentMethodList.getElementsByTagName("input");
            var paymentSpans = paymentMethodList.getElementsByClassName("radio_title");
            for (var i = 0; i < paymentRadios.length; i++) {
                
                if (paymentRadios[i].value == 'locally') {
                    
                    paymentSpans[i].classList.add("locally");
                    paymentSpans[i].textContent = object._i18n.get("I will pay locally");
                    
                } else if (paymentRadios[i].value == 'stripe') {
                    
                    paymentSpans[i].classList.add("stripe");
                    paymentSpans[i].textContent = object._i18n.get("Pay with Credit Card");
                    
                } else {
                    
                    paymentSpans[i].classList.add("paypal");
                    paymentSpans[i].textContent = object._i18n.get("Pay with PayPal");
                    
                }
                
            }
            
            
        }
        
        
        var cartPanel = document.createElement("div");
        cartPanel.id = "paymentPanel";
        cartPanel.classList.add("cartPanel");
        formPanel.appendChild(cartPanel);
        if((this._stripe_active == 1 || this._paypal_active == 1) && totalCost != 0){
            
            /** Stripe and PayPal **/
            
            object.paymentPanel(object._stripe_public_key, object._paypal_client_id, object._paypal_mode, object._country, object._currency, cartPanel, goodsList, calendarData, schedule, course, formData, formPanelList, inputData, selectedOptions, function(paymentResponse){
                
                console.log("paymentResponse.paymentName = " + paymentResponse.paymentName);
                console.log(paymentResponse);
                var token = null;
                
                if(paymentResponse.paymentName == 'stripe'){
                    
                    if(paymentResponse.complete != null && typeof paymentResponse.complete == 'function'){
                        
                        token = paymentResponse.token.id;
                        
                    }else{
                        
                        token = paymentResponse.token.id;
                        
                    }
                    
                }else if(paymentResponse.paymentName == 'paypal'){
                    
                    //token = paymentResponse.orderID;
                    token = paymentResponse.id;
                    
                }
                
                
                
                object.sendBooking(object._url, object._nonce, object._action, "sendBooking", true, paymentResponse.paymentName, token, calendarData, schedule, courseList, formData, formPanelList, inputData, selectedOptions, accountKey, function(response){
                    
                    console.log(response);
                    if(response === false){
                        
                        if(paymentResponse.paymentName == 'stripe' && paymentResponse.complete != null && typeof paymentResponse.complete == 'function'){
                            
                            paymentResponse.complete('fail');
                            
                        }
                        
                    }else{
                        
                        if(paymentResponse.paymentName == 'stripe' && paymentResponse.complete != null && typeof paymentResponse.complete == 'function'){
                            
                            paymentResponse.complete('success');
                            
                        }
                        
                        formPanel.removeChild(cartPanel);
                        reservationCompleted(response, accountKey);
                        
                    }
                    
                });
                
            });
            /** Stripe **/
            
        }
        
        //else{
            
            var bookingButton = document.createElement("button");
            bookingButton.classList.add("returnButton");
            bookingButton.classList.add("bookingButton");
            bookingButton.textContent = object.i18n("Book now");
            
            var bookingButtonPanel = document.createElement("div");
            bookingButtonPanel.id = "booking-package_pay_locally";
            bookingButtonPanel.classList.add("bottomBarPanel");
            bookingButtonPanel.classList.add("hidden_panel");
            bookingButtonPanel.appendChild(bookingButton);
            cartPanel.appendChild(bookingButtonPanel);
            
            bookingButton.onclick = function(){
                
                bookingButton.disabled = true;
                object.sendBooking(object._url, object._nonce, object._action, "sendBooking", true, null, null, calendarData, schedule, courseList, formData, formPanelList, inputData, selectedOptions, accountKey, function(response){
                    
                    if(response === false){
                        
                        bookingButton.disabled = false;
                        
                    }else{
                        
                        cartPanel.removeChild(bookingButtonPanel);
                        reservationCompleted(response, accountKey);
                        
                    }
                    
                });
                
            }
            
        //}
        
        object.setInputData(inputData);
        
        
        
        if (paymentMethod[0] == 'locally') {
            
            console.log(bookingButtonPanel);
            bookingButtonPanel.classList.remove("hidden_panel");
            
        } else if (paymentMethod[0] == 'stripe' && document.getElementById("booking-package_pay_with_stripe") != null) {
            
            document.getElementById("booking-package_pay_with_stripe").classList.remove("hidden_panel");
            
        } else if (paymentMethod[0] == 'paypal' && document.getElementById("booking-package_pay_with_paypal") != null) {
            
            document.getElementById("booking-package_pay_with_paypal").classList.remove("hidden_panel");
            
        }
        
        
        var bottomBarPanel = document.createElement("div");
        bottomBarPanel.classList.add("bottomBarPanel");
        formPanel.appendChild(bottomBarPanel);
        
        var returnButton = document.createElement("button");
        returnButton.id = "returnToSchedules";
        returnButton.classList.add("returnButton")
        returnButton.textContent = object.i18n("Return to schedules");
        if(calendarAccount.type == "hotel"){
            
            returnButton.textContent = object.i18n("Return to calendar");
            
        }
        bottomBarPanel.appendChild(returnButton);
        
        returnButton.onclick = function(){
            
            object.setScrollY(formPanel);
            object.setStep("topPage");
            if(calendarAccount.type == "day"){
                
                schedulePage.classList.remove("hidden_panel");
                schedulePage.scrollIntoView();
                formPanel.classList.add("hidden_panel");
                callback({mode: "return"});
                
            }else{
                
                callback({mode: "return"});
                
            }
            
            
        }
        
        var reservationCompleted = function(response, accountKey){
            
            console.log("accountKey = " + accountKey);
            if (object._calendarAccount.thanksPage != null) {
                
                //formPanel.classList.add("hidden_panel");
                //document.getElementById("booking-package_thanksPage").classList.remove("hidden_panel");
                
                formPanel.insertAdjacentHTML("afterbegin", object._thanksPage);
                
            }
            
            returnButton.textContent = object.i18n("Return to calendar");
            returnButton.removeEventListener("click", null);
            document.getElementById("daysListPanel").setAttribute("style", "");
            document.getElementById("scheduleMainPanel").setAttribute("style", "");
            document.getElementById("courseMainPanel").setAttribute("style", "");
            document.getElementById("blockPanel").setAttribute("style", "");
            returnButton.onclick = function(){
                
                object.setScrollY(formPanel);
                console.log("click");
                callback(response);
                document.getElementById("booking-package_calendarPage").classList.remove("hidden_panel");
                formPanel.classList.add("hidden_panel");
                
            }
            
            topBarPanel.textContent = object.i18n("Booking Completed");
            topBarPanel.classList.add("booking_completed");
            
            object.setScrollY(formPanel);
            
        }
        
        if(document.getElementById("returnToSchedules") == null){
            
            var returnButton = document.createElement("button");
            returnButton.id = "returnToSchedules";
            returnButton.textContent = object.i18n("Return");
            
            var bookingButton = document.createElement("button");
            bookingButton.textContent = object.i18n("Booking");
            bookingButton.setAttribute("class", "bookingButton");
            
            var bottomPanel = document.getElementById("bottomPanel");
            bottomPanel.appendChild(returnButton);
            bottomPanel.appendChild(bookingButton);
            
            bookingButton.onclick = function(event){
                
                var valueList = {};
                var post = object.verifyForm("sendBooking", object._nonce, object._action, calendarData.date, schedule, courseList, formData, formPanelList, inputData, valueList);
                //post.sendEmail = Number(sendEmail);
                console.log(post);
                if(post !== false){
                    
                    post.sendEmail = 1;
                    xmlHttp = new Booking_App_XMLHttp(object._url, post, false, function(response){
                        
                        console.log(response);
                        if(response.status == "success"){
                            
                            console.log(response);
                            
                        }else{
                            
                            alert(response.message);
                            
                        }
                        //loadingPanel.setAttribute("class", "hidden_panel");
                        
                    });
                    
                    
                }else{
                    
                    var scrollTop = formMainPanel.scrollTop;
                    var formMainPanelTop = top;
                    for(var key in formPanelList){
                        
                        console.log(formPanelList[key]);
                        if(formPanelList[key].getAttribute("data-errorInput") == 1){
                            
                            console.log("error = " + key + " formMainPanelTop = " + formMainPanelTop);
                            var scrollPosition = formPanelList[key].getBoundingClientRect().top - object._top;
                            console.log("scrollPosition = " + scrollPosition);
                            window.scrollTo(0, scrollPosition);
                            formMainPanel.scrollTop = formMainPanelTop;
                            break;
                            
                        }
                        
                        formMainPanelTop += parseInt(formPanelList[key].clientHeight);
                        
                    }
                    
                }
                
            }
            
        }
        
        //formPanel.style.top = object._top + "px";
        var scrollPositionNew = window.pageYOffset + formPanel.getBoundingClientRect().top - object._top;
        //var scrollPositionNew = window.pageYOffset + formPanel.getBoundingClientRect().top;
        var scrollPosition = formPanel.getBoundingClientRect().top - object._top;
        console.log("scrollPosition = " + scrollPosition);
        console.log("scrollPositionNew = " + scrollPositionNew);
        console.log(formPanel.getBoundingClientRect());
        if(calendarAccount.type == "hotel"){
            
            callback({mode: "top", top: object._top});
            scrollPositionNew = window.pageYOffset + document.getElementById("booking-package_durationStay").getBoundingClientRect().top - object._top;
            //scrollPositionNew = window.pageYOffset + document.getElementById("booking-package_durationStay").getBoundingClientRect().top;
            
        }
        
        console.log("scrollPosition = " + scrollPosition);
        //window.scrollTo(0, scrollPositionNew);
        object.setScrollY(formPanel);
        //formPanel.scrollIntoView();
        
    }
    
    Booking_App.prototype.sendBooking = function(url, nonce, action, mode, sendBool, payType, payToken, calendarData, schedule, courseList, formData, formPanelList, inputData, selectedOptions, accountKey, callback){
        
        var object = this;
        var calendarAccount = object._calendarAccount;
        var valueList = {};
        var post = object.verifyForm(mode, nonce, action, calendarData.date, schedule, courseList, formData, formPanelList, inputData, valueList);
        if(post !== false){
            
            if(sendBool === true){
                
                post.accountKey = accountKey;
                
                post.sendEmail = 1;
                if (payType != null && payToken != null) {
                    
                    post.payType = payType;
                    post.payToken = payToken;
                    
                }
                
                if (calendarAccount.type == "hotel") {
                    
                    post.json = JSON.stringify(object._hotel.verifySchedule(true));
                    
                }
                
                post.selectedOptions = JSON.stringify([]);
                if (selectedOptions != null) {
                    
                    post.selectedOptions = JSON.stringify(selectedOptions);
                    
                }
                
                post.public = 1;
                post.permalink = object._permalink;
                console.log(post);
                //loadingPanel.setAttribute("class", "loading_modal_backdrop");
                
                var bookingBlockPanel = document.getElementById("bookingBlockPanel");
                bookingBlockPanel.classList.remove("hidden_panel");
                xmlHttp = new Booking_App_XMLHttp(url, post, false, function(response){
                    
                    console.log(response);
                    if (response.status == "success") {
                        
                        console.log(response);
                        response.mode = "completed";
                        callback(response);
                        object.setUserInformation(response.userInformationValues);
                        
                        var buttonClassName = object._prefix + "user_information_button";
                        var userEditButtonList = document.getElementsByClassName(buttonClassName);
                        for (var i = 0; i < userEditButtonList.length; i++) {
                            
                            userEditButtonList[i].classList.add("hidden_panel");
                            
                        }
                        console.log(valueList);
                        for (var key in formPanelList) {
                            
                            var deletePanel = formPanelList[key].getElementsByClassName("value")[0];
                            formPanelList[key].removeChild(deletePanel);
                            for(var i = 0; i < valueList[key].length; i++) {
                                
                                var valuePanel = document.createElement("div");
                                valuePanel.classList.add("value");
                                valuePanel.textContent = valueList[key][i];
                                formPanelList[key].appendChild(valuePanel);
                                
                            }
                            
                        }
                        
                        if (document.getElementById("booking-package_paymentMethod")) {
                            
                            var paymentMethod = document.getElementById("booking-package_paymentMethod");
                            paymentMethod.parentNode.removeChild(paymentMethod);
                            
                        }
                        
                    } else {
                        
                        alert(response.message);
                        callback(false);
                        if(response.reload != null && parseInt(response.reload) == 1){
                            
                            window.location.reload(true);
                            
                        }
                        
                    }
                    
                    bookingBlockPanel.classList.add("hidden_panel");
                    //loadingPanel.setAttribute("class", "hidden_panel");
                    
                });
                
            }else{
                
                
                
            }
            
            
        }else{
            
            callback(false);
            for(var key in formPanelList){
                
                if(formPanelList[key].getAttribute("data-errorInput") == 1 && typeof window == 'object' && typeof window.scrollY == 'number'){
                    
                    console.log("error = " + key);
                    //formPanelList[key].scrollIntoView({behavior: "instant", block: "center"});
                    var scrollPosition = formPanelList[key].getBoundingClientRect().top - object._top - 50;
                    
                    console.log("scrollPosition = " + scrollPosition);
                    window.scrollTo(0, scrollPosition);
                    formPanelList[key].scrollIntoView(true);
                    console.log(formPanelList[key].getBoundingClientRect());
                    console.log(window.scrollY);
                    console.log(typeof window);
                    if (typeof window.scroll == 'function') {
                        
                        window.scroll(0, (window.scrollY - object._top - document.getElementById("reservationHeader").getBoundingClientRect().height));
                        
                    }
                    
                    break;
                    
                }
                
            }
            
        }
        
    }
    
    Booking_App.prototype.paymentPanel = function(stripe_public_key, paypal_client_id, paypal_mode, country, currency, cartPanel, goodsList, calendarData, schedule, courseList, formData, formPanelList, inputData, selectedOptions, callback){
        
        var object = this;
        if(object._stripe_active == 1){
            
            object.paypalPanelcartInputForStripe(stripe_public_key, country, currency, cartPanel, goodsList, selectedOptions, callback);
            
        }
        
        if(object._paypal_active == 1){
            
            object.paypalPanel(paypal_client_id, paypal_mode, country, currency, cartPanel, goodsList, calendarData, schedule, courseList, formData, formPanelList, inputData, selectedOptions, callback);
            
        }
        
    }
    
    Booking_App.prototype.paypalPanel = function(paypal_client_id, paypal_mode, country, currency, cartPanel, goodsList, calendarData, schedule, courseList, formData, formPanelList, inputData, selectedOptions, callback){
        
        console.log("country = " + country + " currency = " + currency.toUpperCase());
        console.log("paypal_mode = " + paypal_mode);
        console.log("this._locale = " + this._locale);
        console.log(selectedOptions);
        
        var payPalPanel = document.createElement("div");
        payPalPanel.id = "booking-package_pay_with_paypal";
        payPalPanel.classList.add("hidden_panel");
        cartPanel.appendChild(payPalPanel);
        
        var object = this;
        
        
        var locale = 'en_US';
        if(object._locale != null && object._locale != ''){
            
            if(object._locale.length == 2){
                
                if(object._locale == 'ja'){
                    
                    locale = 'ja_JP';
                    
                }
                
            }else{
                
                locale = object._locale;
                
            }
            
        }
        
        var total = 0;
        for(var i = 0; i < goodsList.length; i++){
            
            total += goodsList[i].amount;
            
        }
        /**
        if (selectedOptions != null) {
            
            for(var i = 0; i < selectedOptions.length; i++){
                
                var option = selectedOptions[i];
                if(parseInt(option.selected) == 1){
                    
                    goodsList.push({"label": option.name, "amount": parseInt(option.cost)});
                    total += parseInt(option.cost);
                    
                }
                
            }
            
        }
        **/
        if(currency.toLocaleUpperCase() != 'JPY'){
            
            total = Number(total) / 100;
            total = total.toFixed(2);
            
        }
        
        console.log("total = " + total);
        /**
        if (object._stripe_active == 1 && object._paypal_active == 1) {
            
            var orLabel = document.createElement("div");
            orLabel.setAttribute("class", "orLabel");
            orLabel.textContent = "OR";
            payPalPanel.appendChild(orLabel);
            
        }
        **/
        /**
        var payTypeLabel = document.createElement("div");
        payTypeLabel.textContent = "PayPal";
        payTypeLabel.setAttribute("class", "payTypeLabel");
        payPalPanel.appendChild(payTypeLabel);
        **/
        
        var submit_payment = document.createElement("div");
        submit_payment.id = "paypal-button";
        payPalPanel.appendChild(submit_payment);
        var mode = "sandbox";
        var client_data = {sandbox: paypal_client_id};
        if(paypal_mode == 1){
            
            mode = "production";
            client_data = {production: paypal_client_id};
            
        }
        
        paypal.Buttons({
            
            createOrder: function(data, actions) {
                
                var valueList = {};
                var post = object.verifyForm("paypal", object._nonce, object._action, calendarData.date, schedule, courseList, formData, formPanelList, inputData, valueList);
                console.log(post);
                if (post != false) {
                    
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: total,
                                /**currency_code: currency.toUpperCase(),**/
                            }
                        }]
                    });
                
                } else {
                    
                    for(var key in formPanelList){
                        
                        if(formPanelList[key].getAttribute("data-errorInput") == 1 && typeof window == 'object' && typeof window.scrollY == 'number'){
                            
                            var scrollPosition = formPanelList[key].getBoundingClientRect().top - object._top - 50;
                            window.scrollTo(0, scrollPosition);
                            formPanelList[key].scrollIntoView(true);
                            if (typeof window.scroll == 'function') {
                                
                                window.scroll(0, (window.scrollY - object._top - document.getElementById("reservationHeader").getBoundingClientRect().height));
                                
                            }
                            
                            break;
                            
                        }
                        
                    }
                    return {transactions: []};
                    
                }
                
                console.log("createOrder");
                
                
                
            },
            onApprove: function(data, actions) {
                
                console.log(data);
                data.paymentName = "paypal";
                console.log(data);
                //callback(data);
                
                return actions.order.capture().then(function(details) {
                    
                    console.log(details);
                    details.paymentName = "paypal";
                    callback(details);
                    
                });
                
            }
            
            
        }).render('#paypal-button');
        
        /**
        paypal.Button.render({
            // Configure environment
            env: mode,
            client: {
                sandbox: paypal_client_id,
                production: paypal_client_id
            },
            // Customize button (optional)
            locale: locale,
            country: country,
            style: {
                size: 'responsive',
                color: 'blue',
                shape: 'rect',
            },
            // Set up a payment
            payment: function (data, actions) {
                
                console.log("Set up a payment");
                var valueList = {};
                var post = object.verifyForm("paypal", object._nonce, object._action, calendarData.date, schedule, courseList, formData, formPanelList, inputData, valueList);
                console.log(post);
                if(post != false){
                    
                    return actions.payment.create({
                        transactions: [{
                            amount: {
                                total: total,
                                currency: currency.toUpperCase()
                            },
                            custom: "",
                        }]
                    });
                    
                }else{
                    
                    for(var key in formPanelList){
                        
                        if(formPanelList[key].getAttribute("data-errorInput") == 1 && typeof window == 'object' && typeof window.scrollY == 'number'){
                            
                            var scrollPosition = formPanelList[key].getBoundingClientRect().top - object._top - 50;
                            window.scrollTo(0, scrollPosition);
                            formPanelList[key].scrollIntoView(true);
                            if (typeof window.scroll == 'function') {
                                
                                window.scroll(0, (window.scrollY - object._top - document.getElementById("reservationHeader").getBoundingClientRect().height));
                                
                            }
                            
                            break;
                            
                        }
                        
                    }
                    return {transactions: []};
                    
                }
                
            },
            // Execute the payment
            onAuthorize: function (data, actions) {
                
                console.log("Execute the payment");
                return actions.payment.execute().then(function () {
                    
                    data.paymentName = "paypal";
                    console.log(data);
                    callback(data);
                    // Show a confirmation message to the buyer
                    //window.alert('Thank you for your purchase!');
                    
                });
            },
            onCancel: function (data, actions) {
                
                console.log("onCancel");
                
            }
        }, '#paypal-button');
        **/
        
    }
    
    Booking_App.prototype.paypalPanelcartInputForStripe = function(stripe_public_key, country, currency, cartPanel, goodsList, selectedOptions, callback){
        
        var object = this;
        console.log("country = " + country + " currency = " + currency);
        console.log(goodsList);
        console.log(selectedOptions);
        
        var stripePanel = document.createElement("div");
        stripePanel.id = "booking-package_pay_with_stripe";
        stripePanel.classList.add("hidden_panel");
        cartPanel.appendChild(stripePanel);
        
        var total = 0;
        for(var i = 0; i < goodsList.length; i++){
            /**
            if (goodsList[i].tax == null) {
                
                total += goodsList[i].amount;
                
            } else if(goodsList[i].tax != null && goodsList[i].tax == 'tax_exclusive') {
                
                total += goodsList[i].amount;
                
            }
            **/
            total += goodsList[i].amount;
            
        }
        /**
        if (selectedOptions != null) {
            
            for(var i = 0; i < selectedOptions.length; i++){
                
                var option = selectedOptions[i];
                if(parseInt(option.selected) == 1){
                    
                    goodsList.push({"label": option.name, "amount": parseInt(option.cost)});
                    total += parseInt(option.cost);
                    
                }
                
            }
            
        }
        **/
        var stripe = Stripe(stripe_public_key);
        var elements = stripe.elements();
        var style = {
                base: {
                    color: '#32325d',
                    lineHeight: '18px',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            };
        
        var titleLabel = document.createElement("label");
        titleLabel.setAttribute("for", "card-element");
        titleLabel.textContent = object.i18n("Credit card");
        
        var card_element = document.createElement("div");
        card_element.id = "card-element";
        
        var card_errors = document.createElement("div");
        card_errors.id = "card-errors";
        card_errors.setAttribute("role", "alert");
        
        var submit_payment = document.createElement("button");
        submit_payment.textContent = object.i18n("Payment & Booking");
        submit_payment.setAttribute("class", "paymentButton");
        
        var form_row = document.createElement("div");
        form_row.classList.add("form-row");
        form_row.appendChild(titleLabel);
        form_row.appendChild(card_element);
        form_row.appendChild(card_errors);
        form_row.appendChild(submit_payment);
        
        var payment_form = document.createElement("form");
        payment_form.id = "payment-form";
        //payment_form.action = "/charge";
        //payment_form.method = "post";
        payment_form.appendChild(form_row);
        
        stripePanel.appendChild(payment_form);
        
        var card = elements.create('card', {style: style, hidePostalCode: true});
        card.mount('#card-element');
        
        
        
        var form = document.getElementById('payment-form');
        form.addEventListener('submit', function(event) {
            
            console.log("submit");
            event.preventDefault();
            
            stripe.createToken(card).then(function(result) {
                if (result.error) {
                    // Inform the customer that there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server
                    //stripeTokenHandler(result.token);
                    console.log(result);
                    console.log(result.token);
                    result.paymentName = "stripe";
                    callback(result)
                    
                }
            
            });
        });
            
        card.addEventListener('change', function(event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        /** Apple pay AND Pay with Google **/
        
        var orLabel = document.createElement("div");
        orLabel.setAttribute("class", "orLabel hidden_panel");
        orLabel.textContent = "OR";
        stripePanel.appendChild(orLabel);
        
        var payTypeLabel = document.createElement("div");
        payTypeLabel.setAttribute("class", "payTypeLabel hidden_panel");
        stripePanel.appendChild(payTypeLabel);
        
        var payment_request_button = document.createElement("div");
        payment_request_button.id = "payment-request-button";
        stripePanel.appendChild(payment_request_button);
        
        var paymentRequest = stripe.paymentRequest({
            country: country,
            currency: currency,
            total: {
                label: 'Total amount',
                amount: total,
            },
            displayItems: goodsList
        });
        
        var prButton = elements.create('paymentRequestButton', {
            paymentRequest: paymentRequest,
            style: {
                paymentRequestButton: {
                    type: 'default', // default: 'default'
                    theme: 'light-outline', // default: 'dark'
                    height: '40px', // default: '40px', the width is always '100%'
                },
            }
        });
        
        // Check the availability of the Payment Request API first.
        paymentRequest.canMakePayment().then(function(result) {
            if(result){
                
                console.log(result.applePay);
                if(result.applePay === false){
                    
                    payTypeLabel.textContent = "Goolge pay";
                    
                }else{
                    
                    payTypeLabel.textContent = "Apple pay";
                    payTypeLabel.textContent = "";
                    
                }
                
                orLabel.classList.remove("hidden_panel");
                payTypeLabel.classList.remove("hidden_panel");
                prButton.mount('#payment-request-button');
                
            }else{
                
                document.getElementById('payment-request-button').style.display = 'none';
                
            }
            
        });
        
        paymentRequest.on('token', function(ev) {
            // Send the token to your server to charge it!
            
            console.log(ev);
            console.log(JSON.stringify({token: ev.token.id}));
            //ev.complete('success');
            ev.paymentName = "stripe";
            callback(ev);
            
        });
        
    }
    
    Booking_App.prototype.setScrollY = function(element){
        
        var object = this;
        var rect = element.getBoundingClientRect();
        console.log("this._top = " + this._top);
        console.log(rect);
        if(rect.y < this._top){
            
            console.log("this._top = " + this._top);
            console.log("this._topPanelHeight = " + this._topPanelHeight);
            var scrollY = rect.y + window.pageYOffset - this._top;
            console.log("scrollY = " + scrollY);
            console.log(typeof window.scroll);
            if (typeof window.scroll == 'function') {
                
                window.scroll(window.pageXOffset, scrollY);
                
            }
            
            console.log(element.getBoundingClientRect());
            
        }
        
    }
    
    Booking_App.prototype.verifyForm = function(mode, nonce, action, date, schedule, courseList, formData, formPanelList, inputData, valueList){
        
        console.log(date);
        console.log(schedule);
        console.log(courseList);
        console.log(formData);
        var object = this;
        var sendBool = true;
        var input = new Input();
        input.setPrefix(object._prefix);
        for(var key in formData){
            
            console.log(key);
            console.log(inputData[key]);
            console.log(formData[key]);
            
            if(formData[key].active != 'true'){
                
                continue;
                
            }
            
            if(formPanelList[key] == null){
                
                continue;
                
            }
            
            var bool = input.inputCheck(key, formData[key], inputData[key], valueList);
            console.log("bool = " + bool);
            if(bool === true){
                
                formPanelList[key].removeAttribute("data-errorInput");
                formPanelList[key].classList.remove("rowError");
                //formPanelList[key].setAttribute("class", "row");
                
            }else{
                
                sendBool = false;
                formPanelList[key].setAttribute("data-errorInput", 1);
                formPanelList[key].classList.add("rowError");
                //formPanelList[key].setAttribute("class", "row rowError");
                
            }
            
        }
        
        console.log(valueList);
        if(sendBool === true){
            
            //schedule
            var post = {nonce: nonce, action: action, mode: mode, month: date.month, day: 1, year: date.year, applicantCount: '1', permission: 'public', timeKey: schedule.key, unixTime: schedule.unixTime};
            if((object._courseBool == true && courseList != null) || object._calendarAccount.flowOfBooking == 'services'){
                
                var selectedCourseList = [];
                var selectedCourseKeyList = [];
                for (var i in courseList) {
                    
                    if (courseList[i].selected == 1) {
                        
                        console.log(courseList[i]);
                        console.log(typeof courseList[i].options);
                        var service = {};
                        for (var key in courseList[i]) {
                            
                            service[key] = courseList[i][key];
                            
                        }
                        
                        
                        if (typeof courseList[i].options == 'string') {
                            
                            var options = JSON.parse(courseList[i].options);
                            service.options = options;
                            
                        }
                        
                        selectedCourseList.push(service);
                        selectedCourseKeyList.push(service.key);
                        post.courseKey = courseList[i].key;
                        
                    }
                    
                }
                
                post.selectedCourseList = JSON.stringify(selectedCourseList);
                post.selectedCourseKeyList = JSON.stringify(selectedCourseKeyList);
                //post.courseKey = course.key;
                
            }
            
            for(var key in valueList){
                
                console.log(valueList[key]);
                post['form' + key] = valueList[key].join(",");
                
            }
            
            return post;
            
        }else{
            
            return false;
            
        }
        
    }
    
    Booking_App.prototype.createRowPanel = function(name, value, id, required, actionElement){
        
        console.log(typeof value);
        console.log("id = " + id);
        
        var object = this;
        var namePanel = document.createElement("div");
        namePanel.setAttribute("class", "name");
        if (typeof name == 'object') {
            
            namePanel.appendChild(name);
            
        } else {
            
            namePanel.textContent = name;
            
        }
        
        var edit = 0;
        if(typeof value == 'object' && value.getAttribute("data-edit") != null){
            
            edit = parseInt(value.getAttribute("data-edit"));
            
        }
        
        console.log("edit = " + edit);
        
        if((typeof required == "string" && required == 'true') || (typeof required == "number" && required == 1)){
            
            namePanel.setAttribute("class", "name required");
            
        }
        
        var inputPanel = null;
        if(typeof value == 'string' || typeof value == 'number'){
            
            inputPanel = document.createElement("div");
            inputPanel.textContent = value;
            if(id != null){
                
                inputPanel.id = id;
                
            }
            
        }else{
            
            inputPanel = value;
            
        }
        inputPanel.setAttribute("class", "value");
        
        var rowPanel = document.createElement("div");
        rowPanel.setAttribute("class", "row");
        rowPanel.appendChild(namePanel);
        
        if(edit == 1){
            
            var editButton = document.createElement("div");
            editButton.setAttribute("data-id", id);
            editButton.classList.add("material-icons");
            editButton.classList.add("editButton");
            editButton.classList.add(object._prefix + "user_information_button");
            editButton.setAttribute("style", "font-family: 'Material Icons' !important;");
            editButton.textContent = "border_color";
            rowPanel.appendChild(editButton);
            
            var doneButton = document.createElement("div");
            doneButton.setAttribute("data-id", id);
            doneButton.classList.add("material-icons");
            doneButton.classList.add("editButton");
            doneButton.classList.add("hidden_panel");
            doneButton.classList.add(object._prefix + "user_information_button");
            doneButton.textContent = "done_outline";
            rowPanel.appendChild(doneButton);
            
            editButton.onclick = function(){
                
                var id = editButton.getAttribute("data-id");
                var valueId = object._prefix + "value_" + id;
                var inputId = object._prefix + "input_" + id;
                editButton.classList.add("hidden_panel");
                doneButton.classList.remove("hidden_panel");
                document.getElementById(valueId).classList.add("hidden_panel");
                document.getElementById(inputId).classList.remove("hidden_panel");
                
            }
            
            doneButton.onclick = function(){
                
                var id = doneButton.getAttribute("data-id");
                var valueId = object._prefix + "value_" + id;
                var inputId = object._prefix + "input_" + id;
                doneButton.classList.add("hidden_panel");
                editButton.classList.remove("hidden_panel");
                document.getElementById(valueId).classList.remove("hidden_panel");
                document.getElementById(inputId).classList.add("hidden_panel");
                
            }
            
        }
        
        if(actionElement != null){
            
            rowPanel.appendChild(actionElement);
            
        }
        rowPanel.appendChild(inputPanel);
        
        
        
        return rowPanel;
        
    }
    
    Booking_App.prototype.unselectPanel = function(selectedKey, panelList, styleName){
        
        for(var i = 0; i < panelList.length; i++){
            
            var key = panelList[i].getAttribute("data-key");
            var status = parseInt(panelList[i].getAttribute("data-status"));
            if(key != selectedKey && status === 1){
                
                panelList[i].setAttribute("class", styleName);
                
            }
        
        }
    
    }
    
    Booking_App.prototype.isJSON = function(arg){
		
		arg = (typeof arg === "function") ? arg() : arg;
	    if(typeof arg  !== "string") {
	        return false;
	    }
	    
	    try{
	    	arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
			return true;
	    }catch(e){
			return false;
	    }
		
	}
    
    
    
