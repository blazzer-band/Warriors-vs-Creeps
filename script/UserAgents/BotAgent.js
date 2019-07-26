"use strict"
// бот, автоматически действующий как игрок

class BotAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	selectCards(cards, count, callback){
		callback([0,1])
	}

	setHand(cardIds){
		console.log("Бот говорит что взял в руку карты:")
		console.log(cardIds)
	}


}