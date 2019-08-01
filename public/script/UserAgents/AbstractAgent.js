"use strict"
// Абстрактный универсальный класс, представляющий обработку данных поступивших из ядра движка
// Все классы в папке UserAgents должны наследовать этот класс, 
// и реализовать все функции представленные здесь

// Этот класс отправляет запросы в GUI API graph.js

class AbstractAgent{

	constructor(){
		this.callbackSelectCards = null;
		this.callbackProgramming = null;
		this.callbackWarriorAct = null;
		this.callbackCreepsAct = null;
	}


	selectCards(cards, count, callback){

	}

	setHand(cardIds) {

	}

	programming(callback){

	}

	setStacks(stacks){

	}


	chooseRotate(rotateArray, callback){

	}

	selectCells(cellsArray, highlight, count, callback) {

	}

}