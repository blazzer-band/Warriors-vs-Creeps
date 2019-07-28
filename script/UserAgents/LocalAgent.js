"use strict"
// локальный пользователь получающий запросы(из ядра) на данные и управляющий рендером
// Для каждого локального хранится собственный класс в firebase

class LocalAgent extends AbstractAgent{

	constructor(){
		super();
	}

	// И отправить кроме этого в FireBase
	selectCards(cards, count, callback){
		let timerSecs = 600
		game.getRender.startTimer(timerSecs)

		let timeout = setTimeout(function(){
			let out = []
			for (var i = 0; i < count; i++) {
				out.push(i)
			}
			endSelect(out)
		}, timerSecs*1000)


		game.getRender.selectCards(cards, count, endSelect)

		function endSelect(callb){
			game.getRender.stopSelect()
			game.getRender.stopTimer()
			clearTimeout(timeout)

			callback(callb)
		}

	}

	setHand(cardIds){
		game.getRender.setHand(cardIds)
	}


	programming(hands, callback){
		game.getRender.programming(hands, callback)
	}

	setStacks(stacks){

		game.getRender.setStacks(stacks)
	}

	actionStack() {
		for (let i = 0; i < 6; i++) {
			game.getRender.actionStack(i);
		}
	}


}