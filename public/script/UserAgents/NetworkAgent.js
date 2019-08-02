"use strict"
// пользователь получающий события через интернет
// Связан с таким-же классом на другом пк

class NetworkAgent extends AbstractAgent{

	constructor(connectedUserId){
		super();
		let agent = this;

		this.connectedUserId = connectedUserId;

		let db = firebase.database();
		let act = db.ref('Rooms/' + globalRoomKey + '/Game/Players/' + connectedUserId + '/Action');

		this.methodNames = Object.getOwnPropertyNames(NetworkAgent.prototype);
		this.callbStore = {};

		for (let methName of this.methodNames) {
			this.callbStore[methName] = null;
		}

		act.on('value', function(data){
			let v = data.val();
			if(v === null) return;
			console.log('пришло ', v)
			let funcName = Object.keys(v).filter(val => val !== 'cur')[0];
			let callbFunc = agent.callbStore[funcName]
			if(callbFunc !== undefined && callbFunc !== null){
				callbFunc(v[funcName])
			}
			agent.callbStore[funcName] = null;
		})
	}

	selectCard(cards, callback){
		this.callbStore['selectCard'] = callback;
	}

	setHand(cardIds) {
		

	}

	programming(callback){
		this.callbStore['programming'] = callback;
	}

	setStacks(stacks){
	}

	chooseRotate(rotateArray, callback){
		this.callbStore['chooseRotate'] = callback;
	}

	selectCells(cellsArray, highlight, count, callback) {
		this.callbStore['selectCells'] = callback;
	}

	// onFirebaseUpdate(dassad){
	// 	(dassadif.pole == selectCards)
	// 		this.calbselectCards(dassad)
	// }

}