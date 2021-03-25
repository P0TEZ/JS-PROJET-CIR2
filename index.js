const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false });


const verifInscription = require('./back/modules/verifInscription');
const states = require('./back/modules/states');
const Theoden = require('./back/models/Theoden');
const pion = require('./back/models/classPion');
const observable = require('./back/models/Observable');
const gameplay = require('./back/models/classGameplay');
const gameplayview = require('./back/models/gameplayview');



const sharedsession = require("express-socket.io-session");
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const { count } = require('console');

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
  states.printServerStatus();
  states.printProfStatus();
  let test = new Theoden();

  if(sessionData.username) {
    res.sendFile(__dirname + '/front/html/leaderboard.html');
  }else {
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
    verifInscription.verifLoginMdp(connection,req, res, login, mdp, mdp2);
  }
});

app.get('/partie', (req, res) => {
  let sessionData = req.session;


  let game_1 = new Gameplay();
  let partie_1 = new Gameplayview(game_1,'game_1View');
  partie_1.grilleReload();

  console.log(Theoden_modulePion.getAllPiece());

  window.onresize = partie_1.grilleResize();

});

io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté');

  socket.on("login", () => {

    let srvSockets = io.sockets.sockets;
    let count =0; 
    srvSockets.forEach(user => {
      console.log(user.handshake.session.username);
      if(user.handshake.session.username){
        count++;

      }
    });

    //Récupération du nombre d'utilisateur connecté sur la page leaderboard
    console.log("avant if", count);
    if(count > 2 && count%2 !=0) {
      count = count % 2; //Actualisation de la file d'attente si il y a plus de 2 personnes sur le site
    }else if( count%2 == 0){
      while (count >2){
        count -=2;
      }
    }
    console.log("apres if", count);

    //Page Leaderboard
    io.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');
    io.emit('search', count);

    //Page Compte
    io.emit('show-user-username', socket.handshake.session.username ); //Affichage de l'username sur la page compte
    io.emit('show-user-mdp', socket.handshake.session.mdp ); //Affichage du mot de passe sur la page compte

    let sql="SELECT * FROM resultats ORDER BY `resultats`.`score`";
    connection.query(sql, function (err, result) {
      if (err) throw err; 
      socket.emit('resultats-leaderboard',result);
    });
  });

  socket.on('message', (msg) => {
    //Affichage en console
    console.log('message: ' + msg);
    //Envoie le message pour tous, Affichage du chat sur la page leaderboard
    io.emit('new-message2', socket.handshake.session.username + ' : ' + msg);
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
    
    // if (socket) {
    //   // delete session object
    //   console.log("req session");
    //   socket.handshake.session.destroy(function(err) {
    //       if(err) {
    //           return next(err);
    //       } else {
    //         socket.handshake.session = null;
    //           console.log("logout successful");
    //           //return res.sendFile(__dirname + '/front/html/login.html');
    //           io.emit('deco', 1);
    //       }
    //   });
    //}  
  });

});

//INSERTION TAB RESULT FICHIER JSON

fs.readFile(__dirname + '/front/js/leaderboard/resultats.json', (err,data) => {
  if(err) throw err;

  const results = JSON.parse(data);
  
  let sql="SELECT * FROM resultats ORDER BY `resultats`.`score`";
  connection.query(sql, function (err, result) {
    if (err) throw err; //console.log(result);
    results.joueurs.splice(0,100); //Affiche que les 100 premiers
    results.joueurs = result;

    let mydatas = JSON.stringify(results, null, 2);

    fs.writeFile(__dirname + '/front/js/leaderboard/resultats.json', mydatas, (err)  => {
      if(err) throw err;
    });
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