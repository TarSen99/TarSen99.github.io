let requirePoints = 3;
let fieldSize = 3;
let gameMode = 1;
let field = document.querySelector('.cell-container');
let restartbtn = document.querySelector('body > .button');
let currentMoveSign = 'x';
let gameOver = false;
let countOfFreeCells = 0;
let playerMoveIsBlocked = false;


function generateField(fieldSize) {

	let [cellSize, borderWidth] = setFieldSizing(fieldSize);

	let containerMaxWidth = fieldSize * cellSize;

	field.style.maxWidth = `${containerMaxWidth}px`;

	for(let i = 0; i < fieldSize; i++) {
		for(let j = 0; j < fieldSize; j++) {
			let cell = document.createElement('div');
			cell = addBorderClass(cell, i, j, fieldSize, borderWidth, cellSize);
			field.append(cell);
		}
	}

	countOfFreeCells = fieldSize * fieldSize;
}

function setFieldSizing(fieldSize) {
	let cellSize;
	let borderWidth;

	if(fieldSize >= 15) {
		cellSize = 30;
		borderWidth = 1;
	} else 	if(fieldSize >= 12) {
		cellSize = 40;
		borderWidth = 2;
	} else	if(fieldSize >= 9) {
		cellSize = 60;
		borderWidth = 2;
	} else if(6 >= 15) {
		cellSize = 80;
		borderWidth = 3;
	} else 	if(fieldSize >= 3) {
		cellSize = 100;
		borderWidth = 4;
	}

	return [cellSize, borderWidth];
}

function addBorderClass(cell, i, j, fieldSize, borderWidth, cellSize) {
	cell.classList.add('cell');

	if(i === 0) {
		cell.style.borderTopColor = 'transparent';
	} else if(i === fieldSize - 1) {
		cell.style.borderBottomColor = 'transparent';
	}

	if(j === 0) {
		cell.style.borderLeftColor = 'transparent';
	} else if(j === fieldSize - 1) {
		cell.style.borderRightColor = 'transparent';
	}

	cell.style.borderWidth = `${borderWidth}px`;
	cell.style.width = `${cellSize}px`;
	cell.style.height = `${cellSize}px`;

	return cell;
}

//get real position of cell in (x, y)
function getActualPos(cellVirtualPos, firstCellCoord, cellSize) {
	let actualPos = {
		x: firstCellCoord.x + cellVirtualPos.x * cellSize.w + cellSize.w / 2,
		y: firstCellCoord.y + cellVirtualPos.y * cellSize.h + cellSize.h / 2,
	}

	return actualPos;
}


//dRow - moving by Y (switching columns)
//dCol - moving by X (switching rows)
//if dRow equal to 0, we move only on Y axis in one column, with dCol is the same
//key is value that defined the direction of moving
//key == -1, we move front, if 1 -- move back
//nextPosToCheck defined next position of cell to check
//we need real position of this cell (func getActualPos())
function checkLine(...args) {
	let [cellVirtualPos, firstCellCoord, cellSize, currentMoveSign, requirePoints, dRow, dCol, key, currPoints = 0] = args;
	let cellPos = getActualPos(cellVirtualPos, firstCellCoord, cellSize);
	let points = currPoints;

	//moving through the field from cell which was clicked
	//as in first iteration i = 0, we started from cellPos.x, cellPos.y

	for(let i = 0; i < fieldSize; i++) {
		let nextPosToCheck = {
			x: (cellPos.x - i * key * dRow * cellSize.h), 
			y: (cellPos.y - i * key * dCol * cellSize.w)
		};

		let checkCell = document.elementFromPoint(nextPosToCheck.x, nextPosToCheck.y);

		//if current cell contains img
		//we'll get that img(elementFromPoint), so we need to get parent cell
		checkCell = checkCell.closest('.cell');

		//if cell we checking wasn't found or it's value not exist
		//we exit from loop to continue checking in opposite way
		if(!checkCell || checkCell.dataset.sign !== currentMoveSign) {
			break;
		}

		points++;

		//if we have count of points we need, return true, win line was found
		if(points === requirePoints) {
			return true;
		}
	}

	//for example position where we clicked was 1, 1
	//firstly we're starting to move from from pos 1,1
	//if earned points in that way is not enough
	//we started to move in opposite way, but again from pos 1,1
	//so we need to take one point, because it's dublicated
	if(key === -1) {
		//take one earned point
		//start checking in opposite way with key value 1
		points--;
		let check = checkLine(cellVirtualPos, firstCellCoord, cellSize, currentMoveSign, requirePoints, dRow, dCol, 1, points);
		
		if(check) {
			return true;
		}
	}

	return false;
}

function processMatches(...args) {
	let key = -1;
	//cellVirtualPos, firstCellCoord, cellSize, currentMoveSign, requirePoints, dRow, dCol, 1

	//horizontal check
	let checkWin = checkLine(...args, 0, 1, key);
	if(checkWin) {
		return true;
	}

	//vertical check
	checkWin = checkLine(...args, 1, 0, key);
	if(checkWin) {
		return true;
	}

	//main diagonal check
	checkWin = checkLine(...args, 1, 1, key);
	if(checkWin) {
		return true;
	}

	//opposite diagonal
	checkWin = checkLine(...args, -1, 1, key);
	if(checkWin) {
		return true;
	}

	return false;
}

function getVirtualPos(firstCellCoord, cellActualPos, cellSize) {
	return {
		x: Math.floor(Math.abs((firstCellCoord.x - cellActualPos.left) / cellSize.w)),
		y: Math.floor(Math.abs((firstCellCoord.y - cellActualPos.top) / cellSize.h))
	};
}

function getTypeOfScreenMessage() {
	let typeScrenMessage = 0;
	if(countOfFreeCells === 0 && gameOver === false) {
		gameOver = true;
		typeScrenMessage = 1;
	} else if(gameOver) {
		typeScrenMessage = 2;
	}

	return typeScrenMessage;
}

function moveController(e) {
	if(gameOver) {
		return;
	}

	if(playerMoveIsBlocked) {
		return;
	}
	let tg = e.target.closest('.cell');

	//if cell has already self sign return
	if(!tg || tg.children.length > 0) {
		return;
	}

	let cell = field.firstElementChild;

	//get coordinates of first cell element
	let firstCellCoord = {
		x: cell.getBoundingClientRect().left,
		y: cell.getBoundingClientRect().top
	};

	let cellSize = {
		w: parseInt(getComputedStyle(cell).width), 
		h: parseInt(getComputedStyle(cell).height)
	};

	let imgWay = {
		'x': 'img/x-3.png',
		'o': 'img/o-3.png',
	}

	playerMove(tg, firstCellCoord, imgWay, cellSize);
	if(gameMode === 0) {
		playerMoveIsBlocked = true;
		setTimeout(aiMove, 1000, firstCellCoord, imgWay, cellSize);

	}
}

function getNextMoveSign() {
	return currentMoveSign === 'x' ? 'o' : 'x';
}

function playerMove(cell, firstCellCoord, imgWay, cellSize) {
	if(gameOver) {
		return;
	}

	let cellActualPos = cell.getBoundingClientRect();

	//for instance (1,1)
	let cellVirtualPos = getVirtualPos(firstCellCoord, cellActualPos, cellSize);

	setSign(imgWay[currentMoveSign], cell, cellSize, cellActualPos, currentMoveSign);
	gameOver = processMatches(cellVirtualPos, firstCellCoord, cellSize, currentMoveSign, requirePoints);

	let typeScrenMessage = getTypeOfScreenMessage();

	//change sign for next move
	if(typeScrenMessage === 0) {
		currentMoveSign = getNextMoveSign();
	}

	//0 - update screen move image
	//1 - draw
	//2 - someone won
	updateWindowView(imgWay[currentMoveSign], typeScrenMessage);
}

function aiMove(firstCellCoord, imgWay, cellSize) {
	if(gameOver) {
		return;
	}
	let allCells = [...field.querySelectorAll('.cell')];

	let freeCells = allCells.filter(item => {
		if(!item.dataset.sign) {
			return item;
		}
	});

	let randomCell = freeCells[Math.floor(Math.random() * freeCells.length)];

	if(!randomCell) {
		return;
	}

	let cellActualPos = randomCell.getBoundingClientRect();
	let cellVirtualPos = getVirtualPos(firstCellCoord, cellActualPos, cellSize);

	setSign(imgWay[currentMoveSign], randomCell, cellSize, cellActualPos, currentMoveSign);
	gameOver = processMatches(cellVirtualPos, firstCellCoord, cellSize, currentMoveSign, requirePoints);

	let typeScrenMessage = getTypeOfScreenMessage();

	if(typeScrenMessage === 0) {
		currentMoveSign = getNextMoveSign();
	}

	updateWindowView(imgWay[currentMoveSign], typeScrenMessage);
	playerMoveIsBlocked = false;
}

function setSign(signWay, cell, cellSize, cellPos, currentMoveSign) {
	let cellCenter = {
		x: cell.clientWidth / 2,
		y: cell.clientHeight / 2
	};

	let signImg = `<img class="cell-sign" src="${signWay}">`;
	cell.insertAdjacentHTML('afterBegin', signImg);
	cell.dataset.sign = currentMoveSign;

	countOfFreeCells--;

	let cellCurrSign = cell.firstChild;
	cellCurrSign.style.width = `${Math.floor(cellSize.w - cellSize.w * 0.3)}px`;
	cellCurrSign.style.height = `${Math.floor(cellSize.h - cellSize.h * 0.3)}px`;


	let cellCurrSignWidth = parseInt(getComputedStyle(cellCurrSign).width);
	let cellCurrSignHeight = parseInt(getComputedStyle(cellCurrSign).height);

	cellCurrSign.style.left = `${cellCenter.x - (cellCurrSignWidth / 2)}px`;
	cellCurrSign.style.top = `${cellCenter.y - (cellCurrSignHeight / 2)}px`;

}

function updateWindowView(signWay, type) {
	let signWindowIcon = document.querySelector('.header-subtitle__img > img');
	let signWindowText = document.querySelector('.header-subtitle__text');

	if(type === 0) {
		signWindowIcon.src = signWay;
		signWindowIcon.parentElement.style.width = `${40}px`;
		signWindowText.textContent = 'IS MOVING';
	} else if(type === 1) {
		signWindowIcon.src = '';
		signWindowIcon.parentElement.style.width = `${0}px`;
		signWindowText.textContent = 'IT\'S A DRAW!';
	} else if(type === 2) {
		signWindowIcon.src = signWay;
		signWindowText.textContent = 'WON!';
	}
}

function restartGame() {
	field.innerHTML = '';
	generateField(fieldSize);
	currentMoveSign = 'x';
	updateWindowView(`img/${currentMoveSign}-3.png`, 0)
	gameOver = false;
	playerMoveIsBlocked = false;
}

function setInitValues() {
	if (sessionStorage.getItem("fieldSize")) {
		fieldSize = parseInt(sessionStorage.getItem("fieldSize"));
	} else {
		fieldSize = 3;
	}

	if (sessionStorage.getItem("requirePoints")) {
		requirePoints = parseInt(sessionStorage.getItem("requirePoints"));
	} else {
		requirePoints = 3;
	}

	if (sessionStorage.getItem("gameMode")) {
		gameMode = parseInt(sessionStorage.getItem("gameMode"));
	} else {
		gameMode = 1;
	}

	restartGame();
}

document.addEventListener("DOMContentLoaded", setInitValues);
field.addEventListener('click', e => moveController(e));
restartbtn.addEventListener('click', restartGame);
