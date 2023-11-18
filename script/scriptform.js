// La classe UserForm
class UserForm {
    constructor() { 
        // Je commence par référencer tous les éléments de la page dont j'ai besoin dans le constructor()
        this.nomInput = document.getElementById("nom");
        this.prenomInput = document.getElementById("prenom");
        this.nomDisplay = document.getElementById("nom-display");
        this.prenomDisplay = document.getElementById("prenom-display");
        this.submitButton = document.getElementById("submit-button");
        this.confirmationButton = document.getElementById('confirmation-canvas');
        this.isButtonClickable = false;
        //J'utilise storedNom pour stocker le nom à l'aide de localStorage.
        // LocalStorage > sessionStorage parce que ça va conserver l'info même après la fermeture du navigateur.
        const storedNom = localStorage.getItem("nom");
        //Si localStorage à stocké storedNom je préremplis l'input correspondant
        if (storedNom) {
            this.nomInput.value = storedNom;
        }
        //Pareil pour le prénom
        const storedPrenom = localStorage.getItem("prenom");
        if (storedPrenom) {
            this.prenomInput.value = storedPrenom;
        }
        //J'utilise cette ligne pour conserver l'état du bouton de confirmation même après avoir rechargé la page
        this.confirmationButtonClicked = sessionStorage.getItem('confirmationButtonClicked') === 'true';
        // Si j'ai un nom et un prénom dans mon Local Storage et que le bouton de confirmation est cliqué je les affiche 
        if (localStorage.getItem("nom") && localStorage.getItem("prenom") && this.confirmationButtonClicked) {
            this.displayUserInfo();
        }
        // Ici je déclare des variables pour manipuler mon css.
        var form = document.getElementById('reservation-form');
        var map = document.getElementById('map');
        var canvas = document.getElementById('canvas-popup');
        // S'il y a des infos dans mes champs d'infos vélo et que le bouton de confirmation a été cliqué.
        if (sessionStorage.getItem('nomStation') && this.confirmationButtonClicked) {
            map.style.pointerEvents = 'none'; //On peut plus cliquer sur la map
            map.style.opacity = '0.8'; //Elle a une opacité moindre
            form.style.pointerEvents = 'none'; //On ne peut plus cliquer sur le formulaire
            form.style.opacity = '0.8'; // Il a une opacité moindre
            
        }
        //Je vérifie si le bouton de reservation est cliquable avec checkButtonState()
        this.checkButtonState();
        //J'ajoute un eventListener pour appeler checkButtonState() quand il y a un input dans mes champs d'input
        this.nomInput.addEventListener("input", () => this.checkButtonState());
        this.prenomInput.addEventListener("input", () => this.checkButtonState());
        // J'ajoute un écouteur d'évennement au bouton de soumission du formulaire pour cacher ce dernier et la map et afficher le canvas
        this.submitButton.addEventListener("click", (e) => {
            //j'utilise preventDefault() pour empêcher le comportement par défaut du bouton de soumission du formulaire.
            e.preventDefault();
            
            //Si le bouton de réservation est cliquable, on fait les modifications css.
            // On ajoute aussi la condition que les informations de stations soient disponibles pour éviter qu'un utilisateur manipule 
            // Le CSS pour faire une réservation vide. 
            if (this.isButtonClickable && sessionStorage.getItem('nomStation')) {
                canvas.style.display = 'flex';
                map.style.pointerEvents = 'none';
                map.style.opacity = '0.8';
                form.style.pointerEvents = 'none';
                form.style.opacity = '0.8';
            }
        });
        //Pareil pour le bouton de confirmation du canvas. S'il est cliqué je cache le canvas et 
        // je met confirmationButtonClicked = true avec sessionStorage
        this.confirmationButton.addEventListener("click", (e) => {
            canvas.style.display = 'none';
            sessionStorage.setItem('confirmationButtonClicked', 'true');
            this.displayUserInfo();
        });
    }

    checkButtonState() { //Méthode pour activer le bouton si les champs nom et prénom sont remplis
        //On store la valeur des champs nom et prénom dans des constantes
        const nom = this.nomInput.value;
        const prenom = this.prenomInput.value;
        //On utilise trim() pour garder le nom et le prénom sans espaces et on rends le bouton cliquable en mettant le booléan à True si
        // nom et prenom ne sont pas vides.
        this.isButtonClickable = nom.trim() !== "" && prenom.trim() !== "";
        //Si le boolean est faux le bouton reste .disabled sinon il devient cliquable
        this.submitButton.disabled = !this.isButtonClickable;
    }

    displayUserInfo() { // Dans le user-info on remplit le nom et le prénom avec la valeur de l'input
        
        const nom = this.nomInput.value;
        const prenom = this.prenomInput.value;

        this.nomDisplay.textContent = nom;
        this.prenomDisplay.textContent = prenom;
        //On enregistre dans localStorage avec la méthode setItem()

        localStorage.setItem("nom", nom);
        localStorage.setItem("prenom", prenom);
    }
}
//Crée nouvelle instance de classe
const userForm = new UserForm(); 
// EventListener sur le bouton_annuler  avec une fonction fléchée qui reload la page quand on clique et efface les données de sessionStorage.
document.getElementById('bouton_annuler').addEventListener('click', (e)=> {
    sessionStorage.clear();
    location.reload();
});
