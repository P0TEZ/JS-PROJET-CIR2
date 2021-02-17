let imgLink ="../img/";

class gamePlayView {
    
    constructor(game, name){
        this.game = game;
        this.name = name;
        this.grille = this.grilleStetter();
    
    /*    this.eventSetter();*/
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
                    this.game.play(row,column);
                });
                plateau.appendChild(grille[row][column]);
            }
        }
        return grille;
    }

    grilleReload(){
        for(let row=0;row<grille.length;++row){
            for(let column = 0; column<grille[row].length;++column){
                grille[row][column].setAttribute('team',game.grid[row][column].equipe);
                grille[row][column].setAttribute('select',game.grid[row][column].select);
                if(game.grid[row][column].name !='emply'){
                    grille[row][column].src = imgLink + game.grid[row][column].name + ".png";
                }else{
                    grille[row][column].src = " ";
                }
            }
        }
    }

    grilleResize(){
        let plateau = document.getElementById("plateau");            
        
        if(window.innerWidth<window.innerHeight){
            plateau.style.width="calc(100vw - 10px)";
            plateau.style.height="calc(100vw - 10px)";
        }else{
            plateau.style.width="calc(100vh - 10px)";
            plateau.style.height="calc(100vh - 10px)";
        }
    }
}
let game_1 = new Stratego();
let partie_1 = new gamePlayView(game_1,'game_1View');

partie_1.grilleStetter();
partie_1.grilleReload();


window.onresize = partie_1.grilleResize;