socket.emit('login', '');

socket.on('user-message', msg => {
    console.log("je passe par la 23"); 
    let item = document.createElement('div');
    item.textContent = msg;
    compte_name.appendChild(item);
});

socket.on('mdp-message', msg => {
    console.log("je passe par la 2 compte2"); 
    let item = document.createElement('div');
    item.textContent = msg;
    compte_mdp.appendChild(item);

});