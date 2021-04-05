let pionData = [
    {id:'1', name:'Bomb',number:'6', strength:'B' , img:'bomb.png', speciality:'1'},
    {id:'2', name:'Marshal',number:'1', strength:10, img:'marshal.png', speciality: '1'},
    {id:'3', name:'General', number:'1',strength:9, img:'general.png', speciality: '0'},
    {id:'4', name:'Colonel', number:'2', strength:8, img:'colonel.png',speciality: '0'},
    {id:'5', name:'Major', number:'3', strength:7, img:'major.png',speciality: '0'},
    {id:'6', name:'Captain', number:'4', strength:6, img:'captain.png',speciality: '0'},
    {id:'7', name:'Lieutenant', number:'4', strength:5, img:'lieutenant.png',speciality: '0'},
    {id:'8', name:'Sergeant', number:'4', strength:4, img:'sergeant.png',speciality: '0'},
    {id:'9', name:'Miner', number:'5', strength:3, img:'miner.png',speciality: '1'},
    {id:'10', name:'Scout', number:'8', strength:2, img:'scout.png',speciality: '1'},
    {id:'11', name:'Spy', number:'1', strength:1, img:'spy.png',speciality: '1'},
    {id:'12', name:'Flag', number:'1', strength:'F', img:'flag.png',speciality: '1'},
    {id:'98', name:'empty', strength:'0'},
    {id:'99', name:'River'},
];

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
