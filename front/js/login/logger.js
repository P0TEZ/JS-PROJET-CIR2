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
                let text1 = document.getElementById('erreur_mdp');

                if(data == 'ok') {
                    window.location.href = "/leaderboard"; 
                }
                if(data == 'err_mdp' || data == 'err_pseudo' ) {
                    text1.innerHTML = "";
                    text1.innerHTML = "Votre mot de passe ou votre pseudo est incorrect";
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