let imgLink ="../img/";

class gamePlayView {
    
    constructor(game, name){
        this.game = game;
        this.name = name;
        this.grille = this.grilleStetter();

        this.playerPionListSetter();
        this.grilleResize();
    /*    this.eventSetter();*/
    }

    grilleStetter(){           
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

    playerPionListSetter(){
        let bluePionList = document.getElementById('bluePionList');
        let redPionList = document.getElementById('redPionList');

        for (const pion of modulePion.getAllPiece()) {
            let pionImg = document.createElement("img");
            pionImg.className = "pion";
            pionImg.src = imgLink + pion.img;
            bluePionList.append(pionImg);

            pionImg = document.createElement("img");
            pionImg.className = "pion";
            pionImg.src = imgLink + pion.img;
            redPionList.append(pionImg);
        }
    }

    playerPionListReload(){
        let bluePionList = document.getElementById('bluePionList');
        bluePionList.innerHTML = "";
        let redPionList = document.getElementById('redPionList');
        redPionList.innerHTML = "";

        // for (const pion of this.game.bluePlayerPionList.sort()) {
        //     /*let pionImg = document.createElement("img");
        //     pionImg.className = "pion";
        //     pionImg.src = imgLink + pion + ".png";

        //     bluePionList.append(pionImg);*/
        //     let elmt = document.createElement("li");
        //     elmt.innerHTML = pion;
        //     bluePionList.append(elmt);
        // }
        // for (const pion of this.game.redPlayerPionList.sort()) {
        //     let elmt = document.createElement("li");
        //     elmt.innerHTML = pion;
        //     redPionList.append(elmt);
        // }

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


let game_1 = new Stratego();
let partie_1 = new gamePlayView(game_1,'game_1View');
partie_1.grilleReload();

console.log(modulePion.getAllPiece());

window.onresize = partie_1.grilleResize;