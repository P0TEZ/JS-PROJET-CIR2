socket.emit('partie',''); 

console.log('testtest');
socket.on('coucou',msg=>{
    console.log('test2');
    console.log(msg); 
});

socket.on('grilleSetter', (partie1) => {
    /*console.log("grille");
    socket.on('test',()=>{
        console.log("test"); 
    });*/
    console.log(partie1);
}); 

