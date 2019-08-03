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
		callback([0, getRandomInt(game.getRandom, -2, 6)]);

	}

	chooseRotate(rotateArray, callback){
		callback(0);
	}

	selectCells(arr, highlight, count, callback) {
		let selInds = []
		for (let i = 0; i < arr.length; i++) {
			selInds.push(i);
		}
		shakeArray(selInds, game.getRandom);
		let calAr = []
		for (let i = 0; i < count; i++) {
			calAr[i] = selInds[i];
		}
		callback(calAr);
	}

	selectStacks(arr, count, callback) {
		let selInds = []
		for (let i = 0; i < arr.length; i++) {
			selInds.push(i);
		}
		shakeArray(selInds, game.getRandom);
		let calAr = []
		for (let i = 0; i < count; i++) {
			calAr[i] = selInds[i];
		}
		callback(calAr);
	}

}
