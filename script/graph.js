// здесь вызывается отрисовка карты
function Render() {


	let mapBody = document.getElementById("game-map").children[0];

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
	};


	// Unit
	// cellTo.HasUnit тип получать cellTo.unit.type - тип юнита
	// const unitType = {Hero:0, Creep:1, Bomb:2} - юнит
	// cellTo.x cellTo.y - координаты

	const UNIT_IMGS = ["src/models/hero.png", "src/models/monster.png", "src/models/bomb.png"];

	// передвинуть юнита из in в out
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

	// нарисовать юнита который есть в ячейке
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


	const CARD_IMGS = [
		"src/cards/card1.jpg",
		"src/cards/card2.jpg",
		"src/cards/card3.jpg",
		"src/cards/card4.jpg",
		"src/cards/card5.jpg",
		"src/cards/card6.jpg",
		"src/cards/card7.jpg",
		"src/cards/card8.jpg",
		"src/cards/card9.jpg",
		"src/cards/card10.jpg",
		"src/cards/card11.jpg",
		"src/cards/card12.jpg"
	];
	// isThis = true если выбирает текущий игрок, если false, то callback не вызывать!

	//cards = array of int card id
	this.selectCards = function(cards, count, callback) {
		programmingSession = false;

		let desk = document.getElementById("choose-board");
		desk.innerHTML = '';
		desk.style.display = "inline-block";

		let deskBoard = desk
		deskBoard.style.opacity = '0';
		deskBoard.style.transition = "opacity .4s";
		setTimeout(function(){
			deskBoard.style.opacity = '1';
		}, 0)

		let arrayIdSelectedCards = [];

		desk.appendChild(document.createElement("div"));
		desk.children[0].style.display = "block";
		let board = desk.children[0];
		board.className = "desk-card";
		for (let i = 0; i < cards.length; i++) {
			board.appendChild(document.createElement("div"));
			board.children[i].className = "round-cards";
			let img = new Image();
			img.src = CARD_IMGS[cards[i]];
			img.cardId = i;
			img.onclick = function(e) {
				if (arrayIdSelectedCards.length !== count && e.currentTarget.select !== 'true') {
					e.currentTarget.classList.add("selected-card");
					e.currentTarget.select = 'true'
					arrayIdSelectedCards.push(e.currentTarget.cardId|0);
				} else if (e.currentTarget.select === 'true') {
					arrayIdSelectedCards = arrayIdSelectedCards.filter(c => c !== e.currentTarget.cardId);
					e.currentTarget.classList.remove("selected-card");
					e.currentTarget.select = 'false'
				}
				if (arrayIdSelectedCards.length === count) {
					let btn = document.getElementsByClassName("ok-choose");
					//btn[0].style.visibility = "visible";
					btn[0].classList.remove("noActive")
				} else {
					let btn = document.getElementsByClassName("ok-choose");
					btn[0].classList.add("noActive")
				}
			};
			board.children[i].appendChild(img);
		}
		desk.appendChild(document.createElement("div"));
		desk.children[1].style.display = "block";
		desk = desk.children[1];
		desk.className = "desk";
		desk.appendChild(document.createElement("button"));
		desk.children[0].classList.add("ok-choose");
		desk.children[0].classList.add("noActive")
		desk.children[0].textContent = "OK";
		desk.children[0].onclick = function (e) {
			if (callback !== undefined && !e.currentTarget.classList.contains("noActive")) {
				callback(arrayIdSelectedCards);
			}
		}
	};


	// Скрыть окро выбора карт
	this.stopSelect = function(){
		document.getElementById("choose-board").style.display = "none";
		programmingSession = true;
	}

	
	this.timerId = null;
	// Запуск таймера отсчета с intSecond до 0
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

		updateTimer()
		timerId = setInterval(updateTimer, 1000);
	}


	this.stopTimer = function(){
		if (timerId !== null){
			let timer = document.getElementById("timer");
			timer.innerHTML = "0:00";
			clearInterval(timerId);
			timerId = null;
		}
	}
	

	// Обновить карты в руке рука не активна(перемещать карты нельзя)
	this.setHand = function(cards) {
		let cardsCounter = document.getElementById("hand-counter");
		cardsCounter.innerHTML = cards.length;
		let cardBoard = document.getElementById("hand-board");
		cardBoard.style.display = "flex";
		cardBoard.innerHTML = "";
		for (let i = 0; i < cards.length; i++){
			let img = new Image();
			img.className = "hand-card";
			img.src = CARD_IMGS[cards[i]];
			img.cardId = cards[i];
			cardBoard.appendChild(img);
		}
		cardBoard.style.display = "flex";
	};

	// callback(массив длиной - количество карт в руке, элемент массива - новое место карты i в стеке или -1 если карта выброшена)
	// например при имеющихся картах [2, 3] мы ложим первую карту типа 2 в стек 4,
	// а вторую карту типа 3 в стек 1, нужно вызвать callback([4,1]) // 4, 1 Номера стеков
	
	let selectedHandCard = null;
	let callbackArray = null;
	let programmingCallback = null;
	
	for (let stack of document.getElementsByClassName("stack-content")) {
		stack.onclick = function(e){
			if(selectedHandCard === null || e.currentTarget.children.length >= 3) 
				return
			selectedHandCard.onclick = null

			selectedHandCard.style.outline = ''
			callbackArray.push(selectedHandCard.idInList)
			e.currentTarget.append(selectedHandCard)
			selectedHandCard = null
			if(document.getElementById("hand-board").children.length === 0) programmingCallback(callbackArray)
		}
	}
	
	this.programming = function(handCards, callback) {
		callbackArray = []
		selectedHandCard = null;
		programmingCallback = callback
		this.setHand(handCards)
		let hand = document.getElementById("hand-board")
		let i = 0;
		for (let card of hand.children) {
			card.idInList = i++;
			card.onclick = function(e){
				if(selectedHandCard !== null) selectedHandCard.style.outline = ''
				selectedHandCard = e.currentTarget;
				selectedHandCard.style.outline = '2px solid yellow'
				// TODO: и выделить выбранную карту
			}
		}
	}


	// cards - Массив 6x3 карт в стеках [ [top1,center1,down1], [top2,center2,down2], ... ] int id типы карт
	this.setStacks = function(stacks){
		// заполняем стэки по массиву
		console.log("Текущие стеки нас:")
		console.log(stacks)
	}



	
	const higlightType = {Rotate: 0, Move: 1, Hook:3} 
	// cellsArray[i] = {x:X, y:Y, higlight:/0, 1, 2/}
	// callback Возвращает id ячеек в массиве cellsArray, на которые кликнули
	this.selectCells = function(cellsArray, callback){


		/*function(){

		}*/

	}

	//Окно, отображающее поражение для текущей сессии
	this.defeat = function(){
		let defeatBlock = document.getElementById("win-or-defeat");
		defeatBlock.style.display = 'block'
		defeatBlock.src = "src/lose.mp4";
		defeatBlock.muted = "";
		//defeatBlock.play();
	};

	// Высветить сообщение поверх всего
	this.showMessage = function(text, color) { // make enum
		let messageBlock = document.getElementById("message");
		messageBlock.style.display = "inline-block";
		//messageBlock.style.background = "red"; //rgba(2,3,4,0.5);
		messageBlock.innerHTML = text;
	};

	// Скрыть сообщение
	this.hideMessge = function(){
		let messageBlock = document.getElementById("message");
		messageBlock.style.display = "none";
	};

	this.updateBombCounter = function(newVal){
		document.getElementById('hp-bomb').innerHTML = newVal
	}
	this.updateKillsCounter = function(newVal){
		document.getElementById('kills').innerHTML = newVal
	}


}
