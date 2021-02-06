// let form = document.getElementById('loginForm');
// let input = document.getElementById('username');

// //Envoi du login via le module de connexion
// form.addEventListener('submit', event => {
//     event.preventDefault();
//     logger.sendLogin(input.value);
// });

//petit soucie le form ne fonctionne plus


// MODIF QUE J AI FAITE

function dbconnect(){

  let mysql = require('mysql');

  let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'stratego'
});

connection.connect();

return connection; 


}


function InsertPerson(){

  let db =dbconnect();



  let id ='0';
  let username ="sam";
  let mdp="123"; 

  let data =[id, username,mdp];

  db.query("INSERT INTO inscrit SET id =?, username=?, mdp=?", data, (err,user, field)=>{
  });
}

InsertPerson(); 