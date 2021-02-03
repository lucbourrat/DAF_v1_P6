export default class Arme {
	constructor(nom, force, id){
		this.nom = nom;
		this.force = force;
		this.id = id;
		this.cssClass = "arme" + id;
		this.horizontalAxis = -1;
		this.verticalAxis = -1;
	}

	majCoordinates (i, j) {
		this.horizontalAxis = i;
		this.verticalAxis = j;
	}
}