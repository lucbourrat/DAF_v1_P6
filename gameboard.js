export default class GameBoard{
	constructor(){
		this.mapItems = new Array();
	}

	// Création du tableau front end, ajout des abstacles et ajout du tableau dans le Front
	initFrontMap(mapTab) {
		// Initialiser le tableau Front
		let body = document.getElementsByClassName("frontMapContainer")[0];
		let tableau = document.createElement("table");
		let tableauBody = document.createElement("tbody");
		tableauBody.id = "FontMap";

		for (let i = 0; i < 10; i++) {
			let ligne = document.createElement("tr");

			for (let j = 0; j < 10; j++) {
				let cellule = document.createElement("td");
				cellule.id = i*10+j;

				// Ajout des abstacles
				if (mapTab[j][i] == 1)
					cellule.classList.add("inaccessibleBoxes"); 

				//Ajout des items
				for (let c = 0; c < this.mapItems.length; c++) { 
					if (j == this.mapItems[c].horizontalAxis && i == this.mapItems[c].verticalAxis)
						cellule.classList.add(this.mapItems[c].cssClass); 
				}

				ligne.appendChild(cellule);
			}
			tableauBody.appendChild(ligne);
		}

		tableau.appendChild(tableauBody);
		// Ajouter le tableau dans le Front
		body.appendChild(tableau);
	}


	updateFrontMap(newPosHorizontalAxis, newPosVerticalAxis, oldPosHorizontalAxis, oldPosVerticalAxis, cssClass) {
		let tableauBody = document.getElementById("FontMap");
		tableauBody.getElementsByTagName("tr")[newPosVerticalAxis].getElementsByTagName("td")[newPosHorizontalAxis].classList.add(cssClass);
		tableauBody.getElementsByTagName("tr")[oldPosVerticalAxis].getElementsByTagName("td")[oldPosHorizontalAxis].classList.remove(cssClass);
	}

	addElement(element){
		//tableau elements 
		this.mapItems.push(element);
	}

	initPlayerInfos(players) {
		for (let i = 0; i < players.length; i++) {
  			let playerElement = document.getElementsByClassName("playerContainer")[i];

			let nameH3 = playerElement.getElementsByClassName("playerName")[0];
  			nameH3.textContent = players[i].nom;
  			playerElement.replaceChild(nameH3, playerElement.getElementsByClassName("playerName")[0]);

			let imageDiv = playerElement.getElementsByClassName("playerImage")[0];
  			imageDiv.classList.add(players[i].cssClass);
  			playerElement.replaceChild(imageDiv, playerElement.getElementsByClassName("playerImage")[0]);


  			this.updatePlayerInfos(players[i]);
		}
	}

	updatePlayerInfos(player) {
		let playerElement = document.getElementsByClassName("playerContainer")[player.id - 1];  			

		let hpP = playerElement.getElementsByClassName("playerHp")[0].getElementsByTagName("p")[0];
  		let hpSpan = document.createElement("span");
  		hpSpan.textContent = player.sante;
  		hpP.replaceChild(hpSpan, hpP.getElementsByTagName("span")[0]);
  		// hpP.appendChild(hpSpan);

		let coordinatesP = playerElement.getElementsByClassName("playerCoordinates")[0].getElementsByTagName("p")[0];
		let coordinatesSpan = document.createElement("span");
		coordinatesSpan.textContent = player.horizontalAxis + ", " + player.verticalAxis;
		coordinatesP.replaceChild(coordinatesSpan, coordinatesP.getElementsByTagName("span")[0]);
		// coordinatesP.appendChild(coordinatesSpan);

		let armeNameH3 = playerElement.getElementsByClassName("playerArmeName")[0];
  		armeNameH3.textContent = player.arme.nom;
  		playerElement.replaceChild(armeNameH3, playerElement.getElementsByClassName("playerArmeName")[0]);

		let armeForceP = playerElement.getElementsByClassName("playerArmeForce")[0].getElementsByTagName("p")[0];
		let armeForceSpan = document.createElement("span");
		armeForceSpan.textContent = player.arme.force;
		armeForceP.replaceChild(armeForceSpan, armeForceP.getElementsByTagName("span")[0]);
		// armeForceP.appendChild(armeForceSpan);


		let imageArmeDiv = document.createElement("div");
  		imageArmeDiv.classList.add("playerArmeImage", player.arme.cssClass);
		playerElement.replaceChild(imageArmeDiv, playerElement.getElementsByClassName("playerArmeImage")[0]);
	}

	isEveryoneAlive() {
		for (let i = 0; i < this.mapItems.length; i++) { // On parcourt les items de la map
			if (this.mapItems[i].constructor.name == "Personnage") { // Si c'est un personnage
				if (this.mapItems[i].sante <= 0) // On check ses points de vie
					return 0;
			}
		}
		return 1;
	}

	roundOfPlayerId(roundNb) {
		let playerId;

		playerId = roundNb % 2;

		if (playerId == 0)
			playerId = 2;

		return playerId;


		// roundNb -> playerId (désiré)      roundNb  %  2 = Result
		//    1    ->    1                      1     %  2 =   1     
        //    2    ->    2                      2     %  2 =   0     
        //    3    ->    1                      3     %  2 =   1     
		//    4    ->    2                      4     %  2 =   0     
		//    5    ->    1                      5     %  2 =   1     
		//    6    ->    2                      6     %  2 =   0     
	}

	endGame(winner) {
		console.log("Fin du jeu !");

		// Suppression de la map FrontEnd ainsi que des informations sur les 2 joueurs
		let container = document.getElementsByClassName("container-main")[0];
		container.removeChild(container.getElementsByClassName("player1Container")[0]);
		container.removeChild(container.getElementsByClassName("frontMapContainer")[0]);
		container.removeChild(container.getElementsByClassName("player2Container")[0]);

		// Mise en place du message de victoire
		let result = document.createElement("p");
		result.textContent = winner.nom + " est le vainqueur.";
		container.appendChild(result);

		// Ajout du bouton replay
		let btnReplay = document.createElement("div");
		btnReplay.textContent = "Recommencer";
		btnReplay.classList.add("btn");
		container.appendChild(btnReplay);

		// Mise en forme en colonne du message de victoire et du bouton Replay
		container.style.flexDirection = "column";

		// Ecoute du bouton replay pour refresh la page
		btnReplay.addEventListener("click", function() {
	  		document.location.reload();
		});
	}
}