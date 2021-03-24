module.exports = {
    printServerStatus() {
        //console.log('Server ok');
    },
    printProfStatus() {
        //console.log('Need Coffee');
    },
    verifMdp(connection, req, res, result, login, mdp) {
        //Vérification si le mot de passe est correct
        if (result.length == 0) {
            res.send('err_mdp'); 
        } else {
            this.verifPseudo(connection, req, res, result, login, mdp);
        }
    },
    verifPseudo(connection, req, res, result, login, mdp) {
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
}
