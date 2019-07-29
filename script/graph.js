function Render() {


	const mapBody = document.getElementById("game-map").children[0];
	const handBoard = document.getElementById("hand-board")
	const stacksParent = document.getElementsByClassName("stack-content")
	const chooseBoard = document.getElementById("choose-board")
	const deskCard = document.getElementById("desk-card")
	const okChoose = document.getElementById("ok-choose")


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
		}
	};

	const UNIT_IMGS = ["src/models/hero.png", "src/models/monster.png", "src/models/bomb.png"];

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
		setTimeout(function(){
			img.style.transform = 'scale(1)';
		}, 0);

	};

	this.killUnit = function(cell) {
		mapBody.children[cell.y].children[cell.x].innerHTML = ''
	};

	this.selectCards = function(cards, count, callback) {
		programmingSession = false;
		chooseBoard.classList.remove('noDisplay')

		chooseBoard.style.opacity = '0';
		setTimeout(function(){
			chooseBoard.style.opacity = '1';
		}, 0)
		let arrayIdSelectedCards = [];

		deskCard.innerHTML = '';
		for (let i = 0; i < cards.length; i++) {
			let img = getNewCardElem(cards[i])
			img.className = "round-cards";
			img.tempSelectId = i;
			img.onclick = function(e) {
				let card = e.currentTarget;
				if (arrayIdSelectedCards.length !== count) {
					if(card.classList.contains('selected-card')){
						card.classList.remove("selected-card");
						arrayIdSelectedCards = arrayIdSelectedCards.filter(c => c !== card.tempSelectId);
					}
					else{
						card.classList.add("selected-card");
						arrayIdSelectedCards.push(card.tempSelectId|0);
					}
				}
				if (arrayIdSelectedCards.length === count) {
					okChoose.classList.remove("noActive")
				} 
				else {
					okChoose.classList.add("noActive")
				}
			}
			deskCard.appendChild(img)
		}
		okChoose.classList.add("noActive")
		okChoose.onclick = function (e) {
			if (callback !== undefined && !e.currentTarget.classList.contains("noActive")) {
				callback(arrayIdSelectedCards);
			}
		}
	}

	this.stopSelect = function(){
		chooseBoard.classList.add('noDisplay')
	}

	
	this.timerId = null;
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
				}
			})
		}
	}
	let selectedHandCard = null;
	let programmingCallback = null;
	// callback принимает номер карты в руке и номер стека
	this.programming = function(callback) {
		selectedHandCard = null;
		programmingCallback = callback;
		let i = 0;
		for (let card of handBoard.children) {
			card.idInList = i++;
			card.onclick = function(e){
				if(selectedHandCard !== null) selectedHandCard.style.outline = '';
				selectedHandCard = e.currentTarget;
				selectedHandCard.style.outline = '2px solid yellow';
			}
		}
	};
	
	const higlightType = {Rotate: 0, Move: 1, Attack:2, Hook:3};

	// cellsArray[i] = {x:X, y:Y, higlight:/0, 1, 2/, isSelected}
	// callback Возвращает id ячеек в массиве cellsArray, на которые кликнули
	this.selectCells = function(cellsArray, callback) {
		let i = 0;
		if (cellsArray.length === 0) {
			callback([]);
		}
		for (let cell of cellsArray) {
			let cellElement = mapBody.children[cell.y].children[cell.x];
			switch (cell.highlight) {
				case(0):
					cellElement.classList.add("rotate-cell");
					break;
				case(1):
					cellElement.classList.add("move-cell");
					break;
				case(2):
					cellElement.classList.add("attack-cell");
					break;
				case(3):
					cellElement.classList.add("help-cell");
					break;
			}
			cellElement.idCell = i;
			cellElement.onclick = function (e) {
				callback(e.currentTarget.idCell);
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


	this.updateBombCounter = function(newVal){
		document.getElementById('hp-bomb').innerHTML = newVal
	}

	this.updateKillsCounter = function(newVal){
		document.getElementById('kills').innerHTML = newVal
	}


	this.chooseRotate = function(rotateArray, callback){ // callback(rotateIdInArray)

		callback(prompt("Выберите вариант поворота вашего персонажа:" + rotateArray, "0")|0)

	}


}
