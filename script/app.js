"use strict"

function Game(content) {
	
	const tileType = {grass:0, base:1, runes:2, target:3, oil:4}
	const unitType = {hero:0, creep:1, bomb:2}

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
		this.map = {}

		for (let i = 0; i < inputMap.length; i++) {
			for (var j = 0; j < map[i].length; j++) {
				map[i][j]
			}
		}


		// Возвращает объект клетки(Cell) по координатам (x, y)
		this.Get = function(x, y){
			return this.map[x][y]
		}

		// Возвращает все объекты клетки типа type (array[])
		this.GetAll = function(type){

		}


	}

	this.Start = function(){

		


	}
}