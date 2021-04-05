const modulePion=require('./modulePion');

class Pion{

    //Recuperer les caracteritiques des pions grâce au module des pions
    constructor(name,joueur){
        this.name = name;
        this.number = modulePion.getNumber(this.name);
        this.strength = modulePion.getStrength(this.name);
        this.speciality = modulePion.getSpeciality(this.name);
        this.select = false;
        this.img = modulePion.getImg(this.name);
        if(joueur == 0 || joueur ==="red"){
            this.equipe="red";
        }else if(joueur == 1 || joueur ==="blue"){
            this.equipe = "blue";
        }else{
            this.equipe="none";
        }

    }
}

module.exports = Pion;