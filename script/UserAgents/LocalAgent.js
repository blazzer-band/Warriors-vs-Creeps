"use strict"
// локальный пользователь получающий запросы(из ядра) на данные и управляющий рендером
// Для каждого локального хранится собственный класс в firebase

class LocalAgent extends AbstractAgent{

	constructor(roomIndicator, userIndicator, userId, isHost){
		super();
		this.roomIndicator = roomIndicator;
		this.userIndicator = userIndicator;
		this.userId = userId;
		this.isHost = isHost;
	}

	updateFirebase(action, callback) {
		let database = firebase.database();
		let roomTitle = this.roomIndicator;
		let player = this.userIndicator;
		database.ref('Rooms/' + roomTitle + '/Game/Players/' + player  + '/Action').set(action);
		return callback;
	}

	selectCards(cards, count, callback){
		game.getRender.startTimer(600);
		game.getRender.selectCards(cards, count, endSelect);

		function endSelect(){
			game.getRender.stopSelect();
			game.getRender.stopTimer();
			let callbackFire = this.updateFirebase("selectCards");
			callback(callbackFire);
		}
	}

	setHand(cardIds){
		game.getRender.setHand(cardIds)
	}


	programming(callback){
		game.getRender.programming(callback)
	}

	setStacks(stacks){
		game.getRender.setStacks(stacks)
	}


	chooseRotate(rotateArray, callback){
		game.getRender.chooseRotate(rotateArray, callback)
	}

	selectCells(cellsArray, highlight, count, callback) {
		game.getRender.selectCells(cellsArray, highlight, callback);
	}
}