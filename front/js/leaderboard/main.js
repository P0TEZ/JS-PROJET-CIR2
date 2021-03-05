// ECRITURE DU TABLEAU DANS LA PAGE HTML

let elmt = document.getElementById("element")
elmt.appendChild(create_tab_data.draw()); 

let chatForm = document.getElementById('chatForm');
let inputMessage = document.getElementById('input');

socket.emit('login', '');

chatForm.addEventListener('submit', event => {
    event.preventDefault(); //remember
    if (input.value) {
        socket.emit('message', inputMessage.value);
        inputMessage.value = '';
    }
});

socket.on('new-message', msg => {
    //console.log("je passe par la "); 
    let item = document.createElement('li');
    item.textContent = msg;
    connect.appendChild(item);
});

socket.on('new-message2', msg => {
    //console.log("je passe par la "); 
    let item = document.createElement('li');
    item.textContent = msg;
    chat.appendChild(item);
});

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

socket.on('new-new-message', msg => {
    //console.log("je passe par la 2"); 
    let item = document.createElement('div');
    item.textContent = msg;
    user.appendChild(item);

});