// здесь вызывается отрисовка карты
function Render() {



	this.RenderMap = function(inputMap){
		let map = document.getElementById("game-map");
		let height = 6;
		let width = 12;
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				//map.children[0].children[j].children[i].innerHTML = game.map.Get(j, i).type;
				let tmp = inputMap.Get(i, j).type;
				if (tmp === 2) {
					let img = new Image(100, 100);
					img.src = "models/tmp files/skull_enemy.svg";
					map.children[0].children[i].children[j].appendChild(img);
				}
			}
		}
	}


	

}