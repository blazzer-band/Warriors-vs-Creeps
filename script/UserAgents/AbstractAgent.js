"use strict"
// Абстрактный универсальный класс, представляющий обработку данных поступивших из ядра движка
// Все классы в папке UserAgents должны наследовать этот класс, 
// и реализовать все функции представленные здесь

// Этот класс отправляет запросы в GUI API graph.js

class AbstractAgent{

	constructor(type){
		this.type = type
	}

	// callback(cardsIds[])
	SelectCards(count, cards, callback){

		//return selectedIds = []
	}



}