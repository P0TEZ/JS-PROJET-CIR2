const pionData = require("./pion_data");

let modulePion = (function(){
    
    return{
        getIndex(name){
            let index = pionData.findIndex((pion) => pion.name == name);
            return index != -1?index:0;
        },
        getStrength(name){return pionData[this.getIndex(name)].strength;},
        getSpeciality(name){return pionData[this.getIndex(name)].speciality;},
        getImg(name){return pionData[this.getIndex(name)].img;},
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
        getAllPiece(){
            return pionData.filter(pion=>pion.number);
        }
        
    }
})();




module.exports = modulePion; 

//module.exports = Pion;