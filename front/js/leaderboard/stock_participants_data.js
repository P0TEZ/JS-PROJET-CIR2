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
    //Pas de prochaine ligne donc undefined a voir !!!!!
    function getUsername(index){
        return(data[index].username); 
    }
    function getNb_win(index){
        return(data[index].nb_win); 
    }
    function getNb_loose(index){
        return(data[index].nb_loose); 
    }
    function getTime(index){
        return (data[index].time);
    }
    

    return {
        setData: msg =>setData(msg),
        Username: index=>getUsername(index),
        Win: index=>getNb_win(index),
        Loose: index=>getNb_loose(index),
        Time: index=>getTime(index),
        Score: index=>getScore(index), 
    }

})(); 
/*
let Module_Stock2 = (function(){
    let data;
    
    function setData(msg) {
        data = msg;
        console.log(data);
    }

    function getUsername(index){
        console.log(data[index].username); 
        return(data[index].username); 
    }
 
    return {
        setData: msg =>setData(msg),
        Username: index=>getUsername(index),
    }
 
})();
*/
