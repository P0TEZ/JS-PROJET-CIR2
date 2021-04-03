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
                let text1 = document.getElementById('erreur_mdp');
                let text2 = document.getElementById('erreur_name');
                let text3 = document.getElementById('erreur_diff');
                let text4 = document.getElementById('erreur_correct');


                if(data == 'inscrit') {
                    text = document.createElement('p');
                    text.innerHTML = "Incription validée";
                    text.id = 'validé';
                    page.append(text);
                    console.log(data);
                }
                if(data == 'existe_login') {
                    text2.innerHTML = "Le username est déjà pris";
                    page.append(text2);
                    console.log(data);
                }
                if(data == 'existe_mdp') {
                    text1.innerHTML = "Le mot de passe est déjà pris";
                    page.append(text1);
                    console.log(data);
                }
                if(data == 'differents') {
                    text3.innerHTML = "Les mots de passe sont différents";
                    page.append(text3);
                    console.log(data);
                }
                if(data == 'null') {
                    text4.innerHTML = "Merci de remplir correctement l'inscription";
                    page.append(text4);
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