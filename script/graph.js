function Render() {


	const mapBody = document.getElementById("game-map").children[0];

	const handBoard = document.getElementById("hand-board")
	const stacksParent = document.getElementsByClassName("stack-content")
	const chooseBoard = document.getElementById("choose-board")
	const deskCard = document.getElementById("desk-card")

	const DATA_CARDS = cardsJSON;
	const TILES_IMG = ["src/models/green.png", "src/models/stone_tex.png", "src/models/rune.png", "src/models/blue.png"]

	this.renderMap = function(inputMap){
		let height = 6;
		let width = 12;
		for (let i = 0; i < height; i++) {
			mapBody.appendChild(document.createElement("tr"));
			for (let j = 0; j < width; j++) {
				mapBody.lastChild.appendChild(document.createElement("td"));
			}
		}
		for (let i = 0; i < height; i++) {

			for (let j = 0; j < width; j++) {
				let tmp = inputMap.get(j, i).type;
				let img = new Image();
				img.src = TILES_IMG[tmp];
				mapBody.children[i].children[j].appendChild(img);
			}
		}
		for (let i = 0; i < 6; i++) {
			stacksParent[i].stackLevel = 0;
			stacksParent[i].stackType = null;
			stacksParent[i].isDisabled = false;
		}
	};

	const UNIT_IMGS = ["src/models/hero_right.png", "src/models/monster.png", "src/models/bomb.png", "src/models/hero_left.png", "src/models/hero_up.png", "src/models/hero_down.png"];

	this.moveUnit = function(cellFrom, cellTo) {
		let fromElem = mapBody.children[cellFrom.y].children[cellFrom.x];
		let toElem = mapBody.children[cellTo.y].children[cellTo.x];

		let from_x = fromElem.offsetLeft;
		let from_y = fromElem.parentElement.offsetTop;

		let to_x = toElem.offsetLeft;
		let to_y = toElem.parentElement.offsetTop;

		let el = fromElem.lastChild;
		toElem.appendChild(el);
		el.style.zIndex = '2';
		el.style.transition = "transform .4s";
		el.style.transform = 'translateY('+ (from_y-to_y) +'px)';
		el.style.transform += 'translateX('+ (from_x-to_x) +'px)';

		setTimeout(function(){
			el.style.transform = 'translateY(0px)';
			el.style.transform += 'translateX(0px)';
		}, 0)
	};

	this.initUnit = function(cell) {

		let img = new Image();
		img.src = UNIT_IMGS[cell.unit.type];
		mapBody.children[cell.y].children[cell.x].appendChild(img);
		img.style.transition = "transform .4s";
		img.style.transform = 'scale(0)';

		if(cell.unit.rotation !== null && cell.unit.type === unitType.Hero){
			this.updateCellRotate(cell, cell.unit.rotation);
		}
		setTimeout(function(){
			img.style.transform = 'scale(1)';
			setTimeout(function(){
				img.style = ''
			}, 500)

		}, 0);

	};

	this.killUnit = function(cell) {
		mapBody.children[cell.y].children[cell.x].children[1].outerHTML = '';
	};

	this.selectCards = function(cards, count, callback) {

		programmingSession = false;
		chooseBoard.classList.remove('noDisplay')

		chooseBoard.style.opacity = '0';
		setTimeout(function(){
			chooseBoard.style.opacity = '1';
			setTimeout(function(){
				chooseBoard.style = ''
			}, 1000)
		}, 0)
		let arrayIdSelectedCards = [];

		deskCard.innerHTML = '';
		for (let i = 0; i < cards.length; i++) {
			let img = getNewCardElem(cards[i])
			img.className = "round-cards";
			img.tempSelectId = i;
			img.onclick = function(e) {
				let card = e.currentTarget;
				if(card.classList.contains('selected-card')){
					card.classList.remove("selected-card");
					arrayIdSelectedCards = arrayIdSelectedCards.filter(c => c !== card.tempSelectId);
				}
				else if (arrayIdSelectedCards.length !== count) {
					card.classList.add("selected-card");
					arrayIdSelectedCards.push(card.tempSelectId|0);
				}

				if (arrayIdSelectedCards.length === count) {
					if (callback !== undefined) {
						callback(arrayIdSelectedCards);
					}
				}
			}
			deskCard.appendChild(img)
		}
	}

	this.stopSelect = function(){
		chooseBoard.classList.add('noDisplay')
	}


	let timerId = null;
	this.startTimer = function(intSecond){
		let realSecond = intSecond;
		let timer = document.getElementById("timer");

		function updateTimer(){
			let seconds = realSecond % 60;
			let minutes = (realSecond / 60) | 0;
			if (realSecond < 0 ){
				clearInterval(timerId);
				timerId = null;
				return;
			}
			timer.innerHTML = realSecond < 10 ? minutes+":0"+seconds :  minutes+":"+seconds;
			realSecond--;
		}
		updateTimer();
		timerId = setInterval(updateTimer, 1000);
	};

	this.stopTimer = function(){
		if (timerId !== null){
			let timer = document.getElementById("timer");
			timer.innerHTML = "0:00";
			clearInterval(timerId);
			timerId = null;
		}
	};

	let cardsCounter = document.getElementById("hand-counter");

	this.setHand = function(cards) {
		cardsCounter.innerHTML = cards.length;
		handBoard.innerHTML = "";
		for (let i = 0; i < cards.length; i++){
			handBoard.appendChild(getNewCardElem(cards[i]));
		}
	};

	// cards - Массив 6x3 карт в стеках [ [down, center, top], ... ] int id типы карт
	this.setStacks = function(stacks){
		let i = 0;
		for (let cardIds of stacks) {
			stacksParent[i].innerHTML = '';
			for(cardId of cardIds){
				stacksParent[i].append(getNewCardElem(cardId));
			}
			i++
		}
	};

	function getNewCardElem(i){
		let img = new Image();
		img.src = "src/cards/card"+((i|0)+1)+".jpg";
		img.cardId = i|0;
		img.jsonOptions = DATA_CARDS[i|0];
		//console.log(img.jsonOptions);
		return img
	}

	{
		let i = 0;
		for (let stack of stacksParent) {
			stack.stackId = i++;
			stack.addEventListener('click', function(e){
				if(selectedHandCard !== null){
					programmingCallback(selectedHandCard.idInList, e.currentTarget.stackId);
					selectedHandCard = null;
					trash.style.display = "none";
					scrap.style.display = "none";
				}
			})
		}
	}
	let selectedHandCard = null;
	let programmingCallback = null;
	let trash = document.getElementsByClassName("trash")[0];
	let scrap = document.getElementsByClassName("effect")[0];
	// callback принимает номер карты в руке и номер стека
	this.programming = function(callback) {
		selectedHandCard = null;
		programmingCallback = callback;
		let i = 0;
		for (let card of handBoard.children) {
			card.idInList = i++;
			card.onclick = function(e){
				if (selectedHandCard !== null) selectedHandCard.style.outline = '';
				selectedHandCard = e.currentTarget;
				selectedHandCard.style.outline = '2px solid yellow';
				trash.style.display = "block";
				scrap.style.display = "block";
				trash.onclick = function(e){
					programmingCallback(selectedHandCard.idInList, -2);
					selectedHandCard = null;
					trash.style.display = "none";
					scrap.style.display = "none";
				}
				scrap.onclick = function(e){
					programmingCallback(selectedHandCard.idInList, -1);
					selectedHandCard = null;
					trash.style.display = "none";
					scrap.style.display = "none";
				}
			}
		}
	};


	//const higlightType = {Rotate: 0, Move: 1, Attack:2, Hook:3};
	const HIGHLIGHT_STYLE = ["rotate-cell", "move-cell", "attack-cell", "help-cell"];


	// cellsArray[i] = {x:X, y:Y, higlight:/0, 1, 2/, isSelected}
	// callback Возвращает id ячеек в массиве cellsArray, на которые кликнули
	this.selectCells = function(cellsArray, highlight, count, callback) {
		let callbackIdArr = callback

		let i = 0;
		for (let cell of cellsArray) {
			let cellElement = mapBody.children[cell.y].children[cell.x];
			cellElement.classList.add(HIGHLIGHT_STYLE[highlight]);
			cellElement.selectId = i
			cellElement.onclick = function (e) {
				for (let cell2 of cellsArray) {
					mapBody.children[cell2.y].children[cell2.x].classList.remove(HIGHLIGHT_STYLE[highlight])
				}
				callbackIdArr([e.currentTarget.selectId]);
			};
			i++;
		}
	};


	// callback (StackIds[])
	this.selectStack = function(selectablStacks, count, callback){

	}

	// cellsArray[i] = {x:X, y:Y, higlight:/0, 1, 2/}
	// callback Возвращает id ячеек в массиве cellsArray, на которые кликнули

	//Окно, отображающее поражение для текущей сессии
	this.defeat = function(){
		let defeatBlock = document.getElementById("win-or-defeat");
		defeatBlock.style.display = 'block'
		defeatBlock.src = "src/lose.mp4";
		defeatBlock.muted = "";
		//defeatBlock.play();
	}


	const messageBlock = document.getElementById("message");
	let messageTimeout = null
	this.showMessage = function(text) {
		clearTimeout(messageTimeout)
		messageTimeout = null
		messageBlock.innerHTML = text;
		messageBlock.classList.remove('noDisplay');
		setTimeout(() => messageBlock.style.opacity = '1', 0)
	}

	this.hideMessge = function(){
		messageBlock.style.opacity = '0'
		if(messageTimeout === null) messageTimeout = setTimeout(() => {messageBlock.classList.add('noDisplay'); messageTimeout =  null}, 500)
	}


	//Test
	/// players -- массив игроков, состоящее из Никнейма и его ID
	// let players = [{"Host", 0}, {"Bot", 1}];
	//
	// this.showPlayers = function(players){
	//
	// }(players)

	this.updateBombCounter = function(newVal){
		document.getElementById('hp-bomb').innerHTML = newVal
	}

	this.updateKillsCounter = function(newVal){
		document.getElementById('kills').innerHTML = newVal
	}


	const ROTATE = {0:'360°(0°)', 1:'90°', 2:'180°', 3:'270°(-90°)', 4:'360°(0°)'}
	this.chooseRotate = function(rotateArray, callback){ // callback(rotateIdInArray)
		let s = 'Выберите вариант поворота вашего персонажа: ';
		for (let i = 0; i < rotateArray.length; i++) {
			s += i + ':' + ROTATE[rotateArray[i]] + ' '
		};

		callback(prompt(s, "0")|0)

	}

	//orientation: 0 - ^,  1 - >, 2 - v, 3 - <  // pos: cell.x,  cell.y
	this.updateCellRotate = function(cell, orientation){
		switch(orientation){
			case 0:
				mapBody.children[cell.y].children[cell.x].children[1].src = UNIT_IMGS[4];
				//TODO transform;
				break;
			case 1:
				mapBody.children[cell.y].children[cell.x].children[1].src = UNIT_IMGS[0];
				break;

			case 2:
				mapBody.children[cell.y].children[cell.x].children[1].src = UNIT_IMGS[5];
				break;

			case 3:
				mapBody.children[cell.y].children[cell.x].children[1].src = UNIT_IMGS[3];
				break;
			}
	}


}
