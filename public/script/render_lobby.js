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
	}

    showDescription(){

	}

	showLobby(){
		this.roomList.style.display = "block";
		let db = firebase.database();
		let rooms = document.getElementById("list-rooms");
		let list = db.ref('Rooms');
		list.on('child_added', function (snapshot) {
			console.log(snapshot.key);
			rooms.appendChild(document.createElement('div'));
			rooms.lastElementChild.textContent = snapshot.key;
			rooms.lastElementChild.style.color = 'white';
			rooms.lastElementChild.className = "room-element";
			rooms.lastElementChild.onclick = function(e){
				let keyRoom = e.currentTarget.textContent;
				console.log(keyRoom);
				let db = firebase.database();
				let list = db.ref('Rooms');
				list.on('child_added', function (snapshot) {
					if (snapshot.key.toString() === keyRoom) {
						activeRoom = snapshot.val().RoomId;
						console.log(activeRoom);
					}
				});
			};
		});
	}

	hideLobby(){
		this.roomList.style.display = "none";
	}

	createRoom(){
		this.room = new RenderRoom(this, this.userID, true);
		let db = firebase.database();
		let roomTitle = "room-" + this.userID;
		let nameCreator = "user-" + this.userID;
		let root = db.ref("Users");
		let userId = this.userID;
		root.on('child_added', function (snapshot) {
			console.log(snapshot.key);
			if (snapshot.key.toString() === nameCreator) {
				let username = snapshot.val().Nickname;
				let email = snapshot.val().Email;
				let userId_ = snapshot.val().UserId;
				let ishost = true;
				db.ref('Rooms/' + roomTitle + "/Players/" + username + "/Email").set(email);
				db.ref('Rooms/' + roomTitle + "/Players/" + username + "/UserId").set(userId_);
				db.ref('Rooms/' + roomTitle + "/Players/" + username + "/Host").set(ishost);
				db.ref('Rooms/' + roomTitle + "/Players/" + username + "/Nickname").set(username);
			}
		});
		db.ref('Rooms/' + roomTitle + '/Game/Active').set(false);
		// game - players
		db.ref('Rooms/' + roomTitle + '/RoomId').set(userId);
		this.hideLobby();
	}

	connectRoom(selectedRoomID){
		this.selectedRoomHostID = selectedRoomID;
		let db = firebase.database();
		let nameCreator = "user-" + this.userID;
		let root = db.ref("Users");
		let roomTitle = 'room-' + this.selectedRoomHostID;
		root.on('child_added', function (snapshot) {
			if (snapshot.key.toString() === nameCreator) {
				let name = 'user-' + snapshot.val().UserId;
				let username = snapshot.val().Nickname;
				let email = snapshot.val().Email;
				let userId_ = snapshot.val().UserId;
				let ishost = false;
				db.ref('Rooms/' + roomTitle + "/Players/" + name + "/Email").set(email);
				db.ref('Rooms/' + roomTitle + "/Players/" + name + "/UserId").set(userId_);
				db.ref('Rooms/' + roomTitle + "/Players/" + name + "/Host").set(ishost);
				db.ref('Rooms/' + roomTitle + "/Players/" + name + "/Nickname").set(username);
				// game ++ players
				this.room = new RenderRoom(this, this.selectedRoomHostID, false);
				this.roomList.hideLobby();
			}
		});
	}


}

class RenderRoom{

	constructor(id, isHost){
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
		let keyRoom = 'room-' + this.id;
		console.log(keyRoom);
		let db = firebase.database();
		let list = db.ref('Rooms');
		list.on('child_added', function (snapshot) {
			if (snapshot.key.toString() === keyRoom) {
				let list_players = db.ref('Rooms/' + keyRoom + '/Players');
				let i = 0;
				let players = document.getElementsByClassName('player-name');
				list_players.on('child_added', function (snapshot) {
					players[i].textContent = snapshot.val().Nickname;
					i++;
				});
			}
		});
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
