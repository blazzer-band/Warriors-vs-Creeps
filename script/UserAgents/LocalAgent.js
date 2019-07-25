"use strict"
// пользователь получающий события через из ядра

class LocalAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	selectCards(cards, count, callback){
		game.getRender.selectCards(cards, count, function(callb) {
			
			game.getRender.stopSelect()

			callback(callb)
		})
	}



}