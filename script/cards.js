const cardType = {Fire:0, Computer:1, Metal:2, Electro:3, Deffect:4}
// Straight - Убивать по прямой   пока не достигнута координата
//const attackType = {Straight, Coordinates}
const cardsJSON = [
	{
		name: "Fuel Tank",
		// Эффект накладывается при взятии карты
		type: cardType.Fire,
		effects: ["FuelTank"], // при желании. функция Сброс карты и аттаковать всех в радиусе 1 при получении урона
		levels:[
			{// 1 Уровень
				targetCount: 0,
				move:[],
				attack: [],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 3
				]
			},
			{// 2 Уровень
				targetCount: 0,
				move:[],
				attack: [],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3
				]
			},
			{// 3 Уровень
				targetCount: 0,
				move:[],
				attack: [],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3, 4
				]
			}
		]
	},
	{
		name: "Blaze",
		type: cardType.Fire,
		effects: [],
		levels:[
			{// 1 Уровень
				targetCount: 2,
				move:[{x:0,y:1}],
				attack: [{x:-1,y:0},{x:1,y:0}], // Аттака в конце хода
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 2,
				move:[{x:0,y:2}],
				attack: [{x:-1,y:0},{x:1,y:0}], // Аттака в конце хода
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 2,
				move:[{x:0,y:3}],
				attack: [{x:-1,y:0},{x:1,y:0}], // Аттака в конце хода
				rotate:[]
			}
		]
	},
	{
		name: "FlameSpitter",
		type: cardType.Fire,
		effects: [],
		levels:[
			{// 1 Уровень
				targetCount: 999,
				move:[],
				attack: [{x:0,y:1},{x:0,y:2}], // Аттака в конце хода
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 999,
				move:[],
				attack: [{x:0,y:1},{x:0,y:2},{x:-1,y:2},{x:1,y:2}], // Аттака в конце хода
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 999,
				move:[],
				attack: [{x:0,y:1},{x:0,y:2},{x:-1,y:2},{x:1,y:2},{x:-1,y:3},{x:0,y:3},{x:1,y:3}], // Аттака в конце хода
				rotate:[]
			}
		]
	},
	{
		name: "Memory Core",
		// +1 карта в раздачу, если ты первый игрок
		type: cardType.Computer,
		effects: ["FuelTank"],
		levels:[
			{// 1 Уровень
				targetCount: 0,
				move:[],
				attack: [],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 3
				]
			},
			{// 2 Уровень +2 cards
				targetCount: 0,
				move:[],
				attack: [],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3
				]
			},
			{// 3 Уровень +3 cards
				targetCount: 0,
				move:[],
				attack: [],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3, 4
				]
			}
		]
	},
	{
		name: "Omni Stomp",
		type: cardType.Computer,
		effects: [],
		levels:[
			{// 1 Уровень
				targetCount: 0,
				move:  [{x:0,y:1}, {x:-1,y:0}, {x:1,y:0}],
				attack: [],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 0,
				move:[{x:0,y:2}, {x:-2,y:0}, {x:2,y:0}],
				attack: [],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 0,
				move:[{x:0,y:3}, {x:-3,y:0}, {x:3,y:0}],
				attack: [],
				rotate:[]
			}
		]
	},
	{
		name: "Hexmatic Aimbot",
		type: cardType.Computer,
		effects: [],
		levels:[
			{// 1 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1}],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},
					{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:2,y:1},{x:2,y:0},{x:2,y:-1},{x:2,y:-2},{x:1,y:-2},
					{x:0,y:-2},{x:-1,y:-2},{x:-2,y:-2},{x:-2,y:-1},{x:-2,y:0},{x:-2,y:1},{x:-2,y:2},{x:-1,y:2}],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1},
					{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:2,y:1},{x:2,y:0},{x:2,y:-1},{x:2,y:-2},{x:1,y:-2},
					{x:0,y:-2},{x:-1,y:-2},{x:-2,y:-2},{x:-2,y:-1},{x:-2,y:0},{x:-2,y:1},{x:-2,y:2},{x:-1,y:2},
					{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:3,y:2},{x:3,y:1},{x:3,y:0},{x:3,y:-1},
					{x:3,y:-2},{x:3,y:-3},{x:2,y:-3},{x:1,y:-3},{x:0,y:-3},{x:-1,y:-3},{x:-2,y:-3},{x:-3,y:-3},
					{x:-3,y:-2},{x:-3,y:-1},{x:-3,y:0},{x:-3,y:1},{x:-3,y:2},{x:-3,y:3},{x:-2,y:3},{x:-1,y:3}],
				rotate:[]
			}
		]
	},
	{
		name: "Scythe",
		// Эффект накладывается при взятии карты
		type: cardType.Metal,
		effects: [], // при желании. функция Сброс карты и аттаковать всех в радиусе 1 при получении урона
		levels:[
			{// 1 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1}],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 3
				]
			},
			{// 2 Уровень
				targetCount: 2,
				move:[],
				attack: [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1}],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3
				]
			},
			{// 3 Уровень
				targetCount: 3,
				move:[],
				attack: [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1}],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3, 4
				]
			}
		]
	},// do
	{
		name: "Skewer",
		type: cardType.Metal,
		effects: [],
		levels:[
			{// 1 Уровень
				targetCount: 2,
				move:[{x:0,y:1}],
				attack: [], // Аттака в конце хода
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 2,
				move:[{x:0,y:2}],
				attack: [], // Аттака в конце хода
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 2,
				move:[{x:0,y:3}],
				attack: [], // Аттака в конце хода
				rotate:[]
			}
		]
	},
	{
		name: "Ripsaw",
		type: cardType.Metal,
		effects: ["Ripsaw"],
		levels:[
			{// 1 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0, y:1}], // Аттака в конце хода
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 2,
				move:[],
				attack: [{x:0, y:1}], // Аттака в конце хода
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 3,
				move:[],
				attack: [{x:0, y:1}], // Аттака в конце хода
				rotate:[]
			}
		]
	},
	{
		name: "Cyclotron",
		type: cardType.Electro,
		// +1 карта в раздачу, если ты первый игрок
		effects: [],
		levels:[
			{// 1 Уровень
				targetCount: 999,
				move:[],
				attack: [{x:1,y:1},{x:-1,y:-1},{x:1,y:-1},{x:-1,y:1}],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 3
				]
			},
			{// 2 Уровень +2 cards
				targetCount: 999,
				move:[],
				attack: [{x:1,y:1},{x:-1,y:-1},{x:1,y:-1},{x:-1,y:1},/**/{x:2,y:2},{x:-2,y:-2},{x:2,y:-2},{x:-2,y:2}],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3
				]
			},
			{// 3 Уровень +3 cards
				targetCount: 999,
				move:[],
				attack: [{x:1,y:1},{x:-1,y:-1},{x:1,y:-1},{x:-1,y:1},/**/{x:2,y:2},{x:-2,y:-2},{x:2,y:-2},{x:-2,y:2},/**/{x:3,y:3},{x:-3,y:-3},{x:3,y:-3},{x:-3,y:3}],
				rotate:[ // 1: 90,  2: 180, 3: 270(-90), 4:360
					1, 2, 3, 4
				]
			}
		]
	},
	{
		name: "Speed",
		type: cardType.Electro,
		effects: [],
		levels:[
			{// 1 Уровень
				targetCount: 0,
				move:  [{x:0,y:1}, {x:0,y:2}],
				attack: [],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 0,
				move:[{x:0,y:2},{x:0,y:3},{x:0,y:4}],
				attack: [],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 0,
				move:[{x:0,y:3},{x:0,y:4},{x:0,y:5},{x:0,y:6}],
				attack: [],
				rotate:[]
			}
		]
	},
	{
		name: "Chain Lightning",
		type: cardType.Electro,
		effects: ["ChainLightning"],
		levels:[
			{// 1 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0,y:1}],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0,y:1}],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 1,
				move:[],
				attack: [{x:0,y:1}],
				rotate:[]
			}
		]
	},
	{
		name: "Move left disable",
		type: cardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move:[{x:-1,y:0}],
				attack: [],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 0,
				move:[{x:-1,y:0}],
				attack: [],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 0,
				move:[{x:-1,y:0}],
				attack: [],
				rotate:[]
			},
			{// 4 Уровень
				targetCount: 0,
				move:[{x:-1,y:0}],
				attack: [],
				rotate:[]
			},
		]
	},
	{
		name: "Move backward disable",
		type: cardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move:[{x:0,y:-1}],
				attack: [],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 0,
				move:[{x:0,y:-1}],
				attack: [],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 0,
				move:[{x:0,y:-1}],
				attack: [],
				rotate:[]
			},
			{// 4 Уровень
				targetCount: 0,
				move:[{x:0,y:-1}],
				attack: [],
				rotate:[]
			},
		]
	},
	{
		name: "Move forward disable",
		type: cardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move:[{x:0,y:1}],
				attack: [],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 0,
				move:[{x:0,y:1}],
				attack: [],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 0,
				move:[{x:0,y:1}],
				attack: [],
				rotate:[]
			},
			{// 4 Уровень
				targetCount: 0,
				move:[{x:0,y:1}],
				attack: [],
				rotate:[]
			},
		]
	},
	{
		name: "Move right disable",
		type: cardType.Deffect,
		effects: [],
		levels: [
			{// 1 Уровень
				targetCount: 0,
				move:[{x:1,y:0}],
				attack: [],
				rotate:[]
			},
			{// 2 Уровень
				targetCount: 0,
				move:[{x:1,y:0}],
				attack: [],
				rotate:[]
			},
			{// 3 Уровень
				targetCount: 0,
				move:[{x:1,y:0}],
				attack: [],
				rotate:[]
			},
			{// 4 Уровень
				targetCount: 0,
				move:[{x:1,y:0}],
				attack: [],
				rotate:[]
			},
		]
	},
]
