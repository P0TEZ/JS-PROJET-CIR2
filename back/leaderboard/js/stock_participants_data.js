let Module_Stock = (function(){
    const data= joueurs; 

    console.table(data);

    function getScore(){
        return (data[index].score);
    }
    function getUsername(){
        return(data[index].username); 
    }
    function getNb_win(){
        return(data[index].nb_win); 
    }
    function getNb_loose(){
        return(data[index].nb_loose); 
    }
    function getTime(){
        return (data[index].time);
    }
    

    return {
        username: index=>getUsername(index),
        win: index=>getNb_win(index),
        loose: index=>getNb_loose(index),
        time: index=>getTime(index),
        score: index=>getScore(index), 
    }

})(); 