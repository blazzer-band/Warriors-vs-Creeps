"use strict"

const tileType = {Grass:0, Base:1, Runes:2, Target:3}
const unitType = {Hero:0, Creep:1, Bomb:2}
const cardType = {Electro:0, Iron:1, Computer:2, Fire:3}
const phaseType = {WarriorsSelect:0, WarriorsProgram:1, WarriorsAction:2, CreepsMove:3, CreepsSpawn:4, CreepsAttack:5}
const userType = {Human:0, Bot:1, UserAgent:2}


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
					for (let i in sels) {
						user.hand.push(cards[sels[i]])
					}
					callback(sels)
				})
			}
			
		}

		programming(){

		}

	}


	let users = [] // Пользователи
	this.getUsers = users
	{
		let testUserAgent = new LocalAgent()
		let testUser = new User(true)
		testUser.agent = testUserAgent
		users.push(testUser)
	}
	{
		let testUserAgent = new BotAgent()
		let testUser = new User(false)
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
			return this.map[x][y]
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
					if(cell.HasUnit() && cell.unit.type === type){
						retArray.push(cell)
					}
				}
			}
			return retArray;
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



	const cardsCount = 96
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
	function chooseСards(){ // 1. Выбор карт
		let isFirstRound = roundCounter === 0

		
		shakeArray(users, random)
		
		//Подготовить 10 или 5 карт
		let selectionCards = []
		for (var i = 0; i < (isFirstRound ? 10 : 5); i++) {
			selectionCards.push(cardsDeck.pop())
		}


		//let userId = 0; // Пользователь выбирающий карту

		
		// Выбирать по очереди
		(function select(userId = 0){
			// Предоставить выбор пользователю users[userId]

			users[userId].selectCards(1 + isFirstRound, selectionCards, function(selectedCards){

				//selectionCards = selectionCards.filter(cardId => !selectedCards.includes(cardId))

				for(var i in selectedCards){
					selectionCards.splice(selectedCards[i], 1);
				}

				if(userId + 1 < users.length){
					select(userId + 1);
				}
				else{
					programmingAct()
				}
			})

		})()

	}


	function programmingAct(){
		let countUsers = 0

		for (let user of users) {
			user.programming(function(){

				countUsers++;

				if(countUsers === users.length){
					warriorsAct()
				}

			})
		}


	}

	function warriorsAct(){


	}







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