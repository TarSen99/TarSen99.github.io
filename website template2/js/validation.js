function generateError(text) {
	var error = document.createElement("div");
	error.innerHTML = text;
	error.classList.add("error");
	return error
}

function removeErrors() {
	var errors = document.querySelectorAll(".error");
	for(var i = 0; i < errors.length; i++) {
		errors[i].remove();
	}
}

function getParent(el) {
	return el.parentElement
}

function checkIfEmpty(fields) {
	for( var i = 0; i < fields.length; i++) {
		if(!fields[i].value) {
			fields[i].classList.add("input-error");
			var error = generateError("This field is required");
			getParent(fields[i]).appendChild(error);
		}
		else {
			fields[i].classList.remove("input-error");
		}
	}
}

function matchInput(pattern, field, errorName, errorDescr) {
	var exist = pattern.test(field.value);
	if(field.type == "text"){
		for(i in field.value) {
			if(field.value[i] == "\'" || field.value[i] == "\""){		
				exist = false;
				errorDescr = "Don't use \' or \"";
			}
		}
	}

	if(!exist && !field.classList.contains("input-error")) {
		field.classList.add("input-error");
		var error = generateError(errorName + " is not valid <br>" + errorDescr);
		getParent(field).appendChild(error);
	}
}

function checkRadio() {
	radioButtons = document.querySelectorAll(".radio-gender");
	isChecked = false;
	for(var i = 0; i < radioButtons.length; i++) {
		if(radioButtons[i].checked){
			isChecked = true;
		}
	}
	
	if (!isChecked) {
		var error = generateError("This field is required");
		getParent(radioButtons[0]).appendChild(error);
	}
}

function checkSelect() {
	isChecked = false;
	selectCountries = document.querySelector(".select-country");
	if(selectCountries.selectedIndex >= 0){
		selectCountries.classList.remove("input-error");
		isChecked = true;
	}
	else {
		selectCountries.classList.add("input-error");
		var error = generateError("This field is required");
		getParent(selectCountries).appendChild(error);
	}
}

function validate(fields) {
	help = {
		name: "[A-Z]{1} + [a-z]{2,}",
		email: "needs e-mail type",
		password: "w{8,}",
		address: "w{2,}",
		date: "needs mm/dd/yy"
	};

	for(var i = 0; i < fields.length; i++) {
		attr = fields[i].getAttribute("data-validation");
		switch(attr) {
			case 'first-name': matchInput(/[A-Z]\w{2,}/, fields[i], "First name", help["name"]);
			break;
			case 'last-name': matchInput(/[A-Z]\w{2,}/, fields[i], "Last name", help["name"]);
			break;
			case 'email': matchInput(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
				fields[i], "E-mail", help["email"]);
			break;
			case 'password': matchInput(/\w{8,}/, fields[i], "Password", help["password"]);
			break;
			case 'address': matchInput(/\w{2,}/, fields[i], "Address", help["address"]);
			break;
			case 'date': matchInput(/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}/, fields[i], "Date", help["date"]);
			break;
		}
	}
}

function findErrors() {
	var errors = document.querySelectorAll(".error");
	if(!errors.length)
		alert("Validation passed");
}

function checkExist() {
	var fields = document.querySelectorAll(".field");
	removeErrors();
	checkIfEmpty(fields);
	validate(fields);
	checkRadio();
	checkSelect();
	findErrors();

}