// здесь вызывается отрисовка карты
function Render() {


    let map = document.getElementById("game-map");


    const TILES_IMG = ["tmp_models/green.jpg", "models/stone_tex.png", "models/platform_tex.png", "tmp_models/blue.jpg"]
	this.renderMap = function(inputMap){
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
                img.src = TILES_IMG[tmp];
                map.children[0].children[i].children[j].appendChild(img);
            }
        }
    }
	// Unit
	// cellTo.HasUnit тип получать cellTo.unit.type - тип юнита
	// const unitType = {Hero:0, Creep:1, Bomb:2} - юнит
	// cellTo.x cellTo.y - координаты


    const UNIT_IMGS = ["models/tmp files/man-with-sword-and-shield.svg", "models/monster.png", "models/tmp files/naval_mine.png"];

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
        img.src = UNIT_IMGS[cell.unit.type];
        map.children[0].children[cell.y].children[cell.x].appendChild(img);
	}

	const CARD_IMGS = [
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
        desk.style.display = "block";
        let arrayIdSelectedCards = [];
        desk.appendChild(document.createElement("div"));
        desk.children[0].style.display = "block";
        let index_board = 110;
        desk.style.width = (index_board * cards.length) + "px";
        //let pixels = 53.5 * (10 - cards.length);
        //desk.children[0].style.marginLeft = "" + pixels + "px";
        board = desk.children[0];
        board.className = "desk-card";
        for (let i = 0; i < cards.length; i++) {
            board.appendChild(document.createElement("div"));
            board.children[i].className = "round-cards";
            let img = new Image();
            img.src = CARD_IMGS[cards[i]];
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
                    btn[0].style.display = "block";
                } else {
                    let btn = document.getElementsByClassName("ok-choose");
                    btn[0].style.display = "none";
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

          function updateTimer(){
            let seconds = realSecond % 60;
            let minutes = (realSecond / 60) | 0;
            if (realSecond < 0 ){
              clearInterval(timerId);
              timerId = null;
              return;
            }
            timer.innerHTML = realSecond < 10 ? minutes+":0"+seconds :  minutes+":"+seconds;
            realSecond--;
          }

          updateTimer()
          timerId = setInterval(updateTimer, 1000);
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
      let cardBoard = document.getElementById("hand-board");
      cardBoard.innerHTML = "";
      let boardWidth = cards.length * 130;
      cardBoard.style.width = boardWidth + "px";
      console.log(cards);
      for (let i = 0; i < cards.length; i++){
        // cardBoard.appendChild(document.createElement("div"));
        // cardBoard.children[i].className = "hand-card";
        let img = new Image(125, 200);
        img.className = "hand-card"
        img.src = CARD_IMGS[cards[i]];
        img.cardId = cards[i];
        cardBoard.appendChild(img);
      }

       cardBoard.style.display = "block";
    }


    //think about 6 x 3 array
    let arrayFullStacks = [];
    let arrayTransformHand = [];
    //function for click on stacks
    this.selectStack = function (e) {
        let idStack = e.currentTarget.stackId;
        let orderIdCard = -1;
        let arrayHandCards = document.getElementsByClassName("hand-card");
        for (let card of arrayHandCards) {
            if (card.isActive) {
                orderIdCard = card.orderId;
                let img = new Image();
                img.src = card.src;
                card.innerHTML = '';
                img.style.width = "100%";
                e.currentTarget.appendChild(document.createElement(img));
                //size hand
                let sizeHand = document.getElementById("hand-counter").textContent;
                //обращаемся по стэку и изменяем массив, если на какой-то стэк-уровень заполнен, то
                //проходимся по всему стэку, ищем свободное место
                //не находим -- выводим ошибку, просим перевыбрать или автоматически удаляем верхний элемент
                //в стэке размера 3 и ставим наверх нашу карту, если все одной стихии
                if (arrayTransformHand.length === (sizeHand * 1))
                    e.currentTarget.setStacks(arrayFullStacks); //array 6 x 3
            }
        }
    };

    //function for click on handCard
    this.selectHandCard = function (e) {
        let sizeHand = document.getElementById("hand-counter").textContent;
        let cards = document.getElementsByClassName("hand-card"); //class hand cards
        let realSize = 0;
        for (let card of cards) {
            if (!card.isActive) {
                realSize++;
            }
        }
        if (!e.currentTarget.isActive && realSize === (sizeHand * 1)) {
            e.currentTarget.style.border = "2px solid green";
            e.currentTarget.isActive = true;
        }
    };

    // callback(массив длиной - количество карт в руке, элемент массива - новое место карты i в стеке или -1 если карта выброшена)
    // например при имеющихся картах [2, 3] мы ложим первую карту типа 2 в стек 4,
    // а вторую карту типа 3 в стек 1, нужно вызвать callback([4,1]) // 4, 1 Номера стеков
    this.programming = function(handCards, callback) {
        let numbersStacks = [];
        let arrayHandCards = document.getElementsByClassName("hand-card");
        while (arrayHandCards.length !== 0) {
            //1. selectHandCard
            //2. selectStack
            //3. numbersStacks.push(numberStack);
        }
        callback(numbersStacks);
    };


    // cards - Массив 6x3 карт в стеках [ [top1,center1,down1], [top2,center2,down2], ... ] int id типы карт
    this.setStacks = function(cards){
        // заполняем стэки по массиву
    }


    // callback принимает список выбранных ячеек
    // cells array - массив
    this.selectCells = function(cellsArray, callback){

    }

    //Окно, отображающее поражение для текущей сессии
    this.defeat = function(){
      let defeatBlock = document.getElementById("win-or-defeat");
      console.log(defeatBlock);
      defeatBlock.src = "src/lose.mp4";
      defeatBlock.muted = "";
      defeatBlock.play();
    };

    // Высветить сообщение поверх всего
    this.showMessage = function(text, color) { // make enum
      let messageBlock = document.getElementById("message");
      messageBlock.style.display = "block";
      //messageBlock.style.background = "red"; //rgba(2,3,4,0.5);
      messageBlock.innerHTML = text;
    };

    // Скрыть сообщение
    this.hideMessge = function(){
      let messageBlock = document.getElementById("message");
      messageBlock.style.display = "none";
    };

}
