export default class Map {
	constructor(mapItems, nbInaccessibleBoxes){
		this.mapTab = new Array(10);
		this.createAndInitMap();
		this.addElementsInsideMap(mapItems, nbInaccessibleBoxes);
	}

	createAndInitMap(elements){
		for (let i = 0; i < 10; i++) {
			this.mapTab[i] = new Array(10);
			for (let j = 0; j < 10; j++) {
				this.mapTab[i][j] = 0;
			}
		}
	}
	
	addElementsInsideMap(mapItems, nbInaccessibleBoxes){

		// Ajout des items
		for (let k = 0; k < 6; k++) {
			let i = this.getRandomInt(9);
			let j = this.getRandomInt(9);

			while ( (this.mapTab[i][j] != 0) || (this.isThePlayerNear(i, j) == 1) ) {
				i = this.getRandomInt(9);
				j = this.getRandomInt(9);
			}
			this.mapTab[i][j] = mapItems[k];
			mapItems[k].majCoordinates(i, j);
		}
		
		// Ajout des obstacles
		for (let l = 0; l < nbInaccessibleBoxes; l++) {
			let i = this.getRandomInt(9);
			let j = this.getRandomInt(9);
		
			while (this.mapTab[i][j] != 0) {
				i = this.getRandomInt(9);
				j = this.getRandomInt(9);
			}	
			this.mapTab[i][j] = 1;
		} 
	}
	
	isThePlayerNear(i, j) {
		//Si un joueur est à côté de la position [i][j], return 1
		//Sinon, return 0

		let aroundBoxesI = [0, 1, 0, -1];
		let aroundBoxesJ = [-1, 0, 1, 0];

		for (let c = 0; c < 4; c++) {
			if (((i + aroundBoxesI[c] >= 0) && (j + aroundBoxesJ[c] >= 0)) && ((i + aroundBoxesI[c] <= 9) && (j + aroundBoxesJ[c] <= 9))) {
				if (Object.getPrototypeOf(this.mapTab[i + aroundBoxesI[c]][j + aroundBoxesJ[c]]).constructor.name == "Personnage") {
					// console.log("Attention, il y a un personnage à côté de cette position");
					// console.log("Position testée => i=" + i + " j=" + j);
					// console.log("Mais il y a déjà un joueur présent en position => i=" + [i + aroundBoxesI[c]] + " j=" + [j + aroundBoxesJ[c]]);
					return (1);
				}
			}
		}
		return (0);
	}

	afficherMapTab(){
		let reverseTab = new Array(10);
		for (let i = 0; i < 10; i++) {
			reverseTab[i] = new Array(10);
			for (let j = 0; j < 10; j++) {
				reverseTab[i][j] = this.mapTab[j][i];
			}
		} 
		console.table(reverseTab);
	}

	getRandomInt(max) {
  		return Math.floor(Math.random() * Math.floor(max));
	}

	movePlayer(newPosHorizontalAxis, newPosVerticalAxis, oldPosHorizontalAxis, oldPosVerticalAxis, player) {
		let tableauBody = document.getElementById("FontMap");
		let oldWeapon = player.letOldWeapon();

		if (this.mapTab[newPosHorizontalAxis][newPosVerticalAxis].constructor.name == "Arme") {
			player.getNewWeapon(this.mapTab[newPosHorizontalAxis][newPosVerticalAxis]);
			tableauBody.getElementsByTagName("tr")[newPosVerticalAxis].getElementsByTagName("td")[newPosHorizontalAxis].classList.remove(this.mapTab[newPosHorizontalAxis][newPosVerticalAxis].cssClass);
			tableauBody.getElementsByTagName("tr")[newPosVerticalAxis].getElementsByTagName("td")[newPosHorizontalAxis].classList.add(this.mapTab[oldPosHorizontalAxis][oldPosVerticalAxis].cssClass);
		}

		this.mapTab[newPosHorizontalAxis][newPosVerticalAxis] = this.mapTab[oldPosHorizontalAxis][oldPosVerticalAxis];
		this.mapTab[oldPosHorizontalAxis][oldPosVerticalAxis] = oldWeapon;
	
		if (oldWeapon != 0)
			tableauBody.getElementsByTagName("tr")[oldPosVerticalAxis].getElementsByTagName("td")[oldPosHorizontalAxis].classList.add(oldWeapon.cssClass);
	}
}