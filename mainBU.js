import Personnage from './personnage.js';
import GameBoard from './gameboard.js';
import Map from './map.js';
import Arme from './arme.js';


// Boucle de jeu
let playOrReplay = 1; 
let TEMPO2 = 0;
while (playOrReplay == 1 && TEMPO2 == 0) {

	// Création tableau de jeu
	const tableauDeJeu = new GameBoard();


	// Crétion player 1
	const Arme_par_defaut_player1 = new Arme("Arme par defaut", 10, 1);
	const Naruto = new Personnage("Naruto", 100, Arme_par_defaut_player1, 1);


	// Crétion player 2
	const Arme_par_defaut_player2 = new Arme("Arme par defaut", 10, 2);
	const Sasuke = new Personnage("Sasuke", 100, Arme_par_defaut_player2, 2);


	// Création des 4 armes
	const Sabre = new Arme("Sabre", 20, 3);
	const Shuriken = new Arme("Shuriken", 15, 4);
	const Rasengan = new Arme("Rasengan", 35, 5);
	const Kunai = new Arme("Kunai", 25, 6);


	// Ajout des 2 joueurs et des 4 armes dans le tableau items
	tableauDeJeu.addElement(Naruto);
	tableauDeJeu.addElement(Sasuke);
	tableauDeJeu.addElement(Sabre);
	tableauDeJeu.addElement(Shuriken);
	tableauDeJeu.addElement(Rasengan);
	tableauDeJeu.addElement(Kunai);


	// Création de la map back end
	const maCarte = new Map(tableauDeJeu.mapItems, 10); // arg2 = nombre de cailloux


	// Initialisation de la map FrontEnd
	tableauDeJeu.initFrontMap(maCarte.mapTab);
	tableauDeJeu.initPlayerInfos([Naruto, Sasuke]);


	let TEMPO1 = 0;
	while (tableauDeJeu.isEveryoneAlive() == 1 && TEMPO1 == 0) {
		let gameTurnOf3 = 1;
		let roundNb = 1;
		let roundOfPlayerId = tableauDeJeu.roundOfPlayerId(roundNb);

		while (gameTurnOf3 < 4) {
			// tableauDeJeu.movement(maCarte, tableauDeJeu.mapItems[roundOfPlayerId - 1]);

			let tableauBody = document.getElementById("FontMap");

			let player = tableauDeJeu.mapItems[roundOfPlayerId - 1];
			let playerMovements = [[0,-1],[1,0],[0,1],[-1,0]];


			let possiblesMovement = [-1, -1, -1, -1]; // haut(0) droite(1) bas(2) gauche(3)
			for (let c = 0; c < 4; c++)
				possiblesMovement[c] = maCarte.mapTab[player.horizontalAxis + playerMovements[c][0]][player.verticalAxis + playerMovements[c][1]]; // haut // droite // bas // gauche
			// let possiblesMovement = [-1, -1, -1, -1]; // haut(0) droite(1) bas(2) gauche(3)
			// possiblesMovement[0] = maCarte.mapTab[player.horizontalAxis][player.verticalAxis - 1]; // haut
			// possiblesMovement[1] = maCarte.mapTab[player.horizontalAxis + 1][player.verticalAxis]; // droite
			// possiblesMovement[2] = maCarte.mapTab[player.horizontalAxis][player.verticalAxis + 1]; // bas
			// possiblesMovement[3] = maCarte.mapTab[player.horizontalAxis - 1][player.verticalAxis]; // gauche



			let possiblesCell = [-1, -1, -1, -1]; // haut(0) droite(1) bas(2) gauche(3)
			possiblesCell[0] = tableauBody.getElementsByTagName("tr")[player.verticalAxis - 1].getElementsByTagName("td")[player.horizontalAxis]; // haut
			possiblesCell[1] = tableauBody.getElementsByTagName("tr")[player.verticalAxis].getElementsByTagName("td")[player.horizontalAxis + 1]; // droite
			possiblesCell[2] = tableauBody.getElementsByTagName("tr")[player.verticalAxis + 1].getElementsByTagName("td")[player.horizontalAxis]; // bas
			possiblesCell[3] = tableauBody.getElementsByTagName("tr")[player.verticalAxis].getElementsByTagName("td")[player.horizontalAxis - 1]; // gauche
			

			if (possiblesMovement[0] == 0 || possiblesMovement[0].constructor.name == "Arme") { // haut
				possiblesCell[0].classList.add("move");
				possiblesCell[0].addEventListener("click", function(){

					maCarte.movePlayer(player.horizontalAxis, player.verticalAxis - 1, player.horizontalAxis, player.verticalAxis);// Maj mapTab

					tableauDeJeu.updateFrontMap(player.horizontalAxis, player.verticalAxis - 1, player.horizontalAxis, player.verticalAxis, player.cssClass);// Maj Map Front

					player.majCoordinates(possiblesCell[0].id % 10, Math.trunc(possiblesCell[0].id / 10)); //MAJ coordonnees players

					tableauDeJeu.updatePlayerInfos(player); //MAJ info player Front End

					for (let c = 0; c < 4; c++)
						possiblesCell[c].classList.remove("move"); // Clean movement position possible (front)

				} , false);
			}
			if (possiblesMovement[1] == 0 || possiblesMovement[1].constructor.name == "Arme") { // droite
				possiblesCell[1].classList.add("move");
			}
			if (possiblesMovement[2] == 0 || possiblesMovement[2].constructor.name == "Arme") { // bas
				possiblesCell[2].classList.add("move");
			}
			if (possiblesMovement[3] == 0 || possiblesMovement[3].constructor.name == "Arme") { // haut
				possiblesCell[3].classList.add("move");
			}


	// movement2(maCarte, player, id) {
	// 	player.verticalAxis = id % 10;
	// 	this.updatePlayerInfos(player);
	// }

			gameTurnOf3++;
			gameTurnOf3++;
			gameTurnOf3++;
		}
		TEMPO1++;
	}
	TEMPO2++;
	//Demander le replay
}















// console.log("Bienvenue dans ce jeu de combat ! Voici nos 2 super guerrier :");
// Naruto.decrire();
// Sasuke.decrire();
// Naruto.attaquer(Sasuke);
