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
            success: () => {
                window.location.href = "/";
            },
        }); 
    }

    return{ 
        sendLogin(username,mdp,mdp2){ 
            postLog(username,mdp,mdp2);
        } 
    } 
})();