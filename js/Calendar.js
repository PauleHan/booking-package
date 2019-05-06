    function Booking_App_Calendar(weekName, dateFormat, positionOfWeek, startOfWeek, i18n) {
    	
    	this._i18n = null;
    	this._stopToCreateCalendar = false;
    	this._startOfWeek = parseInt(startOfWeek);
        if(typeof i18n == 'object'){
            
            this._i18n = i18n;
            
        }
    	
    	this._weekClassName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    	//this.setWeekNameList(weekName);
    	this._weekName = weekName;
    	if(dateFormat != null){
    	    
    	    this._dateFormat = dateFormat;
    	    
    	}else{
    	    
    	    this._dateFormat = 0;
    	    
    	}
    	
    	if(positionOfWeek == null){
    	    
    	    this._positionOfWeek = "before";
    	    
    	}else{
    	    
    	    this._positionOfWeek = positionOfWeek;
    	    
    	}
    	
    	this._shortWeekNameBool = false;
    	
    	
    }
    
    Booking_App_Calendar.prototype.setStopToCreateCalendar = function(bool){
        
        this._stopToCreateCalendar = bool;
        
    }
	
	Booking_App_Calendar.prototype.setShortWeekNameBool = function(bool){
	    
	    this._shortWeekNameBool = bool;
	    
	}
	
	Booking_App_Calendar.prototype.setWeekNameList = function(weekName){
	    
	    this._weekName = weekName;
	    
	}
	
	Booking_App_Calendar.prototype.getWeekNameList = function(startOfWeek){
	    
	    var weekClassName = []
	    var weekName = [];
	    for(var i = 0; i < this._weekName.length; i++){
	        
	        weekClassName[i] = this._weekClassName[i];
	        weekName[i] = this._weekName[i];
	        
	    }
	    //Object.assign(weekName, this._weekName);
	    for(var i = 0; i < startOfWeek; i++){
	        
	        weekClassName.push(weekClassName[i]);
	        weekName.push(weekName[i]);
	        
	    }
	    
	    for(var i = 0; i < startOfWeek; i++){
	        
	        weekClassName.shift();
	        weekName.shift();
	        
	    }
	    
	    console.log(weekName);
	    return {weekName: weekName, weekClassName: weekClassName};
	    
	}
	
	Booking_App_Calendar.prototype.create = function(calendarPanel, calendarData, month, day, year, permission, callback){
	    
	    var dayHeight = parseInt(calendarPanel.clientWidth / 7);
	    var nationalHoliday = {};
	    if (calendarData.nationalHoliday != null && calendarData.nationalHoliday.calendar) {
	        
	        nationalHoliday = calendarData.nationalHoliday.calendar;
	        
	    }
	    
	    
	    var weekNamePanel = document.createElement("div");
	    weekNamePanel.setAttribute("class", "calendar");
	    //var weekName = this.getWeekNameList(this._startOfWeek);
	    var getWeekNameList = this.getWeekNameList(this._startOfWeek);
	    var weekName = getWeekNameList.weekName;
	    var weekClassName = getWeekNameList.weekClassName;
	    for(var i = 0; i < 7; i++){
	  	
            var dayPanel = document.createElement("div");
            dayPanel.setAttribute("class", "dayPanel " + weekClassName[i].toLowerCase());
            dayPanel.textContent = this._i18n.get(weekName[i]);
            weekNamePanel.insertAdjacentElement("beforeend", dayPanel);
            if(i == 6){
                
                dayPanel.setAttribute("style", "border-width: 1px 1px 0px 1px;")
	            
            }
        }
        
	    calendarPanel.insertAdjacentElement("beforeend", weekNamePanel);
	    
	    if(calendarData['date']['lastDay'] == null || calendarData['date']['startWeek'] == null || calendarData['date']['lastWeek'] == null){
	        
	        window.alert("There is not enough information to create a calendar.");
	        return null;
	        
	    }
        
        var lastDay = parseInt(calendarData['date']['lastDay']);
        var startWeek = parseInt(calendarData['date']['startWeek']);
        var lastWeek = parseInt(calendarData['date']['lastWeek']);
        
        var weekCount = 0;
        var calendar = calendarData.calendar;
        var scheduleList = calendarData.schedule;
        
        var weekLine = Object.keys(calendar).length / 7;
        console.log(calendarData);
        var index = 0;
        for(var key in calendar){
            var className = 'dayPanel dayPanelHeight';
            var dataKey = parseInt(calendar[key].year + ("0" + calendar[key].month).slice(-2) + ("0" + calendar[key].day).slice(-2));
            var bool = 1;
            
            var textPanel = document.createElement("div");
            textPanel.setAttribute("class", "dayPostion");
            textPanel.textContent = calendar[key].day;
            
            var dayPanel = document.createElement("div");
            dayPanel.id = "booking-package-day-" + index;
            //dayPanel.classList.add(weekName[parseInt(calendar[key].week)]);
            dayPanel.setAttribute("data-select", 1);
            dayPanel.setAttribute("data-day", calendar[key].day);
            dayPanel.setAttribute("data-month", calendar[key].month);
            dayPanel.setAttribute("data-year", calendar[key].year);
            dayPanel.setAttribute("data-key", key);
            dayPanel.setAttribute("data-week", weekCount);
            dayPanel.setAttribute("class", className);
            dayPanel.classList.add(weekName[parseInt(calendar[key].week)]);
            dayPanel.insertAdjacentElement("beforeend", textPanel);
            weekNamePanel.insertAdjacentElement("beforeend", dayPanel);
            
            var data = {key: dataKey, week: parseInt(calendar[key].week), month: calendar[key].month, day: calendar[key].day, year: calendar[key].year, eventPanel: dayPanel, status: true, count: i, bool: bool, index: index};
            
            if(calendar[dataKey].status != null){
                
                data.status = calendar[dataKey].status;
                
            }
            
            if(scheduleList != null){
                
                (function(data, schedule){
                    
                    var capacity = 0;
                    var remainder = 0;
                    for(var key in schedule){
                        
                        capacity += parseInt(schedule[key].capacity);
                        remainder += parseInt(schedule[key].remainder);
                        
                    }
                    
                    data.capacity = capacity;
                    data.remainder = remainder;
                    
                })(data, scheduleList[key]);
                
            }
            
            if (this._stopToCreateCalendar == true) {
                
                break;
                
            }
            
            if (calendarData.calendar[dataKey] != null || (calendarData.reservation != null && calendarData.reservation[dataKey])) {
                
                var weekClass = "";
                if (calendar[key].week != null) {
                    
                    weekClass = this._weekClassName[parseInt(calendar[key].week)].toLowerCase()
                    
                }
                
                if (nationalHoliday[key] != null && parseInt(nationalHoliday[key].status) == 1) {
                    
                    weekClass += " nationalHoliday";
                    
                }
                
                dayPanel.setAttribute("class", "dayPanel dayPanelHeight pointer " + weekClass);
                
                if (parseInt(weekLine) == 1) {
                    
                    dayPanel.setAttribute("class", "border_bottom_width dayPanel dayPanelHeight pointer " + weekClass);
                    
                }
                
                data.status = true;
                if (calendar[dataKey].status != null) {
                    
                    data.status = calendar[dataKey].status;
                    
                }
                callback(data);
                
            } else {
                
                dayPanel.setAttribute("class", "dayPanel dayPanelHeight closeDay");
                
                if (parseInt(weekLine) == 1) {
                    
                    dayPanel.setAttribute("class", "border_bottom_width dayPanel dayPanelHeight closeDay");
                    
                }
                
                data.status = false;
                if (calendar[dataKey].status != null) {
                    
                    data.status = calendar[dataKey].status;
                    
                }
                callback(data);
                
            }
            
            if (weekCount == 6) {
                
                //dayPanel.setAttribute("style", "border-width: 1px 1px 0px 1px; height: " + dayHeight + "px;");
                var style = dayPanel.getAttribute("style");
                if(style == null){
                    
                    style = "";
                    
                }
                dayPanel.setAttribute("style", style + "border-width: 1px 1px 0px 1px;");
                
            }
            
            if (weekCount == 6) {
                	
                weekCount = 0;
                weekLine--;
                
            } else {
                
                weekCount++;
                
            }
            
            index++;
            
        }
        
        return true;
        
    }
    
    Booking_App_Calendar.prototype.getExpressionsCheck = function(expressionsCheck){
        
        /**
        var i18n = new I18n(this._i18n._locale);
        i18n.setDictionary(this._i18n._dictionary);
        console.log(i18n);
        **/
        var response = {
            arrival: this._i18n.get("Arrival (Check-in)"), 
            chooseArrival: this._i18n.get("Please choose %s", [this._i18n.get("Arrival (Check-in)")]),
            departure: this._i18n.get("Departure (Check-out)"),
            chooseDeparture: this._i18n.get("Please choose %s", [this._i18n.get("Departure (Check-out)")]),
        
        };
        
        if(expressionsCheck == 1){
            
            response.arrival = this._i18n.get("Arrival");
            response.departure = this._i18n.get("Departure");
            response.chooseArrival = this._i18n.get("Please choose %s", [response.arrival]);
            response.chooseDeparture = this._i18n.get("Please choose %s", [response.departure]);
            
        }else if(expressionsCheck == 2){
            
            response.arrival = this._i18n.get("Check-in");
            response.departure = this._i18n.get("Check-out");
            response.chooseArrival = this._i18n.get("Please choose %s", [response.arrival]);
            response.chooseDeparture = this._i18n.get("Please choose %s", [response.departure]);
            
        }
        
        return response;
        
    }
    
    Booking_App_Calendar.prototype.getDateKey = function(month, day, year){
        
        var key = year + ("0" + month).slice(-2) + ("0" + day).slice(-2);
        return key;
        
    }
    
	Booking_App_Calendar.prototype.formatBookingDate = function(month, day, year, hour, min, title, week){
        
        var i18n = this._i18n;
        var dateFormat = this._dateFormat;
        if(typeof title == "string"){
            
            title = title.replace(/\\/g, "");
            
        }
        console.log("dateFormat = " + dateFormat + " month = " + month + " day = " + day + " year = " + year + " hour = " + hour + " min = " + min + " week = " + week);
        if(month != null){
            
            month = ("0" + month).slice(-2);
            
        }
        
        if(day != null){
            
            day = ("0" + day).slice(-2);
            
        }
        
        if(hour != null){
            
            hour = ("0" + hour).slice(-2);
            
        }
        
        if(min != null){
            
            min = ("0" + min).slice(-2);
            
        }
        
        if(week != null){
            
            week = parseInt(week);
            
        }
        
        if(month != null && day == null && year == null){
            
            date = month;
            if(dateFormat == 2 || dateFormat == 5){
                
                var monthShortName = ['', i18n.get('Jan'), i18n.get('Feb'), i18n.get('Mar'), i18n.get('Apr'), i18n.get('May'), i18n.get('Jun'), i18n.get('Jul'), i18n.get('Aug'), i18n.get('Sep'), i18n.get('Oct'), i18n.get('Nov'), i18n.get('Dec')];
                date = monthShortName[parseInt(month)];
                
            }
            return date;
            
        }
        
        //var weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var weekName = [i18n.get('Sunday'), i18n.get('Monday'), i18n.get('Tuesday'), i18n.get('Wednesday'), i18n.get('Thursday'), i18n.get('Friday'), i18n.get('Saturday')];
        //weekName = this._weekName;
        if(this._shortWeekNameBool == true){
            
            weekName = [i18n.get('Sun'), i18n.get('Mon'), i18n.get('Tue'), i18n.get('Wed'), i18n.get('Thu'), i18n.get('Fri'), i18n.get('Sat')];
            
        }
        var monthFullName = ['', i18n.get('January'), i18n.get('February'), i18n.get('March'), i18n.get('April'), i18n.get('May'), i18n.get('June'), i18n.get('July'), i18n.get('August'), i18n.get('September'), i18n.get('October'), i18n.get('November'), i18n.get('December')];
        var date = monthFullName[parseInt(month)] + " " + day + ", " + year + " ";
        
        if (dateFormat == 0) {
            
            date = month + "/" + day + "/" + year + " ";
            if (day == null) {
                
                date = month + "/" + year;
                
            }
            
        } else if (dateFormat == 1) {
            
            date = month + "-" + day + "-" + year + " ";
            if (day == null) {
                
                date = month + "-" + year;
                
            }
            
        } else if (dateFormat == 2) {
            
            date = monthFullName[parseInt(month)] + ", " + day + ", " + year + " ";
            if (day == null) {
                
                date = monthFullName[parseInt(month)] + ", " + year;
                
            }
            
        } else if (dateFormat == 3) {
            
            date = day + "/" + month + "/" + year + " ";
            if (day == null) {
                
                date = month + "/" + year;
                
            }
            
        } else if (dateFormat == 4) {
            
            date = day + "-" + month + "-" + year + " ";
            if (day == null) {
                
                date = month + "-" + year;
                
            }
            
        } else if (dateFormat == 5) {
            
            date = day + ", " + monthFullName[parseInt(month)] + ", " + year + " ";
            if (day == null) {
                
                date = monthFullName[parseInt(month)] + ", " + year;
                
            }
            
        } else if (dateFormat == 6) {
            
            date = year + "/" + month + "/" + day + " ";
            if (day == null) {
                
                date = year + "/" + month;
                
            }
            
        } else if (dateFormat == 7) {
            
            date = year + "-" + month + "-" + day + " ";
            if (day == null) {
                
                date = year + "-" + month;
                
            }
            
        } else if (dateFormat == 8) {
            
            date = day + "." + month + "." + year + " ";
            if (day == null) {
                
                date = month + "." + year;
                
            }
            
        } else if (dateFormat == 9) {
            
            date = day + "." + month + "." + year + " ";
            if (day == null) {
                
                date = monthFullName[parseInt(month)] + ", " + year;
                
            }
            
        } else {
            
        }
        
        if (month == null && day != null && year == null) {
            
            date = day;
            
        }
        
        if (this._positionOfWeek == 'before') {
            
            if (dateFormat != 2 && week != null) {
                
                date = this._i18n.get(weekName[week]) + " " + date;
                
            } else if (dateFormat == 2 && week != null) {
                
                date = this._i18n.get(weekName[week]) + ", " + date;
                
            }
            
        } else {
            
            if (dateFormat != 2 && week != null) {
                
                date = date + " " + this._i18n.get(weekName[week]) + " ";
                
            } else if (dateFormat == 2 && week != null) {
                
                date = date + ", " + this._i18n.get(weekName[week]) + " ";
                
            }
            
        }
        
        
        
        if(hour != null && min != null){
            date += hour + ":" + min + " ";
        }
        
        if(title != null){
            date += title;
        }
        
        return date;
        
    }
	
    Booking_App_Calendar.prototype.adjustmentSchedules = function(calendarData, calendarKey, i, courseTime, rejectionTime, preparationTime){
        
        (function(schedule, key, courseTime, rejectionTime, preparationTime, callback){
            
            console.log(key);
            var stopUnixTime = parseInt(schedule[key].unixTime);
            if (schedule[key].stop == 'false') {
                
                stopUnixTime += preparationTime * 60;
                
            }
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
                
            }
            
        })(calendarData['schedule'][calendarKey], i, courseTime, rejectionTime, preparationTime, function(key){
            
            console.log("callback key = " + key);
            calendarData['schedule'][calendarKey][key]["select"] = false;
            
        });
        
    }
	
    
    function FORMAT_COST(i18n) {
    	
    	this._i18n = null;
        if(typeof i18n == 'object'){
            
            this._i18n = i18n;
            
        }
        
    }
	
	FORMAT_COST.prototype.formatCost = function(cost, currency){
        
        var format = function(cost){
            
            cost = String(cost).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            return cost;
            
        }
        
        if (currency.toLocaleUpperCase() == 'USD') {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost);
            cost = "US$" + cost;
            
        } else if (currency.toLocaleUpperCase() == "EUR") {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost);
            cost = "€" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'JPY') {
            
            cost = format(cost);
            cost = "¥" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'HUF') {
            
            cost = format(cost);
            cost = "HUF " + cost;
            
        } else if (currency.toLocaleUpperCase() == 'DKK') {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost) + "kr";
            
        } else if (currency.toLocaleUpperCase() == "CNY") {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost);
            cost = "CN¥" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'TWD') {
            
            cost = Number(cost) / 100;
            cost = format(cost);
            cost = "NT$" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'THB') {
            
            cost = format(cost);
            cost = "TH฿" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'COP') {
            
            cost = format(cost);
            cost = "COP" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'CAD') {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost);
            cost = "$" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'AUD') {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost);
            cost = "$" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'GBP') {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost);
            cost = "£" + cost;
            
        } else if (currency.toLocaleUpperCase() == 'UAH') {
            
            cost = Number(cost) / 100;
            cost = cost.toFixed(2);
            cost = format(cost);
            cost = cost + " грн.";
            
        }
        
        console.log("currency = " + currency + " cost = " + cost);
        return cost;
        
    }
    
    function TAXES(i18n, currency) {
        
        this._i18n = null;
        this._currency = currency;
        this._taxes = [];
        this._visitorsDetails = {};
        if(typeof i18n == 'object'){
            
            this._i18n = i18n;
            
        }
        
    }
    
    TAXES.prototype.setTaxes = function(taxes) {
        
        this._taxes = taxes;
        
    }
    
    TAXES.prototype.getTaxes = function() {
        
        return this._taxes;
        
    }
    
    TAXES.prototype.setVisitorsDetails = function(visitorsDetails) {
        
        this._visitorsDetails = visitorsDetails;
        
    }
    
    TAXES.prototype.getVisitorsDetails = function() {
        
        return this._visitorsDetails;
        
    }
    
    TAXES.prototype.getTaxValue = function(taxKey, type, visitorsDetails) {
        
        var taxes = this._taxes;
        if (taxes[taxKey] == null) {
            
            return 0;
            
        } else {
            
            var tax = taxes[taxKey];
            var taxValue = 0;
            console.log(tax);
            var value = parseInt(tax.value);
            if (tax.method == 'multiplication') {
                
                value = parseFloat(tax.value);
                
            }
            
            console.log(value);
            
            if (type == 'day') {
                
                if (tax.method == 'multiplication') {
					
					taxValue =  (tax.value / 100) * visitorsDetails.amount;
					if (tax.tax == 'tax_inclusive') {
						
						taxValue = visitorsDetails.amount * (parseInt(tax.value) / (100 + parseInt(tax.value)));
						taxValue = Math.floor(taxValue);
						
					}
					tax.taxValue = taxValue;
					
				} else {
					
					tax.taxValue = parseInt(tax.value);
					taxValue = parseInt(tax.value);
					
				}
                
            } else if (type == 'hotel') {
                
                if (tax.target == 'room') {
                    
                    if (tax.scope == 'day') {
                        
                        if (tax.method == 'addition') {
                            
                            taxValue = visitorsDetails.nights * value;
                            
                            
                        } else if (tax.method == 'multiplication') {
                            
                            taxValue =  (value / 100) * (visitorsDetails.amount + (visitorsDetails.additionalFee * visitorsDetails.nights));
                            if (tax.type == 'tax' && tax.tax == 'tax_inclusive') {
                                
                                var amount = 0;
                                for (var i in visitorsDetails.list) {
                                    
                                    amount += parseInt(visitorsDetails.list[i].cost);
                                    
                                }
                                
                                taxValue = (amount + (visitorsDetails.additionalFee * visitorsDetails.nights)) * (value / (100 + value));
                                taxValue = Math.floor(taxValue);
                                
                            }
                            
                        }
                        
                    } else if (tax.scope == 'booking') {
                        
                        if (tax.method == 'addition') {
                            
                            taxValue = 1 * value;
                            
                        } else if (tax.method == 'multiplication') {
                            
                            taxValue =  (value / 100) * 1;
                            
                        }
                        
                    }
                    
                    if (tax.method == 'addition' && tax.type == 'tax' && tax.tax == 'tax_inclusive') {
                        
                        visitorsDetails.amount -= taxValue;
                        
                    }
                    
                } else if (tax.target == 'guest') {
                    
                    if (tax.scope == 'day') {
                        
                        if (tax.method == 'addition') {
                            
                            taxValue = (visitorsDetails.nights * visitorsDetails.person) * value;
                            
                        } else if (tax.method == 'multiplication') {
                            
                            taxValue =  (value / 100) * visitorsDetails.additionalFee;
                            if (tax.type == 'tax' && tax.tax == 'tax_inclusive') {
                                
                                taxValue = visitorsDetails.additionalFee * (value / (100 + value));
                                taxValue = Math.floor(taxValue);
                                
                            }
                            
                        }
                        
                    } else if (tax.scope == 'booking') {
                        
                        if (tax.method == 'addition') {
                            
                            taxValue = 1 * value;
                            
                        } else if (tax.method == 'multiplication') {
                            
                            taxValue =  (value / 100) * 1;
                            
                        }
                        
                    }
                    
                }
                
            }
            
            return taxValue;
            
        }
        
    }
    
    TAXES.prototype.taxesDetails = function(amount, formPanel, surchargePanel, taxePanel) {
        
        var currency = this._currency
        var taxes = this._taxes;
        var surchargeList = [];
        var taxList = [];
        var visitorsDetails = {amount: amount, additionalFee: 0, nights: 0, person: 0, list: []};
        for (var key in taxes) {
            
            var tax = taxes[key];
            if (tax.active != 'true') {
                
                continue;
                
            }
            
            var taxValue = this.getTaxValue(key, 'day', visitorsDetails);
            console.log("name = " + tax.name + " taxValue = " + taxValue);
            if (tax.type == 'surcharge') {
                
                surchargeList.push(tax);
                
            } else {
                
                taxList.push(tax);
                
            }
            
        }
        
        var format = new FORMAT_COST(this._i18n);
        if(surchargeList.length > 0 || taxList.length > 0) {
            
            var namePanel = surchargePanel.getElementsByClassName("name")[0];
            if(surchargeList.length > 0 && taxList.length > 0) {
                
                namePanel.textContent = this._i18n.get("Surcharge and Tax");
                namePanel.classList.add("surcharge_and_tax");
                
            } else if(surchargeList.length > 0 && taxList.length == 0) {
                
                namePanel.textContent = this._i18n.get("Surcharge");
                namePanel.classList.add("surcharge");
                
            } else if(surchargeList.length == 0 && taxList.length > 0) {
                
                namePanel.textContent = this._i18n.get("Tax");
                namePanel.classList.add("tax");
                
            }
            
            var valuePanel = surchargePanel.getElementsByClassName("value")[0];
            valuePanel.textContent = null;
            for (var i = 0; i < surchargeList.length; i++) {
                
                var surcharge = surchargeList[i];
                var nameSpan = document.createElement("span");
                nameSpan.classList.add("planName");
                nameSpan.textContent = surcharge.name;
                
                var costSpan = document.createElement("span");
                costSpan.classList.add("planPrice");
                if (parseInt(surcharge.taxValue) > 0) {
                    
                    costSpan.textContent = format.formatCost(surcharge.taxValue, currency);
                    
                }
                
                
                var addPanel = document.createElement("div");
                addPanel.classList.add("mainPlan");
                addPanel.appendChild(nameSpan);
                addPanel.appendChild(costSpan);
                valuePanel.appendChild(addPanel);
                formPanel.appendChild(surchargePanel);
                
            }
            
            for (var i = 0; i < taxList.length; i++) {
                
                var surcharge = taxList[i];
                var nameSpan = document.createElement("span");
                nameSpan.classList.add("planName");
                nameSpan.textContent = surcharge.name;
                
                var costSpan = document.createElement("span");
                costSpan.classList.add("planPrice");
                if (parseInt(surcharge.taxValue) > 0) {
                    
                    costSpan.textContent = format.formatCost(surcharge.taxValue, currency);
                    
                }
                
                
                var addPanel = document.createElement("div");
                addPanel.classList.add("mainPlan");
                addPanel.appendChild(nameSpan);
                addPanel.appendChild(costSpan);
                valuePanel.appendChild(addPanel);
                formPanel.appendChild(surchargePanel);
                
            }
            
        }
        /**
        if(surchargeList.length > 0) {
            
            var valuePanel = surchargePanel.getElementsByClassName("value")[0];
            valuePanel.textContent = null;
            for (var i = 0; i < surchargeList.length; i++) {
                
                var surcharge = surchargeList[i];
                var nameSpan = document.createElement("span");
                nameSpan.classList.add("planName");
                nameSpan.textContent = surcharge.name;
                
                var costSpan = document.createElement("span");
                costSpan.classList.add("planPrice");
                if (parseInt(surcharge.taxValue) > 0) {
                    
                    costSpan.textContent = format.formatCost(surcharge.taxValue, currency);
                    
                }
                
                
                var addPanel = document.createElement("div");
                addPanel.classList.add("mainPlan");
                addPanel.appendChild(nameSpan);
                addPanel.appendChild(costSpan);
                valuePanel.appendChild(addPanel);
                formPanel.appendChild(surchargePanel);
                
            }
            
        }
        
        if(taxList.length > 0) {
            
            var valuePanel = taxePanel.getElementsByClassName("value")[0];
            valuePanel.textContent = null;
            for (var i = 0; i < taxList.length; i++) {
                
                var surcharge = taxList[i];
                var nameSpan = document.createElement("span");
                nameSpan.classList.add("planName");
                nameSpan.textContent = surcharge.name;
                
                var costSpan = document.createElement("span");
                costSpan.classList.add("planPrice");
                if (parseInt(surcharge.taxValue) > 0) {
                    
                    costSpan.textContent = format.formatCost(surcharge.taxValue, currency);
                    
                }
                
                
                var addPanel = document.createElement("div");
                addPanel.classList.add("mainPlan");
                addPanel.appendChild(nameSpan);
                addPanel.appendChild(costSpan);
                valuePanel.appendChild(addPanel);
                formPanel.appendChild(taxePanel);
                
            }
            
        }
        **/
        
    }
	
	