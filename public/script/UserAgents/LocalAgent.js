"use strict"
// локальный пользователь получающий запросы(из ядра) на данные и управляющий рендером
// Для каждого локального хранится собственный класс в firebase

class LocalAgent extends AbstractAgent{

	constructor(userIndicator){
		super();
		this.userIndicator = userIndicator;
		this.sendCount = 0
	}

	updateFirebase(action) {
		let db = firebase.database();
		let player = this.userIndicator;
		db.ref('Rooms/' + globalRoomIndicator + '/Game/Players/' + player  + '/Action').set(action);
		
	}

	serializeObject(name, data){
		let temp = {}
		temp[name] = data
		temp.cur = this.sendCount++
		console.log('Отправляется ', temp)
		return temp
	}


	selectCard(cards, callback){
		let agent = this;
		game.getRender.startTimer(600);
		game.getRender.selectCard(cards, endSelect);

		function endSelect(sel){
			game.getRender.stopSelect();
			game.getRender.stopTimer();
			agent.updateFirebase(agent.serializeObject('selectCard', sel))
			callback(sel);
		}
	}

	setHand(cardIds){
		game.getRender.setHand(cardIds)
	}


	programming(callback){
		let agent = this;
		game.getRender.programming(function(ret){
			agent.updateFirebase(agent.serializeObject('programming', ret))
			callback(ret)
		})
	}

	setStacks(stacks){
		game.getRender.setStacks(stacks)
	}

	chooseRotate(rotateArray, callback){
		let agent = this;
		game.getRender.chooseRotate(rotateArray, function(rotateId){
			agent.updateFirebase(agent.serializeObject('chooseRotate', rotateId))
			callback(rotateId);
		})
	}

	selectCells(cellsArray, highlight, count, callback) {
		let agent = this;
		game.getRender.selectCells(cellsArray, highlight, count, function(selSellsIds){
			agent.updateFirebase(agent.serializeObject('selectCells', selSellsIds))
			callback(selSellsIds);
		});
	}

	selectStacks(cellsArray, count, callback) {
		let agent = this;
		game.getRender.selectStacks(cellsArray, count, function(selectedStacksIds){
			agent.updateFirebase(agent.serializeObject('selectStacks', selectedStacksIds))
			callback(selectedStacksIds);
		});
	}
}