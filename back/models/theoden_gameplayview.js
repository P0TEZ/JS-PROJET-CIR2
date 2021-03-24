class Theoden_gameplayview{
    constructor(game, name){
        this.game = game;
        this.name = name;
        this.grille = this.grilleStetter();

        this.playerPionListSetter();
        this.grilleResize();
        /*    this.eventSetter();*/
    }
}

module_gameplayview.exports = Theoden_gameplayview;