/*
Made by Xia
*/

// const { default: BigNumber } = require("bignumber.js");

/*
declaration

syntax: 

upgrades[category, type][Level, Effect, Cost]
category: 0 - value, 1 - dom Element
ex: 

upgrades[1, 1][1, 1, 4]
refers to the content of dom element of basic dirt upgrade #2, with level 1, effect of 1 (dirt per click), which costs 4 (dirt) to upgrade to level 2;
---
types:
0 - basic dirt
1 - rebirth dirt
2 - prestige dirt
dirt[type]
*/

window.onload = () => {

let tickspeed = 4;

const dirtCount = new Array(3);
for (let i = 1; i < dirtCount.length; i++) {
	dirtCount[i] = 0;
}

dirtCount[0] = 1;
dirtCount[1] = 0;

let basicDirtPerTick = 0;
let rebirthDirtOnReset = 0; 
let scrolledToRebirthInfo = false;
let prestigeDirtOnReset = 0;

const lastBasicUpgradeId = 4;
const lastRebirthUpgradeId = 8;
const lastPrestigeUpgradeId = 11;

const upgradeAttributes = ["Level", "Effect", "Cost"];

class createUpgrade {
	constructor(...args) {
		upgradeAttributes.forEach((key, index) => {
			this[key] = args[index];
		});
		this.Id = args[3];
	}
	updateUpgradeStats() {
		const targetDOM = upgradesDOM[this.Id];
		
		this.Effect = calculateEffect(this.Id, this.Level);
		this.Cost = calculateCost(this.Id, this.Level);
		
		targetDOM.Level.innerHTML = this.Level;
		targetDOM.Effect.innerHTML = scientificNotationate(this.Effect);
		targetDOM.Cost.innerHTML = scientificNotationate(this.Cost);
	} 
}

const upgrades = {};

for (let i = 1; i <= 10; i++) {
	upgrades[i] = new createUpgrade(0, calculateEffect(i, 0), calculateCost(i, 0), i);
}

/*
DOM Access
*/

const tickFill = document.getElementById("tickFill"); 

const tickspeedDOM = document.getElementById("tickspeed");
const dirtCountDOM = ["basic", "rebirth", "prestige"].map(i => document.getElementById(`${i}DirtCount`));

const basicDirtPerTickDOM = document.getElementById("basicDirtPerTick");
const rebirthDirtOnResetDOM = document.getElementById("rebirthDirtOnReset");
const prestigeDirtOnResetDOM = document.getElementById("prestigeDirtOnReset");

const upgradesDOM = {}; 

class createUpgradeDOM {
	constructor (id) {
		["Btn", "Level", "Effect", "Cost"].forEach((key) => {
			this[key] = document.getElementById(`upgrade${id}${key}`);
		});
	}
}

for (let i = 1; i <= 10; i++) {
	upgradesDOM[i] = new createUpgradeDOM(i);
}

//adds onclick event to each upgrade button
for (let i = 1; i <= 10; i++) {
	let currentBtn = upgradesDOM[i].Btn;
	currentBtn.addEventListener("click", () => onUpgradeAttempt(i));
}

const resetBtns = {
	rebirth: document.getElementById("rebirthBtn"),
	prestige: document.getElementById("prestigeBtn")
};

for (let i in resetBtns) {
	resetBtns[i].addEventListener("click", () => resetOnLayer(i));
}

const prestigeTabs = {
	tab1: document.getElementById("prestigeTab1"),
	tab2: document.getElementById("prestigeTab2")
};

/*
methods, functions, events
*/

const tickspeedUpgrades = [3];

function totalTickspeedEffect() {
	return tickspeedUpgrades.reduce((total, id) => {
		return total + upgrades[id].Effect;
	}, 0);
}

function updateTickspeed() {
	tickspeed = 4 - totalTickspeedEffect();
	tickspeed = truncate(tickspeed, 3);
	tickspeedDOM.innerHTML = truncate(tickspeed, "tickspeedDOM");
}

function updateDirtCount(type) {
	if (type == 0) {
		if (dirtCount[0] >= 10000) {
			if (scrolledToRebirthInfo == false) {
				scrolledToRebirthInfo = true;
				updateDisplay("rebirthLayer", "show", "move");
			}
			updateDisplay("rebirthLayer", "show");
			updateDisplay("preRebirthHeader", "show");
		}
		if (dirtCount[0] >= 1000000) {
			updateDisplay("preRebirthHeader", "hide");
			updateDisplay("rebirthLayerHeader", "show");
		}
		if (dirtCount[0] < 1000000) {
			updateDisplay("rebirthLayerHeader", "hide");
		}
	}
	dirtCountDOM[type].innerHTML = scientificNotationate(dirtCount[type]);
}

function calculateBasicDirtPerTick() {
	basicDirtPerTick = timesBig(upgrades[1].Effect, upgrades[2].Effect, upgrades[5].Effect); //* upgrades[8].Effect;
	basicDirtPerTick = truncate(basicDirtPerTick);
}

function updateBasicDirtPerTick() {
	calculateBasicDirtPerTick();
	basicDirtPerTickDOM.innerHTML = scientificNotationate(basicDirtPerTick);
}

function rebirthDirtOnResetBaseFormula() {
	const i = dirtCount[0];
	return divBig(i, 1000000).sqrt().sqrt(); 
}

function updateRebirthDirtOnReset() {
	rebirthDirtOnReset = rebirthDirtOnResetBaseFormula() * upgrades[4].Effect; // * upgrades[6].Effect ** upgrades[9].Effect;
	rebirthDirtOnReset = truncate(rebirthDirtOnReset);
	document.getElementById("rebirthDirtOnReset").innerHTML = scientificNotationate(rebirthDirtOnReset);
}

function prestigeDirtOnResetBaseFormula() {
	return;
}

function calculatePrestigeDirtOnReset() {
	prestigeDirtOnReset = Math.log10(Math.sqrt(BigNumber(dirtCount[1])));
}

function updateAllStats() {
	for (let i in dirtCountDOM) {
		updateDirtCount(i);
	}
	for (let i in upgrades) {
		upgrades[i].updateUpgradeStats();
	}
	updateTickspeed();
	updateBasicDirtPerTick();
	updateRebirthDirtOnReset();
	updatePrestigeDirtOnReset();
}

function updatePrestigeDirtOnReset() {
	calculatePrestigeDirtOnReset();
	prestigeDirtOnResetDOM.innerHTML = prestigeDirtOnReset;
}

function updateUpgradeDisplay(id, displayStatus, moveTo) {
	if (displayStatus == "hide") {
		document.getElementById(`upgrade${id}`).style.display = "none";
	}
	else if (displayStatus == "show") {
		document.getElementById(`upgrade${id}`).style.display = "block";
		if (moveTo == "move" && id != 1){
			document.getElementById(`upgrade${id}`).style.scrollMarginTop = "16vw";
			document.getElementById(`upgrade${id}`).scrollIntoView();
		}
	}
}

function updateDisplay(id, displayStatus, moveTo = "stay") {
	if (typeof id == "number") {
		updateUpgradeDisplay(id, displayStatus, moveTo);
		return;
	}
	if (displayStatus == "hide") {
		document.getElementById(id).style.display = "none";
	}
	else if (displayStatus == "show") {
		document.getElementById(id).style.display = "block";
		if (moveTo == "move"){
			document.getElementById(id).style.scrollMarginTop = "16vw";
			document.getElementById(id).scrollIntoView();
		}
	}
}

function effectFormulaScaling(lvl, jumpEveryXLevels = 1, scaleFactor = 1) {
	return scaleFactor ** Math.floor(lvl / jumpEveryXLevels);
}

function calculateEffect(id, lvl) {
	const lvl0Effects = {
		1: 0,
		2: 1,
		3: 0,
		4: 1,
		5: 1,
		6: 0,
		7: 1,
		8: 1,
		9: 1,
		10: 1,
		11: 0
	};
	
	if (lvl == 0) {
		return lvl0Effects[id];
	}
	
	const effectFormulas = {
		1: lvl * effectFormulaScaling(lvl, 5, 2),
		2: 10 ** lvl,
		3: lvl * 0.2,
		4: 2 ** lvl,
		5: 2 ** lvl,
		6: lvl * 0.1,
		7: 1 + lvl * 0.4,
		8: 1 + (lvl * 0.4),
		9: 1 + (lvl * 0.2),
		10: 1 + (lvl * 0.4),
		11: (lvl * 0.05)
	};
	
	return truncate(effectFormulas[id]);
}

function costFormulaScalingBase (lvl, jumpEveryXLevels, initialScaleFactor) {
	return BigNumber(1 + (initialScaleFactor * Math.floor(lvl / jumpEveryXLevels)));
}

function costFormulaScalingExponent (lvl, jumpEveryXLevels, longScaleFactor) {
	return BigNumber(1 + (Math.floor(lvl / jumpEveryXLevels) * longScaleFactor));
}

function costFormulaScaling(lvl, jumpEveryXLevels = 1, initialScaleFactor = 1, longScaleFactor = 0) {
	return powBig(costFormulaScalingBase(lvl, jumpEveryXLevels, initialScaleFactor)
	, costFormulaScalingExponent(lvl, jumpEveryXLevels, longScaleFactor));
}

function calculateCost(id, lvl){
	const lvl0Costs = {
		1: 1,
		2: 400,
		3: 10000,
		4: 1e+8,
		5: 1,
		6: 2,
		7: 100,
		8: 1000,
		9: 1,
		10: 50,
		11: 500 
	};
	
	if (lvl == 0) {
		return lvl0Costs[id];
	}

	const nxtLvl = lvl + 1;
	
	const costFormulas = {
		1: timesBig(nxtLvl, powBig(1.12, lvl), costFormulaScaling(lvl, 5, 0.8, 1)),
		2: timesBig(nxtLvl, powBig(12 + 2 * lvl, lvl), 500), 
		3: timesBig(nxtLvl, powBig(10 + 8 * lvl, lvl), 10000),
		4: timesBig(nxtLvl, powBig(timesBig(1.08e5, powBig(1e3, lvl)), lvl), 1e8), // * costFormulaScaling(lvl, undefined, 0.02, 0.04),
		5: timesBig(nxtLvl, powBig(2.2 + 2 * lvl, lvl)),
		6: ((1 + lvl) * 2 + lvl * 1.2) ** 1.66 * costFormulaScaling(lvl, 5, 10),
		7: (lvl * 3 + lvl * 0.06) ** 1.33 * costFormulaScaling(lvl, 5, 2, 0.08),
		8: (lvl * 3 + lvl * 0.06) ** 1.33 * costFormulaScaling(lvl, 5, 2, 0.08),
		9: (lvl * 3 + lvl * 0.06) ** 1.33 * costFormulaScaling(lvl, 5, 2, 0.08),
		10: (lvl * 3 + lvl * 0.06) ** 1.33 * costFormulaScaling(lvl, 5, 2, 0.08),
		11: (lvl * 3 + lvl * 0.06) ** 1.33 * costFormulaScaling(lvl, 5, 2, 0.08)
	};
	
	return truncate(costFormulas[id]);
}

function onUpgradeAttempt(id) {
	const type = id <= 4 ? 0 : id <= 8 ? 1 : 2;
	const target = upgrades[id];
	
	if (dirtCount[type] < target.Cost){
		return;
		//TO DO: ADD NOTIFICATION 'NOT ENOUGH FOR UPGRADE'
	}
	
	dirtCount[type] -= target.Cost;
	dirtCount[type] = truncate(dirtCount[type]);
	updateDirtCount(type);
	
	target.Level++;
	updateAllStats();
	
	if (id == 1 && target.Level == 5) {
		updateDisplay(2, "show");
	}
	
	if (id == 2 && target.Level == 2) {
		updateDisplay(3, "show");
	}
	
	if (id == 1 || id == 5) { //|| id == 9) {
		updateBasicDirtPerTick();
	}
	
	if (id == 3) {
		updateTickspeed();
		/*
		if (target.Level == 5) {
			updateDisplay("rebirthLayer", "show");
			updateDisplay("preRebirthHeader", "show");
		}
		*/
	}
	
	if (id == 5 && target.Level == 2) {
		updateDisplay(4, "show");
	}
}

/*
reset functions
*/

function resetBasicDirtUpgrades() {
	for (let i = 1; i <= 4; i++){
		upgrades[i].Level = 0;
		if (i != 1 && i != 4) {
			updateDisplay(i, "hide");
		}
		updateAllStats();
	}
	dirtCount[0] = 1;
}

function resetRebirthDirtUpgrades() {
	for (let i = 4; i <= 7; i++){
		upgrades[i].Level = 0;
	}
	updateAllStats();
}

function addRebirthDirtOnRebirthReset() {
	dirtCount[1] += rebirthDirtOnReset;
	dirtCount[1] = truncate(dirtCount[1]);
	updateDirtCount(1);
}

function addPrestigeDirtOnPrestigeReset() {
	dirtCount[2] += prestigeDirtOnReset;
	updateDirtCount(2);
}

function performRebirthReset() {
	addRebirthDirtOnRebirthReset();
	resetBasicDirtUpgrades();
	updateAllStats();
	updateDisplay("rebirthDirtStat", "show", "stay");
	updateDisplay("rebirthUpgrades", "show");
	updateDisplay(5, "show");
}

function performPrestigeReset() {
	addPrestigeDirtOnPrestigeReset();
	resetBasicDirtUpgrades();
	resetRebirthDirtUpgrades();
}

const resetLayersFunctionNames = {
	rebirth: performRebirthReset,
	prestige: performPrestigeReset
}; 

function resetOnLayer(layer) {
	resetLayersFunctionNames[layer](); 
}

/*
core functions; primary gameplay functions
*/

function addBasicDirtPerTick(){
	dirtCount[0] += basicDirtPerTick;
	dirtCount[0] = truncate(dirtCount[0]);
	updateDirtCount(0);
}

function performTick() {
	addBasicDirtPerTick();
	updateAllStats();
}

function startTickfillAnimation() {
	tickFill.style.transition = `${tickspeed}s linear`;
  tickFill.style.transform = "scaleX(1)";	
	setTimeout(() => {
		performTick();
		
		tickFill.style.transition = "none";
		tickFill.style.transform = "scaleX(0)";
		
		setTimeout(startTickfillAnimation, 50);
	}, tickspeed * 1000);
}

function loadAllStatsDOM() {
	updateAllStats();
}

function startGame() {
	updateDisplay(1, "show", "stay");
	loadAllStatsDOM();
	for (let i = 2; i <= 10; i++) {
		if (upgrades[i].Level > 0) {
			updateDisplay(i, "show", "stay");
		}
	}
	setTimeout(startTickfillAnimation(), 2500);
}

/*
utility functions
*/

function truncate(number, decimalPlaces = 2) {
	if (number === undefined) {
		console.log("I HATE JAVASCRIPT");
		return;
	}
	if (typeof number != "number"){
		number = Number(number);
	}
	if (decimalPlaces == "tickspeedDOM") {
		return number.toFixed(3);
	}
	return Number(number.toFixed(decimalPlaces));
}

function scientificNotationate(number) {
	if (number < 1000) {
		return number;
	}
	return BigNumber(number).toExponential(2);
}

function timesBig(...addends) {
    return addends.reduce((acc, addend) => acc.plus(addend), BigNumber(0));
}

function minusBig(minuend, subtrahend) {
	return BigNumber(minuend).minus(subtrahend);
}

function timesBig(...factors) {
    return factors.reduce((acc, factor) => acc.times(factor), BigNumber(1));
}

function divBig(dividend, divisor) {
	return BigNumber(dividend).div(divisor);
}

function powBig(base, exponent) {
	return BigNumber(base).pow(Math.round(exponent));
}

/*
function execution
*/

setTimeout(startGame, 250);

};
