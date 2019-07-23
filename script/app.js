"use strict"

function Game(content) {
	// id : {0: grass, 1: base, 2: runes, 3: target, 4: oil}

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

		/*for (l i = 0; i < Things.length; i++) {
			Things[i]
		};*/


		// Возвращает объект клетки(Cell) по координатам (x, y)
		this.Get = function(x, y){
			return this.map[x][y]
		}

		// Возвращает все объекты клетки типа type (array[])
		this.GetAll = function(type){

		}


	}



	/*for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[j].length; j++) {

			switch (inputMap[i][j]) {
				case 0:
					break;
				default:
					break;
			}

		}
	}*/

	this.Start = function(){

		


	}








}