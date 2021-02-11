let module = (function(){
    const tableau= pion;

    return{

        getName(id){return tableau[id].name;},
        getNumber(id){return tableau[id].number;},
        getStrength(id){return tableau[id].strength;},
        getSpeciality(id){return tableau[id].speciality;},
        getImg(id){return tableau[id].img;}
    }
})();


class Pion{

    constructor(id,joueur){
        this.name = module.getName(id);
        this.number = module.getNumber(id);
        this.strength = module.getStrength(id);
        this.speciality = module.getSpeciality(id);
        this.img = module.getImg(id);
        if(joueur == 0){
            this.equipe="red";
        }else if(joueur == 1){
            this.equipe = "blue";
        }else{
            this.equipe="none";
        }

    }
}