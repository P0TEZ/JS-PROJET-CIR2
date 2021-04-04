socket.emit('login', '');

//Création d'un div pour afficher l'username
socket.on('show-user-username', msg => {
    let item = document.createElement('div');
    item.textContent = msg;
    compte_name.appendChild(item);
});

//Création d'un div pour afficher le mot de passe
socket.on('show-user-mdp', msg => {
    let item = document.createElement('div');
    item.textContent = msg;
    compte_mdp.appendChild(item);

});

socket.emit('deco', '');
//Fonction qui permet de supprimer la session de l'utilisateur

socket.on('decoo', (username, mdp, queue) => {
    let test = document.getElementById('deco');
    test.addEventListener("click", () => {
        if (username) {
            socket.emit('decooo',"io client disconnect");
            window.location.href = "/";
            
        }
    });
});