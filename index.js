const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false });

const states = require('./back/modules/states');
const Theoden = require('./back/models/Theoden');
const sharedsession = require("express-socket.io-session");
const { body, validationResult } = require('express-validator');
const fs = require('fs');

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

  let sessionData = req.session;

  // Test des modules 
  states.printServerStatus();
  states.printProfStatus();
  let test = new Theoden();

  // Si l'utilisateur n'est pas connecté
  if (!sessionData.username) {
    // res.sendFile(__dirname + '/front/html/login.html');
    res.sendFile(__dirname + '/front/html/inscription.html');
  } else {
    res.sendFile(__dirname + '/front/html/index.html');
  }

});

///////////////////////////////////////////////////
// VERIFIE SI IL EST BIEN DANS LA BDD /////////////
///////////////////////////////////////////////////

app.post('/login', urlencodedparser, (req, res) => {

  const login = req.body.login
  const mdp = req.body.mdp

  //console.log(login, mdp);

  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    req.session.username = login;
    req.session.mdp = mdp;

    //console.log(login);

    req.session.save()
    res.redirect('/');


    let sql = "SELECT id FROM inscrit WHERE mdp= ? ";

    connection.query(sql, mdp, function (err, result) {
      if (err) throw err;

      //console.log(result);

      if (result.length == 0) console.log("votre mdp est incorrect");
      else {

        // console.log('>> results: ', result );
        let string = JSON.stringify(result);
        //console.log('>> string: ', string );
        let json1 = JSON.parse(string);
        //console.log('>> json: ', json1);
        //console.log('>> VOICI L ID 1: ', json1[0].id);
        //req.list = json1;
        //console.log(json1); 

        if (json1[0].id) {
          //console.log("le mdp existe");
          //console.log(login);
          let sql2 = "SELECT id FROM inscrit WHERE username= ? ";

          connection.query(sql2, login, function (err, result2) {
            if (err) throw err;
            //console.log(result2);
            if (result2.length == 0) console.log("votre pseudo est incorrect");
            else {

              //console.log('>> results: ', result2 );
              let string = JSON.stringify(result2);
              //console.log('>> string: ', string );
              var json2 = JSON.parse(string);
              //console.log('>> json: ', json2);
              //console.log('>> VOICI L ID 2 : ', json2[0].id);
              //req.list = json2;

              if (json2[0].id) {
                //console.log("trest arret");
                // console.log("affichage de result ",result); 

                if (json1[0].id == json2[0].id) {
                  console.log("vous etes connecte");
                } else {
                  console.log("il y a une erreur dans votre authentification");
                }

              }
            }
          });
        }
      }
    });
  }

});

// AJOUT D'UNE PERSONNE DANS LA BDD

app.post('/inscription',urlencodedparser, (req, res) => {

  const login = req.body.login
  const mdp = req.body.mdp
  const mdp2 = req.body.mdp2

  console.log(login);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  }else {
    // Store login
    req.session.username = login;
    req.session.mdp = mdp;
    req.session.mdp2 = mdp2;

    //console.log(login);

    req.session.save()
    res.redirect('/');

    let sql1="SELECT username FROM inscrit WHERE "


  }




});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("login", () => {
    let srvSockets = io.sockets.sockets;
    srvSockets.forEach(user => {
      console.log(user.handshake.session.username);
    });
    //io.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');
  });

  socket.on('disconnect', () => {
    console.log('Un eleve s\'est déconnecté');
  });

});

http.listen(4254, () => {
  console.log('serveur lance sur le port 4256 http://localhost:4254/ ;');
});


// connexion a la bdd 

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stratego'
});

connection.connect(err => {
  if (err) throw err;
  else {
    console.log("connexion effectue");
  }
  let id = '0';
  let username = "yop";
  let mdp = "ere";

  let data = [id, username, mdp];

  connection.query("INSERT INTO inscrit SET id =?, username=?, mdp=?", data, (err, rslt, field) => {
    if (err) throw err;
    console.log(rslt);
  });
});
