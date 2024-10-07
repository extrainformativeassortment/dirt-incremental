/*
Made by Xia
*/

/*
declaration

syntax: 

upgrade[category, type][level, effect, cost]
category: 0 - value, 1 - dom Element
ex: 

upgrade[1, 1][1, 1, 4]
refers to the content of dom element of basic dirt upgrade #2, with level 1, effect of 1 (dirt per click), which costs 4 (dirt) to upgrade to level 2;
---
types:
0 - basic dirt
1 - rebirth dirt
2 - prestige dirt
dirt[type]
gain[type]
*/

const dirt = new Array(3);
for (let i = 0; i < dirt.length; i++) {
	dirt[i] = 0;
}

class Upgrade{
	constructor(...args) {
		['type', 'level', 'effect', 'cost'].forEach((key, index) => {
			this[key] = args[index];
		});
	}
}

const upgrades = {};

for (let i = 1; i <= 12; i++) {
	if (i <= 3){
		const upgrades[`Upgrade${i}`] = new Upgrade(1, 1, 0, 0);
	} 
	else if (i <= 8){
		const upgrades[`Upgrade${i}`] = new Upgrade(2, 1, 0, 0);
	}
	else {
		const upgrades[`Upgrade${i}`] = new Upgrade(3, 1, 0, 0);
	}
}

function Cost(id, lvl){
	let cost = 0, nxtLvl = lvl + 2;
	
	switch (buttonId){
		case 1:
			cost = nxtLvl * nxtLvl - nxtLvl;
			break;
		case 2:
			cost = (30 * nxtLvl) + nxtLvl * nxtLvl;
			break;
		case 3:
			cost = (1000 * nxtLvl) + (nxtLvl * 100) + nxtLvl;
			break;
		default:
			return;
	}
	return cost;
}

/*
DOM Access
*/

const tickFill = document.getElementById("tickFill"); 

const tickspeed = document.getElementById("tickspeed");

const valDisplay = {};
valDisplay["d000"] = document.getElementById("d000");
let d000Display = valDisplay["d000"];

valDisplay["d100"] = document.getElementById("d100");

for (let i = 1; i <= 3; i++){
	valDisplay[`d00${i}`] = document.getElementById(`d00${i}val`);
}

const costDisplay = {};

for (let i = 1; i <= 3; i++){
	costDisplay[`d00${i}`] = document.getElementById(`d00${i}cost`);
}

const buttons = {};

for (let i = 1; i <= 3; i++){
	buttons[`d00${i}`] = document.getElementById(`d00${i}button`);
}

//adds onclick event to each upgrade button
for (let i = 1; i <= 3; i++){
	let currentButton = buttons[`d00${i}`];
	currentButton.addEventListener("click", () => Upgrade(i));
}

buttons["r"] = document.getElementById("rebirthButton");
buttons["r"].addEventListener("click", () => rebirthReset());

/*
variables
*/

let d000 = 1000000; //basic dirt amount
let d100 = 0; //total basic dirt gain per tick
let tickspeed = 4; //total tickspeed

const levels = {};

for (let i = 1; i <= 3; i++){
	levels[`d00${i}`] = 0;
}

const effect = {};

for (let i = 1; i <= 3; i++){
	effect[`d00${i}`] = 0; 
}

const costs = {
	d001: 1,
	d002: 30,
	d003: 1000
};

const resetCount = {
	r: 0,
	p: 0,
	m: 0
};

/*
total computations
*/

d100 = effect["d001"];
tickspeed = truncate(4 - effect["d002"]);

/*
methods, functions, events
*/

/*
core functions; primary gameplay functions
*/

function tick(){
	d000 += d100;
	d000Display.innerHTML = d000;
}

function startTick(){
	
	tickFill.style.transition = `${tickspeed}s linear`;
  tickFill.style.transform = "scaleX(1)";	
	setTimeout(() => {
		tick();
		
		tickFill.style.transition = "none";
		tickFill.style.transform = "scaleX(0)";
		
		setTimeout(startTick, 50);
    }, tickspeed * 1000);
}

function Upgrade(buttonId){
	let Id = `d00${buttonId}`;
	if (d000 < costs[Id]){
		return;
		//TO DO: ADD NOTIFICATION 'NOT ENOUGH FOR UPGRADE'
	}
	d000 -= costs[Id];
	d000Display.innerHTML = d000;
	costs[Id] = Cost(buttonId, levels[Id]++);
	costDisplay[Id].innerHTML = costs[Id];
	switch (buttonId){
		case 1:
			effect[Id] = levels[Id] * (1 + Math.floor(levels[Id]/10));
			break;
		case 2:
			effect[Id] = truncate(levels[Id] * 0.2);
			break;
		case 3:
			effect[Id] = truncate(1 + (levels[Id] * 0.5))
			break;
		default:
			return;
	}
	valDisplay[Id].innerHTML = effect[Id];
	OnUpgrade();
	return;
}

function effect(buttonId){
	switch (buttonId){
		case 1:
			effect[Id] = levels[Id] * (1 + Math.floor(levels[Id]/10));
			break;
		case 2:
			effect[Id] = truncate(levels[Id] * 0.2);
			break;
		case 3:
			effect[Id] = truncate(1 + (levels[Id] * 0.5))
			break;
		default:
			return;
	}
}

/*
utility functions; makes coding easier or an artefact of coding
*/

//truncate to 2 decimal places
function truncate(num) {
	return parseFloat(num.toFixed(2));
}

//update total values after an upgrade
function OnUpgrade() {
	d100 = effect["d001"];
	valDisplay["d100"].innerHTML = d100;
	tickspeed = truncate(4 - effect["d002"]);
	tickspeed.innerHTML = tickspeed;
}

function rebirthReset() {
	for (let i in levels){
		levels[i] = 1;
	}
	for (let i in effect){
		effect[i] = 0;
	}
	for (let i in costs){
		costs[i] = 0;
	}
	
	OnUpgrade();
}

/*
function execution
*/

startTick();