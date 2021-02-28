let module = (function(){
    const tableau= pion;
    
    return{
        getId(name){
            for(let i=0; i<tableau.length; i++){
                if(tableau[i].name == name){
                    return i++;
                }
            }
        },
        getNumber(name){return tableau[this.getId(name)].number;},
        getStrength(name){return tableau[this.getId(name)].strength;},
        getSpeciality(name){return tableau[this.getId(name)].speciality;},
        getImg(name){return tableau[this.getId(name)].img;}
    }
})();


class Pion{

    constructor(name,joueur){
        this.name = name;
        this.number = module.getNumber(this.name);
        this.strength = module.getStrength(this.name);
        this.speciality = module.getSpeciality(this.name);
        this.select = false;
        this.img = module.getImg(this.name);
        if(joueur == 0 || joueur ==="red"){
            this.equipe="red";
        }else if(joueur == 1 || joueur ==="blue"){
            this.equipe = "blue";
        }else{
            this.equipe="none";
        }

    }
}