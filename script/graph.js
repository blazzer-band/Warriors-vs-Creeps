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


    const units = {
        0 : "models/tmp files/man-with-sword-and-shield.svg",
        1 : "models/tmp files/enemy_icon.svg",
        2 : "models/tmp files/bomb_icon.svg"
    };

    // передвинуть юнита из in в out
    this.MoveUnit = function(cellIn, cellOut) {

        let element1 = map.children[0].children[cellIn.y].children[cellIn.x];
        let element2 = map.children[0].children[cellOut.y].children[cellOut.x];

        let from_x = element1.offsetLeft;
        let from_y = element1.offsetParent.offsetTop;

        let to_x = element2.offsetLeft;
        let to_y = element2.offsetParent.offsetTop;

        let el = document.createElement("img");
        map.appendChild(el)
        el.style.position = "absolute";
        //el.style.top = from_y + "px";
        //el.style.left = from_x + "px";
        el.src = units[cellOut.unit.type];
        //el.style.transition = "top 1s linear";
        el.style.transition = "left 1s linear";

       // el.style.transform = "translateX(-110px)";
        el.style.top = to_y + "px";
        el.style.left = to_x + "px";
    }

    // нарисовать юнита который есть в ячейке
    this.InitUnit = function(cell) {

	    let img = new Image(120, 120);
        img.src = units[cell.unit.type];
        map.children[0].children[cell.y].children[cell.x].appendChild(img);
	}
	

    

}