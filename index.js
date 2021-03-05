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

  // Si l'utilisateur n'est pas connecté
  if (!sessionData.username) {
    // res.sendFile(__dirname + '/front/html/login.html');
    res.sendFile(__dirname + '/front/html/login.html');
   }else {
     res.sendFile(__dirname + '/front/html/login.html');
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
  
    //console.log(login);

    req.session.save()
    //res.redirect('/');


    let sql = "SELECT id FROM inscrit WHERE mdp= ? ";

    connection.query(sql, mdp, function (err, result) {
      if (err) throw err;

      //console.log(result);

      if (result.length == 0) {
        res.send('err_mdp'); //Votre mot de passe est incorrect
      } 
      else {

        // console.log('>> results: ', result );
        let string = JSON.stringify(result);
        //console.log('>> string: ', string );
        let json1 = JSON.parse(string);
        //console.log('>> json: ', json1);
        //console.log('>> VOICI L ID 1: ', json1[0].id);
        //req.list = json1;
        //console.log(json1); 

        if (typeof(json1[0].id)!='undefined') {
          //console.log("le mdp existe");
          //console.log(login);
          let sql2 = "SELECT id FROM inscrit WHERE username= ? ";

          connection.query(sql2, login, function (err, result2) {
            if (err) throw err;
            //sconsole.log(result2);
            if (result2.length == 0) {
              console.log("votre pseudo est incorrect");
              res.send('err_pseudo'); //Votre pseudo est incorrect
            }
            else {

              //console.log('>> results: ', result2 );
              let string = JSON.stringify(result2);
              //console.log('>> string: ', string );
              var json2 = JSON.parse(string);
              //console.log('>> json: ', json2);
              //console.log('>> VOICI L ID 2 : ', json2[0].id);
              //req.list = json2;

              if (typeof(json1[0].id)!='undefined') {
                //console.log("trest arret");
                // console.log("affichage de result ",result); 

                if (json1[0].id == json2[0].id) {
                  console.log("vous etes connecte");
                  
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
  console.log("test");
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

  const login = req.body.login
  const mdp = req.body.mdp
  const mdp2 = req.body.mdp2


  console.log(login);

  // Error management
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    //return res.status(400).json({ errors: errors.array() });
  } else {
    // Store login
    req.session.username = login;
    req.session.mdp = mdp;
    req.session.mdp2 = mdp2;


    //console.log(login);

    req.session.save()
    //res.redirect('/');

    if (mdp == mdp2) {
      console.log("les mdp sont pareils");
      
      let sql = "SELECT mdp FROM inscrit WHERE mdp= ? ";

  
      connection.query(sql, mdp, function (err, result) {
        if (err) throw err;

        console.log(result);

        if (result.length == 0) {
          console.log("continuer votre inscription");

          let sql = "SELECT username FROM inscrit WHERE username= ? ";

          connection.query(sql, login, function (err, result2) {
            if (err) throw err;

            console.log(result2);

            if (result2.length ==0){
              console.log("continuer tjr votre inscription");

              let sql="INSERT INTO inscrit SET username=?, mdp=? ";
              
              let data=[login,mdp]; 

              connection.query(sql, data, function (err, result) {
                if (err) throw err;

                console.log("vous etes inscrit dans la bdd"); 
                
              });


            } 
            else{
              console.log("votre login est deja pris")
            }
          });

        }
        else {
          console.log("votre mdp existe deja");
        }
      });
    }else{
      console.log("les mdp sont différents"); 
    }
  }
});



io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("login", () => {
    let srvSockets = io.sockets.sockets;
    srvSockets.forEach(user => {
      console.log(user.handshake.session.username);
    });
    let val = io.engine.clientsCount;
    if(val > 2) {
      val = val % 2;
    }
    io.emit('new-message', 'Utilisateur ' + socket.handshake.session.username + ' vient de se connecter');
    io.emit('search', val);

    io.emit('new-new-message', 'connexion ' + socket.handshake.session.username );

    //compte
    io.emit('user-message', socket.handshake.session.username );
    io.emit('mdp-message', socket.handshake.session.mdp );
  });

  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    //Envoie le message pour tous!
    io.emit('new-message2', socket.handshake.session.username + ' : ' + msg);
    //Autre alternative : envoyer le message à tous les autres socket ormis celui qui envoie
    //socket.broadcast.emit('new-message2', msg);
  });

  socket.on('disconnect', () => {
    console.log('Un eleve s\'est déconnecté');
    
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
});
