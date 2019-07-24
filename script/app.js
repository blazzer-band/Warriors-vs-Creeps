"use strict"

const tileType = {Grass:0, Base:1, Runes:2, Target:3/*, Oil:4*/}
const unitType = {Hero:0, Creep:1, Bomb:2}
const cardType = {Electro:0, Iron:1, Computer:2, Fire:3}
const phaseType = {WarriorsSelect:0, WarriorsProgram:1, WarriorsAction:2, CreepsMove:3, CreepsSpawn:4, CreepsAttack:5}
const userType = {Human:0, Bot:1, UserAgent:2}

function Game() {

	let seedRandom = 0 // Общее случайное число, получать его от хоста

	const inputMap = [ // Ландшафт
		[1, 0, 0, 0, 0, 2,  2, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 2, 2, 0],
		[1, 1, 1, 0, 0, 0,  0, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 0, 0,  0, 2, 0, 3, 0, 2],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 0, 2, 0],
		[1, 0, 0, 0, 0, 2,  0, 0, 0, 0, 0, 0]
	]

	function Unit(){
		this.type = null

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
		this.GetAllCells = function(type){
			return this.typesCells[tileType[type]]
		}

		// Возвращает все объекты клетки типа tileType (new Cell[])
		this.GetAllUnitsInRadius = function(type){
			return this.typesCells[tileType[type]]
		}

		// Возвращает все объекты клетки типа unitType (new Unit[])
		this.GetAllUnits = function(type){
			//return this.typesCells[tileType[type]]
		}

	}

	// Инициализация
	let random = new Math.seedrandom(seedRandom)
	this.map = new MapObject(inputMap)


	var graph = new Render()
	graph.RenderMap(this.map);

	// Глобальный цикл стадий
	let phase = phaseType.WarriorSelect

	// users: AbstractAgent[] array - инициализированные обьекты пользователей
	this.Start = function(users){
		


	}
	// Функции стадий

	function WarriorsSelect(){ // Выбор карт
		shakeArray(users, random)



	}



	function User(){
		this.agent = null // Класс с функциями запроса ввода и вывода от этого пользователя
		this.isHost = null

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
	arr.sort(function (a, b) {
  		return random() - 0.5
	})
	return arr
}


