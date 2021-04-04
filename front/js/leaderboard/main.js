// ECRITURE DU TABLEAU DANS LA PAGE HTML

let chatForm = document.getElementById('chatForm');
let inputMessage = document.getElementById('input');

socket.emit('login');

socket.on('resultats-leaderboard', msg => {
    Module_Stock.setData(msg);
    let elmt = document.getElementById("element")
    elmt.appendChild(create_tab_data.draw(msg));
});


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

socket.on('show-room', (verif, value) => {
    if (verif == false) {
        let item = document.createElement('p');
        msg = 'Recherche de joueurs en cours ... : ' + value + '/2';
        item.textContent = msg;
        messages.appendChild(item);
        verif = true;
    }
});

socket.on('compte', () => {
    let val = document.getElementById('user')
    val.addEventListener("click", () => {
        window.location.href = "/compte";

    });
});

socket.on('start-game', () => {
    window.location.href = "/partie";
});

socket.on('gamefull', (socket) => {
    //socket.disconnect();
    console.log("gamefull");
});

socket.on('room-player', (verif, queue) => {
    if (queue.length >= 2 && verif == false) {
        let item2 = document.createElement('p');
        msg2 = 'Une partie a été trouvé entre : ' + queue[0] + ' et ' + queue[1] + ' ! ';
        item2.textContent = msg2;
        messages.appendChild(item2);

        let item3 = document.createElement('p');
        msgStart = "Début de la partie dans : ";
        item3.textContent = msgStart;
        messages.appendChild(item3);

        var cpt = 2;

        item3.id = "Crono";
        val = 2;
        item3.textContent += val;



        timer = setInterval(function () {
            if (queue.length == 2 && val != true) {

                if (cpt > 0) // si on a pas encore atteint la fin
                {
                    --cpt; // décrémente le compteur

                    var Crono = document.getElementById("Crono"); // récupère l'id
                    var old_contenu = Crono.firstChild; // stock l'ancien contenu
                    Crono.removeChild(old_contenu); // supprime le contenu
                    var texte = document.createTextNode("Début de la partie dans : " + cpt); // crée le texte
                    //socket.emit('chrono',cpt);
                    if (cpt == 0) {
                        window.location.href = "/partie";
                    }
                    Crono.appendChild(texte); // l'affiche
                }
                else // sinon brise la boucle
                {
                    clearInterval(timer);

                }
            }
        }, 1000);
        socket.on('decoDansQueue', val => {
            if (val == true) {
                let item3 = document.createElement('p');
                msgStart = "Un joueur s'est déconnecté :/";
                item3.textContent = msgStart;
                messages.appendChild(item3);
                clearInterval(timer);

                let deco = document.createElement('button');
                var t = document.createTextNode("Chercher une autre partie");
                deco.setAttribute('class',"bg-primary")
                deco.id = "search2";
                deco.appendChild(t);
                messages.appendChild(deco);
                let test = document.getElementById('search2');

                test.addEventListener("click", () => {
                    window.location.reload();
                });
            }
        });

        let deco = document.createElement('button');
        var t = document.createTextNode("Annuler");
        deco.setAttribute('class',"bg-primary")
        deco.id = "decoo-file";
        deco.appendChild(t);
        messages.appendChild(deco);
        let test = document.getElementById('decoo-file');

        test.addEventListener("click", () => {
            socket.emit('decooo', "io client disconnect");
            window.location.href = "/";
        });

        verif = true;
    }
});

document.onkeypress = function (e) {
    if (e.keyCode && e.keyCode == 116) return false;
}