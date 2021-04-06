module.exports = {
    gestionDrawJoueur1(connection, data, user, score) {
        //On recupère le score du joueur
        let sql_nbrDraw = " SELECT score FROM resultats WHERE username= ?";

        data = [user];

        connection.query(sql_nbrDraw, data, function (err, result) {
            if (err) throw err;

            let string = JSON.stringify(result);
            let json1 = JSON.parse(string);

            json1[0].score += score;
            //Update du score du joueur
            let sql_update_score = " UPDATE resultats SET score=? WHERE username=?";

            let data_update_score = [json1[0].score, data];

            connection.query(sql_update_score, data_update_score, function (err, result) {
                if (err) throw err;
                
            });


        });
    },
    gestionDrawJoueur2(connection, sql_nbrDraw2, data2, score) {
        connection.query(sql_nbrDraw2, data2, function (err, result) {
            if (err) throw err;

            let string = JSON.stringify(result);
            let json1 = JSON.parse(string);

            json1[0].score += score;

            let sql_update_score2 = " UPDATE resultats SET score=? WHERE username=?";

            let data_update_score2 = [json1[0].score, data2];

            connection.query(sql_update_score2, data_update_score2, function (err, result) {
                if (err) throw err;
            });
        });
    },
    gestionFlagJoueur1(couleurUser, username, connection, couleurWin, score) {
       
        // Si la couleur de la session est la meme que la couleur du vainqueur
        if (couleurUser == couleurWin) {

            //  On recup  le nbr de win puis on l'update avec +1
            let sql_nbrWin = " SELECT nb_win FROM resultats WHERE username= ?";
            
            let data = [username];

            connection.query(sql_nbrWin, data, function (err, result) {
                if (err) throw err;

                let string = JSON.stringify(result);
                let json1 = JSON.parse(string);

                json1[0].nb_win += 1;

                let sql_update_nbWin = " UPDATE resultats SET nb_win=? WHERE username=?";

                let data_update_nbWin = [json1[0].nb_win, data];

                connection.query(sql_update_nbWin, data_update_nbWin, function (err, result) {
                    if (err) throw err;
                });


            });

            //On recup score puis on l'update avec +50
            let sql_nbrScore = " SELECT score FROM resultats WHERE username= ?";

            connection.query(sql_nbrScore, data, function (err, result) {
                if (err) throw err;
                let string = JSON.stringify(result);
                let json1 = JSON.parse(string);

                json1[0].score += score;

                let sql_update_score = " UPDATE resultats SET score=? WHERE username=?";
                let data_update_score = [json1[0].score, data];

                connection.query(sql_update_score, data_update_score, function (err, result) {
                    if (err) throw err;
                });
            });
        }
    },
    gestionFlagJoueur2(user, connection) {
        let data = [user];

        // On recup le nbr de loose puis on ajoute +1, on change pas le score
        let sql_nbrLoose = " SELECT nb_loose FROM resultats WHERE username= ?";

        connection.query(sql_nbrLoose, data, function (err, result) {
            if (err) throw err;
            let string = JSON.stringify(result);
            let json1 = JSON.parse(string);

            json1[0].nb_loose += 1;

            let sql_update_nbLoose = " UPDATE resultats SET nb_loose=? WHERE username=?";
            let data_update_nbLoose = [json1[0].nb_loose, data];

            connection.query(sql_update_nbLoose, data_update_nbLoose, function (err, result) {
                if (err) throw err;
            });
        });
    }
}