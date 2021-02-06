let Pion = (function(){
    const tableau= pion;

    return{

        getName(id){return tableau[id].name;},
        getNumber(id){return tableau[id].number;},
        getStrength(id){return tableau[id].strength;},
        getSpeciality(id){return tableau[id].speciality;},
        getImg(id){return tableau[id].img;}
    }
})();