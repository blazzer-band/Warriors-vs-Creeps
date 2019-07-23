"use strict"

function Game(content) {
	
	const tileType = {Grass:0, Base:1, Runes:2, Target:3, Oil:4}
	const unitType = {Hero:0, Creep:1, Bomb:2}
	const cardType = {Electro:0, Iron:1, Computer:2, Fire:3}
	const phaseType = {WarriorsSelect:0, WarriorsProgram:1, WarriorsAction:2, CreepsMove:3, CreepsSpawn:4, CreepsAttack:5}
	const userType = {Human:0, Bot:1, UserAgent:2}
	let seedRandom = 0 // Общее случайное число, получать его от хоста

	const inputMap = [ // Ландшафт
		[1, 0, 0, 0, 0, 2,  2, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0,  4, 2, 0, 2, 2, 0],
		[1, 1, 1, 0, 0, 0,  4, 0, 0, 0, 0, 0],
		[1, 1, 1, 0, 0, 0,  0, 2, 0, 3, 0, 2],
		[1, 1, 0, 0, 0, 0,  0, 2, 0, 0, 2, 0],
		[1, 0, 0, 0, 0, 2,  0, 0, 0, 0, 0, 0]
	]

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

		// Возвращает все объекты клетки типа type (new array[Cells])
		this.GetAll = function(type){
			return this.typesCells[tileType[type]]
		}


	}
	// Подключение пользователей
	//let users = 

	// Инициализация
	let random = new Math.seedrandom(seedRandom)
	let map = new MapObject(inputMap)
	// Отрисовка карты и сброс интерфейса
	//ResetGame()
	//DrawMap(inputMap)

	// Глобальный цикл стадий
	let phase = phaseType.WarriorSelect

	


	while (false) {

		// WarriorsSelect
		/*for (let user of ) {
			
		};*/





	}


	this.Start = function(){}

}




function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}