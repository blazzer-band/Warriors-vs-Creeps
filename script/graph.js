// здесь вызывается отрисовка карты
function Render() {


    let map = document.getElementById("game-map");

	this.RenderMap = function(inputMap){
    	let map = document.getElementById("game-map");
		let height = 6;
		let width = 12;

		for (let i = 0; i < height; i++) {
			map.children[0].appendChild(document.createElement("tr"));
			for (let j = 0; j < width; j++) {
				map.children[0].lastChild.appendChild(document.createElement("td"));
			}
		}

		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				let tmp = inputMap.Get(i, j).type;
				let img = new Image(120, 120);
				if (tmp === 0) {
					img.src = "tmp_models/green.jpg";
				} else if (tmp === 1) {
					img.src = "tmp_models/gray.jpeg";
				} else if (tmp === 2) {
					img.src = "tmp_models/yellow.jpg";
				} else if (tmp === 3) {
					img.src = "tmp_models/blue.jpg";
				}
				map.children[0].children[i].children[j].appendChild(img);
			}
		}
	}

	
	// Unit 
	// cellOut.HasUnit тип получать cellOut.unit.type - тип юнита
	// const unitType = {Hero:0, Creep:1, Bomb:2} - юнит
	// cellOut.x cellOut.y - координаты

	// передвинуть юнита из in в out
	this.MoveUnit = function(cellIn, cellOut){


	}

	// нарисовать юнита который есть в ячейке
	this.InitUnit = function(cell){

        let img = new Image(120, 120);
	    switch (cell.unit.type) {
            case 0:
                img.src = "models/tmp files/man-with-sword-and-shield.svg";
                map.children[0].children[cell.y].children[cell.x].appendChild(img);
                break;
            case 1:
                img.src = "models/tmp files/enemy_icon.svg";
                map.children[0].children[cell.y].children[cell.x].appendChild(img);
                break;
            case 2:
                break;
        }

	}
	

    

}