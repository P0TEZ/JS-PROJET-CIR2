socket.emit('partie', '');
socket.on('user', user =>{
    console.log("socket"+user);
});

socket.on('view', (game1, pion,color) => {
   
    socket.on('red', () => {
        let partie1 = new Gameplayview(game1, 'game_1View', pion, 'red');
        partie1.grilleReload();
        console.log("Appelpartie1");

        for (let row = 0; row < partie1.grille.length; ++row) {
            for (let column = 0; column < partie1.grille[row].length; ++column) {
                partie1.grille[row][column].addEventListener("click", event => {

                    //this.game.play(row,column);
                    socket.emit('play', row, column,color);

                    // console.log("100 messages"); 
                    partie1.grilleReload();
                    console.log(partie1.grille);
                    //console.log(partie1.game.grid[row][column]); 
                });
            }
        }
        window.onresize = partie1.grilleResize();

        socket.on('reload', () => {
            partie1.grilleReload();
            console.log("fin reload");
        });

    });
    let partie2 = new Gameplayview(game1, 'game_2View', pion, 'blue');
    socket.on('blue', () => {
       
        partie2.grilleReload();
        console.log("Appelpartie2");

        for (let row = 0; row < partie2.grille.length; ++row) {
            for (let column = 0; column < partie2.grille[row].length; ++column) {
                partie2.grille[row][column].addEventListener("click", event => {

                    //this.game.play(row,column);
                    socket.emit('play', row, column);

                    // console.log("100 messages"); 
                    partie2.grilleReload();
                    console.log(partie2.grille);
                    //console.log(partie1.game.grid[row][column]); 
                });
                partie2.grille[row][column].addEventListener("click", event => {

                    //this.game.play(row,column);
                    socket.emit('play', row, column);

                    // console.log("100 messages"); 
                    //partie1.grilleReload();
                    console.log(partie2.grille);
                    //console.log(partie1.game.grid[row][column]); 
                });
            }
        }
        window.onresize = partie2.grilleResize();

        socket.on('reload', () => {
            partie2.grilleReload();
            console.log("fin reload");
        });
    });


});



/*
    socket.on('play',(row,column)=>{
        game1.play(row,column); 
        partie1.grilleReload();
        console.log(partie1.grille);
        console.log("ca marche"); 
    });*/




    //socket.emit('victory');









