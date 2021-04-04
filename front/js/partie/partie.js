socket.emit('partie', '');

socket.on('view', (game1, pion, color) => {

    socket.on('red', () => {
        let partie1 = new Gameplayview(game1, 'game_1View', pion, 'red');
        partie1.grilleReload();

        for (let row = 0; row < partie1.grille.length; ++row) {
            for (let column = 0; column < partie1.grille[row].length; ++column) {
                partie1.grille[row][column].addEventListener("click", event => {

                    socket.emit('play', row, column, color);
                    partie1.grilleReload();
                });
            }
        }
        let btn = document.createElement(("BUTTON"));
        btn.innerHTML= "Remplissage automatique";
        btn.className ="bg-primary";
        btn.addEventListener('click', ()=>{
            event.preventDefault();
            socket.emit('autoFill', color);
            btn.remove();
            console.log("started"+game1.started);

        });
        document.body.append(btn);
        window.onresize = partie1.grilleResize();

        socket.on('reload', () => {
            partie1.grilleReload();
        });

    });

    socket.on('blue', () => {
        let partie2 = new Gameplayview(game1, 'game_2View', pion, 'blue');
        partie2.grilleReload();

        for (let row = 0; row < partie2.grille.length; ++row) {
            for (let column = 0; column < partie2.grille[row].length; ++column) {
                partie2.grille[row][column].addEventListener("click", event => {

                    socket.emit('play', row, column, color);
                    partie2.grilleReload();

                    

                });
            }
        }
        let btn = document.createElement(("BUTTON"));
        btn.innerHTML= "Remplissage automatique";
        btn.className ="bg-primary";
        btn.addEventListener('click', ()=>{
            event.preventDefault();
            socket.emit('autoFill',color)
            partie2.grilleReload();
            btn.remove();
            console.log("started"+game1.started);
        });
        document.body.append(btn);
        window.onresize = partie2.grilleResize();

        socket.on('reload', () => {
            partie2.grilleReload();
        });
    });
});

//Permet de bloquer le rafraichissement (Temporaire ?)
document.onkeypress = function (e) {
    if (e.keyCode && e.keyCode == 116) return false;
}



socket.on('affichage_win', (nameWinner) => {
    let dialog = document.getElementById('dialog');
    dialog.setAttribute('aria-hidden', false);

    let item = document.getElementById('pseudoWin');
    item.innerHTML = nameWinner;

    let test = document.getElementById('quitter');
    test.addEventListener('click', (event) => {
        socket.emit('decooo',"io client disconnect");
        window.location.href = "/";
    });
});

socket.on('affichage_draw', () => {
    let dialog = document.getElementById('dialog4');
    dialog.setAttribute('aria-hidden', false);

    /*
    let item = document.getElementById('draw');
    item.innerHTML = player1;
    let item2 = document.getElementById('draw');
    item2.innerHTML = player2;
    */

    let test = document.getElementById('quitter2');
    test.addEventListener('click', (event) => {
        socket.emit('decooo',"io client disconnect");
        window.location.href = "/";
    });
});



