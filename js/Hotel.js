    function Hotel(currency, weekName, dateFormat, positionOfWeek, startOfWeek, booking_package_dictionary) {
        
        this._dayPanelList = {};
        this._currency = currency;
        this._callback = null;
        this._calendarAccount = null;
        this._checkDate = {checkIn: null, checkOut: null};
        this._scheduleKeys = {checkInKey: null, checkOutKey: null};
        this._scheduleList = {};
        this._guestsList = {};
        this._person = 0;
        this._startOfWeek = startOfWeek;
        this._feeList = {bookingFee: 0, additionalFee: 0};
        this._taxes = [];
        this._i18n = new I18n(booking_package_dictionary);
        this._i18n.setDictionary(booking_package_dictionary);
        this._calendar = new Booking_App_Calendar(weekName, dateFormat, positionOfWeek, startOfWeek, this._i18n);
        
        this._responseGuests = {status: false, person: 0, amount: 0, list: null};
        this._responseGuests = {status: false, booking: false, amount: 0, message: null, list: null, nights: 0, person: 0, additionalFee: 0, guests: false, requiredGuests: true, guestsList: null, adult: 0, children: 0, checkInKey: null, checkOutKey: null, taxes: {}};
        
    }
    
    Hotel.prototype.setCallback = function(callback){
        
        this._callback = callback;
        
    }
    
    Hotel.prototype.reset = function(){
        
        this._dayPanelList = {};
        this._guestsList = {};
        this._scheduleList = {};
        this._checkDate = {checkIn: null, checkOut: null};
        this._scheduleKeys = {checkInKey: null, checkOutKey: null};
        this._feeList = {bookingFee: 0, additionalFee: 0};
        this._responseGuests = {status: false, booking: false, amount: 0, message: null, list: null, nights: 0, person: 0, additionalFee: 0, guests: false, requiredGuests: true, guestsList: null, adult: 0, children: 0, checkInKey: null, checkOutKey: null, taxes: {}};
        
    }
    
    Hotel.prototype.setCalendarAccount = function(calendarAccount){
        
        this._calendarAccount = calendarAccount;
        console.log(this._calendarAccount);
        
    }
    
    Hotel.prototype.resetCheckDate = function(){
        
        this._checkDate = {checkIn: null, checkOut: null};
        this._scheduleKeys = {checkInKey: null, checkOutKey: null};
        
    }
    
    Hotel.prototype.setTaxes = function(taxes) {
        
        this._taxes = taxes;
        
    }
    
    Hotel.prototype.getTaxes = function() {
        
        return this._taxes;
        
    }
    
    Hotel.prototype.getCheckDate = function(){
        
        return this._checkDate;
        
    }
    
    Hotel.prototype.setCheckIn = function(schedule){
        
        console.log(schedule);
        this._checkDate.checkIn = schedule;
        
    }
    
    Hotel.prototype.setCheckOut = function(schedule){
        
        console.log(schedule);
        this._checkDate.checkOut = schedule;
        console.log(this._checkDate);
        
    }
    
    Hotel.prototype.setCheckInKey = function(key){
        
        this._scheduleKeys.checkInKey = key;
        
    }
    
    Hotel.prototype.setCheckOutKey = function(key){
        
        this._scheduleKeys.checkOutKey = key;
        
    }
    
    Hotel.prototype.setNights = function(nights){
        
        this._responseGuests.nights = nights;
        
    }
    
    Hotel.prototype.addSchedule = function(schedule){
        
        this._scheduleList[schedule.unixTime] = schedule;
        //console.log(this._scheduleList);
        
    }
    
    Hotel.prototype.setSchedule = function(scheduleList){
        
        for(var key in scheduleList){
            
            console.log(scheduleList[key]);
            
        }
        
    }
    
    Hotel.prototype.getSchedule = function(){
        
        return this._scheduleList;
        
    }
    
    Hotel.prototype.getDetails = function(){
        
        return this._responseGuests;
        
    }
    
    Hotel.prototype.pushCallback = function(){
        
        this._callback(this._responseGuests);
        
    }
    
    Hotel.prototype.setDayPanelList = function(list){
        
        this._dayPanelList = list;
        
    }
    
    Hotel.prototype.getDayPanelList = function(){
        
        return this._dayPanelList;
        
    }
    
    Hotel.prototype.verifySchedule = function(verification){
        
        //var response = {status: false, amount: 0, message: null, list: null, nights: 0, person: 0, additionalFee: 0, guestsList: null, guests: false};
        var checkIn = this._checkDate.checkIn;
        var checkOut = this._checkDate.checkOut;
        var scheduleList = this._scheduleList;
        console.log("verification = " + verification);
        console.log(Object.keys(this._guestsList).length);
        console.log(this._checkDate);
        if(Object.keys(this._guestsList).length > 0){
            
            this._responseGuests.guests = true;
            
        }else{
            
            this._responseGuests.booking = true;
            
        }
        
        console.log(this._responseGuests);
        this._responseGuests.amount = 0;
        if(checkIn == null || checkOut == null){
            
            this._responseGuests.status = false;
            this._responseGuests.list = null;
            this._responseGuests.nights = 0;
            this._responseGuests.checkInKey = null;
            this._responseGuests.checkOutKey = null;
            if(this._callback != null){
                
                this._callback(this._responseGuests);
                
            }
            return this._responseGuests;
            
        }
        
        console.log(scheduleList);
        var list = {};
        for(var key in scheduleList){
            
            var schedule = scheduleList[key];
            if(parseInt(checkIn.unixTime) <= parseInt(schedule.unixTime) && parseInt(checkOut.unixTime) > parseInt(schedule.unixTime) && verification == true){
                
                console.log(schedule);
                this._responseGuests.amount += parseInt(schedule.cost);
                list[key] = schedule;
                if((schedule.stop == "true" || parseInt(schedule.remainder) <= 0) && verification == true){
                    
                    this._checkDate.checkOut = null;
                    this._responseGuests.status = false;
                    this._responseGuests.amount = 0;
                    this._responseGuests.list = null;
                    this._responseGuests.nights = 0;
                    this._responseGuests.checkInKey = null;
                    this._responseGuests.checkOutKey = null;
                    this._responseGuests.taxes = {};
                    return this._responseGuests;
                    
                }
                
            }else if(verification == false){
                
                console.log(schedule);
                this._responseGuests.amount += parseInt(schedule.cost);
                list[key] = schedule;
                
            }
            
        }
        
        console.log(list);
        
        var schedulekeys = this._scheduleKeys;
        this._responseGuests.list = list;
        this._responseGuests.nights = Object.keys(list).length;
        this._responseGuests.status = true;
        this._responseGuests.checkInKey = schedulekeys.checkInKey;
        this._responseGuests.checkOutKey = schedulekeys.checkOutKey;
        /**
        response.booking = this._responseGuests.booking;
        response.person = this._responseGuests.person;
        response.guestsList = this._responseGuests.guestsList;
        response.adult = this._responseGuests.adult;
        response.children = this._responseGuests.children;
        response.additionalFee = this._responseGuests.amount;
        this._responseGuests = response;
        **/
        //this._responseGuests = {status: false, person: 0, amount: 0, list: null};
        this._feeList.bookingFee = this._responseGuests.amount;
        if(this._callback != null){
            
            this._callback(this._responseGuests);
            
        }
        
        return this._responseGuests;
        
    }
    
    Hotel.prototype.getFeeList = function(){
        
        return this._feeList;
        
    }
    
    Hotel.prototype.addGuests = function(key, guests){
        
        this._guestsList[key] = guests;
        
    }
    
    Hotel.prototype.getGuestsList = function(){
        
        return this._guestsList;
        
    }
    
    Hotel.prototype.setGuests = function(key, index, person){
        
        console.log("key " + key + " index = " + index + " person = " + person);
        console.log(this._calendarAccount);
        /**
        var response = {status: false, person: 0, amount: 0, list: null};
        this._responseGuests = response;
        **/
        if(this._guestsList[key] != null){
            
            this._guestsList[key].index = parseInt(index);
            this._guestsList[key].person = parseInt(person);
            console.log(this._guestsList);
            //var guests = [];
            var requiredGuests = true;
            var guests = {};
            var adult = 0;
            var children = 0;
            var amount = 0;
            var person = 0;
            for(var key in this._guestsList){
                
                console.log(this._guestsList[key]);
                //var list = JSON.parse(this._guestsList[key].json);
                var list = this._guestsList[key].json;
                if(typeof this._guestsList[key].json == 'string'){
                    
                    list = JSON.parse(this._guestsList[key].json);
                    
                }
                var index = parseInt(this._guestsList[key].index);
                //guests.push(list[index]);
                guests[this._guestsList[key].key] = list[index];
                amount += parseInt(list[index].price);
                person += parseInt(this._guestsList[key].person);
                
                if(parseInt(this._guestsList[key].required) == 1 && this._guestsList[key].index == 0){
                    
                    requiredGuests = false;
                    
                }
                
                if(this._guestsList[key].target == 'adult'){
                    
                    adult += parseInt(this._guestsList[key].person);
                    
                }else{
                    
                    children += parseInt(this._guestsList[key].person);
                    
                }
                
            }
            
            //var list = this._responseGuests.list;
            
            this._responseGuests.status = true;
            this._responseGuests.requiredGuests = requiredGuests;
            this._responseGuests.additionalFee = amount;
            this._responseGuests.person = person;
            this._responseGuests.guestsList = guests;
            this._responseGuests.adult = adult;
            this._responseGuests.children = children;
            this._feeList.additionalFee = amount;
            var totalPerson = adult;
            if(parseInt(this._calendarAccount.includeChildrenInRoom) == 1){
                
                totalPerson += children;
                
            }
            console.log("totalPerson = " + totalPerson);
            
            if(totalPerson > 0 && totalPerson <= parseInt(this._calendarAccount.numberOfPeopleInRoom)){
                
                this._responseGuests.booking = true;
                
            }else{
                
                this._responseGuests.booking = false;
                
            }
            
            
            console.log(this._calendarAccount);
            console.log(this._responseGuests);
            console.log(this._feeList);
            console.log(this._responseGuests);
            
            
            return this._responseGuests;
            
        }else{
            
            this._responseGuests.status = false;
            return this._responseGuests;
            
        }
        
    }
    
    Hotel.prototype.showSummary = function(summaryListPanel, expressionsCheck){
        
        var object = this;
        object._calendar.setShortWeekNameBool(true);
        
        var format = new FORMAT_COST();
        
        var visitorsDetails = this._responseGuests;
        summaryListPanel.textContent = null;
        console.log(summaryListPanel);
        console.log(visitorsDetails);
        
        if(expressionsCheck != null && typeof expressionsCheck == 'object'){
            
            console.log(expressionsCheck);
            var checkDate = object.getCheckDate();
            console.log(checkDate);
            
            var checkInTitlePanel = document.createElement("div");
            checkInTitlePanel.classList.add("summaryTitle");
            checkInTitlePanel.textContent = expressionsCheck.arrival + " :";
            summaryListPanel.insertAdjacentElement("beforeend", checkInTitlePanel);
            
            var checkInValuePanel = document.createElement("div");
            var checkInValue = object._i18n.get("None");
            if(checkDate.checkIn != null){
                
                checkInValue = object._calendar.formatBookingDate(checkDate.checkIn.month, checkDate.checkIn.day, checkDate.checkIn.year, null, null, null, checkDate.checkIn.weekKey);
                
            }
            checkInValuePanel.textContent = checkInValue;
            checkInValuePanel.classList.add("summaryValue");
            summaryListPanel.insertAdjacentElement("beforeend", checkInValuePanel);
            
            var checkOutTitlePanel = document.createElement("div");
            checkOutTitlePanel.classList.add("summaryTitle");
            checkOutTitlePanel.textContent = expressionsCheck.departure + " :";
            summaryListPanel.insertAdjacentElement("beforeend", checkOutTitlePanel);
            
            var checkOutValuePanel = document.createElement("div");
            var checkOutValue = object._i18n.get("None");
            if(checkDate.checkOut != null){
                
                checkOutValue = object._calendar.formatBookingDate(checkDate.checkOut.month, checkDate.checkOut.day, checkDate.checkOut.year, null, null, null, checkDate.checkOut.weekKey);
                
            }
            checkOutValuePanel.textContent = checkOutValue;
            checkOutValuePanel.classList.add("summaryValue");
            summaryListPanel.insertAdjacentElement("beforeend", checkOutValuePanel);
            
        }
        
        var nightsValue = document.createElement("div");
        nightsValue.classList.add("summaryValue");
        nightsValue.classList.add("totalLengthOfStayLabel");
        nightsValue.textContent = visitorsDetails.nights + " " + object._i18n.get("nights") + " (" + format.formatCost(visitorsDetails.amount, object._currency) + ")";
        if(visitorsDetails.nights == 1){
            
            nightsValue.textContent = visitorsDetails.nights + " " + object._i18n.get("night") + " (" + format.formatCost(visitorsDetails.amount, object._currency) + ")";
            
        }else if(visitorsDetails.nights == 0){
            
            nightsValue.classList.remove("totalLengthOfStayLabel");
            nightsValue.textContent = "No past schedule was found";
            
        }
        
        var totalLengthOfStay = document.createElement("div");
        totalLengthOfStay.classList.add("summaryTitle");
        totalLengthOfStay.textContent = object._i18n.get("Total length of stay") + " :";
        summaryListPanel.insertAdjacentElement("beforeend", totalLengthOfStay);
        summaryListPanel.insertAdjacentElement("beforeend", nightsValue);
        
        
        var scheduleListPanel = document.createElement("div");
        scheduleListPanel.classList.add("hidden_panel");
        scheduleListPanel.classList.add("list");
        summaryListPanel.appendChild(scheduleListPanel);
        for(var key in visitorsDetails.list){
            
            var schedule = visitorsDetails.list[key];
            var date = object._calendar.formatBookingDate(schedule.month, schedule.day, schedule.year, null, null, null, schedule.weekKey);
            console.log(date);
            var schedulePanel = document.createElement("div");
            schedulePanel.classList.add("stayAndGuestsPanel");
            schedulePanel.textContent = date + " : " + format.formatCost(schedule.cost, object._currency);
            scheduleListPanel.insertAdjacentElement("beforeend", schedulePanel);
            
        }
        
        var showTotalLengthOfStay = false;
        nightsValue.onclick = function(){
            
            if(showTotalLengthOfStay == false){
                
                scheduleListPanel.classList.remove("hidden_panel");
                showTotalLengthOfStay = true;
                
            }else{
                
                scheduleListPanel.classList.add("hidden_panel");
                showTotalLengthOfStay = false;
            }
            
            
        }
        
        
        if(visitorsDetails.person > 0){
            
            var person = visitorsDetails.person + " " + object._i18n.get("person");
            if(visitorsDetails.person > 1){
                
                person = visitorsDetails.person + " " + object._i18n.get("people");
                
            }
            
            if(visitorsDetails.additionalFee > 0){
                
                person += " (" + format.formatCost((visitorsDetails.additionalFee * visitorsDetails.nights), object._currency) + ")";
                
            }
            
            var personPanel = document.createElement("label");
            personPanel.classList.add("summaryValue");
            personPanel.classList.add("totalLengthOfStayLabel");
            personPanel.textContent = person;
            
            var totalNumberOfGuestsPanel = document.createElement("div");
            totalNumberOfGuestsPanel.classList.add("summaryTitle");
            totalNumberOfGuestsPanel.textContent = object._i18n.get("Total number of guests") + " :";
            summaryListPanel.insertAdjacentElement("beforeend", totalNumberOfGuestsPanel);
            summaryListPanel.insertAdjacentElement("beforeend", personPanel);
            
            
            var guestsListPanel = document.createElement("div");
            guestsListPanel.classList.add("hidden_panel");
            guestsListPanel.classList.add("list");
            summaryListPanel.appendChild(guestsListPanel);
            for(var key in object._guestsList){
                
                var guests = object._guestsList[key];
                console.log(guests);
                var list = this._guestsList[key].json;
                if(typeof guests.json == 'string'){
                    
                    list = JSON.parse(guests.json);
                    
                }
                
                if(visitorsDetails.guestsList[guests.key] != null && parseInt(visitorsDetails.guestsList[guests.key].number) > 0){
                    
                    var price = "";
                    var nightLabel = visitorsDetails.nights + " " + object._i18n.get("nights");
                    if(parseInt(visitorsDetails.guestsList[guests.key].price) > 0){
                        
                        if(visitorsDetails.nights == 1){
                            
                            nightLabel = visitorsDetails.nights + " " + object._i18n.get("night");
                            
                        }
                        
                        price = " (" + format.formatCost(parseInt(visitorsDetails.guestsList[guests.key].price), object._currency) + " × " + nightLabel + ")";
                        
                    }
                    
                    var guestsPanel = document.createElement("div");
                    guestsPanel.classList.add("stayAndGuestsPanel");
                    guestsPanel.textContent = guests.name + " : " + visitorsDetails.guestsList[guests.key].name + price;
                    guestsListPanel.insertAdjacentElement("beforeend", guestsPanel);
                    
                }
                
            }
            
            var showGuestsListPanel = false;
            personPanel.onclick = function(){
                
                if(showGuestsListPanel == false){
                    
                    guestsListPanel.classList.remove("hidden_panel");
                    showGuestsListPanel = true;
                    
                }else{
                    
                    guestsListPanel.classList.add("hidden_panel");
                    showGuestsListPanel = false;
                    
                }   
                
            }
            
        }
        
        console.log(visitorsDetails);
        console.log(object._taxes);
        var taxes = object._taxes;
        var taxesDetails = new TAXES(object._i18n);
        taxesDetails.setTaxes(taxes);
        for (var key in taxes) {
            
            var taxValue = 0;
            var tax = taxes[key];
            console.log(tax);
            if (tax.active != 'true') {
                
                continue;
                
            }
            
            /**
            var value = parseInt(tax.value);
            if (tax.method == 'multiplication') {
                
                value = parseFloat(tax.value);
                
            }
            
            console.log(value);
            
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
            **/
            
            taxValue = taxesDetails.getTaxValue(key, 'hotel', visitorsDetails);
            tax.taxValue = taxValue;
            visitorsDetails.taxes[key] = tax;
            console.log("taxValue = " + tax.taxValue);
            
            var taxNamePanel = document.createElement("div");
            taxNamePanel.classList.add("summaryTitle");
            taxNamePanel.textContent = tax.name + " :";
            
            var taxValuePanel = document.createElement("div");
            taxValuePanel.classList.add("summaryValue");
            taxValuePanel.textContent = format.formatCost(parseInt(tax.taxValue), object._currency);
            
            summaryListPanel.insertAdjacentElement("beforeend", taxNamePanel);
            summaryListPanel.insertAdjacentElement("beforeend", taxValuePanel);
            
        }
        
        
        
        
    }
    
    
