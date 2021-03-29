module.exports={
    isInRoom(queue, sessionData) {
        for(let i  = 0; i < queue.length; i++) {
            if(queue[i] == sessionData.username) {
                console.log("deja dans la room");
                return 1;
            }
        }
        return 0;
    },
    print(queue) {
        console.log(queue);
    },
    pushToQueue(queue, req) {
        let sessionData = req.session;
        if(sessionData.username != undefined) {
            queue.push(sessionData.username);
        }
        
    },
    deleteQueue(queue) {
        if(queue.length >= 2) {
            for(let i  = 0; i < queue.length; i++) {
                queue.splice(i,2);
            } 
        }
    },
}