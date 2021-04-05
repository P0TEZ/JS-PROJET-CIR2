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

//Affichage de la recherche en cours
socket.on('show-room', (verif, value) => {
    if (verif == false) {
        let item = document.createElement('p');
        msg = 'Recherche de joueurs en cours ... : ' + value + '/2';
        item.textContent = msg;
        messages.appendChild(item);
        verif = true;
    }
});

//Event sur le boutton de la page compte
socket.on('compte', () => {
    let val = document.getElementById('user')
    val.addEventListener("click", () => {
        socket.emit('decooo', "io client disconnect");
        window.location.href = "/compte";
    });
});

//Si il y a 2 joueurs
socket.on('room-player', (verif, queue) => {
    if (queue.length >= 2 && verif == false) {
        let item2 = document.createElement('p');
        msg2 = 'Une partie a été trouvé entre : ' + queue[0] + ' et ' + queue[1] + ' ! ';
        item2.textContent = msg2;
        messages.appendChild(item2);
        //Lancement du chrono
        let item3 = document.createElement('p');
        msgStart = "Début de la partie dans : ";
        item3.textContent = msgStart;
        messages.appendChild(item3);

        var cpt = 5;

        item3.id = "Crono";
        val = 5;
        item3.textContent += val;

        timer = setInterval(function () {
            if (queue.length == 2 && val != true) {
                //Si on a pas encore atteint la fin
                if (cpt > 0) 
                {
                    //Décrémente le compteur
                    --cpt; 

                    //Récupère l'id
                    var Crono = document.getElementById("Crono"); 
                    //Stock l'ancien contenu
                    var old_contenu = Crono.firstChild; 
                    //Supprime le contenu
                    Crono.removeChild(old_contenu); 
                    //Crée le texte
                    var texte = document.createTextNode("Début de la partie dans : " + cpt); 
                    if (cpt == 0) {
                        window.location.href = "/partie";
                    }
                    Crono.appendChild(texte);
                }
                else
                {
                    clearInterval(timer);

                }
            }
        }, 1000);
        //Gestion du cas si un joueurs dans la queue se deconnecte
        socket.on('decoDansQueue', (val) => {
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

                //On recharge la page pour uptade la queue
                test.addEventListener("click", () => {
                    window.location.reload();
                });
            }
        });
        //Gestion du boutton annuler de la queue
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

//Empeche l'utilisateur de rafraichir quand il veut
document.onkeypress = function (e) {
    if (e.keyCode && e.keyCode == 116) return false;
}