// здесь вызывается отрисовка карты
function Render() {


    let map = document.getElementById("game-map");

	this.renderMap = function(inputMap){

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
                let tmp = inputMap.get(j, i).type;
                let img = new Image();
                if (tmp === 0) {
                    img.src = "tmp_models/green.jpg";
                } else if (tmp === 1) {
					img.src = "models/stone_tex.png";
				} else if (tmp === 2) {
					img.src = "models/platform_tex.png";
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
        1 : "models/monster.png",
        2 : "models/tmp files/naval_mine.png"
    };

    // передвинуть юнита из in в out
    this.moveUnit = function(cellFrom, cellTo) {

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
    this.initUnit = function(cell) {

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
    this.selectCards = function(cards, count, callback){

        let desk = document.getElementById("choose-board");
        desk.innerHTML = '';
        desk.style.visibility = "visible";
        let arrayIdSelectedCards = [];
        desk.appendChild(document.createElement("div"));
        desk.children[0].style.display = "block";
        board = desk.children[0];
        board.className = "desk-card";
        for (let i = 0; i < cards.length; i++) {
            board.appendChild(document.createElement("div"));
            board.children[i].className = "round-cards";
            let img = new Image();
            img.src = chooseCards[cards[i]];
            img.cardId = i;
            img.onclick = function(e) {
                if (arrayIdSelectedCards.length !== count && e.currentTarget.style.border !== "2px solid gold") {
                    e.currentTarget.style.border = "2px solid gold";
                    arrayIdSelectedCards.push(e.currentTarget.cardId|0);
                } else if (e.currentTarget.style.border === "2px solid gold") {
                    arrayIdSelectedCards = arrayIdSelectedCards.filter(c => c !== e.currentTarget.cardId);
                    e.currentTarget.style.border = "0";
                }
                if (arrayIdSelectedCards.length === count) {
                    let btn = document.getElementsByClassName("ok-choose");
                    btn[0].style.visibility = "visible";
                } else {
                    let btn = document.getElementsByClassName("ok-choose");
                    btn[0].style.visibility = "hidden";
                }
            };
            board.children[i].appendChild(img);
        }
        desk.appendChild(document.createElement("div"));
        desk.children[1].style.display = "block";
        desk = desk.children[1];
        desk.className = "desk";
        desk.appendChild(document.createElement("button"));
        desk.children[0].className = "ok-choose";
        desk.children[0].textContent = "OK";
        desk.children[0].onclick = function () {
            if (callback !== undefined) {
                callback(arrayIdSelectedCards);
            }
        }
    }

    // Скрыть окро выбора карт
    this.stopSelect = function(){
        let board = document.getElementById("choose-board");
        board.style.visibility = "hidden";
        let btn = document.getElementsByClassName("ok-choose");
        btn[0].style.visibility = "hidden";

    }


    {
        let timerId = null;
        // Запуск таймера отсчета с intSecond до 0
        this.startTimer = function(intSecond){
          let realSecond = intSecond;
          let timer = document.getElementById("timer");
          timerId = setInterval(function(){
            let seconds = realSecond % 60;
            let minutes = (realSecond / 60) | 0;
            if (realSecond < 0 ){
              clearInterval(timerId);
              timerId = null;
              return;
            }
            timer.innerHTML = realSecond < 10 ? minutes+":0"+seconds :  minutes+":"+seconds;
            realSecond--;
          }, 1000);
        }


        this.stopTimer = function(){
          if (timerId !== null){
            let timer = document.getElementById("timer");
            timer.innerHTML = "0:00";
            clearInterval(timerId);
            timerId = null;
          }
        }
    }

    // Обновить карты в руке рука не активна(перемещать карты нельзя)
    this.setHand = function(cards){
      let cardsCounter = document.getElementById("hand-counter");
      cardsCounter.innerHTML = cards.length;
    }

    // //TEST
    // function Cards(){
    //   this.count = null;
    // }
    //
    // let myCards = new Cards();
    // myCards.count = 2;
    //
    // this.setHand(myCards);

    // callback(массив длиной - количество карт в руке, элемент массива - новое место карты i в стеке или -1 если карта выброшена)
    // например при имеющихся картах [2, 3] мы ложим первую карту типа 2 в стек 4,
    // а вторую карту типа 3 в стек 1, нужно вызвать callback([4,1]) // 4, 1 Номера стеков
    this.programming = function(handCards, callback) {
        let hand = document.getElementById("hand");
        hand.innerHTML = '';
        hand.appendChild(document.createElement("div"));
        let numbersStacks = [];
        for (let i = 0; i < handCards.length; i++) {
            hand.children[0].appendChild(document.createElement("div"));
            hand.children[0].children[i].className = "hand-cards";
            let img = new Image();
            img.src = chooseCards[handCards[i]];
            img.cardId = handCards[i];
            img.orderId = i;
            //свойство активности
            img.isActive = false;
            numbersStacks.push(null);
            let controlArray = [];
            controlArray.push(null);
            img.onclick = function(e) {
                if (controlArray.length === handCards.length && e.currentTarget.style.border !== "2px solid green") {
                    e.currentTarget.style.border = "2px solid green";
                    e.currentTarget.isActive = true;
                    //onclick на ячейки стэков
                    //пока не нажмёт, ничего не делать, просто так и остаётся активным
                    //проверка на свойство активности
                    //возврат номера стэка
                    let numberStack = 1;
                    let stack = document.getElementById("card-" + numberStack);
                    //перемещаем в слот стэка картинку 
                    //или же это делаем в setStacks
                    //stack.children[j].appendChild(document.createElement(img));
                    controlArray.pop();
                    numbersStacks[e.currentTarget.orderId] = numberStack;
                    //stack.setStacks()
                    if (controlArray.length === 0)
                    	callback(numbersStacks);
                }

            };
            hand.children[0].children[i].appendChild(document.createElement(img));
        }
    }


    // cards - Массив 6x3 карт в стеках [ [top1,center1,down1], [top2,center2,down2], ... ] int id типы карт
    this.setStacks = function(cards){

    }


    // callback принимает список выбранных ячеек
    // cells array - массив
    this.selectCells = function(cellsArray, callback){

    }




}
