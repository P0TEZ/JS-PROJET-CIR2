class Theoden_pion {
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

let modulePion = (function(){

    return{
        getIndex(name){
            let index = Theoden_pionData.findIndex((pion) => pion.name == name);
            return index != -1?index:0;
        },
        getStrength(name){return Theoden_pionData[this.getIndex(name)].strength;},
        getSpeciality(name){return Theoden_pionData[this.getIndex(name)].speciality;},
        getImg(name){return Theoden_pionData[this.getIndex(name)].img;},
        getNumber(name){
            if(name !="all"){
                return Theoden_pionData[this.getIndex(name)].number;
            }else{
                let count=0;
                for (const pion of this.getAllPiece()) {
                    count += parseInt(this.getNumber(pion.name));
                }
                return count;
            }
        },
        getAllPiece(){
            return Theoden_pionData.filter(pion=>pion.number);
        }

    }
})();

let Theoden_pionData = [
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
