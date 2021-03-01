let form = document.getElementById('InscritpionForm');
let input = document.getElementById('username');
let input_mdp = document.getElementById('mdp');
let input_mdp2 = document.getElementById('mdp2');



//Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    alert("ca marche"); 
    event.preventDefault();
    ajax_inscritpion.sendLogin(input.value, input_mdp.value, input_mdp2.value);
});
