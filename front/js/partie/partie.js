//const modulePion = require("../../../back/models/classPion");

socket.emit('partie', '');

console.log('testtest');
socket.on('coucou', msg => {
    console.log('test2');
    console.log(msg);
});

socket.on('grilleSetter', (partie1) => {
    /*console.log("grille");
    socket.on('test',()=>{
        console.log("test"); 
    });*/
    console.log(partie1);
});


socket.on('view', (game1) => {
    socket.on('getallpiece', (pion, modulePion) => {
        let partie1 = new Gameplayview(game1, 'game_1View', pion, modulePion);
        
        //partie1.grilleReload();
    });

    //console.log(modulePion.getAllPiece());

    //window.onresize = partie_1.grilleResize();
});

//let partie1 = new gameplayview(game1,'game_1View'); 
