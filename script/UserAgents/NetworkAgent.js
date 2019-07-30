"use strict"
// пользователь получающий события через интернет
// Связан с таким-же классом на другом пк

class NetworkAgent extends AbstractAgent{

	constructor(){
		super();
		this.calbselectCards = null;
		this.Firebaseid = null;
	}
	
	selectCards(cards, count, callback){
		//game.getRender.selectCards(cards)
		this.calbWAit = callback
		// Ждать изменения в Firebase, затем вернуть callback



	}

	onFirebaseUpdate(dassad){
		(dassadif.pole == selectCards)
			this.calbselectCards(dassad)
	}



}