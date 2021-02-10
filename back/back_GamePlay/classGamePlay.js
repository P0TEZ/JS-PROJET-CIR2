class Stratego extends Observable{

    constructor(){
        super();
        this.currentPlayer=0;
        this.grid=new Array(10);
        this.winner=0;
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
    
        if(this.grid[i][j] === undefined && this.isFinished() === 0 && this.getCaseState() !== 'River' && this.started){
            this.grid[i][j] = Pion;
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
        }
    }

    attack(Pion,i,j){
        if(this.grid[i][j].equipe !== Pion.equipe){
            if(Pion.name === "Miner" && this.grid[i][j].name === "Bomb"){
                return true;
            }
            if(this.grid[i][j]){
                return true;
                this.winner=Pion.equipe;
            }
            if(Pion.name ==="Spy" && this.grid[i][j].name ==="Marshal"){
                return true;
            }

            //verifie si B dans combat ==> verifier si demineur
            //verifie si F dans combat
            // verifie si 1 attaque 10
            //reste c'est le plus grand qui gagne
            //si égalite les deux pions meurent
        }
    }

}