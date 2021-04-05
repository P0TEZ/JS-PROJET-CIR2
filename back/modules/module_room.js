module.exports={
    //Vérification si l'utilisateur est deja dans la queue
    isInRoom(queue, sessionData) {
        for(let i  = 0; i < queue.length; i++) {
            if(queue[i] == sessionData.username) {
                return 1;
            }
        }
        return 0;
    },
    //Affichage de la queue
    print(queue) {
        console.log(queue);
    },
    //Insertion d'une personne dans la queue
    pushToQueue(couleur, queue, req) {
        let sessionData = req.session;
        if(sessionData.username != undefined) {
            queue.push(sessionData.username);
            if(queue.length == 1) {
                sessionData.couleur = "red";
            }else {
                sessionData.couleur = "blue";
            }
            
        }
        
    },
    //Suppression de la queue
    deleteQueue(queue) {
        if(queue.length >= 2) {
            for(let i  = 0; i < queue.length; i++) {
                queue.splice(i,2);
            } 
        }
    },
}