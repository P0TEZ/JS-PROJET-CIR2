let logger = (function(){

    function postLog(username,mdp) {
        //console.log(username, mdp);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username,
                mdp : mdp
            },
            success: (data) => {
                if(data == 'ok') {
                    window.location.href = "/leaderboard";
                }
                else {
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