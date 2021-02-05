var mysql = require('mysql');

var db = mysql.createConnection({

   host: "localhost",

   user: "nom_utilisateur",

   password: "mot_de_passe_utilisateur"

 });

 db.connect(function(err) {

   if (err) throw err;

   console.log("Connecté à la base de données MySQL!");

  db.query("CREATE DATABASE mabdd", function (err, result) {

       if (err) throw err;

       console.log("Base de données créée !");

     });

 });