let ajax_inscritpion = (function(){

    function postLog(username,mdp,mdp2) {
        //console.log(username, mdp);
        $.ajax({
            type: "POST",
            url: "/inscription/",
            data: {
                login: username,
                mdp : mdp, 
                mdp2 : mdp2
            },
            success: (data) => {
                let page = document.body;
                let text = document.createElement('p');

                if(data == 'inscrit') {
                    text = document.createElement('p');
                    text.innerHTML = "Incription validée";
                    page.append(text);
                    console.log(data);
                }
                if(data == 'existe_login') {
                    text = document.createElement('p');
                    text.innerHTML = "Le username est déjà pris";
                    page.append(text);
                    console.log(data);
                }
                if(data == 'existe_mdp') {
                    text = document.createElement('p');
                    text.innerHTML = "Le mot de passe est déjà pris";
                    page.append(text);
                    console.log(data);
                }
                if(data == 'differents') {
                    text = document.createElement('p');
                    text.innerHTML = "Les mots de passe sont différents";
                    page.append(text);
                    console.log(data);
                }
            },
        }); 
    }

    return{ 
        sendLogin(username,mdp,mdp2){ 
            postLog(username,mdp,mdp2);
        } 
    } 
})();