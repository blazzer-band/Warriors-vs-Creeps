"use strict"
// бот, автоматически действующий как игрок

class BotAgent extends AbstractAgent{

	constructor(){
		super();
	}
	
	selectCards(cards, count, callback){
		let out = []
		for (var i = 0; i < count; i++) {
			out.push(i)
		}
		callback(out)
	}

	setHand(cardIds){
		console.log("Бот говорит что взял в руку карты:")
		console.log(cardIds)
	}


	setStacks(stacks){
		console.log("Бот говорит что его стеки выглядят так:")
		console.log(stacks)
	}

	programming(hands, callback){
		let out = []
		for (let i = 0; i < hands.length; i++) {
			out.push(-1)
		}
		callback(out)
	}


}