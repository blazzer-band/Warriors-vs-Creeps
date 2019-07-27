"use strict"

const tileType = {Grass:0, Base:1, Runes:2, Target:3}
const unitType = {Hero:0, Creep:1, Bomb:2}
const cardType = {Command:0, Damage:1}
const userType = {Human:0, Bot:1, UserAgent:2}
const ramsType = {Hero: true, Creep: false, Bomb: true}


function Game() {

	class User{
		constructor(isHost){
			this.isHost = isHost
			this.hand = [] // Карты в руке, int id типы карт
			this.stacks = [] // Массив 6x3 карт в стеках [ [top1,center1,down1], [top2,center2,down2], ... ] int id типы карт
			this.agent = null
		}

		// возвращает текущего пользователя закончившего ход
		selectCards(count, cards, callback){ // Запрос пользователю выбрать x карт

			if(callback !== undefined){
				let user = this

				this.agent.selectCards(cards, count, function(sels){
					for (let i of sels) {
						user.hand.push(cards[i]|0)
					}
					user.agent.setHand(user.hand)
					callback(sels)
				})
			}

		}

		programming(callback){
			// Заполнить стеки из руки

			/*this.agent.programming(this.hand, function(){
				callback()
			})
			*/
			for (var i = 0; i < 6; i++) {
				this.stacks.push([])
			}
			this.stacks[0].push(0) // Добавить тестовую карту с id 0


		}




	}


	let users = [] // Пользователи
	this.getUsers = users
	{
		let testUserAgent = new BotAgent()
		let testUser = new User(false)
		testUser.agent = testUserAgent
		users.push(testUser)
	}
	{
		let testUserAgent = new LocalAgent()
		let testUser = new User(true)
		testUser.agent = testUserAgent
		users.push(testUser)
	}




	let seedRandom = Math.random() // Общее случайное число, получать его от хоста

	const inputMap = [ // Ландшафт
		[1, 0, 0, 0, 0, 2,  2, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 2, 2, 0],
		[1, 1, 1, 0, 0, 0,  0, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 0, 0,  0, 2, 0, 3, 0, 2],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 0, 2, 0],
		[1, 0, 0, 0, 0, 2,  0, 0, 0, 0, 0, 0]
	]

	function Unit(type){
		this.type = type
		this.rotation = 0 // 1: 90, 2: 180, 3: -90(270)

		this.rotate = function(angle){  // 1: 90, 2: 180, 3: -90(270)
			this.rotation += angle
			this.rotation %= 4
		}

	}



	function MapObject(inputMap){ // Структура данных для работы с полем игры

		function Cell(){
			this.x = null
			this.y = null
			this.type = null
			this.unit = null

			this.hasUnit = function(){
				return this.unit !== null
			}

			this.setUnit = function(unit){
				if(this.unit !== null) throw "unit has been planted";
				this.unit = unit
				return this
			}
		}

		// инициализация

		this.size = {x:inputMap[0].length, y:inputMap.length}
		this.map = []
		this.typesCells = []

		for(let i in tileType){
			this.typesCells.push([])
		}

		for (let i = 0; i < inputMap.length; i++) {
			this.map.push([])
			for (let j = 0; j < inputMap[i].length; j++) {
				let cell = new Cell()
				cell.x = j
				cell.y = i
				cell.type = inputMap[i][j]

				this.map[i][j] = cell
				this.typesCells[cell.type].push(cell)
			}
		}


		// Возвращает объект клетки(Cell) по координатам (x, y)
		this.get = function(x, y){
			if(y >= this.map.length || x >= this.map[0].length) return null
			return this.map[y][x]
		}

		// Возвращает все объекты клетки типа tileType (new Cell[])
		this.getAllCellsByType = function(type){
			return this.typesCells[type]
		}

		// Возвращает все объекты клетки типа unitType (new Unit[])
		this.getAllCellHasUnits = function(type){
			let retArray = []
			for (let row of this.map){
				for (let cell of row){
					if(cell.hasUnit() && cell.unit.type === type){
						retArray.push(cell)
					}
				}
			}
			return retArray;
		}

		// Перемещает, если не может, возвращает null иначе клетку в которую переместил
		this.moveUnitFromCellToCoords = function(cellFrom, x, y){
			let cellTo = this.get(x, y)
			if(cellTo === null) return null;
			if(cellTo.hasUnit()) return null;
			cellTo.unit = cellFrom.unit
			cellFrom.unit = null
			return cellTo
		}

	}

	// Инициализация
	let random = new Math.seedrandom(seedRandom)
	let map = new MapObject(inputMap)

	const cardsParams = cardsJSON; // Описания карт

	let roundCounter = 0; // Увеличивать на 1 в конце спауна мобов
	const render = new Render()
	this.getRender = render
	this.getRandom = random
	render.renderMap(map);


	const cardsCount = 30;
	let cardsDeck = null // Колода карт по 8 карт



	// users: AbstractAgent[] array - инициализированные обьекты пользователей
	this.start = function(){
		// Генерация колоды
		cardsDeck = []
		for (let card in cardsParams) {
			for (let i = 0; i < (cardsCount/cardsParams.length)|0; i++) {
				cardsDeck.push(card)
			}
		}
		shakeArray(cardsDeck, random)

		// Начальный спаун мобов на рунах
		let runesFree = map.getAllCellsByType(tileType.Runes).filter(cell => !cell.hasUnit())
		for(let spawnCell of runesFree){
			render.initUnit(spawnCell.setUnit(new Unit(unitType.Creep)))
		}

		// Спаун героев
		let baseFree = map.getAllCellsByType(tileType.Base).filter(cell => !cell.hasUnit())
		shakeArray(baseFree, random)

		for(let user in users){
			render.initUnit(baseFree.pop().setUnit(new Unit(unitType.Hero)))
		}
		// Спаун бомбы
		render.initUnit(baseFree.pop().setUnit(new Unit(unitType.Bomb)))


		chooseСards();
	}




	// Функции стадий


	function lose(){
		render.defeat()
		render.showMessage("YOU LOSE")
	}


	///// Ассинхронный цикл. Начало
	function chooseСards(){
		let isFirstRound = roundCounter === 0

		let selectionCards = []
		
		let countCards = isFirstRound ? 10 : 5; // TODO: добавить еще условие для core карт

 		for (let i = 0; i < countCards && cardsDeck.length > 0; i++) {
			selectionCards.push(cardsDeck.pop())
		}

		let countGived = 0

		function select(userId = 0){
			if(selectionCards.length === 0) {
				lose()
				return
			}

			users[userId].selectCards( users.length === 1 ? (isFirstRound ? 2 : 4) : 1, selectionCards, function(selectedCards){

				for (let i = 0; i < selectedCards.length; i++) {
					selectionCards.splice(selectedCards[i], 1);
				}

				countGived += selectedCards.length;

				if(isFirstRound && countGived < (users.length * 2) || !isFirstRound && countGived < 4){
					select((userId + 1) % users.length);
				}
				else{
					programmingAct()
				}
			})
		}
		select()
	}


	function programmingAct(){
		let countUsers = 0

		for (let user of users) {
			user.programming(function(){
				countUsers++;
				if(countUsers === users.length){
					warriorsAct();
				}

			})
		}
	}



	function warriorsAct(){
		// Исполняется карта, верхняя в каждом стеке в порядке игроков

		(function act(userId = 0){


			
			if(userId + 1 < users.length){

				playСard(users[userId], card, function(){

					act(userId + 1);
				})


				
			}
			else{
				creepsMoveAct()
			}
		})()
	}

	function goRamming(startCell, endCell){
		// проверить есть ли позади или слева или справа бомба или герой
		// если есть и расстояние до клетки > 1, предложить выбрать кого тащить и на какую клетку перейти
		// затем изменить положение и отправить на анимацию
		
		//если есть впереди тот кого можно толкнуть, то суммарное количество существ,
		//которые переместятся вместе с юнитом должно быть меньше количества очков движения
		// например при 1 очке модно переместить только одного героя на 1 клетку
		// при 2-х 2 героя на 1 клетку или 1 на 2
		// при 3-х 3 героя на 1 клетку 2 на 2 или 1 на 3
		// при четырех   



		if(startCell.unit === unitType.Creep){
			attackCell(startCell)
		}
	}

	function attackCell(cell){ // удар по клетке
		if(cell.unit === unitType.Creep) {
			cell.unit = null
			render.killUnit(cell)
		}
		else if(cell.unit === unitType.Hero){
			playСard()
		}
	}


	function playСard(user, card, callback){ // исполнить карту

	}




	function creepsMoveAct(){ // Все делают шаг к бомбе

		let creepsCells = map.getAllCellHasUnits(unitType.Creep)
		let bombCells = map.getAllCellHasUnits(unitType.Bomb)

		for (let cellFrom of creepsCells) {
			let next = getNextCellFromAToB(cellFrom, bombCells[0]);
			let to = map.moveUnitFromCellToCoords(cellFrom, next.x, next.y)

			if(to !== null) render.moveUnit(cellFrom, to)
		}


		setTimeout(creepsSpawnAct, 1500)
	}


	function creepsSpawnAct(){
		let runesFree = map.getAllCellsByType(tileType.Runes).filter(cell => !cell.hasUnit())
		for(let spawnCell of runesFree){
			render.initUnit(spawnCell.setUnit(new Unit(unitType.Creep)))
		}

		creepsAttackAct()
	}


	function creepsAttackAct(){


		finalAct()
		

	}


	function finalAct(){
		users.unshift(users.pop())
		roundCounter++;

		chooseСards()
	}
	///// Ассинхронный цикл. Конец





}












//////////////// Функции Расширения

function getRandomInt(random, min, max) {
  return Math.floor(random() * (max - min)) + min
}


function shakeArray(a, random){
	a.sort(function () {
  		return random() - 0.5
	})
	return a
}

// Поворачивает вектор на определенный угол
function vectorRotate(a, angle){ // angle 0 - 0; 1 - 90; 2 - 180; 3 - 270
	for (var i = 0; i < a; i++) {
		let c = a.x
		a.x = a.y
		a.y = -c
	}
}




//a, b - {x:X, y:Y}
function getNextCellFromAToB(a, b){
	const vectorFromAToB = (a, b) => ({x:b.x-a.x, y:b.y-a.y})
	const vectorMultiple = (a, v) => ({x: a.x * v, y:a.y * v})
	const vectorAdd = (a, b)=>({x:b.x+a.x, y:b.y+a.y})
	const vectorRound = a => ({x: Math.round(a.x), y: Math.round(a.y)})
	const vectorLen = a => Math.sqrt(a.x*a.x+a.y*a.y)

	let v = vectorFromAToB(a, b)
	let l = vectorLen(v)

	let c = vectorMultiple(v, 1/l)
	c = vectorRound(c)

	if(c.x !== 0 && c.y !== 0) c.x = 0;

	return vectorAdd(a, c);
}
