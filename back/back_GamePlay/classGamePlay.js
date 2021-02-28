class Stratego extends Observable{

    constructor(){
        super();
        this.currentPlayer=0;
        this.grid= this.gridSetUp();
        this.winner=0;
        this.started= false;

        this.previousPlay = {"pion": null, "row": null, "column":null};

        this.setup();
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
                return 1;
            }
            else if(this.grid[i][j]){

                this.winner=Pion.equipe;
                return 1;
            }
            else if(Pion.name ==="Spy" && this.grid[i][j].name ==="Marshal"){
                return 1;
            }
            else if(Pion.name > this.grid[i][j].name){
                return 1;
            }
            else if(Pion.name == this.grid[i][j].name){
                console.log("Les deux pions sont supprimés");
                return 2;
            }else{
                return 0;
            }
        }
    }
    play(row,column){

    if(this.grid[row][column].name == 'River') return 1;

        if(this.isAllUnSelect() && this.grid[row][column].name != 'empty'){
            if(this.grid[row][column].name != 'River'){
                this.grid[row][column].select = true;
            }
            for(let i =-1;i<=1;i+=2){
                if(this.grid[row+i][column].name != 'River'){
                    this.grid[row+i][column].select = true;
                    this.grid[row+i][column].equipe = this.grid[row][column].equipe;
                }
                if(this.grid[row][column+i].name != 'River'){
                    this.grid[row][column+i].select = true;
                    this.grid[row][column+i].equipe = this.grid[row][column].equipe;
                }
            }
            this.previousPlay["pion"] = this.grid[row][column];
            this.previousPlay["row"] = row;
            this.previousPlay["column"] = column;
            return 0;
        }

        if(this.grid[row][column].select == true){
            this.grid[row][column] = this.previousPlay["pion"];
            this.grid[this.previousPlay["row"]][this.previousPlay["column"]] = new Pion('empty','none');
            this.unSelectAll();
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
                }
            }
        }
    }
    setup(){
        this.grid[2][2]= new Pion('Spy',1);
        this.grid[2][2].select = false;

        this.grid[3][2]= new Pion('Spy',1);
        this.grid[3][2].select = false;
        console.log(this.grid);
    }
}