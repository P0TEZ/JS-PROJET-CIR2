class gamePlayView {
    
    constructor(game, name){
        this.game = game;
        this.name = name;
        this.grille = this.grilleStetter();
    /*
        this.eventSetter();
        this.viewSetUp();*/
    }

    grilleStetter(){
        let grille = new Array(10);
        for (const ligne of grille) {
            ligne = new Array(10);
        }
    }
}