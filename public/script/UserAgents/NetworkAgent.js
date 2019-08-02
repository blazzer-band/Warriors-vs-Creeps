"use strict"
// пользователь получающий события через интернет
// Связан с таким-же классом на другом пк

class NetworkAgent extends AbstractAgent{

	constructor(connectedUserId){
		super();
		this.connectedUserId = connectedUserId;
	}

	selectCard(cards, callback){
		//this.callbackSelectCards = callback
		// Ждать изменения в Firebase, затем вернуть callback
		//callback(sel)
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