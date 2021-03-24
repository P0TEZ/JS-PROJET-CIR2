// MODULE POUR CREER LE TABLEAU 

let create_tab_data = (function(){
    function firstline(){
        let titre = ["pseudo","Time","Score","Win","Loose"];
         
        let linelemnt = document.createElement("tr");
        
        for(let i = 0; i < titre.length; i++) {
            let line2 = document.createElement("th");
            let text = document.createTextNode(titre[i]);
            line2.appendChild(text);
            linelemnt.appendChild(line2);
        }
        return linelemnt;
    }
    return{
        draw(msg) {
            let tab = document.createElement("table");
            tab.appendChild(firstline());
            
            for(let i=0; i<msg.length;i++){
                tab.appendChild(create_line.getLine(i));
            }
            return tab; 
        }
    }
}) (); 