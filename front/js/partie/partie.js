socket.emit('partie', '');

//executer le socket.on pour le view
socket.on('view', (game1, pion, color) => {

    //execute le socket pour l'equipe rouge et fait donc execute la vue que pour l'equipe rouge
    socket.on('red', () => {
        //Creation d'une partie
        let partie1 = new Gameplayview(game1, 'game_1View', pion, 'red');

        //grille rafraichie
        partie1.grilleReload();

        for (let row = 0; row < partie1.grille.length; ++row) {
            for (let column = 0; column < partie1.grille[row].length; ++column) {
                partie1.grille[row][column].addEventListener("click", event => {

                    //envoyer au serveur la fonction play
                    socket.emit('play', row, column, color);
                    partie1.grilleReload();
                });
            }
        }

        //Creation d'un bouton pour que le joueur autoFill s'il veut
        if(!game1.started){
            let btn = document.createElement(("BUTTON"));
            btn.innerHTML= "Remplissage automatique";
            btn.className ="bg-primary";
            btn.addEventListener('click', ()=>{
                event.preventDefault();

                //envoyer au serveur la fonction autoFill
                socket.emit('autoFill', color);
                //on enleve le bouton
                btn.remove();


            });
            document.body.append(btn);
        }
        window.onresize = partie1.grilleResize();

        //Execute la fonction qui rafraichie la grille
        socket.on('reload', () => {
            partie1.grilleReload();

            //si la partie est commence et que le bouton existe encore, on le supprime
            if(game1.started && typeof(btn) != 'undefined'){
                btn.remove();
            }
        });

    });

    //execute le socket pour l'equipe bleue et fait donc execute la vue que pour l'equipe bleue
    socket.on('blue', () => {

        //Creation de la partie
        let partie2 = new Gameplayview(game1, 'game_2View', pion, 'blue');

        //grille rafraichie
        partie2.grilleReload();

        for (let row = 0; row < partie2.grille.length; ++row) {
            for (let column = 0; column < partie2.grille[row].length; ++column) {
                partie2.grille[row][column].addEventListener("click", event => {

                    //envoyer au serveur la fonction play
                    socket.emit('play', row, column, color);
                    partie2.grilleReload();

                });
            }
        }

        //Creation d'un bouton pour que le joueur autoFill s'il veut
        if(!game1.started){
            let btn = document.createElement(("BUTTON"));
            btn.innerHTML= "Remplissage automatique";
            btn.className ="bg-primary";
            btn.addEventListener('click', ()=>{
                event.preventDefault();

                //envoyer au serveur la fonction autoFill
                socket.emit('autoFill',color)

                //on enleve le bouton
                btn.remove();

            });
            document.body.append(btn);
        }
        window.onresize = partie2.grilleResize();

        //Execute la fonction qui rafraichie la grille
        socket.on('reload', () => {
            partie2.grilleReload();

            //si la partie est commence et que le bouton existe encore, on le supprime
            if(game1.started && typeof(btn) != 'undefined'){
                btn.remove();
            }
        });
    });
});

//Permet de bloquer le rafraichissement (Temporaire ?)
document.onkeypress = function (e) {
    if (e.keyCode && e.keyCode == 116) return false;
}


//permet d'afficher la victoire lors de la fin de partie
socket.on('affichage_win', (nameWinner) => {
    let dialog = document.getElementById('dialog');
    dialog.setAttribute('aria-hidden', false);

    let item = document.getElementById('pseudoWin');
    item.innerHTML = nameWinner;

    let test = document.getElementById('quitter');

    //permet de deconnecter la session et rediriger sur l'acceuil
    test.addEventListener('click', (event) => {
        socket.emit('decooo',"io client disconnect");
        window.location.href = "/";
    });
});

//permet d'afficher l'égalité lors de la fin de partie
socket.on('affichage_draw', () => {
    let dialog = document.getElementById('dialog4');
    dialog.setAttribute('aria-hidden', false);

    let test = document.getElementById('quitter2');

    //permet de deconnecter la session et rediriger sur l'acceuil
    test.addEventListener('click', (event) => {
        socket.emit('decooo',"io client disconnect");
        window.location.href = "/";
    });
});



