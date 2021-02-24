export default class Personnage {
	constructor(nom, sante, arme, id){
		this.nom = nom;
		this.sante = sante;
		this.arme = arme;
		this.arme2 = 0;
		this.id = id;
		this.cssClass = "player" + id;
		this.horizontalAxis = -1;
		this.verticalAxis = -1;
		this.shield = 0;
	}

	majCoordinates (i, j) {
		this.horizontalAxis = i;
		this.verticalAxis = j;
	}

	getNewWeapon(newWeapon) {
		this.arme2 = this.arme;
		this.arme = newWeapon;
	}

	letOldWeapon() {
		if (this.arme2 == 0)
			return 0;
		else {
			let oldWeapon = this.arme2;
			this.arme2 = 0;
			return (oldWeapon);
		}
	}

	amIAlive() {
		if (this.sante > 0)
			return 1;
		return 0;
	}	

	attaquer(cible) {
		if (this.sante > 0) {
			const degats = this.force;
			console.log(`${this.nom} attaque ${cible.nom} et lui inflige ${degats} points de dégats`);
			cible.sante-=degats;

			if (cible.sante > 0) {
				console.log(`${cible.nom} a encore ${cible.sante} points de vie`);
			}
			else{  
				cible.sante = 0;
				console.log(`${this.nom} a tué ${cible.nom}`);
			}
		}
		else{
			console.log(`${this.nom} n\'a plus de points de vie et ne peut plus attaquer.`);
		}
	}
}