let logger = (function(){

    function postLog(username,mdp) {
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username,
                mdp : mdp,
                couleur: "none",
            },
            success: (data) => {
                let page = document.body;
                let text1 = document.getElementById('erreur_mdp');
                let text2 = document.getElementById('erreur_name');

                if(data == 'ok') {
                    window.location.href = "/leaderboard"; 
                }
                if(data == 'err_mdp') {
                    text1.innerHTML = "Votre mot de passe est incorrect";
                    page.append(text1);
                    console.log(data);
                }
                if(data == 'err_pseudo') {
                    text2.innerHTML = "Votre pseudo est incorrect";
                    page.append(text2);
                    console.log(data);
                }
            },
        }); 
    }

    return{ 
        sendLogin(username,mdp){ 
            postLog(username,mdp);
        } 
    } 
})();