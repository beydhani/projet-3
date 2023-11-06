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
        //Je vérifie si le bouton est cliquable avec checkButtonState()
        this.checkButtonState();
        //J'ajoute un eventListener pour appeler checkButtonState() quand il y a un input dans mes champs d'input
        this.nomInput.addEventListener("input", () => this.checkButtonState());
        this.prenomInput.addEventListener("input", () => this.checkButtonState());
        // J'ajoute un écouteur d'évennement au bouton de soumission du formulaire pour cacher ce dernier et la map et afficher le canvas
        this.submitButton.addEventListener("click", (e) => {
            //j'utilise preventDefault() pour empêcher le comportement par défaut du bouton de soumission du formulaire.
            e.preventDefault();
            //Si le bouton est cliquable, on fait les modifications.
            if (this.isButtonClickable) {
                var form = document.getElementById('reservation-form');
                var map = document.getElementById('map');
                var canvas = document.getElementById('canvas-popup');
                canvas.style.display = 'flex';
                map.style.pointerEvents = 'none';
                map.style.opacity = '0.8';
                form.style.pointerEvents = 'none';
                form.style.opacity = '0.8';
            }
        });
        //Pareil pour le bouton de confirmation du canvas. 
        //J'ai mis cette instruction ici car elle appelle la méthode displayUserInfo qui est une méthode de cette classe.
        this.confirmationButton.addEventListener("click", (e) => {
            var canvas = document.getElementById('canvas-popup');
            canvas.style.display = 'none';
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
// EventListener sur le bouton_annuler  avec une fonction fléchée qui reload la page quand on clique.
document.getElementById('bouton_annuler').addEventListener('click', (e)=> {
    location.reload();
});
