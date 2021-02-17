const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');

app.use(express.static(__dirname + '/front/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/html/login.html');
});
app.post('/login', body('login').isLength({ min: 3 }).trim().escape(), (req, res) => {
    
    const login = req.body.login
    const mdp = req.body.mdp
    
    // Error management
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      //return res.status(400).json({ errors: errors.array() });
    } else {
      // Store login
      req.session.username = login;
      req.session.mdp = mdp; 
      req.session.save()
      res.redirect('/');
 
    }

  });


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('Un eleve s\'est déconnecté');
    });

});

http.listen(4222, () => {
    console.log('serveur lance sur le port 4200 http://localhost:4222/ ;');
});


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
    let username = socket.handshake.session.username;
    let mdp = socket.handshake.session.mdp;

    let data = [id, username, mdp];

    connection.query("INSERT INTO inscrit SET id =?, username=?, mdp=?", data, (err, rslt, field) => {
        if (err) throw err;
        console.log(rslt);
    });
});
