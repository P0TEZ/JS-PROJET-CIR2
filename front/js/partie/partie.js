socket.emit('partie', '');

socket.on('coucou', msg => {
    console.log('test2');
    console.log(msg);
});

socket.on('view', (game1, pion) => {

    let partie1 = new Gameplayview(game1, 'game_1View', pion);
    partie1.grilleReload();

    window.onresize = partie1.grilleResize();
});
