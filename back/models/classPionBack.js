const pionData = require('./pion_data');


//Module qui permet de récupérer les données du tableau contenant tous les pions
let modulePion = (function(){
    
    return{
        //récuperer l'index d'un pion selon son nom
        getIndex(name){
            let index = pionData.findIndex((pion) => pion.name == name);
            return index != -1?index:0;
        },

        //récupérer la force du pion
        getStrength(name){return pionData[this.getIndex(name)].strength;},

        //voir si le pion à une spécialité
        getSpeciality(name){return pionData[this.getIndex(name)].speciality;},

        //récupérer l'image du pion correspondant
        getImg(name){return pionData[this.getIndex(name)].img;},

        //Recupere le nombre de pions pour un type de personnage
        getNumber(name){
            if(name !="all"){
                return pionData[this.getIndex(name)].number;
            }else{
                let count=0;
                for (const pion of this.getAllPiece()) {
                    count += parseInt(this.getNumber(pion.name));
                }
                return count;
            }
        },

        //permet de recuperer tous les pions du tableau
        getAllPiece(){
            return pionData.filter(pion=>pion.number);
        }
        
    }
})();

module.exports = modulePion;