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
            success: () => {
                window.location.href = "/";
            },
        }); 
    }

    return{ 
        sendLogin(username,mdp){ 
            postLog(username,mdp);
        } 
    } 
})();