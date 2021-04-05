const Observable = require("./Observable");
const Pion = require("./classPion");
//const Pion = require("./classPion"); 
const modulePion=require('./modulePion');

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
        console.log(this.currentPlayer);
    }


    // Fonction qui initialise la grille de jeu avec des cases vides et des cases rivières
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

    //Fonction qui récupère le joueur actuel
    getCurrentPlayer(){
        return this.currentPlayer;
    }

    //Fonction qui récupère la couleur du gagnant
    getWinner(){
        return this.winner;
    }

    //Fonction qui permet d'ajouter un nouveau pion à un endroit précis et l'ajoute à la liste de l'equipe correspondante
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

    //Fonction qui simule une attaque et return si le pion est suprimé ou non, 
    // 0 : pas de pion supprime, 
    // 1 : un pion supprime
    // 2: les deux pions sont suuprimés
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

    //Fonction qui simule un tour (place les pions et attaque), si le jeu n'est pas commencé les joueurs remplissent leurs grilles
    // sinon ils jouent
    play(row,column, joueurActuel){

        //si le joueur joue alors que ce n'est pas son tour
        if(joueurActuel != this.currentPlayer && this.started){
            return 0;
        }
        let selected = this.grid[row][column];
        //console.log(row+"   "+column); 

        //si on joue sur une rivière
        if(this.grid[row][column].name == 'River') return 1;

        if(this.started){

            //si on joue un pion jouable et qu'on n'a pas deja selectionné un pion
            if(this.isAllUnSelect() && selected.name != 'empty' && selected.name != 'River' && selected.name != 'Flag' && selected.name != 'Bomb' && selected.equipe === this.currentPlayer){
            
                this.generatePath(row,column);
            }

            //si == true alors on peut deplacer sur la case 
            else if(this.grid[row][column].select == true){
                
                this.pionMove(row,column);

                if( row != this.previousPlay.row || column != this.previousPlay.column){
                    this.currentPlayer = this.currentPlayer ==='blue'?'red':'blue';
                }
            }
        }else{//sinon la game n'a pas commencé et les joueurs placent leurs pions
            let pionList = modulePion.getAllPiece();

            if(joueurActuel == 'blue'){
                for (const pion of pionList) {
                    if(this.bluePlayerPionList.filter(aPion=>aPion === pion.name).length<pion.number){
                        this.addPion(row,column,pion.name,joueurActuel);
                    }
                }
            }else{//sinon joueur rouge
                for (const pion of pionList) {
                    if(this.redPlayerPionList.filter(aPion=>aPion === pion.name).length<pion.number) {
                        this.addPion(row, column, pion.name, joueurActuel);
                    }
                }
            }

            //si la somme des pions des 2 joueurs >= ou pions max durant une partie on lance la game
            if((this.redPlayerPionList.length + this.bluePlayerPionList.length) >= 2*modulePion.getNumber('all')){
                this.started = true;

            }

            //on passe le tour du joueur
            this.currentPlayer = this.currentPlayer ==='blue'?'red':'blue';
        }

    }

    //Fonction qui vérifie qu'aucun pion n'est selectionne
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

    //Fonction qui remet toutes les cases non selectionnable et on retire les equipe des cases vide
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

    //Fonction qui génére les possibilités de déplacement d'un pion
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

        //on garde en memoire le pion qui se va se deplacer et sa position
        this.previousPlay.pion = this.grid[row][column];
        this.previousPlay.row = row;
        this.previousPlay.column = column;
    }

    //Fonction qui déplace le pion en memoire d'un point A à un point B
    pionMove(row,column){
        
        //si la case est vide on le deplace
        if(this.grid[row][column].name =="empty"){
            this.grid[row][column] = this.previousPlay.pion;
            this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
        }

        //si elle est prise par un pion de la meme equipe == impossible
        //si c est un pion de l autre joueur on lance le combat
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

    //Fonction qui permet de placer pour un joueur tous les pions restant de facon aleatoire
    autoFill(equipe=this.currentPlayer){
        let pionList = modulePion.getAllPiece();
        let tmpPionList = new Array();
        
        //genere la liste avec tous les pions possible d'une partie
        for (const pion of pionList) {
            for(let i=0; i<pion.number;++i){
                tmpPionList.push(pion.name);
            }
        }
        //pour le joueur bleu
        if(equipe=='blue'){

            //retire de la liste tmp les pions deja sur le terrain
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

            //on parcour tous le pateau coté bleu et on place sur chaque case vide un pion 
            //pris aleatoirement dans la liste tmp (et on le retire de tmp)
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

        }else{//meme chose pour rouge
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

        //s'il y a tous les pion on commence la partie
        if((this.redPlayerPionList.length + this.bluePlayerPionList.length) >= 2*modulePion.getNumber('all')){
            this.started = true;
        }
    }

    //Fonction qui détermine la victoire
    end(){
        let count=0;
        if(!this.started ) return 0; //ps de victoire
        
        //si plus de pions mobile pour bleu
        if(!this.bluePlayerPionList.includes('Marshal') && !this.bluePlayerPionList.includes('General')
            && !this.bluePlayerPionList.includes('Colonel') && !this.bluePlayerPionList.includes('Major')
            && !this.bluePlayerPionList.includes('Captain') && !this.bluePlayerPionList.includes('Lieutenant')
            && !this.bluePlayerPionList.includes('Sergeant') && !this.bluePlayerPionList.includes('Scout')
            && !this.bluePlayerPionList.includes('Spy') && !this.bluePlayerPionList.includes('Miner')){
            this.winner="red";
            count+=1;
          
        }
        //si plus de pion mobile pour rouge
        if(!this.redPlayerPionList.includes('Marshal') && !this.redPlayerPionList.includes('General')
            && !this.redPlayerPionList.includes('Colonel') && !this.redPlayerPionList.includes('Major')
            && !this.redPlayerPionList.includes('Captain') && !this.redPlayerPionList.includes('Lieutenant')
            && !this.redPlayerPionList.includes('Sergeant') && !this.redPlayerPionList.includes('Scout')
            && !this.redPlayerPionList.includes('Spy') && !this.redPlayerPionList.includes('Miner')){
            this.winner="blue";
            count+=1;

        }
        if(count == 1) return 3; // Une des équipes n'a plus de pions déplaçable
        if(count == 2) return 4; // Match nul
        if(this.winner == 'red') {
            return 1; //drapeau bleu attrapé par les rouges
        }
        if(this.winner == 'blue') {
            return 2; //drapeau rouge attrapé par les bleus
        }
        return 0; //pas de victoire
        
    }
}

module.exports = GamePlay;