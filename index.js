const express = require('express');
const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const sharedsession = require("express-socket.io-session");
const { body, validationResult } = require('express-validator');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const verifInscription = require('./back/modules/verifInscription');
const states = require('./back/modules/states');
const module_class_room = require('./back/modules/module_room');
const bcrypt = require('bcrypt');
const partieBack = require('./back/modules/partieBack');

const gameplay = require('./back/models/classGameplay');
const Pion = require('./back/models/classPion');

let queue = [];
let couleur = "";
let game1 = new gameplay();
let pion = new Pion();

const session = require("express-session")({
  // CIR2-chat encode in sha256
  secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    secure: false
  }
});

app.use(express.static(__dirname + '/front/'));
app.use(urlencodedparser);
app.use(session);

io.use(sharedsession(session, {
  // Session automatiquement sauvegardée en cas de modification
  autoSave: true
}));

app.get('/', (req, res) => {
  //Redirection sur la page de login
  res.sendFile(__dirname + '/front/html/login.html');
});

///////////////////////////////////////////////////
// VERIFIE S'IL EST BIEN DANS LA BDD //////////////
///////////////////////////////////////////////////

app.post('/login', urlencodedparser, (req, res) => {

  const login = req.body.login
  const mdp = req.body.mdp

  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
  } else {

    req.session.save();

    //Cryptage du mot de passe

    let sql_mdp = " SELECT mdp FROM inscrit WHERE username=?";

    connection.query(sql_mdp, login, function (err, result) {
      if (err) throw err;
      //Transformation de result en variable
      let string = JSON.stringify(result);
      let json1 = JSON.parse(string);

      //Utilisation de la librairie bcrypt
      bcrypt.compare(mdp, json1[0].mdp, function (err, result2) {
        if (result2 == true) {
          let sql = "SELECT id FROM inscrit WHERE mdp= ? ";

          connection.query(sql, json1[0].mdp, function (err, result3) {
            if (err) throw err;
            //Vérification de la page login
            states.verifMdp(connection, req, res, result3, login, json1[0].mdp);
          });
        }
      });
    });
  }
});

app.get('/leaderboard', (req, res) => {

  let sessionData = req.session;

  if (sessionData) {
    //Appel du module room qui va push l'utilisateur dans la queue
    if (module_class_room.isInRoom(queue, sessionData) != 1) {
      module_class_room.deleteQueue(queue);
      module_class_room.pushToQueue(couleur, queue, req, res);
      module_class_room.print(queue);
    }
  }

  if (sessionData.username) {
    res.sendFile(__dirname + '/front/html/leaderboard.html');
  } else {
    res.sendFile(__dirname + '/front/html/login.html');
  }

});

app.get('/compte', (req, res) => {

  let sessionData = req.session;

  if (sessionData.username) {
    res.sendFile(__dirname + '/front/html/compte.html');
  } else {
    res.sendFile(__dirname + '/front/html/login.html');
  }
});


//////////////////////////////////////////////
// AJOUT D'UNE PERSONNE DANS LA BDD///////////
//////////////////////////////////////////////

app.post('/inscription', urlencodedparser, (req, res) => {
  //Récupération des données
  const login = req.body.login;
  const mdp = req.body.mdp;
  const mdp2 = req.body.mdp2;


  bcrypt.hash(mdp, 10, function (err, res1) {
    if (err) throw err;

    // Error management
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
    } else {
      if (mdp == mdp2) {
        //Appelle de la fonction qui verifie ce que l'utilisateur rentre dans l'inscription
        verifInscription.verifLoginMdp(connection, req, res, login, res1, mdp2);
      } else {
        res.send("differents");
      }

    }
  });
});

app.get('/partie', (req, res) => {
  let sessionData = req.session;

  if (sessionData.username) {
    res.sendFile(__dirname + '/front/html/partie.html');
  } else {
    res.sendFile(__dirname + '/front/html/login.html');
  }


});

io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté');

  socket.on("login", () => {

    //Page Leaderboard
    socket.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');

    //Page Compte

    //Affichage de l'username sur la page compte
    socket.emit('show-user-username', socket.handshake.session.username);
    //Affichage du mot de passe sur la page compte
    socket.emit('show-user-mdp', socket.handshake.session.mdp);

    //Affichage du tableau des scores (Que les 5 premiers)
    let sql = "SELECT * FROM resultats ORDER BY `resultats`.`score` DESC LIMIT 5";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      socket.emit('resultats-leaderboard', result);
    });

    //Vérification si l'utilisateur est deja dans la queue
    let verif = false;
    socket.emit('show-room', verif, queue.length);
    io.emit('room-player', verif, queue);

    //Déconnection
    io.emit('decoo', socket.handshake.session.username, socket.handshake.session.mdp, queue);

    io.emit('isQueueOk', queue.length);
    io.emit('decoDansQueue', false);

    //Page compte
    io.emit('compte');

  });

  socket.on('message', (msg) => {
    //Affichage en console
    console.log('Message: ' + msg);
    //Envoie le message pour tous, Affichage du chat sur la page leaderboard
    io.emit('new-message2', socket.handshake.session.username + ' : ' + msg);
  });

  ////////////////////////////////////////
  //////////  JEU ////////////////////////
  ////////////////////////////////////////

  socket.on("partie", () => {
    //Socket de la view du jeu
    socket.emit('view', game1, pion, socket.handshake.session.couleur);

    //Association de la session avec une couleur
    if (socket.handshake.session.couleur == "red") {
      socket.emit('red');
    }
    if (socket.handshake.session.couleur == "blue") {
      socket.emit('blue');
    }

    //On regarde toutes les sessions 
    let srvSockets = io.sockets.sockets;
    srvSockets.forEach(user => {

      if (user.handshake.session.username == socket.handshake.session.username) {
        //Gestion de l'autofill de la map
        socket.on('autoFill', (couleur_session) => {
          game1.autoFill(couleur_session);
          io.emit('returnGrid', game1.grid);
          io.emit('Started', game1.started);
          //Reload de la map
          io.emit('reload');
        });

        //Socket pour jouer en fonction de la couleur
        socket.on('play', (row, column, couleur_session) => {
          //On regarde si la partie n'est pas finie
          if (game1.end() != (1 || 2) && game1.end() != (3 || 4)) {
            game1.play(row, column, couleur_session);
            io.emit('returnGrid', game1.grid);
            io.emit('returnListBlue', game1.bluePlayerPionList);
            io.emit('returnListRed', game1.redPlayerPionList);
            io.emit('Started', game1.started);
            io.emit('getCurrentPlayer',game1.currentPlayer);
            io.emit('reload');
          }
          //Si il y a une égalité
          if (game1.end() == 4) {
            io.emit('affichage_draw');
            //Gestion de l'égalité
            let score = 30;
            let data;
            partieBack.gestionDrawJoueur1(connection, data, user.handshake.session.username, score);

            //On fait la meme chose mais pour l'autre joueur
            let sql_nbrDraw2 = " SELECT score FROM resultats WHERE username= ?";
            let data2;
            let srvSockets = io.sockets.sockets;
            srvSockets.forEach(user => {
              //On selectionne l'autre joueur
              if (user.handshake.session.username != data) {
                data2 = [user.handshake.session.username];
              }

            });
            partieBack.gestionDrawJoueur2(connection, sql_nbrDraw2, data2, score);
          }
          //Si la partie est finie mais que ce n'est pas un draw
          let couleurWin = game1.getWinner();
          if (game1.end() == 1 || game1.end() == 2 || game1.end() == 3) {
            let score;
            //Le score change en fonction du cas de victoire
            if (game1.end() == 1 || game1.end() == 2) {
              score = 50;
            }
            if (game1.end() == 3) {
              score = 30;
            }
            //Récupération de la couleur du winner
            let srvSockets = io.sockets.sockets;
            srvSockets.forEach(user => {
              io.emit('affichage_win', user.handshake.session.username);
              if(user.handshake.session.couleur == couleurWin) {
                partieBack.gestionFlagJoueur1(user.handshake.session.couleur, user.handshake.session.username, connection, couleurWin, score);
              }
              else if (user.handshake.session.username != couleurWin) {
                partieBack.gestionFlagJoueur2(user.handshake.session.username, connection);
              }
              
            });

          }  //Si la couleur est differente du vainqueur
          
        });
      }
    });
  });

  //Gestion de la deconnection
  socket.on('decooo', (reason) => {
    if (reason == "io client disconnect") {
      console.log('Un utilisateur s\'est déconnecté');
      //Déconnection du socket
      socket.disconnect();
      //On supprime l'utilisateur de la queue
      for (let i = 0; i < queue.length; i++) {
        if (queue[i] == socket.handshake.session.username) {
          queue.splice(i, 1);
        }
      }
      //On informe l'utilisateur que une personne s'est déco
      io.emit('decoDansQueue', true);
    }
  });
});

http.listen(4255, () => {
  console.log('serveur lance sur le port 4256 http://localhost:4255/ ;');
});

//Connection à la base de donnée
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stratego'
});

connection.connect(err => {
  if (err) throw err;
  else {
    console.log("Connexion Réussite");
  }
});