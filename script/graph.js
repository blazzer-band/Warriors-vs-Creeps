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
                let img = new Image();
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
	// cellTo.HasUnit тип получать cellTo.unit.type - тип юнита
	// const unitType = {Hero:0, Creep:1, Bomb:2} - юнит
	// cellTo.x cellTo.y - координаты


    const units = {
        0 : "models/tmp files/man-with-sword-and-shield.svg",
        1 : "models/tmp files/enemy_icon.svg",
        2 : "models/tmp files/naval_mine.png"
    };

    // передвинуть юнита из in в out
    this.MoveUnit = function(cellFrom, cellTo) {

        let fromElem = map.children[0].children[cellFrom.y].children[cellFrom.x];
        let toElem = map.children[0].children[cellTo.y].children[cellTo.x];

        let from_x = fromElem.offsetLeft;
        let from_y = fromElem.parentElement.offsetTop;

        let to_x = toElem.offsetLeft;
        let to_y = toElem.parentElement.offsetTop;

        let el = fromElem.lastChild

        el.style.zIndex = '9';
        el.style.transition = "transform 1s";
        el.style.transform = 'translateY('+ (to_y-from_y) +'px)';
        el.style.transform += 'translateX('+ (to_x-from_x) +'px)';


        setTimeout(function(){
        	toElem.appendChild(el)
        	el.style.transform = 'translateY(0px)';
        	el.style.transform += 'translateX(0px)';
        }, 1000)


    }

    // нарисовать юнита который есть в ячейке
    this.InitUnit = function(cell) {

	    let img = new Image(120, 120);
        img.src = units[cell.unit.type];
        map.children[0].children[cell.y].children[cell.x].appendChild(img);
	}

	const chooseCards = [
        "src/cards/card1.jpg",
        "src/cards/card2.jpg",
        "src/cards/card3.jpg",
        "src/cards/card4.jpg",
        "src/cards/card5.jpg",
        "src/cards/card6.jpg",
        "src/cards/card7.jpg",
        "src/cards/card8.jpg",
        "src/cards/card9.jpg",
        "src/cards/card10.jpg",
        "src/cards/card11.jpg",
        "src/cards/card12.jpg"
    ];

    // count - количество возвращаемых карт
    // isThis = true если выбирает текущий игрок, если false, то callback не вызывать!
    //cards = array of int card id
    this.SelectCards = function(cards, count, callback){
        let board = document.getElementById("choose-board");
        board.style.visibility = "visible";
        let arrayIdSelectedCards = [];
        for (let i = 0; i < cards.length; i++) {
            board.appendChild(document.createElement("div"));
            board.children[i].className = "round-cards";
            let img = new Image();
            img.src = chooseCards[cards[i]];
            img.cardId = i;
            img.onclick = function(e) {
                if (arrayIdSelectedCards.length !== count && e.currentTarget.style.border !== "2px solid gold") {
                    e.currentTarget.style.border = "2px solid gold";
                    arrayIdSelectedCards.push(e.currentTarget.cardId);
                } else if (e.currentTarget.style.border === "2px solid gold") {
                    arrayIdSelectedCards = arrayIdSelectedCards.filter(c => c !== e.currentTarget.cardId);
                    e.currentTarget.style.border = "0";
                }
                console.log(arrayIdSelectedCards);
                if (arrayIdSelectedCards.length === count) {
                    let btn = document.getElementsByClassName("ok-choose");
                    btn[0].style.visibility = "visible";
                }
            };
            board.children[i].appendChild(img);
        }
        board.appendChild(document.createElement("button"));
        board.children[cards.length].className = "ok-choose";
        board.children[cards.length].textContent = "OK";
        board.children[cards.length].onclick = function () {
            console.log("onclick!");
            //board.StopSelect();
            if (callback !== undefined) {
                callback(arrayIdSelectedCards);
                console.log("OK!");
            }
        }
    }

    // Скрыть окро выбора карт
    this.StopSelect = function(){
        let board = document.getElementById("choose-board");
        board.style.visibility = "hidden";

    }

    // Запуск таймера отсчета с intSecond до 0
    this.startTimer = function(intSecond){

    }
    this.StopTimer = function(){

    }

    // Массив 6x3 карт в стеках [ [top1,center1,down1], [top2,center2,down2], ... ] int id типы карт
    // id с нуля (0)
    this.ReDrawCardStacks = function(stacks){
    	// Очистить стеки и нарисовать новые

    }



}
