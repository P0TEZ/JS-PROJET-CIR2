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

  let sessionData = req.session;

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

      //Vérification si le mot de passe est correct
      if (result.length == 0) {
        res.send('err_mdp'); 
      } 
      else {
        let string = JSON.stringify(result);
        let json1 = JSON.parse(string);

        if (typeof(json1[0].id)!='undefined') {
          
          let sql2 = "SELECT id FROM inscrit WHERE username= ? ";

          connection.query(sql2, login, function (err, result2) {
            if (err) throw err;

            //Vérification si le pseudo est correct
            if (result2.length == 0) {
              console.log("votre pseudo est incorrect");
              res.send('err_pseudo'); 
            }
            else {
              let string = JSON.stringify(result2);
              var json2 = JSON.parse(string);

              if (typeof(json1[0].id)!='undefined') {
                if (json1[0].id == json2[0].id) {
                  req.session.username = login;
                  req.session.mdp = mdp;
                  res.send('ok');
                } 
              }
            }
          });
        }
      }
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
    
    req.session.username = login;
    req.session.mdp = mdp;
    req.session.mdp2 = mdp2;

    req.session.save()

    //Gestion du login et des mdp si les champs sont vides
    if((login && mdp && mdp2) != '') {
      if (mdp == mdp2) {

      let sql = "SELECT mdp FROM inscrit WHERE mdp= ? ";

      connection.query(sql, mdp, function (err, result) {
        if (err) throw err;
        console.log(result);

        //Verification si le mot de passe est disponible
        if (result.length == 0) {
          
          let sql = "SELECT username FROM inscrit WHERE username= ? ";

          connection.query(sql, login, function (err, result2) {
            if (err) throw err;
            console.log(result2);

            //Verification si le login est disponible
            if (result2.length ==0) {

              let sql="INSERT INTO inscrit SET username=?, mdp=? ";
              
              let data=[login,mdp]; 
              
              connection.query(sql, data, function (err, result) {
                if (err) throw err;

                console.log("Inscription d'un utilisateur dans la BDD"); 
                res.send('inscrit');
              });
            } 
            else{
              console.log("votre login est deja pris");
              res.send('existe_login');
            }
          });

        }
        else {
          console.log("votre mdp existe deja");
          res.send('existe_mdp');
        }
      });
      }else{
        console.log("les mdp sont différents"); 
        res.send('differents');
      }
    }else {
      res.send('null');
    }
  }
});



io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté');

  socket.on("login", () => {
    //let srvSockets = io.sockets.sockets;
    // srvSockets.forEach(user => {
    //   console.log(user.handshake.session.username);
    // });

    let val = io.engine.clientsCount; //Récupération du nombre d'utilisateur connecté sur la page leaderboard
    if(val > 2) {
      val = val % 2; //Actualisation de la file d'attente si il y a plus de 2 personnes sur le site
    }
    //Page Leaderboard
    io.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');
    io.emit('search', val);

    //Page Compte
    io.emit('show-user-username', socket.handshake.session.username ); //Affichage de l'username sur la page compte
    io.emit('show-user-mdp', socket.handshake.session.mdp ); //Affichage du mot de passe sur la page compte
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
