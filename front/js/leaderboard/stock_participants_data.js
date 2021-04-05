// MODULE POUR RECUP LES DONNEES 

let Module_Stock = (function(){
    let data;
    
    function setData(msg) {
        data = msg;
        return data;
    }

    function getScore(index){
        return (data[index].score);
    }
    function getUsername(index){
        return(data[index].username); 
    }
    function getNb_win(index){
        return(data[index].nb_win); 
    }
    function getNb_loose(index){
        return(data[index].nb_loose); 
    }
    

    return {
        setData: msg =>setData(msg),
        Username: index=>getUsername(index),
        Win: index=>getNb_win(index),
        Loose: index=>getNb_loose(index),
        Score: index=>getScore(index), 
    }

})();
