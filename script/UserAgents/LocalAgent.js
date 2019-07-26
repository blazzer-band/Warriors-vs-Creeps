"use strict"
// локальный пользователь получающий запросы(из ядра) на данные и управляющий рендером
// Для каждого локального хранится собственный класс в firebase

class LocalAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	// И отправить кроме этого в FireBase
	selectCards(cards, count, callback){
		let timerSecs = 60
		game.getRender.startTimer(timerSecs)

		setTimeout(function(){
			endSelect([0,1])
		}, timerSecs*1000)


		game.getRender.selectCards(cards, count, endSelect)
		
		function endSelect(callb){
			game.getRender.stopSelect()
			game.getRender.setHand(callb)
			game.getRender.stopTimer()
			callback(callb)
		}

	}



}