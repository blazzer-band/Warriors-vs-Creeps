"use strict"
// бот, автоматически действующий как игрок

class BotAgent extends AbstractAgent{

	constructor(){
		super();
	}

	selectCard(cards, callback){
		callback(0)
	}

	setHand(cardIds){
		console.log("Бот говорит что взял в руку карты:")
		console.log(cardIds)
	}


	setStacks(stacks){
		console.log("Бот говорит что его стеки выглядят так:")
		console.log(stacks)
	}

	programming(callback){
		callback([0, -1]);

	}

	chooseRotate(rotateArray, callback){
		callback(0);
	}

	selectCells(cellsArray, highlight, count, callback) {
		let calAr = []
		for (let i = 0; i < count; i++) {
			calAr[i] = i;
		}
		callback(calAr);
	}

	selectStacks(cellsArray, count, callback) {
		let calAr = []
		for (let i = 0; i < count; i++) {
			calAr[i] = i;
		}
		callback(calAr);
	}

}
