import Vec2  from "./Vec2";
import Character from "./Character";
import Enemy from "./Enemy";

const cell = {
	none: 0,
	wall: 1,
	dot: 2,
	max: 3,
	maxHeight: 8
};

const direction = {
	up: 0,
	left: 1,
	down: 2,
	right: 3
};

const directions = [
	new Vec2(0, -1),
	new Vec2(-1, 0),
	new Vec2(0, 1),
	new Vec2(1, 0)
];

const cells = [
	[1,1,1,1,0,1,1,1,1],
	[1,0,0,0,0,0,0,0,1],
	[1,0,1,0,1,0,1,0,1],
	[1,0,1,0,1,0,1,0,1],
	[0,0,0,0,1,0,0,0,0],
	[1,0,1,0,0,0,1,0,1],
	[1,0,1,1,1,1,1,0,1],
	[1,0,0,0,0,0,0,0,1],
	[1,1,1,1,0,1,1,1,1]
];

const ai = {
	random: 0,
	chase: 1
};

const character = {
	player: 0,
	enemy1: 1,
	enemy2: 2
};

const cellAA = [
	"<span class=\"none\"></span>",
	"<span class=\"wall\"></span>",
	"<span class=\"dot\"><span></span></span>"
];

const characters = [
	new Character("<span class=\"character\"><span>😎</span></span>"),
	new Enemy("<span class=\"character\"><span>👹</span></span>"),
	new Enemy("<span class=\"character\"><span>👺</span></span>")
];

type Position = { x: number; y: number };

const player = characters[character.player];
let enemies: Array<Enemy> = [];

let intervalId: number;
let isLocked: boolean;

function init() {
	isLocked = false;
	player.pos = new Vec2(4, 1);
	setDots();
	if (enemies.length) {
		enemies = [];
	}
	enemies.push(characters[character.enemy1]);
	enemies.push(characters[character.enemy2]);
	enemies[0].pos = new Vec2(1, 4);
	enemies[1].pos = new Vec2(7, 4);
	enemies[0].ai = ai.random;
	enemies[1].ai = ai.chase;

	for (let i = 0; i < enemies.length; i++) {
		enemies[i].lastPos = new Vec2((<Vec2>enemies[i].pos).x, (<Vec2>enemies[i].pos).y);
	}

	if (intervalId) {
		clearInterval(intervalId);
	}

	intervalId = setInterval(interval, 250);
	addEventListener("keydown", onKeyDown);
	draw();
}

function setDots() {
	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			if (!((<Vec2>player.pos).y === i && (<Vec2>player.pos).x === j) && cells[i][j] === cell.none) {
				cells[i][j] = cell.dot;
			}
		}
	}
}

function onKeyDown(event: KeyboardEvent) {
	if (isLocked) return;
	let targetPos: Position;
	targetPos = new Vec2((<Vec2>player.pos).x, (<Vec2>player.pos).y);
	switch (event.key) {
		case "ArrowUp":
			targetPos.y--;
			break;
		case "ArrowDown":
			targetPos.y++;
			break;
		case "ArrowLeft":
			targetPos.x--;
			break;
		case "ArrowRight":
			targetPos.x++;
			break;
	}

	loopPos(targetPos);

	if (cells[targetPos.y][targetPos.x] >= cell.max) {
		return;
	}

	switch (cells[targetPos.y][targetPos.x]) {
		case cell.none:
			player.pos = new Vec2(targetPos.x, targetPos.y);
		case cell.wall:
			break;
		case cell.dot:
			cells[targetPos.y][targetPos.x] = cell.none;
			player.pos = new Vec2(targetPos.x, targetPos.y);
			break;
		default:
			console.log("No element found");
	}

	isEnd();
	draw();
}

function interval() {
	for (let i = 0; i < enemies.length; i++) {
		enemyMove(enemies[i]);
	}
	draw();
}

function enemyMove(enemy: Enemy) {
	const enemyPosition = [];
	let v = null;
	for (let i = 0; i < Object.keys(direction).length; i++) {
		v = new Vec2((<Vec2>enemy.pos).x + directions[i].x, (<Vec2>enemy.pos).y + directions[i].y);
		loopPos(v);
		if (cells[v.y][v.x] === cell.wall) {
			continue;
		}
		if (v.x === (<Vec2>enemy.lastPos).x && v.y === (<Vec2>enemy.lastPos).y) {
			continue;
		}
		enemyPosition.push(v);
	}

	enemy.lastPos = new Vec2((<Vec2>enemy.pos).x, (<Vec2>enemy.pos).y);

	switch (enemy.ai) {
		case ai.random:
			const r = Math.random() * enemyPosition.length;
			enemy.pos = enemyPosition[Math.floor(r)];
			break;
		case ai.chase:
			let nearest = enemyPosition[0];
			for (let i = 1; i < enemyPosition.length; i++) {
				if (distanceToPlayer(nearest) > distanceToPlayer(enemyPosition[i])) {
					nearest = enemyPosition[i];
				}
			}
			distanceToPlayer(<Vec2>v);
			enemy.pos = nearest;
		default:
			console.log("No AI type found");
	}

	isEnd();

	function distanceToPlayer(v: Vec2) {
		return Math.sqrt(Math.pow((<Vec2>player.pos).x - v.x, 2) + Math.pow((<Vec2>player.pos).y - v.y, 2))
	}
}

function loopPos(v: Vec2) {
	if (v.x < 0) {
		v.x = cells[0].length - 1;
	}
	if (v.x >= cells[0].length) {
		v.x = 0;
	}
	if (v.y < 0) {
		v.y = cells.length - 1;
	}
	if (v.y >= cells.length) {
		v.y = 0;
	}
}

function isEnd() {
	if (isLocked) return;
	for (let i = 0; i < enemies.length; i++) {
		if ((<Vec2>enemies[i].pos).x === (<Vec2>player.pos).x && (<Vec2>enemies[i].pos).y === (<Vec2>player.pos).y) {
			displayMessage(true);
			return true;
		}
	}
	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			if (cells[i][j] === cell.dot) {
				return false;
			}
		}
	}
	displayMessage(false);
	return true;
}

function displayMessage(dead: boolean) {
	if (isLocked) return;
	clearInterval(intervalId);
	const backdrop = document.createElement("div");
	backdrop.setAttribute("id", "backdrop");
	backdrop.setAttribute("class", "backdrop");
	document.body.appendChild(backdrop);

	const msg = document.createElement("div");
	const txt = dead ? document.createTextNode("You're dead. Click to restart.") : document.createTextNode("Congrats! Click to restart.");

	msg.appendChild(txt);
	msg.setAttribute("id", "msg");
	msg.setAttribute("class", "msg");

    backdrop.addEventListener("click", restore);

	document.body.appendChild(msg);

	function restore() {
		document.body.removeChild(<HTMLElement>document.getElementById("backdrop"));
		document.body.removeChild(<HTMLElement>document.getElementById("msg"));
		init();
	}
	isLocked = true;
}

function draw() {
	const root = <HTMLDivElement>document.getElementById("root");
	let html = "";
	let str = "";
	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			str = cellAA[cells[i][j]];
			for (let k = 0; k < characters.length; k++) {
				if ((i === (<Vec2>characters[k].pos).y) && (j === (<Vec2>characters[k].pos).x)) {
					str = characters[k].aa;
				}
			}
			html += str;
		}
		html += "<br>";
	}
	root.innerHTML = html;
}

init();