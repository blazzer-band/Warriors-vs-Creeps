"use strict"
// локальный пользователь получающий запросы(из ядра) на данные и управляющий рендером
// Для каждого локального хранится собственный класс в firebase

class LocalAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	// И отправить кроме этого в FireBase
	selectCards(cards, count, callback){
		game.getRender.selectCards(cards, count, function(callb) {

			game.getRender.stopSelect()
			game.getRender.setHand(callb)

			callback(callb)
		})
	}



}