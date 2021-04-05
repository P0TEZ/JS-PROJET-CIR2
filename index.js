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
const bcrypt = require('bcrypt');

const sharedsession = require("express-socket.io-session");
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const { count } = require('console');
const { setMaxListeners } = require('process');
const { isBuffer } = require('util');

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

    let sql_mdp = " SELECT mdp FROM inscrit WHERE username=?";

    connection.query(sql_mdp, login, function (err, result) {
      if (err) throw err;

      let string = JSON.stringify(result);
      let json1 = JSON.parse(string);


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
  const login = req.body.login;
  const mdp = req.body.mdp;
  const mdp2 = req.body.mdp2;


  let res1 = bcrypt.hash(mdp, 10, function (err, res1) {
    if (err) throw err;
    //socket.emit("resultCrypt", res);
    console.log("Mdp crypté :", res1);

    // Error management
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
    } else {
      if (mdp == mdp2) {
        verifInscription.verifLoginMdp(connection, req, res, login, res1, mdp2);
      } else {
        console.log("Les 2 mdps sont differents");
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
    socket.emit('show-user-username', socket.handshake.session.username); //Affichage de l'username sur la page compte
    socket.emit('show-user-mdp', socket.handshake.session.mdp); //Affichage du mot de passe sur la page compte


    let sql = "SELECT * FROM resultats ORDER BY `resultats`.`score` DESC LIMIT 5";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      socket.emit('resultats-leaderboard', result);
    });


    let verif = false;
    socket.emit('show-room', verif, queue.length);
    io.emit('room-player', verif, queue);
    io.emit('decoo', socket.handshake.session.username, socket.handshake.session.mdp, queue);

    console.log(queue);
    io.emit('isQueueOk', queue.length);
    io.emit('decoDansQueue', false);
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

        socket.on('autoFill', (couleur_session) => {
          game1.autoFill(couleur_session);
          io.emit('returnGrid', game1.grid);
          io.emit('Started', game1.started);
          io.emit('reload');
        });

        socket.on('play', (row, column, couleur_session) => {
          if (game1.end() != (1 || 2) && game1.end() != (3 || 4)) {
            game1.play(row, column, couleur_session);
            console.log("winner", game1.getWinner());
            console.log("enddd", game1.end());
            io.emit('returnGrid', game1.grid);
            io.emit('returnListBlue', game1.bluePlayerPionList);
            io.emit('returnListRed', game1.redPlayerPionList);
            io.emit('Started', game1.started);
            io.emit('getCurrentPlayer',game1.currentPlayer);
            io.emit('reload');
          }
          if (game1.end() == 4) {
            console.log("c'est bien un draw");
            io.emit('affichage_draw');

            let score = 30;


            let sql_nbrDraw = " SELECT score FROM resultats WHERE username= ?";

            let data = [user.handshake.session.username];

            connection.query(sql_nbrDraw, data, function (err, result) {
              if (err) throw err;
              let string = JSON.stringify(result);
              let json1 = JSON.parse(string);

              json1[0].score += score;

              let sql_update_score = " UPDATE resultats SET score=? WHERE username=?";

              let data_update_score = [json1[0].score, data];

              connection.query(sql_update_score, data_update_score, function (err, result) {
                if (err) throw err;
                console.log(result);
              });


            });
            let sql_nbrDraw2 = " SELECT score FROM resultats WHERE username= ?";
            let data2;
            let srvSockets = io.sockets.sockets;
            srvSockets.forEach(user => {
              if (user.handshake.session.username != data) {
                data2 = [user.handshake.session.username];
              }

            });
            connection.query(sql_nbrDraw2, data2, function (err, result) {
              if (err) throw err;
              let string = JSON.stringify(result);
              let json1 = JSON.parse(string);

              json1[0].score += score;

              let sql_update_score2 = " UPDATE resultats SET score=? WHERE username=?";

              let data_update_score2 = [json1[0].score, data2];

              connection.query(sql_update_score2, data_update_score2, function (err, result) {
                if (err) throw err;
              });
            });
          }
          if (game1.end() == (1 || 2) || game1.end() == (2 || 3)) {
            console.log("Le gagnant est", game1.getWinner());
            console.log("Fin du jeu");
            let score;
            if (game1.end() == 1 || game1.end() == 2) {
              score = 50;
            }
            if (game1.end() == 3) {
              score = 30;
              console.log("le score est 30 ");
            }
            let couleurWin = game1.getWinner();

            let srvSockets = io.sockets.sockets;
            srvSockets.forEach(user => {

              if (user.handshake.session.couleur == couleurWin) { // Si la couleur de la session est la meme que la couleur du vainqueur
                console.log("Le gagnant est :", user.handshake.session.username);

                //  On recup  le nbr de win puis on l'update avec +1, le score +50 idem

                let sql_nbrWin = " SELECT nb_win FROM resultats WHERE username= ?";
                io.emit('affichage_win', user.handshake.session.username);
                let data = [user.handshake.session.username];

                connection.query(sql_nbrWin, data, function (err, result) {
                  if (err) throw err;

                  let string = JSON.stringify(result);
                  let json1 = JSON.parse(string);

                  json1[0].nb_win += 1;

                  let sql_update_nbWin = " UPDATE resultats SET nb_win=? WHERE username=?";

                  let data_update_nbWin = [json1[0].nb_win, data];

                  connection.query(sql_update_nbWin, data_update_nbWin, function (err, result) {
                    if (err) throw err;
                  });


                });

                let sql_nbrScore = " SELECT score FROM resultats WHERE username= ?";
                let data2 = [user.handshake.session.username];

                connection.query(sql_nbrScore, data2, function (err, result) {
                  console.log("result et data ", result, data);
                  if (err) throw err;
                  let string = JSON.stringify(result);
                  let json1 = JSON.parse(string);
                  console.log("json ", json1[0].score, score);
                  json1[0].score += score;
                  console.log("json apres", json1[0].score, score);
                  let sql_update_score = " UPDATE resultats SET score=? WHERE username=?";

                  let data_update_score = [json1[0].score, data2];

                  connection.query(sql_update_score, data_update_score, function (err, result) {
                    if (err) throw err;
                  });


                });

              } else if (user.handshake.session.username != couleurWin) {  //Si la couleur est differente du vainqueur

                let data = [user.handshake.session.username];

                // On recup le nbr de loose puis on le rajoute plus 1, on change pas le score

                let sql_nbrLoose = " SELECT nb_loose FROM resultats WHERE username= ?";


                connection.query(sql_nbrLoose, data, function (err, result) {
                  if (err) throw err;

                  let string = JSON.stringify(result);
                  let json1 = JSON.parse(string);

                  json1[0].nb_loose += 1;


                  let sql_update_nbLoose = " UPDATE resultats SET nb_loose=? WHERE username=?";


                  let data_update_nbLoose = [json1[0].nb_loose, data];


                  connection.query(sql_update_nbLoose, data_update_nbLoose, function (err, result) {
                    console.log(result);
                    if (err) throw err;
                  });


                });
              }
            });
          }
        });
      }
    });



  });
  socket.on('disconnect', () => {
    //console.log('Un utilisateur s\'est déconnecté');

    //socket.disconnect();
    //io.emit('decoo', socket.handshake.session.username, socket.handshake.session.mdp, queue);
  });
  socket.on('decooo', (reason) => {
    if (reason == "io client disconnect") {
      console.log('Un utilisateur s\'est déconnecté');

      socket.disconnect();
      for (let i = 0; i < queue.length; i++) {
        if (queue[i] == socket.handshake.session.username) {
          queue.splice(i, 1);
        }
      }
      console.log(queue);
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