/* globals Booking_App_XMLHttp */
/* globals scriptError */
/* globals Booking_App_Calendar */
/* globals FORMAT_COST */

var schedule_data = schedule_data;
var booking_package_dictionary = booking_package_dictionary;

window.addEventListener('load', function(){
    
    if(schedule_data != null && booking_package_dictionary != null){
        
        var schedule = new SCHEDULE(schedule_data, booking_package_dictionary, false);
        schedule.getCalendarAccountListData(parseInt(schedule_data.month), 1, parseInt(schedule_data.year));
        
    }
    
});

/**
window.onload = function(){
    
    if(schedule_data != null && booking_package_dictionary != null){
        
        var schedule = new SCHEDULE(schedule_data, booking_package_dictionary, false);
        schedule.getCalendarAccountListData(parseInt(schedule_data.month), 1, parseInt(schedule_data.year));
        
    }
    
}
**/

window.onerror = function(msg, url, line, col, error){
    
    var error = new scriptError(schedule_data, booking_package_dictionary, msg, url, line, col, error);
    error.send();
    
}


function SCHEDULE(schedule_data, booking_package_dictionary, webApp) {
    
    console.log(schedule_data);
    this.schedule_data = schedule_data;
    this._isExtensionsValid = parseInt(schedule_data.isExtensionsValid);
    this._webApp = webApp;
    this.url = schedule_data['url'];
    this.nonce = schedule_data['nonce'];
    this.action = schedule_data['action'];
    this.dateFormat = schedule_data.dateFormat;
    this.positionOfWeek = schedule_data.positionOfWeek;
    this.settingList = schedule_data['list'];
    this._isExtensionsValid = parseInt(schedule_data.isExtensionsValid);
    this._locale = schedule_data.locale;
    this.upgradeData = {url: schedule_data['url'], nonce: schedule_data['nonce'], action: schedule_data['action'], locale: schedule_data.locale};
    this.xmlHttp = null;
    this.template_schedule_list = {};
    this.date = {};
    this.weekKey = 0;
    this.mode = null;
    this._function = {name: "root", post: {}};
    this._prefix = schedule_data.prefix;
    this._timestamp = schedule_data.timestamp;
    this._startOfWeek = schedule_data.startOfWeek;
    this._currency = schedule_data.currency;
    this._cancellationByVisitors = 1;
    this._visitorSubscriptionForStripe = 1;
    this._taxForDay = parseInt(schedule_data.taxForDay);
    this._timezone = schedule_data.timezone;
    if (schedule_data.cancellationByVisitors != null) {
        
        this._cancellationByVisitors = parseInt(schedule_data.cancellationByVisitors);
        
    }
    
    if (schedule_data.visitorSubscriptionForStripe != null) {
        
        this._visitorSubscriptionForStripe = parseInt(schedule_data.visitorSubscriptionForStripe);
        
    }
    
    console.log("this._isExtensionsValid = " + this._isExtensionsValid);
    
    this._i18n = new I18n(schedule_data.locale);
    this._i18n.setDictionary(booking_package_dictionary);
    
    this.blockPanel = document.getElementById("blockPanel");
    this.editPanel = document.getElementById("editPanelForSchedule");
    this.loadingPanel = document.getElementById("loadingPanel");
    this.buttonPanel = document.getElementById("buttonPanel_for_schedule");
    
    var object = this;
    this.blockPanel.onclick = function(){
        
        document.getElementById("edit_schedule_for_hotel").classList.add("hidden_panel");
        document.getElementById("email_edit_panel").classList.add("hidden_panel");
        document.getElementById("deletePublishedSchedulesPanel").classList.add("hidden_panel");
        document.getElementById("loadSchedulesPanel").classList.add("hidden_panel");
        document.getElementById("createClonePanel").classList.add("hidden_panel");
        object.buttonPanel.textContent = null;
        object.editPanelShow(false);
        
    }
    
    document.getElementById("media_modal_close_for_schedule").onclick = function(){
        
        document.getElementById("edit_schedule_for_hotel").classList.add("hidden_panel");
        document.getElementById("email_edit_panel").classList.add("hidden_panel");
        object.buttonPanel.textContent = null;
        object.editPanelShow(false);
        
    }
    
    this._timezoneGroup = document.getElementById("timezone_choice").getElementsByTagName("optgroup");
	this._timezoneGroup = [].slice.call(this._timezoneGroup);
	this._timezoneGroup.pop();
	this._timezoneOptions = document.getElementById("timezone_choice").getElementsByTagName("option");
	
	this._htmlTitle = document.getElementsByTagName("title")[0];
	this._htmlOriginTitle = this._htmlTitle.textContent;
    
    //this.getCalendarAccountListData(parseInt(schedule_data['month']), 1, parseInt(schedule_data['year']));
    
    this.getMode = function(){
        
        return this.mode;
        
    }
    
    this.getCalendarDate = function(){
        
        return this.date;
        
    }

    this.setCalendarDate = function(newDate){
        
        this.date = newDate;
        
    }
    
    this.setFunction = function(name, post){
        
        this._function = {name: name, post: post};
        
    }
    
    this.getFunction = function(){
        
        return this._function;
        
    }
    
    this.setCloneCalendarList = function(accountList) {
        
        var selectedClone = document.getElementById("selectedClone");
        selectedClone.textContent = null;
        for (var key in accountList) {
            
            var option = document.createElement("option");
            option.value = accountList[key].key;
            option.textContent = accountList[key].name;
            selectedClone.appendChild(option);
            
        }
        
    }

    this.getCalendarAccountListData = function(month, day, year){
        
        var object = this;
        object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var post = {nonce: object.nonce, action: object.action, mode: 'getCalendarAccountListData', year: year, month: month, day: day};
        object.setFunction("getCalendarAccountListData", post);
        object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(accountList){
                
            object.loadingPanel.setAttribute("class", "hidden_panel");
            object.createCalendarAccountList(accountList, month, day, year);
            object.setCloneCalendarList(accountList);
            
        });
        
    }

    this.getAccountScheduleData = function(month, day, year, account){
        
        var object = this;
        object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var post = {nonce: object.nonce, action: object.action, mode: 'getAccountScheduleData', year: year, month: month, day: day};
        if(account != null){
            
            post.accountKey = account.key;
            
        }
        object.setFunction("getAccountScheduleData", post);
        object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(calendarData){
                
            object.loadingPanel.setAttribute("class", "hidden_panel");
            console.log(calendarData);
            object.createCalendar(calendarData, month, day, year, account);
            
        });
        
    }

    this.createCalendarAccountList = function(accountList, month, day, year){
        
        console.log(accountList);
        //this.selectionSchedulePanel("minutes", 10, 30, 30, 2, 2, null);
        var object = this;
        var calendarAccountList = document.getElementById("calendarAccountList");
        calendarAccountList.classList.remove("hidden_panel");
        
        document.getElementById("serviceDisabled").classList.add("hidden_panel");
        
        var table = document.getElementById("calendar_list_table");
        table.textContent = null;
        
        var titleTr = document.createElement("tr");
        table.appendChild(titleTr);
        
        var list = {key: 'ID', name: object._i18n.get('Name'), status: object._i18n.get('Status'), type: object._i18n.get('Type'), shortCode: object._i18n.get('Shortcode')};
        console.log("schedule_data.calendarAccountType = " + parseInt(object.schedule_data.calendarAccountType));
        
        for(var key in list){
            
            var elementName = document.createElement("div");
            elementName.textContent = list[key];
            
            var td = document.createElement("td");
            td.appendChild(elementName);
            if(key == 'key'){
                
                td.style.width = "10%";
                
            }else if(key == 'status' || key == 'type'){
                
                td.style.width = "15%";
                
            }
            titleTr.appendChild(td);
            
        }
        
        var calendarAccountClick = true;
        for(var i = 0; i < accountList.length; i++){
            
            var account = accountList[i];
            console.log(account);
            var tr = document.createElement("tr");
            tr.setAttribute("data-key", i);
            tr.classList.add("pointer");
            table.appendChild(tr);
            for(var key in list){
                
                var elementName = document.createElement("div");
                elementName.textContent = account[key];
                if(key == 'shortCode'){
                    
                    var shortCodeText = document.createElement("input");
                    shortCodeText.style.width = "100%";
                    shortCodeText.type = "text";
                    shortCodeText.value = "[booking_package id=" + account['key'] + "]";
                    shortCodeText.setAttribute("readonly", "readonly");
                    elementName.appendChild(shortCodeText);
                    shortCodeText.onclick = function(){
                        
                        this.focus();
                        this.select();
                        calendarAccountClick = false;
                        
                    }
                    
                    shortCodeText.onmouseout = function(){
                        
                        calendarAccountClick = true;
                        
                    }
                    
                }else{
                    
                    account[key] = account[key].replace(/\\/g, "");
                    elementName.textContent = account[key];
                    if(key != 'name'){
                        
                        elementName.textContent = account[key].toUpperCase();
                        
                    }
                    
                }
                
                var td = document.createElement("td");
                td.appendChild(elementName);
                tr.appendChild(td);
                tr.onclick = function(){
                    
                    if(calendarAccountClick === true){
                        
                        calendarAccountList.classList.add("hidden_panel");
                        var accountId = parseInt(this.getAttribute("data-key"));
                        object.loadTabFrame(accountList, month, day, year, accountList[accountId]);
                        var calendarNamePanel = document.getElementById("calendarName");
                        calendarNamePanel.classList.remove("hidden_panel");
                        calendarNamePanel.textContent = accountList[accountId].name;
                        object._htmlTitle.textContent = accountList[accountId].name;
                        
                    }
                    
                }
                
            }
            
        }
        
        var addCalendarAccountButton = document.getElementById("add_new_calendar");
        var createCloneButton = document.getElementById("create_clone");
        
        addCalendarAccountButton.onclick = function() {
            
            addCalendarAccountButton.classList.add("hidden_panel");
            createCloneButton.classList.add("hidden_panel");
            table.classList.add("hidden_panel");
            object.addItem(calendarAccountList, 'addCalendarAccount', null, object.schedule_data['elementForCalendarAccount'], function(json){
                
                console.log(json);
                if (json != 'close') {
                    
                    object.createCalendarAccountList(json, month, day, year);
                    object.setCloneCalendarList(json);
                    
                }
                
                addCalendarAccountButton.classList.remove("hidden_panel");
                createCloneButton.classList.remove("hidden_panel");
                table.classList.remove("hidden_panel");
                
            });
            
        };
        
        createCloneButton.onclick = function() {
            
            object.blockPanel.classList.remove("hidden_panel");
            object.blockPanel.classList.add("edit_modal_backdrop");
            var createClonePanel = document.getElementById("createClonePanel");
            createClonePanel.classList.remove("hidden_panel");
            var targetList = createClonePanel.getElementsByClassName("target");
            
            document.getElementById("createCloneButton").onclick = function() {
                
                var selectedClone = document.getElementById("selectedClone");
                var cloneKey = selectedClone.options[selectedClone.selectedIndex].value;
                console.log("cloneKey = " + cloneKey);
                var post = {nonce: object.nonce, action: object.action, mode: 'createCloneCalendar', accountKey: cloneKey, all: 0};
                for (var i = 0; i < targetList.length; i++) {
                    
                    if (targetList[i].checked == true) {
                        
                        console.log(targetList[i].value);
                        post[targetList[i].value] = 1;
                        
                    }
                    
                }
                
                console.log(post);
                object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                        
                    object.loadingPanel.setAttribute("class", "hidden_panel");
                    createClonePanel.classList.add("hidden_panel");
                    object.blockPanel.classList.add("hidden_panel");
                    object.blockPanel.classList.remove("edit_modal_backdrop");
                    object.createCalendarAccountList(json, month, day, year);
                    object.setCloneCalendarList(json);
                    
                });
                
            };
            
            document.getElementById("createClonePanel_return_button").onclick = function() {
                
                createClonePanel.classList.add("hidden_panel");
                object.blockPanel.classList.add("hidden_panel");
                object.blockPanel.classList.remove("edit_modal_backdrop");
                
                
            };
            
        };
        
    }

    this.loadTabFrame = function(accountList, month, day, year, account){
        
        console.log(account);
        //createSettingPanel();
        var object = this;
        
        var tabFrame = document.getElementById("tabFrame");
        tabFrame.classList.remove("hidden_panel");
        var menuList = {calendarLink: 'schedulePage', formLink: 'formPanel', courseLink: 'coursePanel', guestsLink: 'guestsPanel', subscriptionsLink: 'subscriptionsPanel', taxLink: 'taxPanel', emailLink: 'emailPanel', syncLink: 'syncPanel', settingLink: 'settingPanel'};
        for(var key in menuList){
            
            document.getElementById(menuList[key]).setAttribute("class", "hidden_panel");

        }
        
        if (account.type == 'day') {
            
            delete menuList.guestsLink;
            document.getElementById("guestsLink").classList.add("hidden_panel");
            
            if (object._taxForDay == 1) {
                
                document.getElementById("taxLink").classList.remove("hidden_panel");
                
            } else {
                
                delete menuList.taxLink;
                document.getElementById("taxLink").classList.add("hidden_panel");
                
            }
            
        } else {
            
            delete menuList.courseLink;
            delete menuList.subscriptionsLink;
            document.getElementById("courseLink").classList.add("hidden_panel");
            document.getElementById("subscriptionsLink").classList.add("hidden_panel");
            
        }
        
        if (object._visitorSubscriptionForStripe == 0) {
            
            delete menuList.subscriptionsLink;
            document.getElementById("subscriptionsLink").classList.add("hidden_panel");
            
        }
        
        for(var key in menuList){
            
            var button = document.getElementById(key);
            button.setAttribute("data-key", key);
            
            if(key == 'calendarLink'){
                
                document.getElementById(key).setAttribute("class", "menuItem active");
                document.getElementById(menuList[key]).setAttribute("class", "");
                
            }else{
                
                document.getElementById(key).setAttribute("class", "menuItem");
                document.getElementById(menuList[key]).setAttribute("class", "hidden_panel");
                
            }
            
            button.onclick = function(event){
                
                var clickKey = this.getAttribute("data-key");
                console.log(clickKey);
                document.getElementById("serviceDisabled").classList.add("hidden_panel");
                for(var key in menuList){
                    
                    var link = document.getElementById(key);
                    var panel = document.getElementById(menuList[key]);
                    if(clickKey == key){
                        
                        link.setAttribute("class", "menuItem active");
                        panel.setAttribute("class", "");
                        console.log("clickKey = " + key);
                        if(clickKey == 'calendarLink'){
                            
                            object.getAccountScheduleData(month, day, year, account);
                            
                        }else if(clickKey == 'formLink'){
                            
                            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object.nonce, action: object.action, mode: 'getForm', accountKey: account.key};
                            object.setFunction("loadTabFrame", post);
                            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(formList){
                                
                                object.loadingPanel.setAttribute("class", "hidden_panel");
                                console.log(formList);
                                object.createFormPanel(formList, account);
                                
                            });
                        
                        }else if(clickKey == 'courseLink'){
                            
                            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object.nonce, action: object.action, mode: 'getCourseList', accountKey: account.key};
                            object.setFunction("loadTabFrame", post);
                            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(courseList){
                                
                                object.loadingPanel.setAttribute("class", "hidden_panel");
                                console.log(courseList);
                                object.createCoursePanel(courseList, account);
                            
                            });
                            
                        }else if(clickKey == 'guestsLink'){
                            
                            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object.nonce, action: object.action, mode: 'getGuestsList', accountKey: account.key};
                            object.setFunction("loadTabFrame", post);
                            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(guestsList){
                                
                                object.loadingPanel.setAttribute("class", "hidden_panel");
                                console.log(guestsList);
                                object.createGuestsPanel(guestsList, account)
                                
                            });
                            
                        }else if(clickKey == 'emailLink'){
                            
                            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object.nonce, action: object.action, mode: 'getEmailMessageList', accountKey: account.key};
                            object.setFunction("loadTabFrame", post);
                            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                                
                                object.loadingPanel.setAttribute("class", "hidden_panel");
                                console.log(json);
                                object.emailSettingPanel(json.emailMessageList, json.formData, account);
                                
                            });
					        
					    }else if(clickKey == 'syncLink'){
					        
					        object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object.nonce, action: object.action, mode: 'getIcalToken', accountKey: account.key};
                            object.setFunction("loadTabFrame", post);
                            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                                
                                object.loadingPanel.setAttribute("class", "hidden_panel");
                                console.log(json);
                                object.syncPanel(json.ical, json.icalToken, json.home, account, function(json){
                                    
                                });
                                
                            });
						    
                        } else if (clickKey == 'settingLink') {
					        
                            object.settingPanel(accountList, month, day, year, account, function(json){
                                
                                accountList = json;
                                for(var i in json){
                                    
                                    if (json[i].key == account.key) {
                                        
                                        account = json[i];
                                        break;
                                        
                                    }
                                    
                                }
                            
                            });
						    
                        } else if(clickKey == 'subscriptionsLink') {
                            
                            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object.nonce, action: object.action, mode: 'getSubscriptions', accountKey: account.key};
                            object.setFunction("loadTabFrame", post);
                            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                                
                                object.loadingPanel.setAttribute("class", "hidden_panel");
                                console.log(json);
                                object.subscriptionsPanel(json, account, function(json){
                                    
                                });
                                
                            });
                            
                        } else if(clickKey == 'taxLink') {
                            
                            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                            var post = {nonce: object.nonce, action: object.action, mode: 'getTaxes', accountKey: account.key};
                            object.setFunction("loadTabFrame", post);
                            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                                
                                object.loadingPanel.setAttribute("class", "hidden_panel");
                                console.log(json);
                                object.taxPanel(json, account);
                                
                            });
                            
                        }
                        
                    }else{
                        
                        link.setAttribute("class", "menuItem");
                        panel.setAttribute("class", "hidden_panel");
				        
				    }
				    
			    }
			    
		    }
		    
	    }
	    
	    var return_to_calendar_list = document.getElementById("return_to_calendar_list");
	    return_to_calendar_list.onclick = function(){
	        
	        var calendarNamePanel = document.getElementById("calendarName");
	        calendarNamePanel.classList.add("hidden_panel");
	        calendarNamePanel.textContent = null;
	        object._htmlTitle.textContent = object._htmlOriginTitle;
	        
	        tabFrame.classList.add("hidden_panel");
	        object.createCalendarAccountList(accountList, month, day, year);
	        
	    }
	    
    	object.getAccountScheduleData(month, day, year, account);
	    
    }
    
    this.createCalendar = function(calendarData, month, day, year, account){
        
        console.log(account);
        console.log(typeof month);
        var object = this;
        object._startOfWeek = account.startOfWeek;
        this.date = {month: month, day: day, year: year};
        var calendarPanel = document.getElementById("schedulePage");
        calendarPanel.textContent = null;
        
        var deletePublishedScheduleButton = document.createElement("button");
        deletePublishedScheduleButton.setAttribute("class", "media-button button-primary button-large media-button-insert deleteButton");
        deletePublishedScheduleButton.textContent = object._i18n.get("Delete schedules");
        if(account.type == "hotel"){
            
            deletePublishedScheduleButton.classList.add("hidden_panel");
            
        }
        
        var save_setting = null;
        if(document.getElementById("save_setting") == null){
            
            save_setting = document.createElement("button");
            save_setting.setAttribute("class", "w3tc-button-save button-primary");
            save_setting.textContent = object._i18n.get("Edit schedule by day of the week");
            calendarPanel.appendChild(save_setting);
            save_setting.onclick = function(){
                
                object.editTemplateSchedule(0, account);
                
            }
            
            calendarPanel.appendChild(deletePublishedScheduleButton);
            deletePublishedScheduleButton.onclick = function(){
                
                var period_after_date = document.getElementById("period_after_date");
                var period_within_date = document.getElementById("period_within_date");
                period_within_date.classList.add("hidden_panel");
                
                document.getElementById("period_after").checked = true;
                document.getElementById("period_after").onclick = function(){
                    
                    if(this.checked == true){
                        
                        period_within_date.classList.add("hidden_panel");
                        
                    }
                    
                }
                
                document.getElementById("period_within").onclick = function(){
                    
                    if(this.checked == true){
                        
                        period_within_date.classList.remove("hidden_panel");
                        
                    }
                    
                }
                
                object.blockPanel.classList.remove("hidden_panel");
                object.blockPanel.classList.add("edit_modal_backdrop");
                var deletePublishedSchedulesPanel = document.getElementById("deletePublishedSchedulesPanel");
                deletePublishedSchedulesPanel.classList.remove("hidden_panel");
                var timestamp = object._timestamp;
                var date_list = {deletePublishedSchedules_from_month: "n", deletePublishedSchedules_from_day: "j", deletePublishedSchedules_from_year: "Y", deletePublishedSchedules_to_month: "n", deletePublishedSchedules_to_day: "j", deletePublishedSchedules_to_year: "Y"};
                for(var key in date_list){
                    
                    var value = date_list[key];
                    var options = document.getElementById(key).options;
                    for(var i = 0; i < options.length; i++){
                        
                        if(parseInt(timestamp[value]) == parseInt(options[i].value)){
                            
                            options[i].selected = true;
                            break;
                            
                        }
                        
                    }
                    
                    if(object._isExtensionsValid == 0){
                        
                        document.getElementById(key).disabled = true;
                        
                    }
                    
                }
                
                if(object._isExtensionsValid == 0){
                    
                    document.getElementById("deletePublishedSchedules_freePlan").classList.remove("hidden_panel");
                    document.getElementById("period_within").disabled = true;
                    period_within_date.classList.add("hidden_panel");
                    
                }
                
                document.getElementById("deletePublishedSchedulesButton").onclick = function(){
                    
                    var post = {
                        nonce: object.nonce, 
                        action: object.action, 
                        mode: 'deletePublishedSchedules', 
                        accountKey: account.key, 
                        period: "period_all",
                        deletePublishedSchedules_from_month: timestamp.n,
                        deletePublishedSchedules_from_day: timestamp.j,
                        deletePublishedSchedules_from_year: timestamp.Y,
                        deletePublishedSchedules_to_month: timestamp.n,
                        deletePublishedSchedules_to_day: timestamp.j,
                        deletePublishedSchedules_to_year: timestamp.Y,
                    };
                    
                    if(object._isExtensionsValid == 1){
                        
                        for(var key in date_list){
                            
                            var select = document.getElementById(key);
                            post[key] = select.value;
                            
                        }
                        
                    }
                    
                    if(document.getElementById("period_after").checked == true){
                        
                        post.period = "period_after";
                        
                    }
                    
                    if(document.getElementById("period_within").checked == true){
                        
                        post.period = "period_within";
                        
                    }
                    
                    object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(response){
                        
                        object.loadingPanel.setAttribute("class", "hidden_panel");
                        if(response.status == "success"){
                            
                            document.getElementById("deletePublishedSchedulesPanel").classList.add("hidden_panel");
                            object.blockPanel.classList.add("hidden_panel");
                            object.getAccountScheduleData(month, 1, year, account);
                            
                        }
                        
                    });
                    
                }
                
            };
            
            var deletePublishedSchedulesPanel_return_button = document.getElementById("deletePublishedSchedulesPanel_return_button");
            deletePublishedSchedulesPanel_return_button.onclick = function(){
                
                document.getElementById("deletePublishedSchedulesPanel").classList.add("hidden_panel");
                object.blockPanel.classList.add("hidden_panel");
                
            }
            
        }
        
        var editButton = null;
        var clearButton = null;
        
        if(account.type == "day"){
            
            save_setting.classList.remove("hidden_panel");
            
        }else if(account.type == "hotel"){
            
            save_setting.classList.add("hidden_panel");
            
            if(document.getElementById("edit_schedule_button") == null){
                
                editButton = document.createElement("button");
                editButton.disabled = true;
                editButton.setAttribute("class", "w3tc-button-save button-primary");
                editButton.textContent = object._i18n.get("Edit schedule");
                calendarPanel.appendChild(editButton);
                editButton.onclick = function(){
                    
                    console.log(scopeOfDay);
                    object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    var post = {nonce: object.nonce, action: object.action, mode: 'getRangeOfSchedule', accountKey: account.key, year: year, month: month, start: scopeOfDay.start, end: scopeOfDay.end};
                    object.setFunction("createCalendar", post);
                    object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(scheduleList){
                        
                        object.loadingPanel.setAttribute("class", "hidden_panel");
                        console.log(scheduleList);
                        object.editScheduleForHotel(month, scopeOfDay, year, account, scheduleList, function(calendarData){
                            
                            object.createCalendar(calendarData, month, day, year, account);
                            
                        });
                        
                    });
                    
                }
                
                clearButton = document.createElement("button");
                clearButton.id = "clearSchedule";
                clearButton.disabled = true;
                clearButton.setAttribute("style", "margin-left: 1em;");
                clearButton.setAttribute("class", "w3tc-button-save button-primary");
                clearButton.textContent = object._i18n.get("Clear");
                calendarPanel.appendChild(clearButton);
                clearButton.onclick = function(){
                    
                    editButton.disabled = true;
                    clearButton.disabled = true;
                    for(var key in dayPanelList){
                        
                        dayPanelList[key].classList.remove("selectedDayPanel");
                        
                    }
                    
                }
                
            }
            
        }
        
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
        var calendar = new Booking_App_Calendar(weekName, object.dateFormat, object.positionOfWeek, object._startOfWeek, object._i18n);
        
        var dayHeight = parseInt(calendarPanel.clientWidth / 7);
        
        var datePanel = document.createElement("div");
        datePanel.setAttribute("class", "calendarData");
        datePanel.textContent = calendar.formatBookingDate(month, null, year, null, null, null);
        
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
        calendarPanel.appendChild(topPanel);
        
        var clickPoint = {start: null, end: null};
        var scopeOfDay = {start: null, end: null};
        var dayPanelList = {};
        calendar.create(calendarPanel, calendarData, month, day, year, '', function(callback){
            
            console.log(callback);
            var dayPanel = callback['eventPanel'];
            dayPanel.setAttribute("data-click", callback.bool);
            if(callback.bool == 1){
                
                dayPanelList[callback.key] = dayPanel;
                
            }
            
            if(callback.status == 0){
                
                dayPanel.classList.add("closeDay");
                
            }
            
            dayPanel.onclick = function(){
                
                if(parseInt(this.getAttribute("data-click")) == 0){
                    
                    return null;
                    
                }
                
                var monthKey = this.getAttribute("data-month");
                var dayKey = this.getAttribute("data-day");
                var yearKey = this.getAttribute("data-year");
                var week = this.getAttribute("data-week");
                object.setCalendarDate({month: monthKey, day: dayKey, year: yearKey});
                object.editPublicSchedule(monthKey, dayKey, yearKey, week, account, function(callback){
                    
                    console.log("editPublicSchedule callback");
                    
                });
            
            }
            
            if(account.type == "hotel"){
                
                dayPanel.classList.add("pointer");
                dayPanel.onclick = function(){
                    
                    if(parseInt(this.getAttribute("data-click")) == 0){
                        
                        return null;
                        
                    }
                    
                    var dayKey = parseInt(this.getAttribute("data-key"));
                    if(clickPoint.start == null){
                        
                        editButton.disabled = true;
                        clearButton.disabled = true;
                        clickPoint.start = parseInt(dayKey);
                        for(var key in dayPanelList){
                            
                            dayPanelList[key].classList.remove("selectedDayPanel");
                            
                        }
                        
                    }else if(clickPoint.start != null && clickPoint.end == null){
                        
                        editButton.disabled = false;
                        clearButton.disabled = false;
                        if(clickPoint.start > dayKey){
                            
                            clickPoint.end = clickPoint.start;
                            clickPoint.start = dayKey;
                            
                        }else{
                            
                            clickPoint.end = dayKey;
                            
                        }
                        
                        for(var key in dayPanelList){
                            
                            if(clickPoint.start <= parseInt(key) && clickPoint.end >= parseInt(key)){
                                
                                dayPanelList[key].classList.add("selectedDayPanel");
                                console.log(dayPanelList[key]);
                                
                            }else{
                                
                                dayPanelList[key].classList.remove("selectedDayPanel");
                                
                            }
                            
                        }
                        
                        scopeOfDay.start = clickPoint.start;
                        scopeOfDay.end = clickPoint.end;
                        clickPoint.start = null;
                        clickPoint.end = null;
                        
                    }
                    console.log(clickPoint);
                    
	            }
                
		        dayPanel.onmouseover = function(){
                    
                    var dayKey = parseInt(this.getAttribute("data-key"));
                    if(clickPoint.start != null){
                        
                        for(var key in dayPanelList){
                            
                            if(clickPoint.start > dayKey){
                                
                                if(clickPoint.start >= key && dayKey <= key){
                                    
                                    dayPanelList[key].classList.add("selectedDayPanel");
                                
                                }else{
                                    
                                    dayPanelList[key].classList.remove("selectedDayPanel");
                                    
                                }
                            
                            }else{
                                
                                if(clickPoint.start <= key && dayKey >= key){
                                    
                                    dayPanelList[key].classList.add("selectedDayPanel");
                                
                                }else{
                                    
                                    dayPanelList[key].classList.remove("selectedDayPanel");
                                    
                                }
                                
                            }
                            
                        }
                    
                    }
                    
                }
                    
            }
        
        });
        
        returnLabel.onclick = function(){
            
            if(month == 1){
                
                year--;
                month = 12;
                
            }else{
                
                month--;
                
            }
            
            object.getAccountScheduleData(month, 1, year, account);
        
        }
        
        nextLabel.onclick = function(){
            
            if(month == 12){
                
                year++;
                month = 1;
                
            }else{
                
                month++;
                
            }
            
            object.getAccountScheduleData(month, 1, year, account);
            
        }
        
    }

    this.editScheduleForHotel = function(month, scopeOfDay, year, account, scheduleList, callback){
        
        console.log(scheduleList);
        var object = this;
        var editSchedulePanel = document.getElementById("edit_schedule_for_hotel");
    	editSchedulePanel.classList.remove("hidden_panel");
    	var media_frame_content = document.getElementById("media_frame_content_for_schedule");
    	media_frame_content.textContent = null;
        document.getElementById("media_title_for_schedule").classList.add("media_left_zero");
    	document.getElementById("media_router_for_schedule").classList.add("hidden_panel");
    	document.getElementById("menu_panel_for_schedule").classList.add("hidden_panel");
    	document.getElementById("frame_toolbar_for_schedule").setAttribute("class", "media_frame_toolbar media_left_zero");
    	
    	document.getElementById("edit_title_for_schedule").textContent = object._i18n.get("Schedules");
    	
    	object.editPanelShow(true);
    	
    	
    	
    	var scheduleEditTable = document.getElementById("scheduleEditTable");
    	scheduleEditTable.textContent = null;
    	var titleList = [object._i18n.get("Date"), object._i18n.get("State")/**, object._i18n.get("Receptionist")**/, object._i18n.get("Price"), object._i18n.get("Number of rooms available")];
    	var tr = document.createElement("tr");
    	for(var i = 0; i < titleList.length; i++){
    	    
    	    var td = document.createElement("td");
    	    td.textContent = titleList[i];
    	    tr.appendChild(td);
    	    
    	}
    	scheduleEditTable.appendChild(tr);
    	
    	var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object.dateFormat, object.positionOfWeek, object._startOfWeek, object._i18n);
    	for(var key in scheduleList){
    	    
    	    var schedule = scheduleList[key]
    	    var tdDate = document.createElement("td");
    	    tdDate.textContent = calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, null, null, null, schedule.weekKey);
    	    
    	    var tdState = document.createElement("td");
    	    tdState.textContent = object._i18n.get("New");
    	    if(schedule.key != null){
    	        
    	        tdState.textContent = object._i18n.get("Published");
    	        if(schedule.stop == "true"){
    	            
    	            tdState.textContent = object._i18n.get("Unpublished");
    	            
    	        }
    	        
    	    }
    	    
    	    
    	    
    	    var radioReceptionist = document.createElement("input");
    	    radioReceptionist.setAttribute("data-key", key);
    	    radioReceptionist.type = "checkbox";
    	    radioReceptionist.value = object._i18n.get("Published");
    	    
    	    var labelReceptionist = document.createElement("label");
    	    labelReceptionist.appendChild(radioReceptionist);
    	    labelReceptionist.insertAdjacentHTML("beforeend", object._i18n.get("Published"));
    	    //labelReceptionist.innerHTML = "Enable";
    	    
    	    if(schedule.stop == "false"){
    	        
    	        radioReceptionist.checked = true;
    	        
    	    }
    	    
    	    var tdReceptionist = document.createElement("td");
    	    tdReceptionist.appendChild(labelReceptionist);
    	    
    	    var textPrice = document.createElement("input");
    	    textPrice.setAttribute("data-key", key);
    	    textPrice.type = "text";
    	    textPrice.value = schedule.cost;
    	    
    	    var tdPrice = document.createElement("td");
    	    tdPrice.appendChild(textPrice);
    	    
    	    var textCapacity = document.createElement("input");
    	    textCapacity.setAttribute("data-key", key);
    	    textCapacity.type = "text";
    	    textCapacity.value = schedule.capacity;
    	    
    	    var tdCapacity = document.createElement("td");
    	    tdCapacity.appendChild(textCapacity);
    	    
    	    var tr = document.createElement("tr");
    	    tr.appendChild(tdDate);
    	    //tr.appendChild(tdState);
    	    tr.appendChild(tdReceptionist);
    	    tr.appendChild(tdPrice);
    	    tr.appendChild(tdCapacity);
    	    
    	    scheduleEditTable.appendChild(tr);
    	    
    	    radioReceptionist.onchange = function(){
    	        
    	        var dataKey = this.getAttribute("data-key");
    	        console.log(this.checked);
    	        if(this.checked == true){
    	            
    	            scheduleList[dataKey].stop = "false";
    	            
    	        }else{
    	            
    	            scheduleList[dataKey].stop = "true";
    	            
    	        }
    	        
    	    }
    	    
    	    textPrice.onchange = function(){
    	        
    	        var dataKey = this.getAttribute("data-key");
    	        var value = this.value;
    	        console.log("dataKey = " + dataKey + " value = " + parseInt(value));
    	        scheduleList[dataKey].cost = parseInt(value);
    	        console.log(scheduleList[dataKey]);
    	        
    	    }
    	    
    	    textCapacity.onchange = function(){
    	        
    	        var dataKey = this.getAttribute("data-key");
    	        var value = this.value;
    	        console.log("dataKey = " + dataKey + " value = " + value);
    	        scheduleList[dataKey].capacity = parseInt(value);
    	        console.log(scheduleList[dataKey]);
    	        
    	    }
    	    
    	}
    	
    	var saveButton = document.createElement("button");
    	saveButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
    	saveButton.textContent = object._i18n.get("Save");
    	
    	var buttonPanel = document.getElementById("buttonPanel_for_schedule");
    	buttonPanel.textContent = null;
    	buttonPanel.appendChild(saveButton);
    	
    	saveButton.onclick = function(){
    	    
    	    console.log(scheduleList);
    	    var json = JSON.stringify(scheduleList);
    	    console.log(json);
    	    
            var post = {nonce: object.nonce, action: object.action, mode: 'updateRangeOfSchedule', accountKey: account.key, year: year, month: month, start: scopeOfDay.start, end: scopeOfDay.end, json: json};
            object.setFunction("editScheduleForHotel", post);
            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(scheduleList){
                
                console.log(scheduleList);
                object.editScheduleForHotel(month, scopeOfDay, year, account, scheduleList.getRangeOfSchedule, callback);
                callback(scheduleList.getAccountScheduleData);
                
                
            });
    	    
    	}
    	
    }

    this.editPublicSchedule = function(month, day, year, week, account, callback){
        
        var object = this;
        var weekName = [object._i18n.get('Sun'), object._i18n.get('Mon'), object._i18n.get('Tue'), object._i18n.get('Wed'), object._i18n.get('Thu'), object._i18n.get('Fri'), object._i18n.get('Sat')];
    	var calendar = new Booking_App_Calendar(weekName, object.dateFormat, object.positionOfWeek, object._startOfWeek, object._i18n);
        
        document.getElementById("media_frame_content_for_schedule").textContent = null;
        var edit_title = document.getElementById("edit_title_for_schedule");
        //edit_title.textContent = monthFullName[month] + " " + day + ", " + year;
        edit_title.textContent = calendar.formatBookingDate(month, day, year, null, null, null, week);
        
        document.getElementById("media_router_for_schedule").classList.remove("hidden_panel");
        document.getElementById("remainder").setAttribute("class", "td_width_50_px pointer");
        document.getElementById("allScheduleDelete").setAttribute("class", "td_width_50_px pointer");
        document.getElementById("menu_panel_for_schedule").setAttribute("class", "media_frame_menu hidden_panel");
        //document.getElementById("media_title_for_schedule").setAttribute("class", "media_left_zero");
        document.getElementById("media_title_for_schedule").classList.add("media_left_zero");
        //document.getElementById("media_router_for_schedule").setAttribute("class", "media_left_zero");
        document.getElementById("media_router_for_schedule").classList.add("media_left_zero");
        document.getElementById("media_frame_content_for_schedule").setAttribute("class", "media_left_zero");
        document.getElementById("frame_toolbar_for_schedule").setAttribute("class", "media_frame_toolbar media_left_zero");
        
        object.getPublicSchedule(month, day, year, account, callback);
        object.editPanelShow(true);
        
    }
    
    this.editTemplateSchedule = function(weekKey, account){
        
        var object = this;
        document.getElementById("media_frame_content_for_schedule").textContent = null;
        var edit_title = document.getElementById("edit_title_for_schedule");
        edit_title.textContent = object._i18n.get("Schedule setting");
        var media_menu = document.getElementById("media_menu_for_schedule");
        media_menu.textContent = null;
        
        document.getElementById("media_router_for_schedule").classList.remove("hidden_panel");
        document.getElementById("remainder").setAttribute("class", "hidden_panel");
        //document.getElementById("allScheduleDelete").setAttribute("class", "hidden_panel");
        document.getElementById("menu_panel_for_schedule").setAttribute("class", "media_frame_menu");
        //document.getElementById("media_title_for_schedule").setAttribute("class", "media_frame_title");
        //media_left_zero
        document.getElementById("media_title_for_schedule").classList.remove("media_left_zero");
        //document.getElementById("media_router_for_schedule").setAttribute("class", "media_frame_router");
        document.getElementById("media_router_for_schedule").classList.remove("media_left_zero");
        document.getElementById("media_frame_content_for_schedule").setAttribute("class", "");
        document.getElementById("frame_toolbar_for_schedule").setAttribute("class", "media_frame_toolbar");
        
        var weekPanelList = [];
        var weekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for(var i = 0; i < weekList.length; i++){
            
            var div = document.createElement("div");
            div.setAttribute("data-key", i);
            div.textContent = object._i18n.get(weekList[i]);
            div.onclick = function(){
                
                for(var i = 0; i < weekPanelList.length; i++){
                    
                    weekPanelList[i].setAttribute("class", "");
                    
                }
                var key = this.getAttribute("data-key");
                //edit_title.textContent = "Schedule setting on " + weekList[key];
                edit_title.textContent = object._i18n.get("Schedule setting on %s", [object._i18n.get(weekList[key])]);
                this.setAttribute("class", "media_active");
                document.getElementById("media_frame_content_for_schedule").textContent = null;
                object.getTemplateSchedule(key, account);
                
            }
            
            weekPanelList.push(div);
            media_menu.appendChild(div);
            
        }
        /**
        var test = document.createElement("div");
        test.textContent = "If the appointment is registered on the day of the week, even if you change or add the schedule for the day of the week, the result is not reflected on the calendar that has already been published.";
        media_menu.appendChild(test);
        **/
        if(weekKey != null){
            
            var key = parseInt(weekKey);
            edit_title.textContent = object._i18n.get("Schedule setting on %s", [object._i18n.get(weekList[key])]);
            weekPanelList[key].setAttribute("class", "media_active");
            object.getTemplateSchedule(key, account);
            
        }
        
        object.editPanelShow(true);
        
    }

    this.getPublicSchedule = function(month, day, year, account, callback){
        
        console.log(account);
        var object = this;
        var deleteButton = document.createElement("button");
        deleteButton.textContent = object._i18n.get("Delete");
        deleteButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
        deleteButton.setAttribute("style", "margin-right: 10px;");
        
        var saveButton = document.createElement("button");
        saveButton.textContent = object._i18n.get("Save");
        saveButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
        
        object.buttonPanel.textContent = null;
        object.buttonPanel.appendChild(saveButton);
        
        
        object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var post = {nonce: object.nonce, action: object.action, mode: 'getPublicSchedule', month: month, day: day, year: year};
        if(account != null){
            
            post.accountKey = account.key;
            
        }
        object.setFunction("getPublicSchedule", post);
        object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                
            console.log(json);
            object.createSchedulePanel(object.weekKey, json, 'getPublicSchedule');
            object.loadingPanel.setAttribute("class", "hidden_panel");
                
        });
        
        deleteButton.onclick = function(event){
            
            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
            var post = {nonce: object.nonce, action: object.action, mode: "deletePublicSchedule", month: month, day: day, year: year};
            object.setFunction("getPublicSchedule", post);
            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                
                callback(json);
                object.loadingPanel.setAttribute("class", "hidden_panel");
                console.log(json);
                
            });
            
        }
        
        saveButton.onclick = function(event){
            
            //object.updateAccountSchedule(object.template_schedule_list, "updateAccountSchedule", account, callback);
            object.updateAccountSchedule(object.template_schedule_list, "updateAccountSchedule", account, function(response) {
                
                console.log(response);
                if (response.status != null && response.status == 'success') {
                    
                    document.getElementById("editPanelForSchedule").setAttribute("class", "hidden_panel");
                    document.getElementById("blockPanel").setAttribute("class", "hidden_panel");
                    document.getElementsByTagName("body")[0].classList.remove("modal-open");
                    
                }
                
            });
            
        }
        
    }

    this.getTemplateSchedule = function(weekKey, account){
        
        var object = this;
        var saveButton = document.createElement("button");
        saveButton.textContent = object._i18n.get("Save");
        saveButton.setAttribute("class", "button media-button button-primary button-large media-button-insert");
        object.buttonPanel.textContent = null;
        object.buttonPanel.appendChild(saveButton);
        
        object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var post = {nonce: object.nonce, action: object.action, mode: 'getTemplateSchedule', weekKey: weekKey};
        if(account != null){
            
            post.accountKey = account.key;
            
        }
        
        object.setFunction("getTemplateSchedule", post);
        object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                
            console.log(json);
            object.createSchedulePanel(weekKey, json, 'getTemplateSchedule');
            object.loadingPanel.setAttribute("class", "hidden_panel", 'getTemplateSchedule');
                
        });
        
        saveButton.onclick = function(event){
            
            object.updateAccountSchedule(object.template_schedule_list, "updateAccountTemplateSchedule", account, function(response) {
                
                console.log(response);
                if (response.status == 'success') {
                    
                    object.getTemplateSchedule(weekKey, account);
                    
                }
                
            });
            
        }
        
    }

    this.createSchedulePanel = function(weekKey, scheduleData, mode){
        
        console.log("weekKey = " + weekKey);
        console.log("mode = " + mode);
        console.log(scheduleData);
        var object = this;
        this.mode = mode;
        this.weekKey = weekKey;
        var media_frame_content = document.getElementById("media_frame_content_for_schedule");
        media_frame_content.textContent = null;
        object.template_schedule_list = {};
        
        var timePanelList = {};
        var hourBlockList = {};
        var minBlockList = {};
        var deadlineTimeList = {};
        var capacityBlockList = {};
        var remainderBlockList = {};
        var dotList = {};
        
        if (scheduleData.length == 0) {
            
            var loadSchedulesPanel = document.getElementById("loadSchedulesPanel");
            loadSchedulesPanel.classList.remove("hidden_panel");
            var load_blockPanel = document.getElementById("load_blockPanel");
            load_blockPanel.classList.remove("hidden_panel");
            load_blockPanel.classList.add("edit_modal_backdrop");
            document.getElementById("loadSchedulesPanel_return_button").onclick = function() {
                
                loadSchedulesPanel.classList.add("hidden_panel");
                load_blockPanel.classList.add("hidden_panel");
                load_blockPanel.classList.remove("edit_modal_backdrop");
                
            };
            
            document.getElementById("readSchedulesButton").onclick = function() {
                
                
                var from = document.getElementById("read_from_hour");
                from = from.options[from.selectedIndex].value;
                var to = document.getElementById("read_to_hour");
                to = to.options[to.selectedIndex].value;
                var interval = document.getElementById("interval_min");
                interval = interval.options[interval.selectedIndex].value;
                var load_deadline_time = document.getElementById("load_deadline_time");
                load_deadline_time = load_deadline_time.options[load_deadline_time.selectedIndex].value;
                var load_capacity = document.getElementById("load_capacity");
                load_capacity = load_capacity.options[load_capacity.selectedIndex].value;
                console.log("from = " + from + " to = " + to + " interval = " + interval + " load_deadline_time = " + load_deadline_time + " load_capacity = " + load_capacity);
                var readList = [];
                var base_min = 0;
                for (var i = parseInt(from); i <= parseInt(to); i++) {
                    
                    for (var min = base_min; min < 60; min += parseInt(interval)) {
                        
                        if (min < 0) {
                            
                            continue;
                            
                        }
                        
                        readList.push({hour: i, min: min, deadline: load_deadline_time, capacities: load_capacity, remainders: load_capacity});
                        if (min + parseInt(interval) >= 60) {
                            
                            base_min = min - 60;
                            break;
                            
                        }
                        
                    }
                    
                }
                
                console.log(readList);
                var i = 0;
                var count = readList.length;
                for (var key in timePanelList) {
                    
                    if (i < count && readList[i] != null) {
                        
                        var read = readList[i];
                        var timePanel = timePanelList[key];
                        timePanel.classList.add("hidden_panel");
                        hourBlockList[key].classList.remove("hidden_panel");
                        hourBlockList[key].classList.add("hour");
                        hourBlockList[key].setAttribute("data-key", read.hour);
                        hourBlockList[key].textContent = ("0" + read.hour).slice(-2);
                        dotList[key].setAttribute("class", "dot");
                        minBlockList[key].classList.remove("hidden_panel");
                        minBlockList[key].classList.add("hour");
                        minBlockList[key].setAttribute("data-key", read.min);
                        minBlockList[key].textContent = ("0" + read.min).slice(-2);
                        
                        deadlineTimeList[key].setAttribute("class", "min");
                        deadlineTimeList[key].setAttribute("data-key", read.deadline);
                        deadlineTimeList[key].textContent = object._i18n.get("%s min ago", [read.deadline]);
                        
                        capacityBlockList[key].setAttribute("class", "person");
                        capacityBlockList[key].setAttribute("data-key", read.capacities);
                        capacityBlockList[key].textContent = ("0" + read.capacities).slice(-2);
                        
                        remainderBlockList[key].setAttribute("class", "person");
                        remainderBlockList[key].setAttribute("data-key", read.remainders);
                        remainderBlockList[key].textContent = ("0" + read.remainders).slice(-2);
                        
                    } else {
                        
                        break;
                        
                    }
                    
                    i++;
                    
                }
                
                loadSchedulesPanel.classList.add("hidden_panel");
                load_blockPanel.classList.add("hidden_panel");
                load_blockPanel.classList.remove("edit_modal_backdrop");
                
            };
            
        }
        
        
        
        
        var table = document.createElement("table");
        table.setAttribute("class", "wp-list-table widefat fixed striped");
        media_frame_content.appendChild(table);
        
        for(var i = 0; i < 100; i++){
            
            var th = document.createElement("th");
            th.textContent = (i + 1);
            
            var timePanel = document.createElement("div");
            timePanel.textContent = "access_time";
            timePanel.setAttribute("class", "material-icons noTime");
            timePanel.setAttribute("data-select", i);
            
            timePanel.onclick = function() {
                
                console.log(this);
                var select = this.getAttribute("data-select");
                var values = getScheduleObject(this, "hours", mode, object.template_schedule_list[select]);
                console.log(values);
                
            };
            
            
            
            var hourBlock = document.createElement("div");
            hourBlock.setAttribute("data-select", i);
            hourBlock.setAttribute("class", "hour");
            hourBlock.textContent = "";
            hourBlock.onclick = function(event){
                
                console.log(this);
                var select = this.getAttribute("data-select");
                var values = getScheduleObject(this, "hours", mode, object.template_schedule_list[select]);
                console.log(values);
                
                
            }
            
            var dot = document.createElement("span");
            dot.setAttribute("class", "dot");
            dot.textContent = " : ";
            
            var minBlock = document.createElement("div");
            minBlock.setAttribute("data-select", i);
            minBlock.setAttribute("class", "min");
            minBlock.textContent = "";
            minBlock.onclick = function(event){
                
                console.log(this);
                var select = this.getAttribute("data-select");
                var values = getScheduleObject(this, "minutes", mode, object.template_schedule_list[select]);
                console.log(values);
                
                
            }
            
            timePanel.appendChild(hourBlock);
            timePanel.appendChild(dot);
            timePanel.appendChild(minBlock);
            
            var timeTd = document.createElement("td");
            timeTd.setAttribute("class", "timeTd");
            timeTd.appendChild(timePanel);
            timeTd.appendChild(hourBlock);
            timeTd.appendChild(dot);
            timeTd.appendChild(minBlock);
            
            var deadlineTimeBlock = document.createElement("div");
            deadlineTimeBlock.textContent = "access_time";
            deadlineTimeBlock.setAttribute("class", "material-icons noTime");
            deadlineTimeBlock.setAttribute("data-select", i);
            deadlineTimeBlock.onclick = function(){
                
                console.log(this);
                var select = this.getAttribute("data-select");
                var values = getScheduleObject(this, "deadline", mode, object.template_schedule_list[select]);
                console.log(values);
                
                
            };
            
            var deadlineTimeTd = document.createElement("td");
            deadlineTimeTd.classList.add("td_width_100_px");
            deadlineTimeTd.appendChild(deadlineTimeBlock);
            
            var titleBox = document.createElement("input");
            titleBox.setAttribute("class", "regular-text title_text_box");
            titleBox.type = "text";
            
            var titleTd = document.createElement("td");
            titleTd.appendChild(titleBox);
            
            var capacityBlock = document.createElement("div");
            capacityBlock.textContent = "person_add";
            capacityBlock.setAttribute("class", "material-icons noPerson");
            capacityBlock.setAttribute("data-select", i);
            capacityBlock.onclick = function(event){
                
                console.log(this);
                var select = this.getAttribute("data-select");
                var values = getScheduleObject(this, "capacitys", mode, object.template_schedule_list[select]);
                console.log(values);
                
            }
            
            var capacityTd = document.createElement("td");
            capacityTd.setAttribute("class", "td_width_50_px");
            capacityTd.appendChild(capacityBlock);
            
            var remainderBlock = document.createElement("div");
            remainderBlock.textContent = "person_add";
            remainderBlock.setAttribute("class", "material-icons noPerson");
            remainderBlock.setAttribute("data-select", i);
            remainderBlock.onclick = function(event){
                
                console.log(this);
                var select = this.getAttribute("data-select");
                var values = getScheduleObject(this, "remainders", mode, object.template_schedule_list[select]);
                console.log(values);
                
            }
            
            timePanelList[i] = timePanel;
            hourBlockList[i] = hourBlock;
            minBlockList[i] = minBlock;
            deadlineTimeList[i] = deadlineTimeBlock;
            dotList[i] = dot;
            capacityBlockList[i] = capacityBlock;
            remainderBlockList[i] = remainderBlock;
            
            var remainderTd = document.createElement("td");
            remainderTd.setAttribute("class", "td_width_50_px");
            remainderTd.appendChild(remainderBlock);
            
            var checkBox = document.createElement("input");
    		checkBox.name = "check_" + i;
    		checkBox.type = "checkbox";
    		checkBox.value = "true";
    		
    		var stopTd = document.createElement("td");
    		stopTd.setAttribute("class", "td_width_50_px");
    		stopTd.appendChild(checkBox);
            
            var deletekBox = document.createElement("input");
    		deletekBox.name = "check_" + i;
    		deletekBox.type = "checkbox";
    		deletekBox.value = "true";
    		
    		var deleteTd = document.createElement("td");
    		deleteTd.setAttribute("class", "td_width_50_px");
    		deleteTd.appendChild(deletekBox);
            
            var tr = document.createElement("tr");
            tr.appendChild(th);
            tr.appendChild(timeTd);
            tr.appendChild(deadlineTimeTd);
            tr.appendChild(titleTd);
            tr.appendChild(capacityTd);
            tr.appendChild(remainderTd);
            tr.appendChild(stopTd);
            tr.appendChild(deleteTd);
            table.appendChild(tr);
            
            if(mode != 'getPublicSchedule'){
                
                tr.removeChild(remainderTd);
                //tr.removeChild(deleteTd);
                
            }
            
            //var schedule_data = {hour: hourSelectClone, min: minSelectClone, title: titleBox, cost: null, capacity: capacitySelectClone, remainder: remainderSelectClone, stop: checkBox, delete: deletekBox};
            var schedule_data = {hour: hourBlock, min: minBlock, title: titleBox, cost: null, capacity: capacityBlock, remainder: remainderBlock, stop: checkBox, delete: deletekBox, deadlineTime: deadlineTimeBlock};
            
            if(scheduleData[i] != null){
                
                console.log(scheduleData[i]);
                
                timePanel.setAttribute("class", "hidden_panel");
                
                hourBlock.textContent = (0 + scheduleData[i]['hour']).slice(-2);
                hourBlock.setAttribute("data-key", scheduleData[i]['hour']);
                hourBlock.setAttribute("data-default", scheduleData[i]['hour']);
                hourBlock.setAttribute("class", "hour");
                
                dot.setAttribute("class", "dot");
                
                minBlock.textContent = (0 + scheduleData[i]['min']).slice(-2);
                minBlock.setAttribute("data-key", scheduleData[i]['min']);
                minBlock.setAttribute("data-default", scheduleData[i]['min']);
                minBlock.setAttribute("class", "min");
                
                var deadlineTime = scheduleData[i]['deadlineTime'];
                deadlineTimeBlock.textContent = object._i18n.get("%s min age", [deadlineTime]);
                deadlineTimeBlock.setAttribute("data-key", scheduleData[i]['deadlineTime']);
                deadlineTimeBlock.setAttribute("data-default", scheduleData[i]['deadlineTime']);
                deadlineTimeBlock.setAttribute("class", "min");
                
                if(typeof scheduleData[i]['title'] == "string"){
                    
                    titleBox.value = scheduleData[i]['title'].replace(/\\/g, "");
                    
                }
                
                capacityBlock.textContent = (0 + scheduleData[i]['capacity']).slice(-2);
                capacityBlock.setAttribute("data-key", scheduleData[i]['capacity']);
                capacityBlock.setAttribute("data-default", scheduleData[i]['capacity']);
                capacityBlock.setAttribute("class", "person");
                
                if(scheduleData[i]['stop'] == 'true'){
                    
                    checkBox.checked = true;
                    
                }
                
                if(mode == 'getPublicSchedule'){
                    
                    remainderBlock.textContent = (0 + scheduleData[i]['remainder']).slice(-2);
                    remainderBlock.setAttribute("data-key", scheduleData[i]['remainder']);
                    remainderBlock.setAttribute("data-default", scheduleData[i]['remainder']);
                    remainderBlock.setAttribute("class", "person");
                    
                    if(scheduleData[i]['delete'] != null && scheduleData[i]['delete'] == 'true'){
                    
                        checkBox.checked = true;
                    
                    }
                    
                    if(scheduleData[i]['key'] != null){
                        
                        schedule_data['key'] = scheduleData[i]['key'];
                        
                    }
                    
                }
                
            }else{
                
                timePanel.setAttribute("class", "material-icons noTime");
                hourBlock.setAttribute("class", "hidden_panel");
                dot.setAttribute("class", "hidden_panel");
                minBlock.setAttribute("class", "hidden_panel");
                
            }
            
            
            object.template_schedule_list[i] = schedule_data;
            
            
        }
        
        function getScheduleObject(panel, default_key, mode, scheduleObject, callback) {
            
            console.log(scheduleObject);
            console.log("mode = " + mode);
            var values = {};
            var list = {hour: "hours", min: "minutes", deadlineTime: "deadline", capacity: "capacitys", remainder: "remainders"};
            for (var key in list) {
                
                var value = list[key];
                console.log(scheduleObject[key]);
                if (scheduleObject[key].getAttribute("data-key") == null) {
                    
                    values[value] = 0;
                    
                } else {
                    
                    values[value] = parseInt(scheduleObject[key].getAttribute("data-key"));
                    
                }
                
            }
            
            if (mode == 'getTemplateSchedule') {
                
                values.remainders = null;
                
            }
            
            console.log(panel);
            //var panel = this;
            var select = panel.getAttribute("data-select");
            console.log(values);
            object.selectionSchedulePanel(default_key, values.hours, values.minutes, values.deadline, values.capacitys, values.remainders, function(response) {
                
                console.log(response);
                var list = {hour: "hours", min: "minutes", deadlineTime: "deadline", capacity: "capacitys", remainder: "remainders"};
                if (response == null) {
                    
                    object.template_schedule_list[select].delete.checked = true;
                    timePanelList[select].textContent = "access_time";
                    timePanelList[select].setAttribute("class", "material-icons noTime");
                    dotList[select].setAttribute("class", "hidden_panel");
                    for (var key in list) {
                        
                        var value = list[key];
                        object.template_schedule_list[select][key].removeAttribute("data-key");
                        object.template_schedule_list[select][key].textContent = "";
                        if (key == "deadlineTime") {
                            
                            object.template_schedule_list[select][key].setAttribute("class", "material-icons noTime");
                            object.template_schedule_list[select][key].textContent = "access_time";
                            
                        } else if (key == "capacity" || key == "remainder") {
                            
                            object.template_schedule_list[select][key].setAttribute("class", "material-icons noPerson");
                            object.template_schedule_list[select][key].textContent = "person_add";
                            
                        } else {
                            
                            object.template_schedule_list[select][key].setAttribute("class", "hidden_panel");
                            object.template_schedule_list[select][key].textContent = "";
                            
                        }
                        
                    }
                    
                } else {
                    
                    object.template_schedule_list[select].delete.checked = false;
                    panel.setAttribute("class", "hidden_panel");
                    dotList[select].setAttribute("class", "dot");
                    for (var key in list) {
                        
                        var value = list[key];
                        object.template_schedule_list[select][key].setAttribute("data-key", response[value]);
                        
                        object.template_schedule_list[select][key].setAttribute("class", "hour");
                        if (key == "deadlineTime") {
                            
                            object.template_schedule_list[select][key].textContent = object._i18n.get("%s min ago", [response[value]]);
                            
                        } else {
                            
                            object.template_schedule_list[select][key].textContent = ("0" + response[value]).slice(-2);;
                            
                        }
                        
                    }
                    
                }
                
            });
            
            return values;
            
        };
        
        var selectAction = function(panel, targetPanel, title, classTrue, classFalse, max, interval, callback){
            
            var key = null;
            if(panel.getAttribute("data-key") != null){
                
                key = panel.getAttribute("data-key");
            
            }
            var rect = panel.getBoundingClientRect();
            var confirm = new Confirm();
            title = object._i18n.get("Choose %s", [object._i18n.get(title)]);
            confirm.selectListPanel(panel, title, 0, max, parseInt(interval), 5, key, function(response){
                
                console.log(response);
                if(response !== false && callback != null){
                    
                    console.log("response = " + response);
                    if(response != "--" && response != "close"){
                        
                        targetPanel.textContent = ("0" + response).slice(-2);
                        targetPanel.setAttribute("data-key", response);
                        targetPanel.setAttribute("class", classTrue);
                        callback(true);
                        
                    }else if(response == "close"){
                        
                        callback(response);
                        
                    }else{
                        
                        //panel.textContent = "--";
                        targetPanel.removeAttribute("data-key");
                        targetPanel.setAttribute("class", classFalse);
                        callback(false);
                        
                    }
                    
                    
                }else if(response === false){
                    
                    callback(response);
                    
                }
                
            });
            
        }
        
        if(document.getElementById("allScheduleDelete") != null){
            
            var deleteBool = true;
            var deleteButton = document.getElementById("allScheduleDelete");
            deleteButton.removeEventListener("click", null);
            deleteButton.onclick = function(event){
                
                console.log("deleteButton.onclick");
                for (var key in object.template_schedule_list) {
                    
                    if (
                        hourBlockList[parseInt(key)].classList.contains("hidden_panel") === false && 
                        minBlockList[parseInt(key)].classList.contains("hidden_panel") === false && 
                        capacityBlockList[parseInt(key)].classList.contains("hidden_panel") === false
                    ) {
                        
                        object.template_schedule_list[key]["delete"].checked = deleteBool;
                        
                    }
                    
                }
                
                if (deleteBool == false) {
                        
                    deleteBool = true;
                    
                } else {
                    
                    deleteBool = false;
                    
                }
                
            }
            
        }
        
        
        var stopBool = true;
        var stopButton = document.getElementById("stop");
        stopButton.removeEventListener("click", null);
        stopButton.onclick = function(){
            
            console.log("stopButton.onclick");
            for (var key in object.template_schedule_list) {
                
                if (
                    hourBlockList[parseInt(key)].classList.contains("hidden_panel") === false && 
                    minBlockList[parseInt(key)].classList.contains("hidden_panel") === false && 
                    capacityBlockList[parseInt(key)].classList.contains("hidden_panel") === false
                ) {
                    
                    object.template_schedule_list[key]["stop"].checked = stopBool;
                    
                }
                
            }
            
            if (stopBool == false) {
                    
                stopBool = true;
                
            } else {
                
                stopBool = false;
                
            }
            
        }
        
    }
    
    this.selectionSchedulePanel = function(default_key ,hours, minutes, deadline, capacitys, remainders, callback) {
        
        console.log("default_key = " + default_key);
        var schedule = {hours: hours, minutes: minutes, deadline: deadline, capacitys: capacitys, remainders: remainders};
        var last_key = "remainders";
        if (remainders == null) {
            
            last_key = "capacitys";
            
        }
        var load_blockPanel = document.getElementById("load_blockPanel");
        load_blockPanel.classList.remove("hidden_panel");
        load_blockPanel.classList.add("edit_modal_backdrop");
        
        var selectionSchedule = document.getElementById("selectionSchedule");
        
        var items = {};
        var itemsList = selectionSchedule.getElementsByClassName("items");
        for (var i = 0; i < itemsList.length; i++) {
            
            var key = itemsList[i].getAttribute("data-key");
            console.log(key);
            console.log(schedule[key]);
            if (remainders == null && key == "remainders") {
                
                itemsList[i].classList.add("hidden_panel");
                
            } else {
                
                itemsList[i].classList.remove("hidden_panel");
                
            }
            items[key] = itemsList[i];
            itemsList[i].getElementsByTagName("span")[0].textContent = schedule[key];
            itemsList[i].onclick = function() {
                
                var key = this.getAttribute("data-key");
                console.log(key);
                for (var valueKey in values) {
                    
                    var value = values[valueKey];
                    //value.classList.remove("closed");
                    if (key == valueKey) {
                        
                        console.log(schedule[key])
                        value.classList.remove("closed");
                        value.classList.add("openAnimation");
                        value.classList.remove("closeAnimation");
                        
                    } else {
                        
                        if (value.classList.contains("openAnimation")) {
                            
                            value.classList.add("closeAnimation");
                            value.classList.remove("openAnimation");
                            
                        }
                        
                    }
                    
                }
                
            };
            
        }
        
        var values = {};
        var valuesList = selectionSchedule.getElementsByClassName("selectPanel");
        for (var i = 0; i < valuesList.length; i++) {
            
            valuesList[i].classList.add("closed");
            valuesList[i].classList.remove("openAnimation");
            valuesList[i].classList.remove("closeAnimation");
            
        }
        for (var i = 0; i < valuesList.length; i++) {
            
            var key = valuesList[i].getAttribute("data-key");
            
            if (key == default_key) {
                
                valuesList[i].classList.add("openAnimation");
                valuesList[i].classList.remove("closeAnimation");
                valuesList[i].classList.remove("closed");
                
            } else {
                
                
                
            }
            
            values[key] = valuesList[i];
            var spans = valuesList[i].getElementsByTagName("span");
            for (var a = 0; a < spans.length; a++) {
                
                if (parseInt(schedule[key]) == parseInt(spans[a].getAttribute("data-value"))) {
                    
                    spans[a].classList.add("selectedItem");
                    
                } else {
                    
                    spans[a].classList.remove("selectedItem");
                    
                }
                spans[a].onclick = function() {
                    
                    console.log(this);
                    var key = this.getAttribute("data-key");
                    var value = parseInt(this.getAttribute("data-value"));
                    schedule[key] = value;
                    console.log(schedule);
                    
                    items[key].getElementsByTagName("span")[0].textContent = value;
                    var spans = values[key].getElementsByTagName("span");
                    for (var a = 0; a < spans.length; a++) {
                        
                        if (parseInt(schedule[key]) == parseInt(spans[a].getAttribute("data-value"))) {
                            
                            spans[a].classList.add("selectedItem");
                            
                        } else {
                            
                            spans[a].classList.remove("selectedItem");
                            
                        }
                        
                    }
                    
                    var nextPanel = false;
                    for (var valueKey in values) {
                        
                        console.log(valueKey);
                        if (nextPanel == true) {
                            
                            if (values[valueKey].classList.contains("closed")) {
                                
                                values[valueKey].classList.remove("closed");
                                
                            }
                            
                            values[valueKey].classList.remove("closeAnimation");
                            values[valueKey].classList.add("openAnimation");
                            break;
                            
                        }
                        
                        if (valueKey == key && valueKey != last_key) {
                            
                            values[valueKey].classList.remove("openAnimation");
                            values[valueKey].classList.add("closeAnimation");
                            nextPanel = true;
                            
                        }
                        
                    }
                    
                };
                
            }
            
        }
        
        selectionSchedule.classList.remove("hidden_panel");
        
        var selectionSchedule_hours = document.getElementById("selectionSchedule_hours");
        
        var selectionSchedule_minutes = document.getElementById("selectionSchedule_minutes");
        
        var selectionSchedule_capacitys = document.getElementById("selectionSchedule_capacitys");
        
        var selectionSchedule_remainders = document.getElementById("selectionSchedule_remainders");
        
        document.getElementById("selectionScheduleButton").onclick = function() {
            
            if (callback != null) {
                
                callback(schedule);
                
            }
            selectionSchedule.classList.add("hidden_panel");
            load_blockPanel.classList.add("hidden_panel");
            load_blockPanel.classList.remove("edit_modal_backdrop");
            
        };
        
        document.getElementById("selectionScheduleResetButton").onclick = function() {
            
            if (callback != null) {
                
                callback(null);
                
            }
            selectionSchedule.classList.add("hidden_panel");
            load_blockPanel.classList.add("hidden_panel");
            load_blockPanel.classList.remove("edit_modal_backdrop");
            
        };
        
        document.getElementById("selectionSchedule_return_button").onclick = function() {
            
            selectionSchedule.classList.add("hidden_panel");
            load_blockPanel.classList.add("hidden_panel");
            load_blockPanel.classList.remove("edit_modal_backdrop");
            
        };
        
    }
    

    this.updateAccountSchedule = function(template_schedule_list, mode, account, callback){
        
        var object = this;
        console.log(object.weekKey);
        console.log(template_schedule_list);
        var i = 0;
        var post = {nonce: object.nonce, action: object.action, mode: mode, weekKey: object.weekKey};
        if (mode == 'updateAccountSchedule') {
            
            var date = object.getCalendarDate();
            post = {nonce: object.nonce, action: object.action, mode: mode, weekKey: object.weekKey, month: date['month'], day: date['day'], year: date['year']};
            
        }
        
        if (account != null) {
            
            post.accountKey = account.key;
            
        }
        
        for (var key in template_schedule_list) {
            
            //console.log(data);
            var data = template_schedule_list[key];
            var hourValue = null;
            var minValue = null;
            var capacityValue = null;
            var deadlineTimeValue = 0;
            if (data['hour'].getAttribute("data-key") != null && data['min'].getAttribute("data-key") != null && data['capacity'].getAttribute("data-key") != null) {
                    
                hourValue = data['hour'].getAttribute("data-key");
                minValue = data['min'].getAttribute("data-key");
                capacityValue = data['capacity'].getAttribute("data-key");
                
            } else {
                
                if (data['hour'].getAttribute("data-default") != null && data['min'].getAttribute("data-default") && data['capacity'].getAttribute("data-default") != null) {
                    
                    hourValue = data['hour'].getAttribute("data-default");
                    minValue = data['min'].getAttribute("data-default");
                    capacityValue = data['capacity'].getAttribute("data-default");
                    
                }
                
            }
            
            if (data['deadlineTime'].getAttribute("data-default") != null) {
                
                deadlineTimeValue = data['deadlineTime'].getAttribute("data-default");
                
            }
            
            if (data['deadlineTime'].getAttribute("data-key") != null != null) {
                
                deadlineTimeValue = data['deadlineTime'].getAttribute("data-key");
                
            }
            
            if (hourValue != null && minValue != null && capacityValue != null) {
                
                var titleValue = data['title'].value;
                var stopValue = "false";
                if(data['stop'].checked == true){
                    
                    stopValue = "true";
                    
                }
                
                console.log("key = " + template_schedule_list[key]['key'] + " " + hourValue + ":" + minValue + " deadlineTime = " + deadlineTimeValue + " capacity = " + capacityValue + " title = " + titleValue + " stop = " + stopValue);
                /**
                post['hour' + i] = hourValue;
                post['min' + i] = minValue;
                post['deadlineTime' + i] = deadlineTimeValue;
                post['title' + i] = titleValue;
                post['cost' + i] = "";
                post['capacity' + i] = capacityValue;
                post['remainder' + i] = capacityValue;
                post['stop' + i] = stopValue;
                post['delete' + i] = "false";
                **/
                
                var postSchedule = {
                    
                    hour: hourValue,
                    min: minValue,
                    deadlineTime: deadlineTimeValue,
                    title: titleValue,
                    cost: "",
                    capacity: capacityValue,
                    remainder: capacityValue,
                    stop: stopValue,
                    delete: "false",
                    
                }
                
                if (mode == 'updateAccountSchedule') {
                    
                    if (template_schedule_list[key]['key'] != null) {
                        
                        //post['key' + i] = template_schedule_list[key]['key'];
                        postSchedule.key = template_schedule_list[key]['key'];
                        
                    }
                    
                    var remainder = data['remainder'];
                    if (remainder.getAttribute("data-key") != null) {
                        
                        //post['remainder' + i] = remainder.getAttribute("data-key");
                        postSchedule.remainder = remainder.getAttribute("data-key");
                        
                    } else {
                        
                        //post['remainder' + i] = remainder.getAttribute("data-default");
                        postSchedule.remainder = remainder.getAttribute("data-key");
                        if (remainder.getAttribute("data-default") == null) {
                            
                            //post['remainder' + i] = capacityValue;
                            postSchedule.remainder = capacityValue;
                            
                        }
                        
                    }
                    
                    var deleteValue = "false";
                    if (data['delete'].checked == true) {
                        
                        deleteValue = "true";
                        
                    }
                    //post['delete' + i] = deleteValue;
                    postSchedule.delete = deleteValue;
                    
                }else {
                    
                    //post['key' + i] = (i + 1);
                    postSchedule.key = (i + 1);
                    var deleteValue = "false";
                    if (data['delete'].checked == true) {
                        
                        deleteValue = "true";
                        
                    }
                    //post['delete' + i] = deleteValue;
                    postSchedule.delete = deleteValue;
                    
                }
                
                post['schedule' + i] = JSON.stringify(postSchedule);
                
                i++;
                post['timeCount'] = i;
                
            }
            
            
        }
        
        console.log(post);
        
        if(i != 0){
            
            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
            object.setFunction("updateAccountSchedule", post);
            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                
                object.loadingPanel.setAttribute("class", "hidden_panel");
                console.log(json);
                if(callback != null){
                    
                    callback(json);
                    
                }
                
                var date = object.getCalendarDate();
                console.log(date);
                object.getAccountScheduleData(parseInt(date.month), 1, parseInt(date.year), account);
                
                
            });
            
        }
        
        
    }

    this.createGuestsPanel = function(guestsList, account){
        
        console.log(account);
        
        var editBool = true;
    	var object = this;
    	var addButton = document.createElement("button");
    	addButton.disabled = false;
    	addButton.setAttribute("class", "w3tc-button-save button-primary");
    	addButton.textContent = object._i18n.get("Add Guest");
    	
    	var saveButton = document.createElement("button");
    	saveButton.disabled = true;
    	saveButton.setAttribute("class", "w3tc-button-save button-primary");
    	saveButton.setAttribute("style", "float: right;");
    	saveButton.textContent = object._i18n.get("Change ranking");
    	
    	var buttonPanel = document.createElement("div");
    	buttonPanel.setAttribute("style", "padding-bottom: 10px;");
    	buttonPanel.appendChild(addButton);
    	buttonPanel.appendChild(saveButton);
    	
    	var coursePanel = document.getElementById("coursePanel");
    	coursePanel.textContent = null;
        
        var mainPanel = document.getElementById("guestsPanel");
    	mainPanel.textContent = null;
    	mainPanel.appendChild(buttonPanel);
    	var panel = document.createElement("div");
    	panel.id = "guestsSort";
    	panel.setAttribute("class", "dnd");
    	
    	var buttons = {};
    	var columns = {};
    	var list = {name: 'Name', email: 'Email', zip: 'Zip', D: 'D'};
        
        for(var key in guestsList){
            
            if(typeof guestsList[key]['name'] == "string"){
                
                guestsList[key]['name'] = guestsList[key]['name'].replace(/\\/g, "");
                
            }
            
            var guestsObj = guestsList[key];
            var extra = JSON.parse(guestsObj.json);
            console.log(guestsObj);
            console.log(extra);
            
            var contentPanel = document.createElement("div");
    		contentPanel.setAttribute("class", "dnd_content");
    		contentPanel.textContent = guestsList[key]['name'];
    		
    		var editLabel = document.createElement("label");
    		editLabel.setAttribute("class", "dnd_edit");
    		editLabel.setAttribute("data-key", key);
    		editLabel.textContent = object._i18n.get("Edit");
    		
    		var deleteLabel = document.createElement("label");
    		deleteLabel.setAttribute("class", "dnd_delete");
    		deleteLabel.setAttribute("data-key", key);
    		deleteLabel.textContent = object._i18n.get("Delete");
    		
    		var optionPanel = document.createElement("div");
    		optionPanel.setAttribute("class", "dnd_optionBox");
    		optionPanel.appendChild(editLabel);
    		optionPanel.appendChild(deleteLabel);
    		
    		
    		var column = document.createElement("div");
    		column.setAttribute("class", "dnd_column");
    		//column.setAttribute("draggable", "true");
    		column.setAttribute("data-key", key);
    		columns[key] = column;
    		column.appendChild(contentPanel);
    		column.appendChild(optionPanel);
    		
    		panel.appendChild(column);
            
            editLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				addButton.disabled = true;
    				editBool = false;
    				var key = this.getAttribute("data-key");
    				for(var formKey in columns){
    			        
    			        if(formKey != key){
    			            
    			            columns[formKey].classList.add("hidden_panel");
    			            
    			        }
    			        
    			    }
    			    
    				console.log(guestsList[key]);
    				jQuery('#formSort').sortable('disable');
    				object.editItem(columns, key, mainPanel, panel, 'updateGuests', account, guestsList[key], object.schedule_data['guestsInputType'], function(action){
    					
    					editBool = true;
    					if(action == 'cancel'){
    						
    						jQuery('#formSort').sortable('enable');
    						
    					}else{
    						
    						guestsList = action;
    						object.createGuestsPanel(guestsList, account);
    						
    					}
    					
    					addButton.disabled = false;
    					for(var formKey in columns){
        			        
        			        columns[formKey].classList.remove("hidden_panel");
        			        
        			    }
    					
    				});
    				
    			}
    			
    		}
    		
    		deleteLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				editBool = false;
    				var dataKey = parseInt(this.getAttribute("data-key"));
    				var result = confirm(object._i18n.get('Do you delete filed of "%s"?', [guestsList[dataKey].name]));
    				if(result === true){
    					
    					object.deleteItem(guestsList[key].key, "deleteGuestsItem", account, function(json){
    						
    						guestsList = json;
    						object.createGuestsPanel(guestsList, account);
    						
    					});
    					
    				}
    				editBool = true;
    				
    			}
    			
    		}
            
        }
        
        mainPanel.appendChild(panel);
    	
    	jQuery('#guestsSort').sortable({
    									cursor: 'move',
    									opacity: 0.7,
    									placeholder: "ui-state-highlight",
    									forcePlaceholderSize: true,
    									forceHelperSize: true,
    									axis: 'y'
    	});
    	
    	jQuery(document).off("sortstop", "#guestsSort");
    	jQuery(document).on('sortstop', '#guestsSort', function(){
    		
    		var sortBool = object.sortData('name', 'dnd_column', guestsList, panel, 'changeFormRank');
    		if(sortBool === true){
    			
    			saveButton.disabled = false;
    			
    		}else{
    			
    			saveButton.disabled = true;
    			
    		}
    		
    	});
    	
    	addButton.onclick = function(event){
    		
    		console.log(object.schedule_data);
    		if(editBool === true){
    			
    			panel.classList.add("hidden_panel");
    			editBool = false;
    			jQuery('#guestsSort').sortable('disable');
    			addButton.disabled = true;
    			object.addItem(mainPanel, 'addGuests', account, object.schedule_data['guestsInputType'], function(action){
    				
    				editBool = true;
    				if(action == "close"){
    					
    					jQuery('#guestsSort').sortable('enable');
    					addButton.disabled = false;
    					
    				}else{
    					
    					console.log(typeof action);
    					if(typeof action == 'object'){
    						
    						if(action['status'] != 'error'){
    							
    							console.log(action);
    							guestsList = action;
    							object.createGuestsPanel(guestsList, account);
    							
    						}
    						
    					}
    					
    				}
    				
    				panel.classList.remove("hidden_panel");
    				
    			});
    			
    		}
    		
    	}
    	
    	saveButton.onclick = function(event){
    		
    		guestsList = object.changeRank('key', 'dnd_column', guestsList, panel, 'changeGuestsRank', account, function(json){
    			
    			guestsList = json;
    			saveButton.disabled = true;
    			var panelList = panel.getElementsByClassName('dnd_column');
    			object.reviewPanels(panelList);
    			/**
    			for(var i = 0; i < panelList.length; i++){
    				
    				panelList[i].setAttribute("data-key", i);
    				
    			}
    			**/
    			object.createGuestsPanel(guestsList, account);
    			
    		});
    		
    		console.log(guestsList);
    		
    	}
        
        
    }

    this.createFormPanel = function(formData, account){
    	
    	var editBool = true;
    	var object = this;
    	var addButton = document.createElement("button");
    	addButton.disabled = false;
    	addButton.setAttribute("class", "w3tc-button-save button-primary");
    	addButton.textContent = object._i18n.get("Add field");
    	
    	var saveButton = document.createElement("button");
    	saveButton.disabled = true;
    	saveButton.setAttribute("class", "w3tc-button-save button-primary");
    	saveButton.setAttribute("style", "float: right;");
    	saveButton.textContent = object._i18n.get("Change ranking");
    	
    	var buttonPanel = document.createElement("div");
    	buttonPanel.setAttribute("style", "padding-bottom: 10px;");
    	buttonPanel.appendChild(addButton);
    	buttonPanel.appendChild(saveButton);
    	
    	var formDataList = formData;
    	console.log(formDataList);
    	
    	var mainPanel = document.getElementById("formPanel");
    	mainPanel.textContent = null;
    	mainPanel.appendChild(buttonPanel);
    	var panel = document.createElement("div");
    	panel.id = "formSort";
    	panel.setAttribute("class", "dnd");
    	
    	var buttons = {};
    	var columns = {};
    	var list = {name: 'Name', email: 'Email', zip: 'Zip', D: 'D'};
    	//for(var key in formDataList){
    	for(var key = 0; key < formDataList.length; key++){
    	    
    	    console.log(formDataList[key]);
    	    if(typeof formDataList[key]['name'] == "string"){
    	        
    	        formDataList[key]['name'] = formDataList[key]['name'].replace(/\\/g, "");
    	        
    	    }
    	    
    		var contentPanel = document.createElement("div");
    		contentPanel.setAttribute("class", "dnd_content");
    		contentPanel.textContent = formDataList[key]['name'];
    		
    		if(formDataList[key]["active"] != "true"){
    			
    			contentPanel.classList.add("dnd_content_unactive");
    			
    		}
    		
    		var editLabel = document.createElement("label");
    		editLabel.setAttribute("class", "dnd_edit");
    		editLabel.setAttribute("data-key", key);
    		editLabel.textContent = object._i18n.get("Edit");
    		
    		var deleteLabel = document.createElement("label");
    		deleteLabel.setAttribute("class", "dnd_delete");
    		deleteLabel.setAttribute("data-key", key);
    		deleteLabel.textContent = object._i18n.get("Delete");
    		
    		var optionPanel = document.createElement("div");
    		optionPanel.setAttribute("class", "dnd_optionBox");
    		optionPanel.appendChild(editLabel);
    		optionPanel.appendChild(deleteLabel);
    		
    		
    		var column = document.createElement("div");
    		column.setAttribute("class", "dnd_column");
    		//column.setAttribute("draggable", "true");
    		column.setAttribute("data-key", key);
    		columns[key] = column;
    		column.appendChild(contentPanel);
    		column.appendChild(optionPanel);
    		
    		panel.appendChild(column);
    		
    		editLabel.onclick = function(event){
    			
    			if(editBool === true){
    			    
    			    addButton.disabled = true;
    			    editBool = false;
    				var key = this.getAttribute("data-key");
    			    for(var formKey in columns){
    			        
    			        if(formKey != key){
    			            
    			            columns[formKey].classList.add("hidden_panel");
    			            
    			        }
    			        
    			    }
    				
    				console.log(formDataList[key]);
    				jQuery('#formSort').sortable('disable');
    				object.editItem(columns, key, mainPanel, panel, 'updateForm', account, formDataList[key], object.schedule_data['formInputType'], function(action){
    					
    					editBool = true;
    					if(action == 'cancel'){
    						
    						jQuery('#formSort').sortable('enable');
    						
    					}else{
    						
    						formData = action;
    						object.createFormPanel(formData, account);
    						
    					}
    					
    					addButton.disabled = false;
    					for(var formKey in columns){
        			        
        			        columns[formKey].classList.remove("hidden_panel");
        			        
        			    }
    					
    				});
    				
    			}
    			
    		}
    		
    		deleteLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				editBool = false;
    				var dataKey = parseInt(this.getAttribute("data-key"));
    				var result = confirm(object._i18n.get('Do you delete filed of "%s"?', [formDataList[dataKey].name]));
    				if(result === true){
    					
    					object.deleteItem(dataKey, "deleteFormItem", account, function(json){
    						
    						formData = json;
    						object.createFormPanel(formData, account);
    						
    					});
    					
    				}
    				editBool = true;
    				
    			}
    			
    		}
    		
    	}
    	
    	mainPanel.appendChild(panel);
    	
    	jQuery(function(){
    	    
    	    jQuery('#formSort').sortable({
        									cursor: 'move',
        									opacity: 0.7,
        									placeholder: "ui-state-highlight",
        									forcePlaceholderSize: true,
        									forceHelperSize: true,
        									axis: 'y'
        	});
        	
        	jQuery(document).off("sortstop", "#formSort");
        	jQuery(document).on('sortstop', '#formSort', function(){
        		
        		var sortBool = object.sortData('name', 'dnd_column', formDataList, panel, 'changeFormRank');
        		if(sortBool === true){
        			
        			saveButton.disabled = false;
        			
        		}else{
        			
        			saveButton.disabled = true;
        			
        		}
        		
        	});
    	    
    	});
    	
    	
    	
    	addButton.onclick = function(event){
    		
    		if(editBool === true){
    			
    			panel.classList.add("hidden_panel");
    			editBool = false;
    			jQuery('#formSort').sortable('disable');
    			addButton.disabled = true;
    			object.addItem(mainPanel, 'addForm', account, object.schedule_data['formInputType'], function(action){
    				
    				editBool = true;
    				if(action == "close"){
    					
    					jQuery('#formSort').sortable('enable');
    					addButton.disabled = false;
    					
    				}else{
    					
    					console.log(typeof action);
    					if(typeof action == 'object'){
    						
    						if(action['status'] != 'error'){
    							
    							console.log(action);
    							formData = action;
    							object.createFormPanel(formData, account);
    							
    						}
    						
    					}
    					
    				}
    				
    				panel.classList.remove("hidden_panel");
    				
    			});
    			
    		}
    		
    	}
    	
    	saveButton.onclick = function(event){
    		
    		formDataList = object.changeRank('name', 'dnd_column', formDataList, panel, 'changeFormRank', account, function(json){
    			
    			formData = json;
    			saveButton.disabled = true;
    			var panelList = panel.getElementsByClassName('dnd_column');
    			object.reviewPanels(panelList);
    			/**
    			for(var i = 0; i < panelList.length; i++){
    				
    				panelList[i].setAttribute("data-key", i);
    				
    			}
    			**/
    			object.createFormPanel(formData, account);
    			
    		});
    		
    		console.log(formDataList);
    		
    	}
    	
    	
    }

    this.createCoursePanel = function(courseList, account){
    	
    	var editBool = true;
    	var object = this;
    	
    	var serviceDisabled = document.getElementById("serviceDisabled");
    	if (courseList.length > 0 && parseInt(account.courseBool) == 0) {
    	    
    	    serviceDisabled.classList.remove("hidden_panel");
    	    
    	}
    	
    	var addButton = document.createElement("button");
    	addButton.disabled = false;
    	addButton.setAttribute("class", "w3tc-button-save button-primary");
    	addButton.textContent = object._i18n.get("Add service");
    	
    	var saveButton = document.createElement("button");
    	saveButton.disabled = true;
    	saveButton.setAttribute("class", "w3tc-button-save button-primary");
    	saveButton.setAttribute("style", "float: right;");
    	saveButton.textContent = object._i18n.get("Change ranking");
    	
    	var buttonPanel = document.createElement("div");
    	buttonPanel.setAttribute("style", "padding-bottom: 10px;");
    	buttonPanel.appendChild(addButton);
    	buttonPanel.appendChild(saveButton);
    	
    	var guestsPanel = document.getElementById("guestsPanel");
    	guestsPanel.textContent = null;
    	
    	var mainPanel = document.getElementById("coursePanel");
    	mainPanel.textContent = null;
    	mainPanel.appendChild(buttonPanel);
    	
    	var panel = document.createElement("div");
    	panel.id = "courseSort";
    	panel.setAttribute("class", "dnd");
    	var buttons = {};
    	var columns = {};
    	var list = {name: 'Name', email: 'Email', zip: 'Zip', D: 'D', Test: 'Test', planA: 'plan A', area: 'area', G: 'G'};
    	list = {};
    	//var courseList = courseList;
    	console.log(courseList);
    	for(var i = 0; i < courseList.length; i++){
    		
    		if(typeof courseList[i]['name'] == "string"){
    		    
    		    list[courseList[i]['key']] = courseList[i]['name'].replace(/\\/g, "");
    		    
    		}
    		
    	}
    	console.log(list);
    	//for(var key in courseList){
    	for(var key = 0; key < courseList.length; key++){
    		
    		if(typeof courseList[key]['name'] == "string"){
    		    
    		    courseList[key]['name'] = courseList[key]['name'].replace(/\\/g, "");
    		    
    		}
    		
    		var contentPanel = document.createElement("div");
    		contentPanel.setAttribute("class", "dnd_content");
    		contentPanel.textContent = courseList[key]['name'];
    		
    		if(courseList[key]["active"] != "true"){
    			
    			contentPanel.classList.add("dnd_content_unactive");
    			
    		}
    		
    		var editLabel = document.createElement("label");
    		editLabel.setAttribute("class", "dnd_edit");
    		editLabel.setAttribute("data-key", key);
    		editLabel.textContent = object._i18n.get("Edit");
    		
    		var deleteLabel = document.createElement("label");
    		deleteLabel.setAttribute("class", "dnd_delete");
    		deleteLabel.setAttribute("data-key", key);
    		deleteLabel.textContent = object._i18n.get("Delete");
    		
    		var optionPanel = document.createElement("div");
    		optionPanel.setAttribute("class", "dnd_optionBox");
    		optionPanel.appendChild(editLabel);
    		optionPanel.appendChild(deleteLabel);
    		
    		
    		var column = document.createElement("div");
    		column.setAttribute("class", "dnd_column");
    		column.setAttribute("draggable", "true");
    		column.setAttribute("data-key", key);
    		column.appendChild(contentPanel);
    		column.appendChild(optionPanel);
    		columns[key] = column;
    		
    		panel.appendChild(column);
    		
    		editLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				addButton.disabled = true;
    				editBool = false;
    				var key = this.getAttribute("data-key");
    				for(var formKey in columns){
    			        
    			        if(formKey != key){
    			            
    			            columns[formKey].classList.add("hidden_panel");
    			            
    			        }
    			        
    			    }
    			    console.log(key);
    			    jQuery('#courseSort').sortable('disable');
    				object.editItem(columns, key, mainPanel, panel, object._prefix + 'updateCourse', account, courseList[key], object.schedule_data['courseData'], function(action){
    					
    					editBool = true;
    					if(action == 'cancel'){
    						
    						jQuery('#courseSort').sortable('enable');
    						
    					}else{
    						
    						courseList = action;
    						object.createCoursePanel(courseList, account);
    						
    					}
    					
    					addButton.disabled = false;
    					for(var formKey in columns){
        			        
        			        columns[formKey].classList.remove("hidden_panel");
        			        
        			    }
    					
    				});
    				
    			}
    			
    		}
    		
    		deleteLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				editBool = false;
    				var courseInfo = courseList[parseInt(this.getAttribute("data-key"))];
    				//var result = confirm("Do you delete service of \"" + courseInfo.name + "\"?");
    				var result = confirm(object._i18n.get('Do you delete service of "%s"?', [courseInfo.name]));
    				if(result === true){
    					
    					console.log(courseInfo);
    					object.deleteItem(courseInfo.key, "deleteCourse", account, function(json){
    						
    						courseList = json;
    						object.createCoursePanel(courseList, account);
    						
    					});
    					
    				}
    				editBool = true;
    				
    			}
    			
    		}
    		
    	}
    	
    	mainPanel.appendChild(panel);
    	
    	jQuery('#courseSort').sortable({
    									cursor: 'move',                     
    									opacity: 0.7,                       
    									placeholder: "ui-state-highlight",  
    									forcePlaceholderSize: true,          
    									forceHelperSize: true,
    									axis: 'y'
    	});
    	
    	//$( '#formSort' ).disableSelection();
    	jQuery(document).off("sortstop", "#courseSort");
    	jQuery(document).on('sortstop', '#courseSort', function(){
    		
    		var sortBool = object.sortData('key', 'dnd_column', courseList, panel, 'changeCourseRank');
    		if(sortBool === true){
    			
    			saveButton.disabled = false;
    			
    		}else{
    			
    			saveButton.disabled = true;
    			
    		}
    		
    	});
    	
    	addButton.onclick = function(event){
    		
    		if(editBool === true){
    			
    			panel.classList.add("hidden_panel");
    			editBool = false;
    			addButton.disabled = true;
    			object.addItem(mainPanel, object._prefix + 'addCourse', account, object.schedule_data['courseData'], function(action){
    				
    				editBool = true;
    				if(action == "close"){
    					
    					addButton.disabled = false;
    					
    				}else{
    					
    					console.log(typeof action);
    					if(typeof action == 'object'){
    						
    						if(action['status'] != 'error'){
    							
    							console.log(action);
    							courseList = action;
    							object.createCoursePanel(courseList, account);
    							
    						}
    						
    					}
    					
    				}
    				
    				panel.classList.remove("hidden_panel");
    				
    			});
    			
    		}
    		
    		
    	};
    	
    	saveButton.onclick = function(event){
    		
    		courseList = object.changeRank('key', 'dnd_column', courseList, panel, 'changeCourseRank', account, function(json){
    			
    			//setting_data['courseList'] = json;
    			courseList = json;
    			saveButton.disabled = true;
    			var panelList = panel.getElementsByClassName('dnd_column');
    			object.reviewPanels(panelList);
    			/**
    			for(var i = 0; i < panelList.length; i++){
    				
    				panelList[i].setAttribute("data-key", i);
    				var optionBox = panelList[i].getElementsByClassName("dnd_optionBox")[0];
    				(function(optionBox, key){
    				    
    				    var panel = optionBox.getElementsByTagName("label");
    				    for (var i = 0; i < panel.length; i++) {
    				        
    				        panel[i].setAttribute("data-key", key);
    				        
    				    }
    				    
    				    
    				})(optionBox, i);
    				
    			}
    			**/
    		});
    		
    		console.log(courseList);
    		
    	}
    	
    }
    
    this.subscriptionsPanel = function(subscriptions, account) {
        
        var editBool = true;
    	var object = this;
    	var addButton = document.createElement("button");
    	addButton.disabled = false;
    	addButton.setAttribute("class", "w3tc-button-save button-primary");
    	addButton.textContent = object._i18n.get("Add subscription");
    	
    	var saveButton = document.createElement("button");
    	saveButton.disabled = true;
    	saveButton.setAttribute("class", "w3tc-button-save button-primary");
    	saveButton.setAttribute("style", "float: right;");
    	saveButton.textContent = object._i18n.get("Change ranking");
    	
    	var buttonPanel = document.createElement("div");
    	buttonPanel.setAttribute("style", "padding-bottom: 10px;");
    	buttonPanel.appendChild(addButton);
    	buttonPanel.appendChild(saveButton);
    	
    	var guestsPanel = document.getElementById("guestsPanel");
    	guestsPanel.textContent = null;
    	
    	var mainPanel = document.getElementById("subscriptionsPanel");
    	mainPanel.textContent = null;
    	mainPanel.appendChild(buttonPanel);
    	
    	var panel = document.createElement("div");
    	panel.id = "courseSort";
    	panel.setAttribute("class", "dnd");
    	var buttons = {};
    	var columns = {};
    	var list = {name: 'Name', email: 'Email', zip: 'Zip', D: 'D', Test: 'Test', planA: 'plan A', area: 'area', G: 'G'};
    	list = {};
    	//var courseList = courseList;
    	console.log(subscriptions);
    	for(var i = 0; i < subscriptions.length; i++){
    		
    		if(typeof subscriptions[i]['name'] == "string"){
    		    
    		    list[subscriptions[i]['key']] = subscriptions[i]['name'].replace(/\\/g, "");
    		    
    		}
    		
    	}
    	console.log(list);
    	//for(var key in courseList){
    	for(var key = 0; key < subscriptions.length; key++){
    		
    		if(typeof subscriptions[key]['name'] == "string"){
    		    
    		    subscriptions[key]['name'] = subscriptions[key]['name'].replace(/\\/g, "");
    		    
    		}
    		
    		var contentPanel = document.createElement("div");
    		contentPanel.setAttribute("class", "dnd_content");
    		contentPanel.textContent = subscriptions[key]['name'];
    		
    		if(subscriptions[key]["active"] != 'true'){
    			
    			contentPanel.classList.add("dnd_content_unactive");
    			
    		}
    		
    		var editLabel = document.createElement("label");
    		editLabel.setAttribute("class", "dnd_edit");
    		editLabel.setAttribute("data-key", key);
    		editLabel.textContent = object._i18n.get("Edit");
    		
    		var deleteLabel = document.createElement("label");
    		deleteLabel.setAttribute("class", "dnd_delete");
    		deleteLabel.setAttribute("data-key", key);
    		deleteLabel.textContent = object._i18n.get("Delete");
    		
    		var optionPanel = document.createElement("div");
    		optionPanel.setAttribute("class", "dnd_optionBox");
    		optionPanel.appendChild(editLabel);
    		optionPanel.appendChild(deleteLabel);
    		
    		
    		var column = document.createElement("div");
    		column.setAttribute("class", "dnd_column");
    		column.setAttribute("draggable", "true");
    		column.setAttribute("data-key", key);
    		column.appendChild(contentPanel);
    		column.appendChild(optionPanel);
    		columns[key] = column;
    		
    		panel.appendChild(column);
    		
    		editLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				addButton.disabled = true;
    				editBool = false;
    				var key = this.getAttribute("data-key");
    				for(var formKey in columns){
    			        
    			        if(formKey != key){
    			            
    			            columns[formKey].classList.add("hidden_panel");
    			            
    			        }
    			        
    			    }
    			    jQuery('#courseSort').sortable('disable');
    				object.editItem(columns, key, mainPanel, panel, 'updateSubscriptions', account, subscriptions[key], object.schedule_data['subscriptionsData'], function(action){
    					
    					editBool = true;
    					if(action == 'cancel'){
    						
    						jQuery('#courseSort').sortable('enable');
    						
    					}else{
    						
    						subscriptions = action;
    						object.subscriptionsPanel(subscriptions, account);
    						
    					}
    					
    					addButton.disabled = false;
    					for(var formKey in columns){
        			        
        			        columns[formKey].classList.remove("hidden_panel");
        			        
        			    }
    					
    				});
    				
    			}
    			
    		}
    		
    		deleteLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				editBool = false;
    				var courseInfo = subscriptions[parseInt(this.getAttribute("data-key"))];
    				//var result = confirm("Do you delete service of \"" + courseInfo.name + "\"?");
    				var result = confirm(object._i18n.get('Do you delete Subscription of "%s"?', [courseInfo.name]));
    				if(result === true){
    					
    					console.log(courseInfo);
    					object.deleteItem(courseInfo.key, "deleteSubscriptions", account, function(json){
    						
    						subscriptions = json;
    						object.subscriptionsPanel(subscriptions, account);
    						
    					});
    					
    				}
    				editBool = true;
    				
    			}
    			
    		}
    		
    	}
    	
    	mainPanel.appendChild(panel);
    	
    	jQuery('#courseSort').sortable({
    									cursor: 'move',                     
    									opacity: 0.7,                       
    									placeholder: "ui-state-highlight",  
    									forcePlaceholderSize: true,          
    									forceHelperSize: true,
    									axis: 'y'
    	});
    	
    	//$( '#formSort' ).disableSelection();
    	jQuery(document).off("sortstop", "#courseSort");
    	jQuery(document).on('sortstop', '#courseSort', function(){
    		
    		var sortBool = object.sortData('key', 'dnd_column', subscriptions, panel, 'changeCourseRank');
    		if(sortBool === true){
    			
    			saveButton.disabled = false;
    			
    		}else{
    			
    			saveButton.disabled = true;
    			
    		}
    		
    	});
    	
    	addButton.onclick = function(event){
    		
    		if(editBool === true){
    			
    			panel.classList.add("hidden_panel");
    			editBool = false;
    			addButton.disabled = true;
    			object.addItem(mainPanel, 'addSubscriptions', account, object.schedule_data['subscriptionsData'], function(action){
    				
    				editBool = true;
    				if(action == "close"){
    					
    					addButton.disabled = false;
    					
    				}else{
    					
    					console.log(typeof action);
    					if(typeof action == 'object'){
    						
    						if(action['status'] != 'error'){
    							
    							console.log(action);
    							subscriptions = action;
    							object.subscriptionsPanel(subscriptions, account);
    							
    						}
    						
    					}
    					
    				}
    				
    				panel.classList.remove("hidden_panel");
    				
    			});
    			
    		}
    		
    		
    	};
    	
    	saveButton.onclick = function(event){
    		
    		subscriptions = object.changeRank('key', 'dnd_column', subscriptions, panel, 'changeSubscriptionsRank', account, function(json){
    			
    			//setting_data['courseList'] = json;
    			subscriptions = json;
    			saveButton.disabled = true;
    			var panelList = panel.getElementsByClassName('dnd_column');
    			object.reviewPanels(panelList);
    			/**
    			for(var i = 0; i < panelList.length; i++){
    				
    				panelList[i].setAttribute("data-key", i);
    				
    			}
    			**/
    		});
    		
    		console.log(subscriptions);
    		
    	}
        
        
    }
    
    this.taxPanel = function(taxes, account) {
        
        var editBool = true;
    	var object = this;
    	var addButton = document.createElement("button");
    	addButton.disabled = false;
    	addButton.setAttribute("class", "w3tc-button-save button-primary");
    	addButton.textContent = object._i18n.get("Add surcharge or tax");
    	
    	var saveButton = document.createElement("button");
    	saveButton.disabled = true;
    	saveButton.setAttribute("class", "w3tc-button-save button-primary");
    	saveButton.setAttribute("style", "float: right;");
    	saveButton.textContent = object._i18n.get("Change ranking");
    	
    	var buttonPanel = document.createElement("div");
    	buttonPanel.setAttribute("style", "padding-bottom: 10px;");
    	buttonPanel.appendChild(addButton);
    	buttonPanel.appendChild(saveButton);
    	
    	var guestsPanel = document.getElementById("guestsPanel");
    	guestsPanel.textContent = null;
    	
    	var mainPanel = document.getElementById("taxPanel");
    	mainPanel.textContent = null;
    	mainPanel.appendChild(buttonPanel);
    	
    	var panel = document.createElement("div");
    	panel.id = "courseSort";
    	panel.setAttribute("class", "dnd");
    	var buttons = {};
    	var columns = {};
    	var list = {};
    	console.log(taxes);
    	for(var i = 0; i < taxes.length; i++){
    		
    		if(typeof taxes[i]['name'] == "string"){
    		    
    		    list[taxes[i]['key']] = taxes[i]['name'].replace(/\\/g, "");
    		    
    		}
    		
    	}
    	console.log(list);
    	//for(var key in courseList){
    	for(var key = 0; key < taxes.length; key++){
    		
    		if(typeof taxes[key]['name'] == "string"){
    		    
    		    taxes[key]['name'] = taxes[key]['name'].replace(/\\/g, "");
    		    
    		}
    		
    		var contentPanel = document.createElement("div");
    		contentPanel.setAttribute("class", "dnd_content");
    		contentPanel.textContent = taxes[key]['name'];
    		
    		if(taxes[key]["active"] != 'true'){
    			
    			contentPanel.classList.add("dnd_content_unactive");
    			
    		}
    		
    		var editLabel = document.createElement("label");
    		editLabel.setAttribute("class", "dnd_edit");
    		editLabel.setAttribute("data-key", key);
    		editLabel.textContent = object._i18n.get("Edit");
    		
    		var deleteLabel = document.createElement("label");
    		deleteLabel.setAttribute("class", "dnd_delete");
    		deleteLabel.setAttribute("data-key", key);
    		deleteLabel.textContent = object._i18n.get("Delete");
    		
    		var optionPanel = document.createElement("div");
    		optionPanel.setAttribute("class", "dnd_optionBox");
    		optionPanel.appendChild(editLabel);
    		optionPanel.appendChild(deleteLabel);
    		
    		
    		var column = document.createElement("div");
    		column.setAttribute("class", "dnd_column");
    		column.setAttribute("draggable", "true");
    		column.setAttribute("data-key", key);
    		column.appendChild(contentPanel);
    		column.appendChild(optionPanel);
    		columns[key] = column;
    		
    		panel.appendChild(column);
    		
    		editLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				addButton.disabled = true;
    				editBool = false;
    				var key = this.getAttribute("data-key");
    				for(var formKey in columns){
    			        
    			        if(formKey != key){
    			            
    			            columns[formKey].classList.add("hidden_panel");
    			            
    			        }
    			        
    			    }
    			    jQuery('#courseSort').sortable('disable');
    				object.editItem(columns, key, mainPanel, panel, 'updateTaxes', account, taxes[key], object.schedule_data['taxesData'], function(action){
    					
    					editBool = true;
    					if(action == 'cancel'){
    						
    						jQuery('#courseSort').sortable('enable');
    						
    					}else{
    						
    						taxes = action;
    						object.taxPanel(taxes, account);
    						
    					}
    					
    					addButton.disabled = false;
    					for(var formKey in columns){
        			        
        			        columns[formKey].classList.remove("hidden_panel");
        			        
        			    }
    					
    				});
    				
    			}
    			
    		}
    		
    		deleteLabel.onclick = function(event){
    			
    			if(editBool === true){
    				
    				editBool = false;
    				var courseInfo = taxes[parseInt(this.getAttribute("data-key"))];
    				//var result = confirm("Do you delete service of \"" + courseInfo.name + "\"?");
    				var result = confirm(object._i18n.get('Do you delete "%s"?', [courseInfo.name]));
    				if(result === true){
    					
    					console.log(courseInfo);
    					object.deleteItem(courseInfo.key, "deleteTaxes", account, function(json){
    						
    						taxes = json;
    						object.taxPanel(taxes, account);
    						
    					});
    					
    				}
    				editBool = true;
    				
    			}
    			
    		}
    		
    	}
    	
    	mainPanel.appendChild(panel);
    	
    	jQuery('#courseSort').sortable({
    									cursor: 'move',                     
    									opacity: 0.7,                       
    									placeholder: "ui-state-highlight",  
    									forcePlaceholderSize: true,          
    									forceHelperSize: true,
    									axis: 'y'
    	});
    	
    	//$( '#formSort' ).disableSelection();
    	jQuery(document).off("sortstop", "#courseSort");
    	jQuery(document).on('sortstop', '#courseSort', function(){
    		
    		var sortBool = object.sortData('key', 'dnd_column', taxes, panel, 'changeCourseRank');
    		if(sortBool === true){
    			
    			saveButton.disabled = false;
    			
    		}else{
    			
    			saveButton.disabled = true;
    			
    		}
    		
    	});
    	
    	addButton.onclick = function(event){
    		
    		if(editBool === true){
    			
    			panel.classList.add("hidden_panel");
    			editBool = false;
    			addButton.disabled = true;
    			object.addItem(mainPanel, 'addTaxes', account, object.schedule_data['taxesData'], function(action){
    				
    				editBool = true;
    				if(action == "close"){
    					
    					addButton.disabled = false;
    					
    				}else{
    					
    					console.log(typeof action);
    					if(typeof action == 'object'){
    						
    						if(action['status'] != 'error'){
    							
    							console.log(action);
    							taxes = action;
    							object.taxPanel(taxes, account);
    							
    						}
    						
    					}
    					
    				}
    				
    				panel.classList.remove("hidden_panel");
    				
    			});
    			
    		}
    		
    		
    	};
    	
    	if (object._isExtensionsValid == 1) {
    	    
    	    saveButton.onclick = function(event){
        		
        		taxes = object.changeRank('key', 'dnd_column', taxes, panel, 'changeTaxesRank', account, function(json){
        			
        			taxes = json;
        			saveButton.disabled = true;
        			var panelList = panel.getElementsByClassName('dnd_column');
        			object.reviewPanels(panelList);
        			/**
        			for(var i = 0; i < panelList.length; i++){
        				
        				panelList[i].setAttribute("data-key", i);
        				
        			}
        			**/
        		});
        		
        		console.log(taxes);
        		
        	}
    	    
    	} else {
    	    
    	    saveButton.disable = true;
    	    
    	}
    	
    }
    
    this.syncPanel = function(ical, icalToken, home, account, callback){
        
        var object = this;
        var syncPanel = document.getElementById("syncPanel");
        syncPanel.textContent = null;
        
        var title = document.createElement("div");
    	title.classList.add("title");
    	title.textContent = "iCal";
    	syncPanel.appendChild(title);
        
        console.log(account);
        
        var table = document.createElement("table");
    	table.setAttribute("class", "form-table");
    	syncPanel.appendChild(table);
        
        var inputData = {};
        var active = {name: 'Active', value: parseInt(ical), inputLimit: 1, inputType: 'RADIO', valueList: {1: object._i18n.get("Enable"), 0: object._i18n.get("Disable")}};
        var activePanel = object.createInput('ical', active, inputData, false, null, 0);
        console.log(activePanel);
        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = object._i18n.get("Active");
        
        var td = document.createElement("td");
        td.appendChild(activePanel);
        
        var tr = document.createElement("tr");
        tr.setAttribute("valign", "top");
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
        
        th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = object._i18n.get("iCal URL");
        
        var tokenButton = document.createElement("Button");
		tokenButton.textContent = this._i18n.get("Refresh token");
		//tokenButton.setAttribute("data-Key", key);
		tokenButton.setAttribute("class", "w3tc-button-save button-primary tokenButton");
		
		var tokenValue = document.createElement("input");
		tokenValue.type = "text";
		tokenValue.value = home + "?id=" + account.key + "&ical=" + icalToken;
		tokenValue.setAttribute("class", "tokenValue");
		tokenValue.setAttribute("readonly", "readonly");
		tokenValue.style.width = "100%";
		var inputPanel = document.createElement("div");
		inputPanel.appendChild(tokenValue);
		inputPanel.appendChild(tokenButton);
        
        td = document.createElement("td");
        td.appendChild(inputPanel);
        
        tr = document.createElement("tr");
        tr.setAttribute("valign", "top");
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
        
        tokenValue.onclick = function(){
            
            this.focus();
            this.select();
            
        }
		
		tokenButton.onclick = function(){
			
			object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
            var post = {nonce: object.nonce, action: object.action, mode: 'refreshToken', accountKey: account.key};
            object.setFunction("loadTabFrame", post);
            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                
                object.loadingPanel.setAttribute("class", "hidden_panel");
                tokenValue.value = home + "?id=" + account.key + "&ical=" + json.token;
                
            });
			
		}
		
		var saveButton = document.createElement("button");
        saveButton.textContent = object._i18n.get("Save");
        saveButton.setAttribute("class", "w3tc-button-save button-primary");
        
        var buttonPanel = document.createElement("div");
        buttonPanel.setAttribute("style", "text-align: right; margin: 10px 10px 10px 0px;");
        buttonPanel.appendChild(saveButton);
        syncPanel.appendChild(buttonPanel);
        
        saveButton.onclick = function(){
            
            var post = {nonce: object.nonce, action: object.action, mode: 'updateIcalToken', accountKey: account.key, ical: 0};
            var ical = inputData.ical;
            for(var i in ical){
                
                if (ical[i].checked == true) {
                    
                    post.ical = i;
                    break;
                    
                }
                
            }
            
            console.log(post);
            object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
            object.setFunction("loadTabFrame", post);
            object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                
                object.loadingPanel.setAttribute("class", "hidden_panel");
                
            });
            
        }
        
    }

    this.settingPanel = function(accountList, month, day, year, account, callback){
        
        var object = this;
        var settingPanel = document.getElementById("settingPanel");
        settingPanel.textContent = null;
        
        var addPanel = document.createElement("div");
        settingPanel.appendChild(addPanel);
    	addPanel.id = "addCoursePanel";
    	
    	var calendarNamePanel = document.getElementById("calendarName");
        var inputData = {};
        var inputTypeList = object.schedule_data['elementForCalendarAccount'];
        
        var table = document.createElement("table");
    	table.setAttribute("class", "form-table");
    	addPanel.appendChild(table);
    	
    	if(account.enableFixCalendar != null && account.monthForFixCalendar != null && account.yearForFixCalendar){
    	    
    	    account.fixCalendar = {enableFixCalendar: account.enableFixCalendar, monthForFixCalendar: account.monthForFixCalendar, yearForFixCalendar: account.yearForFixCalendar};
    	    
    	}
    	
    	if (inputTypeList.preparationTime != null) {
            
            var preparationTimeList = {};
        	for(var i = 0; i <= 180; i += 5){
        		
        		preparationTimeList[i] = object._i18n.get("%s min", [i]);
        		
        	}
        	inputTypeList.preparationTime.valueList = preparationTimeList;
            
        }
    	
    	console.log(account);
    	console.log(inputTypeList);
    	var trList = {}
    	for(var key in inputTypeList){
    		
    		console.log(key);
            var data = inputTypeList[key];
            data.value = account[key];
            if(data.optionValues != null){
                
                for(var optionKey in data.optionValues){
                    
                    if(account[optionKey] != null){
                        
                        console.log(optionKey + " = " + account[optionKey]);
                        data.optionValues[optionKey] = account[optionKey];
                        
                    }
                    
                }
                
            }
            
            var th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.textContent = object._i18n.get(inputTypeList[key].name);
            
            var inputPanel = object.createInput(key, data, inputData, false, null, object._isExtensionsValid);
            var td = document.createElement("td");
            td.appendChild(inputPanel);
            /**
            if(object._isExtensionsValid == 0){
                
                var extensionsValidPanel = document.createElement("div");
                extensionsValidPanel.classList.add("extensionsValid");
                extensionsValidPanel.textContent = "Test";
                td.appendChild(extensionsValidPanel);
                
            }
            **/
            
            var tr = document.createElement("tr");
            tr.setAttribute("valign", "top");
            tr.appendChild(th);
            tr.appendChild(td);
            trList[key] = tr;
            table.appendChild(tr);
            
            
            
            if(key == 'type'){
                
                tr.classList.add("hidden_panel");
                table.removeChild(tr);
                
            }
            
            if(account.type == 'day' && (key == 'includeChildrenInRoom' || key == 'numberOfPeopleInRoom' || key == 'numberOfRoomsAvailable' || key == 'expressionsCheck' || key == 'cost')){
                
                tr.classList.add("hidden_panel");
                
            }
            
            if(account.type == 'hotel' && 
                (
                    key == 'courseBool' || 
                    key == 'courseTitle' || 
                    key == 'displayRemainingCapacity' || 
                    key == 'subscriptionIdForStripe' || 
                    key == 'termsOfServiceForSubscription' ||
                    key == 'hasMultipleServices' ||
                    key == 'flowOfBooking'
                )
            ){
                
                tr.classList.add("hidden_panel");
                
            }
            
    	}
    	
    	if(inputData.id && inputData.id.textBox){
    		
    		console.log(inputData.id);
    		inputData.id.textBox.disabled = true;
    		
    	}
    	
        
        
        var saveButton = document.createElement("button");
        saveButton.textContent = object._i18n.get("Save");
        saveButton.setAttribute("class", "w3tc-button-save button-primary");
        
        var deleteButton = document.createElement("button");
        deleteButton.textContent = object._i18n.get("Delete");
        deleteButton.setAttribute("class", "media-button button-primary button-large media-button-insert deleteButton");
        
        var buttonPanel = document.createElement("div");
        buttonPanel.setAttribute("style", "text-align: right; margin: 10px 10px 10px 0px;");
        buttonPanel.appendChild(saveButton);
        buttonPanel.appendChild(deleteButton);
        addPanel.appendChild(buttonPanel);
        
        var confirm = new Confirm();
        
        saveButton.onclick = function(){
            
            var post = {nonce: object.nonce, action: object.action, mode: 'updateCalendarAccount', accountKey: account.key};
            var response = object.getInputData(inputTypeList, inputData);
            console.log(response);
            for(var key in response){
                
                if(typeof response[key] == 'boolean'){
        			
        			console.log("error key = " + key + " bool = " + response[key]);
        			trList[key].classList.add("errorPanel");
        			post = false;
        			break;
        			
        		}else{
        			
        			post[key] = response[key];
        			if(trList[key] != null){
        			    
        			    trList[key].classList.remove("errorPanel");
        			    
        			}
        			
        		}
                
            }
            
            if(post !== false){
                
                console.log(post);
                object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                object.setFunction("settingPanel", post);
                object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                    
                    console.log(json);
                    object.loadingPanel.setAttribute("class", "hidden_panel", 'getTemplateSchedule');
                    if(json.status != null && parseInt(json.status) == 0){
                        
                        confirm.alertPanelShow(object._i18n.get("Error"), object._i18n.get("An unknown cause of error occurred"), false, function(callback){
                            
                        });
                        
                    }else{
                        
                        calendarNamePanel.textContent = post.name;
                        object._htmlTitle.textContent = post.name;
                        callback(json);
                        
                    }
                    
                });
                
            }
            
        }
        
        deleteButton.onclick = function(){
            
            confirm.dialogPanelShow(object._i18n.get("Confirm deletion of calendar"), object._i18n.get('Do you delete the "%s"?', [account.name]), false, function(bool){
                
                console.log(bool);
                if(bool === true){
                    
                    object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    var post = {nonce: object.nonce, action: object.action, mode: 'deleteCalendarAccount', accountKey: account.key};
                    object.setFunction("settingPanel", post);
                    object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                        
                        console.log(json);
                        
            	        calendarNamePanel.classList.add("hidden_panel");
            	        calendarNamePanel.textContent = null;
            	        object._htmlTitle.textContent = object._htmlOriginTitle;
                        object.loadingPanel.setAttribute("class", "hidden_panel", 'getTemplateSchedule');
                        document.getElementById("tabFrame").classList.add("hidden_panel");
    	                object.createCalendarAccountList(json, month, day, year);
    	                object.setCloneCalendarList(json);
                        
                    });
                    
                }
                
            });
            
        }
        
    }

    this.addItem = function(mainPanel, mode, account, inputTypeList, callback){
    	
    	console.log(mainPanel);
    	console.log("mode = " + mode);
    	console.log(account)
    	
    	var object = this;
    	var closeHeghit = mainPanel.clientHeight;
    	var addPanel = document.createElement("div");
    	addPanel.id = "addCoursePanel";
    	mainPanel.appendChild(addPanel);
    	
        for (var key in inputTypeList) {
        	
        	inputTypeList[key]['value'] = "";
        	
        }
        
        console.log(inputTypeList);
        
        if (mode == object._prefix + 'addCourse') {
        	
        	var courseTimeList = {};
        	for (var i = 5; i < 1440; i += 5) {
        		
        		courseTimeList[i] = object._i18n.get("%s min", [i]);
        		
        	}
        	inputTypeList['time']['valueList'] = courseTimeList;
        	
        	if (inputTypeList.options != null) {
        	    
        	    var json = [{name: "", cost: 0, time: "0"}];
                inputTypeList.options.value = JSON.stringify(json);
        	    
        	}
        	
        	if (inputTypeList.target != null) {
        	    
        	    inputTypeList.target.value = "visitors_users";
        	    
        	}
        	
        	inputTypeList.cost.value = 0;
        	
        	var timeToProvide = {};
        	for (var day = 0; day < 8; day++) {
        	    
        	    var hours = {};
        	    for (var i = 0; i < 24; i++) {
            	    
            	    var time = i * 60;
            	    hours[time] = 1;
            	    
            	}
            	timeToProvide[day] = hours;
        	    
        	}
        	inputTypeList.timeToProvide.value = timeToProvide;
        	
        } else if (mode == 'addForm') {
        	
        	for (var key in inputTypeList) {
        		
        		if (key == "required" || key == "isEmail" || key == "isName" || key == "isAddress" || key == "isTerms") {
        			
        			inputTypeList[key].value = "false";
        			
        		} else if (key == "type") {
        			
        			inputTypeList[key].value = "TEXT";
        			
        		}
        		
        		
        	}
        	
        } else if (mode == 'addCalendarAccount') {
            
            inputTypeList.name.value = "New Calendar";
            if (inputTypeList.timezone != null) {
                
                inputTypeList.timezone.value = object._timezone;
                
            }
            
            //calendarAccountType
            if(inputTypeList.type != null){
                inputTypeList.type.value = "day";
            }
            
            if(inputTypeList.cost != null){
                inputTypeList.cost.value = 0;
            }
            
            if(inputTypeList.hasMultipleServices != null){
                
                inputTypeList.hasMultipleServices.value = 0;
                
            }
            
            if(inputTypeList.numberOfRoomsAvailable != null){
                inputTypeList.numberOfRoomsAvailable.value = 1;
            }
            
            if(inputTypeList.numberOfPeopleInRoom != null){
                inputTypeList.numberOfPeopleInRoom.value = 2;
            }
            
            if(inputTypeList.includeChildrenInRoom != null){
                inputTypeList.includeChildrenInRoom.value = 0;
            }
            
            if(inputTypeList.expressionsCheck != null){
                inputTypeList.expressionsCheck.value = 0;
            }
            
            if (inputTypeList.displayRemainingCapacity.value != null){
                inputTypeList.displayRemainingCapacity.value = 0;
            }
            
            if (inputTypeList.maxAccountScheduleDay.value != null){
                inputTypeList.maxAccountScheduleDay.value = 30;
            }
            
            if (inputTypeList.cancellationOfBooking != null){
                inputTypeList.cancellationOfBooking.value = 0;
            }
            
            if (inputTypeList.flowOfBooking != null){
                inputTypeList.flowOfBooking.value = "calendar";
            }
            
            if (inputTypeList.displayDetailsOfCanceled != null) {
                
                inputTypeList.displayDetailsOfCanceled.value = 1;
                
            }
            
            if(inputTypeList.displayRemainingCapacityInCalendar != null){
                
                inputTypeList.displayRemainingCapacityInCalendar.value = 0;
                if(object._locale == 'ja' || object._locale == 'ja-jp' || object._locale == 'ja_jp'){
                    
                    inputTypeList.displayThresholdOfRemainingCapacity.value = "50";
                    inputTypeList.displayRemainingCapacityHasMoreThenThreshold.value = "panorama_fish_eye";
                    inputTypeList.displayRemainingCapacityHasLessThenThreshold.value = "change_history";
                    inputTypeList.displayRemainingCapacityHas0.value = "cancel";
                    
                }
                
            }
            
            if (inputTypeList.preparationTime != null) {
                
                var preparationTimeList = {};
            	for(var i = 0; i <= 180; i += 5){
            		
            		preparationTimeList[i] = object._i18n.get("%s min", [i]);
            		
            	}
            	inputTypeList.preparationTime.valueList = preparationTimeList;
                
            }
            
            inputTypeList.status.value = "open";
            inputTypeList.courseBool.value = 0;
            inputTypeList.positionPreparationTime.value = "before_after";
            inputTypeList.displayRemainingCapacityInCalendarAsNumber.value = 0;
            
        } else if (mode == 'addGuests') {
            
            var json = [{number: 1, price: 0, name: "1 Person"}];
            inputTypeList.json.value = JSON.stringify(json);
            inputTypeList.target.value = "adult";
            inputTypeList.required.value = "0";
            
        } else if(mode == 'addSubscriptions') {
            
            inputTypeList.active.value = "true";
            inputTypeList.renewal.value = 1;
            inputTypeList.limit.value = 1;
            inputTypeList.numberOfTimes.value = 1;
            
        } else if(mode == 'addTaxes') {
            
            inputTypeList.active.value = "true";
            inputTypeList.type.value = "tax";
            inputTypeList.tax.value = "tax_exclusive";
            inputTypeList.target.value = "room";
            inputTypeList.method.value = "addition";
            inputTypeList.scope.value = "day";
            inputTypeList.value.value = 1000;
            
        }
        
    	console.log(inputTypeList);
    	var inputData = {};
    	var table = document.createElement("table");
    	table.setAttribute("class", "form-table");
    	var trList = {};
    	for(var key in inputTypeList){
    		
    		console.log(key);
            var data = inputTypeList[key];
            if (mode == 'addTaxes' && account.type == 'day' && (key == 'target' || key == 'scope')) {
                
                continue;
                
            }
            
            var th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.textContent = object._i18n.get(inputTypeList[key].name);
            
            
            var eventAction = null;
            if (parseInt(data.option) == 1) {
                
                eventAction = function(event){
                    
                    console.log(this);
                    var value = this.getAttribute("data-value");
                    var name = this.name;
                    console.log(inputData);
                    console.log("value = " + value);
                    console.log(inputTypeList[name]);
                    if (value == "hotel") {
                        
                        for(var optionKey in inputTypeList[name].optionsList){
                            
                            console.log("optionKey = " + optionKey);
                            console.log(inputTypeList[name].optionsList[optionKey]);
                            console.log(inputData[optionKey]);
                            if(inputData[optionKey] != null){
                                
                                //inputTypeList[optionKey].inputLimit = 1;
                                console.log(inputTypeList[optionKey]);
                                for(var key in inputData[optionKey]){
                                    
                                    var disabled = false;
                                    if(parseInt(inputTypeList[name].optionsList[optionKey]) == 1){
                                        
                                        disabled = true;
                                        
                                    }
                                    console.log("disabled = " + disabled);
                                    var elements = inputData[optionKey][key];
                                    console.log(elements);
                                    elements.disabled = disabled;
                                    
                                }
                                
                            }
                            
                        }
                        
                    } else if (value == "day") {
                        
                        for(var optionKey in inputTypeList[name].optionsList){
                            
                            console.log("optionKey = " + optionKey);
                            console.log(inputTypeList[name].optionsList[optionKey]);
                            console.log(inputData[optionKey]);
                            if(inputData[optionKey] != null){
                                
                                //inputTypeList[optionKey].inputLimit = 2;
                                for(var key in inputData[optionKey]){
                                    
                                    var disabled = true;
                                    if(parseInt(inputTypeList[name].optionsList[optionKey]) == 1){
                                        
                                        disabled = false;
                                        
                                    }
                                    console.log("disabled = " + disabled);
                                    var elements = inputData[optionKey][key];
                                    console.log(elements);
                                    elements.disabled = disabled;
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                    if (value == 'tax') {
                        
                        for (var optionKey in inputTypeList[name].optionsList) {
                            
                            console.log(inputData[optionKey]);
                            if(inputData[optionKey] != null){
                                
                                console.log(inputTypeList[optionKey]);
                                for(var key in inputData[optionKey]){
                                    
                                    var disabled = true;
                                    if(parseInt(inputTypeList[name].optionsList[optionKey]) == 1){
                                        
                                        disabled = false;
                                        
                                    }
                                    console.log("disabled = " + disabled);
                                    var elements = inputData[optionKey][key];
                                    console.log(elements);
                                    elements.disabled = disabled;
                                    
                                }
                                
                            }
                            
                        }
                        
                    } else if (value == 'surcharge') {
                        
                        for (var optionKey in inputTypeList[name].optionsList) {
                            
                            console.log(inputData[optionKey]);
                            if(inputData[optionKey] != null){
                                
                                console.log(inputTypeList[optionKey]);
                                for(var key in inputData[optionKey]){
                                    
                                    var disabled = false;
                                    if(parseInt(inputTypeList[name].optionsList[optionKey]) == 1){
                                        
                                        disabled = true;
                                        
                                    }
                                    console.log("disabled = " + disabled);
                                    var elements = inputData[optionKey][key];
                                    console.log(elements);
                                    elements.disabled = disabled;
                                    if (optionKey == 'tax') {
                                        
                                        if (key == 'tax_inclusive') {
                                            
                                            elements.checked = true;
                                            
                                        } else {
                                            
                                            elements.checked = false;
                                            
                                        }
                                        
                                    }
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
            
            var upperPanel = null;
            if (key == "cost") {
                
                upperPanel = document.createElement("div");
                upperPanel.setAttribute("class", "upperPanel");
                eventAction = function(event){
                    
                    var value = parseInt(this.value);
                    var cost = new FORMAT_COST(this._i18n).formatCost(value, object._currency);
                    var upperPanel = this.parentElement.getElementsByClassName("upperPanel")[0];
                    upperPanel.textContent = object._i18n.get("Display") + ": " + cost;
                    this.value = value;
                    console.log("value = " + value);
                    
                }
                
            }
            
            if (mode == 'addTaxes' && key == 'value') {
                
                upperPanel = document.createElement("div");
                upperPanel.setAttribute("class", "upperPanel");
                eventAction = function(event){
                    
                    var value = this.value;
                    var cost = new FORMAT_COST(this._i18n).formatCost(parseInt(value), object._currency);
                    var upperPanel = this.parentElement.getElementsByClassName("upperPanel")[0];
                    upperPanel.textContent = object._i18n.get("For addition, it is %s.", [cost]) + " \n" + object._i18n.get("For multiplication, it is %s percent.", [parseFloat(value)]);
                    this.value = value;
                    console.log("value = " + value);
                    
                }
                
            }
            
            var disabled = false;
            if(data.disabled != null && parseInt(data.disabled) == 1){
                
                disabled = true;
                
            }
            
            var inputPanel = object.createInput(key, data, inputData, disabled, eventAction, object._isExtensionsValid);
            if (upperPanel != null) {
                
                if (key == "cost") {
                    console.log(data);
                    var cost = new FORMAT_COST(this._i18n).formatCost(data.value, object._currency);
                    upperPanel.textContent = object._i18n.get("Display") + ": " + cost;
                    inputPanel.insertAdjacentElement("afterbegin", upperPanel);
                    
                } else if (mode == 'addTaxes' && key == 'value') {
                    
                    console.log(data);
                    var cost = new FORMAT_COST(this._i18n).formatCost(data.value, object._currency);
                    upperPanel.textContent = object._i18n.get("For addition, it is %s.", [cost]) + " \n" + object._i18n.get("For multiplication, it is %s percent.", [data.value]);
                    inputPanel.insertAdjacentElement("beforeend", upperPanel);
                    
                }
                
                
            }
            
            
            var td = document.createElement("td");
            td.appendChild(inputPanel);
            
            var tr = document.createElement("tr");
            tr.id = "booking-package_" + key;
            tr.setAttribute("valign", "top");
            tr.appendChild(th);
            tr.appendChild(td);
            trList[key] = tr;
            table.appendChild(tr);
            
            if(inputTypeList[key].class != null){
                
                tr.setAttribute("class", inputTypeList[key].class);
                
            }
    		
    	}
    	
    	console.log(inputData);
        
        addPanel.appendChild(table);
        
        var cancelButton = document.createElement("button");
        cancelButton.setAttribute("style", "margin-right: 10px;");
        cancelButton.textContent = object._i18n.get("Cancel");
        cancelButton.setAttribute("class", "w3tc-button-save button-primary");
        
        var saveButton = document.createElement("button");
        saveButton.textContent = object._i18n.get("Save");
        saveButton.setAttribute("class", "w3tc-button-save button-primary");
        
        var buttonPanel = document.createElement("div");
        buttonPanel.setAttribute("style", "text-align: right; margin: 10px 10px 10px 0px;");
        buttonPanel.appendChild(cancelButton);
        buttonPanel.appendChild(saveButton);
        addPanel.appendChild(buttonPanel);
        
        
        //mainPanel.style.height = closeHeghit + addPanel.clientHeight + "px";
        
        console.log("top = " + addPanel.offsetTop);
        console.log("closeHeghit = " + closeHeghit);
    	window.scrollTo(0, addPanel.offsetTop);
        
        cancelButton.onclick = function(event){
        	
        	mainPanel.removeChild(addPanel);
        	mainPanel.style.height = null;
        	console.log("cancelButton closeHeghit = " + closeHeghit);
        	callback("close");
        	
        }
        
        saveButton.onclick = function(event){
        	
        	var response = null;
        	
        	var postData = {mode: mode, nonce: object.nonce, action: object.action};
        	if (account != null) {
        	    
        	    postData.accountKey = account.key;
        	    
        	}
        	
        	if (mode == object._prefix + 'addCourse') {
        		/**
        		var selected = inputData['time']['selectBox'].selectedIndex + 1;
        		postData['name'] = inputData['name']['textBox'].value;
        		postData['time'] = selected * 5;
        		**/
        		console.log("rank = " + (document.getElementById("courseSort").childNodes.length + 1));
        		postData['rank'] = document.getElementById("courseSort").childNodes.length + 1;
        		
        		response = object.getInputData(inputTypeList, inputData);
        		
        	} else if (mode == 'addForm') {
        		
        		response = object.getInputData(inputTypeList, inputData);
        		
        	} else if (mode == 'addCalendarAccount') {
        	    
        	    response = object.getInputData(inputTypeList, inputData);
        	    
        	} else if (mode == 'addGuests') {
        	    
        	    response = object.getInputData(inputTypeList, inputData);
        	    console.log("json = " + JSON.parse(response.json).length);
        	    console.log(response.json);
        	    if(JSON.parse(response.json).length == null || JSON.parse(response.json).length == 0){
        	        
        	        response.json = false;
        	        
        	    }
        	    
        	} else if (mode == 'addSubscriptions') {
        	    
        	    response = object.getInputData(inputTypeList, inputData);
        	    postData['rank'] = document.getElementById("courseSort").childNodes.length + 1;
        	    
        	} else if (mode == 'addTaxes') {
        	    
        	    response = object.getInputData(inputTypeList, inputData);
        	    postData['rank'] = document.getElementById("courseSort").childNodes.length + 1;
        	    if (account.type == 'day') {
        	        
        	        response.scope = 'booking';
        	        response.target = 'room';
        	        
        	    }
        	    
        	}
        	
        	console.log(response);
        	var post = true;
        	for(var key in response){
        			
        		if(typeof response[key] == 'boolean'){
        			
        			console.log("error key = " + key + " bool = " + response[key]);
        			if (trList[key] != null) {
        			    
        			    trList[key].classList.add("errorPanel");
        			    
        			}
        			post = false;
        			
        		}else{
        			
        			postData[key] = response[key];
        			if(trList[key] != null){
        			    
        			    trList[key].classList.remove("errorPanel");
        			    
        			}
        			
        		}
        		
        	}
        	
        	if(post === true){
        		
        		console.log(postData);
        		object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        		object.setFunction("addItem", post);
        		object.xmlHttp = new Booking_App_XMLHttp(object.url, postData, object._webApp, function(json){
    				
    				if(json['status'] != 'error'){
    					
    					mainPanel.removeChild(addPanel);
        				mainPanel.style.height = null;
    					console.log(json);
    					callback(json);
    					
    				}else{
    					
    					alert(json["message"]);
    					
    				}
    				object.loadingPanel.setAttribute("class", "hidden_panel");
    								
    			});
        		
        	}
        	
    		
        }
    	
    }

    this.editItem = function(columns, editKey, mainPanel, columnsPanel, mode, account, itemData, inputTypeList, callback){
    	
    	console.log("editKey = " + editKey);
    	
    	console.log(columns[editKey]);
    	console.log(itemData);
    	
    	var object = this;
    	var addPanel = document.createElement("div");
    	addPanel.id = "addCoursePanel";
    	
        var inputData = {};
        if (mode == object._prefix + 'updateCourse') {
        	
        	inputTypeList.name.value = itemData.name;
        	inputTypeList.description.value = itemData.description;
        	inputTypeList.active.value = itemData.active;
        	if (inputTypeList.selectOptions != null) {
        	    
        	    inputTypeList.selectOptions.value = itemData.selectOptions;
        	    
        	}
        	
        	if (itemData.cost != null) {
        		
        		inputTypeList.cost.value = parseInt(itemData.cost);
        		
        	}
        	
        	if (inputTypeList.options != null) {
        	    
        	    inputTypeList.options.value = itemData.options;
        	    
        	}
        	
        	if (inputTypeList.target != null) {
        	    
        	    inputTypeList.target.value = itemData.target;
        	    
        	}
        	
        	inputTypeList.time.value = parseInt(itemData.time);
        	var courseTimeList = {};
        	for(var i = 5; i < 1440; i += 5){
        	
        		//courseTimeList[i] = i + "min";
        		courseTimeList[i] = object._i18n.get("%s min", [i]);
        	
    		}
        	inputTypeList.time.valueList = courseTimeList;
        	
        	if (itemData.timeToProvide == null || itemData.timeToProvide.length == 0) {
        	    
        	    var timeToProvide = {};
            	for(var day = 0; day < 8; day++){
            	    
            	    var hours = {};
            	    for(var i = 0; i < 24; i++){
                	    
                	    var time = i * 60;
                	    hours[time] = 1;
                	    
                	}
                	timeToProvide[day] = hours;
            	    
            	}
            	inputTypeList.timeToProvide.value = timeToProvide;
        	    
        	} else {
        	    
        	    inputTypeList.timeToProvide.value = itemData.timeToProvide;
        	    
        	}
        	
        } else if (mode == 'updateForm') {
        	
        	inputTypeList["id"]["value"] = itemData["id"];
        	inputTypeList["name"]["value"] = itemData["name"];
        	inputTypeList["description"]["value"] = itemData["description"];
        	inputTypeList["type"]["value"] = itemData["type"];
        	inputTypeList["active"]["value"] = itemData["active"];
        	inputTypeList["required"]["value"] = itemData["required"];
        	inputTypeList["isName"]["value"] = itemData["isName"];
        	inputTypeList["isAddress"]["value"] = itemData["isAddress"];
        	inputTypeList["isEmail"]["value"] = itemData["isEmail"];
        	inputTypeList["options"]["value"] = itemData["options"];
        	
        	if (itemData.uri != null) {
        	    
        	    inputTypeList.uri.value = itemData.uri;
        	    
        	}
        	
        	if (itemData.isTerms != null) {
        	    
        	    inputTypeList.isTerms.value = itemData.isTerms;
        	    
        	} else {
        	    
        	    inputTypeList.isTerms.value = "false";
        	    
        	}
        	
        } else if (mode == 'updateGuests') {
            
            inputTypeList.name.value = itemData["name"];
            inputTypeList.target.value = itemData["target"];
            inputTypeList.json.value = itemData["json"];
            inputTypeList.required.value = itemData['required'];
            
        } else if (mode == 'updateSubscriptions') {
            
            inputTypeList.subscription.value = itemData.subscription;
            inputTypeList.name.value = itemData.name;
            inputTypeList.active.value = itemData.active;
            inputTypeList.renewal.value = parseInt(itemData.renewal);
            inputTypeList.limit.value = parseInt(itemData.limit);
            inputTypeList.numberOfTimes.value = parseInt(itemData.numberOfTimes);
            
        } else if (mode == 'updateTaxes') {
            
            inputTypeList.name.value = itemData.name;
            inputTypeList.active.value = itemData.active;
            inputTypeList.type.value = itemData.type;
            inputTypeList.tax.value = itemData.tax;
            //inputTypeList.type.inputType = "TEXT";
            inputTypeList.method.value = itemData.method;
            inputTypeList.target.value = itemData.target;
            inputTypeList.scope.value = itemData.scope;
            inputTypeList.value.value = itemData.value;
            
        }
        
        var index = 0;
    	console.log(inputTypeList);
    	
    	var table = document.createElement("table");
    	table.setAttribute("class", "form-table");
    	
    	var trList = {}
    	for(var key in inputTypeList){
    		
    		console.log(key);
            var data = inputTypeList[key];
            if (mode == 'updateTaxes' && account.type == 'day' && (key == 'target' || key == 'scope')) {
                
                continue;
                
            }
            
            var eventAction = null;
            var upperPanel = null;
            if (key == "cost") {
                
                upperPanel = document.createElement("div");
                upperPanel.setAttribute("class", "upperPanel");
                eventAction = function(event){
                    
                    var value = parseInt(this.value);
                    var cost = new FORMAT_COST(this._i18n).formatCost(value, object._currency);
                    var upperPanel = this.parentElement.getElementsByClassName("upperPanel")[0];
                    upperPanel.textContent = object._i18n.get("Display") + ": " + cost;
                    this.value = value;
                    console.log("value = " + value);
                    
                }
                
            }
            
            if (mode == 'updateTaxes' && key == 'value') {
                
                upperPanel = document.createElement("div");
                upperPanel.setAttribute("class", "upperPanel");
                eventAction = function(event){
                    
                    var value = this.value;
                    var cost = new FORMAT_COST(this._i18n).formatCost(parseInt(value), object._currency);
                    var upperPanel = this.parentElement.getElementsByClassName("upperPanel")[0];
                    upperPanel.textContent = object._i18n.get("For addition, it is %s.", [cost]) + " \n" + object._i18n.get("For multiplication, it is %s percent.", [parseFloat(value)]);
                    this.value = value;
                    console.log("value = " + value);
                    
                }
                
            }
            
            if (mode == 'updateTaxes' && key == 'type') {
                
                eventAction = function(event) {
                    
                    console.log(this);
                    var value = this.getAttribute("data-value");
                    var name = this.name;
                    console.log(inputData);
                    console.log("value = " + value);
                    console.log(inputTypeList[name]);
                    if (value == 'tax') {
                        
                        for (var optionKey in inputTypeList[name].optionsList) {
                            
                            console.log(inputData[optionKey]);
                            if(inputData[optionKey] != null){
                                
                                console.log(inputTypeList[optionKey]);
                                for(var key in inputData[optionKey]){
                                    
                                    var disabled = true;
                                    if(parseInt(inputTypeList[name].optionsList[optionKey]) == 1){
                                        
                                        disabled = false;
                                        
                                    }
                                    console.log("disabled = " + disabled);
                                    var elements = inputData[optionKey][key];
                                    console.log(elements);
                                    elements.disabled = disabled;
                                    
                                }
                                
                            }
                            
                        }
                        
                    } else if (value == 'surcharge') {
                        
                        for (var optionKey in inputTypeList[name].optionsList) {
                            
                            console.log(inputData[optionKey]);
                            if(inputData[optionKey] != null){
                                
                                console.log(inputTypeList[optionKey]);
                                for(var key in inputData[optionKey]){
                                    
                                    var disabled = false;
                                    if(parseInt(inputTypeList[name].optionsList[optionKey]) == 1){
                                        
                                        disabled = true;
                                        
                                    }
                                    console.log("disabled = " + disabled);
                                    var elements = inputData[optionKey][key];
                                    console.log(elements);
                                    elements.disabled = disabled;
                                    if (optionKey == 'tax') {
                                        
                                        if (key == 'tax_inclusive') {
                                            
                                            elements.checked = true;
                                            
                                        } else {
                                            
                                            elements.checked = false;
                                            
                                        }
                                        
                                    }
                                    
                                }
                                
                            }
                            
                        }
                        
                    }
                    
                };
                
            }
            
            var th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.textContent = object._i18n.get(inputTypeList[key].name);
            
            var inputPanel = object.createInput(key, data, inputData, false, eventAction, object._isExtensionsValid);
            if (upperPanel != null) {
                
                if (key == "cost") {
                    
                    console.log(data);
                    var cost = new FORMAT_COST(this._i18n).formatCost(data.value, object._currency);
                    upperPanel.textContent = object._i18n.get("Display") + ": " + cost;
                    inputPanel.insertAdjacentElement("afterbegin", upperPanel);
                    
                } else if (mode == 'updateTaxes' && key == 'value') {
                    
                    console.log(data);
                    var cost = new FORMAT_COST(this._i18n).formatCost(data.value, object._currency);
                    upperPanel.textContent = object._i18n.get("For addition, it is %s.", [cost]) + " \n" + object._i18n.get("For multiplication, it is %s percent.", [data.value]);
                    inputPanel.insertAdjacentElement("beforeend", upperPanel);
                    
                }
                
            }
            
            if (mode == 'updateTaxes' && key == 'tax') {
                
                console.error(key);
                console.log(inputData);
                if(inputData.type.surcharge.checked == true) {
                    
                    for (var optionKey in inputData.tax) {
                        
                        if (optionKey == 'tax_inclusive') {
                            
                            inputData.tax[optionKey].checked = true;
                            
                        } else {
                            
                            inputData.tax[optionKey].checked = false;
                            
                        }
                        inputData.tax[optionKey].disabled = true;
                        
                    }
                    
                }
                console.log(inputData);
               
            }
            var td = document.createElement("td");
            td.appendChild(inputPanel);
            
            var tr = document.createElement("tr");
            tr.setAttribute("valign", "top");
            tr.appendChild(th);
            tr.appendChild(td);
            trList[key] = tr;
            table.appendChild(tr);
            
            if(inputTypeList[key].class != null){
                
                tr.setAttribute("class", inputTypeList[key].class);
                
            }
            
            
    		
    	}
    	
    	if (inputData.id && inputData.id.textBox) {
    		
    		console.log(inputData.id);
    		inputData.id.textBox.disabled = true;
    		
    	}
    	
    	if (inputData.subscription && inputData.subscription.textBox) {
    		
    		console.log(inputData.subscription);
    		inputData.subscription.textBox.disabled = true;
    		
    	}
    	
        addPanel.appendChild(table);
        
        var cancelButton = document.createElement("button");
        cancelButton.setAttribute("style", "margin-right: 10px;");
        cancelButton.textContent = object._i18n.get("Cancel");
        cancelButton.setAttribute("class", "w3tc-button-save button-primary");
        
        var saveButton = document.createElement("button");
        saveButton.textContent = object._i18n.get("Save");
        saveButton.setAttribute("class", "w3tc-button-save button-primary");
        
        var buttonPanel = document.createElement("div");
        buttonPanel.setAttribute("style", "text-align: right; margin: 10px 10px 10px 0px;");
        buttonPanel.appendChild(cancelButton);
        buttonPanel.appendChild(saveButton);
        addPanel.appendChild(buttonPanel);
        
        console.log("addPanel Height = " + addPanel.clientHeight);
        
        var plusHeight = addPanel.clientHeight - columns[editKey].clientHeight;
        var height = addPanel.clientHeight;
        
        console.log(columns[editKey]);
        columns[editKey].setAttribute("class", "hidden_panel");
        columnsPanel.insertBefore(addPanel, columns[editKey]);
        
        
        var index = 0;
    	for(var key in columns){
    		
    		if(key == editKey){
    			
    			break;
    		}
    		
    	}
        
    	console.log(columns);
    	console.log("height = " + height);
    	columnsPanel.style.height = height + "px";
        
        cancelButton.onclick = function(event){
        	
        	columnsPanel.removeChild(addPanel);
        	columns[key].setAttribute("class", "dnd_column ui-sortable-handle");
        	callback('cancel');
        	
        }
        
        saveButton.onclick = function(event){
        	
        	var response = null;
        	var postData = {mode: mode, nonce: object.nonce, action: object.action};
        	if(account != null){
        	    
        	    postData.accountKey = account.key;
        	    
        	}
        	
        	if(mode == object._prefix + 'updateCourse'){
        		
        		console.log(inputData);
        		postData['key'] = itemData.key;
        		response = object.getInputData(inputTypeList, inputData);
    			
        	}else if(mode == 'updateForm'){
        		
        		postData['key'] = editKey;
        		response = object.getInputData(inputTypeList, inputData);
        		response.id = itemData.id;
        		
        	}else if(mode == "updateGuests"){
        	    
        	    postData['key'] = itemData.key;
        		response = object.getInputData(inputTypeList, inputData);
        		console.log("json = " + JSON.parse(response.json).length);
        	    console.log(response.json);
        	    if(JSON.parse(response.json).length == null || JSON.parse(response.json).length == 0){
        	        
        	        response.json = false;
        	        
        	    }
        	    
        	} else if (mode == "updateSubscriptions") {
        	    
        	    response = object.getInputData(inputTypeList, inputData);
        	    postData['key'] = itemData.key;
        	    
        	} else if (mode == "updateTaxes") {
        	    
        	    response = object.getInputData(inputTypeList, inputData);
        	    postData['key'] = itemData.key;
        	    if (account.type == 'day') {
        	        
        	        response.scope = 'booking';
        	        response.target = 'room';
        	        
        	    }
        	    
        	}
        	
        	var post = true;
        	for(var key in response){
        			
        		if(typeof response[key] == 'boolean'){
        			
        			console.log("error key = " + key + " bool = " + response[key]);
        			if (trList[key] != null) {
        			    
        			    trList[key].classList.add("errorPanel");
        			    
        			}
        			post = false;
        			
        		}else{
        			
        			postData[key] = response[key];
        			if (trList[key] != null) {
        			    
        			    trList[key].classList.remove("errorPanel");
        			    
        			}
        			
        		}
        		
        	}
        	
        	if(post === true){
        		
        		object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        		console.log(itemData);
        		console.log(postData);
        		object.setFunction("addItem", post);
        		object.xmlHttp = new Booking_App_XMLHttp(object.url, postData, object._webApp, function(json){
    				
    				if(json['status'] != 'error'){
    					
    					//mainPanel.removeChild(addPanel);
        				mainPanel.style.height = null;
    					console.log(json);
    					callback(json);
    					object.loadingPanel.setAttribute("class", "hidden_panel");
    					
    				}else{
    					
    					alert(json["message"]);
    					
    				}
    									
    			});
        		
        	}
        	
        }
    	
    }
        
    this.deleteItem = function(key, mode, account, callback){
        
        var object = this;
        object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var post = {mode: mode, nonce: object.nonce, action: object.action, key: key, accountKey: account.key};
        object.setFunction("deleteItem", post);
        object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
            
            if(json['status'] != 'error'){
                
                callback(json);
                
            }
            
            object.loadingPanel.setAttribute("class", "hidden_panel");
            
        });
        
    }

    this.sortData = function(key, className, list, panel, mode){
        
        console.log(key);
        console.log(list);
        var sortBool = false;
        var panelList = panel.getElementsByClassName(className);
        for(var i = 0; i < list.length; i++){
        //for (var i in list) {
            
            if (panelList[i] != null) {
                
                var index = parseInt(panelList[i].getAttribute("data-key"));
                if (i != index) {
                    
                    sortBool = true;
                    break;
                    
                }
                
            }
            
            /**
            var index = parseInt(panelList[i].getAttribute("data-key"));
            if(i != index){
                
                sortBool = true;
                break;
                
            }
            **/
            
        }
        
        var keyList = [];
        var indexList = [];
        console.log(panelList);
        if (sortBool === true) {
            
            for (var i = 0; i < panelList.length; i++) {
            //for (var i in list) {
                
                console.log(list[i]);
                keyList.push(list[i][key]);
                if (panelList[i] != null) {
                    
                    var index = parseInt(panelList[i].getAttribute("data-key"));
                    indexList.push(index);
                    console.log(panelList[i]);
                    
                }
                
                
            }
            
        }
        
        console.log(keyList);
        console.log(indexList);
        return sortBool;
        
    }
    
    this.changeRank = function(key, className, list, panel, mode, account, callback){
        
        var object = this;
        object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
        var newList = [];
        var keyList = [];
        var indexList = [];
        
        var panelList = panel.getElementsByClassName(className);
        for(var i = 0; i < panelList.length; i++){
            
            var panelKey = parseInt(panelList[i].getAttribute("data-key"));
            newList.push(list[panelKey]);
            keyList.push(list[panelKey][key]);
            indexList.push(i);
            console.log(panelList[i]);
        
        }
        
        var post = {mode: mode, nonce: object.nonce, action: object.action, keyList: keyList.join(","), indexList: indexList.join(","), accountKey: account.key};
        object.setFunction("changeRank", post);
        object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
            
            callback(json);
            object.loadingPanel.setAttribute("class", "hidden_panel");
            
        });
        
        return newList;
        
    }


    this.emailSettingPanel = function(emailMessageList, formData, account){
        
        console.log(account);
        console.log(emailMessageList);
        var object = this;
        var mailSettingPanel = document.getElementById("mailSettingPanel");
        var content_area = document.getElementById("content_area");
        content_area.textContent = null;
        
        var table = document.createElement("table");
        table.setAttribute("class", "emails_table table_option wp-list-table widefat fixed striped")
        content_area.appendChild(table);
        
        var mail_message = {
            mailAdmin: "mail_new_admin",
            /**mailVisitor: "mail_new_visitor",**/ 
            mailApproved: "mail_approved", 
            mailPending: "mail_pending", 
            mailDeleted: "mail_deleted",
            mailCanceled: "mail_canceled_by_visitor_user",
        };
        
        var valueTdList = {};
        for(var id in mail_message){
            
            if(mail_message[id] == null || emailMessageList[mail_message[id]] == null){
                
                continue;
                
            }
            
            var mailMessageData = emailMessageList[mail_message[id]];
            console.log(mailMessageData);
            var nameTh = document.createElement("th");
            nameTh.textContent = object._i18n.get(mailMessageData.title);
            if(parseInt(mailMessageData.enable) === 0){
                
                nameTh.classList.add("disableTh");
                
            }
            
            var subjectLabel = document.createElement("div");
            subjectLabel.setAttribute("class", "subjectLabel");
            subjectLabel.innerHTML = "<strong>" + object._i18n.get("Subject") + "</strong><br>" + mailMessageData.subject.replace(/\\/g, "");
            
            var content = mailMessageData.content.replace(/\\/g, "");
            var contentLabel = document.createElement("div");
            contentLabel.innerHTML = "<strong>" + object._i18n.get("Content") + "</strong><br>" + content.replace(/\\/g, "");
            
            var valueTd = document.createElement("td");
            valueTd.appendChild(subjectLabel);
            valueTd.appendChild(contentLabel);
            //valueTd.innerHTML = mailMessageData.content.replace(/\\/g, "");
            
            var editButton = document.createElement("button");
            editButton.id = id;
            editButton.setAttribute("class", "w3tc-button-save button-primary");
            editButton.textContent = object._i18n.get("Edit");
            
            var editButtonTd = document.createElement("td");
            editButtonTd.setAttribute("class", "editButtonTd");
            editButtonTd.appendChild(editButton);
            
            var tr = document.createElement("tr");
            tr.appendChild(nameTh);
            //tr.appendChild(valueTd);
            tr.appendChild(editButtonTd);
            
            table.appendChild(tr);
            valueTdList[id] = valueTd;
            
            editButton.onclick = function(){
                
                var id = mail_message[this.id];
                var editer_id = "textarea";
                var mailMessageData = emailMessageList[id];
                var textarea = document.getElementById("emailContent");
                console.log("id = " + id);
                console.log(mailMessageData);
                
                var emailEdit = document.getElementById("email_edit_panel");
                emailEdit.classList.remove("hidden_panel");
                var media_frame_content = document.getElementById("media_frame_content_for_schedule");
                media_frame_content.textContent = null;
                document.getElementById("media_title_for_schedule").classList.add("media_left_zero");
                document.getElementById("media_router_for_schedule").classList.add("hidden_panel");
                document.getElementById("menu_panel_for_schedule").classList.add("hidden_panel");
                document.getElementById("frame_toolbar_for_schedule").setAttribute("class", "media_frame_toolbar media_left_zero");
                //media_frame_content.appendChild(emailEdit);
                
                document.getElementById("edit_title_for_schedule").textContent = object._i18n.get(mailMessageData.title);
                var enableCheck = document.getElementById("mailEnable");
                enableCheck.checked = false;
                if(parseInt(mailMessageData.enable) == 1){
                    
                    enableCheck.checked = true;
                    
                }
                
                document.getElementById("emailFormatHtml").checked = true;
                if(mailMessageData.format == "text"){
                    
                    document.getElementById("emailFormatText").checked = true;
                    
                }
                
                var subject_filed = document.getElementById("subject");
                subject_filed.setAttribute("placeholder", "Enter subject here");
                subject_filed.value = mailMessageData.subject.replace(/\\/g, "");
                
                var mail_message_area_left = document.getElementById("mail_message_area_left");
                
                var contentId = "emailContent";
                document.getElementById(contentId).value = mailMessageData.content.replace(/\\/g, "");
                console.log(mailMessageData.content);
                
                var subject_filed_for_admin = document.getElementById("subjectForAdmin");
                subject_filed_for_admin.setAttribute("placeholder", "Enter subject here");
                if (mailMessageData.subjectForAdmin != null) {
                    
                    subject_filed_for_admin.value = mailMessageData.subjectForAdmin.replace(/\\/g, "");
                    
                } else {
                    
                    subject_filed_for_admin.value = "";
                    
                }
                
                
                var contentIdForAdmin = "emailContentForAdmin";
                if (mailMessageData.contentForAdmin != null) {
                    
                    document.getElementById(contentIdForAdmin).value = mailMessageData.contentForAdmin.replace(/\\/g, "");
                    
                } else {
                    
                    document.getElementById(contentIdForAdmin).value = "";
                    
                }
                console.log(mailMessageData.contentForAdmin);
                
                /**
                if(tinymce != null && tinymce.get(contentId) != null){
                    
                    console.log("I already have contents");
                    //tinymce.get(contentId).settings.remove_linebreaks = false;
                    tinymce.get(contentId).setContent(mailMessageData.content);
                    //tinymce.get(contentId).insertContent(mailMessageData.content);
                    //value = tinymce.get(id).save();
                    //console.log(tinymce.get(id).save());
                    
                }
                **/
                
                if(textarea != null){
                    
                    textarea.textContent = mailMessageData.content;
                    
                }
                
                var mail_message_area_right = document.getElementById("mail_message_area_right");
                mail_message_area_right.textContent = null;
                
                var mail_message_area_right_title = document.createElement("div");
                mail_message_area_right_title.setAttribute("class", "mail_message_area_right_title");
                mail_message_area_right_title.textContent = object._i18n.get("Help");
                mail_message_area_right.appendChild(mail_message_area_right_title);
                
                var str = object._i18n.get("You can use following shortcodes in content editer.");
                var help_message_label = document.createElement("div");
                help_message_label.setAttribute("class", "help_message_label");
                help_message_label.textContent = str;
                mail_message_area_right.appendChild(help_message_label);
                
                var shortcodes = {id: object._i18n.get("ID"), date: object._i18n.get("Booking date"), site_name: object._i18n.get("Your site name"), service: object._i18n.get("Service"), totalPaymentAmount: object._i18n.get("Total payment amount"), cancellationUri: object._i18n.get("Cancellation URI")};
                if(account.type == 'hotel'){
                    
                    shortcodes = {id: object._i18n.get("ID"), bookingDetails: object._i18n.get("Booking details"), checkIn: object._i18n.get("Arrival (Check-in)"), checkOut: object._i18n.get("Departure (Check-out)"), guests: object._i18n.get("Guests"), taxes: object._i18n.get("Taxes"), surcharges: object._i18n.get("Surcharges"), totalPaymentAmount: object._i18n.get("Total payment amount"), site_name: object._i18n.get("Your site name"), service: object._i18n.get("Service")};
                    
                }
                
                for(var key in shortcodes){
                    
                    var formFiledPanel = document.createElement("div");
                    formFiledPanel.setAttribute("class", "formFiledPanel");
                    mail_message_area_right.appendChild(formFiledPanel);
                    
                    var codeLabel = document.createElement("div");
                    codeLabel.innerHTML = object._i18n.get("[%s] is inserting \"%s\"", [key, shortcodes[key]]);
                    formFiledPanel.appendChild(codeLabel);
                    
                }
                
                //var formData = setting_data.formData;
                for(var i = 0; i < formData.length; i++){
                    
                    var filedData = formData[i];
                    if(filedData.active != 'true'){
                        
                        continue;
                        
                    }
                    
                    var formFiledPanel = document.createElement("div");
                    formFiledPanel.setAttribute("class", "formFiledPanel");
                    mail_message_area_right.appendChild(formFiledPanel);
                    
                    var codeLabel = document.createElement("div");
                    codeLabel.innerHTML = object._i18n.get("[%s] is inserting \"%s\"", [filedData.id, filedData.name]);
                    formFiledPanel.appendChild(codeLabel);
                    
                }
                
                var editPanel = document.getElementById("editPanelForSchedule");
                //console.log(tinymce);
                //console.log(tinyMCEPreInit.mceInit);
                
                var mail_message_save_button = document.createElement("button");
                mail_message_save_button.setAttribute("class", "button media-button button-primary button-large media-button-insert");
                mail_message_save_button.textContent = object._i18n.get("Save");
                
                var buttonPanel = document.getElementById("buttonPanel_for_schedule");
                buttonPanel.appendChild(mail_message_save_button);
                
                object.editPanelShow(true);
                mail_message_save_button.onclick = function(){
                    
                    var value = document.getElementById(contentId).value;
                    console.log(value);
                    var valueForAdmin = document.getElementById(contentIdForAdmin).value;
                    console.log(valueForAdmin);
                    /**
                    if(tinymce.get(contentId) != null && tinymce.get(contentId).getContent() != null){
                        
                        value = tinymce.get(contentId).save();
                        console.log(tinymce.get(contentId).save());
                        
                    }
                    **/
                    
                    var enable = 0;
                    if(enableCheck.checked === true){
                        
                        enable = 1;
                        
                    }
                    
                    var format = "html";
                    if(document.getElementById("emailFormatText").checked === true){
                        
                        format = "text";
                        
                    }
                    
                    object.loadingPanel.setAttribute("class", "loading_modal_backdrop");
                    var post = {mode: "updataEmailMessageForCalendarAccount", nonce: object.nonce, action: object.action, mail_id: mailMessageData.key, subject: subject_filed.value, content: value, subjectForAdmin: subject_filed_for_admin.value, contentForAdmin: valueForAdmin, enable: enable, format: format, accountKey: account.key};
                    console.log(post);
                    object.setFunction("emailSettingPanel", post);
                    object.xmlHttp = new Booking_App_XMLHttp(object.url, post, object._webApp, function(json){
                        
                        object.emailSettingPanel(json.emailMessageList, json.formData, account);
                        object.loadingPanel.setAttribute("class", "hidden_panel");
                        
                    });
                    
                }
                
            }
            
        }
        
    }


    this.getInputData = function(inputTypeList, inputData){
        
        var postData = {};
        console.log(inputData);
        for(var key in inputTypeList){
            
            console.log(key);
            var values = [];
            var inputType = inputTypeList[key];
            console.log(inputType);
            for(var inputKey in inputData[key]){
                
                console.log(inputKey);
                console.log(inputData[key][inputKey]);
                var bool = true;
                if(inputType['inputType'] == 'TEXT' || inputType['inputType'] == 'TEXTAREA'){
                    
                    if(inputData[key][inputKey].value.length == 0 && inputType.inputLimit == '1'){
                        
                        bool = false;
                        
                    }else{
                        
                        values.push(inputData[key][inputKey].value);
                        
                    }
                    
                }else if(inputType['inputType'] == 'CHECK' || inputType['inputType'] == 'RADIO'){
                    
                    if(inputData[key][inputKey].checked == true){
                        
                        values.push(inputData[key][inputKey].getAttribute("data-value"));
                        
                    }
                    
                }else if(inputType['inputType'] == 'OPTION'){
                    
                    console.log(inputData[key][inputKey]);
                    values.push(inputData[key][inputKey].value);
                    
                }else if(inputType['inputType'] == 'EXTRA'){
                    
                    if (key == 'options') {
                        
                        var option = JSON.parse(inputData[key][inputKey].json);
                        console.log(option);
                        if (option.name != null && option.name.length > 0) {
                            
                            values.push(option);
                            
                        }
                        
                    } else {
                        
                        values.push(JSON.parse(inputData[key][inputKey].json));
                        
                    }
                    
                }else if(inputType['inputType'] == 'REMAINING_CAPACITY'){
                    
                    values.push(JSON.stringify(inputData[key][inputKey]));
                    
                }else if(inputType['inputType'] == 'SELECT' || inputType['inputType'] == 'SELECT_TIMEZONE'){
                    
                    var index = inputData[key][inputKey].selectedIndex;
                    values.push(inputData[key][inputKey].options[index].value);
                    
                }else if(inputType['inputType'] == 'FIX_CALENDAR'){
                    
                    console.log(inputData['monthForFixCalendar']);
                    var indexMonth = inputData['monthForFixCalendar'].selectedIndex;
                    var valueMonth = inputData['monthForFixCalendar'].options[indexMonth].value;
                    values.push(valueMonth);
                    postData['monthForFixCalendar'] = valueMonth;
                    
                    var indexYear = inputData['yearForFixCalendar'].selectedIndex;
                    var valueYear = inputData['yearForFixCalendar'].options[indexYear].value;
                    values.push(valueYear);
                    postData['yearForFixCalendar'] = valueYear;
                    
                    var enableFixCalendar = 0;
                    if(inputData['enableFixCalendar'].checked == true){
                        
                        enableFixCalendar = 1;
                        
                    }
                    postData['enableFixCalendar'] = enableFixCalendar;
                    values.push(enableFixCalendar);
                    
                }else if(inputType['inputType'] == 'SUBSCRIPTION'){
                    
                    for(var optionKey in inputType.optionKeys){
                        
                        var option = inputType.optionKeys[optionKey];
                        if(option.inputType == "TEXT"){
                            
                            console.log(inputData[optionKey].textBox.value);
                            values = inputData[optionKey].textBox.value;
                            
                        }else if(option.inputType == "CHECKBOX"){
                            
                            var enable = 0;
                            if(inputData[optionKey].checked == true){
                                
                                enable = 1;
                                
                            }
                            postData[optionKey] = enable;
                            
                        }
                        
                    }
                    
                    /**
                    console.log(inputData["subscriptionIdForStripe"].textBox.value);
                    
                    var enableSubscriptionForStripe = 0;
                    if(inputData['enableSubscriptionForStripe'].checked == true){
                        
                        enableSubscriptionForStripe = 1;
                        
                    }
                    values = inputData["subscriptionIdForStripe"].textBox.value;
                    postData['enableSubscriptionForStripe'] = enableSubscriptionForStripe;
                    **/
                    
                } else if (inputType['inputType'] == 'TIME_TO_PROVIDE' || inputType['inputType'] == 'WEEK_TO_PROVIDE') {
                    
                    values.push(JSON.stringify(inputData[key][inputKey]));
                    
                }
                
            }
            
            if(bool === true){
                
                if(inputType['inputType'] == 'EXTRA'){
                    
                    postData[key] = JSON.stringify(values);
                    
                }else{
                    
                    console.log(typeof values);
                    console.log(values);
                    postData[key] = values
                    if(typeof values == "object"){
                        
                        postData[key] = values.join(",");
                        
                    }
                    
                }
                
            }else{
                
                postData[key] = false;
                
            }
            
            console.log(inputData[key]);
            
        }
        
        return postData;
        
    }
    
    this.reviewPanels = function(panelList) {
        
        for(var i = 0; i < panelList.length; i++){
			
			panelList[i].setAttribute("data-key", i);
			var optionBox = panelList[i].getElementsByClassName("dnd_optionBox")[0];
			(function(optionBox, key){
			    
			    var panel = optionBox.getElementsByTagName("label");
			    for (var i = 0; i < panel.length; i++) {
			        
			        panel[i].setAttribute("data-key", key);
			        
			    }
			    
			    
			})(optionBox, i);
			
		}
        
    }

    this.createInput = function(inputName, input, inputData, disabled, eventAction, isExtensionsValid){
	    
	    var object = this;
	    
        console.log("createInput");
        console.log("isExtensionsValid = " + isExtensionsValid);
        console.log(input);
        var list = null;
        if(input['valueList'] != null){
            
            list = input['valueList'];
            
        }
        
        console.log(list);
        var valuePanel = document.createElement("div");
        valuePanel.classList.add('valuePanel');
        if(input['inputType'] == 'TEXT'){
            
            var textBox = document.createElement("input");
            textBox.setAttribute("class", "regular-text");
            textBox.type = "text";
            textBox.disabled = disabled;
            if(input['value'] != null && typeof input['value'] == "string"){
                
                textBox.value = input['value'].replace(/\\/g, "");
                
            }else{
                
                textBox.value = input['value'];
                
            }
            
            if(eventAction != null){
                    
                textBox.onchange = eventAction;
                    
            }
            
            valuePanel.appendChild(textBox);
            inputData[inputName] = {textBox: textBox};
            
        }else if(input['inputType'] == 'SELECT'){
            
            var selectBox = document.createElement("select");
            selectBox.disabled = disabled;
            for(var key in list){
                
                var optionBox = document.createElement("option");
                optionBox.value = key;
                optionBox.textContent = list[key];
                
                console.log("key = " + key + " content = " + list[key]);
                if(key == input['value']){
                    
                    console.log("value = " + input['value']);
                    optionBox.selected = true;
                    
                }
                
                selectBox.appendChild(optionBox);
                
            }
            
            valuePanel.appendChild(selectBox);
            inputData[inputName] = {selectBox: selectBox};
            
        }else if(input['inputType'] == 'SELECT_GROUP'){
            
            var selectBox = document.createElement("select");
            selectBox.disabled = disabled;
            var selectedvalue = null;
            for(var key in list){
                
                if(list[key]['alpha-2'] == input['value']){
                    
                    selectedvalue = key;
                    break;
                    
                }
                
            }
            
            if(selectedvalue == null){
                
                selectedvalue = "United States of America";
                
            }
            
            var selectedCountry = list[selectedvalue];
            console.log(selectedCountry)
            
            var optionBox = document.createElement("option");
            optionBox.value = selectedCountry['alpha-2'];
            optionBox.textContent = selectedCountry.name;
            
            var optgroup = document.createElement("optgroup");
            optgroup.setAttribute("label", object._i18n.get("Selected country"));
            optgroup.appendChild(optionBox);
            selectBox.appendChild(optgroup);
            
            var frequently = ["Canada", "France", "Germany", "Italy", "Japan", "United Kingdom of Great Britain and Northern Ireland", "United States of America"];
            
            var optgroup = document.createElement("optgroup");
            optgroup.setAttribute("label", object._i18n.get("Frequently used countries"));
            selectBox.appendChild(optgroup);
            
            console.log("selectedvalue = " + selectedvalue);
            for(var i = 0; i < frequently.length; i++){
                
                var key = frequently[i];
                if(list[key].name != selectedvalue){
                    
                    var optionBox = document.createElement("option");
                    optionBox.value = list[key]['alpha-2'];
                    optionBox.textContent = list[key].name;
                    optgroup.appendChild(optionBox);
                    
                }
                
            }
            
            var optgroup = document.createElement("optgroup");
            optgroup.setAttribute("label", object._i18n.get("Other countries"));
            selectBox.appendChild(optgroup);
            
            for(var key in list){
                
                var optionBox = document.createElement("option");
                optionBox.value = list[key]['alpha-2'];
                optionBox.textContent = list[key].name;
                
                if(key == input['value']){
                    
                    console.log("value = " + input['value']);
                    optionBox.selected = true;
                    
                }
                
                optgroup.appendChild(optionBox);
                
            }
            
            valuePanel.appendChild(selectBox);
            inputData[inputName] = {selectBox: selectBox};
            
        } else if (input['inputType'] == 'SELECT_TIMEZONE') {
            
            var timezoneGroup = object._timezoneGroup;
			var options = [];
			var timezoneSelect = document.createElement("select");
			for (var i = 0; i < timezoneGroup.length; i++) {
				
				var group = timezoneGroup[i];
				var optionsInGroup = group.getElementsByTagName("option");
				optionsInGroup = [].slice.call(optionsInGroup);
				options = options.concat(optionsInGroup);
				
				timezoneSelect.appendChild(group);
				
			}
			
			for (var i = 0; i < options.length; i++) {
				
				var option = options[i];
				if (option.value == input.value) {
					
					option.selected = true;
					break;
					
				} else {
					
					option.selected = false;
					
				}
				
			}
            
            valuePanel.appendChild(timezoneSelect);
			inputData[inputName] = {selectBox: timezoneSelect};
            
        } else if (input['inputType'] == 'OPTION') {
            
            var options = {};
            if (input['value'] != null) {
                
                options = input['value'].split(",");
                
            }
            
            console.log(options);
            var addButton = document.createElement("div");
            addButton.setAttribute("class", "addLink");
            addButton.textContent = object._i18n.get("Add");
            valuePanel.appendChild(addButton);
            
            var table = document.createElement("table");
            table.setAttribute("class", "table_option wp-list-table widefat fixed striped");
            valuePanel.appendChild(table);
            
            inputData[inputName] = {};
            var tr_index = 0;
            var table_tr = {};
            
            for(var i = 0; i < options.length; i++){
                
                create_tr(tr_index, table, input, options[i]);
                tr_index++;
                
            }
            
            addButton.onclick = function(){
                
                create_tr(tr_index, table, input, "");
                tr_index++;
                
            }
            
        }else if(input['inputType'] == 'EXTRA'){
		
            var options = [];
            if(input['value'] != null && input['value'].length > 0){
                
                options = JSON.parse(input['value']);
                
            }
            
            console.log(options);
            var addButton = document.createElement("div");
            addButton.setAttribute("class", "addLink");
            addButton.textContent = object._i18n.get("Add");
            valuePanel.appendChild(addButton);
            
            if(object._isExtensionsValid == 0 && input.isExtensionsValidPanel != null && parseInt(input.isExtensionsValidPanel) == 0){
                
                var extensionsValidPanel = document.createElement("div");
                extensionsValidPanel.classList.add("freePlan");
                extensionsValidPanel.textContent = object._i18n.get('The "%s" is only available to subscribed users.', [object._i18n.get(input.name)]);
                valuePanel.appendChild(extensionsValidPanel);
                
            }
            
            var table = document.createElement("table");
            table.setAttribute("class", "table_option wp-list-table widefat fixed striped");
            valuePanel.appendChild(table);
            
            //var titleList = {numberOfPeople: object._i18n.get("Number of people"), price: object._i18n.get("Price"), title: object._i18n.get("Title")};
            var titleList = input.titleList;
            var tr = document.createElement("tr");
            table.appendChild(tr);
            tr.classList.add("tr_option");
            for(var key in titleList){
                
                var td = document.createElement("td");
                td.textContent = titleList[key];
                td.classList.add("td_option");
                tr.appendChild(td);
                
            }
            
            var td = document.createElement("td");
            td.setAttribute("class", "td_delete td_option");
            tr.appendChild(td);
            
            inputData[inputName] = {};
            var tr_index = 0;
            var table_tr = {};
            
            for(var i = 0; i < options.length; i++){
                
                create_tr(tr_index, table, input, options[i]);
                tr_index++;
                
            }
            
            addButton.onclick = function(){
                
                var titleList = {};
                for(var key in input.titleList){
                    
                    titleList[key] = "";
                    
                }
                
                create_tr(tr_index, table, input, titleList);
                tr_index++;
                
            }
            
        }else if(input['inputType'] == 'CHECK'){
            
            inputData[inputName] = {};
            for(var key in list){
                
                console.log("key = " + key + " value = " + list[key])
                var valueName = document.createElement("span");
                valueName.setAttribute("class", "radio_title");
                valueName.textContent = object._i18n.get(list[key]);
                
                var checkBox = document.createElement("input");
                checkBox.disabled = disabled;
                checkBox.setAttribute("data-value", key);
                checkBox.name = inputName;
                checkBox.type = "checkbox";
                checkBox.value = list[key];
                if(input['value'] == key){
                    
                    checkBox.checked = "checked";
                    
                }
                
                if (input.value != null) {
                    
                    var checkValues = input.value.split(",");
                    if (checkValues.length > 1) {
                        
                        for (var i = 0; i < checkValues.length; i++) {
                            
                            if (checkValues[i] == key) {
                                
                                checkBox.checked = "checked";
                                break;
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
                var label = document.createElement("label");
                label.appendChild(checkBox);
                label.appendChild(valueName);
                valuePanel.appendChild(label);
                inputData[inputName][key] = checkBox;
                
            }
            
        }else if(input['inputType'] == 'RADIO'){
            
            inputData[inputName] = {};
            for(var key in list){
                
                console.log(key + " = " + list[key]);
                var valueName = document.createElement("span");
                valueName.setAttribute("class", "radio_title");
                valueName.textContent = object._i18n.get(list[key]);
                
                var radioBox = document.createElement("input");
                radioBox.disabled = disabled;
                radioBox.setAttribute("data-value", key);
                radioBox.name = inputName;
                radioBox.type = "radio";
                radioBox.value = list[key];
                if(input['value'] == key){
                    
                    console.log("value = " + input['value']);
                    radioBox.checked = "checked";
                    
                }
                
                if(eventAction != null){
                    
                    radioBox.onchange = eventAction;
                    
                }
                
                var label = document.createElement("label");
                label.appendChild(radioBox);
                label.appendChild(valueName);
                valuePanel.appendChild(label);
                inputData[inputName][key] = radioBox;
                
            }
            
        }else if(input['inputType'] == 'TEXTAREA'){
            
            var textareaBox = document.createElement("textarea");
            if(input['value'] != null && typeof input['value'].replace == 'function'){
                
                textareaBox.value = input['value'].replace(/\\/g, "");
                
            }
            
            textareaBox.disabled = disabled;
            valuePanel.appendChild(textareaBox);
            inputData[inputName] = {textBox: textareaBox};
        
        }else if(input['inputType'] == 'REMAINING_CAPACITY'){
            
            var value = {json: {symbol: "", color: "#969696"}};
            console.log(input['value']);
            console.log(object.isJSON(input['value']));
            if(object.isJSON(input['value']) == true){
                
                value.json = JSON.parse(input['value']);
                
            }
            
            var symbol = document.createElement("input");
            symbol.type = "text";
            symbol.setAttribute("data-key", input.key);
            symbol.value = value.json.symbol;
            
            var tdSymbol = document.createElement("td");
            tdSymbol.appendChild(symbol);
            
            var color = document.createElement("input");
            color.type = "text";
            color.id = input.key + "_color";
            color.setAttribute("data-key", input.key);
            color.value = value.json.color;
            
            var tdColor = document.createElement("td");
            tdColor.appendChild(color);
            
            var tr = document.createElement("tr");
            tr.appendChild(tdSymbol);
            tr.appendChild(tdColor);
            
            var table = document.createElement("table");
            table.appendChild(tr);
            
            symbol.onchange = function(){
                
                var key = this.getAttribute("data-key");
                var value = this.value;
                if(typeof inputData[key].json != 'object'){
                    
                    inputData[key].json = {};
                    
                }
                
                inputData[key].json["symbol"] = value;
                
            }
            
            valuePanel.appendChild(table);
            
            var timer = setInterval(function(){
                
                (function( $ ) {
    				
    				$(function() {
    				    
    					$('#' + input.key + "_color").wpColorPicker({
    					    defaultColor: false,
    					    change: function(event, ui){
    					        
    					        var key = this.getAttribute("data-key");
    					        var color = "#" + ui.color._color.toString(16);
    					        if(typeof inputData[key].json != 'object'){
                                    
                                    inputData[key].json = {};
                                    
                                }
    					        inputData[key].json.color = color;
    					    },
    					    clear: function(){
    					        
    					    }
    					    
    					});
    					
    				});
    				
    			})( jQuery );
                console.error("Time out");
                clearInterval(timer);
                
            }, 300);
            
            
            
            
            inputData[inputName] = value;
        
        }else if(input['inputType'] == 'FIX_CALENDAR'){
            
            console.log(input.value);
            inputData[inputName] = {FIX_CALENDAR: null};
            var monthSelectBox = document.createElement("select");
            monthSelectBox.setAttribute("style", "margin-right: 1em;");
            var monthFullName = [object._i18n.get('January'), object._i18n.get('February'), object._i18n.get('March'), object._i18n.get('April'), object._i18n.get('May'), object._i18n.get('June'), object._i18n.get('July'), object._i18n.get('August'), object._i18n.get('September'), object._i18n.get('October'), object._i18n.get('November'), object._i18n.get('December')];
            for(var i = 0; i < monthFullName.length; i++){
                
                var optionBox = document.createElement("option");
                optionBox.value = i;
                optionBox.textContent = monthFullName[i];
                monthSelectBox.appendChild(optionBox);
                
            }
            
            if(input.value.monthForFixCalendar != null && monthSelectBox.options[parseInt(input.value.monthForFixCalendar)] != null){
                
                monthSelectBox.options[parseInt(input.value.monthForFixCalendar)].selected = true;
                
            }
            
            valuePanel.appendChild(monthSelectBox);
            inputData['monthForFixCalendar'] = monthSelectBox;
            
            var year = parseInt(new Date().getFullYear());
            var maxYear = year + 2;
            var selected = false;
            var yearSelectBox = document.createElement("select");
            yearSelectBox.setAttribute("style", "margin-right: 1em;");
            for(var i = 0; i < 3; i++){
                
                var valueYear = year + i;
                var optionBox = document.createElement("option");
                optionBox.value = valueYear;
                optionBox.textContent = valueYear;
                if(input.value.yearForFixCalendar != null && parseInt(input.value.yearForFixCalendar) == valueYear){
                    
                    optionBox.selected = true;
                    selected = true;
                    
                }
                yearSelectBox.appendChild(optionBox);
                
            }
            
            if(selected == false && input.value.length > 0 && parseInt(input.value.yearForFixCalendar) != 0){
                
                var optionBox = document.createElement("option");
                optionBox.value = input.value.yearForFixCalendar;
                optionBox.textContent = input.value.yearForFixCalendar;
                optionBox.selected = true;
                yearSelectBox.insertAdjacentElement('afterbegin', optionBox);
                
            }
            
            valuePanel.appendChild(yearSelectBox);
            inputData['yearForFixCalendar'] = yearSelectBox;
            
            var valueName = document.createElement("span");
            valueName.setAttribute("class", "radio_title");
            valueName.textContent = object._i18n.get("Enable");
            
            var checkBox = document.createElement("input");
            checkBox.name = inputName;
            checkBox.type = "checkbox";
            checkBox.value = 1;
            if(input.value.enableFixCalendar != null && parseInt(input.value.enableFixCalendar) == 1){
                
                checkBox.checked = true;
                
            }
            
            var label = document.createElement("label");
            label.setAttribute("style", "display: inline;");
            label.appendChild(checkBox);
            label.appendChild(valueName);
            valuePanel.appendChild(label);
            inputData['enableFixCalendar'] = checkBox;
            
        }else if(input['inputType'] == "SUBSCRIPTION"){
            
            console.log(input);
            console.log(input.value);
            console.log(inputData);
            
            for(var key in input.optionKeys){
                
                var option = input.optionKeys[key];
                console.log(option);
                if(option.inputType == 'TEXT'){
                    
                    var title = document.createElement("span");
                    title.textContent = option.title + " :";
                    valuePanel.appendChild(title);
                    
                    var textBox = document.createElement("input");
                    textBox.setAttribute("class", "subscription regular-text");
                    textBox.type = "text";
                    textBox.disabled = disabled;
                    
                    valuePanel.appendChild(textBox);
                    if(input['value'] != null && typeof input['value'] == "string"){
                        
                        textBox.value = input['value'].replace(/\\/g, "");
                        
                    }else{
                        
                        textBox.value = input['value'];
                        
                    }
                    
                }else if(option.inputType == 'CHECKBOX'){
                    
                    var valueName = document.createElement("span");
                    valueName.setAttribute("class", "radio_title");
                    valueName.textContent = object._i18n.get("Enable");
                    
                    var checkBox = document.createElement("input");
                    checkBox.name = inputName;
                    checkBox.type = "checkbox";
                    checkBox.value = 1;
                    if(input.value != null && input.value[key] != null && parseInt(input.value[key]) == 1){
                        
                        checkBox.checked = true;
                        
                    }
                    
                    if(input.optionValues != null && parseInt(input.optionValues[key]) == 1){
                        
                        checkBox.checked = true;
                        
                    }
                    
                    var label = document.createElement("label");
                    label.setAttribute("style", "display: inline;");
                    label.appendChild(checkBox);
                    label.appendChild(valueName);
                    valuePanel.appendChild(label);
                    
                    inputData[inputName] = {textBox: textBox, checkBox: checkBox};
                    inputData[key] = checkBox;
                    console.log(inputData);
                    
                }
                
            }
            
        } else if (input['inputType'] == "TIME_TO_PROVIDE") {
            
            var menuList = document.createElement("div");
            menuList.classList.add("menuList");
            
            var content = document.createElement('div');
            content.classList.add("content");
            
            var overflow = document.createElement("div");
            overflow.setAttribute("style", "overflow-x: auto;");
            overflow.appendChild(menuList);
            overflow.appendChild(content);
            valuePanel.appendChild(overflow);
            
            var weeks = [object._i18n.get("Sun"), object._i18n.get("Mon"), object._i18n.get("Tue"), object._i18n.get("Wed"), object._i18n.get("Thu"), object._i18n.get("Fri"), object._i18n.get("Sat"), object._i18n.get("National holiday")];
            var values = input.value;
            for(var day = 0; day < 8; day++){
                
                var tab = document.createElement("div");
                tab.setAttribute("data-week", day);
                tab.setAttribute("style", "margin: 1px -1px 0;");
                tab.id = "day_of_week_of_tab_by_" + day;
                tab.textContent = weeks[day];
                
                var timeZone = document.createElement('div');
                timeZone.setAttribute("data-week", day);
                timeZone.id = "day_of_week_by_" + day; 
                
                if (day == 0) {
                    
                    tab.setAttribute("class", "menuItem active");
                    tab.setAttribute("style", "margin: 0px -1px 0;");
                    timeZone.classList.remove("hidden_panel");
                    
                } else {
                    
                    tab.setAttribute("class", "menuItem");
                    timeZone.classList.add("hidden_panel");
                    
                }
                
                tab.onclick = function(){
                    
                    var selected = parseInt(this.getAttribute("data-week"));
                    for(var day = 0; day < 8; day++){
                        
                        var tab = document.getElementById("day_of_week_of_tab_by_" + day);
                        var timeZone = document.getElementById("day_of_week_by_" + day);
                        if (selected != day) {
                            
                            tab.classList.remove("active");
                            tab.setAttribute("style", "margin: 1px -1px 0;");
                            timeZone.classList.add("hidden_panel");
                            
                        } else {
                            
                            tab.classList.add("active");
                            tab.setAttribute("style", "margin: 0px -1px 0;");
                            timeZone.classList.remove("hidden_panel");
                            
                        }
                        
                    }
                    
                }
                
                menuList.appendChild(tab);
                content.appendChild(timeZone);
                
                for(var i = 0; i < 24; i++){
                    
                    var checkBox = document.createElement("input");
                    checkBox.setAttribute("data-hours", i * 60);
                    checkBox.setAttribute("data-week", day);
                    checkBox.type = "checkbox";
                    checkBox.value = i * 60;
                    if (values[day] != null && values[day][i * 60] != null && parseInt(values[day][i * 60]) == 1) {
                        
                        checkBox.checked = true;
                        
                    }
                    
                    checkBox.onchange = function(){
                        
                        var week = parseInt(this.getAttribute("data-week"));
                        var hours = this.getAttribute("data-hours");
                        
                        if (inputData[inputName]['json'][week] == null) {
                            
                            inputData[inputName]['json'][week] = {};
                            
                        }
                        
                        if (inputData[inputName]['json'][week][hours] != null) {
                            
                            inputData[inputName]['json'][week][hours] = 0;
                            if (this.checked == true) {
                                
                                inputData[inputName]['json'][week][hours] = 1;
                                
                            }
                            
                        } else {
                            
                            inputData[inputName]['json'][week][hours] = 1;
                            
                        }
                        
                        console.log(inputData[inputName]);
                        
                    }
                    
                    var text = document.createElement("span");
                    text.textContent = ("0" + i).slice(-2) + ":00 ";
                    
                    var label = document.createElement("label");
                    label.classList.add("timeAndWeek");
                    label.appendChild(checkBox);
                    label.appendChild(text);
                    timeZone.appendChild(label);
                    
                }
                
            }
            
            /**
            var time = "AM";
            for(var i = 0; i < 24; i++){
                
                if (i > 11) {
                    
                    time = "PM";
                    
                }
                
                var checkBox = document.createElement("input");
                checkBox.setAttribute("data-hours", i * 60);
                checkBox.type = "checkbox";
                checkBox.value = i * 60;
                if (values[i * 60] != null && parseInt(values[i * 60]) == 1) {
                    
                    checkBox.checked = true;
                    
                } else {
                    
                    //values[i * 60] = 1;
                    
                }
                
                checkBox.onchange = function(){
                    
                    var hours = this.getAttribute("data-hours");
                    if (inputData[inputName]['json'][hours] != null) {
                        
                        inputData[inputName]['json'][hours] = 0;
                        if (this.checked == true) {
                            
                            inputData[inputName]['json'][hours] = 1;
                            
                        }
                        
                    } else {
                        
                        inputData[inputName]['json'][hours] = 1;
                        
                    }
                    
                    console.log(inputData[inputName]);
                    
                }
                
                var text = document.createElement("span");
                text.textContent = ("0" + i).slice(-2) + ":00 " + time;
                
                var label = document.createElement("label");
                label.classList.add("timeAndWeek");
                label.appendChild(checkBox);
                label.appendChild(text);
                valuePanel.appendChild(label);
                
            }
            **/
            
            inputData[inputName] = {json: values};
            console.log(values);
            
        }
        
        if(input.message != null && typeof input.message == "string"){
            
            var messageLabel = document.createElement("div");
            messageLabel.classList.add("messageLabel");
            messageLabel.insertAdjacentHTML("beforeend", input.message);
            valuePanel.appendChild(messageLabel);
            
            
        }
        
        if(parseInt(input.isExtensionsValid) == 1 && isExtensionsValid == 0){
            
            var extensionsValidPanel = document.createElement("div");
            extensionsValidPanel.classList.add("extensionsValid");
            extensionsValidPanel.textContent = object._i18n.get("Subscribed users only");
            valuePanel.appendChild(extensionsValidPanel);
            if(input.isExtensionsValidPanel != null && parseInt(input.isExtensionsValidPanel) == 0){
                
                valuePanel.removeChild(extensionsValidPanel);
                
            }
            
        }
        
	    function create_tr(tr_index, table, input, valueList){
	        
	        if(typeof valueList == "string"){
	            
	            valueList = [valueList];
	            
	        }
	        console.log(valueList);
	        
	        var isExtensionsValid = 0;
	        if(input.isExtensionsValid != null && parseInt(input.isExtensionsValid) == 1){
	            
	            isExtensionsValid = 1;
	            
	        }
	        
            var tr = document.createElement("tr");
            tr.setAttribute("class", "tr_option");
            inputData[inputName][tr_index] = {};
            for(var key in valueList){
                
                var type = {type: "TEXT"};
                if(input.optionsType != null && input.optionsType[key] != null){
                    
                    type = input.optionsType[key];
                    
                }
                console.log(type);
                
                var value = valueList[key];
                console.log("value = " + value);
                
                
                
                var filedTd = document.createElement("td");
                filedTd.setAttribute("class", "td_option");
                
                
                if(type.type == "TEXT"){
                    
                    var textBox = document.createElement("input");
                    textBox.id = tr_index + "_" + key;
                    textBox.setAttribute("data-key", tr_index);
                    textBox.setAttribute("data-type", type.type);
                    textBox.setAttribute("class", "regular-text");
                    textBox.type = "text";
                    if(value != null && value.length != 0){
                        
                        textBox.value = value;
                        inputData[inputName][tr_index].value = value;
                        
                    }
                    filedTd.appendChild(textBox);
                    console.log("object._isExtensionsValid = " + object._isExtensionsValid);
                    if(object._isExtensionsValid == 0 && isExtensionsValid == 1){
                        
                        textBox.disabled = true;
                        
                    }else{
                        
                        textBox.onchange = function(){
                            
                            var dataKey = this.getAttribute("data-key");
                            var value = this.value;
                            for(var key in valueList){
                                
                                var textValue = document.getElementById(tr_index + "_" + key).value;
                                valueList[key] = textValue;
                                console.log("textValue = " + textValue);
                                
                            }
                            
                            var json = JSON.stringify(valueList);
                            inputData[inputName][dataKey].json = json;
                            inputData[inputName][dataKey].value = value;
                            console.log(valueList);
                            console.log(json);
                            console.log("dataKey = " + dataKey + " value = " + value);
                            
                        }
                        
                    }
                    
                    console.log(textBox);
                    
                    
                }else if(type.type == "SELECT"){
                    
                    var selectBox = document.createElement("select");
                    selectBox.id = tr_index + "_" + key;
                    selectBox.setAttribute("data-key", tr_index);
                    selectBox.setAttribute("data-type", type.type);
                    filedTd.appendChild(selectBox);
                    for(var i = parseInt(type.start); i < parseInt(type.end); i = i + parseInt(type.addition)){
                        
                        var optionBox = document.createElement("option");
                        optionBox.value = i;
                        optionBox.textContent = object._i18n.get(type.unit, [i]);
                        if(value != null && parseInt(value) == i){
                            
                            optionBox.selected = true;
                            inputData[inputName][tr_index].value = value;
                            
                        }
                        selectBox.appendChild(optionBox);
                        
                    }
                    
                    if(object._isExtensionsValid == 0 && isExtensionsValid == 1){
                        
                        selectBox.disabled = true;
                        
                    }else{
                        
                        selectBox.onchange = function(){
                            
                            var dataKey = this.getAttribute("data-key");
                            var value = this.value;
                            for(var key in valueList){
                                
                                var textValue = document.getElementById(tr_index + "_" + key).value;
                                valueList[key] = textValue;
                                console.log("textValue = " + textValue);
                                
                            }
                            
                            var json = JSON.stringify(valueList);
                            inputData[inputName][dataKey].json = json;
                            inputData[inputName][dataKey].value = value;
                            console.log(valueList);
                            console.log(json);
                            console.log("dataKey = " + dataKey + " value = " + value);
                            
                        }
                        
                    }
                    
                }
                
                tr.appendChild(filedTd);
                
                
            }
            
            inputData[inputName][tr_index].json = "";
            if(JSON.stringify(valueList)){
                
                inputData[inputName][tr_index].json = JSON.stringify(valueList);
                
            }
            
            
            var deleteButton = document.createElement("label");
            deleteButton.textContent = "delete";
            deleteButton.setAttribute("data-key", tr_index);
            deleteButton.setAttribute("class", "material-icons deleteLink");
            
            var deleteTd = document.createElement("td");
            deleteTd.setAttribute("class", "td_delete td_option");
            deleteTd.appendChild(deleteButton);
            tr.appendChild(deleteTd);
            
            table_tr[tr_index] = tr;
            table.appendChild(tr);
            
            deleteButton.onclick = function(){
                
                var result = false;
                var dataKey = this.getAttribute("data-key");
                console.log(dataKey);
                var json = JSON.parse(inputData[inputName][dataKey].json);
                console.log(json);
                
                var tr = table_tr[parseInt(dataKey)];
                console.log(tr);
                table.removeChild(tr);
                delete table_tr[dataKey];
                delete inputData[inputName][dataKey];
                console.log(tr);
                console.log(table_tr);
                console.log(inputData[inputName]);
                console.log("tr_index = " + tr_index);
            
            }
            
        }
        
        return valuePanel;
        
    }

    this.editPanelShow = function(showBool){
        
        var body = document.getElementsByTagName("body")[0];
        //console.log(body);
        if(showBool == true){
            
            body.classList.add("modal-open");
            this.editPanel.setAttribute("class", "edit_modal");
            this.blockPanel.setAttribute("class", "edit_modal_backdrop");
            
        }else{
            
            body.classList.remove("modal-open");
            this.editPanel.setAttribute("class", "hidden_panel");
            this.blockPanel.setAttribute("class", "hidden_panel");
            
        }
        
    }
    
    this.isJSON = function(arg){
		
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
    
    
}