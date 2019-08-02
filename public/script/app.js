"use strict"

const tileType = {Grass:0, Base:1, Runes:2, Target:3};
const unitType = {Hero:0, Creep:1, Bomb:2};
const userType = {Human:0, Bot:1, UserAgent:2};
const ramsType = {Hero: true, Creep: false, Bomb: true};
const higlightType = {Rotate: 0, Move: 1, Attack:2, Hook:3};




function Game() {

	class User {
		constructor(isHost) {
			this.index = null;
			this.hand = []; // Карты в руке, int id типы карт
			this.stacks = [[],[],[],[],[],[]]; // подмассивы - стеки, верхняя карта - последняя
			this.agent = null;
			this.myHero = null;
		}

		// возвращает текущего пользователя закончившего ход
		selectCard(cards, callback) { // Запрос пользователю выбрать x карт

			if(callback !== undefined){
				let user = this;

				this.agent.selectCard(cards, function(selId) {
					user.hand.push(cards[selId]);
					
					user.agent.setHand(user.hand);
					callback(selId);
				})
			}
		}

		chooseRotate(rotateArray){  // 1: 90,  2: 180, 3: 270(-90), 4:360
			let user = this;
			return new Promise(function(resolve, reject){
				user.agent.chooseRotate(rotateArray, function(rotateId){
					resolve(rotateId)
				})
			})
		}

		scrapRequest(type){
			// Утилизация для ремонта. Утилизация огненных или металлических карт позволяет вам освободить слот от повреждения на выбор
			// Утилизация электрических или компьютерных карт для перепрограммирования - свап 2-х активных стеков на выбор
			let user = this;
			return new Promise(function(resolve, reject){
				//user
				if(type === cardType.Fire || type === cardType.Metal){
					let disabledStacks = [];

					for (let i = 0; i < 6; i++){
						if (user.stacks[i].length > 0 && cardsParams[user.stacks[i][user.stacks[i].length - 1]].type === cardType.Deffect){
							disabledStacks.push(i);
						}
					}

					if (disabledStacks.length > 0) {
						user.agent.selectStacks(disabledStacks, 1, function(selectedStacksIds){
							user.stacks[disabledStacks[selectedStacksIds[0]]].pop();
						});
					}

				}
				else if(type === cardType.Electro || type === cardType.Computer){
					let notDisabledStacks = [];

					for (let i = 0; i < 6; i++){
						if (user.stacks[i].length === 0 || cardsParams[user.stacks[i][user.stacks[i].length - 1]].type !== cardType.Deffect){
							notDisabledStacks.push(i);
						}
					}
					if (notDisabledStacks.length >= 2){
						user.agent.selectStacks(notDisabledStacks, 2, function(selectedStacksIds){
							let tmpStack = user.stacks[selectedStacksIds[0]];
							user.stacks[selectedStacksIds[0]] = user.stacks[selectedStacksIds[1]];
							user.stacks[selectedStacksIds[1]] = tmpStack;
						});
					}

				}

				resolve(true);
			})
		}

		programming(callback) {
			// callback - вызвать при завершении работы с этим пользователем
			let outCallback = callback;
			let user = this;
			user.agent.setStacks(user.stacks);
			user.agent.setHand(user.hand);

			// Обновить данные
			let request = function(){


				user.agent.programming(async function(ret){
					let cardPosInHand = ret[0]
					let stackId = ret[1]

					if (stackId === -2){ // КАРТЫ если она УТИЛИЗИРУЕТСЯ БЕЗ ЭФФЕКТА
						user.hand.splice(cardPosInHand, 1);
					}

					else if (stackId === -1){// Карты если она УТИЛИЗИРУЕТСЯ С ЭФФEКТОМ

						await user.scrapRequest(cardsParams[user.hand[cardPosInHand]].type)
						user.hand.splice(cardPosInHand, 1);
					}
					else if (user.stacks[stackId].length > 0 && cardsParams[user.stacks[stackId][user.stacks[stackId].length - 1]].type === cardType.Deffect) {

					}


					else if (user.stacks[stackId].length === 0 || cardsParams[user.stacks[stackId][0]].type === cardsParams[user.hand[cardPosInHand]].type) {
						if (user.stacks[stackId].length === 3) {
							for (let i = 1; i < 3; i++){
								user.stacks[stackId][i - 1] = user.stacks[stackId][i];
							}
							user.stacks[stackId].pop();
						}
						user.stacks[stackId].push(user.hand[cardPosInHand]);
						user.hand.splice(cardPosInHand, 1);
					} else {
						user.stacks[stackId] = [user.hand[cardPosInHand]];
						user.hand.splice(cardPosInHand, 1);
					}

					user.agent.setStacks(user.stacks);
					user.agent.setHand(user.hand);


					if(user.hand.length > 0){
						setTimeout(request, 0);
					}
					else{
						outCallback();
					}

				})
			}
			request();
		}
		// const HIGHLIGHT_STYLE = ["rotate-cell", "move-cell", "attack-cell", "help-cell"];
		async selectCells(cellsArray, highlight, count = 1){ //
			let user = this;
			return new Promise(function(resolve, reject){
				user.agent.selectCells(cellsArray, highlight, count, function(selSellsIds){
					resolve(selSellsIds)
				})
			})
		}
	}







	this.seedRandom = /*0.5297204857065221//*/Math.random(); // Общее случайное число, получать его от хоста
	//this.seedRandom =  0.12800927790647165 // - рядом с бомбой

	const inputMap = [ // Ландшафт
		[1, 0, 0, 0, 0, 2,  2, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 2, 2, 0],
		[1, 1, 1, 0, 0, 0,  0, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 0, 0,  0, 2, 0, 3, 0, 2],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 0, 2, 0],
		[1, 0, 0, 0, 0, 2,  0, 0, 0, 0, 0, 0]
	];

	function Unit(type) {
		this.type = type;
		this.rotation = 1; // 1: 90, 2: 180, 3: -90(270)
		this.ownerUser = null;
		this.attachedCell = null; // тот кого тащит Unit

		this.rotate = function(angle){  // 1: 90, 2: 180, 3: -90(270)
			this.rotation += angle;
			this.rotation %= 4;
		}
	}



	function MapObject(inputMap) { // Структура данных для работы с полем игры

		function Cell() {
			this.x = null;
			this.y = null;
			this.type = null;
			this.unit = null;
			this.stop = false; // Проверка, можно ли продвинуть юнита вперед

			this.hasUnit = function(){
				return this.unit !== null;
			};

			this.setUnit = function(unit){
				if(this.unit !== null) throw "unit has been planted";
				this.unit = unit;
				return this;
			}
		}

		// инициализация

		this.size = {x:inputMap[0].length, y:inputMap.length};
		this.map = [];
		this.typesCells = [];

		for(let i in tileType) {
			this.typesCells.push([]);
		}

		for (let i = 0; i < inputMap.length; i++) {
			this.map.push([]);
			for (let j = 0; j < inputMap[i].length; j++) {
				let cell = new Cell();
				cell.x = j;
				cell.y = i;
				cell.type = inputMap[i][j];

				this.map[i][j] = cell;
				this.typesCells[cell.type].push(cell);
			}
		}


		// Возвращает объект клетки(Cell) по координатам (x, y)
		this.get = function(x, y) {
			if( y < 0 || x < 0 || y >= this.map.length || x >= this.map[y].length) return null;
			return this.map[y][x];
		};

		// Возвращает все объекты клетки типа tileType (new Cell[])
		this.getAllCellsByType = function(type) {
			return this.typesCells[type];
		};

		// Возвращает все объекты клетки типа unitType (new Unit[])
		this.getAllCellHasUnits = function(type) {
			let retArray = [];
			for (let row of this.map) {
				for (let cell of row) {
					if(cell.hasUnit() && cell.unit.type === type) {
						retArray.push(cell);
					}
				}
			}
			return retArray;
		};

		// Перемещает, если не может, возвращает null иначе клетку в которую переместил
		this.moveUnitFromCellToCoords = function(cellFrom, x, y) {
			let cellTo = this.get(x, y);
			if(cellTo === null) return null;
			if(cellTo.hasUnit()) return null;
			cellTo.unit = cellFrom.unit;
			cellFrom.unit = null;
			return cellTo;
		}
	}

	// Инициализация
	
	let map = new MapObject(inputMap);

	const cardsParams = cardsJSON; // Описания карт

	let roundCounter = 0; // Увеличивать на 1 в конце спауна мобов
	const render = new Render();
	this.getRender = render;
	
	render.renderMap(map);


	const cardsCount = 96;
	let cardsDeck = null; // Колода карт по 8 карт
	let bombHP = 7;
	let killsCount = 0;
	const damageCardsCount = 55;
	let damageCardsDeck = null;

	let random = null;
	this.getRandom = random;

	let users = []; // Пользователи
	// TODO: users: AbstractAgent[] array - инициализированные обьекты пользователей
	this.start = function(newUsers, seedRandom = 42){ // newUsers - массив уникальных идентификаторов
		random = new Math.seedrandom(seedRandom);
		let index = 0;
		for (let userId of newUsers) {
			let user = new User(); 
			if(globalUserId === userId){
				user.agent = new LocalAgent(userId)

				user.stacks[0] = [4,4,4]
				user.stacks[1] = [10,10,10]
			}
			else if (userId[userId.length - 1] === 'b'){
				user.agent = new BotAgent()
			}
			else{
				user.agent = new NetworkAgent(userId)
			}
			user.index = index;

			users.push(user)
			index++;
		}

		/*{ /// временная генерация пользователей
			let testUserAgent = new LocalAgent();
			let testUser = new User(false);
			testUser.agent = testUserAgent;
			testUser.index = 0;
			users.push(testUser);
		}*/

		// Генерация колоды c командными картами
		cardsDeck = [];
		for (let i = 0; i < 12; i++) {
			for (let j = 0; j < (cardsCount/(cardsParams.length - 2))|0; j++) {
				cardsDeck.push(i);
			}
		}
		shakeArray(cardsDeck, random);

		// Генерация колоды с картами повреждений
		damageCardsDeck = [];
		for (let i = 0; i < 13; i++){
			for (let j = 12; j < 16; j++){
				damageCardsDeck.push(j);
			}
		}
		shakeArray(damageCardsDeck, random);

		// Начальный спаун мобов на рунах
		let runesFree = map.getAllCellsByType(tileType.Runes).filter(cell => !cell.hasUnit());
		for (let spawnCell of runesFree) {
			render.initUnit(spawnCell.setUnit(new Unit(unitType.Creep)));
		}

		// Спаун героев
		let baseFree = map.getAllCellsByType(tileType.Base).filter(cell => !cell.hasUnit());
		shakeArray(baseFree, random);

		for (let user of users) {
			let heroCell = baseFree.pop().setUnit(new Unit(unitType.Hero));
			user.myHero = heroCell.unit;
			heroCell.unit.ownerUser = user;
			render.initUnit(heroCell);
		}
		// Спаун бомбы
		render.initUnit(baseFree.pop().setUnit(new Unit(unitType.Bomb)));

		chooseСards();
		//warriorsAct()
	};

	function lose(sms = "") {
		render.stopSelect();
		render.stopTimer();
		render.defeat();
		render.showMessage("Ты проиграл, позорно!<br>"+sms);
	}
	this.lose = lose;

	function chooseСards() {
		let isFirstRound = roundCounter === 0;

		let selectionCards = [];

		let countCards = isFirstRound ? 10 : 5; // TODO: добавить еще условие для core карт

 		for (let i = 0; i < countCards && cardsDeck.length > 0; i++) {
			selectionCards.push(cardsDeck.pop());
		}

		let countGived = 0;

		function select(userId = 0) {
			if(selectionCards.length === 0) {
				lose("Карты в колоде закончились!");
				return;
			}

			users[userId].selectCard(selectionCards, function(selectCardId) {

				selectionCards.splice(selectCardId, 1);

				countGived++

				if (isFirstRound && countGived < (users.length * 2) || !isFirstRound && countGived < 4) {
					select((userId + 1) % users.length);
				} else {
					setTimeout(programmingAct, 0);
				}
			})
		}
		select();
	}


	function programmingAct() { // DONE!
		
		let local = [];
		let noLocal = [];
		for (let i = 0; i < users.length; i++) { // Получить локальных
			if(users[i].agent.constructor.name == 'LocalAgent') local.push(i);
			else noLocal.push(i);
		}

		let countNoLocal = 0;
		let countLocal = 0;
		let isEnd = true
		for (let i of noLocal) {
			users[i].programming(function() {
				countNoLocal++;
				if (countNoLocal === noLocal.length && countLocal === local.length && isEnd) {
					isEnd = false
					setTimeout(warriorsAct, 0)
				}
			})
		}

		function localProg(userLocalInd = 0){
			users[local[userLocalInd]].programming(function() {
				countLocal++;

				if (userLocalInd + 1 < local.length) {
					localProg(userLocalInd + 1);
				} 
				else if(countNoLocal === noLocal.length && isEnd){
					isEnd = false
					setTimeout(warriorsAct, 0);
				}
			})
		}
		localProg();

	}



	function warriorsAct() {
		// Исполняется карта, верхняя в каждом стеке в порядке игроков

		async function go(userId = 0) {



			for (let stack of users[userId].stacks) {
				if(stack.length === 0) continue;

				await runStack(users[userId], stack)
			}




			if (userId + 1 < users.length) {
				go(userId + 1);
			} else {
				setTimeout(creepsMoveAct, 0);
			}
		}
		go()
	}

	function runStack(user, stack){
		let level = stack.length;
		return new Promise(async function(resolve, reject) {
			let cardId = stack[level - 1];
			let card = cardsParams[cardId].levels[level-1];
			let heroCell = map.getAllCellHasUnits(unitType.Hero).filter(cell => cell.unit === user.myHero)[0]

			if(card.rotate.length !== 0){
				let rotateAngleId = 0;
				if(card.rotate.length > 1){
					rotateAngleId = await user.chooseRotate(card.rotate);
				}
				user.myHero.rotate(card.rotate[rotateAngleId]);
				render.updateCellRotate(heroCell, user.myHero.rotation)
			}


			if (card.move.length !== 0) {
				let selVect = null
				if(card.move.length === 1){ // card.move[i] - вектор в конец которого нужно дойти
					selVect = card.move[0]

				}
				else{
					// Выбор или запрос ячейки для передвижения
					let sellArray = []
					let sellVec = []
					for (let sel of card.move) {
						let v = vectorRotate(sel, user.myHero.rotation)
						let temp = Math.max(Math.abs(v.x), Math.abs(v.y))
						let next = {x: heroCell.x + v.x, y: heroCell.y - v.y};

						while(true){
							let nextCell = map.get(next.x, next.y)
							
							if(next.x === heroCell.x && next.y === heroCell.y) break;
							if(nextCell !== null){
								sellArray.push(nextCell);
								sellVec.push(sel);
								break;
							}
							next = {x:(next.x - v.x/temp)|0, y:(next.y + v.y/temp)|0};
							continue;
						}
					}

					if(sellVec.length === 0){
						selVect = null;
					}
					else if(sellVec.length === 1){
						selVect = sellVec[0];
					}
					else{
						let moveCellId = await user.selectCells(sellArray, higlightType.Move, 1);
						selVect = sellVec[moveCellId];
					}
				}


				if(selVect !== null){
					let v = vectorRotate(selVect, user.myHero.rotation)
					await goRamming(user, heroCell, v.x, -v.y);
				}

			}

			heroCell = map.getAllCellHasUnits(unitType.Hero).filter(cell => cell.unit === user.myHero)[0]
			if (card.attack.length !== 0) {
				await goAttack(user, heroCell, card.attack, card.targetCount);
			}



			//TODO: Вызвать спец функцию карты


			resolve();

		})
	}


	// Возвращает bool удалось перейти или нет
	function goRamming(user, thisCell, vecX, vecY) {
		return new Promise(async function(resolve, reject){

			let hookArray = []
			let hookVecs = [vectorRotate({x:-1, y:0}, thisCell.unit.rotation), vectorRotate({x:0, y:-1}, thisCell.unit.rotation), vectorRotate({x:1, y:0}, thisCell.unit.rotation)]
			let hookSelect = null
			for(let hook of hookVecs){
				let hookTemp = map.get(thisCell.x + hook.x, thisCell.y - hook.y)
				if(hookTemp !== null && hookTemp.hasUnit() && (hookTemp.unit.type === unitType.Hero || hookTemp.unit.type === unitType.Bomb)){
					hookArray.push(hookTemp)
				}
			}
			hookArray.push(thisCell)
			let unit = thisCell.unit;

			if(hookArray.length > 1){
				hookSelect = hookArray[await user.selectCells(hookArray, higlightType.Hook, 1)]
				if(hookSelect !== null && hookSelect !== thisCell)
					unit.attachedCell = hookSelect
			}

			let toX = thisCell.x + vecX;
			let toY = thisCell.y + vecY;
			let temp = Math.max(Math.abs(vecX), Math.abs(vecY))

			// Развернутая рекурсия
			let stack = []
			stack.push(thisCell) // клетка которую двигаем

			let stopMatrix = createArray(map.size.x, map.size.y)

			while(stack.length !== 0){

				let curCell = stack.pop();

				let next = map.get((curCell.x + vecX/temp)|0, (curCell.y + vecY/temp)|0)

				if(next === null || (curCell.x === toX && curCell.y === toY) || stopMatrix[next.x][next.y] == true) { /// Дальше двигаться никак нельзя
					stopMatrix[curCell.x][curCell.y] = true
					continue;
				}

				if(next.unit !== null && (next.unit.type === unitType.Hero || next.unit.type === unitType.Bomb)) { // Следующую можно толкать положить в стек
					stack.push(curCell)
					stack.push(next)
					continue;
				}

				if(next.unit !== null && next.unit.type === unitType.Creep) creepKill(next)

				map.moveUnitFromCellToCoords(curCell, next.x, next.y)


				

				if(next.unit.attachedCell !== null) { // Если юнит кого-то тащит, то тот занимает ячейку юнита
					render.moveUnit(curCell, next)
					map.moveUnitFromCellToCoords(next.unit.attachedCell, curCell.x, curCell.y);
					await render.moveUnit(next.unit.attachedCell, curCell)
					next.unit.attachedCell = curCell
				}
				else{
					await render.moveUnit(curCell, next)
				}


				stack.push(next)

			}
			unit.attachedCell = null

			resolve();


		})
	}

	function goAttack(user, thisCell, attackVecs, count){
		return new Promise(async function(resolve, reject){
			let attArray = []

			for (let vec of attackVecs){
				let dirVec = vectorRotate(vec, thisCell.unit.rotation);
				let tempCell = map.get(dirVec.x + thisCell.x, thisCell.y - dirVec.y);
				if(tempCell !== null && tempCell.unit !== null && tempCell.unit.type === unitType.Creep){
					attArray.push(tempCell)
				}
			}

			let attCells = []
			if(attArray.length > count){
				//если найдено больше юнитов чем нужно, спросить каких нужно бить
				let atIds = await user.selectCells(attArray, higlightType.Attack, count)
				for(let atId of atIds){
					attCells.push(attArray[atId]);
				}
			}
			else{
				attCells = attArray
			}


			for(let cell of attCells){
				creepKill(cell);
			}

			resolve()
		})
	}

	function creepKill(cell){
		cell.unit = null;
		render.killUnit(cell)
		render.updateKillsCounter(++killsCount);
	}



	async function creepsMoveAct() { // TODO: таранят бомбу или героя если они на пути

		let creepsCells = map.getAllCellHasUnits(unitType.Creep);
		let bombCells = map.getAllCellHasUnits(unitType.Bomb);

		for (let cellFrom of creepsCells) {
			let next = getNextCellFromAToB(cellFrom, bombCells[0]);
			let to = map.moveUnitFromCellToCoords(cellFrom, next.x, next.y);

			if (to !== null) render.moveUnit(cellFrom, to);
		}

		setTimeout(creepsSpawnAct, 500);
	}


	function creepsSpawnAct() {
		let runesFree = map.getAllCellsByType(tileType.Runes).filter(cell => !cell.hasUnit());
		for (let spawnCell of runesFree) {
			render.initUnit(spawnCell.setUnit(new Unit(unitType.Creep)));
		}


		setTimeout(creepsAttackAct, 500);
	}


	function creepsAttackAct() {
		let bombs = map.getAllCellHasUnits(unitType.Bomb);
		let heroCells = map.getAllCellHasUnits(unitType.Hero);

		let sortHeroCells = [];
		for (let user of users) {
			sortHeroCells.push(heroCells.find(cell => cell.unit === user.myHero));
		}
		let attackedCells = bombs.concat(sortHeroCells);

		let attackEvent = [];
		const crossVectorsZone = [[-1,0],[1,0],[0,-1],[0,1]];

		for (let cell of attackedCells) {
			for (let vec of crossVectorsZone) {
				let creepCell = map.get(cell.x + vec[0], cell.y + vec[1]);
				if (creepCell !== null && creepCell.unit !== null && creepCell.unit.type === unitType.Creep) {
					attackEvent.push({attacking: creepCell, attacked: cell});
				}
			}
		}



		function attack(eventId = 0) {
			let atEv = attackEvent[eventId];


			if (atEv.attacked.unit.type === unitType.Hero){
				getDisable(atEv.attacked.unit.ownerUser);
			}

			else if (atEv.attacked.unit.type === unitType.Bomb){
				render.updateBombCounter(--bombHP);
				if (bombHP === 0){
					lose("Бомба уничтожена!!!");
					return;
				}
			}

			if (eventId + 1 < attackEvent.length) {
				attack(eventId + 1);
			} else {
				finalAct();
			}

		}

		if (attackEvent.length > 0) {
			attack();
		} else {
			finalAct();
		}
	}

	function getDisable(user){
		//TODO: random for choosing stacks
		//let user = this;
		//users[userID].disables[0] = true;
		//let user = this;
		if (damageCardsDeck !== 0){
			let ranId = getRandomInt(random, 0, 6);
			if (user.stacks[ranId].length > 0 && cardsParams[user.stacks[ranId][user.stacks[ranId].length - 1]].type === cardType.Deffect){
				user.stacks[ranId].pop();
				user.stacks[ranId].push(damageCardsDeck.pop());
			}
			else user.stacks[ranId].push(damageCardsDeck.pop());

		}
		user.agent.setStacks(user.stacks);
	}


	function finalAct() {
		let bombCell = map.getAllCellHasUnits(unitType.Bomb)[0];
		let target = map.getAllCellsByType(tileType.Target)[0];
		if (bombCell === target){
			lose("Ты выиграл, молодец!");
			return;

		}
		users.unshift(users.pop());

		roundCounter++;

		setTimeout(chooseСards, 500);
	}

}




//////////////// Функции Расширения

function getRandomInt(random, min, max) {
  return Math.floor(random() * (max - min)) + min;
}


function shakeArray(a, random) {
	a.sort(function () {
  		return random() - 0.5;
	});
	return a;
}


function vectorRotate(a, angle){ // angle 0 - 0; 1 - 90; 2 - 180; 3 - 270
	let an = {x:a.x, y:a.y}
	for (let i = 0; i < angle; i++) {
		let c = an.x;
		an.x = an.y;
		an.y = -c;
	}
	return(an)
}

//a, b - {x:X, y:Y}
function getNextCellFromAToB(a, b){
	const vectorFromAToB = (a, b) => ({x:b.x-a.x, y:b.y-a.y});
	const vectorMultiple = (a, v) => ({x: a.x * v, y:a.y * v});
	const vectorAdd = (a, b)=>({x:b.x+a.x, y:b.y+a.y});
	const vectorRound = a => ({x: Math.round(a.x), y: Math.round(a.y)});
	const vectorLen = a => Math.sqrt(a.x*a.x+a.y*a.y);

	let v = vectorFromAToB(a, b);
	let l = vectorLen(v);

	let c = vectorMultiple(v, 1/l);
	c = vectorRound(c);

	if(c.x !== 0 && c.y !== 0) c.x = 0;

	return vectorAdd(a, c);
}


//createArray(3, 2); // [new Array(2),
                     //  new Array(2),
                     //  new Array(2)]
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
