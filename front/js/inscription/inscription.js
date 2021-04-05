
let form = document.getElementById('InscritpionForm');
let input = document.getElementById('username');
let input_mdp = document.getElementById('mdp');
let input_mdp2 = document.getElementById('mdp2');

//Envoi de l'inscription via le module
form.addEventListener('submit', event => {
    event.preventDefault();
    ajax_inscritpion.sendInscription(input.value, input_mdp.value, input_mdp2.value);
});



