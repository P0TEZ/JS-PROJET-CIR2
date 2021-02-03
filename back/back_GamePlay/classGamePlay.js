class Stratego extends Observable{

    constructor(){
        this.currentPlayer=0;
        this.grid=new Array(10);
        this.winner=null;
        this.started= false;

        for(let i=0; i<this.grid.length;i++){
            this.grid[i]= new Array(10);
        }
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

    play(Pion, i, j){
    
        if(this.grid[pos_i][pos_j] == undefined && this.isFinished() == 0 && this.getCaseState() != 'River' && this.started){
            if(this.currentPlayer == 0){
                this.grid[i][j] = Pion.name;
                this.currentPlayer=1;
            }else{
                this.grid[i][j] = Pion.name;
                this.currentPlayer=0;
            }
        }
    }

    isFinished(){

    }
}