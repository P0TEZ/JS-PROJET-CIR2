module.exports={

    print(queue) {
        console.log(queue);
    },
    pushToQueue(queue, sessionData) {
        queue.push(sessionData.username);
    },

}