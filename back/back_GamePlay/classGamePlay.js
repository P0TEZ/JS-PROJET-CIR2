class Stratego extends Observable{

    constructor(){
        super();
        this.currentPlayer=Math.floor(Math.random()*2)?'blue':'red';
        this.grid= this.gridSetUp();
        this.winner='none';
        this.started= true;

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

    getCaseState(i,j){
        return this.grid[i][j];
    }

    set(Pion, i, j){
    
        if(this.grid[i][j] === undefined && this.isFinished() === 0 && this.getCaseState() !== 'River' && this.started){
            if( attack(Pion,i,j) == 1){
                this.grid[i][j] = Pion;
            }
            if(this.currentPlayer === 0){
                this.currentPlayer=1;
            }else{
                this.currentPlayer=0;
            }
        }

        if(!this.started){
            if ( 0<=i<=3 && 0<=j<=3){
                this.grid[i][j]= Pion;
                if (this.currentPlayer === 0){
                    this.currentPlayer=1;
                }else{
                    this.currentPlayer=0;
                }
            }

            this.started=true;
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
                //finir game
                //mettre le gagnant
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
    play(row,column){
        let selected = this.grid[row][column];
        if(this.grid[row][column].name == 'River') return 1;

        if(this.started){
            if(this.isAllUnSelect() && selected.name != 'empty' && selected.name != 'River' && selected.name != 'Flag' && selected.name != 'Bomb' && selected.equipe === this.currentPlayer){
            
                this.generatePath(row,column);
            }
            else if(this.grid[row][column].select == true){
                
                this.pionMove(row,column);

                if( row != this.previousPlay.row || column != this.previousPlay.column){
                    this.currentPlayer = this.currentPlayer ==='blue'?'red':'blue';
                    console.log(this.currentPlayer);
                }
            }
        }
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
                    this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
                    break;
                case 1:
                    this.grid[row][column] = this.previousPlay.pion;
                    this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
                    break;
                case 2:
                    this.grid[this.previousPlay.row][this.previousPlay.column] = new Pion('empty','none');
                    this.grid[row][column] = new Pion('empty','none');
                    break;
            }
            
        }
        this.unSelectAll();
    }
    setup(){
        this.grid[2][6]= new Pion('Scout',1);
        this.grid[2][6].select = false;

        this.grid[2][1]= new Pion('Scout',1);
        this.grid[2][1].select = false;
        console.log(this.grid);
    }
}