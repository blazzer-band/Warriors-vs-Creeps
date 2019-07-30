'use strict'
class RenderLobby{

	constructor(userID){
		this.room = null;
		this.selectedRoomHostID = null;
		this.userID = userID;
		///Отображение списка комнат и получение данных от FB
		this.roomList = document.getElementById("rooms");
		this.showLobby();
	}


	updateRoomsList(){
		///Вызывается от сервера
		//П
	}

    showDescription(){

	}

	showLobby(){
		this.roomList.style.display = "block";
	}

	hideLobby(){
		this.roomList.style.display = "none";
	}

	createRoom(){
		this.room = new RenderRoom(this, this.userID, true); //this.UserID
		this.hideLobby();
	}

	connectRoom(){
		if (this.selectedRoom === null) return;
		this.room = new RenderRoom(this, this.selectedRoomHostID, false); //this.selectedRoom == HostUserID
		this.hideLobby();
	}


}

class RenderRoom{

	constructor(lobby, id, isHost){
		let room = this;
		this.id = id;
		this.showRoom();
		document.getElementById("play-game").onclick = function (e) {room.beginGame()};
	}


	static get COLORS(){
		return ["red", "blue", "aqua", "yellow", "black", "orange"];
	}

	showRoom(){
		let roomList = document.getElementById("rooms");
		roomList.style.display = "none";
		let roomBlock = document.getElementById("room");
		roomBlock.style.display = "flex";
		this.makePalette(4);
	}

	makePalette(count){
		let room = this;
		let playersList = document.getElementById("players-list");
		for (let i = 0; i < count; i++){
			let colorPicker = playersList.children[i].children[1].children[0];
			colorPicker.style.backgroundColor = RenderRoom.COLORS[i];
			colorPicker.onclick = function(e) {room.showPalette(i)};
			colorPicker.style.zIndex = 1488 + i;
			let palette = colorPicker.children[0];
			for (let j = 0; j < RenderRoom.COLORS.length; j++){
				palette.appendChild(document.createElement("div"));
				palette.children[j].style.width = "20px";
				palette.children[j].style.height = "20px";
				palette.children[j].style.backgroundColor = RenderRoom.COLORS[j];
				palette.children[j].style.marginBottom = "1px";
				palette.children[j].style.marginTop = "1px";
				palette.children[j].onclick = function(e) {room.setColor(i, palette.children[j].style.backgroundColor)};
			}
			if (i !== 0){playersList.children[i].children[1].style.display = "none"}
		}
	}

	showPalette(i){
		let playersList = document.getElementById("players-list");
		let palette = playersList.children[i].children[1].children[0].children[0];
		if ((palette.style.display === "") || (palette.style.display === "none")){
			palette.style.display = "block";
		}
		else {
			palette.style.display = "none";
		}
	}

	setColor(playerSpot, color){
		let playersList = document.getElementById("players-list");
		let colorPicker = playersList.children[playerSpot].children[1].children[0];
		colorPicker.style.backgroundColor = color;
	}

	beginGame(){
		game = new Game();
		let content = document.getElementById("content");
		let lobby = document.getElementById("lobby");
		lobby.style.display = "none";
		content.style.display = "block";
		game.start();
	}

	exit(){
		//
	}
}
