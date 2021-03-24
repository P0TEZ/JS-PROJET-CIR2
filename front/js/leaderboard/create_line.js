//MODULE DANS LEQUEL LES LIGNES VONT ETRE CREEE

let create_line =(function (){
    
    function username(index){
       let  lineUser =document.createElement("th"); 
       let name1 = document.createTextNode(Module_Stock.Username(index)); 
       lineUser.appendChild(name1); 
       return lineUser;
    }
    function time(index){
        let  lineUser =document.createElement("th"); 
        let name1 = document.createTextNode(Module_Stock.Time(index)); 
        lineUser.appendChild(name1); 
        return lineUser;
    }

    function score(index){
        let  lineUser =document.createElement("th"); 
        let name1 = document.createTextNode(Module_Stock.Score(index)); 
        lineUser.appendChild(name1); 
        return lineUser;
    }

    function win(index){
        let  lineUser =document.createElement("th"); 
        let name1 = document.createTextNode(Module_Stock.Win(index)); 
        lineUser.appendChild(name1); 
        return lineUser;
    }

    function loose(index){
        let  lineUser =document.createElement("th"); 
        let name1 = document.createTextNode(Module_Stock.Loose(index)); 
        lineUser.appendChild(name1); 
        return lineUser;
    }

    return{
        getLine(index){
            let line = document.createElement("tr"); 
            line.appendChild(username(index));
            line.appendChild(time(index));
            line.appendChild(score(index));
            line.appendChild(win(index));
            line.appendChild(loose(index));
            return line; 
        }
    }
}) ();
