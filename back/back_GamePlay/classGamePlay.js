class Stratego extends Observable{

    constructor(){
        this.currentPlayer=0;
        this.grid=new Array(10);
        this.winner=null;

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
}