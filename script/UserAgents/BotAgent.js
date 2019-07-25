"use strict"
// бот, автоматически действующий как игрок

class BotAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	selectCards(cards, count, callback){
		callback([0,1])
	}



}