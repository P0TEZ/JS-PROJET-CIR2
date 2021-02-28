class Stratego extends Observable{

    constructor(){
        super();
        this.currentPlayer=0;
        this.grid= this.gridSetUp();
        this.winner=0;
        this.started= false;

        this.setup();
    }
    gridSetUp(){
        let grille = new Array(10);
        
        for(let row=0;row<grille.length;++row){

            grille[row] = new Array(10);

            for(let column = 0; column<grille[row].length;++column){
                grille[row][column]= new Pion(3,2);
                grille[row][column].name = 'empty';
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
    play(x,y){
        if(this.grid[x][y] != 'empty' && this.grid[x][y] != 'River'){
            let AllUnSelect = true;
            for(let row=0;row<this.grid.length;++row){
                for(let column = 0; column<this.grid[row].length;++column){
                if(this.grid[row][column])
                    if(this.grid[row][column].select == true){
                         AllUnSelect=false;
                    }

                }
            }

            if(AllUnSelect){
                this.grid[x][y].select = true;
                for(let i =-1;i<=1;i+=2){
                    this.grid[x+i][y].select = true;
                    this.grid[x][y+i].select = true;
                    this.grid[x][y+i].equipe = this.currentPlayer?'red':'blue';
                    this.grid[x+i][y].equipe = this.currentPlayer?'red':'blue';
                }

            }
            if(!AllUnSelect){
                
            }
        }
    }
    setup(){
        this.grid[2][2]= new Pion(3,1);
        this.grid[2][2].select = false;

        this.grid[3][2]= new Pion(3,1);
        this.grid[3][2].select = false;
        console.log(this.grid);
    }
}