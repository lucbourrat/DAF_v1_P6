import Personnage from './personnage.js';
import GameBoard from './gameboard.js';
import Map from './map.js';
import Arme from './arme.js';

let tableauBody;
let player;
let playerMovements;
let possiblesMovement
let possiblesCell;
let c;
let fightRoundOfPlayerId;
let playerFightTurn;
let playerFightNoTurn;
let fighterBtnAtt;
let fighterBtnDef;
let defenderBtnAtt;
let defenderBtnDef;

const skipButton = document.getElementById("skip-btn");

// Création tableau de jeu
const tableauDeJeu = new GameBoard();

// Crétion player 1
const Arme_par_defaut_player1 = new Arme("Arme jaune", 10, 1);
const Chien = new Personnage("Chien", 100, Arme_par_defaut_player1, 1);

// Crétion player 2
const Arme_par_defaut_player2 = new Arme("Arme violette", 10, 2);
const Chat = new Personnage("Chat", 100, Arme_par_defaut_player2, 2);

// Création des 4 armes
const Sabre = new Arme("Arme bleu", 20, 3);
const Shuriken = new Arme("Arme rouge", 15, 4);
const Rasengan = new Arme("Arme grise", 35, 5);
const Kunai = new Arme("Arme verte", 25, 6);

// Ajout des 2 joueurs et des 4 armes dans le tableau items
tableauDeJeu.addElement(Chien);
tableauDeJeu.addElement(Chat);
tableauDeJeu.addElement(Sabre);
tableauDeJeu.addElement(Shuriken);
tableauDeJeu.addElement(Rasengan);
tableauDeJeu.addElement(Kunai);

// Création de la map back end
const maCarte = new Map(tableauDeJeu.mapItems, 10); // arg2 = nombre de cailloux

// Initialisation de la map FrontEnd
tableauDeJeu.initFrontMap(maCarte.mapTab);
tableauDeJeu.initPlayerInfos([Chien, Chat]);

//
//
//
//
// Boucle de jeu

let gameTurnOf3 = 0;
let roundNb = 1;
let roundOfPlayerId = tableauDeJeu.roundOfPlayerId(roundNb);

gameLoop();

function gameLoop() {
	gameTurnOf3++;
	if (gameTurnOf3 > 3) {
		gameTurnOf3 = 1;
		roundNb++;
	}
	if (gameTurnOf3 == 1)
		skipButton.style.opacity = "0";
	else
		skipButton.style.opacity = "1";
	//tableauDeJeu.isEveryoneAlive() == 1
	roundOfPlayerId = tableauDeJeu.roundOfPlayerId(roundNb);
	// ------------------------------------------------------------------------------------------------------------------------
	tableauBody = document.getElementById("FontMap");
	player = tableauDeJeu.mapItems[roundOfPlayerId - 1];
	playerMovements = [[0,-1],[1,0],[0,1],[-1,0]]; // Mouvement du player : haut droite bas gauche
	// ------------------------------------------------------------------------------------------------------------------------


	possiblesMovement = [-1, -1, -1, -1]; // Map Back // haut(0) droite(1) bas(2) gauche(3)
	possiblesCell = [-1, -1, -1, -1]; // Map Front // haut(0) droite(1) bas(2) gauche(3)
	for (c = 0; c < 4; c++) {	 
		
		let nextHorizontalPos = player.horizontalAxis + playerMovements[c][0];
		let nextVerticalPos = player.verticalAxis + playerMovements[c][1];
		if ((nextHorizontalPos >= 0 && nextHorizontalPos <= 9) && 
		(nextVerticalPos >= 0 && nextVerticalPos <= 9)) { // Si la position est dans le tableau (donc si ca ne sort pas du tableau)
			possiblesMovement[c] = maCarte.mapTab[nextHorizontalPos][nextVerticalPos];
			possiblesCell[c] = tableauBody.getElementsByTagName("tr")[nextVerticalPos].getElementsByTagName("td")[nextHorizontalPos]; // haut droite bas gauche
		}
	}
	// ------------------------------------------------------------------------------------------------------------------------
	// console.log("haut = " + possiblesMovement[0] + " - " + possiblesMovement[0].constructor.name);
	// console.log("droite = " + possiblesMovement[1] + " - " + possiblesMovement[1].constructor.name);
	// console.log("bas = " + possiblesMovement[2] + " - " + possiblesMovement[2].constructor.name);
	// console.log("gauche = " + possiblesMovement[3] + " - " + possiblesMovement[3].constructor.name);
	// maCarte.afficherMapTab();
	for (c = 0; c < 4; c++) {
		if (possiblesMovement[c] == 0 || possiblesMovement[c].constructor.name == "Arme") { // haut
			possiblesCell[c].classList.add("move");
			possiblesCell[c].classList.add("direction" + c);
			possiblesCell[c].addEventListener("click", listenEvent);
		}
	}
	skipButton.addEventListener("click", listenBtn);
}

function listenBtn() {
	gameTurnOf3 = 3;
	removeEvents();
	gameLoop();
}	

function listenEvent() {
	let countDirection = findCountDirection(this.className);
	maCarte.movePlayer(player.horizontalAxis + playerMovements[countDirection][0], player.verticalAxis + playerMovements[countDirection][1], player.horizontalAxis, player.verticalAxis, player);// Maj mapTab
	tableauDeJeu.updateFrontMap(player.horizontalAxis + playerMovements[countDirection][0], player.verticalAxis + playerMovements[countDirection][1], player.horizontalAxis, player.verticalAxis, player.cssClass);// Maj Map Front
	player.majCoordinates(possiblesCell[countDirection].id % 10, Math.trunc(possiblesCell[countDirection].id / 10)); //MAJ coordonnees players
	tableauDeJeu.updatePlayerInfos(player); //MAJ info player Front End
	
	removeEvents();

	if (maCarte.isThePlayerNear(player.horizontalAxis, player.verticalAxis) == 1) {
		fightStep();
	}

	gameLoop();
}

function removeEvents() {
	skipButton.removeEventListener("click", listenBtn);

	for (let d = 0; d < 4; d++) {
		if (possiblesCell[d] != -1) { // Si la position est dans le tableau (donc si ca ne sort pas du tableau)
			possiblesCell[d].classList.remove("move"); // Clean movement position possible (front)
			possiblesCell[d].classList.remove("direction" + d); // Clean movement position possible (front)
			possiblesCell[d].removeEventListener("click", listenEvent); // stop addeventlistener (front)
		}
	}
}	

function findCountDirection(strClassList) {
	let strDirectionPos = strClassList.indexOf("direction");
	let strDirectionPoslength = "direction".length;
	let countDirection = strClassList[strDirectionPos + strDirectionPoslength];

	return countDirection;
}

function fightStep() {
	document.getElementsByTagName("table")[0].style.display = "none"; // On cache la carte

	document.getElementById("skip-btn").style.display = "none"; //  On cache le bouton pour skip

	document.getElementsByClassName("frontFightContainer")[0].style.display = "flex"; //  On affiche les boutons pour le combat 

	fightRoundOfPlayerId = roundOfPlayerId; // Id du joueur qui commence

	fightLoop();
}

function fightLoop() {

	// On défini quel player doit attaquer
	if (fightRoundOfPlayerId % 2 == 0) {
		playerFightTurn = tableauDeJeu.mapItems[1];
		playerFightNoTurn = tableauDeJeu.mapItems[0];
	}
	else if (fightRoundOfPlayerId % 2 == 1) {
		playerFightTurn = tableauDeJeu.mapItems[0];
		playerFightNoTurn = tableauDeJeu.mapItems[1];
	}
	else
		console.log("Erreur avec l'id des personnages");


	// On vérifie s'il y a un mort, si oui, on sort de la boucle de combat
	if (playerFightTurn.amIAlive() == 0)
		endGame(playerFightNoTurn);
	else if (playerFightNoTurn.amIAlive() == 0)
		endGame(playerFightTurn);

	// On défini les boutons de l'attanquant et ceux du defenseur
	fighterBtnAtt = document.getElementById("btnAttPlayer" + playerFightTurn.id);
	fighterBtnDef = document.getElementById("btnDefPlayer" + playerFightTurn.id);
	defenderBtnAtt = document.getElementById("btnAttPlayer" + playerFightTurn.id);
	defenderBtnDef = document.getElementById("btnDefPlayer" + playerFightTurn.id);

	// On active les boutons du joueur attanquant
	fighterBtnAtt.classList.remove("btnDisable");
	fighterBtnDef.classList.remove("btnDisable");

	// On écoute les boutons du joueur attanquant
	fighterBtnAtt.addEventListener("click", listenEventFightAtt);
	fighterBtnDef.addEventListener("click", listenEventFightDef);
}

function listenEventFightAtt() {
	let damage;

	// On stop l'écoute sur les boutons
	removeFightEvents();

	// On désactive les boutons attanquant
	fighterBtnAtt.classList.add("btnDisable");
	fighterBtnDef.classList.add("btnDisable");

	// On incrémente le compteur pour savoir à qui le tour d'attaquer
	fightRoundOfPlayerId++;

	// On détermine les dégats à appliquer en fonction de si l'ennemi a jouer un coup défensif précédemment
	if (playerFightNoTurn.shield == 1)
		damage = playerFightTurn.arme.force/2;
	else if (playerFightNoTurn.shield == 0)
		damage = playerFightTurn.arme.force;
	else 
		console.log("Problème avec le shield");

	// On décrémente les points de vie de l'ennemi
	playerFightNoTurn.sante -= damage;
	console.log("Le joueur " + playerFightTurn.nom + " inflige " + playerFightTurn.arme.force + " dégats à " + playerFightNoTurn.nom);
	tableauDeJeu.updatePlayerInfos(playerFightNoTurn);

	// On enleve le "bouclier" du coup défensif
	playerFightNoTurn.shield = 0;

	// On retourne dans la boucle de combat
	fightLoop();
}

function listenEventFightDef() {
	// On stop l'écoute sur les boutons
	removeFightEvents();

	// On désactive les boutons attanquant
	fighterBtnAtt.classList.add("btnDisable");
	fighterBtnDef.classList.add("btnDisable");

	// On incrémente le compteur pour savoir à qui le tour d'attaquer
	fightRoundOfPlayerId++;

	// On ajoute le "bouclier" du coup défensif
	playerFightTurn.shield = 1;

	// On retourne dans la boucle de combat
	fightLoop();
}

function removeFightEvents() {
	fighterBtnAtt.removeEventListener("click", listenEventFightAtt);
	fighterBtnDef.removeEventListener("click", listenEventFightDef);
}	

function endGame(winner) {
	console.log("Fin du jeu !");
	console.log(winner.nom + " est le vainqueur.");
}

// let btnTempo = document.getElementsByClassName("playerName")[0];
// btnTempo.addEventListener("click", btnTempoFct);

// function btnTempoFct() {
// 	console.log("btnTempoFct");
// 	document.location.reload();
// }