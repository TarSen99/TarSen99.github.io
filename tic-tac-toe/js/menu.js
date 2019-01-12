let requirePoints = 3;
let fieldSize = 3;
let gameBtn = document.querySelector('.menu-button__start');
let inputFieldSize = document.querySelector('#input-field-size');
let inputPointsToWin = document.querySelector('#input-points');
let modeBtns = document.querySelectorAll('.mode-btn');
let modeBtnsContainer = document.querySelector('.menu-form__btns');

inputFieldSize.addEventListener('blur', controlInputValues);
inputPointsToWin.addEventListener('blur', controlInputValues);

document.addEventListener("DOMContentLoaded", setDefaultValues);
modeBtnsContainer.addEventListener('click', e => setMode(e));

function setDefaultValues() {
	sessionStorage.setItem('fieldSize', fieldSize);
	sessionStorage.setItem('requirePoints', requirePoints);
	sessionStorage.setItem('gameMode', 1);
}

function controlInputValues() {
	if(!checkInputValue(inputFieldSize.value, 'size')) {
		return;
	}

	if(!checkInputValue(inputPointsToWin.value, 'points')) {
		return;
	}

}

function checkInputValue(value, type) {
	value = parseInt(value)
	if(isNaN(value)) {
		return false;
	}

	if(type === 'size') {
		if(value < 3 || value > 20) {
			return false;
		}

		fieldSize = value;
		sessionStorage.setItem('fieldSize', fieldSize);
	}

	if(type === 'points') {
		if(value > fieldSize || value < 3) {
			return false;
		}
		requirePoints = value;
		sessionStorage.setItem('requirePoints', requirePoints);
	}

	return true;
}

function setMode(e) {
	let btn = e.target.closest('.mode-btn');

	if(!btn) {
		return;
	}
	modeBtns = [...modeBtns];

	modeBtns.forEach( item => {
		item.classList.remove('mode-btn_selected');
	});

	btn.classList.add('mode-btn_selected');

	if(btn.dataset.mode === 'P') {
		sessionStorage.setItem('gameMode', 1);
	} else {
		sessionStorage.setItem('gameMode', 0);
	}
}