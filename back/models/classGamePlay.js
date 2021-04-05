const Observable = require("./Observable");
const Pion = require("./pion");
//const Pion = require("./classPion"); 
const modulePion=require('./classPionBack');

class GamePlay extends Observable{

    constructor(){
        super();
        this.grid= this.gridSetUp();
        this.bluePlayerPionList = new Array();
        this.redPlayerPionList = new Array();
        
        this.currentPlayer=Math.floor(Math.random()*2)?'blue':'red';
        this.winner = null;
        this.started= false;

        this.previousPlay = {"pion": null, "row": null, "column":null};

        this.setup();
        console.log(this.currentPlayer);
    }
    gridSetUp(){
        let grille = new Array(10);
        
        for(let row=0;row<grille.length;++row){

            grille[row] = new Array(10);

            for(let column = 0; column<grille[row].length;++column){
                grille[row][column]= new Pion('empty','none');
                grille[row][column].name = 'empty';
                
                if(row<6 && row>3){
                     if((column<4 && column>1)||(column>5 && column<8)){
                        grille[row][column]= new Pion('River','none');
                    }
                }
            }
        }
        console.log("Grille SetUp success");
        return grille;
    }
    reset(){
        for(let i=0; i<this.grid.length;i++){
            for(let j=0; j<this.grid.length;i++){
                this.grid[i][j] = null;
            }
        }

        this.currentPlayer=0;
    }

    getCurrentPlayer(){
        return this.currentPlayer;
    }

    getWinner(){
        return this.winner;
    }

    getCaseState(i,j) {
        return this.grid[i][j];
    }
    addPion(row,column,name,equipe='none'){
        if(this.grid[row][column].name ==='empty'){
            
            if(equipe === "blue" && this.bluePlayerPionList.filter(pionName=>name === pionName).length<modulePion.getNumber(name)){
                if(row < 4){
                    this.grid[row][column] = new Pion(name,equipe);
                    this.bluePlayerPionList.push(name);
                    return 0;
                }
            }else if(equipe === 'red' && this.redPlayerPionList.filter(pionName=>name === pionName).length<modulePion.getNumber(name)){
                if(row > 5){
                    this.grid[row][column] = new Pion(name,equipe);
                    this.redPlayerPionList.push(name);
                    return 0;
                }
            }else if(equipe === 'none'){
                this.grid[row][column] = new Pion(name,equipe);
                return 0;
            }
            return 1;            
        }
        else{
            return 1;
        }

    }
    attack(Pion,i,j){
        if(this.grid[i][j].equipe !== Pion.equipe){
            if(Pion.name === "Miner" && this.grid[i][j].name === "Bomb"){
                console.log("Le miner a trouvé une bomb");
                return 1;
            }
            else if(Pion.name ==="Spy" && this.grid[i][j].name ==="Marshal"){
                console.log("Le spy a tué le marshal");
                return 1;
            }
            else if(this.grid[i][j].name ==="Flag"){
                this.winner = Pion.equipe;
                console.log("dans attack "+Pion.equipe); 
                console.log("dans attack "+this.winner); 
                console.log("partie finie"); 
                
                return 1;
            }
            else if(Pion.strength > this.grid[i][j].strength){
                console.log("Le pion remporte le duel");
                return 1;
            }
            else if(Pion.name == this.grid[i][j].name){
                console.log("Les deux pions sont supprimés");
                return 2;
            }else{
                console.log("Le pion perd le duel");
                return 0;
            }
        }
    }
    play(row,column, joueurActuel){
        if(joueurActuel != this.currentPlayer && this.started){
            return 0;
        }
        let selected = this.grid[row][column];
        //console.log(row+"   "+column); 
        if(this.grid[row][column].name == 'River') return 1;

        if(this.started){
            if(this.isAllUnSelect() && selected.name != 'empty' && selected.name != 'River' && selected.name != 'Flag' && selected.name != 'Bomb' && selected.equipe === this.currentPlayer){
            
                this.generatePath(row,column);
            }
            else if(this.grid[row][column].select == true){
                
                this.pionMove(row,column);

                if( row != this.previousPlay.row || column != this.previousPlay.column){
                    this.currentPlayer = this.currentPlayer ==='blue'?'red':'blue';
                }
            }
        }else{
            let pionList = modulePion.getAllPiece();

            if(joueurActuel == 'blue'){
                for (const pion of pionList) {
                    if(this.bluePlayerPionList.filter(aPion=>aPion === pion.name).length<pion.number){
                        this.addPion(row,column,pion.name,joueurActuel);
                    }
                }
            }else{
                for (const pion of pionList) {
                    if(this.redPlayerPionList.filter(aPion=>aPion === pion.name).length<pion.number) {
                        this.addPion(row, column, pion.name, joueurActuel);
                    }
                }
            }
            if((this.redPlayerPionList.length + this.bluePlayerPionList.length) >= 2*modulePion.getNumber('all')){
                this.started = true;

            }
            this.currentPlayer = this.currentPlayer ==='blue'?'red':'blue';
        }

        console.log(this.winner);

        console.log("fin play"); 
    }
    isAllUnSelect(){
        let AllUnSelect = true;
        for(let row=0;row<this.grid.length;++row){
            for(let column = 0; column<this.grid[row].length;++column){
                if(this.grid[row][column]){
                    if(this.grid[row][column].select == true){
                        AllUnSelect=false;
                    }
                }
            }
        }
        return AllUnSelect;
    }
    unSelectAll(){
        for(let row=0;row<this.grid.length;++row){
            for(let column = 0; column<this.grid[row].length;++column){
                if(this.grid[row][column]){
                    this.grid[row][column].select = false;
                    if(this.grid[row][column].name =="empty"){
                        this.grid[row][column].equipe = "none";
                    }                  
                }
            }
        }
    }
    generatePath(row,column){
        console.log("generate path"+row+" | "+column); 
        this.grid[row][column].select = true;
        if(this.grid[row][column].name != 'Scout'){
            for(let i =-1;i<=1;i+=2){
                if(row+i < this.grid.length && row+i >=0 && this.grid[row+i][column].name != 'River' && this.grid[row+i][column].equipe != this.grid[row][column].equipe){
                    this.grid[row+i][column].select = true;
                    if(this.grid[row+i][column].equipe =="none")
                    this.grid[row+i][column].equipe = this.grid[row][column].equipe;
                }
                if(column+i < this.grid.length && column+i >=0 && this.grid[row][column+i].name != 'River' && this.grid[row][column+i].equipe != this.grid[row][column].equipe){
                    this.grid[row][column+i].select = true;
                    if(this.grid[row][column+i].equipe =="none")
                    this.grid[row][column+i].equipe = this.grid[row][column].equipe;
                }
            }
        }else{
            let n=1;

            while(column+n < this.grid.length){
                if(!this.grid[row][column+n] || this.grid[row][column+n].name == 'River' ||this.grid[row][column+n].equipe == this.grid[row][column].equipe){
                    break;
                }
                this.grid[row][column+n].select = true;
                if(this.grid[row][column+n].equipe =="none")
                this.grid[row][column+n].equipe = this.grid[row][column].equipe;
                
                if(this.grid[row][column+n].name != 'empty'){
                    break;
                }
                
                ++n;
            }
            n = 1;
            while(column-n >= 0){
                if(!this.grid[row][column-n] || this.grid[row][column-n].name == 'River' ||this.grid[row][column-n].equipe == this.grid[row][column].equipe){
                    break;
                }
                this.grid[row][column-n].select = true;
                if(this.grid[row][column-n].equipe =="none")
                this.grid[row][column-n].equipe = this.grid[row][column].equipe;

                if(this.grid[row][column-n].name != 'empty'){
                    break;
                }

                ++n;
            }
            n = 1;
            while(row+n < this.grid.length){
                if(!this.grid[row+n][column] || this.grid[row+n][column].name == 'River' ||this.grid[row+n][column].equipe == this.grid[row][column].equipe){
                    break;
                }
                this.grid[row+n][column].select = true;
                if(this.grid[row+n][column].equipe =="none")
                this.grid[row+n][column].equipe = this.grid[row][column].equipe;
                
                if(this.grid[row+n][column].name != 'empty'){
                    break;
                }
                
                ++n;
            }
            n = 1;
            while(row-n >= 0){
                if(!this.grid[row-n][column] || this.grid[row-n][column].name == 'River' ||this.grid[row-n][column].equipe == this.grid[row][column].equipe){
                    break;
                }
                this.grid[row-n][column].select = true;
                if(this.grid[row-n][column].equipe =="none")
                this.grid[row-n][column].equipe = this.grid[row][column].equipe;

                if(this.grid[row-n][column].name != 'empty'){
                    break;
                }

                ++n;
            }
            
        
        }
        this.previousPlay.pion = this.grid[row][column];
        this.previousPlay.row = row;
        this.previousPlay.column = column;
    }
    pionMove(row,column){
        if(this.grid[row][column].name =="empty"){
            this.grid[row][column] = this.previousPlay.pion;
            this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
        }
        else if(this.grid[row][column].equipe != this.previousPlay["pion"].equipe){
            let result = this.attack(this.previousPlay.pion,row,column);

            switch (result){
                case 0:
                    if(this.previousPlay.pion.equipe == 'blue'){
                        this.bluePlayerPionList.splice(this.bluePlayerPionList.findIndex(pionName=>pionName === this.previousPlay.pion.name),1);
                    }else if(this.previousPlay.pion.equipe == 'red'){
                        this.redPlayerPionList.splice(this.redPlayerPionList.findIndex(pionName=>pionName === this.previousPlay.pion.name),1);
                    }
                    this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
                    break;
                case 1:
                    if(this.previousPlay.pion.equipe == 'blue'){
                        this.redPlayerPionList.splice(this.redPlayerPionList.findIndex(pionName=>pionName === this.grid[row][column].name),1);
                    }else if(this.previousPlay.pion.equipe == 'red'){
                        this.bluePlayerPionList.splice(this.bluePlayerPionList.findIndex(pionName=>pionName === this.grid[row][column].name),1);
                    }
                    this.grid[row][column] = this.previousPlay.pion;
                    this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
                    break;
                case 2:    
                    this.redPlayerPionList.splice(this.redPlayerPionList.findIndex(pionName=>pionName === this.grid[row][column].name),1);
                    this.bluePlayerPionList.splice(this.bluePlayerPionList.findIndex(pionName=>pionName === this.grid[row][column].name),1);
                    
                    this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
                    this.grid[row][column] = new Pion('empty','none');
                    break;
            }
        }
        this.unSelectAll();
    }
    autoFill(equipe=this.currentPlayer){
        let pionList = modulePion.getAllPiece();
        let tmpPionList = new Array();
        
        for (const pion of pionList) {
            for(let i=0; i<pion.number;++i){
                tmpPionList.push(pion.name);
            }
        }
        if(equipe=='blue'){
            for (const pion of this.bluePlayerPionList) {
                let index=0;
                while( index < tmpPionList.length){
                    if(pion == tmpPionList[index]){
                        console.log(pion+" et "+tmpPionList[index]);
                        tmpPionList.splice(index,1);
                        break;
                    } 
                    index++;
                }
            }

            let rdm =0;
            while(this.bluePlayerPionList.length < modulePion.getNumber('all') && tmpPionList.length > 0){
                for(let row=0;row<5;++row){
                    for(let column = 0; column<this.grid[row].length;++column){
                        if(this.grid[row][column].name == 'empty'){
                            rdm = Math.floor(Math.random() * tmpPionList.length);
                            this.addPion(row,column,tmpPionList[rdm],'blue');
                            tmpPionList.splice(rdm,1);
                        }
                    }
                }
            }

        }else{
            for (const pion of this.redPlayerPionList) {
                let index=0;
                while( index < tmpPionList.length){
                    if(pion == tmpPionList[index]){
                        console.log(pion+" et "+tmpPionList[index]);
                        tmpPionList.splice(index,1);
                        break;
                    } 
                    index++;
                }
            }

            let rdm =0;
            while(this.redPlayerPionList.length < modulePion.getNumber('all') && tmpPionList.length > 0){
                for(let row=6;row<this.grid.length;++row){
                    for(let column = 0; column<this.grid[row].length;++column){
                        if(this.grid[row][column].name == 'empty'){
                            rdm = Math.floor(Math.random() * tmpPionList.length);
                            this.addPion(row,column,tmpPionList[rdm],'red');
                            tmpPionList.splice(rdm,1);
                        }
                    }
                }
            }
        }

        if((this.redPlayerPionList.length + this.bluePlayerPionList.length) >= 2*modulePion.getNumber('all')){
            this.started = true;
        }
    }
    setup(){
        /*this.addPion(0,0,'Scout','blue');
        this.addPion(9,0,'Scout','red');
        this.addPion(0,1,'Scout','blue');
        this.addPion(9,1,'Scout','red');
        this.addPion(0,2,'Scout','blue');
        this.addPion(9,2,'Scout','red');
        this.addPion(0,3,'Scout','blue');
        this.addPion(9,3,'Scout','red');
        this.addPion(0,4,'Scout','blue');
        this.addPion(9,4,'Scout','red');
        this.addPion(0,5,'Scout','blue');
        this.addPion(9,5,'Scout','red');
        this.addPion(0,6,'Scout','blue');
        this.addPion(9,6,'Scout','red');
        this.addPion(3,0,'Scout','blue');
        this.addPion(6,9,'Scout','red');

        this.addPion(1,2,'Bomb','blue');
        this.addPion(8,2,'Bomb','red');
        this.addPion(1,3,'Bomb','blue');
        this.addPion(8,3,'Bomb','red');
        this.addPion(1,4,'Bomb','blue');
        this.addPion(8,4,'Bomb','red');
        this.addPion(1,5,'Bomb','blue');
        this.addPion(8,5,'Bomb','red');
        this.addPion(1,6,'Bomb','blue');
        this.addPion(8,6,'Bomb','red');
        this.addPion(1,7,'Bomb','blue');
        this.addPion(8,7,'Bomb','red');
        
       this.autoFill('blue');
       this.autoFill('red');*/
    }
    end(){
        let count=0;
        if(!this.started ) return 0;
        

        if(!this.bluePlayerPionList.includes('Marshal') && !this.bluePlayerPionList.includes('General')
            && !this.bluePlayerPionList.includes('Colonel') && !this.bluePlayerPionList.includes('Major')
            && !this.bluePlayerPionList.includes('Captain') && !this.bluePlayerPionList.includes('Lieutenant')
            && !this.bluePlayerPionList.includes('Sergeant') && !this.bluePlayerPionList.includes('Scout')
            && !this.bluePlayerPionList.includes('Spy') && !this.bluePlayerPionList.includes('Miner')){
            this.winner="red";
            count+=1;
          
        }

        if(!this.redPlayerPionList.includes('Marshal') && !this.redPlayerPionList.includes('General')
            && !this.redPlayerPionList.includes('Colonel') && !this.redPlayerPionList.includes('Major')
            && !this.redPlayerPionList.includes('Captain') && !this.redPlayerPionList.includes('Lieutenant')
            && !this.redPlayerPionList.includes('Sergeant') && !this.redPlayerPionList.includes('Scout')
            && !this.redPlayerPionList.includes('Spy') && !this.redPlayerPionList.includes('Miner')){
            this.winner="blue";
            count+=1;

        }
        if(count == 1) return 3; //un joueur n'a plus de pion deplacable
        if(count == 2) return 4; // draw
        if(this.winner == 'red') {
            return 1; //plus de flag donc equipe rouge
        }
        if(this.winner == 'blue') {
            return 2; //plus de flag donc equipe bleu
        }
        return 0;
        
    }
}

module.exports = GamePlay;