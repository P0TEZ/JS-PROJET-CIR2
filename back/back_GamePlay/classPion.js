let modulePion = (function(){
    
    return{
        getId(name){
            for(let i=0; i<pionData.length; i++){
                if(pionData[i].name == name){
                    return i++;
                }
            }
        },
        getStrength(name){return pionData[this.getId(name)].strength;},
        getSpeciality(name){return pionData[this.getId(name)].speciality;},
        getImg(name){return pionData[this.getId(name)].img;},
        getNumber(name="none"){
            if(name !="none"){
                return pionData[this.getId(name)].number;
            }else{
                let count=0;
                for (const pion of pionData) {
                    if(pion.name) count += pion.number;
                }
            }
        },
        
    }
})();


class Pion{

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