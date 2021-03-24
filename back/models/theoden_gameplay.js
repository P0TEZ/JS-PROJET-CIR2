class Theoden_gamePlay extends Theoden_observable{

    constructor(){
        super();
        this.grid= this.gridSetUp();
        this.bluePlayerPionList = new Array();
        this.redPlayerPionList = new Array();

        this.currentPlayer=Math.floor(Math.random()*2)?'blue':'red';
        this.winner='none';
        this.started= false;

        this.previousPlay = {"pion": null, "row": null, "column":null};

        this.setup();
        console.log(this.currentPlayer);
    }
}

module_gameplay.exports = Theoden_observable;