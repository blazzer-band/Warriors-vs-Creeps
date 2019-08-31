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
		let roomDes = document.getElementById("room-description");
		roomDes.innerHTML = "";
		this.roomList.style.display = "block";
		let isHandled = false;
		let db = firebase.database();
		let rooms = document.getElementById("list-rooms");
		rooms.innerHTML = '';
		let list = db.ref('Rooms');
		list.on('child_added', handleEvent);
		list.on('child_removed', function(snapshot){
			for (let roomElem of rooms.children){
				if (roomElem.textContent === snapshot.key){
					roomElem.outerHTML = '';
					break;
				}
			}
		});

		function handleEvent(snapshot) {
			rooms.appendChild(document.createElement('div'));
			rooms.lastElementChild.textContent = snapshot.key;
			rooms.lastElementChild.className = "room-element";
			rooms.lastElementChild.onclick = function(e){
				let keyRoom = e.currentTarget.textContent;
				console.log(keyRoom);
					roomKey = snapshot.key.toString();
					activeRoom = snapshot.val().RoomId;
					console.log(activeRoom);
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
			};

		}

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
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Nickname").set(username);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Email").set(email);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/UserId").set(userId_);
				db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Host").set(isHost);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Nickname").set(username);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Action").set("atRoom");
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Host").set(isHost);
				db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/UserId").set(userId_);
			}
		});
		db.ref('Rooms/' + roomTitle + '/Game/Active').set(false);
		db.ref('Rooms/' + roomTitle + '/RoomId').set(userId);
		roomKey = roomTitle;
		globalRoomKey = roomKey;
		this.room = new RenderRoom(roomKey, this, this.userID);
		//this.room.loadUsers();
		this.hideLobby();
	}

	connectRoom(roomKey, selectedRoomID){
		globalRoomKey = roomKey;
		this.selectedRoomHostID = selectedRoomID;
		console.log(this.selectedRoomHostID);
		let db = firebase.database();
		let nameCreator = "user-" + this.userID;
		let root = db.ref("Users");
		let roomTitle = roomKey;
		let playersList = db.ref("Rooms/" + roomKey + "/Players");
		let playersCount = 0;
		playersList.on('child_added', function(){
			playersCount++;
		})

		if (playersCount < 4){
			root.on('child_added', function (snapshot) {
				if (snapshot.key.toString() === nameCreator) {
					let username = snapshot.val().Nickname;
					let email = snapshot.val().Email;
					let userId_ = snapshot.val().UserId;
					let isHost = false;
					let indicator = username + '-' + userId_;
					db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Nickname").set(username);
					db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Email").set(email);
					db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/UserId").set(userId_);
					db.ref('Rooms/' + roomTitle + "/Players/" + indicator + "/Host").set(isHost);
					db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Nickname").set(username);
					db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Action").set("atRoom");
					db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/Host").set(isHost);
					db.ref('Rooms/' + roomTitle + '/Game/Players/' + indicator + "/UserId").set(userId_);
				}
			});
			this.room = new RenderRoom(roomKey, this, this.selectedRoomHostID);
			// this.room.loadUsers();
			this.hideLobby();
		}

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
			let db = firebase.database();
			let roomId = db.ref("Rooms/" + room.roomKey + '/RoomId');
			roomId.once("value", function(snapshot){
				roomId = snapshot.val();
			});

			//if (globalUserIdWithoutNick === roomId){
				room.beginGame();
			//}
		}

		document.getElementById("make-bot").onclick = function(){
			let db = firebase.database();
			let roomId = db.ref("Rooms/" + room.roomKey + '/RoomId');
			roomId.once("value", function(snapshot){
			roomId = snapshot.val();
		});
			if (globalUserIdWithoutNick === roomId){
				room.makeBot();
			}
		}

		document.getElementById("go-lobby").onclick = function () {
			room.exitRoom(); //this.roomKey
		};

		//this.demotion();
	}

	// demotion(){
	// 	let db = firebase.database();
	// 	let roomId = db.ref("Rooms/" + this.roomKey + '/RoomId');
	// 	roomId.once("value", function(snapshot){
	// 		roomId = snapshot.val();
	// 	})
	//
	// 	if (globalUserIdWithoutNick !== roomId){
	// 		document.getElementById("play-game").disabled = true;
	// 		document.getElementById("play-game").style.opacity = ".3";
	// 		document.getElementById("make-bot").disabled = true;
	// 		document.getElementById("make-bot").style.opacity = ".3";
	// 	}
	// 	else {
	// 		document.getElementById("play-game").disabled = false;
	// 		document.getElementById("play-game").style.opacity = "";
	// 		document.getElementById("make-bot").disabled = false;
	// 		document.getElementById("make-bot").style.opacity = "";
	// 	}
	// }

	showRoom(){
		let roomList = document.getElementById("rooms");
		roomList.style.display = "none";
		let roomBlock = document.getElementById("room");
		roomBlock.style.display = "flex";
		let playersList = document.getElementById("players-list");
		let players = document.getElementsByClassName('player-name');
		for (let player of players){
			player.innerHTML = "Открыто";
		}
		this.loadUsers();
	}

	exitRoom() {
		let db = firebase.database();
		let roomId = db.ref('Rooms/' + this.roomKey + '/RoomId');
		let playersList = db.ref('Rooms/' + this.roomKey + '/Players');
		let host = db.ref('Rooms/' + this.roomKey + '/Players/' + this.roomKey);
		let hostChangded = false;
		//let hostRoomId = null;
		let hostTo = null;
		let room = this;

		playersList.on('child_added', function (snapshot){
			let name = snapshot.val();
			if (name.Nickname === '1Botb' || name.Nickname === '2Botb'
			|| name.Nickname === '3Botb' || name.Nickname === '4Botb'){

			}
			else if (name.UserId === globalUserIdWithoutNick) {
				//hostRoomId = name.userID;
				db.ref('Rooms/' + room.roomKey + '/Players/' + snapshot.key).remove();
			} else {
				db.ref('Rooms/' + room.roomKey + '/Players/' + snapshot.key + "/Host").set(true);
				hostTo = snapshot.val().UserId;
				hostChangded = true;
			}

		})

		if (!hostChangded){
			db.ref('Rooms/' + room.roomKey).remove();
		}
		else {
			db.ref('Rooms/' + room.roomKey + '/RoomId').set(hostTo);
		}

		room.disConnect();

	}

	disConnect() {
		lobby.showLobby();
		let roomCurrent = document.getElementById("room");
		roomCurrent.style.display = 'none';
	}

	loadUsers() {
		let room = this;
		let keyRoom = this.roomKey;
		console.log(keyRoom);
		let db = firebase.database();
		let param = db.ref('Rooms/' + keyRoom + '/Players')
		let players = document.getElementsByClassName('player-spot');
		let list = db.ref('Rooms');
		list.on('child_added', function (snapshot) {
			if (snapshot.key.toString() === keyRoom) {
				let list_players = db.ref('Rooms/' + snapshot.key + '/Players');
				let i = 0;
				list_players.on('child_added', function (snapshot) {
					players[i].textContent = snapshot.val().Nickname;
					players[i].style.color = 'black';
					i++;
				});
			}
		});
		param.on('child_removed', function (snapshot) {
			let playersList = document.getElementById("players-list");
			for (let player of playersList.children){
				if (player.textContent.search(snapshot.val().Nickname) >= 0){
					player.textContent = "Открыто";
				}
			}
			//room.demotion();
		});
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

		this.loadUsers();
	}

	//exit(){}
}
