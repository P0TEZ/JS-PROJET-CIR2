let ajax_inscritpion = (function(){

    function postLog(username,mdp,mdp2) {
        $.ajax({
            type: "POST",
            url: "/inscription/",
            data: {
                login: username,
                mdp : mdp, 
                mdp2 : mdp2
            },
            //Affichage des différentes informations en fonction du success ou non de la requete ajax
            success: (data) => {
                let page = document.body;
                let text = document.getElementById('valide'); 
                let text1 = document.getElementById('erreur_mdp');
                let text2 = document.getElementById('erreur_name');
                let text3 = document.getElementById('erreur_diff');
                let text4 = document.getElementById('erreur_correct');


                if(data == 'inscrit') {
                    //text = document.createElement('p');
                    text.innerHTML = "";
                    text.innerHTML = "Incription validée";
                    //text.id = 'validé';
                    console.log(data);
                }
                if(data == 'existe_login') {
                    text.innerHTML = "";
                    text2.innerHTML = "Le username est déjà pris";
                    console.log(data);
                }
                if(data == 'existe_mdp') {
                    text.innerHTML = "";
                    text1.innerHTML = "Le mot de passe est déjà pris";
                    console.log(data);
                }
                if(data == 'differents') {
                    text.innerHTML = "";
                    text3.innerHTML = "Les mots de passe sont différents";
                    console.log(data);
                }
                if(data == 'null') {
                    text.innerHTML = "";
                    text4.innerHTML = "Merci de remplir correctement l'inscription";
                    console.log(data);
                }
            },
        }); 
    }

    return{ 
        sendInscription(username,mdp,mdp2){ 
            postLog(username,mdp,mdp2);
        } 
    } 
})();