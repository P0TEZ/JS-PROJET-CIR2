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
    console.log("je passe par la "); 
    let item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
});