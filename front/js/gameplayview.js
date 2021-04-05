//chemin pour acceder aux images;
const imgLink = "../img/";

class Gameplayview {
    constructor(game, name, pion,color) {
        this.game = game;
        this.name = name;
        //couleur du joueur a qui est lié l'affichage
        this.color=color;
        this.grille = this.grilleStetter(pion);


        this.playerPionListSetter(pion);
        this.grilleResize();
        
    }

    //crée le tableau qui contient toutes les cases du plateau et les ajoute au html
    grilleStetter() {
         
        this.grilleResize();

        let grille = new Array(10);

        for(let row=0;row<grille.length;++row){

            grille[row] = new Array(10);

            for(let column = 0; column<grille[row].length;++column){
                grille[row][column] = document.createElement("img");
                grille[row][column].className = "pion";
                //de base les cases ont une src vide c'est a dire qu'elles sont invisibles et sans pion
                grille[row][column].src = " ";
                grille[row][column].addEventListener("click",event=>{
                    this.playerPionListReload();
                });
                
                plateau.appendChild(grille[row][column]);
            }
        }
        return grille;
    }

    //fonction qui met a joueur l'affichage du plateau
    grilleReload(){

        //on demande au serveur d'envoyer la nouvelle grille
        socket.on('returnGrid',(game) =>{
            this.game.grid = game; 
        });

        //on demande au serveur si la game a commencée
        socket.on('Started',(started)=>{
            this.game.started = started;
        });

        //on demande au cerveur quel joueur joue
        socket.on('getCurrentPlayer',(player)=>{
            this.game.currentPlayer = player;
        });

        for(let row=0;row<this.grille.length;++row){
            for(let column = 0; column<this.grille[row].length;++column){
                if(this.game.grid[row][column]){
                    this.grille[row][column].setAttribute('team',this.game.grid[row][column].equipe);
                    this.grille[row][column].setAttribute('select',this.game.grid[row][column].select);

                    //si la case n'est pas une case vide ou une rivière alors on lui attribut une image
                    if(this.game.grid[row][column].name !='empty' && this.game.grid[row][column].name !='River'){
                        // si le pion est celui du joueur zctuel on met son image
                       if (this.color == this.game.grid[row][column].equipe){
                           this.grille[row][column].src = imgLink + this.game.grid[row][column].name + ".png";
                       }else { //sinon on met une image de point d'interrogation
                           if (this.game.started == true) {//si la game a commencée on peut savoir ou l autre joueur des pions
                               this.grille[row][column].src = imgLink + "unknow.png";
                           }else {//sinon on ne sait pas ou il place ses pions
                               this.grille[row][column].src = " ";
                           }
                       }
                    }else{//si l'image est vide ou est une rivière
                        this.grille[row][column].src = " ";
                    }

                    //On n'affiche pas les déplacement possible de l'autre joueur
                    if(this.game.grid[row][column].name =='empty' && this.color != this.game.grid[row][column].equipe){
                        this.grille[row][column].setAttribute('select','false');
                    }

                    //affiche un message pour dire quel joueur doit jouer et change le fond avec sa couleur
                    if(this.game.started){
                        let div = document.getElementById("currentPlayer");
                        if(this.game.currentPlayer == 'blue'){
                            div.innerHTML= "C'est au joueur bleu";
                            div.className = "bg-Blue"; 
                            document.body.className= "bg-Blue";                      
                        }else{
                            div.innerHTML="C'est au joueur rouge";
                            div.className = "bg-Red";
                            document.body.className= "bg-Red";
                        }
                    }
                }
            }
        }

        //on met a jour egalement la liste qui indique aux joueurs leurs pions
        this.playerPionListReload();
        console.log("gille a bien été reload");
    }

    //crée la liste qui indique aux joueurs leurs pions
    playerPionListSetter(){
        let bluePionList = document.getElementById('bluePionList');
        let redPionList = document.getElementById('redPionList');

        for (const pion of modulePion.getAllPiece()) {
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

    //met a jour egalement la liste qui indique aux joueurs leurs pions
    playerPionListReload(){

        //demande au serveur la liste du joueur blue
        socket.on('returnListBlue',(list) =>{
            this.game.bluePlayerPionList = list;
        });

        //demande au serveur la liste du joueur rouge
        socket.on('returnListRed', (list)=>{
            this.game.redPlayerPionList = list;
        });

        let bluePionList = document.getElementById('bluePionList');
        let redPionList = document.getElementById('redPionList');

        for ( const pion of modulePion.getAllPiece()) {
            let div = bluePionList.getElementsByClassName(pion.name);
            let number = this.game.bluePlayerPionList.filter(aPion=>aPion === pion.name).length;

            div[0].innerHTML = number+"/"+pion.number;
        }
        for ( const pion of modulePion.getAllPiece()) {
            let div = redPionList.getElementsByClassName(pion.name);
            let number = this.game.redPlayerPionList.filter(aPion=>aPion === pion.name).length;

            div[0].innerHTML = number+"/"+pion.number;
        }

    }

    //fonction qui donne au plateau sa taille pour etre responsive et ajuste l'affichage des listes de pions
    grilleResize(){

        //les 22 px = taille d'une scroll bar
        //les 10 px = 2* la taille de la bordure du plateau
        // 100 vmin = 100% du plus petit coté de l'ecran

        let body = document.body;
        let plateau = document.getElementById("plateau");

        body.style.flexDirection="column";
        document.getElementById("bluePionList").className = "inRow";
        document.getElementById("redPionList").className = "inRow";


        if(window.innerWidth<window.innerHeight){
            if(!(window.innerHeight < body.clientHeight)){
                plateau.style.width="calc(100vmin - 10px)";
                plateau.style.height="calc(100vmin - 10px)";
            }else{
                plateau.style.width="calc(100vmin - 22px)";
                plateau.style.height="calc(100vmin - 22px)";
            }
        }else{
            if((window.innerWidth < body.clientWidth)){
                plateau.style.width="calc(100vmin - 10px)";
                plateau.style.height="calc(100vmin - 10px)";
            }else{
                plateau.style.width="calc(100vmin - 22px)";
                plateau.style.height="calc(100vmin - 10px)";
            }
        }if(window.innerWidth>(window.innerHeight+window.innerWidth*8/50)){
            body.style.flexDirection="row";
            document.getElementById("bluePionList").className = "inColumn";
            document.getElementById("redPionList").className = "inColumn";
        }

        //centre l'affichage au milieu de la page avec le 'scroll' qu il faut
        window.scrollTo(0,(body.clientHeight-window.innerHeight)/2);
    }
    
}