/* globals Booking_App_XMLHttp */
/* globals Booking_App_Calendar */
/* globals scriptError */
/* globals I18n */
/* globals FORMAT_COST */
/* globals Hotel */
/* globals TAXES */
/* globals Confirm */

var schedule_data = schedule_data;
var booking_package_dictionary = booking_package_dictionary;
var booking_manage = null;

window.addEventListener('load', function(){
    
    console.log(schedule_data);
    console.log(booking_package_dictionary);
    if(schedule_data != null && booking_package_dictionary != null){
        
        booking_manage = new Booking_manage(schedule_data, booking_package_dictionary, false);
        booking_manage.start();
        
    }
    
});

/**
window.onload = function(){
    
    console.log(schedule_data);
    console.log(booking_package_dictionary);
    if(schedule_data != null && booking_package_dictionary != null){
        
        booking_manage = new Booking_manage(schedule_data, booking_package_dictionary, false);
        booking_manage.start();
        
    }
    
}
**/

window.onerror = function(msg, url, line, col, error){
    
    var error = new scriptError(schedule_data, booking_package_dictionary, msg, url, line, col, error);
    error.setResponseText(booking_manage.getResponseText());
    error.send();
    
};

var changeStatusForDashboard = function(button, key, accountKey, status, month, day, year){
    
    var visitor = {key: key, accountKey: accountKey, status: status, date: {month: month, day: day, year}};
    
    if(booking_manage != null){
        console.log(visitor);
        booking_manage.changeStatusForDashboard(button, visitor);
        
    }
    
};


function Booking_manage(schedule_data, booking_package_dictionary, webApp) {
    
    console.log(schedule_data);
    var object = this;
    this._schedule_data = schedule_data;
    this._calendarAccountList = schedule_data.calendarAccountList;
    this._dashboardRequest = schedule_data.dashboardRequest;
    this._webApp = webApp;
    
    this._i18n = new I18n(schedule_data.locale);
    this._i18n.setDictionary(booking_package_dictionary);
    this._format = new FORMAT_COST(this._i18n);
    this._hotel = null;
    
    this._blockPanel = document.getElementById("blockPanel");
    this._loadingPanel = document.getElementById("loadingPanel");
    
    this._prefix = schedule_data.prefix;
    this._url = schedule_data.url;
    this._nonce = schedule_data.nonce;
    this._nonce_download = schedule_data.nonce_download;
    this._action = schedule_data.action;
    this._currency = schedule_data.currency;
    this._dateFormat = schedule_data.dateFormat;
    this._positionOfWeek = schedule_data.positionOfWeek;
    this._courseList = schedule_data.courseList;
    this._formData = schedule_data.formData;
    this._courseName = schedule_data.courseName;
    this._buttonAction = null;
    this._selectedKey = null;
    this._visitors = {};
    this._emailEnableList = schedule_data.emailEnable;
    this._startOfWeek = schedule_data.startOfWeek;
    this._nationalHoliday = {};
    this._preparationTime = 0;
    this._positionPreparationTime = 'before_after';
    this._function = {name: "root", post: {}};
    this._responseText = null;
    this._taxes = [];
    this._calendarAccount = [];
    this._services = [];
    this._visitorServices = [];
    
    this._leftButtonPanel = null;
    this._rightButtonPanel = null;
    
    this._monthFullName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    if(schedule_data.bookingBool == 1){
        
        this._hotel = new Hotel(this._currency, weekName, this._dateFormat, this._positionOfWeek, this._startOfWeek, booking_package_dictionary);
    
        this._blockPanel = document.getElementById("blockPanel");
        this._contentPanel = document.getElementById("media_frame_reservation_content");
        this._editPanel = document.getElementById("editPanel");
        this._loadingPanel = document.getElementById("loadingPanel");
        this._buttonPanel = document.getElementById("buttonPanel");
        this._leftButtonPanel = document.getElementById("leftButtonPanel");
        this._rightButtonPanel = document.getElementById("rightButtonPanel");
        
        this._courseBool = false;
        if(schedule_data.courseBool == 'true'){
            
            this._courseBool = true;
            
        }
        
        this._blockPanel.onclick = function(){
            
            object._leftButtonPanel.textContent = null;
            object._rightButtonPanel.textContent = null;
            object.editPanelShow(false);
            
        };
        
        document.getElementById("media_modal_close").onclick = function(){
            
            object._leftButtonPanel.textContent = null;
            object._rightButtonPanel.textContent = null;
            object.editPanelShow(false);
            
        };
        
        
        
        
        
    }
    
    this.start = function(){
        
        var accountKey = this.getCookie(this._schedule_data.prefix + "accountKey");
        console.log("accountKey = " + accountKey);
        console.log(this._schedule_data);
        if(accountKey == null){
            
            for(var i in this._schedule_data.calendarAccountList){
                
                accountKey = this._schedule_data.calendarAccountList[i].key;
                break;
                
            }
            
            
        }else{
            
            var status = false;
            //for(var i = 0; i < this._schedule_data.calendarAccountList.length; i++){
            for(var i in this._schedule_data.calendarAccountList){
                
                var calendarAccount = this._schedule_data.calendarAccountList[i];
                if(accountKey == calendarAccount.key){
                    
                    status = true;
                    break;
                    
                }
                
            }
            
            if(status == false){
                
                for(var i in this._schedule_data.calendarAccountList){
                    
                    console.log(this._schedule_data.calendarAccountList[i]);
                    accountKey = this._schedule_data.calendarAccountList[i].key;
                    break;
                    
                }
                
            }
            
        }
        
        var dashboardRequest = this._schedule_data.dashboardRequest;
        try {
            
            console.log(dashboardRequest);
            if(dashboardRequest == null || dashboardRequest.status == null){
                
                throw "Error dashboardRequest";
                
            }
            
            if(dashboardRequest.status == 1){
                
                this.getReservationData(parseInt(dashboardRequest.month), parseInt(dashboardRequest.day), parseInt(dashboardRequest.year), accountKey);
                
            }else{
                
                this.getReservationData(parseInt(this._schedule_data.month), parseInt(this._schedule_data.day), parseInt(this._schedule_data.year), accountKey);
                
            }
            
        } catch(error) {
            
            console.error(error);
            
        }
        
        
    };
    
    this.getCookie = function(c_name){
        
        console.log("c_name = " + c_name);
        if(document.cookie.length > 0){
            
            var st = document.cookie.indexOf(c_name + "=");
            console.log(st);
            if(st != -1){
                
                st = st + c_name.length + 1;
                var ed = document.cookie.indexOf(";", st);
                if(ed == -1){
                    
                    ed = document.cookie.length;
                    
                }
                
                var value = unescape(document.cookie.substring(st, ed));
                console.log("value = " + value);
                return value;
                
            }else {
                
                return null;
                
            }
            
        }
        
    };
    
    this.setFunction = function(name, post){
        
        this._function = {name: name, post: post};
        
    };
    
    this.getFunction = function(){
        
        return this._function;
        
    };
    
    this.getServices = function() {
        
        return this._services;
        
    };
    
    this.lookingForServices = function(service) {
        
        var services = this._services;
        for (var key in services) {
            
            if (parseInt(services[key].key) == parseInt(service.key)) {
                
                return true;
                
            }
            
        }
        
        return false;
        
    };
    
    this.resetServices = function() {
        
        this._services = [];
        
    };
    
    this.setServices = function(updateServices) {
        
        this._services = updateServices;
        
    };
    
    this.addServices = function(service) {
        
        this._services.push(service);
        
    };
    
    this.setVisitorServices = function(services) {
        
        this._visitorServices = [];
        for (var key in services) {
            
            services[key].selectedOptionsList = services[key].options;
            
            this._visitorServices.push(services[key]);
            
        }
        
    };
    
    this.lookingForVisitorServices = function(target) {
        
        var services = this._visitorServices;
        for (var key in services) {
            
            if (parseInt(services[key].key) == parseInt(target.key)) {
                
                return true;
                
            }
            
        }
        
        return false;
        
    };
    
    this.addVisitorServices = function(target) {
        
        console.log(target);
        if (target.selectedOptionsList == null) {
            
            
            
        }
        
        var services = this._visitorServices;
        for (var key in services) {
            
            if (parseInt(services[key].key) == parseInt(target.key)) {
                
                services[key] = target;
                return services;
                
            }
            
        }
        
        services.push(target);
        return services;
        
    };
    
    this.getVisitorServices = function() {
        
        return this._visitorServices;
        
    };
    
    this.setResponseText = function(responseText){
        
        this._responseText = responseText;
        
    };
    
    this.getResponseText = function(){
        
        return this._responseText;
        
    };

    this.getReservationData = function(month, day, year, accountKey, callback){
        
        var object = this;
        //object._startOfWeek = object._calendarAccountList[accountKey].startOfWeek;
        console.log(object._loadingPanel);
        object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var post = {nonce: object._nonce, action: object._action, mode: object._prefix + 'getReservationData', year: year, month: month, day: 1, accountKey: accountKey};
        object.setFunction("getReservationData", post);
        new Booking_App_XMLHttp(object._url, post, object._webApp, function(calendarData){
                
            object._loadingPanel.setAttribute("class", "hidden_panel");
            console.log(calendarData);
            object._preparationTime = parseInt(calendarData.account.preparationTime);
            object._positionPreparationTime = calendarData.account.positionPreparationTime;
            object._calendarAccount = calendarData.account;
            object._hotel.setCalendarAccount(calendarData.account);
            object._hotel.setTaxes(calendarData.taxes);
            object._taxes = calendarData.taxes;
            console.log(object._taxes);
            object._emailEnableList = calendarData.emailEnableList;
            if(calendarData.courseList != null){
                
                object._courseList = calendarData.courseList;
                
            }
            
            object._courseBool = false;
            if(parseInt(calendarData.account.courseBool) == 1){
                
                object._courseBool = true;
                
            }
            console.log("_courseBool = " + object._courseBool);
            
            if(calendarData.formData != null){
                
                object._formData = calendarData.formData;
                
            }
            
            if(callback == null){
                
                object.createCalendar(calendarData, month, day, year, accountKey);
                
            }else{
                
                callback(calendarData);
                
            }
            
            
                
        }, function(responseText){
            
            object.setResponseText(responseText);
            
        });
        
    };
    
    

    this.selectCalendarAccount = function(calendarData, month, day, year, selectCalendarAccountPanel, calendarAccountList, accountKey){
        
        var object = this;
        console.log("accountKey = " + accountKey);
        console.log(calendarAccountList);
        selectCalendarAccountPanel.id = "selectCalendarAccountPanel";
        var select = document.createElement("select");
        selectCalendarAccountPanel.appendChild(select);
        for(var i = 0; i < calendarAccountList.length; i++){
            
            var calendarAccount = calendarAccountList[i];
            console.log(calendarAccount);
            var option = document.createElement("option");
            option.value = calendarAccount.key;
            option.textContent = calendarAccount.name;
            select.appendChild(option);
            if(accountKey == calendarAccount.key){
                
                select.selectedIndex = i;
                object._startOfWeek = calendarAccount.startOfWeek;
                object._courseBool = false;
                if(parseInt(calendarAccount.courseBool) == 1){
                    
                    object._courseBool = true;
                    
                }
                
                console.log("courseBool = " + object._courseBool);
                object._courseName = calendarAccount.courseTitle;
                
            }
            
        }
        
        select.onchange = function(){
            
            console.log("onchange = " + this.selectedIndex);
            var key = this.selectedIndex;
            var accountKey = this.options[key].value;
            console.log("accountKey = " + accountKey);
            object.getReservationData(month, day, year, accountKey, null);
            
        };
        
    };

    this.createCalendar = function(calendarData, month, day, year, accountKey){
            
        var object = this;
        this.date = {month: month, day: day, year: year};
        var calendarPanel = document.getElementById("calendarPage");
        calendarPanel.textContent = null;
        object._nationalHoliday = calendarData.nationalHoliday.calendar;
        console.log("schedule_data.calendar_account = " + object._schedule_data.calendar_account);
        var selectCalendarAccountPanel = document.createElement("div");
        var calendarAccount = calendarData.account;
        console.log(calendarAccount);
        
        calendarPanel.appendChild(selectCalendarAccountPanel);
        object.selectCalendarAccount(calendarData, month, day, year, selectCalendarAccountPanel, object._schedule_data.calendarAccountList, accountKey);
        
        var dayHeight = parseInt(calendarPanel.clientWidth / 7);
    	
    	var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
    	
    	var datePanel = document.createElement("div");
    	datePanel.setAttribute("class", "calendarData");
    	datePanel.textContent = calendar.formatBookingDate(month, null, year, null, null, null, null);
    	
    	var returnLabel = document.createElement("label");
    	returnLabel.setAttribute("class", "arrowLeft");
    	if(month == 1){
    	    
    	    returnLabel.textContent = "＜" + calendar.formatBookingDate(12, null, null, null, null, null, null);
    	    
    	}else{
    	    
    	    returnLabel.textContent = "＜" + calendar.formatBookingDate((parseInt(month) - 1), null, null, null, null, null, null);
    	    
    	}
    	
    	var returnPanel = document.createElement("div");
    	returnPanel.setAttribute("class", "calendarChangeButton");
    	returnPanel.appendChild(returnLabel);
    	
    	var nextLabel = document.createElement("label");
    	nextLabel.setAttribute("class", "arrowRight");
    	if(month == 12){
    	    
    	    nextLabel.textContent = calendar.formatBookingDate(1, null, null, null, null, null, null) + "＞";
    	    
    	}else{
    	    
    	    nextLabel.textContent = calendar.formatBookingDate((parseInt(month) + 1), null, null, null, null, null, null) + "＞";
    	    
    	}
    	var nextPanel = document.createElement("div");
    	nextPanel.setAttribute("style", "text-align: right;");
    	nextPanel.setAttribute("class", "calendarChangeButton");
    	nextPanel.appendChild(nextLabel);
    	
    	var topPanel = document.createElement("div");
    	topPanel.setAttribute("class", "calendarPanel");
    	topPanel.appendChild(returnPanel);
    	topPanel.appendChild(datePanel);
    	topPanel.appendChild(nextPanel);
    	calendarPanel.appendChild(topPanel);
    	
    	var downloadBool = false;
    	calendar.create(calendarPanel, calendarData, month, day, year, '', function(callback){
    	    
    	    console.log(callback);
    	    var dayPanel = callback.eventPanel;
    	    var day = parseInt(callback.day);
    	    var remainderPanel = document.createElement("div");
            remainderPanel.setAttribute("class", "remainderPanel");
            remainderPanel.textContent = "0";
            var approved = 0;
            var pending = 0;
            var canceled = 0;
    	    if(calendarData.reservation[callback.key] != null){
    	        
    	        var userList = calendarData.reservation[callback.key];
    	        console.log(userList);
    	        
    	        for(var key in calendarData.reservation[callback.key]){
    	            
    	            console.log(calendarData.reservation[callback.key][key]);
    	            if(parseInt(calendarData.reservation[callback.key][key].scheduleUnixTime) >= calendarData.date.firstMonth && parseInt(calendarData.reservation[callback.key][key].scheduleUnixTime) <= calendarData.date.endMonth){
    	                
    	                downloadBool = true;
    	                
    	            }
    	            
    	            if (calendarData.reservation[callback.key][key].status == 'approved') {
    	                
    	                approved++;
    	                
    	            } else if (calendarData.reservation[callback.key][key].status == 'pending') {
    	                
    	                pending++;
    	                
    	            } else if (calendarData.reservation[callback.key][key].status == 'canceled') {
    	                
    	                canceled++;
    	                
    	            }
    	            
    	        }
    	        
    	        console.log("approved = " + approved + " pending = " + pending);
    	        var approvedCount = document.createElement("span");
    	        approvedCount.classList.add("approvedCount");
    	        approvedCount.textContent = approved;
    	        
    	        var pendingCount = document.createElement("span");
    	        pendingCount.classList.add("pendingCount");
    	        pendingCount.textContent = pending;
    	        
    	        if (parseInt(calendarAccount.displayDetailsOfCanceled) == 0) {
    	            
    	            remainderPanel.innerHTML = '<div class="approvedCount" style="padding-right: 0.3em;">' + approved + '</div>' + "/" + '<div class="pendingCount" style="padding-left: 0.3em;">' + pending + '</div>';
    	            
    	        } else {
    	            
    	            remainderPanel.innerHTML = '<div class="approvedCount">' + approved + '</div>' + " " + '<div class="pendingCount">' + pending + '</div>' + " " + '<div class="canceledCount">' + canceled + '</div>';
    	            
    	        }
    	        
    	        
    	        dayPanel.appendChild(remainderPanel);
    	        
    	        
    	    }
    	    
    	    var total = approved + pending;
    	    
    	    if(calendarData.schedule[callback.key] != null && calendarData.schedule[callback.key].length != 0 || total != 0){
                
    	        dayPanel.onclick = function(){
    			    	
    			    //var dayKey = parseInt(this.getAttribute("data-key"));
    			    var dayKey = parseInt(this.getAttribute("data-day"));
    			    var monthKey = parseInt(this.getAttribute("data-month"));
    			    var yearKey = parseInt(this.getAttribute("data-year"));
    			    
    			    object._buttonAction = "reservation_users";
    			    document.getElementById("reservation_users").setAttribute("class", "media_menu_item active");
                    document.getElementById("add_reservation").setAttribute("class", "media_menu_item");
    			    //setCalendarDate({month: month, day: dayKey, year: year});
    			    object.viewUserList(monthKey, dayKey, yearKey, calendarData, accountKey, function(callback){
    		        	    
    			        console.log("editPublicSchedule callback");
    			        
    			    });
    			    
    		    };
    		
    	    }else{
    	        
    	        console.log("delete class");
    	        dayPanel.classList.remove("pointer");
                dayPanel.classList.add("closeDay");
    	        
    	    }
    	    
    	});
    	
    	returnLabel.onclick = function(){
    	    
    	    if(month == 1){
    			
    			year--;
    			month = 12;
    			
    		}else{
    			
    			month--;
    			
    		}
    		
    		object.getReservationData(month, 1, year, accountKey, null);
    	    
    	};
    	
    	nextLabel.onclick = function(){
    	    
    	    if(month == 12){
    			
    			year++;
    			month = 1;
    			
    		}else{
    			
    			month++;
    			
    		}
    		
    		object.getReservationData(month, 1, year, accountKey, null);
    	    
    	};
    	
    	var form = document.createElement("form");
    	form.method = "post";
    	form.target = "_blank";
    	var post = {nonce: object._nonce_download, action: object._action, mode: object._prefix + 'getDownloadCSV', year: year, month: month, accountKey: accountKey};
        /**
        if(day != null){
            
            post.day = day;
            
        }
        **/
        for(var key in post){
            
            var hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.name = key;
            hidden.value = post[key];
            form.appendChild(hidden);
            
        }
        
        if (calendarAccount.timezone != 'none') {
            
            var timezonePanel = document.createElement("div");
            timezonePanel.setAttribute("style", "display: inline;");
            timezonePanel.textContent = object._i18n.get("Timezone") + ": " + calendarAccount.timezone;
            calendarPanel.appendChild(timezonePanel);
            
        }
        
        var submit = document.createElement("input");
        submit.type = "submit";
        submit.value = this._i18n.get("Download CSV");
        submit.setAttribute("class", "downloadButton button media-button button-primary button-large media-button-insert");
        submit.setAttribute("style", "padding: 0 0.5em;");
        if(downloadBool == false){
    	    
    	    submit.disabled = true;
    	    
    	}
        form.appendChild(submit);
        form.setAttribute("style", "display: inline;");
        calendarPanel.appendChild(form);
        
        
        
        /**
        var downloadButton = document.createElement("button");
        downloadButton.textContent = this._i18n.get("Download CSV");
        downloadButton.setAttribute("class", "downloadButton button media-button button-primary button-large media-button-insert");
        calendarPanel.appendChild(downloadButton);
        downloadButton.onclick = function(){
            
            object.downloadCSV(month, null, year, accountKey, downloadButton);
            
        }
        **/
        
    	
    	if(object._dashboardRequest.status == 1){
    	    
    	    object.viewUserList(object._dashboardRequest.month, object._dashboardRequest.day, object._dashboardRequest.year, calendarData, accountKey, function(callback){
    		        	    
                console.log("editPublicSchedule callback");
                
            });
    	    
    	}
        
    };

    this.viewUserList = function(month, day, year, calendarData, accountKey, callback){
        
        var object = this;
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
        var calendarKey = calendar.getDateKey(month, day, year);
        console.log(month + "/" + day + "/" + year);
        console.log("buttonAction = " + object._buttonAction);
        console.log(calendarData);
        //console.log(calendarData.calendar[parseInt(calendarKey)].week);
        
        
        object._hotel.resetCheckDate();
        
        var edit_title = document.getElementById("edit_title");
        edit_title.textContent = calendar.formatBookingDate(month, day, year, null, null, null, calendarData.calendar[calendarKey].week);
        var media_menu = document.getElementById("media_menu");
        media_menu.textContent = null;
        
        object._contentPanel.setAttribute("class", "media_left_zero");
        document.getElementById("menu_panel").setAttribute("class", "media_frame_menu hidden_panel");
        document.getElementById("media_title").setAttribute("class", "media_left_zero");
        document.getElementById("media_router").setAttribute("class", "media_left_zero");
        document.getElementById("frame_toolbar").setAttribute("class", "media_frame_toolbar media_left_zero");
        
        var reservation_users_callback = function(response){
            
            console.log("reservation_users_callback");
            console.log("buttonAction = " + object._buttonAction);
            console.log(response);
            console.log(month + "/" + day + "/" + year);
            if(object._buttonAction == "updateSchedule"){
                
                object.viewUserList(response.month, response.day, response.year, response.calendarData, accountKey, callback);
                
            }else if(object._buttonAction == "updateSchedule"){
                
                object.viewUserList(month, day, year, response, accountKey, callback);
                
            }else{
                
                if(response.updateDate != null){
                    
                    if(response.account.type == "day"){
                        
                        object.viewUserList(response.updateDate.month, response.updateDate.day, response.updateDate.year, response, accountKey, callback);
                        
                    }else{
                        
                        object.viewUserList(month, day, year, response, accountKey, callback);
                        
                    }
                    
                    
                }else{
                    
                    object.viewUserList(month, day, year, response, accountKey, callback);
                    
                }
                
            }
            
        };
        
        var add_reservation_callback = function(response){
            
            console.log(response);
            object._hotel.resetCheckDate();
            document.getElementById("reservation_users").setAttribute("class", "media_menu_item active");
            document.getElementById("add_reservation").setAttribute("class", "media_menu_item");
            object.viewUserList(month, day, year, response, accountKey, callback);
            
        };
        
        var changeButtonAction = function(buttonAction, mode, month, day, year, calendarData, add_reservationPanel, add_reservation_callback, callback){
            
            month = parseInt(month);
            day = parseInt(day);
            year = parseInt(year);
            //var lastDay = parseInt(calendarData.date.lastDay);
            var lastDay = 0;
            var key = parseInt(year + ("0" + month).slice(-2));
            if(calendarData.calendarList[key] != null){
                
                console.log(calendarData.calendarList[key]);
                lastDay = parseInt(calendarData.calendarList[key].lastDay);
                
            }
            var calendarChange = 0;
            object._hotel.resetCheckDate();
            
            console.log("month = " + month + " day = " + day + " year = " + year + " lastDay = " + lastDay);
            if(buttonAction == 'reservation_users' || buttonAction == 'add_reservation' || buttonAction == 'updateSchedule'){
                
                if(mode == 0){
                    
                    day--;
                    if(day == 0){
                        
                        calendarChange = 1;
                        month--;
                        day = 1;
                        if(month == 0){
                            month = 12;
                            year--;
                        }
                        
                    }
                    
                }else if(mode == 1){
                    
                    day++;
                    if(day > lastDay){
                        
                        calendarChange = 1;
                        month++;
                        day = 1;
                        if(month == 13){
                            month = 1;
                            year++;
                        }
                        
                    }
                    
                }
                
                console.log("calendarChange = " + calendarChange);
                if(calendarChange === 0){
                    
                    object.viewUserList(month, day, year, calendarData, accountKey, callback);
                    
                }else{
                    
                    object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    var post = {nonce: object._nonce, action: object._action, mode: object._prefix + 'getReservationData', year: year, month: month, day: 1, accountKey: accountKey};
                    object.setFunction("viewUserList", post);
                    new Booking_App_XMLHttp(object._url, post, object._webApp, function(calendarData){
                        
                        object._loadingPanel.setAttribute("class", "hidden_panel");
                        console.log(calendarData);
                        object.createCalendar(calendarData, calendarData.date.month, calendarData.date.day, calendarData.date.year, accountKey);
                        var day = 1;
                        if(mode === 0){day = calendarData.date.lastDay;}
                        object.viewUserList(month, day, year, calendarData, accountKey, callback);
                        object._loadingPanel.setAttribute("class", "hidden_panel");
                        
                    }, function(responseText){
                        
                        object.setResponseText(responseText);
                        
                    });
                    
                }
                
            }else{
                
                console.log("month = " + month + " day = " + day + " year = " + year);
                var calendarKey = calendar.getDateKey(month, day, year);
                console.log(calendarKey);
                console.log(calendarData.reservation[calendarKey]);
                
                var reservationList = null;
                var selectedKey = null;
                if(calendarData.account.type == "day"){
                    
                    selectedKey = object.getSelectedKey();
                    if(mode === 0){
                        
                        selectedKey--;
                        if(selectedKey < 0){
                            
                            selectedKey = calendarData.reservation[calendarKey].length - 1;
                            
                        }
                        
                    }else{
                        
                        selectedKey++;
                        if(selectedKey == calendarData.reservation[calendarKey].length){
                            
                            selectedKey = 0;
                            
                        }
                        
                    }
                    object.setSelectedKey(selectedKey);
                    reservationList = calendarData.reservation[calendarKey][selectedKey];
                    console.log("selectedKey = " + selectedKey + " count = " + calendarData.reservation[calendarKey].length);
                    
                }else{
                    
                    var key = object.getSelectedKey();
                    var visitorsList = object.getVisitors();
                    var visitorsArray = Object.keys(visitorsList);
                    console.log(object.getVisitors());
                    console.log(visitorsArray);
                    if(mode === 0){
                        
                        key--;
                        if(key < 0){
                            
                            key = visitorsArray.length - 1;
                            
                        }
                        
                    }else{
                        
                        key++;
                        if(key == visitorsArray.length){
                            
                            key = 0;
                            
                        }
                        
                    }
                    selectedKey = visitorsArray[key];
                    object.setSelectedKey(key);
                    reservationList = calendarData.reservationForHotel[visitorsList[selectedKey].checkIn][selectedKey];
                    console.log("selectedKey = " + selectedKey);
                    console.log(visitorsList[selectedKey]);
                    console.log(calendarData.reservationForHotel[visitorsList[selectedKey].checkIn][selectedKey]);
                    //return null;
                    
                }
                
                /**
                console.log("selectedKey = " + selectedKey + " count = " + calendarData.reservation[calendarKey].length);
                var reservationList = calendarData.reservation[calendarKey][selectedKey];
                **/
                object.showUserInfo(selectedKey, calendarData, reservationList, false, accountKey, reservation_users_callback);
                
            }
            
        };
        
        var reservation_usersPanel = null;
        var add_reservationPanel = null;
        if(document.getElementById("reservation_usersPanel") != null && document.getElementById("add_reservationPanel") != null){
            
            reservation_usersPanel = document.getElementById("reservation_usersPanel");
            reservation_usersPanel.textContent = null;
            add_reservationPanel = document.getElementById("add_reservationPanel");
            add_reservationPanel.textContent = null;
            
        }else{
            
            reservation_usersPanel = document.createElement("div");
            reservation_usersPanel.id = "reservation_usersPanel";
            add_reservationPanel = document.createElement("div");
            add_reservationPanel.id = "add_reservationPanel";
            object._contentPanel.appendChild(reservation_usersPanel);
            object._contentPanel.appendChild(add_reservationPanel);
            
        }
        
        
        
        var menuTabList = {reservation_users: 'Reservation users', add_reservation: 'Add reservation'};
        for(var key in menuTabList){
            
            var tabPanel = document.getElementById(key);
            tabPanel.setAttribute("data-key", key);
            tabPanel.onclick = function(){
                
                var clickKey = this.getAttribute("data-key");
                for(var key in menuTabList){
                    
                    var link = document.getElementById(key);
                    
                    if(clickKey == key){
                        
                        link.setAttribute("class", "media_menu_item active");
                        
                    }else{
                        
                        link.setAttribute("class", "media_menu_item");
                        
                    }
                    
                    if(clickKey == 'reservation_users'){
                        
                        reservation_usersPanel.setAttribute("class", "");
                        add_reservationPanel.setAttribute("class", "hidden_panel");
                        object.reservation_users(reservation_usersPanel, month, day, year, calendarData, accountKey, reservation_users_callback);
                        
                    }else if(clickKey == 'add_reservation'){
                        
                        if(document.getElementById("userInfoPanel") != null){
                            
                            var userPanel = document.getElementById("userInfoPanel");
                            if(userPanel.getAttribute("class") == "show_panel"){
                                
                                userPanel.setAttribute("class", "return_panel");
                                
                            }
                            
                        }
                        
                        if(document.getElementById("changePanel") != null){
                            
                            var changePanel = document.getElementById("changePanel");
                            if(changePanel.getAttribute("class") == "show_change_panel" || changePanel.getAttribute("class") == "return_change_panel"){
                                
                                changePanel.setAttribute("class", "return_panel");
                                
                            }
                            
                        }
                        
                        var blockPanelCount = object._contentPanel.getElementsByClassName("blockPanel");
                        for(var i = 0; i < blockPanelCount.length; i++){
                            
                            object._contentPanel.removeChild(blockPanelCount[i]);
                            
                        }
                        
                        object._hotel.reset();
                        reservation_usersPanel.setAttribute("class", "hidden_panel");
                        add_reservationPanel.setAttribute("class", "");
                        object.add_reservation(add_reservationPanel, month, day, year, calendarData, accountKey, add_reservation_callback);
                        
                        
                    }
                    
                }
                
            };
            
        }
        
        
        if(object._buttonAction == 'reservation_users' || object._buttonAction == 'updateSchedule' || object._buttonAction == 'showUserInfo'){
            
            object.reservation_users(reservation_usersPanel, month, day, year, calendarData, accountKey, reservation_users_callback);
            
        }else if(object._buttonAction == 'add_reservation'){
            
            object.add_reservation(add_reservationPanel, month, day, year, calendarData, accountKey, add_reservation_callback);
            
        }
        
        if(object._buttonAction != "updateSchedule"){
            
            object._leftButtonPanel.textContent = null;
            var beforButton = document.createElement("button");
            beforButton.id = "beforButton";
            beforButton.textContent = "navigate_before";
            beforButton.setAttribute("class", "material-icons button media-button button-primary button-large media-button-insert");
            //beforButton.setAttribute("style", "margin-left: 10px;");
            object._leftButtonPanel.appendChild(beforButton);
            
            var nextButton = document.createElement("button");
            nextButton.id = "nextButton";
            nextButton.textContent = "navigate_next";
            nextButton.setAttribute("class", "material-icons button media-button button-primary button-large media-button-insert");
            nextButton.setAttribute("style", "margin-left: 10px;");
            object._leftButtonPanel.appendChild(nextButton);
            
            var beforChangeButton = document.createElement("button");
            beforChangeButton.id = "beforChangeButton";
            beforChangeButton.setAttribute("class", "beforButton button media-button button-primary button-large media-button-insert hidden_panel");
            object._leftButtonPanel.appendChild(beforChangeButton);
            
            var nextChangeButton = document.createElement("button");
            nextChangeButton.id = "nextChangeButton";
            nextChangeButton.setAttribute("class", "nextButton button media-button button-primary button-large media-button-insert hidden_panel");
            nextChangeButton.setAttribute("style", "margin-left: 10px;");
            object._leftButtonPanel.appendChild(nextChangeButton);
            
            beforButton.onclick = function(){
                
                changeButtonAction(object._buttonAction, 0, month, day, year, calendarData, add_reservationPanel, add_reservation_callback, callback);
                
            };
            
            nextButton.onclick = function(){
                
                changeButtonAction(object._buttonAction, 1, month, day, year, calendarData, add_reservationPanel, add_reservation_callback, callback);
                
            };
            
            object.editPanelShow(true);
                
        }
        
        
        if(object._dashboardRequest.status == 1){
            
            reservation_usersPanel.setAttribute("class", "");
            add_reservationPanel.setAttribute("class", "hidden_panel");
            object.reservation_users(reservation_usersPanel, month, day, year, calendarData, accountKey, reservation_users_callback);
            
            
        }
        
        
        
        
    };
    
    this.changeStatusForDashboard = function(button, visitor){
        
        var object = this;
        console.log("changeStatusForDashboard");
        console.log(visitor);
        if (visitor.status == 'canceled') {
            
            return null;
            
        }
        
        object.changeStatus(visitor.accountKey, visitor, true, false, function(response){
            
            console.log(response);
            if (response.status == 'success') {
                
                var status = null;
                if (response.bookingStatus.toLowerCase() == 'pending') {
                    
                    button.setAttribute("class", "status pending");
                    status = "pending";
                    
                } else if (response.bookingStatus.toLowerCase() == 'approved') {
                    
                    button.setAttribute("class", "status approved");
                    status = "approved";
                    
                } else if(response.bookingStatus.toLowerCase() == 'canceled') {
                    
                    button.setAttribute("class", "status canceled");
                    status = "canceled";
                    
                }
                
                visitor.status = status;
                button.textContent = object._i18n.get(status.toUpperCase());
                console.log(visitor);
                button.setAttribute("onClick", "changeStatusForDashboard(this, " + visitor.key + ", " + visitor.accountKey + ", '" + response.bookingStatus.toLowerCase() + "', " + visitor.date.month + ", " + visitor.date.day + ", " + visitor.date.year + ")");
                
            }
            
        });
        
    };

    this.changeStatus = function(accountKey, reservation, statusClick, reload, callback){
        
        var object = this;
        var enable = false;
        var message = "";
        var confirm = new Confirm();
        console.log(object._emailEnableList);
        /**
        if (reservation.status == "approved") {
            
            message = object._i18n.get("Do you update to pending status?");
            if (Boolean(parseInt(object._emailEnableList.mail_pending.enable)) === false) {
                
                console.log("mail_pending = " + Boolean(parseInt(object._emailEnableList.mail_pending.enable)));
                enable = true;
                
            }
            
        } else if (reservation.status == "pending") {
            
            message = object._i18n.get("Do you update to approved status?");
            if (Boolean(parseInt(object._emailEnableList.mail_approved.enable)) === false) {
                
                console.log("mail_approved = " + Boolean(parseInt(object._emailEnableList.mail_approved.enable)));
                enable = true;
                
            }
            
        } else if (reservation.status == "canceled") {
            
            message = object._i18n.get("Do you update to approved status?");
            if (Boolean(parseInt(object._emailEnableList.mail_canceled_by_visitor_user.enable)) === false) {
                
                console.log("mail_approved = " + Boolean(parseInt(object._emailEnableList.mail_approved.enable)));
                enable = true;
                
            }
            
        }
        **/
        
        var status = reservation.status;
        var approvedButton = document.createElement("div");
        approvedButton.classList.add("approvedLabel");
        approvedButton.textContent = object._i18n.get("APPROVED");
        approvedButton.setAttribute("data-status", "APPROVED");
        approvedButton.setAttribute("data-close", 0);
        
        var pendingButton = document.createElement("div");
        pendingButton.classList.add("pendingLabel");
        pendingButton.textContent = object._i18n.get("PENDING");
        pendingButton.setAttribute("data-status", "PENDING");
        pendingButton.setAttribute("data-close", 0);
        
        var canceledButton = document.createElement("div");
        canceledButton.classList.add("canceledLabel");
        canceledButton.textContent = object._i18n.get("CANCELED");
        canceledButton.setAttribute("data-status", "CANCELED");
        canceledButton.setAttribute("data-close", 0);
        
        var closeButton = document.createElement("div");
        closeButton.classList.add("closeLabel");
        closeButton.textContent = object._i18n.get("close").toUpperCase();
        closeButton.setAttribute("data-status", "CANCELED");
        closeButton.setAttribute("data-close", 1);
        
        var selectButtonList = [approvedButton, pendingButton, canceledButton, closeButton];
        confirm.selectPanelShow(object._i18n.get("Change status"), selectButtonList, status, enable, function(newStatus){
            
            console.log(newStatus);
            if (newStatus != false) {
                
                enable = true;
                if (newStatus == "APPROVED" && parseInt(object._emailEnableList.mail_approved.enable) == 1) {
                    
                    console.log("mail_pending = " + Boolean(parseInt(object._emailEnableList.mail_approved.enable)));
                    enable = false;
                    
                } else if (newStatus == "PENDING" && parseInt(object._emailEnableList.mail_pending.enable) == 1) {
                    
                    console.log("mail_approved = " + Boolean(parseInt(object._emailEnableList.mail_pending.enable)));
                    enable = false;
                    
                } else if (newStatus == "CANCELED" && parseInt(object._emailEnableList.mail_canceled_by_visitor_user.enable) == 1) {
                    
                    console.log("mail_approved = " + Boolean(parseInt(object._emailEnableList.mail_canceled_by_visitor_user.enable)));
                    enable = false;
                    
                }
                
                console.log("enable = " + enable);
                
                confirm.dialogPanelShow(object._i18n.get("Confirm sending of email"), object._i18n.get("Do you send e-mail notifications to customers or administrators?"), enable, function(sendEmail){
                    
                    if (reload == true) {
                        reload = 1;
                    } else {
                        reload = 0;
                    }
                    
                    var post = {nonce: object._nonce, action: object._action, mode: 'updateStatus', key: reservation.key, oldStatus: status, newStatus: newStatus, month: reservation.date.month, year: reservation.date.year, sendEmail: Number(sendEmail), accountKey: accountKey, reload: reload};
                    console.log(post);
                    object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    object.setFunction("changeStatus", post);
                    new Booking_App_XMLHttp(object._url, post, object._webApp, function(response){
                        
                        object._loadingPanel.setAttribute("class", "hidden_panel");
                        response.bookingStatus = newStatus;
                        console.log(response);
                        if(reload == true){
                            
                            object.createCalendar(response, response.date.month, response.date.day, response.date.year, accountKey);
                            
                        }
                        statusClick = false;
                        callback(response);
                        
                        
                    }, function(responseText){
                        
                        object.setResponseText(responseText);
                        
                    });
                    
                    
                });
                
            } else {
                
                callback({statusClick: false});
                
            }
                
            
            
        });
        
        return null;
        
        
    };

    this.reservation_users = function(reservation_usersPanel, month, day, year, calendarData, accountKey, callback){
        
        var object = this;
        console.log(calendarData.account.type);
        console.log("buttonAction = " + object._buttonAction);
        if(object._buttonAction != "updateSchedule" && object._buttonAction != "showUserInfo"){
            
            object._rightButtonPanel.textContent = null;
            object._buttonAction = "reservation_users";
            
        }else{
            
            
            
        }
        
        if(document.getElementById("userInfoPanel") != null){
            
            //document.getElementById("userInfoPanel").setAttribute("class", "hidden_panel");
            
        }
        
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
        var calendarKey = calendar.getDateKey(month, day, year);
        
        var reservationList = null;
        if(calendarData.account.type == 'day'){
            
            reservationList = calendarData.reservation[parseInt(calendarKey)];
            
        }else{
            
            reservationList = calendarData.reservationForHotel;
            
        }
        
        //var reservationList = calendarData.reservation[parseInt(calendarKey)];
        console.log(object._formData);
        console.log(reservationList);
        
        reservation_usersPanel.classList.remove("hidden_panel");
        reservation_usersPanel.textContent = null;
        
        if(reservationList == null){
            
            var errorPanel = document.createElement("div");
            errorPanel.setAttribute("class", "noReservations");
            errorPanel.textContent = object._i18n.get("No visitors");
            reservation_usersPanel.appendChild(errorPanel);
            return null;
            
        }
        
        var table = document.createElement("table");
        table.setAttribute("class", "wp-list-table widefat fixed striped");
        reservation_usersPanel.appendChild(table);
        
        if(calendarData.account.type == 'day'){
            
            if(reservationList != null){
                
                for(var i = 0; i < reservationList.length; i++){
                
                    var userInfo = reservationList[i];
                    console.log(userInfo);
                    
                    var tr = document.createElement("tr");
                    tr.setAttribute("valign", "top");
                    tr.setAttribute("data-key", i);
                    table.appendChild(tr);
                    
                    var th = document.createElement("th");
                    th.setAttribute("scope", "row");
                    th.textContent = userInfo.date.hour + ":" + userInfo.date.min;
                    tr.appendChild(th);
                    
                    var status = document.createElement("div");
                    status.setAttribute("data-key", i);
                    //console.log(object._i18n.get(userInfo.status.toUpperCase()));
                    status.textContent = object._i18n.get(userInfo.status.toUpperCase());
                    var statusClassName = "pendingLabel";
                    if (userInfo.status == "approved") {
                        
                        statusClassName = "approvedLabel";
                        
                    } else if (userInfo.status == "canceled") {
                        
                        statusClassName = "canceledLabel";
                        
                    }
                    status.classList.add(statusClassName);
                    
                    var td = document.createElement("td");
                    td.setAttribute("scope", "row");
                    td.appendChild(status);
                    tr.appendChild(td);
                    
                    (function(formData, praivateData, callback){
                        
                        var sort = [];
                        for(var i = 0; i < formData.length; i++){
                            
                            if(formData[i].active != 'true'){
                                
                                continue;
                                
                            }
                            
                            if(praivateData != null){
                                
                                for(var ii = 0; ii < praivateData.length; ii++){
                                
                                    if(formData[i].id == praivateData[ii].id){
                                        
                                        sort[i] = praivateData[ii];
                                        break;
                                        
                                    }
                                    
                                }
                                
                                if(sort[i] == null){
                                    
                                    sort[i] = formData[i];
                                    
                                }
                                
                            }else{
                                
                                break;
                                
                            }
                            
                        }
                        
                        callback(sort);
                        
                    })(object._formData, userInfo.praivateData, function(praivateData){
                        
                        console.log(praivateData);
                        for(var i = 0; i < 5; i++){
                            
                            if(praivateData[i] != null){
                                
                                if(typeof praivateData[i].value == "string"){
                                    
                                    praivateData[i].value = praivateData[i].value.replace(/\\/g, "");
                                    
                                }
                                
                                var td = document.createElement("td");
                                td.textContent = praivateData[i].value;
                                tr.appendChild(td);
                                
                            }
                            
                        }
                        
                    });
                    
                    var statusClick = false;
                    if (userInfo.status != "canceled") {
                        
                        status.onclick = function(){
                            
                            var key = parseInt(this.getAttribute("data-key"));
                            console.log(key);
                            console.log(reservationList[key]);
                            statusClick = true;
                            
                            console.log(object._emailEnableList);
                            console.log("enable = " + Boolean(parseInt(object._emailEnableList.mail_new_admin.enable)));
                            
                            object.changeStatus(accountKey, reservationList[key], statusClick, true, function(response){
                                
                                console.log(response);
                                if(response.statusClick != null){
                                    
                                    statusClick = response.statusClick;
                                    
                                }else{
                                    
                                    callback(response);
                                    
                                }
                                //callback
                                
                            });
                            
                        };
                        
                    }
                    
                    
                    tr.onclick = function(){
                        
                        if(statusClick == false){
                            
                            var key = parseInt(this.getAttribute("data-key"));
                            console.log(key);
                            console.log(reservationList[key]);
                            object.setSelectedKey(key);
                            object.showUserInfo(key, calendarData, reservationList[key], true, accountKey, function(response){
                                
                                console.log(response);
                                if(response.status == "returnButton"){
                                    
                                    object.reservation_users(reservation_usersPanel, response.month, response.day, response.year, calendarData, accountKey, callback);
                                    
                                }else{
                                    
                                    callback(response);
                                    
                                }
                                
                            });
                            
                        }
                        
                    };
                    
                }
                
            }
            
        }else{
            
            var calendarArray = Object.keys(calendarData.calendar);
            var startKey = calendarData.calendar[calendarKey].number;
            var endKey = startKey + 7;
            
            if(calendarArray[endKey] == null){
                
                startKey = calendarArray.length - 7;
                endKey = calendarArray.length;
                
            }
            
            console.log("startKey = " + startKey + " endKey = " + endKey);
            console.log(calendarKey);
            console.log(calendarData.calendar);
            console.log(calendarArray);
            
            var tr = document.createElement("tr");
            tr.setAttribute("valign", "top");
            table.appendChild(tr);
            
            var visitorTr = document.createElement("tr");
            visitorTr.setAttribute("valign", "top");
            table.appendChild(visitorTr);
            
            var start = 0;
            var nights = 6;
            var end = 0;
            var left = 0;
            var visitors = {};
            calendar.setShortWeekNameBool(true);
            for(var i = startKey; i < endKey; i++){
                
                var key = calendarArray[i];
                end = key;
                var calendarInfo = calendarData.calendar[key];
                console.log("key = " + key);
                console.log(calendarInfo);
                
                
                (function(reservationList, date, start, nights, visitors){
                    
                    console.log(reservationList);
                    console.log("date = " + date);
                    console.log("start = " + start);
                    
                    for(var key in reservationList){
                        
                        var reservation = reservationList[key];
                        var id = reservation.key;
                        //console.log(reservation);
                        if(visitors[id] != null){
                            
                            var endDay = start;
                            
                            visitors[id].day++;
                            visitors[id].displayNights--;
                            visitors[id].endDay = endDay;
                            if(visitors[id].checkOut == date){
                                
                                visitors[id].checkOutBool = 1;
                                
                            }
                            console.log(visitors[id]);
                            
                        }else{
                            
                            var name = [];
                            for(var i = 0; i < reservation.praivateData.length; i++){
                                
                                var input = reservation.praivateData[i];
                                if(input.isName == "true"){
                                    
                                    name.push(input.value);
                                    
                                }
                                
                            }
                            
                            name = name.join(" ");
                            var startDay = start;
                            if(date == parseInt(reservation.date.checkIn)){
                                
                                startDay = start + 0.5;
                                
                            }
                            
                            var endDay = start;
                            if(date == parseInt(reservation.date.checkIn)){
                                
                                endDay = start - 0.5;
                                
                            }
                            
                            //visitors[id] = {key: reservation.key, day: 0, status: reservation.status, nights: reservation.accommodationDetails.nights - nights, name: name, startDay: startDay, endDay: endDay, checkIn: parseInt(reservation.date.checkIn), checkOut: parseInt(reservation.date.checkOut)};
                            visitors[id] = {key: reservation.key, day: 0, status: reservation.status, nights: reservation.accommodationDetails.nights, displayNights: reservation.accommodationDetails.nights - start, name: name, startDay: startDay, endDay: endDay, checkIn: parseInt(reservation.date.checkIn), checkOut: parseInt(reservation.date.checkOut), checkOutBool: 0};
                            
                        }
                        
                        
                        
                    }
                    
                })(reservationList[key], key, start, nights, visitors);
                start++;
                nights--;
                
                var th = document.createElement("th");
                th.classList.add("text_center");
                th.setAttribute("scope", "row");
                th.textContent = calendar.formatBookingDate(null, calendarInfo.day, null, null, null, null, calendarInfo.week);
                tr.appendChild(th);
                console.log(th.clientWidth);
                
                
                var td = document.createElement("td");
                td.setAttribute("data-key", key);
                visitorTr.appendChild(td);
                
                //reservation_usersPanel
                var dayPanel = document.createElement("div");
                dayPanel.classList.add("weekHorizotalPanel");
                dayPanel.setAttribute("style", "left: " + left + "%;");
                reservation_usersPanel.appendChild(dayPanel);
                left += 14.2;
                
            }
            
            calendar.setShortWeekNameBool(false);
            
            console.log(visitors);
            object.setVisitors(visitors);
            console.log("end = " + end);
            
            var visitorListPanel = document.createElement("div");
            visitorListPanel.classList.add("visitorListPanel");
            reservation_usersPanel.appendChild(visitorListPanel);
            
            var i = 0;
            for(var key in visitors){
                
                console.log(visitors[key]);
                var width = 14.2 * visitors[key].day;
                var left = 14.2 * visitors[key].startDay;
                if(visitors[key].checkOut > end){
                    
                    width = 14.2 * (visitors[key].day + 0.5);
                    
                    
                }
                
                console.log("key = " + key + "width = " + (width + left));
                if(visitors[key].checkOutBool == 0 && visitors[key].day == 6){
                    
                    width = 99.4 - left;
                    
                }else{
                    
                    if(visitors[key].startDay == 0){
                        
                        width += 7.1;
                        
                    }
                    
                }
                
                var visitorPanel = document.createElement("div");
                visitorPanel.setAttribute("style", "width: " + width + "%; left: " + left + "%;");
                visitorPanel.setAttribute("data-index", i);
                visitorPanel.setAttribute("data-key", key);
                visitorPanel.setAttribute("data-checkIn", visitors[key].checkIn);
                visitorPanel.classList.add("visitorPanel");
                visitorPanel.textContent = visitors[key].name;
                visitorListPanel.appendChild(visitorPanel);
                if (visitors[key].status == "pending") {
                    
                    visitorPanel.classList.add("visitorPendingPanel");
                    
                } else if (visitors[key].status == "approved") {
                    
                    visitorPanel.classList.add("visitorApprovedPanel");
                    
                } else if (visitors[key].status == "canceled") {
                    
                    visitorPanel.classList.add("visitorCanceledPanel");
                    
                }
                
                visitorPanel.onclick = function(){
                    
                    var key = this.getAttribute("data-key");
                    console.log("key = " + key);
                    console.log(visitors[key]);
                    var key = parseInt(this.getAttribute("data-key"));
                    var checkIn = parseInt(this.getAttribute("data-checkIn"));
                    var index = parseInt(this.getAttribute("data-index"));
                    object.setSelectedKey(index);
                    console.log(key);
                    console.log(reservationList[checkIn][key]);
                    object.showUserInfo(key, calendarData, reservationList[checkIn][key], true, accountKey, function(response){
                        
                        console.log(response);
                        if(response.status == "returnButton"){
                            
                            object.reservation_users(reservation_usersPanel, response.month, response.day, response.year, calendarData, accountKey, callback);
                            
                        }else{
                            
                            callback(response);
                            
                        }
                        
                    });
                    
                };
                
                i++;
                
            }
            
            
        }
        
        //console.log(th.clientWidth);
        
        if(object._dashboardRequest.status == 1){
            
            console.log(object._dashboardRequest);
            var key = 0;
            var visitorData = null;
            if(calendarData.account.type == "day"){
                
                for(var i = 0; i < reservationList.length; i++){
                    
                    var userInfo = reservationList[i];
                    if(parseInt(userInfo.key) == parseInt(object._dashboardRequest.key)){
                        
                        key = i;
                        visitorData = reservationList[key];
                        break;
                        
                    }
                    
                }
            
            }else{
                
                var checkIn = calendar.getDateKey(object._dashboardRequest.month, object._dashboardRequest.day, object._dashboardRequest.year);
                console.log("checkIn = " + checkIn);
                console.log(reservationList[checkIn]);
                key = object._dashboardRequest.key;
                visitorData = reservationList[checkIn][object._dashboardRequest.key];
                
            }
            
            object.setSelectedKey(key);
            object.showUserInfo(key, calendarData, visitorData, true, accountKey, function(response){
                
                console.log(response);
                if(response.status == "returnButton"){
                    
                    object.reservation_users(reservation_usersPanel, response.month, response.day, response.year, calendarData, accountKey, callback);
                    
                }else{
                    
                    callback(response);
                    
                }
                
            });
            object._dashboardRequest.status = 0;
            console.log(object._dashboardRequest);
            
        }
        
    };
    
    this.showUserInfo = function(key, calendarData, reservationData, animation, accountKey, callback){
        
        var object = this;
        var options = "[]";
        object._buttonAction = "showUserInfo";
        console.log("key = " + key);
        console.log("buttonAction = " + object._buttonAction);
        console.log(calendarData);
        console.log(reservationData);
        var infoPanel = null;
        if(document.getElementById("userInfoPanel") == null){
            
            infoPanel = document.createElement("div");
            infoPanel.id = "userInfoPanel";
            object._contentPanel.appendChild(infoPanel);
            
        }else{
            
            infoPanel = document.getElementById("userInfoPanel");
            
            
        }
        
        var blockPanel = null;
        if(animation === true){
            
            infoPanel.setAttribute("class", "show_panel");
            
            blockPanel = document.createElement("div");
            blockPanel.id = "showUserInfo_blockPanel";
            blockPanel.setAttribute("class", "blockPanel");
            object._contentPanel.insertBefore(blockPanel, infoPanel);
            
        }
        
        var deleteButton = document.createElement("button");
        deleteButton.id = "deleteButton";
        deleteButton.textContent = object._i18n.get("Delete", []);
        deleteButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
        
        var editButton = document.createElement("button");
        editButton.id = "editButton";
        editButton.textContent = object._i18n.get("Edit");
        editButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
        editButton.setAttribute("style", "margin-left: 10px;");
        
        object._rightButtonPanel.textContent = null;
        object._rightButtonPanel.appendChild(deleteButton);
        object._rightButtonPanel.appendChild(editButton);
        
        //document.getElementById("beforButton").classList.add("hidden_panel");
        
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
        
        infoPanel.textContent = null;
        
        var reservationDate = reservationData.date;
        var date = calendar.formatBookingDate(reservationDate.month, reservationDate.day, reservationDate.year, reservationDate.hour, reservationDate.min, reservationData.scheduleTitle, reservationData.date.week);
        
        var month = reservationData.date.month;
        var day = reservationData.date.day;
        var year = reservationData.date.year;
        
        console.log(date);
        
        var formPanel = document.createElement("div");
        formPanel.id = "inputFormPanel";
        infoPanel.appendChild(formPanel);
        
        var rowPanel = object.createRowPanel("ID", reservationData.key, null, null, null);
        formPanel.appendChild(rowPanel);
        
        var bookingTimeChange = document.createElement("div");
        bookingTimeChange.setAttribute("data-status", "1");
        bookingTimeChange.setAttribute("class", "change hidden_panel");
        bookingTimeChange.textContent = object._i18n.get("Change");
        
        var courseChange = document.createElement("div");
        courseChange.setAttribute("data-status", "1");
        courseChange.setAttribute("class", "change hidden_panel");
        courseChange.textContent = object._i18n.get("Change");
        
        
        if(calendarData.account.type == "hotel"){
            
            object._hotel.reset();
            object._hotel.setCallback(null);
            object._hotel.setNights(parseInt(reservationData.accommodationDetails.nights));
            
            var checkInDate = parseInt(reservationData.date.checkIn);
            var checkOutDate = parseInt(reservationData.date.checkOut);
            console.log("checkInDate = " + checkInDate + " checkOutDate = " + checkOutDate);
            
            var visitorsScheduleList = reservationData.accommodationDetails.scheduleDetails;
            var scheduleList = calendarData.schedule;
            for(var key in visitorsScheduleList){
                
                object._hotel.addSchedule(visitorsScheduleList[key]);
                
            }
            
            if(scheduleList[checkInDate] != null){
                
                object._hotel.setCheckIn(scheduleList[checkInDate][0]);
                
            }
            
            if(scheduleList[checkOutDate] != null){
                
                object._hotel.setCheckOut(scheduleList[checkOutDate][0]);
                
            }
            
            object._hotel.setCheckIn(reservationData.accommodationDetails.checkInSchedule);
            object._hotel.setCheckInKey(reservationData.accommodationDetails.checkInSchedule.key);
            object._hotel.setCheckOut(reservationData.accommodationDetails.checkOutSchedule);
            object._hotel.setCheckOutKey(reservationData.accommodationDetails.checkOutSchedule.key);
            
            console.log(object._hotel.getCheckDate());
            
            var statusPanel = object.createRowPanel(object._i18n.get("Status"), "", "status", "false", null);
            formPanel.appendChild(statusPanel);
            var statusLabel = document.getElementById("status");
            var className = "visitorApprovedPanel";
            var status = "APPROVED";
            if (reservationData.status == "pending") {
                
                className = "visitorPendingPanel";
                status = "PENDING";
                
            } else if (reservationData.status == "canceled") {
                
                className = "visitorCanceledPanel";
                status = "CANCELED";
                
            }
            statusLabel.classList.add(className);
            statusLabel.textContent = object._i18n.get(status);
            if (status != 'CANCELED') {
                
                statusLabel.onclick = function(){
                    
                    console.log(this);
                    if (reservationData.status != 'canceled') {
                        
                        object.changeStatus(accountKey, reservationData, null, true, function(response){
                            
                            console.log(response);
                            if(response.status == "success"){
                                
                                var className = "visitorApprovedPanel";
                                var status = object._i18n.get("APPROVED");
                                reservationData.status = "approved";
                                if (response.bookingStatus.toLowerCase() == "pending") {
                                    
                                    className = "visitorPendingPanel";
                                    status = object._i18n.get("PENDING");
                                    reservationData.status = "pending";
                                    
                                } else if (response.bookingStatus.toLowerCase() == "canceled") {
                                    
                                    className = "visitorCanceledPanel";
                                    status = object._i18n.get("CANCELED");
                                    reservationData.status = "canceled";
                                    
                                }
                                statusLabel.setAttribute("class", "value " + className);
                                statusLabel.textContent = status;
                                
                                callback(response);
                                
                            }
                            
                        });
                        
                    }
                    
                };
                
            }
            
            
            
            var visitorsDetails = object._hotel.verifySchedule(false);
            console.log(visitorsDetails);
            
            var expressionsCheck = calendar.getExpressionsCheck(calendarData.account.expressionsCheck);
            
            var date = calendar.formatBookingDate(reservationData.date.checkIn_month, reservationData.date.checkIn_day, reservationData.date.checkIn_year, null, null, null, reservationData.date.checkIn_week);
            var checkIn = object.createRowPanel(expressionsCheck.arrival, date, "checkIn", "false", null);
            formPanel.appendChild(checkIn);
            document.getElementById("checkIn").setAttribute("data-id", reservationData.scheduleKey);
            
            date = calendar.formatBookingDate(reservationData.date.checkOut_month, reservationData.date.checkOut_day, reservationData.date.checkOut_year, null, null, null, reservationData.date.checkOut_week);
            var checkOut = object.createRowPanel(expressionsCheck.departure, date, "checkOut", "false", null);
            formPanel.appendChild(checkOut);
            
             var nightsValue = reservationData.accommodationDetails.nights + " nights";
            if(reservationData.accommodationDetails.nights == 1){
                
                nightsValue = reservationData.accommodationDetails.nights + " night";
                
            }
            var totalLengthOfStay = object.createRowPanel(object._i18n.get("Total length of stay"), nightsValue, null, null, null);
            formPanel.appendChild(totalLengthOfStay);
            
            var guestsList = reservationData.accommodationDetails.guestsList;
            for(var key in guestsList){
                
                var value = "None";
                var list = guestsList[key].json;
                console.log(typeof list);
                if(typeof list == "string"){
                    
                    list = JSON.parse(list);
                    
                }else{
                    
                    guestsList[key].json = JSON.stringify(list);
                    
                }
                
                guestsList[key].type = "SELECT";
                guestsList[key].value = 0;
                guestsList[key].index = 0;
                guestsList[key].person = 0;
                object._hotel.addGuests(key, guestsList[key]);
                var values = [];
                for(var i = 0; i < list.length; i++){
                    
                    if(parseInt(list[i].selected) == 1){
                        
                        console.log(list[i].name)
                        value = list[i].name;
                        guestsList[key].value = i;
                        guestsList[key].person = parseInt(list[i].number);
                        var response = object._hotel.setGuests(key, i, list[i].number);
                        
                    }
                    
                    values.push(list[i].name);
                    
                }
                
                guestsList[key].values = values;
                object._hotel.addGuests(key, guestsList[key]);
                var guestsPanel = object.createRowPanel(guestsList[key].name, value, "guests_" + guestsList[key].key, "false", null);
                formPanel.appendChild(guestsPanel);
                
            }
            
            console.log(object._hotel.getGuestsList());
            
            if(reservationData.accommodationDetails.adult != null && reservationData.accommodationDetails.children != null){
                
                var totalNumberOfGuests = parseInt(reservationData.accommodationDetails.adult) + parseInt(reservationData.accommodationDetails.children);
                var totalNumberOfGuestsValue = 0;
                if(totalNumberOfGuests > 1){
                    
                    totalNumberOfGuestsValue = totalNumberOfGuests + " " + object._i18n.get("people");
                    
                }else if(totalNumberOfGuests == 1){
                    
                    totalNumberOfGuestsValue = totalNumberOfGuests + " " + object._i18n.get("person");
                    
                }
                
                var totalNumberOfGuestsPanel = object.createRowPanel(object._i18n.get("Total number of guests"), String(totalNumberOfGuestsValue), "totalGuests", null, null);
                formPanel.appendChild(totalNumberOfGuestsPanel);
                
            }
            
            object._hotel.setTaxes(reservationData.accommodationDetails.taxes);
            
            var summaryListPanel = document.createElement("div");
            summaryListPanel.id = "summaryListPanel";
            var summaryPanel = object.createRowPanel(object._i18n.get("Summary"), summaryListPanel, "summaryPanel", null, null);
            formPanel.appendChild(summaryPanel);
            object._hotel.showSummary(summaryListPanel, expressionsCheck);
            
            var totalPrice = object._format.formatCost(reservationData.accommodationDetails.additionalFee + reservationData.accommodationDetails.accommodationFee + reservationData.accommodationDetails.taxesFee, object._currency);
            console.log("totalPrice = " + totalPrice);
            
            var rowPanel = object.createRowPanel(object._i18n.get("Total price"), totalPrice, "totalPrice", null, null);
            formPanel.appendChild(rowPanel);
            
        }else{
            
            var date = calendar.formatBookingDate(reservationDate.month, reservationDate.day, reservationDate.year, reservationDate.hour, reservationDate.min, reservationData.scheduleTitle, reservationData.date.week);
            var rowPanel = object.createRowPanel(object._i18n.get("Booking Date"), date, "booking_date", null, bookingTimeChange);
            formPanel.appendChild(rowPanel);
            document.getElementById("booking_date").setAttribute("data-key", reservationData.scheduleKey);
            document.getElementById("booking_date").setAttribute("data-unixTime", reservationData.scheduleUnixTime);
            
            var cost = 0;
            if(reservationData.options.length > 0){
                
                var serviceCost = 0;
                var hasMultipleServices = false;
                for (var key in reservationData.options) {
                    
                    var service = reservationData.options[key];
                    if (parseInt(service.service) == 1) {
                        
                        hasMultipleServices = true;
                        cost += parseInt(service.cost);
                        for (var optionKey in service.options) {
                            
                            var option = service.options[optionKey];
                            if (parseInt(option.selected) == 1) {
                                
                                cost += parseInt(option.cost);
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
                if (serviceCost > 0) {
                    
                    //reservationData.courseCost = serviceCost;
                    
                }
                
                console.log("serviceCost = " + serviceCost);
                
                var courseCostPanel = null;
                console.log(parseInt(reservationData.courseCost));
                if (parseInt(reservationData.courseCost) > 0) {
                    
                    courseCostPanel = document.createElement("span");
                    courseCostPanel.classList.add("planPrice");
                    courseCostPanel.textContent = object._format.formatCost(reservationData.courseCost, reservationData.currency);
                    
                }
                
                var rowPanel = object.createRowPanel(object._courseName, "", "booking_course", null, courseChange);
                var valuePanel = rowPanel.getElementsByClassName("value")[0];
                valuePanel.textContent = null;
                
                var coursePanel = document.createElement("div");
                coursePanel.classList.add("mainPlan");
                valuePanel.appendChild(coursePanel);
                
                var courseNamePanel = document.createElement("span");
                courseNamePanel.classList.add("planName");
                courseNamePanel.textContent = reservationData.courseName;
                coursePanel.appendChild(courseNamePanel);
                if (courseCostPanel != null && hasMultipleServices === false) {
                    
                    coursePanel.appendChild(courseCostPanel);
                    
                }
                
                if (reservationData.options != "") {
                    
                    //var options = JSON.parse(reservationData.options);
                    if (hasMultipleServices == true) {
                        
                        var services = reservationData.options;
                        for (var key in services) {
                            
                            services[key].selected = 1;
                            
                        }
                        object.createServicesPanel(coursePanel, services, "options", reservationData.currency);
                        
                    } else {
                        
                        var options = reservationData.options;
                        if (options.length > 0) {
                            
                            var ul = document.createElement("ul");
                            valuePanel.appendChild(ul);
                            for(var i = 0; i < options.length; i++){
                                
                                var option = options[i];
                                if (parseInt(option.selected) == 1) {
                                    
                                    cost += parseInt(option.cost);
                                    
                                    var optionNamePanel = document.createElement("span");
                                    optionNamePanel.classList.add("planName");
                                    optionNamePanel.textContent = option.name;
                                    
                                    var optionPricePanel = document.createElement("span");
                                    optionPricePanel.classList.add("planPrice");
                                    if (parseInt(option.cost) > 0) {
                                        
                                        optionPricePanel.textContent = object._format.formatCost(option.cost, reservationData.currency);
                                        
                                    }
                                    
                                    var li = document.createElement("li");
                                    li.appendChild(optionNamePanel);
                                    li.appendChild(optionPricePanel);
                                    ul.appendChild(li);
                                    
                                }
                                
                            }
                            
                        } else {
                            
                            console.error("option = " + option);
                            
                        }
                        
                    }
                    
                    
                    
                    
                }
                
                console.log(reservationData.options);
                formPanel.appendChild(rowPanel);
                document.getElementById("booking_course").setAttribute("data-key", reservationData.courseKey);
                document.getElementById("booking_course").setAttribute("data-time", reservationData.courseTime);
                if (object.getServiceOrOption(reservationData.options) == 'service') {
                    
                    document.getElementById("booking_course").setAttribute("data-key", "multipleServices");
                    
                }
                
            }
            
            
            if(reservationData.scheduleCost != null){
                
                cost += parseInt(reservationData.scheduleCost);
                
            }
            
            if(reservationData.courseCost != null){
                
                cost += parseInt(reservationData.courseCost);
                
            }
            
            var surchargePanel = object.createRowPanel("Surcharge", "", null, null, null);
            surchargePanel.id = "surchargeTaxTitle";
            var taxePanel = object.createRowPanel("Tax", "", null, null, null);
            
            var taxes = new TAXES(object._i18n, reservationData.currency);
            taxes.setTaxes(reservationData.taxes);
            taxes.taxesDetails(cost, formPanel, surchargePanel, taxePanel);
            var responseTaxes = taxes.getTaxes();
            console.log(responseTaxes);
            for (var key in responseTaxes) {
                
                var tax = responseTaxes[key];
                if (tax.active != 'true') {
                    
                    continue;
                    
                }
                
                if ((tax.type == 'tax' && tax.tax == 'tax_exclusive') || tax.type == 'surcharge') {
                    
                    cost += parseInt(tax.taxValue);
                    
                }
                
            }
            
            if(cost != 0){
                
                cost = object._format.formatCost(cost, reservationData.currency);
                var rowPanel = object.createRowPanel(object._i18n.get("Total amount"), cost, "booking_cost", null, null);
                formPanel.appendChild(rowPanel);
                
            }
            
        }
        
        
        
        if(reservationData.payId == "stripe" || reservationData.payId == "paypal"){
            
            var rowPanel = object.createRowPanel("Charge ID of " + reservationData.payName, reservationData.payToken, "booking_cost", null, null);
            formPanel.appendChild(rowPanel);
            
        }
        
        var formPanelList = [];
        var formData = reservationData.praivateData;
        if(formData != null){
            
            for(var i = 0; i < formData.length; i++){
                
                var rowPanel = object.createRowPanel(formData[i]['name'], formData[i]['value'], null, null, null);
                rowPanel.setAttribute("data-key", i);
                if(formData[i].active != null && formData[i].active != 'true'){
                    
                    //continue;
                    rowPanel.classList.add("hidden_panel");
                    
                }
                formPanel.appendChild(rowPanel);
                formPanelList.push(rowPanel);
                
            }
            
        }
        
        var cancelToEdit = function(){
            
            bookingTimeChange.classList.add("hidden_panel");
            bookingTimeChange.setAttribute("data-status", "1");
            bookingTimeChange.textContent = object._i18n.get("Change");
            courseChange.classList.add("hidden_panel");
            courseChange.setAttribute("data-status", "1");
            courseChange.textContent = object._i18n.get("Change");
            
            
            var date = calendar.formatBookingDate(reservationData.date.month, reservationData.date.day, reservationData.date.year, reservationData.date.hour, reservationData.date.min, reservationData.scheduleTitle, reservationData.date.week);
            if(document.getElementById("booking_date") != null){
                
                console.log("date = " + date);
                var dateLabel = document.getElementById("booking_date");
                dateLabel.setAttribute("data-key", reservationData.scheduleKey);
                dateLabel.setAttribute("data-unixTime", reservationData.scheduleUnixTime);
                dateLabel.textContent = date;
                
            }
            
            if(reservationData.courseKey != null && reservationData.courseTime != null && document.getElementById("booking_course") != null){
                
                console.log(reservationData);
                var courseLabel = document.getElementById("booking_course");
                courseLabel.setAttribute("data-key", reservationData.courseKey);
                courseLabel.setAttribute("data-time", reservationData.courseTime);
                courseLabel.textContent = reservationData.courseName;
                
            }
            
            if(document.getElementById("booking_cost") != null){
                            
                var cost = object._format.formatCost(reservationData.courseCost, reservationData.currency);
                document.getElementById("booking_cost").textContent = cost;
                
            }
            
            document.getElementById("beforButton").classList.remove("hidden_panel");
            document.getElementById("nextButton").classList.remove("hidden_panel");
            document.getElementById("beforChangeButton").classList.add("hidden_panel");
            document.getElementById("nextChangeButton").classList.add("hidden_panel");
            
            var responseData = {};
            if(calendarData.account.type == "hotel"){
                
                var guestsList = object._hotel.getGuestsList();
                for(var key in guestsList){
                    
                    console.log(guestsList[key]);
                    var guestsParentPanel = document.getElementById("guests_" + key).parentElement;
                    var guestsPanel = document.getElementById("guests_" + key);
                    var guestsSelectPanel = document.getElementById("select_guests_" + key);
                    guestsPanel.classList.remove("hidden_panel");
                    console.log(guestsSelectPanel);
                    if(guestsSelectPanel != null){
                        
                        guestsParentPanel.removeChild(guestsSelectPanel);
                        
                    }
                    
                }
                
                var totalNumberOfGuests = parseInt(reservationData.accommodationDetails.adult) + parseInt(reservationData.accommodationDetails.children);
                if(totalNumberOfGuestsPanel != null){
                    
                    totalNumberOfGuestsPanel.classList.remove("errorPanel");
                    document.getElementById("totalGuests").textContent = totalNumberOfGuests;
                    
                }
                
                
            }else{
                
                var edit_title = document.getElementById("edit_title");
                edit_title.textContent = calendar.formatBookingDate(reservationData.date.month, reservationData.date.day, reservationData.date.year, null, null, null, reservationData.date.week);
                
            }
            
            console.log(calendarData);
            console.log(reservationData);
            
            month = reservationData.date.month;
            day = reservationData.date.day;
            year = reservationData.date.year;
            responseData = {status: "returnButton", month: month, day: day, year: year, calendarData: calendarData};
            
        };
        
        if(blockPanel != null){
            
            blockPanel.onclick = function(event){
                
                console.log("blockPanel click");
                object._buttonAction = "reservation_users";
                object._rightButtonPanel.textContent = null;
                if(document.getElementById("changePanel") != null){
                    
                    document.getElementById("changePanel").setAttribute("class", "return_panel");
                    
                }
                infoPanel.setAttribute("class", "return_panel");
                object._contentPanel.removeChild(blockPanel);
                
                cancelToEdit();
                
                
            }
            
        }
        
        var object = this;
        editButton.onclick = function(){
            
            options = reservationData.options;
            object.setVisitorServices(options);
            console.log(options);
            document.getElementById("beforButton").classList.add("hidden_panel");
            document.getElementById("nextButton").classList.add("hidden_panel");
            
            bookingTimeChange.classList.remove("hidden_panel");
            courseChange.classList.remove("hidden_panel");
            
            /**
             * var extensionsFunction = new ExtensionsFunction();
            extensionsFunction.edtiBookingUser(object, editButton, deleteButton, rightButtonPanel, formPanel, changePanel, reservationDate, reservationData, formPanelList, formData, function(response){
                
                rightButtonPanel.textContent = null;
                response.action = 'refresh';
                buttonAction = "reservation_users";
                createCalendar(response, response.date.month, response.date.day, response.date.year);
                callback(response);
                
            });
            return null;
            **/
            
            editButton.setAttribute("class", "hidden_panel");
            deleteButton.setAttribute("class", "hidden_panel");
            
            var returnButton = document.createElement("button");
            returnButton.id = "returnButton";
            returnButton.textContent = object._i18n.get("Return");
            returnButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
            returnButton.setAttribute("style", "margin-left: 10px;");
            object._rightButtonPanel.appendChild(returnButton);
            
            var saveButton = document.createElement("button");
            saveButton.id = "saveButton";
            saveButton.textContent = object._i18n.get("Save");
            saveButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
            saveButton.setAttribute("style", "margin-left: 10px;");
            object._rightButtonPanel.appendChild(saveButton);
            
            var inputPanelList = {};
            var inputData = {};
            var input = new Input();
            
            if(calendarData.account.type == "hotel"){
                
                /**
                var value = input.createInput(i, form, inputData, null);
                var rowPanel = createRowPanel(form.name, value, null, form.required, null);
                **/
                var visitorsDetails = object._hotel.verifySchedule(false);
                console.log(visitorsDetails);
                if(visitorsDetails.status == true){
                    
                    var guestsList = object._hotel.getGuestsList();
                    for(var key in guestsList){
                        
                        console.log(guestsList[key]);
                        var value = input.createInput(key, guestsList[key], inputData, function(event){
                            
                            var key = this.parentElement.getAttribute("data-guset");
                            var index = parseInt(this.selectedIndex);
                            var list = JSON.parse(guestsList[key].json);
                            guestsList[key].index = index;
                            var response = object._hotel.setGuests(key, index, list[index].number);
                            var feeList = object._hotel.getFeeList();
                            document.getElementById("totalGuests").textContent = response.person;
                            if(response.booking == false || response.nights == 0 || response.requiredGuests == false){
                                
                                saveButton.disabled = true;
                                
                            }else{
                                
                                saveButton.disabled = false;
                                
                            }
                            
                            totalNumberOfGuestsPanel.classList.remove("errorPanel");
                            if(response.booking == false){
                                
                                totalNumberOfGuestsPanel.classList.add("errorPanel");
                            
                            }
                            
                            console.log(totalNumberOfGuestsPanel);
                            
                            console.log(response);
                            console.log(this.selectedIndex);
                            console.log(guestsList[key]);
                            console.log(list[index]);
                            
                        });
                        value.id = "select_guests_" + key;
                        value.setAttribute("data-guset", key);
                        console.log(value);
                        var guestsParentPanel = document.getElementById("guests_" + key).parentElement;
                        var guestsPanel = document.getElementById("guests_" + key);
                        guestsPanel.classList.add("hidden_panel");
                        guestsParentPanel.appendChild(value);
                        console.log(guestsPanel);
                        guestsPanel = value;
                        
                    }
                    
                }
                
                
            }
            
            
            for(var i = 0; i < formPanelList.length; i++){
                
                //var key = parseInt(formPanelList[i].getAttribute("data-key"));
                var form = formData[i];
                console.log(i + " name = " + form.name);
                formPanel.removeChild(formPanelList[i]);
                var value = input.createInput(i, form, inputData, null);
                var rowPanel = object.createRowPanel(form.name, value, null, form.required, null);
                if(form.active != 'true'){
                    
                    rowPanel.classList.add("hidden_panel");
                    
                }
                inputPanelList[i] = rowPanel;
                //inputPanelList.push(rowPanel);
                formPanel.appendChild(rowPanel);
                
            }
            
            console.log(formPanelList);
            saveButton.onclick = function(){
                
                var date = {month: (reservationDate.month + 1), day: reservationDate.day, year: reservationDate.year};
                var schedule = {key: reservationData.scheduleKey, unixTime: reservationData.scheduleUnixTime};
                var course = {key: reservationData.courseKey};
                if(reservationData.courseKey == null){
                    course = null
                }
                
                var valueList = {};
                var post = object.verifyForm("updateBooking", object._nonce, object._action, date, schedule, course, formData, inputPanelList, inputData, valueList);
                var booking_date = null;
                if(calendarData.account.type == "day"){
                    
                    booking_date = document.getElementById("booking_date").getAttribute("data-key");
                    
                }else{
                    
                    booking_date = document.getElementById("checkIn").getAttribute("data-id");
                    
                }
                console.log(booking_date);
                if(booking_date != reservationData.scheduleKey){
                    
                    post['update_booking_date'] = booking_date;
                    
                }
                
                
                if(calendarData.account.type == "hotel"){
                    
                    post.json = JSON.stringify(object._hotel.verifySchedule(false));
                    
                }
                
                //if (document.getElementById("booking_course") != null && document.getElementById("booking_course").getAttribute("data-key") != reservationData.courseKey) {
                if (document.getElementById("booking_course") != null) {
                    
                    var booking_course = document.getElementById("booking_course").getAttribute("data-key");
                    console.log(booking_course);
                    post['update_booking_course'] = booking_course;
                    
                }
                
                post.month = parseInt(month);
                post.day = parseInt(day);
                post.year = year;
                if(options == null) {
                    
                    options = "[]";
                    
                }
                post.options = options;
                console.log(typeof options);
                var visitorServices = object.getVisitorServices();
                if (typeof visitorServices == "object") {
                    
                    var services = [];
                    for (var key in object._courseList) {
                        
                        var service = object._courseList[key];
                        for (var visitorKey in visitorServices) {
                            
                            var visitorService = visitorServices[visitorKey];
                            if (parseInt(service.key) == parseInt(visitorService.key) && parseInt(visitorService.selected) == 1) {
                                
                                visitorService.options = visitorService.selectedOptionsList;
                                console.log(visitorService);
                                services.push(visitorService);
                                
                            }
                            
                        }
                        
                        
                    }
                    
                    post.options = JSON.stringify(services);
                    
                }
                console.log(post);
                //return null;
                
                if (post !== false) {
                    
                    
                    object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    post.accountKey = accountKey;
                    post.updateKey = reservationData.key;
                    console.log(post);
                    new Booking_App_XMLHttp(object._url, post, object._webApp, function(response){
                        
                        console.log(response);
                        if (response.status == "success") {
                            
                            object._hotel.reset();
                            object._hotel.setCallback(null);
                            var updateDate = {month: parseInt(month), day: parseInt(day), year: year};
                            response.updateDate = updateDate;
                            
                            object._rightButtonPanel.textContent = null;
                            response.action = 'refresh';
                            object._buttonAction = "reservation_users";
                            object.createCalendar(response, response.date.month, response.date.day, response.date.year, accountKey);
                            callback(response);
                            object._contentPanel.removeChild(blockPanel);
                            infoPanel.setAttribute("class", "return_panel");
                            if (document.getElementById("changePanel") != null) {
                    
                                document.getElementById("changePanel").setAttribute("class", "return_panel");
                                
                            }
                            
                        } else {
                            
                            if (response.message != null) {
                                
                                alert(response.message);
                                
                            } else {
                                
                                alert(response);
                                
                            }
                            
                            
                        }
                        object._loadingPanel.setAttribute("class", "hidden_panel");
                        
                    }, function(responseText){
                        
                        object.setResponseText(responseText);
                        
                    });
                    
                }
                
            }
            
            returnButton.onclick = function(){
                
                var edit_title = document.getElementById("edit_title");
                edit_title.textContent = calendar.formatBookingDate(reservationData.date.month, reservationData.date.day, reservationData.date.year, null, null, null, null);
                
                if(document.getElementById("changePanel") != null && document.getElementById("changePanel").getAttribute("class") != "return_panel"){
                    
                    document.getElementById("changePanel").setAttribute("class", "return_change_panel");
                    
                }
                
                /**
                var date = formatBookingDate(dateFormat, reservationData.date.month, reservationData.date.day, reservationData.date.year, reservationData.date.hour, reservationData.date.min, reservationData.scheduleTitle, null);
                var dateLabel = document.getElementById("booking_date");
                dateLabel.setAttribute("data-key", reservationData.scheduleKey);
                dateLabel.setAttribute("data-unixTime", reservationData.scheduleUnixTime);
                dateLabel.textContent = date;
                
                //document.getElementById("booking_course").setAttribute("data-time", reservationData.courseTime);
                var courseLabel = document.getElementById("booking_course");
                courseLabel.setAttribute("data-key", reservationData.courseKey);
                courseLabel.setAttribute("data-time", reservationData.courseTime);
                courseLabel.textContent = reservationData.courseName;
                
                document.getElementById("beforButton").classList.remove("hidden_panel");
                document.getElementById("nextButton").classList.remove("hidden_panel");
                document.getElementById("beforChangeButton").classList.add("hidden_panel");
                document.getElementById("nextChangeButton").classList.add("hidden_panel");
                **/
                
                object._rightButtonPanel.removeChild(returnButton);
                object._rightButtonPanel.removeChild(saveButton);
                editButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
                deleteButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
                for(var key in inputPanelList){
                    
                    formPanel.removeChild(inputPanelList[key]);
                    //var form = formData[i];
                    var rowPanel = object.createRowPanel(formData[key]['name'], formData[key]['value'], null, null, null);
                    if(formData[key].active != 'true'){
                        
                        rowPanel.classList.add("hidden_panel");
                        
                    }
                    formPanelList[key] = rowPanel;
                    formPanel.appendChild(rowPanel);
                
                }
                
                /**
                console.log(calendarData);
                console.log(reservationData);
                month = reservationData.date.month;
                day = reservationData.date.day;
                year = reservationData.date.year;
                var responseData = {status: "returnButton", month: month, day: day, year: year, calendarData: calendarData};
                //buttonAction = "reservation_users";
                callback(responseData);
                **/
                
                cancelToEdit();
                object._buttonAction = "showUserInfo";
                
            }
            
            
        }
        
        deleteButton.onclick = function(){
            
            console.log(object._emailEnableList);
            console.log("enable = " + Boolean(parseInt(object._emailEnableList.mail_deleted.enable)));
            
            var enable = false;
            if(Boolean(parseInt(object._emailEnableList.mail_deleted.enable)) === false){
                
                enable = true;
                
            }
            console.log("enable = " + enable);
            
            var confirm = new Confirm();
            
            var refoundBool = true;
            if(reservationData.payToken != null && reservationData.payToken.length != 0){
                
                refoundBool = false;
                
            }
            console.log(reservationData.payToken);
            
            confirm.dialogPanelShow(object._i18n.get("Refund confirmation"), object._i18n.get("This booking has been paid by credit card. Do you refund the price to the customer?"), refoundBool, function(refoundValue){
                
                console.log("refoundValue = " + refoundValue);
                confirm.dialogPanelShow(object._i18n.get("Confirm sending of email"), object._i18n.get("Do you send e-mail notifications to customers or administrators?"), enable, function(sendEmail){
                    
                    console.log("sendEmail = " + sendEmail);
                    console.log("sendEmail = " + parseInt(sendEmail));
                    confirm.dialogPanelShow(object._i18n.get("Confirm deletion of data"), object._i18n.get("Are you sure you want to delete this booking?"), false, function(result){
                        
                        console.log(result);
                        if(result == true){
                            
                            object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object._nonce, action: object._action, mode: 'deleteBookingData', key: reservationData.key, sendEmail: Number(sendEmail), refound: Number(refoundValue), accountKey: accountKey};
                            new Booking_App_XMLHttp(object._url, post, object._webApp, function(response){
                                
                                console.log(response);
                                if(response.status == 'success'){
                                    
                                    object._hotel.reset();
                                    object._hotel.setCallback(null);
                                    object._rightButtonPanel.textContent = null;
                                    console.log(blockPanel);
                                    if(blockPanel != null){
                                        
                                        object._contentPanel.removeChild(blockPanel);
                                        
                                    }
                                    
                                    infoPanel.setAttribute("class", "return_panel");
                                    if(document.getElementById("changePanel") != null){
                                        
                                        document.getElementById("changePanel").setAttribute("class", "return_panel");
                                        
                                    }
                                    object._buttonAction = "reservation_users";
                                    object.createCalendar(response, response.date.month, response.date.day, response.date.year, accountKey);
                                    callback(response);
                                    
                                }else{
                                    
                                    window.alert(response.message);
                                    
                                }
                                object._loadingPanel.setAttribute("class", "hidden_panel");
                                
                            }, function(responseText){
                                
                                object.setResponseText(responseText);
                                
                            });
                            
                        }
                        
                    });
                    
                });
                
            });
            
            
            
            
        }
        
        var month = reservationData.date.month;
        var day = reservationData.date.day;
        var year = reservationData.date.year;
        var confirm = new Confirm;
        
        bookingTimeChange.onclick = function(){
            
            console.log(options);
            if(typeof ExtensionsFunction != "function"){
                
                confirm.alertPanelShow(object._i18n.get("Warning"), object._i18n.get("Please upgrade your free plan to enable this feature."), false, null);
                return null;
                
            }
            
            var data_status = parseInt(bookingTimeChange.getAttribute("data-status"));
            if(data_status == 1){
                
                data_status = 0;
                bookingTimeChange.textContent = object._i18n.get("Change");
                courseChange.classList.add("hidden_panel");
                object.createToChangePanelForTimeOrCourse(month, day, year, reservationData, calendarData, "date", options, accountKey, function(response){
                    
                    console.log("bookingTimeChange.onclick");
                    console.log(response);
                    if(response.status == "statusButton"){
                        
                        calendarData = response.calendarData;
                        bookingTimeChange.setAttribute("data-status", response.value);
                        bookingTimeChange.textContent = object._i18n.get("Change");
                        courseChange.classList.remove("hidden_panel");
                        document.getElementById("beforChangeButton").classList.add("hidden_panel");
                        document.getElementById("nextChangeButton").classList.add("hidden_panel");
                        
                    }else if(response.status == "statusButton"){
                        
                        
                        
                    }else{
                        
                        if(response.month != null && response.day != null && response.year != null){
                            
                            month = response.month;
                            day = response.day;
                            year = response.year;
                            
                        }
                        
                        calendarData = response.calendarData;
                        callback(response);
                        
                    }
                    
                    
                });
                
            }else{
                
                data_status = 1;
                bookingTimeChange.textContent = object._i18n.get("Change");
                courseChange.classList.remove("hidden_panel");
                document.getElementById("beforButton").classList.add("hidden_panel");
                document.getElementById("nextButton").classList.add("hidden_panel");
                document.getElementById("beforChangeButton").classList.remove("hidden_panel");
                document.getElementById("nextChangeButton").classList.remove("hidden_panel");
                document.getElementById("changePanel").setAttribute("class", "return_change_panel");
                
            }
            bookingTimeChange.setAttribute("data-status", data_status);
            
            
        }
        
        
        courseChange.onclick = function(){
            
            console.log(options);
            if(typeof ExtensionsFunction != "function"){
                
                confirm.alertPanelShow(object._i18n.get("Warning"), object._i18n.get("Please upgrade your free plan to enable this feature."), false, null);
                return null;
                
            }
            
            var data_status = parseInt(courseChange.getAttribute("data-status"));
            if(data_status == 1){
                
                data_status = 0;
                courseChange.textContent = object._i18n.get("Change");
                bookingTimeChange.classList.add("hidden_panel");
                object.createToChangePanelForTimeOrCourse(month, day, year, reservationData, calendarData, "course", options, accountKey, function(response){
                    
                    console.log(response);
                    if(response.status == "statusButton"){
                        
                        console.log(options);
                        options = response.options;
                        console.log(options);
                        calendarData = response.calendarData;
                        courseChange.setAttribute("data-status", response.value);
                        courseChange.textContent = object._i18n.get("Change");
                        bookingTimeChange.classList.remove("hidden_panel");
                        
                    }else if(response.status == "statusButton"){
                        
                        
                        
                    }else{
                        
                        if(response.month != null && response.day != null && response.year != null){
                            
                            month = response.month;
                            day = response.day;
                            year = response.year;
                            
                        }
                        
                        calendarData = response.calendarData;
                        callback(response);
                        
                    }
                    
                    
                });
                
            }else{
                
                data_status = 1;
                courseChange.textContent = object._i18n.get("Change");
                bookingTimeChange.classList.remove("hidden_panel");
                document.getElementById("beforButton").classList.add("hidden_panel");
                document.getElementById("nextButton").classList.add("hidden_panel");
                document.getElementById("changePanel").setAttribute("class", "return_change_panel");
                
            }
            courseChange.setAttribute("data-status", data_status);
            
        }
        
    }
    
    this.createToChangePanelForTimeOrCourse = function(month, day, year, reservationData, calendarData, changeAction, options, accountKey, callback){
        
        var object = this;
        var preparation = JSON.parse(reservationData.preparation);
        console.log("month = " + month + " day = " + day + " year = " + year);
        console.log(reservationData);
        console.log(preparation);
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
    	var calendarKey = calendar.getDateKey(month, day, year);
        object._nationalHoliday = calendarData.nationalHoliday.calendar;
        
        var edit_title = document.getElementById("edit_title");
        edit_title.textContent = calendar.formatBookingDate(month, day, year, null, null, null, calendarData.calendar[calendarKey].week);
        
        var changePanel = null;
        if(document.getElementById("changePanel") == null){
            
            changePanel = document.createElement("div");
            changePanel.id = "changePanel";
            object._contentPanel.appendChild(changePanel);
            
        }else{
            
            changePanel = document.getElementById("changePanel");
            
        }
        changePanel.classList.add("hidden_panel");
        document.getElementById("beforButton").classList.add("hidden_panel");
        document.getElementById("nextButton").classList.add("hidden_panel");
        var beforChangeButton = document.getElementById("beforChangeButton");
        var nextChangeButton = document.getElementById("nextChangeButton");
        
        if(changeAction == "date"){
            object._buttonAction = "updateSchedule";
            beforChangeButton.classList.remove("hidden_panel");
            nextChangeButton.classList.remove("hidden_panel");
        }else{
            object._buttonAction = "showUserInfo";
        }
        
        var changeButtonAction = function(mode, month, day, year, calendarData){
            
            console.log("mode = " + mode);
            console.log("buttonAction = " + object._buttonAction);
            if(object._buttonAction != 'updateSchedule'){
                
                return null;
                
            }
            
            month = parseInt(month);
            day = parseInt(day);
            year = parseInt(year);
            var lastDay = parseInt(calendarData.date.lastDay);
            
            console.log("month = " + month + " day = " + day + " year = " + year + " lastDay = " + lastDay);
            var date = object.verifyCalendar(mode, month, day, year, lastDay);
            if(date.calendarChange === 0){
                
                object.createToChangePanelForTimeOrCourse(date.month, date.day, date.year, reservationData, calendarData, changeAction, JSON.stringify(options), accountKey, callback);
                callback({month: date.month, day: date.day, year: date.year, calendarData: calendarData});
                
            }else{
                
                object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
                var post = {nonce: object._nonce, action: object._action, mode: object._prefix + 'getReservationData', year: date.year, month: date.month, day: 1, accountKey: accountKey};
                new Booking_App_XMLHttp(object._url, post, object._webApp, function(calendarData){
                    
                    object._loadingPanel.setAttribute("class", "hidden_panel");
                    console.log(calendarData);
                    var day = 1;
                    if(mode === 0){day = calendarData.date.lastDay;}
                    object.createToChangePanelForTimeOrCourse(date.month, day, date.year, reservationData, calendarData, changeAction, JSON.stringify(options), accountKey, callback);
                    callback({month: date.month, day: day, year: date.year, calendarData: calendarData});
                    object._loadingPanel.setAttribute("class", "hidden_panel");
                    
                }, function(responseText){
                    
                    object.setResponseText(responseText);
                    
                });
                
            }
            
        }
        
        changePanel.textContent = null;
        changePanel.setAttribute("class", "show_change_panel");
        //var day = reservationData.date.day;
        var dateLabel = document.getElementById("booking_date");
        var courseLabel = document.getElementById("booking_course");
        var courseTime = null;
        var courseKey = null;
        if(courseLabel != null){
            
            courseTime = parseInt(courseLabel.getAttribute("data-time"));
            courseKey = parseInt(courseLabel.getAttribute("data-key"));
            
        }
        
        if(options != null) {
            
            if (options.length == 0) {
                
                courseTime = 0;
                
            }
            
            if (object.getServiceOrOption(options) == 'service') {
                
                courseTime = 0;
                options = object.getVisitorServices();
                
            }
            
            //var options = JSON.parse(options);
            for (var key in options) {
                
                var service = options[key];
                console.log(service);
                if (service.service != null && parseInt(service.service) == 1) {
                    
                    if (parseInt(service.selected) == 1) {
                        
                        if (courseTime == null) {
                            
                            courseTime = parseInt(service.time);
                            
                        } else {
                            
                            courseTime += parseInt(service.time);
                            
                        }
                        
                        if(typeof service.options == 'string') {
                            
                            service.options = JSON.parse(service.options);
                            
                        }
                        
                        for (var optionKey in service.options) {
                            
                            var option = service.options[optionKey];
                            console.log(option);
                            if (parseInt(option.selected) == 1) {
                                
                                if (courseTime == null) {
                                    
                                    courseTime = parseInt(option.time);
                                    
                                } else {
                                    
                                    courseTime += parseInt(option.time);
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                } else{
                    
                    var option = options[key];
                    if (parseInt(option.selected) == 1) {
                        
                        if (courseTime == null) {
                            
                            courseTime = parseInt(option.time);
                            
                        } else {
                            
                            courseTime += parseInt(option.time);
                            
                        }
                        
                    }
                    
                }
                
            }
            /**
            for(var i = 0; i < options.length; i++){
                
                var option = options[i];
                if(parseInt(option.selected) == 1) {
                    
                    if(courseTime == null) {
                        
                        courseTime = parseInt(option.time);
                        
                    } else {
                        
                        courseTime += parseInt(option.time);
                        
                    }
                    
                }
                
            }
            **/
            
        }
        
        console.log("courseTime = " + courseTime);
        //var extensionsFunction = new ExtensionsFunction();
        //var response = extensionsFunction.preparToUpdateSchedule(reservationData, calendarData, parseInt(courseTime), changeAction);
        var response = object.preparToUpdateSchedule(reservationData, calendarData, parseInt(courseTime), changeAction, preparation);
        var updateSchedule = response.schedule;
        var scheduleAll = response.scheduleAll;
        day = parseInt(day);
        console.log(calendarData);
        console.log("day = " + parseInt(day));
        console.log(updateSchedule);
        console.log(updateSchedule[calendarKey]);
        console.log(reservationData);
        var timeToProvide = [];
        for(var i = 0; i < object._courseList.length; i++){
            
            if(parseInt(object._courseList[i].key) == courseKey) {
                
                timeToProvide = object._courseList[i].timeToProvide;
                break;
                
            }
            
        }
        console.log(timeToProvide);
        
        var dateLabel = document.getElementById("booking_date");
        
        if(changeAction == "date"){
            
            if(updateSchedule[calendarKey].length == 0){
                
                console.error("error = schedule zero");
                var errorPanel = document.createElement("div");
                errorPanel.setAttribute("class", "noSchedule");
                errorPanel.textContent = object._i18n.get("No schedules");
                changePanel.appendChild(errorPanel);
                
            }
            
            var calendarKey = calendar.getDateKey(month, day, year);
            console.log(object._nationalHoliday[calendarKey]);
            var nationalHoliday = false;
            if (object._nationalHoliday[calendarKey] != null && parseInt(object._nationalHoliday[calendarKey].status) == 1) {
                
                nationalHoliday = true;
                
            }
            
            var userScheduleKey = dateLabel.getAttribute("data-key");
            var scheduleListPanel = [];
            for(var i = 0; i < updateSchedule[calendarKey].length; i++){
                
                var schedule = updateSchedule[calendarKey][i];
                schedule["select"] = true;
                if(parseInt(schedule["remainder"]) == 0 || schedule["stop"] == 'true'){
                    
                    schedule["select"] = false;
                    
                }
                
                var week = parseInt(schedule.weekKey);
                var minutes = parseInt(schedule.hour) * 60;
                if (nationalHoliday == true) {
                    
                    week = 7;
                    
                }
                
                if (timeToProvide[week] != null && parseInt(timeToProvide[week][minutes]) == 0) {
                    
                    schedule["select"] = false;
                    
                }
                
                console.log(schedule);
                
                var schedulePanel = document.createElement("div");
                schedulePanel.textContent = ("0" + schedule["hour"]).slice(-2) + ":" + ("0" + schedule["min"]).slice(-2) + " " + schedule['title'];
                schedulePanel.setAttribute("data-key", i);
                scheduleListPanel.push(schedulePanel);
                
                if(schedule["select"] === true){
                    
                    schedulePanel.setAttribute("data-status", 1);
                    schedulePanel.setAttribute("class", "courseAndScheduleRow");
                    schedulePanel.onclick = function(){
                        
                        this.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                        var key = this.getAttribute("data-key");
                        var schedule = calendarData['schedule'][calendarKey][key];
                        object.unselectPanel(key, scheduleListPanel, "courseAndScheduleRow");
                        console.log(schedule);
                        var hour = (0 + schedule["hour"]).slice(-2);
                        var min = (0 + schedule["min"]).slice(-2);
                        var date = calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, hour, min, schedule.title, null);
                        
                        dateLabel.setAttribute("data-key", schedule.key);
                        dateLabel.setAttribute("data-unixTime", schedule.unixTime);
                        dateLabel.textContent = date;
                        
                        document.getElementById("beforChangeButton").classList.add("hidden_panel");
                        document.getElementById("nextChangeButton").classList.add("hidden_panel");
                        document.getElementById("changePanel").setAttribute("class", "return_change_panel");
                        callback({status: "statusButton", value: "1", calendarData: calendarData});
                        
                    }
                    
                    if(userScheduleKey == schedule.key){
                        
                        console.log("onClick");
                        schedulePanel.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                        object.unselectPanel(i, scheduleListPanel, "courseAndScheduleRow");
                        
                    }
                    
                }else{
                    
                    schedulePanel.setAttribute("data-status", 0);
                    schedulePanel.setAttribute("class", "courseAndScheduleRowError");
                    
                }
                
                var table_row = document.createElement("div");
                table_row.appendChild(schedulePanel);
                
                changePanel.appendChild(table_row);
                
            }
            
        }else if(changeAction == 'course'){
            
            var courseLabel = document.getElementById("booking_course");
            var userCourseKey = courseLabel.getAttribute("data-key");
            var userScheduleKey = dateLabel.getAttribute("data-key");
            
            console.log(object._courseList);
            var calendarKey = calendar.getDateKey(month, day, year);
            var weekKey = parseInt(calendarData.calendar[calendarKey].week);
            console.log(object._nationalHoliday[calendarKey]);
            if (object._nationalHoliday[calendarKey] != null && parseInt(object._nationalHoliday[calendarKey].status) == 1) {
                
                weekKey = 7;
                
            }
            
            var minutes = 0;
            for(var i = 0; i < updateSchedule[calendarKey].length; i++){
                
                var schedule = updateSchedule[calendarKey][i];
                if (parseInt(schedule.key) == parseInt(userScheduleKey)) {
                    
                    console.log(schedule);
                    minutes = parseInt(schedule.hour) * 60;
                    break;
                    
                }
                
            }
            
            console.log("weekKey = " + weekKey);
            
            for(var i = 0; i < object._courseList.length; i++){
                
                if(parseInt(object._courseList[i].key) == parseInt(userCourseKey)) {
                    
                    timeToProvide = object._courseList[i].timeToProvide;
                    
                }
                
            }
            console.log(timeToProvide);
            
            //var start = parseInt(dateLabel.getAttribute("data-unixTime"));
            var time = parseInt(dateLabel.getAttribute("data-unixTime"));
            for(var i = 0; i < updateSchedule[calendarKey].length; i++){
                
                var schedule = updateSchedule[calendarKey][i];
                if(time < parseInt(schedule.unixTime) && schedule.remainder <= 0){
                    
                    console.log(schedule);
                    time = (schedule.unixTime - time) / 60;
                    break;
                    
                }
                
            }
            console.log("time = " + time);
            
            if (object.getServiceOrOption(options) == "service") {
                
                object.setServices(options);
                
            }
            
            console.log(object._courseList);
            console.log(object.getVisitorServices());
            var firstService = 0;
            var firstCheckBox = null;
            var checkBoxList = [];
            var courseListPanel = [];
            for(var i = 0; i < object._courseList.length; i++){
                
                object._courseList[i].service = 1;
                object._courseList[i].selected = 0;
                object._courseList[i].selectedOptionsList = [];
                
                var courseData = object._courseList[i];
                courseData["select"] = true;
                if (time < courseData.time) {
                    
                    courseData["select"] = false;
                    
                }
                
                timeToProvide = courseData.timeToProvide;
                if (timeToProvide[weekKey] != null && parseInt(timeToProvide[weekKey][minutes]) == 0) {
                    
                    courseData["select"] = false;
                    
                }
                
                console.log(courseData);
                console.log(object.lookingForVisitorServices(courseData));
                
                var coursePanel = document.createElement("div");
                //coursePanel.textContent = courseData.name;
                coursePanel.setAttribute("data-key", i);
                
                
                var courseNamePanel = document.createElement("span");
                courseNamePanel.textContent = courseData.name;
                //coursePanel.appendChild(courseNamePanel);
                
                var checkBox = document.createElement("input");
                checkBox.setAttribute("data-key", i);
                checkBox.type = "checkbox";
                checkBox.value = "";
                if (firstService == 0) {
                    
                    firstCheckBox = checkBox;
                    //object._courseList[i].selected = 1;
                    //checkBox.checked = true;
                    
                }
                
                if(object.lookingForVisitorServices(courseData) === true) {
                    
                    object._courseList[i].selected = 1;
                    for (var key in options) {
                        
                        if (parseInt(options[key].key) == parseInt(courseData.key)) {
                            
                            //object._courseList[i].selectedOptionsList = options[key].options;
                            break;
                            
                        }
                        
                    }
                    
                    checkBox.checked = true;
                    
                }
                
                
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
                
                if(courseData.cost != null){
                    
                    var cost = object._format.formatCost(courseData.cost, reservationData.currency);
                    var courseCostPanel = document.createElement("span");
                    courseCostPanel.classList.add("courseCostPanel");
                    courseCostPanel.textContent = cost;
                    coursePanel.appendChild(courseCostPanel);
                    
                }
                
                
                courseListPanel.push(coursePanel);
                
                if(courseData["select"] === true){
                    
                    coursePanel.setAttribute("data-status", 1);
                    coursePanel.setAttribute("class", "courseAndScheduleRow");
                    coursePanel.onclick = function(){
                        
                        this.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                        var key = this.getAttribute("data-key");
                        var courseData = object._courseList[key];
                        
                        console.log("key = " + key);
                        console.log(courseData);
                        console.log(reservationData);
                        console.log(typeof reservationData.options);
                        
                        var options = [];
                        /**
                        if (reservationData.options != null) {
                            
                            options = JSON.parse(reservationData.options);
                            
                        } else {
                            
                            options = JSON.parse(courseData.options);
                            
                        }
                        **/
                        
                        var checkBox = checkBoxList[parseInt(key)];
                        if (checkBox.checked == true) {
                            
                            checkBox.checked = false;
                            this.setAttribute("class", "courseAndScheduleRow");
                            object._courseList[parseInt(key)].selected = 0;
                            
                        } else {
                            
                            checkBox.checked = true;
                            this.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                            object._courseList[parseInt(key)].selected = 1;
                            
                        }
                        
                        if (parseInt(object._calendarAccount.hasMultipleServices) == 0) {
                            
                            var selectedServices = object.getVisitorServices();
                            for (var i in selectedServices) {
                                
                                selectedServices[i].selected = 0;
                                
                            }
                            
                            object._courseList[parseInt(key)].selected = 1;
                            
                        }
                        
                        var service = object._courseList[parseInt(key)];
                        console.log(service);
                        var options = service.options;
                        if (typeof service.options == 'string') {
                            
                            options = JSON.parse(service.options);
                            
                        }
                        
                        var valuePanel = document.getElementById("booking_course");
                        valuePanel.textContent = null;
                        
                        var coursePanel = document.createElement("div");
                        coursePanel.classList.add("mainPlan");
                        valuePanel.appendChild(coursePanel);
                        
                        if (options != null && options.length > 0) {
                            
                            if (checkBox.checked == true) {
                                
                                var selectOptionsPanel = document.getElementById("selectOptionsPanel");
                                object.getOptionsPanel(courseData, options, function(response){
                                    
                                    var selectedOptions = response.selectedOptions;
                                    object._courseList[key]["selectedOptionsList"] = selectedOptions;
                                    var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                                    console.log(selectedServices);
                                    object.createServicesPanel(coursePanel, selectedServices, "selectedOptionsList", reservationData.currency);
                                    if (response.status == "createSchedule") {
                                        
                                        selectOptionsPanel.classList.add("hidden_panel");
                                        //closeCourseWindow(key, courseListPanel, courseData, courseLabel, calendarData, selectedOptions, callback);
                                        
                                    } else if (response.status == "close") {
                                        
                                        selectOptionsPanel.classList.add("hidden_panel");
                                        if (coursePanel != null) {
                                            
                                            coursePanel.setAttribute("class", "courseAndScheduleRow");
                                            
                                        }
                                        
                                    }
                                    
                                });
                                
                            } else {
                                
                                console.log(object._courseList[parseInt(key)]);
                                var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                                console.log(selectedServices);
                                object.createServicesPanel(coursePanel, selectedServices, "selectedOptionsList", reservationData.currency);
                                
                                
                            }
                            
                        } else {
                            
                            console.log(service);
                            var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                            console.log(selectedServices);
                            object.createServicesPanel(coursePanel, selectedServices, "selectedOptionsList", reservationData.currency);
                            
                        }
                        
                        /**
                        if(parseInt(object._calendarAccount.hasMultipleServices) == 0){
                            
                            var selectedServices = object.getVisitorServices();
                            for (var i in selectedServices) {
                                
                                selectedServices[i].selected = 0;
                                
                            }
                            
                            object._courseList[parseInt(key)].selected = 1;
                            if (parseInt(courseData.key) != parseInt(reservationData.courseKey)) {
                                
                                if (courseData.options != null) {
                                    
                                    options = JSON.parse(courseData.options);
                                    
                                }
                                
                            } else {
                                
                                if (reservationData.options != null) {
                                    
                                    //options = JSON.parse(reservationData.options);
                                    options = reservationData.options;
                                    
                                } else {
                                    
                                    if (courseData.options != null) {
                                        
                                        options = JSON.parse(courseData.options);
                                        
                                    }
                                    
                                }
                                
                            }
                            
                            if (options.length <= 0) {
                                
                                var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                                closeCourseWindow(key, courseListPanel, courseData, courseLabel, calendarData, options, callback);
                                
                            } else {
                                
                                console.log(options);
                                var selectOptionsPanel = document.getElementById("selectOptionsPanel");
                                object.getOptionsPanel(courseData, options, function(response){
                                    
                                    var selectedOptions = response.selectedOptions;
                                    console.log(options);
                                    console.log(selectedOptions);
                                    object._courseList[key]["selectedOptionsList"] = selectedOptions;
                                    console.log(object._courseList[key]);
                                    var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                                    if (response.status == "createSchedule") {
                                        
                                        selectOptionsPanel.classList.add("hidden_panel");
                                        closeCourseWindow(key, courseListPanel, courseData, courseLabel, calendarData, selectedOptions, callback);
                                        
                                    } else if (response.status == "close") {
                                        
                                        selectOptionsPanel.classList.add("hidden_panel");
                                        if (coursePanel != null) {
                                            
                                            coursePanel.setAttribute("class", "courseAndScheduleRow");
                                            
                                        }
                                        
                                    }
                                    
                                });
                                
                            }
                            
                        } else {
                            
                            
                            
                            var service = object._courseList[parseInt(key)];
                            
                            var selected = false;
                            for (var i in object._courseList) {
                                
                                if (object._courseList[i].selected == 1) {
                                    
                                    selected = true;
                                    break;
                                    
                                }
                                
                            }
                            
                            
                            console.log(service);
                            var options = service.options;
                            if (typeof service.options == 'string') {
                                
                                options = JSON.parse(service.options);
                                
                            }
                            
                            //var selectedServices = getSelectedServices();
                            var valuePanel = document.getElementById("booking_course");
                            valuePanel.textContent = null;
                            
                            var coursePanel = document.createElement("div");
                            coursePanel.classList.add("mainPlan");
                            valuePanel.appendChild(coursePanel);
                            console.log(valuePanel);
                            console.log("checkBox.checked = " + checkBox.checked);
                            console.log(options);
                            
                            if (options != null && options.length > 0) {
                                
                                if (checkBox.checked == true) {
                                    
                                    var selectOptionsPanel = document.getElementById("selectOptionsPanel");
                                    object.getOptionsPanel(courseData, options, function(response){
                                        
                                        var selectedOptions = response.selectedOptions;
                                        console.log(options);
                                        console.log(selectedOptions);
                                        object._courseList[key]["selectedOptionsList"] = selectedOptions;
                                        console.log(object._courseList[key]);
                                        var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                                        console.log(selectedServices);
                                        object.createServicesPanel(coursePanel, selectedServices, "selectedOptionsList");
                                        if (response.status == "createSchedule") {
                                            
                                            selectOptionsPanel.classList.add("hidden_panel");
                                            //closeCourseWindow(key, courseListPanel, courseData, courseLabel, calendarData, selectedOptions, callback);
                                            
                                        } else if (response.status == "close") {
                                            
                                            selectOptionsPanel.classList.add("hidden_panel");
                                            if (coursePanel != null) {
                                                
                                                coursePanel.setAttribute("class", "courseAndScheduleRow");
                                                
                                            }
                                            
                                        }
                                        
                                        console.log(object._courseList);
                                        
                                    });
                                    
                                } else {
                                    
                                    console.log(object._courseList[parseInt(key)]);
                                    var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                                    console.log(selectedServices);
                                    object.createServicesPanel(coursePanel, selectedServices, "selectedOptionsList");
                                    
                                    
                                }
                                
                            } else {
                                
                                console.log(service);
                                var selectedServices = object.addVisitorServices(object._courseList[parseInt(key)]);
                                console.log(selectedServices);
                                object.createServicesPanel(coursePanel, selectedServices, "selectedOptionsList");
                                
                            }
                            
                        }
                        **/
                        console.log(object._courseList);
                        
                        
                    };
                    
                    if(courseData.key == userCourseKey){
                        
                        console.log("onClick");
                        coursePanel.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                        object.unselectPanel(i, courseListPanel, "courseAndScheduleRow");
                        
                    }
                    
                }else{
                    
                    coursePanel.setAttribute("data-status", 0);
                    coursePanel.setAttribute("class", "courseAndScheduleRowError");
                    
                }
                
                
                
                var table_row = document.createElement("div");
                table_row.appendChild(coursePanel);
                
                changePanel.appendChild(table_row);
                firstService++;
                
            }
            
        }
        
        var getSelectedServices = function() {
            
            var selectedServices = [];
            for (var i in object._courseList) {
                
                var service = object._courseList[i];
                if (parseInt(service.selected) == 1) {
                    
                    selectedServices.push(service);
                    
                }
                
            }
            
            return selectedServices;
            
        };
        
        var closeCourseWindow = function(key, courseListPanel, courseData, courseLabel, calendarData, options, callback){
            
            object.unselectPanel(key, courseListPanel, "courseAndScheduleRow");
            courseLabel.setAttribute("data-key", courseData.key);
            courseLabel.setAttribute("data-time", courseData.time);
            //courseLabel.textContent = courseData.name;
            courseLabel.textContent = null;
            
            var totalCost = 0;
            var coursePanel = document.createElement("div");
            coursePanel.classList.add("mainPlan");
            courseLabel.appendChild(coursePanel);
            
            var courseNamePanel = document.createElement("span");
            courseNamePanel.classList.add("planName");
            courseNamePanel.textContent = courseData.name;
            coursePanel.appendChild(courseNamePanel);
            if (parseInt(courseData.cost) > 0) {
                
                totalCost += parseInt(courseData.cost);
                var courseCostPanel = document.createElement("span");
                courseCostPanel.classList.add("planPrice");
                courseCostPanel.textContent = object._format.formatCost(courseData.cost, reservationData.currency);
                coursePanel.appendChild(courseCostPanel);
                
            }
            
            console.log(options);
            if (options != null && options.length > 0) {
                
                var ul = document.createElement("ul");
                courseLabel.appendChild(ul);
                
                for(var i = 0; i < options.length; i++){
                    
                    var option = options[i];
                    console.log(option);
                    if (parseInt(option.selected) == 1) {
                        
                        totalCost += parseInt(option.cost);
                        
                        var optionNamePanel = document.createElement("span");
                        optionNamePanel.classList.add("planName");
                        optionNamePanel.textContent = option.name;
                        
                        var optionPricePanel = document.createElement("span");
                        optionPricePanel.classList.add("planPrice");
                        if (parseInt(option.cost) > 0) {
                            
                            optionPricePanel.textContent = object._format.formatCost(option.cost, reservationData.currency);
                            
                        }
                        
                        var li = document.createElement("li");
                        li.appendChild(optionNamePanel);
                        li.appendChild(optionPricePanel);
                        ul.appendChild(li);
                        
                    }
                    
                }
                
            }
            
            if(document.getElementById("booking_cost") != null){
                
                var cost = object._format.formatCost(totalCost, reservationData.currency);
                document.getElementById("booking_cost").textContent = cost;
                
            }
            
            document.getElementById("beforChangeButton").classList.add("hidden_panel");
            document.getElementById("nextChangeButton").classList.add("hidden_panel");
            document.getElementById("changePanel").setAttribute("class", "return_change_panel");
            callback({status: "statusButton", value: "1", calendarData: calendarData, options: JSON.stringify(options)});
            
        }
        
        beforChangeButton.onclick = function(){
            
            console.log("day = " + day);
            changeButtonAction(0, month, day, year, calendarData);
            
        }
        
        nextChangeButton.onclick = function(){
            
            console.log("day = " + day);
            changeButtonAction(1, month, day, year, calendarData);
            
        }
        
    }
    
    this.preparToUpdateSchedule = function(reservationData, calendarData, courseTime, changeAction, preparation){
    	
    	console.log(calendarData);
		console.log("changeAction = " + changeAction);
		console.log("courseTime = " + courseTime);
		console.log(preparation);
		console.log(typeof preparation);
		if (preparation == null) {
		    
		    preparation = {position: "before_after", time: 0};
		    console.log(preparation);
		    
		}
		var planBool = true;
		var start = parseInt(reservationData.scheduleUnixTime);
		//var end = start + parseInt(reservationData.courseTime) * 60;
		var end = start + parseInt(courseTime) * 60;
		
		if (preparation != null && preparation.time != null && preparation.position != null) {
		    
		    if (preparation.position == 'before_after' || preparation.position == 'before') {
		        
		        start -= preparation.time * 60;
		        
		    }
		    
		    if (preparation.position == 'before_after' || preparation.position == 'after') {
		        
		        end += preparation.time * 60;
		        
		    }
		    
		}
		
		if (start == end) {
        	
        	planBool = false;
			
    	}
		console.log("start = " + start + " end = " + end);
		var applicantCount = parseInt(reservationData.applicantCount);
		var schedule = {};
		var scheduleAll = [];
		
		var count = 0;
		for(var key in calendarData.schedule){
        	
        	var daySchedule = [];
			for(var i = 0; i < calendarData.schedule[key].length; i++){
            	
            	var newDate = {};
				Object.assign(newDate , calendarData.schedule[key][i]);
				var unixTime = parseInt(newDate.unixTime);
				if(planBool === true && unixTime >= start && unixTime < end){
                	
                	newDate.remainder = parseInt(newDate.remainder) + applicantCount;
					console.log(newDate);
					
            	}else if(planBool === false && unixTime == start){
                	
                	newDate.remainder = parseInt(newDate.remainder) + applicantCount;
					console.log(newDate);
					
            	}
				
				if(newDate.stop == "true"){
                	
                	newDate.remainder = 0;
					
            	}
				
				newDate.count = count;
				scheduleAll.push(newDate);
				daySchedule.push(newDate);
				count++;
				
				if(planBool === true && newDate.remainder <= 0){
                	
                	(function(scheduleAll, unixTime, courseTime, applicantCount, start, end){
                    	
                    	var endTime = parseInt(unixTime) - (parseInt(courseTime) * 60);
						console.log("unixTime = " + unixTime + " endTime = " + endTime + " courseTime = " + courseTime + " length = " + scheduleAll.length);
						for(var i = scheduleAll.length; i > 0; i--){
                        	
                        	var schedule = scheduleAll[(i - 1)];
							var time = schedule.year + "/" + schedule.month + "/" + schedule.day + " " + schedule.hour + ":" + schedule.min + " remainder = " + schedule.remainder;
							if(endTime >= schedule.unixTime){
                            	
                            	break;
								
                        	}
							
							if(schedule.remainder > 0 && (unixTime <= start && unixTime > end) && changeAction == 'course'){
                            	
                            	schedule.remainder -= applicantCount;
								
                        	}
							
							if(schedule.remainder > 0 && changeAction == 'date'){
                            	
                            	//schedule.remainder -= applicantCount;
								schedule.remainder = 0;
								
                        	}
							
                    	}
						
                	})(scheduleAll, newDate.unixTime, courseTime, applicantCount, start, end);
					
            	}
				
        	}
			
			schedule[key] = daySchedule;
			
    	}
		
		return {schedule: schedule, scheduleAll: scheduleAll};
		
	}
    
    this.add_reservation = function(add_reservationPanel, month, day, year, calendarData, accountKey, callback){
        
        var object = this;
        object._buttonAction = "add_reservation";
        console.log("buttonAction = " + object._buttonAction);
        console.log(object._courseList);
        add_reservationPanel.classList.remove("hidden_panel");
        add_reservationPanel.textContent = null;
        object._rightButtonPanel.textContent = null;
        
        for (var key in object._courseList) {
            
            object._courseList[key].service = 1;
            object._courseList[key].selected = 0;
            object._courseList[key].selectedOptionsList = [];
            
        }
        
        var courseMainPanel = document.createElement("div");
        courseMainPanel.setAttribute("class", "courseListPanel box_shadow");
        
        var scheduleMainPanel = document.createElement("div");
        scheduleMainPanel.setAttribute("class", "scheduleListPanel courseListPanel box_shadow");
        
        var formMainPanel = document.createElement("div");
        formMainPanel.setAttribute("class", "createFormPanel_return");
        
        var mainPanel = document.createElement("div");
        mainPanel.setAttribute("class", "courseAndSchedulePanel");
        mainPanel.appendChild(courseMainPanel);
        mainPanel.appendChild(scheduleMainPanel);
        //mainPanel.appendChild(formMainPanel);
        add_reservationPanel.appendChild(mainPanel);
        add_reservationPanel.appendChild(formMainPanel);
        
        if(calendarData.account.type == 'hotel'){
            
            //hotel.reset();
            console.log(calendarData.account);
            console.log(calendarData.guestsList);
            mainPanel.removeChild(courseMainPanel);
            
            var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
            var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
            var calendarKey = calendar.getDateKey(month, day, year);
            var checkDate = object._hotel.getCheckDate();
            console.log(checkDate);
            if(checkDate.checkIn == null && calendarData.schedule[parseInt(calendarKey)] != null && calendarData.schedule[parseInt(calendarKey)][0] != null){
                
                checkDate.checkIn = calendarData.schedule[parseInt(calendarKey)][0];
                console.log(object._hotel.getCheckDate());
                
            }
            
            var bookingCalendar = function(calendarData){
                
                var year = parseInt(calendarData.date.year);
                var month = parseInt(calendarData.date.month);
                //hotel.verifySchedule(true);
                
                scheduleMainPanel.textContent = null;
                scheduleMainPanel.setAttribute("style", "animation-name: unset;");
                //scheduleMainPanel.setAttribute("style", "left: 0;");
                scheduleMainPanel.setAttribute("class", "schedulePanel_next");
                
                
                var dayHeight = parseInt(scheduleMainPanel.clientWidth / 7);
    	        console.log("dayHeight = " + dayHeight);
                
                var datePanel = document.createElement("div");
                datePanel.setAttribute("class", "calendarData");
                datePanel.textContent = calendar.formatBookingDate(month, null, year, null, null, null);
                
                console.log(year + "/" + month);
                
                var returnLabel = document.createElement("label");
                returnLabel.setAttribute("class", "arrowLeft");
                if(month == 1){
                    
                    returnLabel.textContent = "＜" + calendar.formatBookingDate(12, null, null, null, null, null);
                    
                }else{
                    
                    returnLabel.textContent = "＜" + calendar.formatBookingDate((month - 1), null, null, null, null, null);;
                
                }
                
                
                var returnPanel = document.createElement("div");
                returnPanel.setAttribute("class", "calendarChangeButton");
                returnPanel.appendChild(returnLabel);
                
                var nextLabel = document.createElement("label");
                nextLabel.setAttribute("class", "arrowRight");
                if(month == 12){
                    
                    nextLabel.textContent = calendar.formatBookingDate(1, null, null, null, null, null) + "＞";
                    
                }else{
                    
                    nextLabel.textContent = calendar.formatBookingDate((month + 1), null, null, null, null, null) + "＞";
                    
                }
                
                var nextPanel = document.createElement("div");
                nextPanel.setAttribute("style", "text-align: right;");
                nextPanel.setAttribute("class", "calendarChangeButton");
                nextPanel.appendChild(nextLabel);
                
                var topPanel = document.createElement("div");
                topPanel.setAttribute("class", "calendarPanel");
                topPanel.appendChild(returnPanel);
                topPanel.appendChild(datePanel);
                topPanel.appendChild(nextPanel);
                scheduleMainPanel.appendChild(topPanel);
                
                var calendarKey = calendar.getDateKey(month, day, year);
                var checkDate = object._hotel.getCheckDate();
                console.log(checkDate);
                /**
                if(checkDate.checkIn == null && calendarData.schedule[parseInt(calendarKey)] != null && calendarData.schedule[parseInt(calendarKey)][0] != null){
                    
                    checkDate.checkIn = calendarData.schedule[parseInt(calendarKey)][0];
                    console.log(hotel.getCheckDate());
                    
                }
                **/
                
                var scopeOfDay = {start: null, end: null};
                var dayPanelList = {};
                calendar.create(scheduleMainPanel, calendarData, month, day, year, '', function(callback){
                    
                    console.log(callback);
                    var key = parseInt(callback.key);
                    var dayPanel = callback['eventPanel'];
                    if(key > 0){
                        
                        dayPanelList[key] = dayPanel;
                        object._hotel.setDayPanelList(dayPanelList);
                        
                    }
                    dayPanel.setAttribute("style", "height: " + (dayHeight) + "px;");
                    dayPanel.setAttribute("data-unixTime", 0);
                    if(calendarData.schedule[key] != null && calendarData.schedule[key][0] != null){
                        
                        dayPanel.setAttribute("data-unixTime", calendarData.schedule[key][0].unixTime);
                        
                        if(calendarData.schedule[key].length != 0){
                            
                            object._hotel.addSchedule(calendarData.schedule[key][0]);
                            
                            if(checkDate.checkIn != null && checkDate.checkIn.unixTime == calendarData.schedule[key][0].unixTime && calendarData.schedule[key][0].remainder > 0){
                                
                                dayPanel.classList.add("selectedDayPanel");
                                
                            }
                            
                            if((checkDate.checkIn != null && checkDate.checkOut != null) && (checkDate.checkIn.unixTime <= calendarData.schedule[key][0].unixTime && checkDate.checkOut.unixTime >= calendarData.schedule[key][0].unixTime)){
                                
                                console.log("checkDate.checkIn.unixTime = " + checkDate.checkIn.unixTime);
                                dayPanel.classList.add("selectedDayPanel");
                                
                            }
                            
                            if(parseInt(calendarData.schedule[key][0].remainder) <= 0 || calendarData.schedule[key][0].stop == 'true'){
                                
                                dayPanel.classList.remove("selectedDayPanel");
                                dayPanel.classList.add("closeDay");
                                
                            }
                            
                            dayPanel.onclick = function(){
                                
                                var dateKey = parseInt(this.getAttribute("data-key"));
                                console.log("dateKey = " + dateKey);
                                var checkIn = document.getElementById("checkIn").getAttribute("data-check");
                                var checkInUnixTime = parseInt(document.getElementById("checkIn").getAttribute("data-unixTime"));
                                console.log("checkIn = " + checkIn + " checkInUnixTime = " + checkInUnixTime);
                                
                                var schedule = calendarData.schedule[dateKey][0];
                                var checkOutUnixTime = parseInt(schedule.unixTime);
                                var checkOutBool = true;
                                if(checkIn == parseInt(schedule.key)){
                                    
                                    //return null;
                                    
                                }
                                
                                var checkDate = object._hotel.getCheckDate();
                                console.log(checkDate);
                                
                                if(checkDate.checkIn == null){
                                    
                                    if(schedule.remainder <= 0){
                                        
                                        return null;
                                        
                                    }
                                    
                                    object._hotel.setDayPanelList(dayPanelList);
                                    console.log(schedule);
                                    console.log(dayPanelList[dateKey]);
                                    dayPanelList[dateKey].classList.add("selectedDayPanel");
                                    object._hotel.setCheckIn(schedule);
                                    object._hotel.setCheckInKey(schedule.key);
                                    
                                    var checkInClearLabel = document.getElementById("checkInClear");
                                    checkInClearLabel.classList.remove("hidden_panel");
                                    
                                    var scheduleList = calendarData.schedule[calendarKey][0];
                                    var date = calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, null, null, null, schedule.weekKey);
                                    //console.log("monthKey = " + monthKey + " dayKey = " + dayKey + " yearKey = " + yearKey);
                                    console.log(scheduleList);
                                    console.log(checkDate);
                                    
                                    var checkInDatePanel = document.getElementById("checkIn");
                                    checkInDatePanel.textContent = date;
                                    
                                }else{
                                    
                                    var checkInUnixTime = parseInt(checkDate.checkIn.unixTime);
                                    var checkInMonth = parseInt(checkDate.checkIn.month);
                                    var chekInDay = parseInt(checkDate.checkIn.day);
                                    var checkInYear = parseInt(checkDate.checkIn.year);
                                    
                                    var verifySchedule = false;
                                    if(checkInUnixTime < checkOutUnixTime){
                                        
                                        object._hotel.setCheckOut(schedule);
                                        object._hotel.setCheckOutKey(schedule.key);
                                        verifySchedule = object._hotel.verifySchedule(true);
                                        console.log(verifySchedule);
                                        for(var key in dayPanelList){
                                            
                                            var checkOut = parseInt(dayPanelList[key].getAttribute("data-unixTime"));
                                            if(verifySchedule.status == true && checkInUnixTime <= checkOut && checkOutUnixTime >= checkOut){
                                                
                                                dayPanelList[key].classList.add("selectedDayPanel");
                                                
                                            }else if(checkInUnixTime != checkOut){
                                                
                                                dayPanelList[key].classList.remove("selectedDayPanel");
                                                
                                            }
                                            
                                        }
                                        
                                    }
                                    
                                    var checkOut = document.getElementById("checkOut");
                                    if(verifySchedule.status == true){
                                        
                                        checkOut.setAttribute("data-check", schedule.key);
                                        checkOut.textContent = calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, null, null, null, schedule.weekKey);
                                        object._hotel.setCheckOut(schedule);
                                        object._hotel.setCheckOutKey(schedule.key);
                                        
                                    }else{
                                        
                                        object._hotel.setCheckOut(null);
                                        object._hotel.setCheckOutKey(null);
                                        //checkOut.setAttribute("data-check", null);
                                        //checkOut.textContent = object._i18n.get("Please choose a departure date from the calendar");
                                        
                                    }
                                    
                                    object._hotel.verifySchedule(true);
                                    
                                }
                                
                            }
                            
                        }else{
                            
                            dayPanel.classList.add("closeDay");
                            dayPanel.classList.remove("pointer");
                            
                        }
                        
                    }else{
                        
                        dayPanel.classList.add("closeDay");
                        dayPanel.classList.remove("pointer");
                        
                    }
                    
                });
                
                returnLabel.onclick = function(){
                    
                    if(month == 1){
                        
                        year--;
                        month = 12;
                        
                    }else{
                        
                        month--;
                        
                    }
                    
                    object.getReservationData(month, 1, year, accountKey, function(calendarData){
                        
                        console.log(calendarData);
                        bookingCalendar(calendarData);
                        
                    });
                    
                }
                
                nextLabel.onclick = function(){
                    
                    if(month == 12){
                        
                        year++;
                        month = 1;
                        
                    }else{
                        
                        month++;
                    
                    }
                    
                    object.getReservationData(month, 1, year, accountKey, function(calendarData){
                        
                        console.log(calendarData);
                        bookingCalendar(calendarData);
                        
                    });
                    
                }
                
            }
            
            bookingCalendar(calendarData);
            
            object.createForm(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, course, null, null, accountKey, function(response){
                
                if(response.action == 'refresh'){
                    
                    callback(response);
                    
                }
                
            });
            
            
            
        }else{
            
            if(object._courseBool == true){
                
                if(object._courseList.length == 0){
                    
                    var errorMessage = object._i18n.get("Service is not registered. ");
                    errorMessage += object._i18n.get("Please create a service on the setting page.");
                    var confirm = new Confirm();
                    confirm.alertPanelShow(object._i18n.get("Error"), errorMessage, false, function(caalback){
                        
                        
                        
                    });
                    
                    return null;
                    
                }
                
                var animationBool = true;
                var checkBoxList = [];
                var coursePanelList = [];
                var courseList = object._courseList;
                var firstCheckBox = null;
                var firstService = 0;
                for(var i = 0; i < object._courseList.length; i++){
                    
                    var course = object._courseList[i];
                    if (course.active != "true") {
                        
                        continue;
                        
                    }
                    
                    if (firstService == 0) {
                        
                        var options = [];
                        if (course.options != null) {
                            
                            options = JSON.parse(course.options);
                            
                        }
                        
                        if (options.length > 0) {
                            
                            console.log(options);
                            object.createOptionsPanel(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, coursePanel, month, day, year, calendarData, firstService, course, accountKey, function(response){
                                
                                console.log(firstService);
                                console.log(course);
                                console.log(response);
                                courseList[parseInt(response.key)].selectedOptionsList = response.selectedOptions;
                                object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, courseList, response.selectedOptions, accountKey, function(response){
                                    
                                    callback(response);
                                    
                                });
                                //callback(response);
                                
                            });
                            
                        }
                        
                    }
                    
                    if (typeof course["name"] == "string") {
                        
                        course["name"] = course["name"].replace(/\\/g, "");
                        
                    }
                    
                    course["status"] = true;
                    
                    var coursePanel = document.createElement("div");
                    coursePanel.setAttribute("data-key", i);
                    coursePanel.setAttribute("data-status", 1);
                    coursePanel.setAttribute("class", "courseAndScheduleRow");
                    
                    
                    var courseNamePanel = document.createElement("span");
                    courseNamePanel.textContent = course["name"];
                    
                    var checkBox = document.createElement("input");
                    checkBox.setAttribute("data-key", i);
                    checkBox.type = "checkbox";
                    checkBox.value = "";
                    if (firstService == 0) {
                        
                        firstCheckBox = checkBox;
                        object._courseList[i].selected = 1;
                        checkBox.checked = true;
                        
                    }
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
                    
                    if(course.cost != null){
                        
                        var cost = object._format.formatCost(course.cost, object._currency);
                        var courseCostPanel = document.createElement("span");
                        courseCostPanel.classList.add("courseCostPanel");
                        courseCostPanel.textContent = cost;
                        coursePanel.appendChild(courseCostPanel);
                        
                    }
                    
                    coursePanelList.push(coursePanel);
                    
                    var table_row = document.createElement("div");
                    table_row.appendChild(coursePanel);
                    
                    courseMainPanel.appendChild(table_row);
                    
                    coursePanel.onclick = function(){
                        
                        var coursePanel = this;
                        coursePanel.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                        var key = coursePanel.getAttribute("data-key");
                        var course = object._courseList[parseInt(key)];
                        object.unselectPanel(key, coursePanelList, "courseAndScheduleRow");
                        console.log(course);
                        var options = [];
                        if (course.options != null) {
                            
                            options = JSON.parse(course.options);
                            
                        }
                        console.log(options);
                        
                        var checkBox = checkBoxList[parseInt(key)];
                        if(parseInt(object._calendarAccount.hasMultipleServices) == 0){
                            
                            for (var i in courseList) {
                                
                                courseList[i].selected = 0;
                                
                            }
                            
                            courseList[parseInt(key)].selected = 1;
                            checkBox.checked = true;
                            
                        } else {
                            
                            console.log(checkBox);
                            if(checkBox.checked == true){
                                
                                checkBox.checked = false;
                                this.setAttribute("class", "courseAndScheduleRow");
                                courseList[parseInt(key)].selected = 0;
                                
                            }else{
                                
                                checkBox.checked = true;
                                this.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                                courseList[parseInt(key)].selected = 1;
                                
                            }
                            
                            var selected = false;
                            for (var i in courseList) {
                                
                                if (courseList[i].selected == 1) {
                                    
                                    selected = true;
                                    break;
                                    
                                }
                                
                            }
                            
                            if (selected === false) {
                                
                                var key = parseInt(firstCheckBox.getAttribute("data-key"));
                                courseList[key].selected = 1;
                                firstCheckBox.checked = true;
                                
                            }
                            
                        }
                        
                        if (options.length <= 0) {
                            
                            object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, courseList, null, accountKey, function(response){
                                
                                callback(response);
                                
                            });
                            
                        } else {
                            
                            var checkBox = checkBoxList[parseInt(key)];
                            console.log(checkBox);
                            if (checkBox.checked == true) {
                                
                                object.createOptionsPanel(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, coursePanel, month, day, year, calendarData, key, course, accountKey, function(response){
                                    
                                    courseList[parseInt(key)].selectedOptionsList = response.selectedOptions;
                                    object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, courseList, response.selectedOptions, accountKey, function(response){
                                        
                                        callback(response);
                                        
                                    });
                                    
                                });
                                
                            }
                            
                        }
                        
                    }
                    
                    firstService++;
                    
                }
                console.log(coursePanelList);
                //coursePanelList[0].setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                if(coursePanelList[0] != null){
                    
                    coursePanelList[0].setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                    
                }
                
                object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, object._courseList , null, accountKey, function(response){
                    
                    callback(response);
                    
                });
                
            }else{
                
                mainPanel.removeChild(courseMainPanel);
                scheduleMainPanel.setAttribute("style", "left: 0;");
                scheduleMainPanel.setAttribute("class", "schedulePanel");
                
                object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, null, null, accountKey, function(response){
                    
                    callback(response);
                    
                });
                
            }
            
        }
        
        
        
        
        
    }
    
    this.getOptionsPanel = function(course, options, callback){
        
        var object = this;
        var selectedOptions = [];
        var checkBoxList = [];
        var disabledButton = true;
        //var options = JSON.parse(course.options);
        console.log(course);
        if (typeof options == "string") {
            
            options = JSON.parse(course.options);
            
        }
        var selectOptionsPanel = document.getElementById("selectOptionsPanel");
        var nextButton = selectOptionsPanel.getElementsByClassName("decisionButton")[0];
        var title = selectOptionsPanel.getElementsByClassName("subject")[0];
        var bodyPanel = selectOptionsPanel.getElementsByClassName("body")[0];
        selectOptionsPanel.classList.remove("hidden_panel");
        title.textContent = course.name;
        bodyPanel.textContent = null;
        bodyPanel.setAttribute("style", "bottom: 56px;");
        nextButton.classList.remove("hidden_panel");
        nextButton.disabled = true;
        if (parseInt(course.selectOptions) == 0) {
            
            bodyPanel.setAttribute("style", "bottom: 0;");
            nextButton.classList.add("hidden_panel");
            
        }
        
        for(var i = 0; i < options.length; i++){
            
            var option = options[i];
            console.log(typeof option.selected);
            if (option.selected == null) {
                
                option.selected = 0;
                
            }
            
            console.log(option);
            selectedOptions.push(option);
            var optionPanel = document.createElement("div");
            optionPanel.setAttribute("data-key", i);
            optionPanel.setAttribute("data-status", 1);
            optionPanel.setAttribute("class", "courseAndScheduleRow");
            
            var titleLabel = document.createElement("span");
            titleLabel.textContent = option.name;
            
            var checkBox = document.createElement("input");
            checkBox.setAttribute("data-key", i);
            checkBox.type = "checkbox";
            checkBox.value = 1;
            if(parseInt(option.selected) == 1){
                
                checkBox.checked = true;
                optionPanel.classList.add("courseAndScheduleRowActive");
                disabledButton = false;
                
            }
            checkBoxList.push(checkBox);
            
            var label = document.createElement("label");
            label.appendChild(checkBox);
            label.appendChild(titleLabel);
            if(parseInt(course.selectOptions) == 0){
                
                checkBox.classList.add("hidden_panel");
                
            }
            
            optionPanel.appendChild(label);
            if(option.cost != null){
                
                var cost = object._format.formatCost(option.cost, object._currency);
                var optionCostPanel = document.createElement("span");
                optionCostPanel.classList.add("courseCostPanel");
                optionCostPanel.textContent = cost;
                optionPanel.appendChild(optionCostPanel);
                
            }
            
            bodyPanel.appendChild(optionPanel);
            optionPanel.onclick = function(){
                
                console.log(course);
                var key = parseInt(this.getAttribute("data-key"));
                var option = options[key];
                console.log(option);
                var checkBox = checkBoxList[key];
                if(checkBox.checked == true){
                    
                    checkBox.checked = false;
                    this.setAttribute("class", "courseAndScheduleRow");
                    selectedOptions[key].selected = 0;
                    
                }else{
                    
                    checkBox.checked = true;
                    this.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                    selectedOptions[key].selected = 1;
                    
                }
                
                console.log(selectedOptions);
                nextButton.disabled = true;
                for(var i = 0; i < selectedOptions.length; i++){
                    
                    if(selectedOptions[i].selected == 1){
                        
                        if(parseInt(course.selectOptions) == 0){
                            
                            console.log(course);
                            var response = {status: "createSchedule", selectedOptions: selectedOptions};
                            callback(response);
                            /**
                            selectOptionsPanel.classList.add("hidden_panel");
                            object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, course, selectedOptions, accountKey, function(response){
                                
                                callback(response);
                                
                            });
                            **/
                            
                        }else{
                            
                            nextButton.disabled = false;
                            
                        }
                        
                        break;
                        
                    }
                    
                }
                
            }
            
        }
        
        if (disabledButton == false) {
            
            nextButton.disabled = false;
            
        }
        nextButton.removeEventListener("check", null);
        nextButton.onclick = function(){
            
            var response = {status: "createSchedule", selectedOptions: selectedOptions};
            callback(response);
            /**
            selectOptionsPanel.classList.add("hidden_panel");
            object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, course, selectedOptions, accountKey, function(response){
                
                callback(response);
                
            });
            **/
            
        }
        
        selectOptionsPanel.getElementsByClassName("blockPanel")[0].onclick = function(){
            
            var response = {status: "close", selectedOptions: selectedOptions};
            callback(response);
            /**
            selectOptionsPanel.classList.add("hidden_panel");
            if (coursePanel != null) {
                
                coursePanel.setAttribute("class", "courseAndScheduleRow");
                
            }
            **/
            
        }
        
        console.log(course);
        
    }
    
    this.createOptionsPanel = function(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, coursePanel, month, day, year, calendarData, courseKey, course, accountKey, callback){
        
        var object = this;
        var selectOptionsPanel = document.getElementById("selectOptionsPanel");
        object.getOptionsPanel(course, course.options, function(response){
            
            if (response.status == "createSchedule") {
                
                var selectedOptions = response.selectedOptions;
                selectOptionsPanel.classList.add("hidden_panel");
                callback({selectedOptions: selectedOptions, key: courseKey});
                /**
                object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, course, selectedOptions, accountKey, function(response){
                    
                    callback(response);
                    
                });
                **/
                
            } else if (response.status == "close") {
                
                selectOptionsPanel.classList.add("hidden_panel");
                if (coursePanel != null) {
                    
                    coursePanel.setAttribute("class", "courseAndScheduleRow");
                    
                }
                
            }
            
        });
        
        /**
        var selectedOptions = [];
        var checkBoxList = [];
        var options = JSON.parse(course.options);
        var selectOptionsPanel = document.getElementById("selectOptionsPanel");
        var nextButton = selectOptionsPanel.getElementsByClassName("decisionButton")[0];
        var title = selectOptionsPanel.getElementsByClassName("subject")[0];
        var bodyPanel = selectOptionsPanel.getElementsByClassName("body")[0];
        selectOptionsPanel.classList.remove("hidden_panel");
        title.textContent = course.name;
        bodyPanel.textContent = null;
        nextButton.classList.remove("hidden_panel");
        nextButton.disabled = true;
        if(parseInt(course.selectOptions) == 0){
            
            nextButton.classList.add("hidden_panel");
            
        }
        
        for(var i = 0; i < options.length; i++){
            
            var option = options[i];
            option.selected = 0;
            selectedOptions.push(option);
            var optionPanel = document.createElement("div");
            optionPanel.setAttribute("data-key", i);
            optionPanel.setAttribute("data-status", 1);
            optionPanel.setAttribute("class", "courseAndScheduleRow");
            
            var titleLabel = document.createElement("span");
            titleLabel.textContent = option.name;
            
            var checkBox = document.createElement("input");
            checkBox.setAttribute("data-key", i);
            checkBox.type = "checkbox";
            checkBox.value = 1;
            checkBoxList.push(checkBox);
            
            var label = document.createElement("label");
            label.appendChild(checkBox);
            label.appendChild(titleLabel);
            if(parseInt(course.selectOptions) == 0){
                
                checkBox.classList.add("hidden_panel");
                
            }
            
            optionPanel.appendChild(label);
            if(option.cost != null){
                
                var cost = object._format.formatCost(option.cost, object._currency);
                var optionCostPanel = document.createElement("span");
                optionCostPanel.classList.add("courseCostPanel");
                optionCostPanel.textContent = cost;
                optionPanel.appendChild(optionCostPanel);
                
            }
            
            bodyPanel.appendChild(optionPanel);
            optionPanel.onclick = function(){
                
                var key = parseInt(this.getAttribute("data-key"));
                var option = options[key];
                console.log(option);
                var checkBox = checkBoxList[key];
                if(checkBox.checked == true){
                    
                    checkBox.checked = false;
                    this.setAttribute("class", "courseAndScheduleRow");
                    selectedOptions[key].selected = 0;
                    
                }else{
                    
                    checkBox.checked = true;
                    this.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                    selectedOptions[key].selected = 1;
                    
                }
                
                console.log(selectedOptions);
                nextButton.disabled = true;
                for(var i = 0; i < selectedOptions.length; i++){
                    
                    if(selectedOptions[i].selected == 1){
                        
                        if(parseInt(course.selectOptions) == 0){
                            
                            selectOptionsPanel.classList.add("hidden_panel");
                            object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, course, selectedOptions, accountKey, function(response){
                                
                                callback(response);
                                
                            });
                            
                        }else{
                            
                            nextButton.disabled = false;
                            
                        }
                        
                        break;
                        
                    }
                    
                }
                
            }
            
        }
        
        nextButton.removeEventListener("check", null);
        nextButton.onclick = function(){
            
            selectOptionsPanel.classList.add("hidden_panel");
            object.createSchedule(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, course, selectedOptions, accountKey, function(response){
                
                callback(response);
                
            });
            
        }
        
        selectOptionsPanel.getElementsByClassName("blockPanel")[0].onclick = function(){
            
            selectOptionsPanel.classList.add("hidden_panel");
            if (coursePanel != null) {
                
                coursePanel.setAttribute("class", "courseAndScheduleRow");
                
            }
            
        }
        **/
        
    }
    
    this.createBookingCalendar = function(add_reservationPanel, day, calendarData, accountKey, scheduleMainPanel, callback){
        
        var object = this;
        var year = parseInt(calendarData.date.year);
        var month = parseInt(calendarData.date.month);
        
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
        var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
        var dayHeight = parseInt(scheduleMainPanel.clientWidth / 7);
    	console.log("dayHeight = " + dayHeight);
        
        var datePanel = document.createElement("div");
        datePanel.setAttribute("class", "calendarData");
        datePanel.textContent = calendar.formatBookingDate(month, null, year, null, null, null);
        
        console.log(year + "/" + month);
        
        var returnLabel = document.createElement("label");
        returnLabel.setAttribute("class", "arrowLeft");
        if(month == 1){
            
            returnLabel.textContent = "＜" + calendar.formatBookingDate(12, null, null, null, null, null);
            
        }else{
            
            returnLabel.textContent = "＜" + calendar.formatBookingDate((month - 1), null, null, null, null, null);;
        
        }
        
        
        var returnPanel = document.createElement("div");
        returnPanel.setAttribute("class", "calendarChangeButton");
        returnPanel.appendChild(returnLabel);
        
        var nextLabel = document.createElement("label");
        nextLabel.setAttribute("class", "arrowRight");
        if(month == 12){
            
            nextLabel.textContent = calendar.formatBookingDate(1, null, null, null, null, null) + "＞";
            
        }else{
            
            nextLabel.textContent = calendar.formatBookingDate((month + 1), null, null, null, null, null) + "＞";
            
        }
        var nextPanel = document.createElement("div");
        nextPanel.setAttribute("style", "text-align: right;");
        nextPanel.setAttribute("class", "calendarChangeButton");
        nextPanel.appendChild(nextLabel);
        
        var topPanel = document.createElement("div");
        topPanel.setAttribute("class", "calendarPanel");
        topPanel.appendChild(returnPanel);
        topPanel.appendChild(datePanel);
        topPanel.appendChild(nextPanel);
        scheduleMainPanel.appendChild(topPanel);
        
        var clickPoint = {start: null, end: null};
        var scopeOfDay = {start: null, end: null};
        var dayPanelList = {};
        calendar.create(scheduleMainPanel, calendarData, month, day, year, '', function(callback){
            
            console.log(callback);
            var key = parseInt(callback.day);
            var dayPanel = callback['eventPanel'];
            if(key > 0){
                
                dayPanelList[key] = dayPanel;
                
            }
            dayPanel.setAttribute("style", "height: " + (dayHeight / 2) + "px;");
            if(calendarData.schedule[key] != null && calendarData.schedule[key][0] != null){
                
                console.log(calendarData.schedule[key]);
                if(calendarData.schedule[key].length != 0){
                    
                    if(key == parseInt(day)){
                        
                        dayPanel.classList.add("selectedDayPanel");
                        
                    }
                    
                    if(parseInt(calendarData.schedule[key][0].remainder) <= 0){
                        
                        dayPanel.classList.add("closeDay");
                        
                    }
                    
                    dayPanel.onclick = function(){
                        
                        var dateKey = parseInt(this.getAttribute("data-key"));
                        console.log("dateKey = " + dateKey);
                        var checkIn = document.getElementById("checkIn").getAttribute("data-check");
                        var checkInUnixTime = parseInt(document.getElementById("checkIn").getAttribute("data-unixTime"));
                        console.log("checkIn = " + checkIn + " checkInUnixTime = " + checkInUnixTime);
                        
                        var schedule = calendarData.schedule[dateKey][0];
                        var checkOutUnixTime = parseInt(schedule.unixTime);
                        var checkOutBool = true;
                        if(checkInUnixTime < checkOutUnixTime){
                            
                            for(var key in dayPanelList){
                                
                                if(day <= parseInt(key) && dateKey >= parseInt(key)){
                                    
                                    var remainder = parseInt(calendarData.schedule[key][0].remainder);
                                    if(remainder == 0 && parseInt(key) != dateKey){
                                        
                                        (function(){
                                            
                                            console.log("remainder = " + remainder);
                                            for(var key in dayPanelList){
                                                
                                                if(day != parseInt(key)){
                                                    
                                                    dayPanelList[key].classList.remove("selectedDayPanel");
                                                    
                                                }
                                                
                                            }
                                            
                                        })();
                                        checkOutBool = false;
                                        break;
                                    }
                                    dayPanelList[key].classList.add("selectedDayPanel");
                                    
                                }else{
                                    
                                    dayPanelList[key].classList.remove("selectedDayPanel");
                                    
                                }
                                
                            }
                            
                        }
                        
                        var checkOut = document.getElementById("checkOut");
                        if(checkOutBool == true){
                            
                            checkOut.setAttribute("data-check", schedule.key);
                            checkOut.textContent = calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, null, null, null, schedule.weekKey);
                            
                        }else{
                            
                            checkOut.setAttribute("data-check", null);
                            checkOut.textContent = object._i18n.get("Please choose a departure date from the calendar");
                            
                        }
                        
                    }
                    
                }else{
                    
                    dayPanel.classList.add("closeDay");
                    dayPanel.classList.remove("pointer");
                    
                }
                
            }else{
                
                dayPanel.classList.add("closeDay");
                dayPanel.classList.remove("pointer");
                
            }
            
        });
        
    }
    
    this.getTotalTimeInOptions = function(options){
        
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
    
    this.createSchedule = function(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, courseList, selectedOptions, accountKey, callback){
        
        var object = this;
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
        var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
        var calendarKey = calendar.getDateKey(month, day, year);
        day = parseInt(day);
        console.log("day = " + day);
        console.log(calendarData);
        console.log(courseList);
        console.log(selectedOptions);
        var totalTimeInOptions = object.getTotalTimeInOptions(selectedOptions);
        console.log(calendarData['schedule'][calendarKey]);
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
            
        }
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
        
        scheduleMainPanel.textContent = null;
        
        var closeButton = document.createElement("button");
        closeButton.id = "closeButton";
        closeButton.textContent = object._i18n.get('Close');
        closeButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
        closeButton.setAttribute("style", "margin-left: 10px;");
        object._rightButtonPanel.textContent = null;
        object._rightButtonPanel.appendChild(closeButton);
        closeButton.onclick = function(){
            
            console.log("closeButton");
            object._rightButtonPanel.textContent = null;
            object.editPanelShow(false);
            
        }
        
        if(calendarData['schedule'][calendarKey].length == 0){
            
            console.error("error = schedule zero");
            var errorPanel = document.createElement("div");
            errorPanel.setAttribute("class", "noSchedule");
            errorPanel.textContent = object._i18n.get("No schedules");
            scheduleMainPanel.appendChild(errorPanel);
            return null;
            
        }
        
        var calendarKey = calendar.getDateKey(month, day, year);
        console.log(object._nationalHoliday[calendarKey]);
        var nationalHoliday = false;
        if (object._nationalHoliday[calendarKey] != null && parseInt(object._nationalHoliday[calendarKey].status) == 1) {
            
            nationalHoliday = true;
            
        }
        
        for(var i = 0; i < calendarData['schedule'][calendarKey].length; i++){
            
            var schedule = calendarData['schedule'][calendarKey][i];
            schedule["select"] = true;
            if (parseInt(schedule["remainder"]) == 0 || schedule["stop"] == 'true') {
                
                schedule["select"] = false;
                
            }
            
            var week = parseInt(schedule.weekKey);
            var minutes = parseInt(schedule.hour) * 60;
            if (nationalHoliday == true) {
                
                week = 7;
                
            }
            /**
            if (timeToProvide[week] != null && parseInt(timeToProvide[week][minutes]) == 0) {
                
                schedule["select"] = false;
                
            }
            **/
            for (var key in timeToProvide) {
                
                if (timeToProvide[key][week] != null && parseInt(timeToProvide[key][week][minutes]) == 0) {
                    
                    schedule["select"] = false;
                    
                }
                
            }
            
        }
        
        if(course != null || object._preparationTime > 0){
            
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
                if(parseInt(schedule["remainder"]) == 0 || schedule["stop"] == 'true'){
                    
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
                            if (i == key) {
                                
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
        
        console.log("accountKey = " + accountKey);
        console.log(object._schedule_data.calendarAccountList);
        var displayRemainingCapacity = 0;
        var calendarAccountList = object._schedule_data.calendarAccountList;
        for(var i = 0; i < calendarAccountList.length; i++){
            
            if(parseInt(calendarAccountList[i].key) == parseInt(accountKey) && parseInt(calendarAccountList[i].displayRemainingCapacity) == 1){
                
                displayRemainingCapacity = 1;
                break;
                
            }
            
        }
        console.log("displayRemainingCapacity = " + displayRemainingCapacity);
        
        var scheduleListPanel = [];
        for(var i = 0; i < calendarData['schedule'][calendarKey].length; i++){
            
            var schedule = calendarData['schedule'][calendarKey][i];
            if(typeof schedule['title'] == "string"){
                
                schedule['title'] = schedule['title'].replace(/\\/g, "");
                
            }
            console.log(schedule);
            
            var schedulePanel = document.createElement("div");
            schedulePanel.textContent = ("0" + schedule["hour"]).slice(-2) + ":" + ("0" + schedule["min"]).slice(-2) + " " + schedule['title'];
            schedulePanel.setAttribute("data-key", i);
            
            
            if(displayRemainingCapacity == 1){
                
                var displayRemainingCapacityLabel = document.createElement("span");
                displayRemainingCapacityLabel.classList.add("displayRemainingCapacityLabel");
                displayRemainingCapacityLabel.textContent = object._i18n.get("%s remaining", [schedule.remainder]);
                schedulePanel.appendChild(displayRemainingCapacityLabel);
                
            }
            
            scheduleListPanel.push(schedulePanel);
            
            if(schedule["select"] === true){
                
                schedulePanel.setAttribute("data-status", 1);
                schedulePanel.setAttribute("class", "courseAndScheduleRow");
                schedulePanel.onclick = function(){
                    
                    closeButton.setAttribute("class", "hidden_panel");
                    this.setAttribute("class", "courseAndScheduleRow courseAndScheduleRowActive");
                    var key = this.getAttribute("data-key");
                    var schedule = calendarData['schedule'][calendarKey][key];
                    object.unselectPanel(key, scheduleListPanel, "courseAndScheduleRow");
                    object.createForm(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, courseList, schedule, selectedOptions, accountKey, function(response){
                        
                        if(response.action == 'return'){
                            
                            closeButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
                            console.log(response.action);
                            
                        }else if(response.action == 'refresh'){
                            
                            callback(response)
                            
                        }
                        
                    });
                    
                }
                
            }else{
                
                schedulePanel.setAttribute("data-status", 0);
                schedulePanel.setAttribute("class", "courseAndScheduleRowError");
                
            }
            
            var table_row = document.createElement("div");
            table_row.appendChild(schedulePanel);
            
            scheduleMainPanel.appendChild(table_row);
            
        }
        
        
        
        return scheduleMainPanel;
        
    }
    
    
    this.createForm = function(mainPanel, courseMainPanel, scheduleMainPanel, formMainPanel, month, day, year, calendarData, courseList, schedule, selectedOptions, accountKey, callback){
        
        var object = this;
        console.log("accountKey = " + accountKey);
        console.log(object._formData);
        console.log(day);
        console.log(calendarData);
        console.log(courseList);
        console.log(schedule);
        console.log(selectedOptions);
        var totalTimeInOptions = object.getTotalTimeInOptions(selectedOptions);
        var input = new Input();
        formMainPanel.textContent = null;
        //buttonPanel.textContent = null;
        var children = object._rightButtonPanel.children;
        for (var i = children.length; i > 0; i--) {
            
            if (children[i - 1].id != 'closeButton') {
                object._rightButtonPanel.removeChild(children[i - 1]);
            }
            
        }
        
        var returnButton = null;
        if (object._courseBool == true) {
            
            mainPanel.setAttribute("class", "courseAndSchedulePanel_next");
            
            returnButton = document.createElement("button");
            returnButton.id = "returnButton";
            returnButton.textContent = object._i18n.get('Return');
            returnButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
            returnButton.setAttribute("style", "margin-left: 10px;");
            object._rightButtonPanel.appendChild(returnButton);
            
            
        } else {
            
            mainPanel.setAttribute("class", "courseAndSchedulePanel_next");
            scheduleMainPanel.setAttribute("class", "schedulePanel_next");
            
        }
        
        //formMainPanel.setAttribute("class", "courseListPanel box_shadow show_panel");
        formMainPanel.setAttribute("class", "createFormPanel_show box_shadow show_panel");
        /**
        if(calendarData.account.type == "day"){
            
            formMainPanel.setAttribute("class", "createFormPanel_show box_shadow show_panel");
            
        }else{
            
            formMainPanel.setAttribute("class", "createFormPanel_show box_shadow");
            
        }
        **/
        
        var bookingButton = document.createElement("button");
        bookingButton.textContent = object._i18n.get('Booking');
        bookingButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
        bookingButton.setAttribute("style", "margin-left: 10px;");
        object._rightButtonPanel.appendChild(bookingButton);
        
        var formPanel = document.createElement("div");
        formPanel.id = "inputFormPanel";
        formMainPanel.appendChild(formPanel);
        
        var monthFull = object._monthFullName[parseInt(calendarData.date.month)];
        //var date = monthFull + " " + ("0" + day).slice(-2) + ", " + calendarData.date.year + " " + ("0" + schedule.hour).slice(-2) + ":" + ("0" + schedule.min).slice(-2) + " " + schedule.title;
        
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object._dateFormat, object._positionOfWeek, object._startOfWeek, object._i18n);
    	var calendarKey = calendar.getDateKey(month, day, year);
        
        var totalCost = 0;
        if(schedule != null){
            
            var date = calendar.formatBookingDate(calendarData.date.month, day, calendarData.date.year, schedule.hour, schedule.min, schedule.title, schedule.weekKey);
            var rowPanel = object.createRowPanel(object._i18n.get("Booking Date"), date, null, null, null);
            formPanel.appendChild(rowPanel);
            totalCost = parseInt(schedule.cost);
            
        }
        
        if(calendarData.account.type == "hotel"){
            
            formMainPanel.classList.remove("show_panel");
            //scheduleMainPanel.classList.remove("schedulePanel_next");
            scheduleMainPanel.setAttribute("style", "animation-name: unset;");
            mainPanel.setAttribute("style", "animation-name: unset;");
            var schedule = calendarData.schedule[parseInt(calendarKey)][0];
            if(object._hotel.getCheckDate().checkIn != null){
                
                schedule = object._hotel.getCheckDate().checkIn;
                
            }
            console.log(schedule);
            bookingButton.disabled = true;
            var style = null;
            var date = calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, null, null, null, schedule.weekKey);
            if(schedule.remainder <= 0){
                
                style = "color: red;";
                date = object._i18n.get("There is no rooms to booking");
                object._hotel.resetCheckDate();
                
            }else if(schedule.stop == 'true'){
                
                style = "color: red;";
                date = object._i18n.get("The booking reception is suspended");
                object._hotel.resetCheckDate();
                
            }else{
                
                object._hotel.setCheckIn(schedule);
                object._hotel.setCheckInKey(schedule.key);
                
            }
            
            var checkInClear = document.createElement("label");
            checkInClear.textContent = object._i18n.get("Clear");
            checkInClear.classList.add("change");
            checkInClear.id = "checkInClear";
            
            var expressionsCheck = calendar.getExpressionsCheck(calendarData.account.expressionsCheck);
            
            var checkIn = object.createRowPanel(expressionsCheck.arrival, date, "checkIn", "true", checkInClear);
            formPanel.appendChild(checkIn);
            document.getElementById("checkIn").setAttribute("data-check", schedule.key);
            document.getElementById("checkIn").setAttribute("data-unixTime", schedule.unixTime);
            document.getElementById("checkIn").setAttribute("style", style);
            
            var checkOutClear = document.createElement("label");
            checkOutClear.textContent = object._i18n.get("Clear");
            checkOutClear.classList.add("change");
            checkOutClear.classList.add("hidden_panel");
            var checkOut = object.createRowPanel(expressionsCheck.departure, expressionsCheck.chooseDeparture, "checkOut", "true", checkOutClear);
            //document.getElementById("checkOut").setAttribute("data-check", "");
            formPanel.appendChild(checkOut);
            
            var totalLengthOfStayValue = document.createElement("div");
            totalLengthOfStayValue.id = "totalLengthOfStayValue";
            totalLengthOfStayValue.textContent = 0;
            
            var totalLengthOfStay = object.createRowPanel(object._i18n.get("Total length of stay"), totalLengthOfStayValue, null, null, null);
            formPanel.appendChild(totalLengthOfStay);
            
            console.log(calendarData.guestsList);
            var guestsList = calendarData.guestsList;
            for(var key in guestsList){
                
                var list = JSON.parse(guestsList[key].json);
                console.log(list);
                var values = [];
                for(var i = 0; i < list.length; i++){
                    
                    values.push(list[i].name);
                    
                }
                
                console.log(values);
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
                
                var value = input.createInput(guestsList[key]['name'], guestsList[key], {}, function(event){
                    
                    var key = this.parentElement.getAttribute("data-guset");
                    var index = parseInt(this.selectedIndex);
                    var list = JSON.parse(guestsList[key].json);
                    guestsList[key].index = index;
                    var response = object._hotel.setGuests(key, index, list[index].number);
                    var feeList = object._hotel.getFeeList();
                    object._hotel.pushCallback();
                    
                    totalNumberOfGuests.classList.remove("errorPanel");
                    if(response.booking == false){
                        
                        totalNumberOfGuests.classList.add("errorPanel");
                        
                    }
                    
                    console.log(totalNumberOfGuests);
                    console.log(response);
                    console.log(this.selectedIndex);
                    console.log(guestsList[key]);
                    console.log(list[index]);
                    
                });
                
                value.setAttribute("data-guset", key);
                var required = parseInt(guestsList[key].required);
                console.log("required = " + required);
                var rowPanel = object.createRowPanel(guestsList[key]['name'], value, null, required, null);
                formPanel.appendChild(rowPanel);
                
            }
            
            var feeList = object._hotel.getFeeList();
            
            var totalNumberOfGuests = object.createRowPanel(object._i18n.get("Total number of guests"), "0", "totalGuests", null, null);
            formPanel.appendChild(totalNumberOfGuests);
            
            var summaryListPanel = document.createElement("div");
            summaryListPanel.id = "summaryListPanel";
            var summaryPanel = object.createRowPanel(object._i18n.get("Summary"), summaryListPanel, "summaryPanel", null, null);
            formPanel.appendChild(summaryPanel);
            
            console.log("guestsList.length = " + guestsList.length);
            if(guestsList.length == 0){
                
                totalNumberOfGuests.classList.add("hidden_panel");
                
            }
            
            var formatPrice = object._format.formatCost(0, object._currency);
            var rowPanel = object.createRowPanel(object._i18n.get("Total price"), formatPrice, "totalPrice", null, null);
            formPanel.appendChild(rowPanel);
            
            object._hotel.setCallback(function(response){
                
                console.log(response);
                
                var checkDate = object._hotel.getCheckDate();
                console.log(checkDate);
                if(checkDate.checkIn == null){
                    
                    var checkIn = document.getElementById("checkIn");
                    checkIn.textContent = expressionsCheck.chooseArrival;
                    
                }
                
                if(checkDate.checkOut == null){
                    
                    var checkOut = document.getElementById("checkOut");
                    checkOut.setAttribute("data-check", null);
                    checkOut.textContent = expressionsCheck.chooseDeparture;
                    if(checkDate.checkIn != null){
                        
                        var dataKey = calendar.getDateKey(checkDate.checkIn.month, checkDate.checkIn.day, checkDate.checkIn.year);
                        var dayPanelList = object._hotel.getDayPanelList();
                        for(var key in dayPanelList){
                            
                            if(dataKey != key){
                                
                                dayPanelList[key].classList.remove("selectedDayPanel");
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
                var feeList = object._hotel.getFeeList();
                totalCost = response.amount;
                object._hotel.showSummary(summaryListPanel, expressionsCheck);
                var nightsValue = response.nights + " nights";
                if(response.nights == 1){
                    
                    nightsValue = response.nights + " night";
                    
                }
                document.getElementById("totalLengthOfStayValue").textContent = nightsValue;
                
                var totalNumberOfGuestsValue = 0;
                if(response.person > 1){
                    
                    totalNumberOfGuestsValue = response.person + " " + object._i18n.get("people");
                    
                }else if(response.person == 1){
                    
                    totalNumberOfGuestsValue = response.person + " " + object._i18n.get("person");
                    
                }
                
                document.getElementById("totalGuests").textContent = totalNumberOfGuestsValue;
                
                var taxAmount = 0;
                for(var key in response.taxes) {
                    
                    if ((response.taxes[key].type == 'tax' && response.taxes[key].tax == 'tax_exclusive') || response.taxes[key].type == 'surcharge') {
                    //if (response.taxes[key].tax == 'tax_exclusive') {
                        
                        taxAmount += response.taxes[key].taxValue;
                        
                    }
                    
                }
                
                var totalPrice = response.amount + taxAmount + (response.additionalFee * response.nights);
                document.getElementById("totalPrice").textContent = object._format.formatCost(totalPrice, object._currency);
                
                if(response.booking == false || response.nights == 0 || response.requiredGuests == false){
                    
                    bookingButton.disabled = true;
                    
                }else{
                    
                    bookingButton.disabled = false;
                    
                }
                
            });
            
            checkInClear.onclick = function(){
                
                this.classList.add("hidden_panel");
                var dayPanelList = object._hotel.getDayPanelList();
                for(var key in dayPanelList){
                    
                    dayPanelList[key].classList.remove("selectedDayPanel");
                    
                }
                
                object._hotel.setCheckIn(null);
                object._hotel.setCheckInKey(null)
                object._hotel.setCheckOut(null);
                object._hotel.setCheckOutKey(null);
                object._hotel.verifySchedule(true);
                
            };
            
            checkOutClear.onclick = function(){
                
                
                
            };
            
        } else {
            
            if(object._courseBool == true) {
                
                /**
                var courseCostPanel = null;
                if(course.cost != null){
                    
                    totalCost += parseInt(course.cost);
                    if (parseInt(course.cost) > 0) {
                        
                        courseCostPanel = document.createElement("span");
                        courseCostPanel.classList.add("planPrice");
                        courseCostPanel.textContent = object._format.formatCost(course.cost, object._currency);
                        
                    }
                    
                }
                
                var rowPanel = object.createRowPanel(object._courseName, course.name, null, null, null);
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
                **/
                
                var rowPanel = object.createRowPanel(object._courseName, "", null, null, null);
                var valuePanel = rowPanel.getElementsByClassName("value")[0];
                valuePanel.textContent = null;
                
                var coursePanel = document.createElement("div");
                coursePanel.classList.add("mainPlan");
                valuePanel.appendChild(coursePanel);
                object.createServicesPanel(coursePanel, courseList, "selectedOptionsList", object._currency);
                /**
                for (var key in courseList) {
                    
                    if (courseList[key].selected == 1) {
                        
                        var courseCostPanel = null;
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
                
                formPanel.appendChild(rowPanel);
                
            }
            
            console.log("totalCost = " + totalCost);
            if(totalCost != 0){
                
                var formatPrice = object._format.formatCost(totalCost, object._currency);
                var rowPanel = object.createRowPanel(object._i18n.get("Total amount"), formatPrice, "bookingFee", null, null);
                formPanel.appendChild(rowPanel);
                
            }
            
        }
        
        
        
        
        var formPanelList = {};
        var inputData = {};
        
        for(var i = 0; i < object._formData.length; i++){
            
            if(object._formData[i].active != 'true'){
                
                continue;
                
            }
            
            var value = input.createInput(i, object._formData[i], inputData, null);
            var rowPanel = object.createRowPanel(object._formData[i]['name'], value, null, object._formData[i].required, null);
            formPanelList[i] = rowPanel;
            
            formPanel.appendChild(rowPanel);
            
        }
        
        
        if(returnButton != null){
            
            returnButton.onclick = function(){
                
                console.log("returnButton onclick");
                if(returnButton != null){object._rightButtonPanel.removeChild(returnButton);}
                object._rightButtonPanel.removeChild(bookingButton);
                mainPanel.setAttribute("class", "courseAndSchedulePanel_return");
                //formMainPanel.setAttribute("class", "courseListPanel");
                formMainPanel.setAttribute("class", "createFormPanel_return return_panel");
                callback({action: 'return'});
                
            };
            
        }
        
        bookingButton.onclick = function(){
            
            console.log(object._emailEnableList);
            console.log("enable = " + Boolean(parseInt(object._emailEnableList.mail_new_admin.enable)));
            
            var enable = false;
            if(Boolean(parseInt(object._emailEnableList.mail_new_admin.enable)) === false){
                
                enable = true;
                
            }
            console.log("enable = " + enable);
            
            var confirm = new Confirm();
            confirm.dialogPanelShow(object._i18n.get("Confirm sending of email"), object._i18n.get("Do you send e-mail notifications to customers or administrators?"), enable, function(sendEmail){
                
                var valueList = {};
                var post = object.verifyForm("sendBooking", object._nonce, object._action, calendarData.date, schedule, courseList, object._formData, formPanelList, inputData, valueList);
                post.sendEmail = Number(sendEmail);
                if(post !== false){
                    
                    post.accountKey = accountKey;
                    if (calendarData.account.type == "hotel") {
                        
                        var checkDate = object._hotel.getCheckDate();
                        post.timeKey = parseInt(checkDate.checkIn.key);
                        post.unixTime = parseInt(checkDate.checkIn.unixTime);
                        
                        post.json = JSON.stringify(object._hotel.verifySchedule(true));
                        
                    }
                    
                    post.selectedOptions = JSON.stringify([]);
                    if (selectedOptions != null) {
                        
                        post.selectedOptions = JSON.stringify(selectedOptions);
                        
                    }
                    
                    object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    new Booking_App_XMLHttp(object._url, post, object._webApp, function(response){
                        
                        console.log(response);
                        if(response.status == "success"){
                            
                            object._hotel.reset();
                            object._hotel.setCallback(null);
                            object._rightButtonPanel.textContent = null;
                            response.action = 'refresh';
                            object._buttonAction = "reservation_users";
                            object.createCalendar(response, response.date.month, response.date.day, response.date.year, accountKey);
                            callback(response);
                            
                        }else{
                            
                            alert(response.message);
                            
                        }
                        object._loadingPanel.setAttribute("class", "hidden_panel");
                        
                    }, function(responseText){
                        
                        object.setResponseText(responseText);
                        
                    });
                    
                }
                
            });
            
        };
        
    }
    
    this.downloadCSV = function(month, day, year, accountKey, downloadButton){
        
        console.log("month = " + month + " day = " + day + " year = " + year);
        var object = this;
        
        object._loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var post = {nonce: object._nonce, action: object._action, mode: 'getDownloadCSV', year: year, month: month, accountKey: accountKey};
        if(day != null){
            
            post.day = day;
            
        }
        
        object.setFunction("downloadCSV", post);
        new Booking_App_XMLHttp(object._url, post, object._webApp, function(response){
            
            object._loadingPanel.setAttribute("class", "hidden_panel");
            var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            var content = response.csv;
            var blob = new Blob([bom, content], {"type": "application/octet-stream"});
            console.log(blob);
            if (window.navigator.msSaveBlob){
                
                console.log("msSaveBlob is support");
                window.navigator.msSaveBlob(blob, "list.csv");
                
            }else{
                
                console.log("msSaveBlob is not support");
                downloadButton.href = window.URL.createObjectURL(blob);
                window.open(window.URL.createObjectURL(blob), '_blank');
                
            }
            
        }, function(responseText){
            
            object.setResponseText(responseText);
            
        });
        
    }
    
    this.verifyCalendar = function(mode, month, day, year, lastDay){
        
        var calendarChange = 0;
        if(mode == 0){
        
            day--;
            if(day == 0){
                
                calendarChange = 1;
                month--;
                day = 1;
                if(month == 0){
                    month = 12;
                    year--;
                }
                
            }
            
        }else if(mode == 1){
            
            day++;
            if(day > lastDay){
                
                calendarChange = 1;
                month++;
                day = 1;
                if(month == 13){
                    month = 1;
                    year++;
                }
                
            }
            
        }
        
        var date = {month: month, day: day, year: year, calendarChange: calendarChange};
        return date;
        
    }
    
    this.verifyForm = function(mode, nonce, action, date, schedule, courseList, formData, formPanelList, inputData, valueList){
        
        console.log(date);
        console.log(schedule);
        console.log(courseList);
        var sendBool = true;
        var input = new Input();
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
            
            var post = {nonce: nonce, action: action, mode: mode, month: date.month, day: 1, year: date.year, applicantCount: '1', permission: 'public', timeKey: schedule.key, unixTime: schedule.unixTime};
            if(object._courseBool == true && courseList != null){
                
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
    
    this.unselectPanel = function(selectedKey, panelList, styleName){
        
        for(var i = 0; i < panelList.length; i++){
            
            var key = panelList[i].getAttribute("data-key");
            var status = parseInt(panelList[i].getAttribute("data-status"));
            if(key != selectedKey && status === 1){
                
                panelList[i].setAttribute("class", styleName);
                
            }
            
            
        }
        
    }
    
    this.createRowPanel = function(name, value, id, required, actionElement){
        
        if(typeof name == "string"){
            
            name = name.replace(/\\/g, "");
            
        }
        
        if(typeof value == "string"){
            
            value = value.replace(/\\/g, "");
            
        }
        
        var namePanel = document.createElement("div");
        namePanel.setAttribute("class", "name");
        namePanel.textContent = name;
        //console.log("typeof required = " + typeof required);
        if((typeof required == "string" && required == 'true') || (typeof required == "number" && required == 1)){
            
            namePanel.setAttribute("class", "name required");
            
        }
        
        var inputPanel = null;
        if(typeof value == 'string'){
            
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
        if(actionElement != null){
            
            rowPanel.appendChild(actionElement);
            
        }
        rowPanel.appendChild(inputPanel);
        
        return rowPanel;
        
    }
    
    this.editPanelShow = function(showBool){
        
        var object = this;
        var body = document.getElementsByTagName("body")[0];
        console.log(body);
        
        
        if(showBool == true){
            
            body.classList.add("modal-open");
            object._editPanel.setAttribute("class", "edit_modal");
            object._blockPanel.setAttribute("class", "edit_modal_backdrop");
            
        }else{
            
            if(document.getElementById("userInfoPanel") != null){
                
                document.getElementById("userInfoPanel").setAttribute("class", "hidden_panel");
                
            }
            
            if(document.getElementById("changePanel") != null){
                
                document.getElementById("changePanel").setAttribute("class", "hidden_panel");
                
            }
            
            if(object._contentPanel != null && document.getElementById("showUserInfo_blockPanel") != null){
                
                object._contentPanel.removeChild(document.getElementById("showUserInfo_blockPanel"));
                
            }
            
            body.classList.remove("modal-open");
            object._editPanel.setAttribute("class", "hidden_panel");
            object._blockPanel.setAttribute("class", "hidden_panel");
            
        }
        
    }
    
    this.setSelectedKey = function(_selectedKey){
        
        this._selectedKey = _selectedKey;
        
    }
    
    this.getSelectedKey = function(){
        
        return this._selectedKey;
        
    }
    
    this.setVisitors = function(_visitors){
        
        this._visitors = _visitors;
        
    }
    
    this.getVisitors = function(){
        
        return this._visitors;
        
    }
    
    this.getServiceOrOption = function(services) {
        
        var mode = "option";
        for (var key in services) {
            
            if (services[key].service != null && parseInt(services[key].service) == 1) {
                
                return "service";
                
            }
            
        }
        
        return mode;
        
    }
    
    this.createServicesPanel = function(panel, services, optionName, currency) {
        
        if (services.length > 0) {
            
            for (var key in services) {
                
                var service = services[key];
                console.log(service);
                if (parseInt(service.selected) == 1) {
                    
                    var courseCostPanel = null;
                    if (parseInt(service.cost) > 0) {
                        
                        courseCostPanel = document.createElement("span");
                        courseCostPanel.classList.add("planPrice");
                        courseCostPanel.textContent = object._format.formatCost(service.cost, currency);
                        
                    }
                    
                    var courseLinePanel = document.createElement("div");
                    courseLinePanel.classList.add("courseLinePanel");
                    panel.appendChild(courseLinePanel);
                    
                    var courseNamePanel = document.createElement("span");
                    courseNamePanel.classList.add("planName");
                    courseNamePanel.textContent = service.name;
                    courseLinePanel.appendChild(courseNamePanel);
                    if (courseCostPanel != null) {
                        
                        courseLinePanel.appendChild(courseCostPanel);
                        
                    }
                    
                    console.log(service);
                    var options = service[optionName];
                    if (options.length > 0) {
                        
                        var ul = document.createElement("ul");
                        courseLinePanel.appendChild(ul);
                        for(var i = 0; i < options.length; i++){
                            
                            var option = options[i];
                            if (parseInt(option.selected) == 1) {
                                
                                //cost += parseInt(option.cost);
                                
                                var optionNamePanel = document.createElement("span");
                                optionNamePanel.classList.add("planName");
                                optionNamePanel.textContent = option.name;
                                
                                var optionPricePanel = document.createElement("span");
                                optionPricePanel.classList.add("planPrice");
                                if (parseInt(option.cost) > 0) {
                                    
                                    optionPricePanel.textContent = object._format.formatCost(option.cost, currency);
                                    
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
            
        } else {
            
            console.error("option = " + option);
            
        }
        
    };
    
    
    
}