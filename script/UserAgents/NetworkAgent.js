"use strict"
// пользователь получающий события через интернет
// Связан с таким-же классом на другом пк

class NetworkAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	selectCards(cards, count, callback){
		game.getRender.selectCards(cards)

		// Ждать изменения в Firebase, затем вернуть callback
	}



}