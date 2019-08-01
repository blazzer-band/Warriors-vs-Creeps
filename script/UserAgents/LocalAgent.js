"use strict"
// локальный пользователь получающий запросы(из ядра) на данные и управляющий рендером
// Для каждого локального хранится собственный класс в firebase

class LocalAgent extends AbstractAgent{

	constructor(){
		super();
	}

	// И отправить кроме этого в FireBase
	selectCards(cards, count, callback){
		//// Debug
		/*let out = []
		for (var i = 0; i < count; i++) {
			out.push(i)
		}
		callback(out)
		return*/
		/////


		game.getRender.startTimer(600)
		game.getRender.selectCards(cards, count, endSelect)

		function endSelect(callb){
			game.getRender.stopSelect()
			game.getRender.stopTimer()
			callback(callb)

		}

	}

	setHand(cardIds){
		game.getRender.setHand(cardIds)
	}


	programming(callback){
		//
		/*callback(0, -2);*/
		//DEBUG
		game.getRender.programming(callback)
	}

	setStacks(stacks){
		game.getRender.setStacks(stacks)
	}


	chooseRotate(rotateArray, callback){
		game.getRender.chooseRotate(rotateArray, callback)
	}

	selectCells(cellsArray, highlight, count, callback) {
		game.getRender.selectCells(cellsArray, highlight, count, callback);
	}

	selectStacks(stacks, count, callback){
		game.getRender.selectStacks(stacks, count, callback)
	}
}
