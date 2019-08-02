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
			rooms.lastElementChild.className = "room-element";
			rooms.lastElementChild.onclick = function(e){
				let keyRoom = e.currentTarget.textContent;
				console.log(keyRoom);
				let db = firebase.database();
				let list = db.ref('Rooms');
				list.on('child_added', function (snapshot) {
					if (snapshot.key.toString() === keyRoom) {
						roomKey = snapshot.key.toString();
						activeRoom = snapshot.val().RoomId;
						console.log(activeRoom);
						let roomDes = document.getElementById("room-description");
						roomDes.innerHTML = "";
						let playersCell = db.ref("Rooms/" + roomKey + "/Players");
						let playersList = [];
						let playersCount = 0;

						playersCell.on("child_added", function(player){
							playersList.push(player.val().Nickname);
							playersCount++;
						})

						roomDes.appendChild(document.createElement("span"));
						roomDes.lastChild.className = "span-dis";
						roomDes.lastChild.textContent = "1. Количество игроков в комнате: " + playersCount + "/4;";

						roomDes.appendChild(document.createElement("span"));
						roomDes.lastChild.textContent = "2. Игроки в комнате: ";
						roomDes.lastChild.className = "span-dis";
						for (let i = 0; i < playersList.length; i++){
							roomDes.appendChild(document.createElement("span"));
							roomDes.lastChild.className = "span-dis";
							roomDes.lastChild.style.left = "50px";
							roomDes.lastChild.textContent = "\t" + i + ": " + playersList[i] + ";";
						}

						roomDes.appendChild(document.createElement("span"));
						roomDes.lastChild.className = "span-dis";
						roomDes.lastChild.textContent = "3. Тип миссии: Bomb Keepers;";
					}
				});
			};
		});
	}

	hideLobby(){
		this.roomList.style.display = "none";
	}

	createRoom(){
		let db = firebase.database();
		let roomTitle = null;
		while (roomTitle === null)
			roomTitle = prompt("Название вашей комнаты:", "Room-" + this.userID);
		let nameCreator = "user-" + this.userID;
		let root = db.ref("Users");
		let userId = this.userID;
		root.on('child_added', function (snapshot) {
			console.log(snapshot.key);
			if (snapshot.key.toString() === nameCreator) {
				let username = snapshot.val().Nickname;
				let email = snapshot.val().Email;
				let userId_ = snapshot.val().UserId;
				let isHost = true;
				let indicator = username + '-' + userId_;
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Email").set(email);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/UserId").set(userId_);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Host").set(isHost);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Nickname").set(username);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Action").set("atRoom");
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Host").set(isHost);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Nickname").set(username);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/UserId").set(userId_);
			}
		});
		db.ref('Rooms/' + roomTitle + '/Game/Active').set(false);
		db.ref('Rooms/' + roomTitle + '/RoomId').set(userId);
		roomKey = roomTitle;
		this.room = new RenderRoom(roomKey, this, this.userID);
		this.hideLobby();
	}

	connectRoom(roomKey, selectedRoomID){
		this.selectedRoomHostID = selectedRoomID;
		console.log(this.selectedRoomHostID);
		let db = firebase.database();
		let nameCreator = "user-" + this.userID;
		let root = db.ref("Users");
		let roomTitle = roomKey;
		root.on('child_added', function (snapshot) {
			if (snapshot.key.toString() === nameCreator) {
				let username = snapshot.val().Nickname;
				let email = snapshot.val().Email;
				let userId_ = snapshot.val().UserId;
				let isHost = false;
				let indicator = username + '-' + userId_;
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Email").set(email);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/UserId").set(userId_);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Host").set(isHost);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Nickname").set(username);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Action").set("atRoom");
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Host").set(isHost);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Nickname").set(username);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/UserId").set(userId_);
			}
		});
		this.room = new RenderRoom(roomKey, this, this.selectedRoomHostID);
		this.hideLobby();
	}


}

class RenderRoom{

	constructor(roomKey, lobby, id){
		this.roomKey = roomKey;
		let room = this;
		this.id = id;
		this.count = 1;
		this.botsCount = 0;
		this.showRoom();
		document.getElementById("play-game").onclick = function () {
			room.beginGame();
		};

		document.getElementById("make-bot").onclick = function(){
			room.makeBot();
		}
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
		this.loadUsers();
	}

	loadUsers() {
		let keyRoom = this.roomKey;
		console.log(keyRoom);
		let db = firebase.database();
		let list = db.ref('Rooms');
		list.on('child_added', function (snapshot) {
			if (snapshot.key.toString() === keyRoom) {
				let list_players = db.ref('Rooms/' + snapshot.key + '/Players');
				let i = 0;
				let players = document.getElementsByClassName('player-name');
				list_players.on('child_added', function (snapshot) {
					players[i].textContent = snapshot.val().Nickname;
					players[i].style.color = 'black';
					i++;
				});
			}
		});
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
		this.loadUsers();
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
		this.loadUsers();
	}

	setColor(playerSpot, color){
		let playersList = document.getElementById("players-list");
		let colorPicker = playersList.children[playerSpot].children[1].children[0];
		colorPicker.style.backgroundColor = color;
	}

	beginGame(){
		let db = firebase.database();
		db.ref('Rooms/' + this.roomKey + '/Game/Active').set(true);
		game = new Game();
		let content = document.getElementById("content");
		let lobby = document.getElementById("lobby");
		lobby.style.display = "none";
		content.style.display = "block";
		let countPlayers = 0;
		let roomIndicator = this.roomKey;
		globalRoomIndicator =  roomIndicator;
		let usersIndicator = [];
		let users = db.ref('Rooms/' + roomIndicator + '/Players');
		users.on('child_added', function (snapshot) {
			usersIndicator.push(snapshot.key);
			countPlayers++;
		});
		console.log(usersIndicator);
		game.start(usersIndicator);
		//for all users
		//database.ref('Rooms/' + roomTitle + '/Game/Players/' + player  + '/Action').set("start");
	}

	makeBot(){
		let db = firebase.database();
		let playersList = db.ref("Rooms/" + this.roomKey + "/Players");
		let playersCount = 0;
		playersList.on('child_added', function(){
			playersCount++;
		})

		if (playersCount < 4){
			this.botsCount++;
			this.count++;
			let botName = this.botsCount + "Botb";
			db.ref("Rooms/" + this.roomKey + "/Players/" + botName + "/Nickname").set(botName);
		}
	}

	//exit(){}
}
