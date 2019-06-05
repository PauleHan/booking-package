/*globals I18n */
/*globals Booking_App_XMLHttp */
    
    function Booking_Package_Member(prefix, calendarAccount, setting, subscription, url, nonce, action, booking_package_dictionary) {
        
        this._i18n = new I18n(null);
        this._i18n.setDictionary(booking_package_dictionary);
        this._booking_package_dictionary = booking_package_dictionary;
        this._prefix = prefix;
        this._calendarAccount = calendarAccount;
        this._setting = setting;
        this._subscriptions = subscription;
        //this._subscriptions = null;
        this._url = url;
        this._nonce = nonce;
        this._action = action;
        this._function = {name: "root", post: {}};
        console.log(setting);
        
    }
    
    Booking_Package_Member.prototype.setFunction = function(name, post){
        
        this._function = {name: name, post: post};
        
    }
    
    Booking_Package_Member.prototype.getFunction = function(){
        
        return this._function;
        
    }
    
    Booking_Package_Member.prototype.setSubscription = function(subscriptions){
        
        this._subscriptions = subscriptions;
        
    }
    
    Booking_Package_Member.prototype.memberOperation = function(){
        
        var object = this;
        var calendarAccount = object._calendarAccount;
        var memberSetting = object._setting;
        var subscriptions = object._subscriptions;
        console.log(memberSetting);
        console.log(calendarAccount);
        console.log(subscriptions);
        
        if(parseInt(memberSetting.function_for_member) == 1){
            
            var user_status_field = document.getElementById("booking-package-user_status_field");
            user_status_field.textContent = null;
            user_status_field.classList.add("hidden_panel");
            
            var login = document.getElementById("booking-package-login");
            var logout = document.getElementById("booking-package-logout");
            var register = document.getElementById("booking-package-register");
            var edit = document.getElementById("booking-package-edit");
            var delete_button = document.getElementById("booking-package-edit_user_delete_button");
            var subscribed = document.getElementById("booking-package-subscribed");
            
            var login_form = document.getElementById("booking-package-loginform");
            var user_form = document.getElementById("booking-package-user-form");
            var subscription_form = document.getElementById("booking-package-subscription_form");
            var subscribed_panel = document.getElementById("booking-package-subscribed_panel");
            var booking_calendar = document.getElementById("booking-package");
            
            var login_submit = login_form.getElementsByClassName("login-submit")[0];
            var login_input = login_submit.getElementsByTagName("input");
            console.log(login_submit);
            for(var i = 0; i < login_input.length; i++){
                
                var input = login_input[i];
                if(input.type == "submit"){
                    
                    input.value = object._i18n.get("Sign in");
                    console.log(input);
                    console.log(object._booking_package_dictionary);
                    break;
                    
                }
                
            }
            
            
            
            var pluginName = document.getElementById(this._prefix + "pluginName");
            if(pluginName == null){
                
                pluginName = document.createElement("input");
                pluginName.id = this._prefix + "pluginName";
                pluginName.type = "hidden";
                pluginName.name = "puginName";
                pluginName.value = "booking-package";
                login_form.appendChild(pluginName);
                
            }
            
            
            
            
            
            
            
            if(parseInt(subscriptions.subscribed) == 1){
                
                subscription_form = null;
                //subscribed_panel = null;
                
            }
            
            if(subscriptions.status == 0){
                
                subscribed.classList.add("hidden_panel");
                subscribed = document.createElement("div");
                
            }
            
            var register_user_return_button = document.getElementById("booking-package-register_user_return_button");
            register_user_return_button.classList.remove("hidden_panel");
            register_user_return_button.onclick = function(){
                
                user_form.classList.add("hidden_panel");
                register.classList.remove("hidden_panel");
                if(parseInt(memberSetting.visitors_registration_for_member) == 1){
                    
                    login.classList.remove("hidden_panel");
                    login_form.classList.remove("loginform");
                    booking_calendar.classList.remove("hidden_panel");
                    if(parseInt(memberSetting.reject_non_membder) == 1){
                        
                        login.classList.add("hidden_panel");
                        login_form.classList.add("loginform");
                        
                    }
                    
                }else{
                    
                    login.classList.remove("hidden_panel");
                    booking_calendar.classList.remove("hidden_panel");
                    
                }
                
            }
            
            var edit_user_return_button = document.getElementById("booking-package-edit_user_return_button");
            edit_user_return_button.classList.remove("hidden_panel");
            edit_user_return_button.onclick = function(){
                
                if(subscription_form != null){
                    
                    
                    if(parseInt(subscriptions.subscribed) == 1){
                        
                        subscription_form.classList.add("hidden_panel");
                        booking_calendar.classList.remove("hidden_panel");
                        
                    }else{
                        
                        
                        subscription_form.classList.remove("hidden_panel");
                        
                    }
                    
                }
                
                var edit_form = document.getElementById("booking-package-user-edit-form");
                booking_calendar.classList.remove("hidden_panel");
                edit.classList.remove("hidden_panel");
                subscribed.classList.remove("hidden_panel");
                edit_form.classList.add("hidden_panel");
                
            }
            
            if(memberSetting.login == 1){
                
                login.classList.add("hidden_panel");
                logout.classList.remove("hidden_panel");
                register.classList.add("hidden_panel");
                edit.classList.remove("hidden_panel");
                subscribed.classList.remove("hidden_panel");
                
                var user_login = document.getElementById("booking-package-user_login");
                user_login.textContent = memberSetting.user_login;
                object._userInformation = memberSetting.value;
                
            }else{
                
                login.classList.remove("hidden_panel");
                logout.classList.add("hidden_panel");
                edit.classList.add("hidden_panel");
                subscribed.classList.add("hidden_panel");
                
                if(parseInt(memberSetting.visitors_registration_for_member) == 1){
                    
                    register.classList.remove("hidden_panel");
                    
                }else{
                    
                    register.classList.add("hidden_panel");
                    
                }
                
                if(parseInt(memberSetting.reject_non_membder) == 1){
                    
                    user_form.classList.add("hidden_panel");
                    booking_calendar.classList.add("hidden_panel");
                    booking_calendar.textContent = null;
                    login_form.classList.add("loginform");
                    login.classList.add("hidden_panel");
                    
                }else{
                    
                    /**
                    var login_submit = login_form.getElementsByClassName("login-submit");
                    console.log(login_submit);
                    if(login_submit.length > 0){
                        
                        login_submit = login_submit[0];
                        var login_return_button = document.createElement("button");
                        login_return_button.textContent = object._i18n.get("Retrun");
                        login_return_button.setAttribute("class", "button button-primary");
                        login_submit.appendChild(login_return_button);
                        console.log(login_submit);
                        login_return_button.onclick = function(){
                            
                            login_form.classList.remove("loginform");
                            login.classList.remove("hidden_panel");
                            booking_calendar.classList.remove("hidden_panel");
                            
                        }
                        
                    }
                    **/
                    
                }
                
            }
            
            if(memberSetting.activation != null && memberSetting.activation.status == "success"){
                
                login_form.classList.remove("hidden_panel");
                login_form.classList.add("loginform");
                booking_calendar.classList.add("hidden_panel");
                register.classList.add("hidden_panel");
                login.classList.add("hidden_panel");
                document.getElementById("user_login").textContent = memberSetting.activation.user_login;
                
            }
            
            var memberActionPanel = document.getElementById("booking-package-memberActionPanel");
            memberActionPanel.classList.remove("hidden_panel");
            
            login.onclick = function(){
                
                user_form.classList.add("hidden_panel");
                booking_calendar.classList.add("hidden_panel");
                login_form.classList.add("loginform");
                login.classList.add("hidden_panel");
                
                if(parseInt(memberSetting.visitors_registration_for_member) == 1){
                    
                    register.classList.remove("hidden_panel");
                    
                }else{
                    
                    register.classList.add("hidden_panel");
                    
                }
                
            }
            
            register.onclick = function(){
                
                user_form.classList.remove("hidden_panel");
                booking_calendar.classList.add("hidden_panel");
                login_form.classList.remove("loginform");
                login.classList.remove("hidden_panel");
                register.classList.add("hidden_panel");
                
            }
            
            if(memberSetting.login == 1){
                
                logout.onclick = function(){
                    
                    object.logout(login, logout, register, function(response){
                        
                    });
                    
                }
                
                edit.onclick = function(){
                    
                    var edit_form = document.getElementById("booking-package-user-edit-form");
                    var edit_user_button = document.getElementById("booking-package-edit_user_button");
                    
                    if(subscription_form != null){
                        
                        subscription_form.classList.add("hidden_panel");
                        
                    }
                    
                    console.log(subscribed_panel);
                    if(subscribed_panel != null){
                        
                        subscribed_panel.classList.add("hidden_panel");
                        
                    }
                    
                    booking_calendar.classList.add("hidden_panel");
                    subscribed.classList.add("hidden_panel");
                    edit.classList.add("hidden_panel");
                    
                    edit_form.classList.remove("hidden_panel");
                    
                    object.edit_form(memberActionPanel, edit_user_button, null, function(response){
                            
                        console.log(response);
                            
                    });
                    
                }
                
                delete_button.onclick = function(){
                    
                    object.delete_member();
                    
                }
                
                subscribed.onclick = function(){
                    
                    
                    booking_calendar.classList.add("hidden_panel");
                    object.subscribed_form(booking_calendar, function(response){
                        
                        
                        
                    });
                    
                }
                
            }
            
            var register_user_button = document.getElementById("booking-package-register_user_button");
            object.register_form(memberActionPanel, register_user_button, null, function(response){
                    
                console.log(response);
                
                    
            });
            
        }
        
    }
    
    Booking_Package_Member.prototype.subscribed_form = function(booking_calendar, callback){
        
        var object = this;
        var memberSetting = object._setting;
        var subscriptions = object._subscriptions;
        console.log(memberSetting);
        console.log(subscriptions);
        var subscription_form = document.getElementById("booking-package-subscription_form");
        var subscribed_panel = document.getElementById("booking-package-subscribed_panel");
        var return_button = document.getElementById("booking-package-subscribed_return_button");
        var edit = document.getElementById("booking-package-edit");
        var subscribed = document.getElementById("booking-package-subscribed");
        edit.classList.add("hidden_panel");
        subscribed.classList.add("hidden_panel");
        subscribed_panel.classList.remove("hidden_panel");
        subscription_form.classList.add("hidden_panel");
        
        var cost = new FORMAT_COST(object._i18n);
        var tbody = document.getElementById("booking-package-subscribed_items");
        tbody.textContent = null;
        var subscription_list = memberSetting.subscription_list;
        for(var key in subscription_list){
            
            var product = subscription_list[key];
            var items = product.items;
            var currency = null;
            var amount = 0;
            console.log(product);
            for(var i = 0; i < items.length; i++){
                
                var item = items[i];
                currency = item.currency;
                amount += parseInt(item.amount);
                console.log(item);
                
            }
            
            amount = cost.formatCost(amount, currency);
            
            var amountPanel = document.createElement("div");
            amountPanel.textContent = object._i18n.get("%s per month", [amount]);
            
            var expirationDate = document.createElement("div");
            expirationDate.textContent = object._i18n.get("Expiration date: %s", [product.period_end_date]);
            
            //You can reserve 5 more times by the expiration date.
            //You can make a reservation 5 times by the expiration date.
            
            var itemPanel = document.createElement("div");
            itemPanel.textContent = product.name;
            
            var itemTd = document.createElement("td");
            itemTd.appendChild(itemPanel);
            itemTd.appendChild(amountPanel);
            itemTd.appendChild(expirationDate);
            
            var deleteTd = document.createElement("td");
            deleteTd.setAttribute("data-key", key);
            deleteTd.setAttribute("style", "font-family: 'Material Icons' !important;");
            deleteTd.setAttribute("class", "material-icons delete_icon");
            deleteTd.textContent = "delete";
            
            var tr = document.createElement("tr");
            tr.id = object._prefix + key;
            tr.appendChild(itemTd);
            tr.appendChild(deleteTd);
            if(product.canceled != null && parseInt(product.canceled) == 1){
                
                tr.classList.add("canceled");
                deleteTd.setAttribute("style", "cursor: not-allowed; font-family: 'Material Icons' !important;");
                
            }
            
            
            tbody.appendChild(tr);
            
            deleteTd.onclick = function(){
                
                var deleteTd = this;
                var key = this.getAttribute("data-key");
                var product = subscription_list[key];
                console.log(product);
                if(product.canceled != null && parseInt(product.canceled) == 1){
                    
                    return null;
                    
                }
                
                if(window.confirm(object._i18n.get('If you cancel the "%s" subscription, you can not make a reservation after the deadline of %s. Do you really want to cancel the subscription?', [product.name, product.period_end_date]))){
                    
                    object.deleteSubscription(product, function(response){
                        
                        var tr = document.getElementById(object._prefix + key);
                        if(response.status == 1){
                            
                            subscription_list[key]['canceled'] = 1;
                            tr.classList.add("canceled");
                            deleteTd.setAttribute("style", "cursor: not-allowed; font-family: 'Material Icons' !important;");
                            
                        }else{
                            
                            tbody.removeChild(tr);
                            
                        }
                        
                    });
                    
                }
                
            }
            
        }
        
        
        return_button.onclick = function(){
            
            edit.classList.remove("hidden_panel");
            subscribed.classList.remove("hidden_panel");
            subscribed_panel.classList.add("hidden_panel");
            
            if(parseInt(subscriptions.subscribed) == 1){
                
                booking_calendar.classList.remove("hidden_panel");
                
            }else{
                
                subscription_form.classList.remove("hidden_panel");
                
                
            }
            
        }
        
    }
    
    Booking_Package_Member.prototype.deleteSubscription = function(product, callback){
        
        var object = this;
        var post = {mode: 'deleteSubscription', nonce: object._nonce, action: object._action, product: product.product};
        var bookingBlockPanel = document.getElementById("bookingBlockPanel");
        bookingBlockPanel.classList.remove("hidden_panel");
        new Booking_App_XMLHttp(object._url, post, false, function(response){
            
            console.log(response);
            if(parseInt(response.status) == 1){
                
                callback({stats: 1, error: null});
                
            }else{
                
                if(response.reload != null && parseInt(response.reload) == 1){
                    
                    window.location.reload();
                    
                }else{
                    
                    callback({stats: 0, error: response.error});
                    
                }
                
            }
            
            bookingBlockPanel.classList.add("hidden_panel");
            
        });
        
    }
    
    Booking_Package_Member.prototype.delete_member = function(){
        
        console.log("delete_member");
        var object = this;
        if(window.confirm(object._i18n.get("Do you really want to delete the license as a member?"))){
            
            var post = {mode: 'deleteUser', nonce: object._nonce, action: object._action};
            var bookingBlockPanel = document.getElementById("bookingBlockPanel");
            bookingBlockPanel.classList.remove("hidden_panel");
            new Booking_App_XMLHttp(object._url, post, false, function(response){
                
                console.log(response);
                if(response.status == "success"){
                    
                    window.location.reload();
                    
                }
                
                bookingBlockPanel.classList.add("hidden_panel");
                
            });
            
        }
        
    }
    
    Booking_Package_Member.prototype.edit_form = function(mainPanel, register_user_button, return_button, callback){
        
        var object = this;
        console.log(object._setting);
        var setting = object._setting;
        var edit_panel = document.getElementById("booking-package-user-edit-form");
        var user_login = document.getElementById("booking-package-user_edit_login");
        var user_email = document.getElementById("booking-package-user_edit_email");
        var user_pass = document.getElementById("booking-package-user_edit_pass");
        user_login.textContent = setting.user_login;
        
        var change_password_button = document.getElementById("booking-package-user_edit_change_password_button");
        change_password_button.onclick = function(){
            
            user_pass.classList.remove("hidden_panel");
            change_password_button.classList.add("hidden_panel");
            
        }
        
        register_user_button.onclick = function(){
            
            var updata = true;
            user_email.parentElement.classList.remove("errorPanel");
            user_pass.parentElement.classList.remove("errorPanel");
            if(!user_email.value.match(/.+@.+\..+/)){
                
                updata = false;
                user_email.parentElement.classList.add("errorPanel");
                
            }
            
            if(user_pass.value.length > 0 && user_pass.value.length < 8){
                
                updata = false;
                user_pass.parentElement.classList.add("errorPanel");
                
            }
            
            var post = {mode: 'updateUser', nonce: object._nonce, action: object._action, user_login: setting.user_login, accountKey: object._calendarAccount.key};
            if(document.getElementById("booking-package-permalink") != null){
                
                post.permalink = document.getElementById("booking-package-permalink").value;
                
            }
            
            console.log("updata = " + updata);
            if(updata == true){
                
                post.user_email = user_email.value;
                if(user_pass.value.length != 0){
                    
                    post.user_pass = user_pass.value;
                    
                }
                console.log(post);
                var bookingBlockPanel = document.getElementById("bookingBlockPanel");
                bookingBlockPanel.classList.remove("hidden_panel");
                new Booking_App_XMLHttp(object._url, post, false, function(response){
                    
                    console.log(response);
                    if(response.status == 'success'){
                        
                        bookingBlockPanel.classList.add("hidden_panel");
                        window.location.reload();
                        
                    }
                    
                });
                
            }
            
        }
        
    }
    
    Booking_Package_Member.prototype.register_form = function(mainPanel, register_user_button, return_button, callback){
        
        var object = this;
        console.log("register_form");
        var user_regist_error_message = document.getElementById("booking-package-user_regist_error_message");
        user_regist_error_message.classList.add("hidden_panel");
        user_regist_error_message.textContent = null;
        
        register_user_button.onclick = function(){
            
            var user_data = {
                user_login: document.getElementById("booking-package-user_login"),
                user_email: document.getElementById("booking-package-user_email"),
                user_pass: document.getElementById("booking-package-user_pass"),
            };
            
            var registering = true;
            var post = {mode: 'createUser', nonce: object._nonce, action: object._action, accountKey: object._calendarAccount.key};
            for(var key in user_data){
                
                var panel = user_data[key].parentElement;
                panel.classList.remove("errorPanel");
                console.log(panel);
                
                var value = user_data[key].value;
                post[key] = value;
                console.log(key + " = " + value);
                
                if(key == 'user_login' && (value.length < 4 || !value.match(/^[A-Za-z0-9.-_]*$/))){
                    
                    registering = false;
                    panel.classList.add("errorPanel");
                    console.error("error key = " + key + " value = " + value);
                    
                }
                
                if(key == 'user_email' && !value.match(/.+@.+\..+/)){
                    
                    registering = false;
                    panel.classList.add("errorPanel");
                    console.error("error key = " + key + " value = " + value);
                    
                }
                
                if(key == 'user_pass' && value.length < 8){
                    
                    registering = false;
                    panel.classList.add("errorPanel");
                    console.error("error key = " + key + " value = " + value);
                    
                }
                
            }
            
            if (document.getElementById("booking-package-permalink") != null) {
                
                post.permalink = document.getElementById("booking-package-permalink").value;
                
            }
            
            if (registering == true) {
                
                console.log(post);
                user_regist_error_message.textContent.textContent = null;
                var bookingBlockPanel = document.getElementById("bookingBlockPanel");
                bookingBlockPanel.classList.remove("hidden_panel");
                new Booking_App_XMLHttp(object._url, post, false, function(response){
                    
                    console.log(response);
                    bookingBlockPanel.classList.add("hidden_panel");
                    if (response.status == 'success') {
                        
                        window.location.reload();
                        
                    } else {
                        
                        user_regist_error_message.classList.remove("hidden_panel");
                        user_regist_error_message.textContent = response.error_messages;
                        //window.alert(response.error_messages);
                        
                    }
                    
                });
                
            }
            
        }
        
        if(return_button != null){
            
            return_button.onclick = function(){
                
                
                
            }
            
        }
        
        
    }
    
    Booking_Package_Member.prototype.logout = function(login, logout, register, callback){
        
        var object = this;
        var post = {mode: 'logout', nonce: object._nonce, action: object._action};
        console.log(post);
        var bookingBlockPanel = document.getElementById("bookingBlockPanel");
        bookingBlockPanel.classList.remove("hidden_panel");
        new Booking_App_XMLHttp(object._url, post, false, function(response){
            
            console.log(response);
            if(response.status == 'success'){
                
                window.location.reload();
                
            }
            
        });
        
    }
    
    Booking_Package_Member.prototype.isEmail = function(email){
        
        var mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
        var mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
        
        
    }