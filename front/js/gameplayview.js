//const modulePion = require("../../back/models/classPion");

class Gameplayview {
    constructor(game, name, pion, modulePion) {
        this.game = game;
        this.name = name;
        this.grille = this.grilleStetter();

        this.playerPionListSetter(pion, modulePion);
        this.grilleResize();
        this.eventSetter();
    }

    grilleStetter() {
        // console.log("testgrilesetter");
        // return("laçamarche");
         
        this.grilleResize();

        let grille = new Array(10);

        for(let row=0;row<grille.length;++row){

            grille[row] = new Array(10);

            for(let column = 0; column<grille[row].length;++column){
                grille[row][column] = document.createElement("img");
                grille[row][column].className = "pion";
                grille[row][column].src = " ";
                grille[row][column].addEventListener("click",event=>{
                    console.log(row+" / "+column);
                    this.game.play(row,column);
                    this.grilleReload();
                    this.playerPionListReload();
                });
                
                grille[row][column].addEventListener("mouseover",event=>{
                    if(this.game.grid[row][column].equipe == "none")
                    grille[row][column].style.opacity = "100%";
                });
                 grille[row][column].addEventListener("mouseout",event=>{
                    if(this.game.grid[row][column].equipe == "none")
                    grille[row][column].style.opacity = "0%";
                });
                
                plateau.appendChild(grille[row][column]);
            }
        }
        return grille;
    }

    grilleReload(){
        for(let row=0;row<this.grille.length;++row){
            for(let column = 0; column<this.grille[row].length;++column){
                if(this.game.grid[row][column]){
                    this.grille[row][column].setAttribute('team',this.game.grid[row][column].equipe);
                    this.grille[row][column].setAttribute('select',this.game.grid[row][column].select);
                    if(this.game.grid[row][column].name !='empty' && this.game.grid[row][column].name !='River'){
                        this.grille[row][column].src = imgLink + this.game.grid[row][column].name + ".png";
                    }else{
                        this.grille[row][column].src = " ";
                    }
                }
            }
        }
    }

    playerPionListSetter(pion, modulePion){
        let bluePionList = document.getElementById('bluePionList');
        let redPionList = document.getElementById('redPionList');

        for (pion of modulePion.getAllPiece()) {
            let conteneur = document.createElement("div");
            conteneur.className = pion.name;
            conteneur.innerHTML = 0+"/"+pion.number;
            conteneur.style.backgroundImage ="url("+imgLink + pion.img+")";
            bluePionList.append(conteneur);

            conteneur = document.createElement("div");
            conteneur.className = pion.name;
            conteneur.innerHTML = 0+"/"+pion.number;
            conteneur.style.backgroundImage ="url("+imgLink + pion.img+")";
            redPionList.append(conteneur);

        }
    }

    playerPionListReload(){
        let bluePionList = document.getElementById('bluePionList');
        let redPionList = document.getElementById('redPionList');

        for (const pion of modulePion.getAllPiece()) {
            let div = bluePionList.getElementsByClassName(pion.name);
            let number = this.game.bluePlayerPionList.filter(aPion=>aPion === pion.name).length;

            div[0].innerHTML = number+"/"+pion.number;
        }
        for (const pion of modulePion.getAllPiece()) {
            let div = redPionList.getElementsByClassName(pion.name);
            let number = this.game.redPlayerPionList.filter(aPion=>aPion === pion.name).length;

            div[0].innerHTML = number+"/"+pion.number;
        }

    }

    grilleResize(){
        let body = document.body;
        let plateau = document.getElementById("plateau");

        body.style.flexDirection="column";
        document.getElementById("bluePionList").className = "inRow";
        document.getElementById("redPionList").className = "inRow";


        if(window.innerWidth<window.innerHeight){
            if(!(window.innerHeight < body.clientHeight)){
                plateau.style.width="calc(100vw - 10px)";
                plateau.style.height="calc(100vw - 10px)";
            }else{
                plateau.style.width="calc(100vw - 22px)";
                plateau.style.height="calc(100vw - 22px)";
            }
        }else{
            if((window.innerWidth < body.clientWidth)){
                plateau.style.width="calc(100vh - 10px)";
                plateau.style.height="calc(100vh - 10px)";
            }else{
                plateau.style.width="calc(100vh - 22px)";
                plateau.style.height="calc(100vh - 10px)";
            }
        }if(window.innerWidth>(window.innerHeight+window.innerWidth*8/50)){
            body.style.flexDirection="row";
            document.getElementById("bluePionList").className = "inColumn";
            document.getElementById("redPionList").className = "inColumn";
        }

        window.scrollTo(0,(body.clientHeight-window.innerHeight)/2);
    }
    
}

//module.exports = Gameplayview;
