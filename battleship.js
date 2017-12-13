var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var element = document.getElementById(location);
		element.setAttribute('class', 'hit');
	},
	displayMiss: function(location) {
		var element = document.getElementById(location);
		element.setAttribute('class', 'miss');
	}

};

var model = {
	boardSize: 7,
	numships: 3,
	shipLength: 3,
	shipSunk: 0,
	/*ships: [
		{locations: ['01', '02', '03'], hits: ['', '', '']},
		{locations: ['21', '22', '23'], hits: ['', '', '']},
		{locations: ['51', '52', '53'], hits: ['', '', '']},
	],*/
	ships: [
		{locations: ['', '', ''], hits: ['', '', '']},
		{locations: ['', '', ''], hits: ['', '', '']},
		{locations: ['', '', ''], hits: ['', '', '']},
	],
	fire: function(guess) {
		for (var i = 0; i < this.numships; i++) {
			/* 这我自己的逻辑，相比官方嵌套过于复杂
			var locations = this.ships[i].locations;
			var hits = this.ships[i].hits;
			for (var j = 0; j < this.shipLength; j++) {
				if (locations[j] == guess) {
					if (hits[j] === 'hit') {
						view.displayMessage('你已经击中过此位置啦！');
						return true;
					} else {
						hits[j] = 'hit';
						view.displayMessage('击中！');
						view.displayHit(guess);
						return true;
					}
				}
			}*/
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (ship.hits[index] === 'hit') {
				view.displayMessage('哎呀，你已经击中过此位置啦！');
				return true;
			} else if (index >= 0) {
				ship.hits[index] = 'hit';
				view.displayMessage('击中！Perfect!');
				view.displayHit(guess);
				if (this.isSunk(ship)) {
					view.displayMessage('恭喜！你击沉了一艘战舰！');
					this.shipSunk++;
				}
				return true;
			}
		}
		view.displayMessage('没有击中哦，下次努力！');
		view.displayMiss(guess);
		return false;
	},
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== 'hit') {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numships; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateShip: function() {
		var direction = Math.floor(Math.random()*2);
		var row, column;
		if (direction === 0) { // 0 横向 1 纵向
			row = Math.floor(Math.random() * this.boardSize);
			column = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			column = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 0) {
				newShipLocations.push(row + '' + (column + i));
			} else {
				newShipLocations.push((row + i) + '' + column);
			}
		}
		console.log('newShipLocations:');
		console.log(newShipLocations);
		return newShipLocations;
	},
	collision: function(locations) {
		for (var i = 0; i < this.numships; i++) {
			var shipLocations = this.ships[i].locations;
			for (var j = 0; j < this.shipLength; j++) {
				var include = shipLocations.indexOf(locations[j]);
				if (include !== -1) {
					return true;
				}
			}
		}
		return false;
	}
};

var controller = {
	guesses: 0,
	processGuess: function(input) {
		var guess = parseGuess(input);
		if (guess) {
			this.guesses++;
			var hit = model.fire(guess);
			if (hit && model.shipSunk == model.numships) {
				view.displayMessage('恭喜，你在猜测了 '+this.guesses+' 次以后，成功完成任务！');
			}
		}
	},
	clickGuess: function(id) {
		this.guesses++;
		var hit = model.fire(id);
		if (hit && model.shipSunk == model.numships) {
			view.displayMessage('恭喜，你在猜测了 '+this.guesses+' 次以后，成功完成任务！');
		}
	}
};

/**
 * 转换输入 A1 -> 01; G6 -> 66
 * @param  {String} input 输入值
 * @return {String}       转换后的值
 */
function parseGuess(input) {
	var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	if (input == null || input.length != 2) {
		alert('输入格式不对哦！');
	} else {
		var firstChart = input.charAt(0);
		var row = alphabet.indexOf(firstChart);
		var column = input.charAt(1);
		if (isNaN(row) || isNaN(column)) {
			alert('输入格式不对哦！');
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert('输入格式不对哦！');
		} else {
			return row + column;
		}
	}
	return null;
}
/**
 * #fireButton click 触发方法
 */
function handleFireButton() {
	var guessInput = document.getElementById('guessInput');
	var guess = guessInput.value.toUpperCase();
	controller.processGuess(guess);
	guessInput.value = '';
	guessInput.focus();
}
/**
 * 输入框回撤触发 #fireButton
 * @param  {Event} e DOM Event
 * @return {Boolean} false 防止表单提交
 */
function handleKeyPress(e) {
	// console.log(e);
	e = e || window.event;
	if (e.keyCode === 13) {
		var fireButton = document.getElementById('fireButton');
		fireButton.click();
		return false;
	}
}

function handleTdClick() {
	console.log('this:', this);
	controller.clickGuess(this.id);
}
//---------------------------初始化---------------------------
window.onload = init;

function init() {
	var fireButton = document.getElementById('fireButton');
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress;

	var cells = document.getElementsByTagName('td');
	for (var i = 0; i < cells.length; i++) {
		cells[i].onclick = handleTdClick;
	}
	
	model.generateShipLocations();
}
