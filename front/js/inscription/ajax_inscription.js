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
                let text = document.createElement('p');

                if(data == 'inscrit') {
                    text = document.createElement('p');
                    text.innerHTML = "Incription validée";
                    text.id = 'validé';
                    page.append(text);
                    console.log(data);
                }
                if(data == 'existe_login') {
                    text = document.createElement('p');
                    text.innerHTML = "Le username est déjà pris";
                    text.id = 'erreur';
                    page.append(text);
                    console.log(data);
                }
                if(data == 'existe_mdp') {
                    text = document.createElement('p');
                    text.innerHTML = "Le mot de passe est déjà pris";
                    text.id = 'erreur';
                    page.append(text);
                    console.log(data);
                }
                if(data == 'differents') {
                    text = document.createElement('p');
                    text.innerHTML = "Les mots de passe sont différents";
                    text.id = 'erreur';
                    page.append(text);
                    console.log(data);
                }
                if(data == 'null') {
                    text = document.createElement('p');
                    text.innerHTML = "Merci de remplir correctement l'inscription";
                    text.id = 'erreur';
                    page.append(text);
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