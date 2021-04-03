const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false });


const verifInscription = require('./back/modules/verifInscription');
const states = require('./back/modules/states');
//const Theoden = require('./back/models/theoden.js');
const room = require('./back/models/class_room.js');
const module_class_room = require('./back/modules/module_room');
const Theoden = require('./back/models/Theoden');
const Observable = require('./back/models/Observable');
const gameplay = require('./back/models/classGameplay');

const Pion = require('./back/models/pion');
//const Gameplayview = require('./front/js/gameplayview'); 


const sharedsession = require("express-socket.io-session");
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const { count } = require('console');
const { setMaxListeners } = require('process');

let queue = [];
let isGameFull = false;
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

  // Test des modules 
  states.printServerStatus();
  states.printProfStatus();
  let test = new Theoden();

  //Redirection sur la page de login
  res.sendFile(__dirname + '/front/html/login.html');
});

///////////////////////////////////////////////////
// VERIFIE SI IL EST BIEN DANS LA BDD /////////////
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

    let sql = "SELECT id FROM inscrit WHERE mdp= ? ";

    connection.query(sql, mdp, function (err, result) {
      if (err) throw err;

      //Vérification de la page login
      states.verifMdp(connection, req, res, result, login, mdp);
    });
  }
});

app.get('/leaderboard', (req, res) => {

  let sessionData = req.session;
  // Test des modules 

  let tab = new Array(1);
  if (sessionData) {
    if (module_class_room.isInRoom(queue, sessionData) != 1) {
      module_class_room.deleteQueue(queue);
      module_class_room.pushToQueue(couleur, queue, req, res);
      module_class_room.print(queue);
    }
  }
  let roomGame = new room(queue[0], queue[1]);


  //A faire : Si quitte page leaderboard + redirigé les joeurs de la room sur la page partie


  //let test = new room();
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
  const login = req.body.login
  const mdp = req.body.mdp
  const mdp2 = req.body.mdp2

  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
  } else {
    verifInscription.verifLoginMdp(connection, req, res, login, mdp, mdp2);
  }
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
    io.emit('show-user-username', socket.handshake.session.username); //Affichage de l'username sur la page compte
    io.emit('show-user-mdp', socket.handshake.session.mdp); //Affichage du mot de passe sur la page compte

    let sql = "SELECT * FROM resultats ORDER BY `resultats`.`score` DESC LIMIT 10";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      socket.emit('resultats-leaderboard', result);
    });


    let verif = false;
    io.emit('show-room', verif, queue.length);
    io.emit('room-player', verif, queue);
    //io.emit('decoo-file', socket.handshake.session.username);
    console.log(queue);

    io.emit('compte');

  });

  socket.on('message', (msg) => {
    //Affichage en console
    console.log('message: ' + msg);
    //Envoie le message pour tous, Affichage du chat sur la page leaderboard
    io.emit('new-message2', socket.handshake.session.username + ' : ' + msg);
  });

  if (isGameFull == true) {
    io.emit('gamefull', socket);
  }
  ////////////////////////////////////////
  //////////  JEU ////////////////////////
  ////////////////////////////////////////

  socket.on("partie", () => {



    socket.emit('view', game1, pion, socket.handshake.session.couleur);


    if (socket.handshake.session.couleur == "red") {
      socket.emit('red');
    }
    if (socket.handshake.session.couleur == "blue") {
      socket.emit('blue');
    }

    let srvSockets = io.sockets.sockets;
    srvSockets.forEach(user => {

      if (user.handshake.session.username == socket.handshake.session.username) {
        socket.on('play', (row, column, couleur_session) => {
          game1.play(row, column, couleur_session);
          io.emit('returnGrid', game1.grid);
          io.emit('reload');

        });
      }
    });


    socket.on('victory', () => {
      if (game1.end()) {
        console.log("Fin du jeu");
        let score = 0;
        if (game1.end() == 1) {
          score = 50;
        } else if (game1.end() == 2) {
          score = 30;
        } else if (game1.end() == 3) {
          score = 25;
        }
        let couleurWin = game1.getWinner();

        let srvSockets = io.sockets.sockets;
        srvSockets.forEach(user => {

          if (user.handshake.session.couleur == couleurWin) { // Si la couleur de la session est la meme que la couleur du vainqueur
            console.log("Le gagnant est :", user.handshake.session.username);

            //  On recup  le nbr de win puis on l'update avec +1, le score +50 idem

            let sql_nbrWin = " SELECT nb_win FROM resultats WHERE username= ?";
            socket.emit('affichage_win',user.handshake.session.username);
            let data_nbWin = [user.handshake.session.username];

            connection.query(sql_nbrWin, data_nbWin, function (err, result) {
              if (err) throw err;

              let string = JSON.stringify(result);
              let json1 = JSON.parse(string);

              json1[0].nb_win += 1;

              let sql_update_nbWin = " UPDATE resultats SET nb_win=? WHERE username=?";

              let data_update_nbWin = [json1[0].nb_win, user.handshake.session.username];

              connection.query(sql_update_nbWin, data_update_nbWin, function (err, result) {
                if (err) throw err;
              });


            });

            let sql_nbrScore = " SELECT score FROM resultats WHERE username= ?";

            let data_score = [user.handshake.session.username];

            connection.query(sql_nbrScore, data_score, function (err, result) {
              if (err) throw err;
              let string = JSON.stringify(result);
              let json1 = JSON.parse(string);

              json1[0].score += score;

              let sql_update_score = " UPDATE resultats SET score=? WHERE username=?";

              let data_update_score = [json1[0].score, user.handshake.session.username];

              connection.query(sql_update_score, data_update_score, function (err, result) {
                if (err) throw err;
              });


            });

          } else {  //Si la couleur est differente du vainqueur

            // On recup le nbr de loose puis on le rajoute plus 1, on change pas le score
            /*
            let sql_nbrLoose = " SELECT nb_loose FROM resultats WHERE username= ?";

            let data_nbLoose = [user.handshake.session.username];

            connection.query(sql_nbrLoose, data_nbLoose, function (err, result) {
              if (err) throw err;
              let string = JSON.stringify(result);
              let json1 = JSON.parse(string);

              json1[0].nb_loose += 1;
              let sql_update_nbLoose = " UPDATE resultats SET nb_loose=? WHERE username=?";

              let data_update_nbLoose = [json1[0].nb_Loose, user.handshake.session.username];

              connection.query(sql_update_nbLoose, data_update_nbLoose, function (err, result) {
                if (err) throw err;
              });


            });

            */
          }
        });
      }
    });
  });
  socket.on('deco', () => {
    console.log('Un utilisateur s\'est déconnecté');
    io.emit('decoo', socket.handshake.session.username, socket.handshake.session.mdp, queue);
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