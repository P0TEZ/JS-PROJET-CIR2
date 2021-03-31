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
                let text = document.createElement('p');

                if(data == 'ok') {
                    window.location.href = "/leaderboard";
                }
                if(data == 'err_mdp') {
                    text = document.createElement('p');
                    text.id = 'erreur';
                    text.innerHTML = "Votre mot de passe est incorrect";
                    page.append(text);
                    console.log(data);
                }
                if(data == 'err_pseudo') {
                    text.innerHTML = "Votre pseudo est incorrect";
                    text.id = 'erreur';
                    page.append(text);
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