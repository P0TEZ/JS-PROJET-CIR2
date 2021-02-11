const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');

app.use(express.static(__dirname + '/back'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/html/login.html');
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

db.connect(err => {
    if (err) throw err;
    else {
        console.log("connexion effectue");
    }
    let id = '0';
    let username = "sam";
    let mdp = "123";

    let data = [id, username, mdp];

    connection.query("INSERT INTO inscrit SET id =?, username=?, mdp=?", data, (err, rslt, field) => {
        if (err) throw err;
        console.log(rslt);
    });
});


