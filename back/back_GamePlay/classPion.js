let modulePion = (function(){
    
    return{
        getIndex(name){
            let index = pionData.findIndex((pion) => pion.name == name);
            return index != -1?index:0;
        },
        getStrength(name){return pionData[this.getIndex(name)].strength;},
        getSpeciality(name){return pionData[this.getIndex(name)].speciality;},
        getImg(name){return pionData[this.getIndex(name)].img;},
        getNumber(name="none"){
            if(name !="none"){
                return pionData[this.getIndex(name)].number;
            }else{
                let count=0;
                for (const pion of pionData) {
                    if(pion.name) count += pion.number;
                }
            }
        },
        getAllPiece(){
            return pionData.filter(pion=>pion.number);
        }
        
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