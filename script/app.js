"use strict"

const tileType = {Grass:0, Base:1, Runes:2, Target:3}
const unitType = {Hero:0, Creep:1, Bomb:2}
const cardType = {Electro:0, Iron:1, Computer:2, Fire:3}
const phaseType = {WarriorsSelect:0, WarriorsProgram:1, WarriorsAction:2, CreepsMove:3, CreepsSpawn:4, CreepsAttack:5}
const userType = {Human:0, Bot:1, UserAgent:2}


function Game() {

	class User{
		constructor(id, isHost){
			this.isHost = isHost
			this.id = id
			this.hand = [] // Карты в руке, int id типы карт
			this.stacks = [] // Массив 6x3 карт в стеках [ [top1,center1,down1], [top2,center2,down2], ... ] int id типы карт
			this.agent = null
		}

		// возвращает текущего пользователя закончившего ход
		SelectCards(count, cards, callback){

			this.agent.SelectCards(count, cards, function(sels){
				hand.push(sels)
				callback(this)
			})
			
		}
	}


	let users = [] // Пользователи
	{
		let testUserAgent = new LocalAgent(userType.Human)
		let testUser = new User(0, true)
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

		this.Rotate = function(angle){  // 1: 90, 2: 180, 3: -90(270)
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

			this.HasUnit = function(){
				return this.unit !== null
			}

			this.SetUnit = function(unit){
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
		this.Get = function(x, y){
			return this.map[x][y]
		}

		// Возвращает все объекты клетки типа tileType (new Cell[])
		this.GetAllCellsByType = function(type){
			return this.typesCells[type]
		}

		// Возвращает все объекты клетки типа unitType (new Unit[])
		this.GetAllCellHasUnits = function(type){
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
	render.RenderMap(map);


	let phase = null// Текущая фаза

	const cardClonesCount = 8
	let cardsDeck = null // Колода карт по 8 карт 

	

	// users: AbstractAgent[] array - инициализированные обьекты пользователей
	this.Start = function(){
		// Генерация колоды
		cardsDeck = []
		for (let card in cardsParams) {
			for (let i = 0; i < cardClonesCount; i++) {
				cardsDeck.push(card)
			}
		}
		shakeArray(cardsDeck, random)

		// Начальный спаун мобов на рунах
		for(let spawnCell of map.GetAllCellsByType(tileType.Runes)){
			if(spawnCell.HasUnit()) continue;
			spawnCell.SetUnit(new Unit(unitType.Creep))
			render.InitUnit(spawnCell)
		}

		// Спаун героев
		let baseFree = map.GetAllCellsByType(tileType.Base).filter(cell => !cell.HasUnit())
		shakeArray(baseFree, random)

		for(let user in users){
			render.InitUnit(baseFree.pop().SetUnit(new Unit(unitType.Hero)))
		}
		// Спаун бомбы
		render.InitUnit(baseFree.pop().SetUnit(new Unit(unitType.Bomb)))
		

		WarriorsSelect()
	}




	// Функции стадий
	function WarriorsSelect(){ // 1. Выбор карт

		let counterReady = 0; // Пользователь выбирающий карту

		shakeArray(users, random)
		phase = phaseType.WarriorSelect


		/*for (let user of users) {
			if(roundCounter === 0){
				user.SelectCards(2, cardsDeck,)
			}
			
		}*/

		// Ждать всех игроков
		function Select(){}


	}







	// Карта с определенным эффектом
	function Card(){
		this.id = null

	}






}


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