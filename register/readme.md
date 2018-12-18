# Register Form
This form was created for data validation

## Usage
Follow [instructions](#) to enter data

## Adding new type of error
See code **below:**
```javascript
function generateError(text) {
	var error = document.createElement("div");
	error.innerHTML = text;
	error.classList.add("error");
	return error
}
```

## Contribute
Check [**this**](https://github.com/TarSen99/TarSen99.github.io.git) link