// MODULE POUR RECUP LES DONNEES 

let Module_Stock = (function(){
    const data= joueurs; 

    //console.log(data[0].username);

    function getScore(index){
        console.log(data[index].score); 
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
    function getTime(index){
        return (data[index].time);
    }
    

    return {
        Username: index=>getUsername(index),
        Win: index=>getNb_win(index),
        Loose: index=>getNb_loose(index),
        Time: index=>getTime(index),
        Score: index=>getScore(index), 
    }

})(); 