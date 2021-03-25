

socket.emit('partie',''); 

console.log('testtest');
socket.on('coucou',msg=>{
    console.log('test2');
    console.log(msg); 
});