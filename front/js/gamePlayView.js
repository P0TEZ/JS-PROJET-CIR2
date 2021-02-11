let imgLink ="../img/";

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
        let plateau = document.getElementById("plateau");            
        let grille = new Array(10);
        
        if(window.innerWidth<window.innerHeight){
            plateau.style.width="calc(100vw - 10px)";
            plateau.style.height="calc(100vw - 10px)";
        }else{
            plateau.style.width="calc(100vh - 10px)";
            plateau.style.height="calc(100vh - 10px)";
        }

        for(let row=0;row<grille.length;++row){

            grille[row] = new Array(10);

            for(let column = 0; column<grille[row].length;++column){

                grille[row][column] = document.createElement("img");
                grille[row][column].className = "pion";
                grille[row][column].src = " ";
                grille[row][column].addEventListener("click",event=>{
                    console.log(row+" / "+column);
                });
                plateau.appendChild(grille[row][column]);
            }
        }
        return grille;
    }
}

let partie = new gamePlayView('test','test');