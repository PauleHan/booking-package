	function Input() {
		
		this._userInformation = {};
		this._prefix = "";
		
	}
	
	Input.prototype.setUserInformation = function(userInformation){
		
		this._userInformation = userInformation;
		
	}
	
	Input.prototype.setPrefix = function(prefix){
		
		this._prefix = prefix;
		
	}
    
    Input.prototype.createInput = function(inputName, input, inputData, eventAction){
		
		console.log(input);
		var object = this;
		var userInformation = object._userInformation;
		var list = null;
		if(input['options'] != null){
	    	
	    	list = input['options'].split(",");
	    	
		}
		
		if(input.json != null){
			
			list = input.values;
			
		}
		
		console.log(list);
		
		var userValuePanel = document.createElement("div");
		userValuePanel.id = object._prefix + "value_" + input.id;
		userValuePanel.classList.add("hidden_panel");
		var valuePanel = document.createElement("div");
		valuePanel.appendChild(userValuePanel);
		var inputId = object._prefix + "input_" + input.id;
		var userValue = null;
		if(userInformation[input['type']] != null && userInformation[input['type']][input['id']] != null && userInformation[input['type']][input['id']].value != null){
			
			userValue = userInformation[input['type']][input['id']].value;
			
		}
		
		if(typeof userValue == "string"){
			
			userValue = userValue.replace(/\\/g, "");
			
		}
		
		if(input['type'] == 'TEXT'){
			
			var textBox = document.createElement("input");
			textBox.setAttribute("class", "regular-text");
			textBox.type = "text";
			textBox.id = inputId;
			textBox.value = input['value'];
			
			if(inputData[inputName] != null && inputData[inputName].textBox != null){
				
				textBox = inputData[inputName]["textBox"];
				
			}
			
			if(eventAction != null){
				    
		    	textBox.onchange = eventAction;
			    
			}
			
			if(userValue != null && userValue.length != 0){
				
				textBox.value = userValue;
				textBox.classList.add("hidden_panel");
				valuePanel.setAttribute("data-edit", "1");
				userValuePanel.classList.remove("hidden_panel");
				userValuePanel.textContent = userValue;
				if (input.isTerms != null && input.isTerms == 'true') {
					
					textBox.classList.remove("hidden_panel");
					userValuePanel.classList.add("hidden_panel");
					valuePanel.removeAttribute("data-edit");
					
				}
				
				textBox.onchange = function(){
					
					userValuePanel.textContent = textBox.value;
					
					
				}
				
			}
			
			valuePanel.appendChild(textBox);
			inputData[inputName] = {textBox: textBox};
			
		}else if(input['type'] == 'SELECT'){
			
			var selectBox = document.createElement("select");
			selectBox.id = inputId;
			//for(var i = 0; i < list.length; i++){
			for(var key in list){
				
				if(typeof list[key] == "string"){
					
					list[key] = list[key].replace(/\\/g, "");
					
				}
				
				var optionBox = document.createElement("option");
				optionBox.value = list[key];
				optionBox.textContent = list[key];
				
				console.log("key = " + key);
				if(list[key] == input['value']){
					
					console.log("value = " + input['value']);
					optionBox.selected = true;
					
				}
				
				if(input.index != null && input.index == key){
					
					optionBox.selected = true;
					
				}
				
				if(userValue == list[key]){
					
					optionBox.selected = true;
					
				}
				
				selectBox.appendChild(optionBox);
				
				
			}
			
			if(userValue != null && inputData[inputName] != null && inputData[inputName].selectBox != null){
				
				selectBox = inputData[inputName].selectBox;
				
			}
			
			if(eventAction != null){
				    
		    	selectBox.onchange = eventAction;
			    
			}
			
			if(userValue != null && userValue.length != 0){
				
				selectBox.classList.add("hidden_panel");
				valuePanel.setAttribute("data-edit", "1");
				userValuePanel.classList.remove("hidden_panel");
				userValuePanel.textContent = userValue;
				if (input.isTerms != null && input.isTerms == 'true') {
					
					selectBox.classList.remove("hidden_panel");
					userValuePanel.classList.add("hidden_panel");
					valuePanel.removeAttribute("data-edit");
					
				}
				selectBox.onchange = function(){
					
					var index = selectBox.selectedIndex;
					userValuePanel.textContent = selectBox.options[index].value;
					
				}
				
			}
			
			valuePanel.appendChild(selectBox);
			inputData[inputName] = {selectBox: selectBox};
			
		}else if(input['type'] == 'CHECK'){
			
			if(inputData[inputName] == null){
				
				inputData[inputName] = {};
				
			}
			
			var valueList = input['value'].split(",");
			if(userValue != null){
				
				valueList = userValue.split(",");
				
			}
			
			if (input.isTerms != null && input.isTerms == 'true') {
				
				valueList = [];
				
			}
			console.log(valueList)
			
			var checkBoxPanel = document.createElement("div");
			checkBoxPanel.id = inputId;
			valuePanel.appendChild(checkBoxPanel);
			
			for(var i = 0; i < list.length; i++){
				
				if(typeof list[i] == "string"){
					
					list[i] = list[i].replace(/\\/g, list[i]);
					
				}
				
				var valueName = document.createElement("span");
				valueName.setAttribute("class", "radio_title");
				valueName.textContent = list[i];
				
				var checkBox = document.createElement("input");
				checkBox.setAttribute("data-value", i);
				checkBox.name = inputName;
				checkBox.type = "checkbox";
				checkBox.checked = false;
				checkBox.value = list[i];
				
				for(var a = 0; a < valueList.length; a++){
					
					console.log(valueList[a]);
					if(typeof valueList[a] == "string"){
						
						valueList[a] = valueList[a].replace(/\\/g, "");
						
					}
					
					if(valueList[a] == list[i]){
						
						checkBox.checked = "checked";
						
					}
					
				}
				/**
				if(input['value'] == list[i]){
					
					checkBox.checked = "checked";
					
				}
				**/
				
				if(inputData[inputName] != null && inputData[inputName][i] != null){
				
					checkBox = inputData[inputName][i];
					
				}
				
				checkBox.onchange = function(){
					
					var checkValue = "";
					for(var key in inputData[inputName]){
						
						var checkBox = inputData[inputName][key];
						if(checkBox.checked == true){
							
							checkValue += checkBox.value + "<br />";
							
						}
						
					}
					
					userValuePanel.textContent = null;
					userValuePanel.insertAdjacentHTML("beforeend", checkValue);
					
				}
				
				var label = document.createElement("label");
				label.appendChild(checkBox);
				label.appendChild(valueName);
				checkBoxPanel.appendChild(label);
				inputData[inputName][i] = checkBox;
				
				if (input.isTerms != null && input.isTerms == 'true') {
					
					checkBox.checked = false;
					
				}
				//checkBox.checked = false;
				console.log(checkBox.checked);
				
			}
			
			if(userValue != null && userValue.length != 0){
				
				console.log(valueList);
				console.log(input);
				checkBoxPanel.classList.add("hidden_panel");
				valuePanel.setAttribute("data-edit", "1");
				var checkValue = "";
				for(var i = 0; i < valueList.length; i++){
					
					checkValue += valueList[i] + "<br />";
					
				}
				
				userValuePanel.classList.remove("hidden_panel");
				userValuePanel.insertAdjacentHTML("beforeend", checkValue);
				if (input.isTerms != null && input.isTerms == 'true') {
					
					checkBoxPanel.classList.remove("hidden_panel");
					userValuePanel.classList.add("hidden_panel");
					valuePanel.removeAttribute("data-edit");
					for (var i in inputData[inputName]) {
						
						console.log(inputData[inputName][i]);
						inputData[inputName][i].checked = "";
						
					}
					
				}
				
			}
			
		}else if(input['type'] == 'RADIO'){
			
			if(inputData[inputName] == null){
				
				inputData[inputName] = {};
				
			}
			
			if(typeof input['value'] == "string"){
				
				input['value'] = input['value'].replace(/\\/g, "");
				
			}
			
			var radioBoxPanel = document.createElement("div");
			radioBoxPanel.id = inputId;
			valuePanel.appendChild(radioBoxPanel);
			
			for(var i = 0; i < list.length; i++){
		    //for(var key in list){
				
				console.log(i + " = " + list[i]);
				if(typeof list[i] == "string"){
					
					list[i] = list[i].replace(/\\/g, "");
					
				}
				var valueName = document.createElement("span");
				valueName.setAttribute("class", "radio_title");
				valueName.textContent = list[i];
				
				var radioBox = document.createElement("input");
				radioBox.setAttribute("data-value", i);
				radioBox.name = inputName;
				radioBox.type = "radio";
				radioBox.value = list[i];
				
				if(i == 0){
					
					radioBox.checked = "checked";
					
				}
				
				if(input['value'] == list[i]){
					
					console.log("value = " + input['value']);
					radioBox.checked = "checked";
					
				}
				
				if(userValue == list[i]){
					
					radioBox.checked = "checked";
					
				}
				
				if(inputData[inputName] != null && inputData[inputName][i] != null){
				
					radioBox = inputData[inputName][i];
					
				}
				
				radioBox.onchange = function(){
					
					var radioBox = this;
					userValuePanel.textContent = radioBox.value;
					if (typeof eventAction == 'function') {
						
						eventAction(this);
						
					}
					
				}
				
				var label = document.createElement("label");
				label.appendChild(radioBox);
				label.appendChild(valueName);
				radioBoxPanel.appendChild(label);
				inputData[inputName][i] = radioBox;
				
			}
			
			if(userValue != null && userValue.length != 0){
				
				radioBoxPanel.classList.add("hidden_panel");
				valuePanel.setAttribute("data-edit", "1");
				userValuePanel.classList.remove("hidden_panel");
				userValuePanel.textContent = userValue;
				if (input.isTerms != null && input.isTerms == 'true') {
					
					radioBoxPanel.classList.remove("hidden_panel");
					userValuePanel.classList.add("hidden_panel");
					valuePanel.removeAttribute("data-edit");
					
				}
				
			}
			
		}else if(input['type'] == 'TEXTAREA'){
			
			var testareaBox = document.createElement("textarea");
			testareaBox.id = inputId;
			if(inputData[inputName] != null && inputData[inputName].textBox != null){
				
				testareaBox = inputData[inputName].textBox;
				
			}
			
			if(valueList != null){
				
				
				
			}
			
			valuePanel.appendChild(testareaBox);
			inputData[inputName] = {textBox: testareaBox};
			
		}
		
		if(input.description != null){
			
			var description = document.createElement("div");
			description.classList.add("description");
			description.textContent = input.description;
			valuePanel.appendChild(description);
			
		}
		
		
		
		/**
		var filedPanel = document.createElement("div");
		filedPanel.id = object._prefix + input.id;
		filedPanel.appendChild(valuePanel);
		**/
		
		return valuePanel;
		
	}
	
	Input.prototype.checkEmailAddress = function(email) {
		
		if (email.length == 0) {
			
			return true;
			
		}
		
		if (email.match(/.+@.+\..+/) == null) {
			
	        return false;
	        
	    } else {
	    	
	        return true;
	        
	    }
			
	}
    
    Input.prototype.inputCheck = function(keyName, input, inputBox, valueList){
	
        var array = [];
	    var bool = false;
	    for(var key in inputBox){
		    
		    console.log(inputBox[key]);
		    var inputBool = false;
	        if (
	        	parseInt(input['inputLimit']) == 0 || 
	        	parseInt(input['inputLimit']) == 1 || 
	        	parseInt(input['inputLimit']) == 2 || 
	        	input['required'] != null
	        ) {
			    
		        inputBool = true;
			    if (parseInt(input['inputLimit']) == 2 || input['required'] == 'false') {
				    
				    inputBool = false;
				    
			    }
			    
			    console.log("inputBool = " + inputBool);
			    if (input['inputType'] == 'TEXT' || input['type'] == 'TEXT') {
				    
				    console.log(input);
				    var text = inputBox[key].value.replace(/\s+/g, "");
				    if (text.length != 0 && inputBool == true) {
					    
					    array.push(inputBox[key].value);
					    bool = true;
					    
				    } else if (inputBool == false){
				        
				    	array.push(inputBox[key].value);
				    	bool = true;
					
				    }
				    
				    if (input['isEmail'] == 'true') {
				    	
				    	bool = this.checkEmailAddress(text);
				    	
				    }
				    
			    } else if (input['inputType'] == 'SELECT' || input['type'] == 'SELECT' || input['inputType'] == 'SELECT_GROUP' || input['inputType'] == 'SELECT_TIMEZONE') {
				    
				    console.log(input['inputType']);
			    	var selectKey = inputBox[key].selectedIndex;
			    	console.log("selectKey = " + selectKey);
			    	if (selectKey != null && inputBool == true) {
					
				    	array.push(inputBox[key].options[selectKey].value);
				    	bool = true;
				    	
				    } else if (selectKey != null && inputBool == false) {
					    
					    array.push(inputBox[key].options[selectKey].value);
					    bool = true;
					    
				    }
		        
			    } else if (input['inputType'] == 'CHECK' || input['type'] == 'CHECK') {
				    
				    var value = null;
			    	if (inputBox[key].checked == true && inputBool == true) {
			    		
			    		value = inputBox[key].value;
				    	array.push(inputBox[key].value);
				    	bool = true;
					    
				    } else if(inputBool == false) {
						
						if (inputBox[key].checked == true) {
							value = inputBox[key].value;
				    		array.push(inputBox[key].value);
						}
				    	bool = true;
					
				    }
				    
				    if (value != null && input['valueList'] != null) {
		    		    
		    		    array = [];
		    		    console.log("value = " + value);
		    		    for(var valueKey in input['valueList']){
		    		        
		    		        if (input['valueList'][valueKey] == value) {
		    		            
		    		            array.push(valueKey);
		    		            break;
		    		            
		    		        }
		    		        
		    		    }
		    		    
		    		    console.log(valueKey);
		    		    
		    		}
				    
			    } else if (input['inputType'] == 'RADIO' || input['type'] == 'RADIO') {
				    
				    var value = null;
				    console.log(inputBox[key].checked);
			    	if (inputBox[key].checked == true && inputBool == true) {
			    		
			    		value = inputBox[key].value;
			    		array.push(inputBox[key].value);
				    	bool = true;
				    	
				    } else if (inputBool == false) {
					    
					    if (inputBox[key].checked == true) {
					    	value = inputBox[key].value;
					    	array.push(inputBox[key].value);
					    }
					    bool = true;
					    
		    		}
		    		
		    		if (value != null && input['valueList'] != null) {
		    		    
		    		    array = [];
		    		    console.log("value = " + value);
		    		    for(var valueKey in input['valueList']){
		    		        
		    		        if (input['valueList'][valueKey] == value) {
		    		            
		    		            array.push(valueKey);
		    		            break;
		    		            
		    		        }
		    		        
		    		    }
		    		    
		    		    console.log(valueKey);
		    		    
		    		}
			    	
			    } else if (input['inputType'] == 'TEXTAREA' || input['type'] == 'TEXTAREA') {
				    
				    if (inputBox[key].value.length != 0 && inputBool == true) {
					    
					    array.push(inputBox[key].value);
					    bool = true;
					    
				    } else if(inputBool == false) {
					    
					    array.push(inputBox[key].value);
					    bool = true;
					    
				    }
				    
			    }
			    
		    }
		    
		    if (bool == true) {
			    
			    valueList[keyName] = array;
			    
		    } else {
			    
			    valueList[keyName] = [];
			    
		    }
		    
	    }
	    
	    return bool;
	
    }
    
    /** new function **/
    /**
    createFormPanel(){
		
		var editBool = true;
		
		var addButton = document.createElement("button");
		addButton.disabled = false;
		addButton.setAttribute("class", "w3tc-button-save button-primary");
		addButton.textContent = i18n.get("Add filed");
		
		var saveButton = document.createElement("button");
		saveButton.disabled = true;
		saveButton.setAttribute("class", "w3tc-button-save button-primary");
		saveButton.setAttribute("style", "float: right;");
		saveButton.textContent = i18n.get("Change ranking");
		
		var buttonPanel = document.createElement("div");
		buttonPanel.setAttribute("style", "padding-bottom: 10px;");
		buttonPanel.appendChild(addButton);
		buttonPanel.appendChild(saveButton);
		
		var formDataList = setting_data['formData'];
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
		//for(var key in list){
		for(var key = 0; key < formDataList.length; key++){
			
			var contentPanel = document.createElement("div");
			contentPanel.setAttribute("class", "dnd_content");
			contentPanel.textContent = formDataList[key]['name'];
			
			if(formDataList[key]["active"] != "true"){
				
				contentPanel.classList.add("dnd_content_unactive");
				
			}
			
			var editLabel = document.createElement("label");
			editLabel.setAttribute("class", "dnd_edit");
			editLabel.setAttribute("data-key", key);
			editLabel.textContent = i18n.get("Edit");
			
			var deleteLabel = document.createElement("label");
			deleteLabel.setAttribute("class", "dnd_delete");
			deleteLabel.setAttribute("data-key", key);
			deleteLabel.textContent = i18n.get("Delete");
			
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
					
					editBool = false;
					var key = this.getAttribute("data-key");
					console.log(formDataList[key]);
					jQuery('#formSort').sortable('disable');
					editItem(columns, key, mainPanel, panel, 'updateForm', formDataList[key], setting_data['formInputType'], function(action){
						
						editBool = true;
						if(action == 'cancel'){
							
							jQuery('#formSort').sortable('enable');
							
						}else{
							
							setting_data['formData'] = action;
							createFormPanel();
							
						}
						
					});
					
				}
				
			}
			
			deleteLabel.onclick = function(event){
				
				if(editBool === true){
					
					editBool = false;
					var dataKey = parseInt(this.getAttribute("data-key"));
					var result = confirm(i18n.get('Do you delete filed of "%s"?', [formDataList[dataKey].name]));
					if(result === true){
						
						deleteItem(dataKey, "deleteFormItem", function(json){
							
							setting_data['formData'] = json;
							createFormPanel();
							
						});
						
					}
					editBool = true;
					
				}
				
			}
			
		}
		
		mainPanel.appendChild(panel);
		
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
			
			var sortBool = sortData('name', 'dnd_column', formDataList, panel, 'changeFormRank');
			if(sortBool === true){
				
				saveButton.disabled = false;
				
			}else{
				
				saveButton.disabled = true;
				
			}
			
		});
		
		addButton.onclick = function(event){
			
			if(editBool === true){
				
				editBool = false;
				jQuery('#formSort').sortable('disable');
				addButton.disabled = true;
				addItem(mainPanel, 'addForm', setting_data['formInputType'], function(action){
					
					editBool = true;
					if(action == "close"){
						
						jQuery('#formSort').sortable('enable');
						addButton.disabled = false;
						
					}else{
						
						console.log(typeof action);
						if(typeof action == 'object'){
							
							if(action['status'] != 'error'){
								
								console.log(action);
								setting_data['formData'] = action;
								createFormPanel();
								
							}
							
						}
						
					}
					
				});
				
			}
			
		}
		
		saveButton.onclick = function(event){
			
			formDataList = changeRank('name', 'dnd_column', formDataList, panel, 'changeFormRank', function(json){
				
				setting_data['formData'] = json;
				saveButton.disabled = true;
				var panelList = panel.getElementsByClassName('dnd_column');
				for(var i = 0; i < panelList.length; i++){
					
					panelList[i].setAttribute("data-key", i);
					
				}
				
			});
			
			console.log(formDataList);
			
		}
		
	}

	createCoursePanel(){
		
		var editBool = true;
		
		var addButton = document.createElement("button");
		addButton.disabled = false;
		addButton.setAttribute("class", "w3tc-button-save button-primary");
		addButton.textContent = i18n.get("Add service");
		
		var saveButton = document.createElement("button");
		saveButton.disabled = true;
		saveButton.setAttribute("class", "w3tc-button-save button-primary");
		saveButton.setAttribute("style", "float: right;");
		saveButton.textContent = i18n.get("Change ranking");
		
		var buttonPanel = document.createElement("div");
		buttonPanel.setAttribute("style", "padding-bottom: 10px;");
		buttonPanel.appendChild(addButton);
		buttonPanel.appendChild(saveButton);
		
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
		var courseList = setting_data['courseList'];
		console.log(courseList);
		for(var i = 0; i < courseList.length; i++){
			
			list[courseList[i]['key']] = courseList[i]['name'];
			
		}
		console.log(list);
		//for(var key in courseList){
		for(var key = 0; key < courseList.length; key++){
			
			var contentPanel = document.createElement("div");
			contentPanel.setAttribute("class", "dnd_content");
			contentPanel.textContent = courseList[key]['name'];
			
			if(courseList[key]["active"] != "true"){
				
				contentPanel.classList.add("dnd_content_unactive");
				
			}
			
			var editLabel = document.createElement("label");
			editLabel.setAttribute("class", "dnd_edit");
			editLabel.setAttribute("data-key", key);
			editLabel.textContent = i18n.get("Edit");
			
			var deleteLabel = document.createElement("label");
			deleteLabel.setAttribute("class", "dnd_delete");
			deleteLabel.setAttribute("data-key", key);
			deleteLabel.textContent = i18n.get("Delete");
			
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
					
					editBool = false;
					var key = this.getAttribute("data-key");
					editItem(columns, key, mainPanel, panel, 'updateCourse', courseList[key], setting_data['courseData'], function(action){
						
						editBool = true;
						if(action == 'cancel'){
							
							
						}else{
							
							setting_data['courseList'] = action;
							createCoursePanel();
							
						}
						
					});
					
				}
				
			}
			
			deleteLabel.onclick = function(event){
				
				if(editBool === true){
					
					editBool = false;
					var courseInfo = courseList[parseInt(this.getAttribute("data-key"))];
					//var result = confirm("Do you delete service of \"" + courseInfo.name + "\"?");
					var result = confirm(i18n.get('Do you delete service of "%s"?', [courseInfo.name]));
					if(result === true){
						
						console.log(courseInfo);
						deleteItem(courseInfo.key, "deleteCourse", function(json){
							
							setting_data['courseList'] = json;
							createCoursePanel();
							
						});
						
					}
					editBool = true;
					
				}
				
			}
			
		}
		
		mainPanel.appendChild(panel);
		
		jQuery('#courseSort').sortable({
									cursor: 'move',                     //移動中のカーソル
									opacity: 0.7,                       //移動中の項目の透明度
									placeholder: "ui-state-highlight",  //ドロップ先の色指定(Styleで指定可能)
									forcePlaceholderSize: true,          //trueでドラッグした要素のサイズを自動取得できる
									forceHelperSize: true,
									axis: 'y'
		});
		
		//$( '#formSort' ).disableSelection();
		jQuery(document).off("sortstop", "#courseSort");
		jQuery(document).on('sortstop', '#courseSort', function(){
			
			var sortBool = sortData('key', 'dnd_column', courseList, panel, 'changeCourseRank');
			if(sortBool === true){
				
				saveButton.disabled = false;
				
			}else{
				
				saveButton.disabled = true;
				
			}
			
		});
		
		addButton.onclick = function(event){
			
			if(editBool === true){
				
				editBool = false;
				addButton.disabled = true;
				addItem(mainPanel, 'addCourse', setting_data['courseData'], function(action){
					
					editBool = true;
					if(action == "close"){
						
						addButton.disabled = false;
						
					}else{
						
						console.log(typeof action);
						if(typeof action == 'object'){
							
							if(action['status'] != 'error'){
								
								console.log(action);
								setting_data['courseList'] = action;
								createCoursePanel();
								
							}
							
						}
						
					}
					
				});
				
			}
			
		};
		
		saveButton.onclick = function(event){
			
			courseList = changeRank('key', 'dnd_column', courseList, panel, 'changeCourseRank', function(json){
				
				setting_data['courseList'] = json;
				saveButton.disabled = true;
				var panelList = panel.getElementsByClassName('dnd_column');
				for(var i = 0; i < panelList.length; i++){
					
					panelList[i].setAttribute("data-key", i);
					
				}
				
			});
			
			console.log(courseList);
			
		}
		
	}
	
	addItem(mainPanel, mode, inputTypeList, callback){
			
		console.log(mainPanel);
		
		var closeHeghit = mainPanel.clientHeight;
		var addPanel = document.createElement("div");
		addPanel.id = "addCoursePanel";
		mainPanel.appendChild(addPanel);
		
    	for(var key in inputTypeList){
    		
    		inputTypeList[key]['value'] = "";
    		
    	}
    	
    	console.log(inputTypeList);
    	
    	if(mode == 'addCourse'){
    		
    		var courseTimeList = {};
    		for(var i = 5; i < 1440; i += 5){
    			
    			courseTimeList[i] = i + "min";
    			
    		}
    		inputTypeList['time']['valueList'] = courseTimeList;
    		
    	}else if(mode == 'addForm'){
    		
    		for(var key in inputTypeList){
    			
    			if(key == "required" || key == "isEmail" || key == "isName" || key == "isAddress"){
    				
    				inputTypeList[key]['value'] = "false";
    				
    			}else if(key == "type"){
    				
    				inputTypeList[key]['value'] = "TEXT";
    				
    			}
    			
    		}
    		
    	}
    	
		console.log(inputTypeList);
		var inputData = {};
		var table = document.createElement("table");
		table.setAttribute("class", "form-table");
		var trList = {};
		for(var key in inputTypeList){
			
			console.log(key);
        	var data = inputTypeList[key];
        	
        	var th = document.createElement("th");
        	th.setAttribute("scope", "row");
        	th.textContent = i18n.get(inputTypeList[key].name);
        	
        	var inputPanel = createInput(key, data, inputData, false);
        	var td = document.createElement("td");
        	td.appendChild(inputPanel);
        	
        	var tr = document.createElement("tr");
        	tr.setAttribute("valign", "top");
        	tr.appendChild(th);
        	tr.appendChild(td);
        	trList[key] = tr;
        	table.appendChild(tr);
			
		}
    	
    	addPanel.appendChild(table);
    	
    	var cancelButton = document.createElement("button");
    	cancelButton.setAttribute("style", "margin-right: 10px;");
    	cancelButton.textContent = i18n.get("Cancel");
    	cancelButton.setAttribute("class", "w3tc-button-save button-primary");
    	
    	var saveButton = document.createElement("button");
    	saveButton.textContent = i18n.get("Save");
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
    		
    		var postData = {mode: mode, nonce: nonce, action: action};
    		if(mode == 'addCourse'){
    			
    			console.log("rank = " + (document.getElementById("courseSort").childNodes.length + 1));
    			postData['rank'] = document.getElementById("courseSort").childNodes.length + 1;
    			
    			response = getInputData(inputTypeList, inputData);
    			
    		}else if(mode == 'addForm'){
    			
    			response = getInputData(inputTypeList, inputData);
    			
    		}
    		
    		var post = true;
    		for(var key in response){
    				
    			if(typeof response[key] == 'boolean'){
    				
    				console.log("error key = " + key + " bool = " + response[key]);
    				trList[key].classList.add("errorPanel");
    				post = false;
    				
    			}else{
    				
    				postData[key] = response[key];
    				trList[key].classList.remove("errorPanel");
    				
    			}
    			
    		}
    		
    		if(post === true){
    			
    			console.log(postData);
    			loadingPanel.setAttribute("class", "loading_modal_backdrop");
    			xmlHttp = new Booking_App_XMLHttp(url, postData, function(json){
					
					if(json['status'] != 'error'){
						
						mainPanel.removeChild(addPanel);
    					mainPanel.style.height = null;
						console.log(json);
						callback(json);
						
					}else{
						
						alert(json["message"]);
						
					}
					loadingPanel.setAttribute("class", "hidden_panel");
							
				});
    			
    		}
			
    	}
		
	}

	editItem(columns, editKey, mainPanel, columnsPanel, mode, itemData, inputTypeList, callback){
		
		console.log("editKey = " + editKey);
		
		console.log(columns[editKey]);
		console.log(itemData);
		
		var addPanel = document.createElement("div");
		addPanel.id = "addCoursePanel";
		//columnsPanel.appendChild(addPanel);
		
    	var inputData = {};
    	//var inputTypeList = setting_data['courseData'];
    	if(mode == 'updateCourse'){
    		
    		inputTypeList["name"]["value"] = itemData["name"];
    		inputTypeList["active"]["value"] = itemData["active"];
    		if(itemData["cost"] != null){
    			
    			//inputTypeList["cost"]["value"] = parseFloat(itemData["cost"]);
    			inputTypeList["cost"]["value"] = parseInt(itemData["cost"]);
    			
    		}
    		inputTypeList["time"]["value"] = parseInt(itemData["time"]);
    		var courseTimeList = {};
    		for(var i = 5; i < 1440; i += 5){
    			
    			courseTimeList[i] = i + "min";
    			
			}
    		inputTypeList['time']['valueList'] = courseTimeList;
    		
    	}else if(mode == 'updateForm'){
    		
    		inputTypeList["id"]["value"] = itemData["id"];
    		inputTypeList["name"]["value"] = itemData["name"];
    		inputTypeList["type"]["value"] = itemData["type"];
    		inputTypeList["active"]["value"] = itemData["active"];
    		inputTypeList["required"]["value"] = itemData["required"];
    		inputTypeList["isName"]["value"] = itemData["isName"];
    		inputTypeList["isAddress"]["value"] = itemData["isAddress"];
    		inputTypeList["isEmail"]["value"] = itemData["isEmail"];
    		inputTypeList["options"]["value"] = itemData["options"];
    		
    	}
    	
    	var index = 0;
		console.log(inputTypeList);
		
		var table = document.createElement("table");
		table.setAttribute("class", "form-table");
		
		var trList = {}
		for(var key in inputTypeList){
			
			console.log(key);
        	var data = inputTypeList[key];
        	
        	var th = document.createElement("th");
        	th.setAttribute("scope", "row");
        	th.textContent = i18n.get(inputTypeList[key].name);
        	
        	var inputPanel = createInput(key, data, inputData, false);
        	var td = document.createElement("td");
        	td.appendChild(inputPanel);
        	
        	var tr = document.createElement("tr");
        	tr.setAttribute("valign", "top");
        	tr.appendChild(th);
        	tr.appendChild(td);
        	trList[key] = tr;
        	table.appendChild(tr);
			
		}
		
		if(inputData.id && inputData.id.textBox){
			
			console.log(inputData.id);
			inputData.id.textBox.disabled = true;
			
		}
		
    	addPanel.appendChild(table);
    	
    	var cancelButton = document.createElement("button");
    	cancelButton.setAttribute("style", "margin-right: 10px;");
    	cancelButton.textContent = i18n.get("Cancel");
    	cancelButton.setAttribute("class", "w3tc-button-save button-primary");
    	
    	var saveButton = document.createElement("button");
    	saveButton.textContent = i18n.get("Save");
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
    		var postData = {mode: mode, nonce: nonce, action: action};
    		if(mode == 'updateCourse'){
    			
    			console.log(inputData);
    			postData['key'] = itemData['key'];
    			response = getInputData(inputTypeList, inputData);
				
    		}else if(mode == 'updateForm'){
    			
    			postData['key'] = editKey;
    			response = getInputData(inputTypeList, inputData);
    			response.id = itemData.id;
    			
    		}
    		
    		var post = true;
    		for(var key in response){
    				
    			if(typeof response[key] == 'boolean'){
    				
    				console.log("error key = " + key + " bool = " + response[key]);
    				trList[key].classList.add("errorPanel");
    				post = false;
    				
    			}else{
    				
    				postData[key] = response[key];
    				trList[key].classList.remove("errorPanel");
    				
    			}
    			
    		}
    		
    		if(post === true){
    			
    			loadingPanel.setAttribute("class", "loading_modal_backdrop");
    			console.log(itemData);
    			console.log(postData);
    			xmlHttp = new Booking_App_XMLHttp(url, postData, function(json){
					
					if(json['status'] != 'error'){
						
						//mainPanel.removeChild(addPanel);
    					mainPanel.style.height = null;
						console.log(json);
						callback(json);
						loadingPanel.setAttribute("class", "hidden_panel");
						
					}else{
						
						alert(json["message"]);
						
					}
									
				});
    			
    		}
    		
    	}
		
	}
	
	deleteItem(key, mode, callback){
		
		loadingPanel.setAttribute("class", "loading_modal_backdrop");
		var postData = {mode: mode, nonce: nonce, action: action, key: key};
    	xmlHttp = new Booking_App_XMLHttp(url, postData, function(json){
						
			if(json['status'] != 'error'){
				
				callback(json);
				
			}
			loadingPanel.setAttribute("class", "hidden_panel");
									
		});
		
	}
	
	**/
    
