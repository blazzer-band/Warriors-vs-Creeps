"use strict"
// пользователь получающий события через интернет
// Связан с таким-же классом на другом пк

class NetworkAgent extends AbstractAgent{

	constructor(){
		super();
	}

	selectCard(cards, callback){
		//this.callbackSelectCards = callback
		// Ждать изменения в Firebase, затем вернуть callback
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

	// onFirebaseUpdate(dassad){
	// 	(dassadif.pole == selectCards)
	// 		this.calbselectCards(dassad)
	// }

}