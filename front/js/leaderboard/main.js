// ECRITURE DU TABLEAU DANS LA PAGE HTML

let elmt = document.getElementById("element")
elmt.appendChild(create_tab_data.draw()); 

let chatForm = document.getElementById('chatForm');
let inputMessage = document.getElementById('input');

socket.emit('login', '');

//Gestion d'envoi de message (Chat) sur la page leaderboard
chatForm.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value) {
        socket.emit('message', inputMessage.value);
        inputMessage.value = '';
    }
});

//Affichage si un utilisateur se connecte sur la page leaderboard
socket.on('new-message', msg => {
    let item = document.createElement('li');
    item.textContent = msg;
    connect.appendChild(item);
});

//Affichage du chat sur la page leaderboard
socket.on('new-message2', msg => { 
    let item = document.createElement('li');
    item.textContent = msg;
    chat.appendChild(item);
});

//Affichage de la recherche de joueurs sur la page leaderboard
socket.on('search', value => {
    let item = document.createElement('p');
    msg = 'Recherche de joueurs en cours ... : ' + value + '/2';
    item.textContent = msg;
    messages.appendChild(item);
    if(value == 2) {
        let start = document.createElement('button');
        var t = document.createTextNode("START GAME");
        start.appendChild(t);
        messages.appendChild(start);
    }
});