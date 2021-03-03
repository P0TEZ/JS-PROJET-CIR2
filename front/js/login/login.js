let form = document.getElementById('loginForm');
let input = document.getElementById('username');
let input_mdp = document.getElementById('mdp');

//Envoi du login via le module de connexion
form.addEventListener('submit', event => {
    event.preventDefault();
    logger.sendLogin(input.value, input_mdp.value);
});