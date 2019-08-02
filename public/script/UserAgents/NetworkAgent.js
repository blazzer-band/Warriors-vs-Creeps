"use strict"
// пользователь получающий события через интернет
// Связан с таким-же классом на другом пк

class NetworkAgent extends AbstractAgent{

	constructor(connectedUserId){
		super();
		this.callbackSelectCards = null;
		this.callbackProgramming = null;
		this.callbackWarriorAct = null;
		this.callbackCreepsAct = null;
		this.connectedUserId = connectedUserId;

		let db = firebase.database();
		let list = db.ref('Rooms/'+activeRoom+'/Game/Players/' + connectedUserId+'/Action');
		list.on('child_changed', function (data){
			console.log(data);
		})
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