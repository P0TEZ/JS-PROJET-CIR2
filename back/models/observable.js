class Observable{

    constructor(){
        this.callBacks = [];
    }

    on(eventName, callback){

        //Si il n'y pas deja un element du meme nom 
        if(this.callBacks.findIndex(aCallback =>{return eventName === aCallback.name}) === -1){
            this.callBacks.push(new event(eventName,callback));
        }
    }

    off(eventName, callback){

        //On cherche l'indice dans le tableau où est situé ce callback
        const removeIndex = this.callBacks.findIndex(aCallback => {
            return eventName === aCallback.name;
        });

        //si l'indice !=1 <=> l'element existe
        if (removeIndex !== -1){
            this.callBacks.splice(removeIndex, 1);
        }
    }

    trigger(eventName, ...parameter){

        //On cherche l'indice dans le tableau où est situé ce callback
        const index = this.callBacks.findIndex(aCallback => {
            return eventName === aCallback.name;
        });

        //si l'indice !=1 <=> l'element existe
        if (index !== -1){
            this.callBacks[index].fonction(...parameter);
        }
    }
}

class event{//class qui fait le lien entre un nom et un callback

    constructor(eventName,callback){
        this.name = eventName;
        this.fonction = callback;
    }

}

module.exports = Observable;