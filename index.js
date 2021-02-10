const express = require('express'); 
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); 

app.use(express.static(__dirname + '/back')); 

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/back/login/html/login.html');
}); 

io.on('connection', (socket)=> {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('Un eleve s\'est déconnecté');
    });
    
});

http.listen(4200, ()=>{
    console.log('serveur lance sur le port 4200 http://localhost:4200/ ;');
});

