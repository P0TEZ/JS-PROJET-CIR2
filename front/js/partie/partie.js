socket.emit('partie', '');

socket.on('view', (game1, pion) => {

    let partie1 = new Gameplayview(game1, 'game_1View', pion);
    partie1.grilleReload();
    
/*
    socket.on('play',(row,column)=>{
        game1.play(row,column); 
        partie1.grilleReload();
        console.log(partie1.grille);
        console.log("ca marche"); 
    });*/

    for(let row=0;row<partie1.grille.length;++row){
        for(let column = 0; column<partie1.grille[row].length;++column){
            partie1.grille[row][column].addEventListener("click",event=>{
                
                //this.game.play(row,column);
                socket.emit('play',row,column); 
                // console.log("100 messages"); 
                partie1.grilleReload();
                console.log(partie1.grille); 
                //console.log(partie1.game.grid[row][column]); 
            });
        } 
    }
    window.onresize = partie1.grilleResize();


    socket.on('reload',()=>{
        partie1.grilleReload(); 
        console.log("fin reload"); 
    });

    socket.emit('victory');


});






