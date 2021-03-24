module.exports = {
    verifLoginMdp(connection, req, res, login, mdp, mdp2) {
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

        //Verification si le mot de passe est disponible
        if (result.length == 0) {
          
          let sql = "SELECT username FROM inscrit WHERE username= ? ";

          connection.query(sql, login, function (err, result2) {
            if (err) throw err;

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
}