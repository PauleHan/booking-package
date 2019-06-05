/*globals scriptError */
/*globals I18n */
/*globals Booking_App_XMLHttp */
/*globals FORMAT_COST */
/*globals setting_data */
/*globals users_data */
/*globals booking_package_dictionary */

window.addEventListener('load', function(){
    
    console.log(users_data);
    new Member_manage(setting_data, users_data, booking_package_dictionary);
    
});

/**
window.onload = function(){
    
    console.log(users_data);
    new Member_manage(setting_data, users_data, booking_package_dictionary);
    
}
**/

window.onerror = function(msg, url, line, col, error){
    
    var script_error = new scriptError(setting_data, booking_package_dictionary, msg, url, line, col, error);
    script_error.send();
    
}

function Member_manage(setting_data, users_data, booking_package_dictionary){
    
    var object = this;
    this._i18n = new I18n(null);
    this._i18n.setDictionary(booking_package_dictionary);
    this._url = setting_data.url;
    this._nonce = setting_data.nonce;
    this._action = setting_data.action;
    this._isExtensionsValid = parseInt(setting_data.isExtensionsValid);
    this._limit = parseInt(setting_data.limit);
    this._offset = 0;
    this._blockPanel = document.getElementById("blockPanel");
    this._loadingPanel = document.getElementById("loadingPanel");
    this._usersInfo = users_data;
    this._users = {};
    this._authority = "user";
    this._keywords = null;
    
    var user_form_close = document.getElementById("booking-package-register_user_return_button");
    var user_edit_form_close = document.getElementById("booking-package-edit_user_return_button");
    user_form_close.classList.remove("hidden_panel");
    user_edit_form_close.classList.remove("hidden_panel");
    
    this._member_list_table_list = document.getElementById("member_list_table").getElementsByTagName("tr");
    console.log(this._member_list_table_list);
    for(var i = 0; i < this._member_list_table_list.length; i++){
        
        var tr = this._member_list_table_list[i];
        if(tr.id.length == 0){
            
            continue;
            
        }
        
        this._users[tr.id] = tr;
        console.log(tr);
        
    }
    
    user_form_close.onclick = function(){
        
        object._blockPanel.classList.add("hidden_panel");
        document.getElementById("booking-package-user-form").classList.add("hidden_panel");
        document.getElementById("booking-package-user-edit-form").classList.add("hidden_panel");
        
    }
    
    user_edit_form_close.onclick = function(){
        
        object._blockPanel.classList.add("hidden_panel");
        document.getElementById("booking-package-user-form").classList.add("hidden_panel");
        document.getElementById("booking-package-user-edit-form").classList.add("hidden_panel");
        
    }
    
    var add_member = document.getElementById("add_member");
    if(parseInt(this._isExtensionsValid) == 1){
        
        add_member.onclick = function(){
            
            object.userForm();
            
        }
        
    }else{
        
        add_member.disabled = true;
        
    }
    
    
    this._blockPanel.onclick = function(event){
        
        var close = true;
        console.log(event);
        var path = event.path;
        if(path != null){
            
            for(var i = 0; i < path.length; i++){
                
                if(path[i].id == "booking-package-user-form" || path[i].id == "booking-package-user-edit-form"){
                    
                    close = false;
                    break;
                    
                }
                
            }
            
            if(close == true){
                
                this.classList.add("hidden_panel");
                document.getElementById("booking-package-user-form").classList.add("hidden_panel");
                document.getElementById("booking-package-user-edit-form").classList.add("hidden_panel");
                
            }
            
        }
        
    }
    
    var member_limit = document.getElementById("member_limit");
    for(var i = 0; i < member_limit.options.length; i++){
        
        var option = parseInt(member_limit[i].value);
        if(option == this._limit){
            
            member_limit[i].selected = true;
            break;
            
        }
        
    }
    
    var swich_authority = document.getElementById("swich_authority");
    swich_authority.onchange = function(){
        
        var swich_authority = this;
        var value = swich_authority.value;
        console.log(value);
        object._authority = value;
        object._offset = 0;
        var index = member_limit.selectedIndex;
        var limit = member_limit.options[index].value;
        object.movePage("before_page", limit, null);
        
    }
    
    document.getElementById("before_page").onclick = function(){
        
        var index = member_limit.selectedIndex;
        var limit = member_limit.options[index].value;
        object.movePage("before_page", limit, null);
        
    }
    
    document.getElementById("next_page").onclick = function(){
        
        var index = member_limit.selectedIndex;
        var limit = member_limit.options[index].value;
        object.movePage("next_page", limit, null);
        
    }
    
    this.loadingPanel(0);
    console.log(this._users);
    this.start();
    this.lookingForUsers(member_limit.options[member_limit.selectedIndex].value);
    
}

Member_manage.prototype.loadingPanel = function(mode){
    
    if(mode == 1){
        
        this._loadingPanel.setAttribute("class", "loading_modal_backdrop");
        
    }else{
        
        this._loadingPanel.setAttribute("class", "hidden_panel");
        
    }
    
}

Member_manage.prototype.setUsersInfo = function(userInfo){
    
    this._usersInfo = userInfo;
    
}

Member_manage.prototype.getUsersInfo = function(){
    
    return this._usersInfo;
    
}

Member_manage.prototype.serachUser = function(id){
    
    if(this._usersInfo[id] != null){
        
        return this._usersInfo[id];
        
    }else {
        
        return 0;
        
    }
    
}

Member_manage.prototype.setUsers = function(users){
    
    this._users = users;
    
}

Member_manage.prototype.getUsers = function(){
    
    return this._users;
    
}

Member_manage.prototype.setKeywords = function(keywords) {
    
    this._keywords = keywords;
    
}

Member_manage.prototype.getKeywords = function() {
    
    return this._keywords;
    
}

Member_manage.prototype.start = function(){
    
    var object = this;
    var user_form = document.getElementById("booking-package-user-form");
    var user_edit_form = document.getElementById("booking-package-user-edit-form");
    
    
    
    var users = object.getUsers();
    for(var key in users){
        
        var user = users[key];
        user.onclick = function(){
            
            console.log(this);
            var id = this.id;
            var userInfo = object.serachUser(id);
            console.log(userInfo);
            if(userInfo != 0){
                
                object.editForm(this, userInfo);
                object._blockPanel.classList.remove("hidden_panel");
                user_edit_form.classList.remove("hidden_panel");
                
            }
            
            
        }
        
    }
    
    
}

Member_manage.prototype.movePage = function(page, number, keywords){
    
    console.log(page + " " + number);
    var object = this;
    var offset = object._offset;
    number = parseInt(number);
    if(page == 'before_page'){
        
        if(offset > 0){
            
            offset = offset - object._limit;
            
        }
        
    }else if(page == "next_page"){
        
        offset = offset + object._limit;
        
    }
    
    console.log("offset = " + offset);
    
    object.loadingPanel(1);
    var user_edit_form = document.getElementById("booking-package-user-edit-form");
    var member_list_table = document.getElementById("member_list_table");
    var member_list_tbody = document.getElementById("member_list_tbody");
    var post = {mode: 'getMembers', nonce: object._nonce, action: object._action, page: page, number: number, offset: offset, authority: object._authority};
    keywords = object.getKeywords();
    if (keywords != null && keywords.length > 0) {
        
        post.keywords = keywords;
        
    }
    
    new Booking_App_XMLHttp(object._url, post, false, function(new_users){
        
        if(new_users.status == null && new_users.length != 0){
            
            if(page != null){
                
                object._limit = number;
                object._offset = offset;
                
            }
            
            var users = object.getUsers();
            console.log(users);
            for(var key in users){
                
                var user = users[key];
                console.log(user);
                user.textContent = null;
                member_list_tbody.removeChild(user);
                
                
            }
            
            var userInfoList = {};
            var userList = {};
            for(var i = 0; i < new_users.length; i++){
                
                var user = new_users[i];
                userInfoList["user_id_" + user.ID] = user;
                
                var tr = document.createElement("tr");
                tr.id = "user_id_" + user.ID;
                tr.classList.add("tr_user");
                
                var tdId = document.createElement("td");
                //tdId.textContent = user.ID;
                
                var idSpan = document.createElement("span");
                idSpan.textContent = user.ID;
                idSpan.classList.add("userId");
                tdId.appendChild(idSpan);
                if(parseInt(user.status) == 0){
                    
                    var priority_highSpan = document.createElement("span");
                    priority_highSpan.textContent = "priority_high";
                    priority_highSpan.setAttribute("class", "material-icons priority_high");
                    tdId.appendChild(priority_highSpan);
                    
                }
                tr.appendChild(tdId);
                
                
                var tdName = document.createElement("td");
                tdName.textContent = user.user_login;
                tr.appendChild(tdName);
                
                var tdEmail = document.createElement("td");
                tdEmail.textContent = user.user_email;
                tr.appendChild(tdEmail);
                
                var tdDate = document.createElement("td");
                tdDate.textContent = user.user_registered;
                tr.appendChild(tdDate);
                
                member_list_tbody.appendChild(tr);
                userList["user_id_" + user.ID] = tr;
                tr.onclick = function(){
                    
                    var id = this.id;
                    var userInfo = object.serachUser(id);
                    console.log(userInfo);
                    if(userInfo != 0){
                        
                        object.editForm(this, userInfo);
                        object._blockPanel.classList.remove("hidden_panel");
                        user_edit_form.classList.remove("hidden_panel");
                        
                    }
                    
                }
                
            }
            
            object.setUsersInfo(userInfoList);
            object.setUsers(userList);
            
        }
        
        object.loadingPanel(0);
        
    });
    
    
};

Member_manage.prototype.lookingForUsers = function(number) {
    
    var object = this;
    var offset = 0;
    var search_users_text = document.getElementById("search_users_text");
    var search_user_button = document.getElementById("search_user_button");
    var clear_user_button = document.getElementById("clear_user_button");
    var input_bool = true;
    if (search_users_text == null) {
        
        return false;
        
    }
    
    
    search_users_text.onkeydown = function(event) {
        
        console.log(event.key);
        var text = this;
        if (event.key != null && event.key.toLocaleLowerCase() == 'enter') {
            
            send(text);
            
        }
        
    };
    
    search_user_button.onclick = function() {
        
        send(search_users_text);
        
    };
    
    clear_user_button.onclick = function() {
        
        search_users_text.value = null;
        var member_limit = document.getElementById("member_limit");
        var index = member_limit.selectedIndex;
        var limit = member_limit.options[index].value;
        object._offset = 0;
        object.setKeywords(null);
        object.movePage(null, limit, null);
        
    }
    
    function send(text) {
        
        var keywords = text.value;
        keywords = keywords.replace(/[\u{20}\u{3000}]/ug ,' ');
        keywords = keywords.replace(/[\x20\u3000]/g ,' ');
        keywords = keywords.trim(keywords);
        if (keywords.length == 0) {
            
            object.setKeywords(null);
            return null;
            
        } else {
            
            var member_limit = document.getElementById("member_limit");
            var index = member_limit.selectedIndex;
            var limit = member_limit.options[index].value;
            object._offset = 0;
            object.setKeywords(keywords);
            object.movePage(null, limit, keywords);
            
        }
        console.log(number);
        console.log(keywords);
        
        /**
        var post = {mode: 'getMembers', nonce: object._nonce, action: object._action, page: 0, number: number, offset: offset, authority: object._authority, keyword: keywords};
        new Booking_App_XMLHttp(object._url, post, false, function(new_users){
            
            console.log(new_users);
            
        });
        **/
        
    };
    
};

Member_manage.prototype.editForm = function(tr, user){
    
    console.log(user);
    var object = this;
    var tabFrame = document.getElementById("booking-package-tabFrame");
    var user_profile_tab = document.getElementById("booking-package-user_profile_tab");
    var user_subscribed_tab = document.getElementById("booking-package-user_subscribed_tab");
    var user_profile = document.getElementById("booking-package-user-profile");
    var user_subscribed = document.getElementById("booking-package-user-subscribed");
    var user_subscribed_tbody = document.getElementById("booking-package-user_subscribed_tbody");
    
    var user_edit_form = document.getElementById("booking-package-user-edit-form");
    var user_login = document.getElementById("booking-package-user_edit_login");
    var user_email = document.getElementById("booking-package-user_edit_email");
    var user_status = document.getElementById("booking-package-user_edit_status");
    var user_pass = document.getElementById("booking-package-user_edit_pass");
    var user_pass_change_button = document.getElementById("booking-package-user_edit_change_password_button");
    var upload_button = document.getElementById("booking-package-edit_user_button");
    var delete_button = document.getElementById("booking-package-edit_user_delete_button");
    var user_form_close = document.getElementById("booking-package-edit_user_return_button");
    var user_edit_form_close = document.getElementById("booking-package-edit_user_delete_button");
    
    tabFrame.classList.remove("hidden_panel");
    user_profile_tab.classList.add("active");
    user_subscribed_tab.classList.remove("active");
    user_profile.classList.remove("hidden_panel");
    user_subscribed.classList.add("hidden_panel");
    user_form_close.classList.remove("hidden_panel");
    user_edit_form_close.classList.remove("hidden_panel");
    
    user_pass_change_button.setAttribute("class", "w3tc-button-save button-primary");
    upload_button.setAttribute("class", "w3tc-button-save button-primary sendButton");
    user_pass.classList.add("hidden_panel");
    user_pass_change_button.classList.remove("hidden_panel");
    
    delete_button.setAttribute("class", "w3tc-button-save button-primary return_button");
    
    var tabs = {user_profile_tab: {tab: user_profile_tab, panel: user_profile, options: [upload_button, delete_button]}, user_subscribed_tab: {tab: user_subscribed_tab, panel: user_subscribed, options: []}};
    for(var key in tabs){
        
        var menu = tabs[key];
        menu.tab.onclick = function(){
            
            var id = this.id;
            console.log(id);
            for(var key in tabs){
                
                var menu = tabs[key];
                var options = menu.options;
                if(menu.tab.id == id){
                    
                    menu.tab.classList.add("active");
                    menu.panel.classList.remove("hidden_panel");
                    for(var i = 0; i < options.length; i++){
                        
                        options[i].classList.remove("hidden_panel");
                        
                    }
                    
                }else{
                    
                    menu.tab.classList.remove("active");
                    menu.panel.classList.add("hidden_panel");
                    for(var i = 0; i < options.length; i++){
                        
                        options[i].classList.add("hidden_panel");
                        
                    }
                    
                }
                
            }
            
        }
        
    }
    
    user_login.value = user.user_login;
    user_email.value = user.user_email;
    if(parseInt(user.status) == 1){
        
        user_status.checked = true;
        
    }else{
        
        user_status.checked = false;
        
    }
    
    user_subscribed_tbody.textContent = null;
    var cost = new FORMAT_COST(object._i18n);
    var subscription_list = user.subscription_list;
    if(subscription_list == null){
        
        subscription_list = {};
        
    }
    console.log(subscription_list);
    if(Object.keys(subscription_list).length == 0){
        
        user_subscribed_tbody.textContent = object._i18n.get("There are no items subscribed.");
        
    }
    
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
        deleteTd.setAttribute("style",  "font-family: 'Material Icons' !important;");
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
        
        
        user_subscribed_tbody.appendChild(tr);
        
        deleteTd.onclick = function(){
            
            var deleteTd = this;
            var key = this.getAttribute("data-key");
            var product = subscription_list[key];
            console.log(product);
            if(product.canceled != null && parseInt(product.canceled) == 1){
                
                return null;
                
            }
            
            if(window.confirm(object._i18n.get('If you cancel the "%s" subscription, you can not make a reservation after the deadline of %s. Do you really want to cancel the subscription?', [product.name, product.period_end_date]))){
                
                deleteSubscription(user, product, function(response){
                    
                    var tr = document.getElementById(object._prefix + key);
                    if(response.status == 1){
                        
                        subscription_list[key]['canceled'] = 1;
                        tr.classList.add("canceled");
                        deleteTd.setAttribute("style", "cursor: not-allowed; font-family: 'Material Icons' !important;");
                        
                    }else{
                        
                        window.alert(response.error);
                        delete subscription_list[key];
                        user_subscribed_tbody.removeChild(tr);
                        
                    }
                    
                });
                
            }
            
        }
        
    }
    
    var deleteSubscription = function(user, product, callback){
        
        console.log(user);
        console.log(product);
        
        var post = {mode: 'deleteSubscription', nonce: object._nonce, action: object._action, userId: user.ID, product: product.product};
        console.log(post);
        
        object.loadingPanel(1);
        new Booking_App_XMLHttp(object._url, post, false, function(response){
            
            console.log(response);
            if(parseInt(response.status) == 1){
                
                callback({stats: 1, error: null});
                
            }else{
                
                callback({stats: 0, error: response.error});
                
            }
            
            object.loadingPanel(0);
            
        });
        
    }
    
    user_pass_change_button.onclick = function(event){
        
        user_pass.classList.remove("hidden_panel");
        user_pass_change_button.classList.add("hidden_panel");
        
    }
    
    upload_button.onclick = function(event){
        
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
        
        var post = {mode: 'updateUser', nonce: object._nonce, action: object._action, user_login: user.user_login};
        if(user_status.checked == true){
            
            post.status = 1;
            
        }else{
            
            post.status = 0;
            
        }
        
        
        if(updata == true){
            
            post.user_email = user_email.value;
            if(user_pass.value.length != 0){
                
                post.user_pass = user_pass.value;
                
            }
            console.log(post);
            
            object.loadingPanel(1);
            new Booking_App_XMLHttp(object._url, post, false, function(response){
                
                console.log(response);
                if(response.status == 'success'){
                    
                    user.user_email = post.user_email;
                    user.status = post.status;
                    tr.textContent = null;
                    var tdList = ["ID", "user_login", "user_email", "user_registered"];
                    for(var i = 0; i < tdList.length; i++){
                        
                        var td = document.createElement("td");
                        if(tdList[i] == "ID"){
                            
                            var idSpan = document.createElement("span");
                            idSpan.textContent = user[tdList[i]];
                            idSpan.classList.add("userId");
                            td.appendChild(idSpan);
                            if(parseInt(user.status) == 0){
                                
                                var priority_highSpan = document.createElement("span");
                                priority_highSpan.textContent = "priority_high";
                                priority_highSpan.setAttribute("class", "material-icons priority_high");
                                td.appendChild(priority_highSpan);
                                
                            }
                            
                        }else{
                            
                            td.textContent = user[tdList[i]];
                            
                        }
                        
                        //td.textContent = user[tdList[i]];
                        tr.appendChild(td);
                        
                    }
                    
                }
                
                user_edit_form.classList.add("hidden_panel");
                object._blockPanel.classList.add("hidden_panel");
                object.loadingPanel(0);
                
            });
            
        }
        
    }
    
    delete_button.onclick = function(){
        
        var post = {mode: 'deleteUser', nonce: object._nonce, action: object._action, user_login: user.user_login};
        if(window.confirm(object._i18n.get("You have specified the user for deletion."))){
            
            console.log(post);
            /**
            object.loadingPanel(1);
            new Booking_App_XMLHttp(object._url, post, false, function(response){
                
                console.log(response);
                if(response.status == 'success'){
                    
                    user.user_email = post.user_email;
                    tr.textContent = null;
                    var tdList = ["ID", "user_login", "user_email", "user_registered"];
                    for(var i = 0; i < tdList.length; i++){
                        
                        var td = document.createElement("td");
                        td.textContent = user[tdList[i]];
                        tr.appendChild(td);
                        
                    }
                    
                }
                
                user_edit_form.classList.add("hidden_panel");
                object._blockPanel.classList.add("hidden_panel");
                object.loadingPanel(0);
                
            });
            **/
            
            object.loadingPanel(1);
            new Booking_App_XMLHttp(object._url, post, false, function(response){
                
                console.log(response);
                if(response.status == 'success'){
                    
                    user_edit_form.classList.add("hidden_panel");
                    object._blockPanel.classList.add("hidden_panel");
                    
                    var member_limit = document.getElementById("member_limit");
                    var index = member_limit.selectedIndex;
                    var limit = member_limit.options[index].value;
                    object.movePage(null, limit, null);
                    
                }else if(response.status == 'error'){
                    
                    window.alert(response.error_messages);
                    
                }
                
                object.loadingPanel(0);
                
            });
            
        }
        
    }
    
}

Member_manage.prototype.userForm = function(){
    
    console.log("userForm");
    var object = this;
    if(parseInt(object._isExtensionsValid) == 1){
        
        document.getElementById("booking-package-user_regist_message").textContent = null;
        var user_form = document.getElementById("booking-package-user-form");
        user_form.classList.remove("hidden_panel");
        var user_form_close = document.getElementById("booking-package-edit_user_return_button");
        user_form_close.classList.remove("hidden_panel");
        object._blockPanel.classList.remove("hidden_panel");
        var register_button = document.getElementById("booking-package-register_user_button");
        register_button.setAttribute("class", "w3tc-button-save button-primary sendButton");
        register_button.onclick = function(){
            
            var user_data = {
                user_login: document.getElementById("booking-package-user_login"),
                user_email: document.getElementById("booking-package-user_email"),
                user_pass: document.getElementById("booking-package-user_pass"),
            };
            
            var registering = true;
            var post = {mode: 'createUser', nonce: object._nonce, action: object._action};
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
            
            console.log(post);
            if(registering == true){
                
                console.log(post);
                object.loadingPanel(1);
                new Booking_App_XMLHttp(object._url, post, false, function(response){
                    
                    console.log(response);
                    if(response.status == 'success'){
                        
                        user_form.classList.add("hidden_panel");
                        object._blockPanel.classList.add("hidden_panel");
                        
                        var member_limit = document.getElementById("member_limit");
                        var index = member_limit.selectedIndex;
                        var limit = member_limit.options[index].value;
                        object.movePage(null, limit, null);
                        
                    }else if(response.status == 'error'){
                        
                        window.alert(response.error_messages);
                        
                    }
                    
                    object.loadingPanel(0);
                    
                });
                
            }
            
        }
        
    }
    
    
}