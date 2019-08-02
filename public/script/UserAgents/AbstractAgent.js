"use strict"
// Абстрактный универсальный класс, представляющий обработку данных поступивших из ядра движка
// Все классы в папке UserAgents должны наследовать этот класс, 
// и реализовать все функции представленные здесь

// Этот класс отправляет запросы в GUI API graph.js

class AbstractAgent{

	constructor(){}

	selectCards(cards, callback){
		throw new Error('Method not implemented');
	}

	setHand(cardIds) {
		throw new Error('Method not implemented');
	}

	programming(callback){
		throw new Error('Method not implemented');
	}

	setStacks(stacks){
		throw new Error('Method not implemented');
	}

	chooseRotate(rotateArray, callback){
		throw new Error('Method not implemented');
	}

	selectCells(cellsArray, highlight, count, callback){
		throw new Error('Method not implemented');
	}

	selectStacks(cellsArray, count, callback) {
		throw new Error('Method not implemented');
	}

}